import * as migration_20260128_083247_init from './20260128_083247_init';
import * as migration_20260204_093447 from './20260204_093447';

export const migrations = [
  {
    up: migration_20260128_083247_init.up,
    down: migration_20260128_083247_init.down,
    name: '20260128_083247_init',
  },
  {
    up: migration_20260204_093447.up,
    down: migration_20260204_093447.down,
    name: '20260204_093447'
  },
];
