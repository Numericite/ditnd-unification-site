import * as migration_20260128_083247_init from './20260128_083247_init';
import * as migration_20260204_095236 from './20260204_095236';
import * as migration_20260204_101206 from './20260204_101206';
import * as migration_20260204_152940 from './20260204_152940';
import * as migration_20260206_105518 from './20260206_105518';
import * as migration_20260213_093527 from './20260213_093527';
import * as migration_20260220_160018 from './20260220_160018';

export const migrations = [
  {
    up: migration_20260128_083247_init.up,
    down: migration_20260128_083247_init.down,
    name: '20260128_083247_init',
  },
  {
    up: migration_20260204_095236.up,
    down: migration_20260204_095236.down,
    name: '20260204_095236',
  },
  {
    up: migration_20260204_101206.up,
    down: migration_20260204_101206.down,
    name: '20260204_101206',
  },
  {
    up: migration_20260204_152940.up,
    down: migration_20260204_152940.down,
    name: '20260204_152940',
  },
  {
    up: migration_20260206_105518.up,
    down: migration_20260206_105518.down,
    name: '20260206_105518',
  },
  {
    up: migration_20260213_093527.up,
    down: migration_20260213_093527.down,
    name: '20260213_093527',
  },
  {
    up: migration_20260220_160018.up,
    down: migration_20260220_160018.down,
    name: '20260220_160018'
  },
];
