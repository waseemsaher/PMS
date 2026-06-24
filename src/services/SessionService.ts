import { getDatabase } from '../database/database';
import { CustomerRepository } from '../database/repositories/CustomerRepository';
import { SessionRepository } from '../database/repositories/SessionRepository';
import { HistoryRepository } from '../database/repositories/HistoryRepository';
import { DashboardRepository } from '../database/repositories/DashboardRepository';
import { RentalRepository } from '../database/repositories/RentalRepository';
import { Session, Customer, SessionRental, PaymentStatus } from '../models/types';
import dayjs from 'dayjs';

export class SessionService {
  /**
   * Finishes an active session.
   * Follows the exact transaction flow from the PRD.
   */
  static async finishSession(sessionId: number): Promise<void> {
    const db = await getDatabase();
    
    // Using explicit runAsync since expo-sqlite provides execAsync or runAsync
    // expo-sqlite next supports withTransactionAsync
    await db.withTransactionAsync(async () => {
      // 1. Fetch Session
      const session = await db.getFirstAsync<Session>('SELECT * FROM Sessions WHERE id = ?', [sessionId]);
      if (!session) throw new Error('Session not found');

      // 2. Fetch Customer
      const customer = await CustomerRepository.getCustomerById(session.customer_id);
      if (!customer) throw new Error('Customer not found');

      // 3. Fetch Rentals
      const rentals = await RentalRepository.getRentalsForSession(sessionId);

      // 4. Calculate actual duration and final price
      const currentTimestamp = dayjs().unix();
      const actualDuration = Math.round((currentTimestamp - session.start_timestamp) / 60);
      
      let totalAmount = session.total_amount || 0;
      let hoursAmount = 0;

      if (session.is_open_session) {
        // Calculate price based on actual time for OPEN sessions
        const settingsResult = await db.getFirstAsync<any>('SELECT hour_price FROM Settings WHERE id = 1');
        if (settingsResult && settingsResult.hour_price) {
          hoursAmount = (settingsResult.hour_price / 60) * actualDuration;
        }
        totalAmount += hoursAmount;
      } else {
        // For fixed sessions, the hours amount was included in total_amount
        const extrasAmount = rentals.reduce((sum, r) => sum + (r.price * r.quantity), 0);
        hoursAmount = Math.max(0, totalAmount - extrasAmount);
      }

      // If the session is finished, we assume any unpaid balance is now fully paid at checkout.
      const finalHoursPaid = hoursAmount;
      const finalExtrasPaid = extrasAmount;
      session.payment_status = 'PAID';

      // 5. Insert into History
      await HistoryRepository.createHistoryRecord({
        customer_name: customer.full_name,
        people_count: customer.people_count,
        session_type: session.session_type,
        start_timestamp: session.start_timestamp,
        finish_timestamp: currentTimestamp,
        booked_duration: session.duration_minutes,
        actual_duration: actualDuration,
        rentals_json: JSON.stringify(rentals),
        notes: customer.notes,
        payment_status: session.payment_status,
        total_amount: totalAmount,
        hours_amount_paid: finalHoursPaid,
        extras_amount_paid: finalExtrasPaid,
      });

      // 6. Delete Active Session
      await SessionRepository.deleteSession(sessionId);

      // 7. Delete Active Customer
      await CustomerRepository.deleteCustomer(customer.id);
    });
  }

  /**
   * Extends a fixed-duration session by adding minutes to the end_timestamp.
   */
  static async extendSession(sessionId: number, additionalMinutes: number): Promise<void> {
    const db = await getDatabase();
    
    await db.withTransactionAsync(async () => {
      const session = await db.getFirstAsync<Session>('SELECT * FROM Sessions WHERE id = ?', [sessionId]);
      if (!session) throw new Error('Session not found');
      if (session.is_open_session) throw new Error('Cannot extend an open session');
      if (!session.end_timestamp) throw new Error('Session has no end timestamp to extend');

      const additionalSeconds = additionalMinutes * 60;
      const newEndTimestamp = session.end_timestamp + additionalSeconds;

      // Also adjust the booked duration and total_amount.
      // To properly calculate the amount, we would need Settings, but for simplicity we will just 
      // rely on the user editing the amount manually later if it's custom, or we can fetch Settings.
      const settingsResult = await db.getFirstAsync<any>('SELECT hour_price, half_hour_price FROM Settings WHERE id = 1');
      
      let amountToAdd = 0;
      if (settingsResult) {
        if (additionalMinutes === 30 && settingsResult.half_hour_price) {
          amountToAdd = settingsResult.half_hour_price;
        } else if (additionalMinutes === 60 && settingsResult.hour_price) {
          amountToAdd = settingsResult.hour_price;
        } else {
           // Fallback proportional calculation
           const pricePerMinute = settingsResult.hour_price / 60;
           amountToAdd = pricePerMinute * additionalMinutes;
        }
      }

      const newTotalAmount = (session.total_amount || 0) + amountToAdd;
      const newDuration = (session.duration_minutes || 0) + additionalMinutes;

      await db.runAsync(
        'UPDATE Sessions SET end_timestamp = ?, duration_minutes = ?, total_amount = ?, status = ? WHERE id = ?',
        [newEndTimestamp, newDuration, newTotalAmount, 'ACTIVE', sessionId]
      );
    });
  }

  /**
   * Adds multiple extra rental items to an active session, handling payment status.
   */
  static async addRentalsToSession(
    sessionId: number, 
    items: { id: number; quantity: number; price: number }[],
    paymentStatus: PaymentStatus,
    amountPaid: number
  ): Promise<void> {
    const db = await getDatabase();
    
    await db.withTransactionAsync(async () => {
      const session = await db.getFirstAsync<Session>('SELECT * FROM Sessions WHERE id = ?', [sessionId]);
      if (!session) throw new Error('Session not found');

      let totalOrderAmount = 0;

      // Add each item to SessionRentals
      for (const item of items) {
        if (item.quantity <= 0) continue;
        
        // For individual items, we can just mark them based on the overall payment. 
        // A partial payment applies to the *order*, so we'll just track the exact amount on the session.
        await RentalRepository.addSessionRental(
          sessionId, 
          item.id, 
          item.quantity, 
          item.price, 
          paymentStatus,
          paymentStatus === 'PAID' ? (item.quantity * item.price) : 0 // simplify per-item paid tracking
        );
        totalOrderAmount += (item.quantity * item.price);
      }

      const newTotalAmount = (session.total_amount || 0) + totalOrderAmount;
      const newExtrasPaid = (session.extras_amount_paid || 0) + amountPaid;

      await db.runAsync(
        'UPDATE Sessions SET total_amount = ?, extras_amount_paid = ? WHERE id = ?',
        [newTotalAmount, newExtrasPaid, sessionId]
      );
    });
  }
}
