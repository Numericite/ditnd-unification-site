import * as migration_20251210_095603 from './20251210_095603';
import * as migration_20251211_132140 from './20251211_132140';

export const migrations = [
  {
    up: migration_20251210_095603.up,
    down: migration_20251210_095603.down,
    name: '20251210_095603',
  },
  {
    up: migration_20251211_132140.up,
    down: migration_20251211_132140.down,
    name: '20251211_132140'
  },
];
