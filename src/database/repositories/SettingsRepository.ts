import { getDatabase } from '../database';
import { Settings } from '../../models/types';

export class SettingsRepository {
  static async getSettings(): Promise<Settings | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Settings>('SELECT * FROM Settings WHERE id = 1');
    return result;
  }

  static async updateSettings(settings: Partial<Settings>): Promise<void> {
    const db = await getDatabase();
    const updates = [];
    const params: any[] = [];

    for (const [key, value] of Object.entries(settings)) {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) return;

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const query = `UPDATE Settings SET ${updates.join(', ')} WHERE id = 1`;
    await db.runAsync(query, params);
  }
}
