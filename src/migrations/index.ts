import * as migration_20260128_083247_init from './20260128_083247_init';
import * as migration_20260204_095236 from './20260204_095236';
import * as migration_20260204_101206 from './20260204_101206';
import * as migration_20260204_152940 from './20260204_152940';
import * as migration_20260206_105518 from './20260206_105518';
import * as migration_20260213_093527 from './20260213_093527';
import * as migration_20260220_160018 from './20260220_160018';
import * as migration_20260303_135634 from './20260303_135634';
import * as migration_20260309_140436 from './20260309_140436';
import * as migration_20260310_111338 from './20260310_111338';
import * as migration_20260316_104938 from './20260316_104938';
import * as migration_20260320_171927 from './20260320_171927';
import * as migration_20260323_120000_migrate_callout_highlight_to_richtext from './20260323_120000_migrate_callout_highlight_to_richtext';
import * as migration_20260323_163106 from './20260323_163106';

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
    name: '20260220_160018',
  },
  {
    up: migration_20260303_135634.up,
    down: migration_20260303_135634.down,
    name: '20260303_135634',
  },
  {
    up: migration_20260309_140436.up,
    down: migration_20260309_140436.down,
    name: '20260309_140436',
  },
  {
    up: migration_20260310_111338.up,
    down: migration_20260310_111338.down,
    name: '20260310_111338',
  },
  {
    up: migration_20260316_104938.up,
    down: migration_20260316_104938.down,
    name: '20260316_104938',
  },
  {
    up: migration_20260320_171927.up,
    down: migration_20260320_171927.down,
    name: '20260320_171927',
  },
  {
    up: migration_20260323_120000_migrate_callout_highlight_to_richtext.up,
    down: migration_20260323_120000_migrate_callout_highlight_to_richtext.down,
    name: '20260323_120000_migrate_callout_highlight_to_richtext',
  },
  {
    up: migration_20260323_163106.up,
    down: migration_20260323_163106.down,
    name: '20260323_163106'
  },
];
