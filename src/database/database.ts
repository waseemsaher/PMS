import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('pooltimer.db');
  }
  return db;
};

export const initializeDatabase = async () => {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS Settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      hour_price REAL NOT NULL,
      half_hour_price REAL,
      warning_minutes INTEGER NOT NULL DEFAULT 5,
      sound_enabled BOOLEAN NOT NULL DEFAULT 1,
      vibration_enabled BOOLEAN NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      people_count INTEGER NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      session_type TEXT NOT NULL,
      start_timestamp INTEGER NOT NULL,
      end_timestamp INTEGER,
      actual_end_timestamp INTEGER,
      duration_minutes INTEGER,
      is_open_session BOOLEAN NOT NULL,
      payment_status TEXT NOT NULL,
      total_amount REAL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES Customers (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS RentalItems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      default_price REAL NOT NULL,
      active BOOLEAN NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS SessionRentals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      rental_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      paid BOOLEAN NOT NULL DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES Sessions (id) ON DELETE CASCADE,
      FOREIGN KEY (rental_item_id) REFERENCES RentalItems (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS History (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      people_count INTEGER NOT NULL,
      session_type TEXT NOT NULL,
      start_timestamp INTEGER NOT NULL,
      finish_timestamp INTEGER NOT NULL,
      booked_duration INTEGER,
      actual_duration INTEGER,
      rentals_json TEXT,
      notes TEXT,
      payment_status TEXT NOT NULL,
      total_amount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS DashboardCache (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      today_revenue REAL NOT NULL DEFAULT 0,
      month_revenue REAL NOT NULL DEFAULT 0,
      lifetime_revenue REAL NOT NULL DEFAULT 0,
      today_customers INTEGER NOT NULL DEFAULT 0,
      month_customers INTEGER NOT NULL DEFAULT 0,
      lifetime_customers INTEGER NOT NULL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Insert default Settings if none exist
    INSERT OR IGNORE INTO Settings (id, hour_price, half_hour_price, warning_minutes, sound_enabled, vibration_enabled) 
    VALUES (1, 100, 50, 5, 1, 1);

    -- Insert default DashboardCache if none exist
    INSERT OR IGNORE INTO DashboardCache (id) VALUES (1);
    
    -- Insert default Rental Items if none exist
    INSERT OR IGNORE INTO RentalItems (id, name, default_price, active) VALUES (1, 'Board', 20, 1);
    INSERT OR IGNORE INTO RentalItems (id, name, default_price, active) VALUES (2, 'Shorts', 30, 1);
    INSERT OR IGNORE INTO RentalItems (id, name, default_price, active) VALUES (3, 'Deposit', 50, 1);
  `);

  // Safe Migrations for existing databases
  try { await database.execAsync('ALTER TABLE DashboardCache ADD COLUMN today_hours_revenue REAL NOT NULL DEFAULT 0'); } catch (e) {}
  try { await database.execAsync('ALTER TABLE DashboardCache ADD COLUMN today_extras_revenue REAL NOT NULL DEFAULT 0'); } catch (e) {}
  try { await database.execAsync('ALTER TABLE DashboardCache ADD COLUMN month_hours_revenue REAL NOT NULL DEFAULT 0'); } catch (e) {}
  try { await database.execAsync('ALTER TABLE DashboardCache ADD COLUMN month_extras_revenue REAL NOT NULL DEFAULT 0'); } catch (e) {}
  try { await database.execAsync('ALTER TABLE DashboardCache ADD COLUMN lifetime_hours_revenue REAL NOT NULL DEFAULT 0'); } catch (e) {}
  try { await database.execAsync('ALTER TABLE DashboardCache ADD COLUMN lifetime_extras_revenue REAL NOT NULL DEFAULT 0'); } catch (e) {}

  console.log('Database initialized successfully.');
};
