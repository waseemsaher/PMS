export type SessionType = 'HALF_HOUR' | 'ONE_HOUR' | 'CUSTOM' | 'OPEN';
export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID';
export type SessionStatus = 'ACTIVE' | 'WARNING' | 'EXPIRED' | 'FINISHED';

export interface Settings {
  id: number;
  hour_price: number;
  half_hour_price: number | null;
  warning_minutes: number;
  sound_enabled: boolean;
  vibration_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  full_name: string;
  people_count: number;
  notes: string | null;
  created_at: string;
}

export interface Session {
  id: number;
  customer_id: number;
  session_type: SessionType;
  start_timestamp: number;
  end_timestamp: number | null;
  actual_end_timestamp: number | null;
  duration_minutes: number | null;
  is_open_session: boolean;
  payment_status: PaymentStatus;
  total_amount: number | null;
  hours_amount_paid: number;
  extras_amount_paid: number;
  status: SessionStatus;
  custom_hourly_rate?: number | null;
  created_at?: string;
}

export interface RentalItem {
  id: number;
  name: string;
  default_price: number;
  active: boolean;
}

export interface SessionRental {
  id: number;
  session_id: number;
  rental_item_id: number;
  quantity: number;
  price: number;
  payment_status: PaymentStatus;
  amount_paid: number;
}

export interface History {
  id: number;
  customer_name: string;
  people_count: number;
  session_type: SessionType;
  start_timestamp: number;
  finish_timestamp: number;
  booked_duration: number | null;
  actual_duration: number | null;
  rentals_json: string | null;
  notes: string | null;
  payment_status: PaymentStatus;
  total_amount: number;
  hours_amount_paid: number;
  extras_amount_paid: number;
  created_at: string;
}

export interface DashboardCache {
  id: number;
  today_revenue: number;
  month_revenue: number;
  lifetime_revenue: number;
  today_hours_revenue: number;
  today_extras_revenue: number;
  month_hours_revenue: number;
  month_extras_revenue: number;
  lifetime_hours_revenue: number;
  lifetime_extras_revenue: number;
  today_customers: number;
  month_customers: number;
  lifetime_customers: number;
  updated_at: string;
}
