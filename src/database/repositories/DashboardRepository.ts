import { getDatabase } from '../database';

export interface DashboardMetrics {
  today_revenue: number;
  today_hours_revenue: number;
  today_extras_revenue: number;
  month_revenue: number;
  month_hours_revenue: number;
  month_extras_revenue: number;
  lifetime_revenue: number;
  lifetime_hours_revenue: number;
  lifetime_extras_revenue: number;
  today_customers: number;
  month_customers: number;
  lifetime_customers: number;
}

export class DashboardRepository {
  static async getDashboard(): Promise<DashboardMetrics> {
    const db = await getDatabase();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayUnix = Math.floor(todayStart.getTime() / 1000);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthUnix = Math.floor(monthStart.getTime() / 1000);

    // Dynamic SUM queries across Sessions (active) and History (finished)
    const query = `
      SELECT
        -- Today
        IFNULL((SELECT SUM(hours_amount_paid + extras_amount_paid) FROM Sessions WHERE start_timestamp >= ${todayUnix}), 0) +
        IFNULL((SELECT SUM(hours_amount_paid + extras_amount_paid) FROM History WHERE finish_timestamp >= ${todayUnix}), 0) as today_revenue,
        
        IFNULL((SELECT SUM(hours_amount_paid) FROM Sessions WHERE start_timestamp >= ${todayUnix}), 0) +
        IFNULL((SELECT SUM(hours_amount_paid) FROM History WHERE finish_timestamp >= ${todayUnix}), 0) as today_hours_revenue,
        
        IFNULL((SELECT SUM(extras_amount_paid) FROM Sessions WHERE start_timestamp >= ${todayUnix}), 0) +
        IFNULL((SELECT SUM(extras_amount_paid) FROM History WHERE finish_timestamp >= ${todayUnix}), 0) as today_extras_revenue,

        -- Month
        IFNULL((SELECT SUM(hours_amount_paid + extras_amount_paid) FROM Sessions WHERE start_timestamp >= ${monthUnix}), 0) +
        IFNULL((SELECT SUM(hours_amount_paid + extras_amount_paid) FROM History WHERE finish_timestamp >= ${monthUnix}), 0) as month_revenue,
        
        IFNULL((SELECT SUM(hours_amount_paid) FROM Sessions WHERE start_timestamp >= ${monthUnix}), 0) +
        IFNULL((SELECT SUM(hours_amount_paid) FROM History WHERE finish_timestamp >= ${monthUnix}), 0) as month_hours_revenue,
        
        IFNULL((SELECT SUM(extras_amount_paid) FROM Sessions WHERE start_timestamp >= ${monthUnix}), 0) +
        IFNULL((SELECT SUM(extras_amount_paid) FROM History WHERE finish_timestamp >= ${monthUnix}), 0) as month_extras_revenue,

        -- Lifetime
        IFNULL((SELECT SUM(hours_amount_paid + extras_amount_paid) FROM Sessions), 0) +
        IFNULL((SELECT SUM(hours_amount_paid + extras_amount_paid) FROM History), 0) as lifetime_revenue,
        
        IFNULL((SELECT SUM(hours_amount_paid) FROM Sessions), 0) +
        IFNULL((SELECT SUM(hours_amount_paid) FROM History), 0) as lifetime_hours_revenue,
        
        IFNULL((SELECT SUM(extras_amount_paid) FROM Sessions), 0) +
        IFNULL((SELECT SUM(extras_amount_paid) FROM History), 0) as lifetime_extras_revenue,

        -- Customers (Today)
        IFNULL((SELECT SUM(C.people_count) FROM Customers C JOIN Sessions S ON C.id = S.customer_id WHERE S.start_timestamp >= ${todayUnix}), 0) +
        IFNULL((SELECT SUM(people_count) FROM History WHERE finish_timestamp >= ${todayUnix}), 0) as today_customers,

        -- Customers (Month)
        IFNULL((SELECT SUM(C.people_count) FROM Customers C JOIN Sessions S ON C.id = S.customer_id WHERE S.start_timestamp >= ${monthUnix}), 0) +
        IFNULL((SELECT SUM(people_count) FROM History WHERE finish_timestamp >= ${monthUnix}), 0) as month_customers,

        -- Customers (Lifetime)
        IFNULL((SELECT SUM(people_count) FROM Customers), 0) +
        IFNULL((SELECT SUM(people_count) FROM History), 0) as lifetime_customers
    `;

    const result = await db.getFirstAsync<DashboardMetrics>(query);
    return result as DashboardMetrics;
  }
}
