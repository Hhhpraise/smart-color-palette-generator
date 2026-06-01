'use strict';

window.Chromatic = window.Chromatic || {};

// ─── Storage Manager ──────────────────────────────────────────────────────
class StorageManager {
    constructor() {
        this.VERSION = 1;
        this.migrate();
    }

    migrate() {
        const v = parseInt(localStorage.getItem('chromatic_version') || '0', 10);
        if (v < this.VERSION) {
            // Future migrations go here
            localStorage.setItem('chromatic_version', this.VERSION);
        }
    }

    _get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
    }

    _set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                // Trim history first, then favorites
                this._trim('chromatic_history', 20);
                try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
            }
        }
    }

    _trim(key, keep) {
        const data = this._get(key, []);
        if (data.length > keep) {
            this._set(key, data.slice(0, keep));
        }
    }

    // ── Settings ──
    getSettings() {
        return this._get('chromatic_settings', {
            theme: 'dark',
            onboardingDone: false,
            copyFormat: 'hex'
        });
    }

    setSettings(obj) {
        const s = this.getSettings();
        Object.assign(s, obj);
        this._set('chromatic_settings', s);
        return s;
    }

    // ── History ──
    getHistory() {
        return this._get('chromatic_history', []);
    }

    addToHistory(palette) {
        const h = this.getHistory();
        // Remove duplicate if exists
        const idx = h.findIndex(p => p.colors.join(',') === palette.colors.join(','));
        if (idx >= 0) h.splice(idx, 1);
        h.unshift({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            colors: palette.colors,
            algorithm: palette.algorithm,
            baseColor: palette.baseColor,
            name: palette.name || '',
            createdAt: Date.now()
        });
        if (h.length > 50) h.length = 50;
        this._set('chromatic_history', h);
    }

    clearHistory() {
        this._set('chromatic_history', []);
    }

    // ── Favorites ──
    getFavorites() {
        return this._get('chromatic_favorites', []);
    }

    saveFavorite(palette) {
        const f = this.getFavorites();
        f.unshift({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            colors: palette.colors,
            algorithm: palette.algorithm,
            baseColor: palette.baseColor,
            name: palette.name || '',
            collection: palette.collection || '',
            createdAt: Date.now()
        });
        if (f.length > 100) f.length = 100;
        this._set('chromatic_favorites', f);
        return f[0];
    }

    removeFavorite(id) {
        const f = this.getFavorites().filter(p => p.id !== id);
        this._set('chromatic_favorites', f);
    }

    // ── Collections ──
    getCollections() {
        return this._get('chromatic_collections', []);
    }

    saveCollection(name) {
        const c = this.getCollections();
        const existing = c.find(col => col.name === name);
        if (existing) return existing;
        const col = { id: Date.now().toString(36), name, paletteIds: [] };
        c.push(col);
        this._set('chromatic_collections', c);
        return col;
    }

    removeCollection(id) {
        const c = this.getCollections().filter(col => col.id !== id);
        this._set('chromatic_collections', c);
    }
}

window.Chromatic.Storage = new StorageManager();
