import { getDatabase } from '../database';
import { Session, SessionStatus, PaymentStatus } from '../../models/types';

export class SessionRepository {
  static async createSession(
    session: Omit<Session, 'id' | 'created_at'>
  ): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO Sessions (
        customer_id, session_type, start_timestamp, end_timestamp, 
        actual_end_timestamp, duration_minutes, is_open_session, 
        payment_status, total_amount, hours_amount_paid, extras_amount_paid, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.customer_id,
        session.session_type,
        session.start_timestamp,
        session.end_timestamp,
        session.actual_end_timestamp,
        session.duration_minutes,
        session.is_open_session ? 1 : 0,
        session.payment_status,
        session.total_amount,
        session.hours_amount_paid,
        session.extras_amount_paid,
        session.status,
      ]
    );
    return result.lastInsertRowId;
  }

  static async updateSessionStatus(id: number, status: SessionStatus): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`UPDATE Sessions SET status = ? WHERE id = ?`, [status, id]);
  }

  static async extendSession(id: number, additionalMinutes: number, newEndTimestamp: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE Sessions 
       SET duration_minutes = duration_minutes + ?, end_timestamp = ?, status = 'ACTIVE' 
       WHERE id = ?`,
      [additionalMinutes, newEndTimestamp, id]
    );
  }

  static async updatePaymentStatus(id: number, status: PaymentStatus): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`UPDATE Sessions SET payment_status = ? WHERE id = ?`, [status, id]);
  }

  static async deleteSession(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM Sessions WHERE id = ?`, [id]);
  }

  static async getActiveSessions(): Promise<(Session & { customer_name: string, people_count: number })[]> {
    const db = await getDatabase();
    return await db.getAllAsync(`
      SELECT s.*, c.full_name as customer_name, c.people_count 
      FROM Sessions s 
      JOIN Customers c ON s.customer_id = c.id 
      WHERE s.status != 'FINISHED'
    `);
  }
}
