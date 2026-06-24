import { getDatabase } from '../database';
import { DashboardCache } from '../../models/types';

export class DashboardRepository {
  static async getDashboard(): Promise<DashboardCache | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<DashboardCache>('SELECT * FROM DashboardCache WHERE id = 1');
  }

  static async addRevenue(hoursAmount: number, extrasAmount: number): Promise<void> {
    const totalAmount = hoursAmount + extrasAmount;
    const db = await getDatabase();
    await db.runAsync(`
      UPDATE DashboardCache 
      SET today_revenue = today_revenue + ?, 
          month_revenue = month_revenue + ?, 
          lifetime_revenue = lifetime_revenue + ?,
          today_hours_revenue = today_hours_revenue + ?,
          today_extras_revenue = today_extras_revenue + ?,
          month_hours_revenue = month_hours_revenue + ?,
          month_extras_revenue = month_extras_revenue + ?,
          lifetime_hours_revenue = lifetime_hours_revenue + ?,
          lifetime_extras_revenue = lifetime_extras_revenue + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [
      totalAmount, totalAmount, totalAmount,
      hoursAmount, extrasAmount,
      hoursAmount, extrasAmount,
      hoursAmount, extrasAmount
    ]);
  }

  static async addCustomerCount(count: number = 1): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`
      UPDATE DashboardCache 
      SET today_customers = today_customers + ?, 
          month_customers = month_customers + ?, 
          lifetime_customers = lifetime_customers + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [count, count, count]);
  }
}
