import * as migration_20251212_092451 from './20251212_092451';
import * as migration_20251212_140951 from './20251212_140951';

export const migrations = [
  {
    up: migration_20251212_092451.up,
    down: migration_20251212_092451.down,
    name: '20251212_092451',
  },
  {
    up: migration_20251212_140951.up,
    down: migration_20251212_140951.down,
    name: '20251212_140951'
  },
];
