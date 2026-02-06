/**
 * @module appConstants
 * @description Centrální definice konstant a enums.
 * Obsahuje pevné hodnoty jako stavy zakázek, typy strojů, chybové hlášky.
 * Zabraňuje použití 'magic strings' v kódu.
 */

// ==========================================
// 1. STROJE (MACHINES)
// ==========================================

// Seznam typů strojů pro "Select" (výběr v modalech)
export const MACHINE_TYPES = [
    { value: 'TQS', label: 'TQS' },
    { value: 'CW', label: 'Checkweigher (CW)' },
    { value: 'X-RAY', label: 'X-Ray' },
    { value: 'HC-A', label: 'HC-A' },
    { value: 'Wipotec', label: 'Wipotec' },
    { value: 'Jiné', label: 'Jiné' }
];

// Možnosti stavů pro "Select" (při vytváření/úpravě)
export const MACHINE_STATUS_OPTIONS = [
    { value: 'ok', label: '🟢 V pořádku' },
    { value: 'porucha', label: '🔴 Porucha / Servis' },
    { value: 'odstaveno', label: '⚪ Odstaveno' }
];

// Barvy pro Badge (štítky) v tabulkách
// Použití: <Badge variant={MACHINE_STATUS_COLORS[machine.status]}>
export const MACHINE_STATUS_COLORS = {
    'ok': 'success',      // zelená
    'porucha': 'danger',  // červená
    'odstaveno': 'neutral' // šedá
};

// ==========================================
// 2. ZAKÁZKY (JOBS)
// ==========================================

// Možnosti stavů zakázky
export const JOB_STATUS_OPTIONS = [
    { value: 'nova', label: 'Nová' },
    { value: 'rozpracovana', label: 'Rozpracovaná' },
    { value: 'ceka_na_dily', label: 'Čeká na díly' },
    { value: 'hotovo', label: 'Hotovo' }
];

// Barvy pro Badge (štítky) zakázek
export const JOB_STATUS_COLORS = {
    'nova': 'blue',
    'rozpracovana': 'warning',   // žlutá/oranžová
    'ceka_na_dily': 'purple',    // fialová
    'hotovo': 'success'          // zelená
};

// Hezké české názvy pro výpis v tabulce (místo "rozpracovana" napíše "Rozpracovaná")
export const JOB_STATUS_LABELS = {
    'nova': 'Nová',
    'rozpracovana': 'Rozpracovaná',
    'ceka_na_dily': 'Čeká na díly',
    'hotovo': 'Hotovo'
};

// ==========================================
// 3. ZÁKAZNÍCI (CUSTOMERS)
// ==========================================

export const CONTRACT_STATUS_LABELS = {
    true: 'Smlouva Aktivní',
    false: 'Bez smlouvy'
};

// ==========================================
// 4. APLIKACE (APP)
// ==========================================

export const APP_TITLE = 'Netto Servis';
export const APP_SUBTITLE = 'Servisní systém';

export const SIDEBAR_NAV_LINKS = [
    { to: '/', label: 'Přehled' },
    { to: '/calendar', label: 'Plánování' },
    { to: '/customers', label: 'Zákazníci' },
    { to: '/machines', label: 'Stroje' },
    { to: '/jobs', label: 'Zakázky' }
];

export const PLACEHOLDER_USER = {
  name: 'Technik',
  status: 'online',
  initials: 'T'
};