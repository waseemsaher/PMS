import { getDatabase } from '../database';
import { RentalItem, SessionRental } from '../../models/types';

export class RentalRepository {
  static async getAvailableRentals(): Promise<RentalItem[]> {
    const db = await getDatabase();
    return await db.getAllAsync<RentalItem>(`SELECT * FROM RentalItems WHERE active = 1`);
  }

  static async addSessionRental(
    sessionId: number,
    rentalItemId: number,
    quantity: number,
    price: number,
    paid: boolean
  ): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO SessionRentals (session_id, rental_item_id, quantity, price, paid) VALUES (?, ?, ?, ?, ?)`,
      [sessionId, rentalItemId, quantity, price, paid ? 1 : 0]
    );
    return result.lastInsertRowId;
  }

  static async getRentalsForSession(sessionId: number): Promise<(SessionRental & { name: string })[]> {
    const db = await getDatabase();
    return await db.getAllAsync(`
      SELECT sr.*, r.name 
      FROM SessionRentals sr
      JOIN RentalItems r ON sr.rental_item_id = r.id
      WHERE sr.session_id = ?
    `, [sessionId]);
  }

  static async updateSessionRentalPaidStatus(id: number, paid: boolean): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`UPDATE SessionRentals SET paid = ? WHERE id = ?`, [paid ? 1 : 0, id]);
  }
}
