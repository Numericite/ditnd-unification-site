import * as migration_20251210_093643 from './20251210_093643';
import * as migration_20251210_095603 from './20251210_095603';

export const migrations = [
  {
    up: migration_20251210_093643.up,
    down: migration_20251210_093643.down,
    name: '20251210_093643',
  },
  {
    up: migration_20251210_095603.up,
    down: migration_20251210_095603.down,
    name: '20251210_095603'
  },
];
