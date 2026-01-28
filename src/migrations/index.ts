import * as migration_20260128_083247_init from './20260128_083247_init';

export const migrations = [
  {
    up: migration_20260128_083247_init.up,
    down: migration_20260128_083247_init.down,
    name: '20260128_083247_init'
  },
];
