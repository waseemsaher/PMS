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

      // 8. Update Dashboard
      await DashboardRepository.addRevenue(totalAmount);
      await DashboardRepository.addCustomerCount(customer.people_count);
    });
  }
}
