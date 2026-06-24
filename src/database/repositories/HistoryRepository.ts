import { getDatabase } from '../database';
import { History } from '../../models/types';

export class HistoryRepository {
  static async createHistoryRecord(
    record: Omit<History, 'id' | 'created_at'>
  ): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO History (
        customer_name, people_count, session_type, start_timestamp, finish_timestamp, 
        booked_duration, actual_duration, rentals_json, notes, payment_status, total_amount,
        hours_amount_paid, extras_amount_paid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.customer_name,
        record.people_count,
        record.session_type,
        record.start_timestamp,
        record.finish_timestamp,
        record.booked_duration,
        record.actual_duration,
        record.rentals_json,
        record.notes,
        record.payment_status,
        record.total_amount,
        record.hours_amount_paid,
        record.extras_amount_paid
      ]
    );
    return result.lastInsertRowId;
  }

  static async getAllHistory(limit: number = 100, offset: number = 0): Promise<History[]> {
    const db = await getDatabase();
    return await db.getAllAsync<History>(
      `SELECT * FROM History ORDER BY finish_timestamp DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  static async searchHistory(query: string): Promise<History[]> {
    const db = await getDatabase();
    return await db.getAllAsync<History>(
      `SELECT * FROM History WHERE customer_name LIKE ? ORDER BY finish_timestamp DESC LIMIT 50`,
      [`%${query}%`]
    );
  }
}
