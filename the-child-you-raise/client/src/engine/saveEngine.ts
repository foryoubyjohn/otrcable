// ============================================================
// Save Engine — localStorage persistence
// ============================================================

import type { GameState } from './types';

const SAVE_KEY = 'the_child_you_raise_save';
const SAVE_VERSION = '1.0.0';

export function saveGame(state: GameState): boolean {
  try {
    const saveData = {
      ...state,
      last_saved: new Date().toISOString(),
      version: SAVE_VERSION,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (e) {
    console.error('Failed to save game:', e);
    return false;
  }
}

export function loadGame(): GameState | null {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data) as GameState;
    
    // Version check - could add migration logic here
    if (parsed.version !== SAVE_VERSION) {
      console.warn('Save version mismatch, may need migration');
    }
    
    return parsed;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function getSaveInfo(): { exists: boolean; childName?: string; age?: string; lastSaved?: string } {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return { exists: false };
    
    const parsed = JSON.parse(data) as GameState;
    const years = Math.floor(parsed.current_month / 12);
    const months = parsed.current_month % 12;
    
    return {
      exists: true,
      childName: parsed.child_name,
      age: years > 0 ? `${years}y ${months}m` : `${months}m`,
      lastSaved: parsed.last_saved,
    };
  } catch {
    return { exists: false };
  }
}
