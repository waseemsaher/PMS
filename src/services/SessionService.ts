import { getDatabase } from '../database/database';
import { CustomerRepository } from '../database/repositories/CustomerRepository';
import { SessionRepository } from '../database/repositories/SessionRepository';
import { HistoryRepository } from '../database/repositories/HistoryRepository';
import { DashboardRepository } from '../database/repositories/DashboardRepository';
import { RentalRepository } from '../database/repositories/RentalRepository';
import { Session, Customer, SessionRental } from '../models/types';
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

      // 4. Calculate actual duration and final price (simplified for now, assumes open session logic or static logic)
      const currentTimestamp = dayjs().unix();
      const actualDuration = Math.round((currentTimestamp - session.start_timestamp) / 60);
      
      // Calculate total amount (mocked basic logic for now, PRD relies on Settings for pricing)
      // If it's a fixed session, the amount is usually set at creation. If open, calculate here.
      const totalAmount = session.total_amount || 0;

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
      });

      // 6. Delete Active Session
      await SessionRepository.deleteSession(sessionId);

      // 7. Delete Active Customer
      await CustomerRepository.deleteCustomer(customer.id);

      await DashboardRepository.addCustomerCount(customer.people_count);
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
}
