import { getDatabase } from '../database';
import { DashboardCache } from '../../models/types';

export class DashboardRepository {
  static async getDashboard(): Promise<DashboardCache | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<DashboardCache>('SELECT * FROM DashboardCache WHERE id = 1');
  }

  static async addRevenue(amount: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`
      UPDATE DashboardCache 
      SET today_revenue = today_revenue + ?, 
          month_revenue = month_revenue + ?, 
          lifetime_revenue = lifetime_revenue + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [amount, amount, amount]);
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
