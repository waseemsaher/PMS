import { getDatabase } from '../database';
import { Customer } from '../../models/types';

export class CustomerRepository {
  static async createCustomer(
    fullName: string,
    peopleCount: number,
    notes: string | null
  ): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO Customers (full_name, people_count, notes) VALUES (?, ?, ?)`,
      [fullName, peopleCount, notes]
    );
    return result.lastInsertRowId;
  }

  static async updateCustomer(
    id: number,
    updates: Partial<Pick<Customer, 'full_name' | 'people_count' | 'notes'>>
  ): Promise<void> {
    const db = await getDatabase();
    const fields = [];
    const params: any[] = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }

    if (fields.length === 0) return;
    params.push(id);

    const query = `UPDATE Customers SET ${fields.join(', ')} WHERE id = ?`;
    await db.runAsync(query, params);
  }

  static async deleteCustomer(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM Customers WHERE id = ?`, [id]);
  }

  static async getCustomerById(id: number): Promise<Customer | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<Customer>(`SELECT * FROM Customers WHERE id = ?`, [id]);
  }
}
