import { ChildProcessWithoutNullStreams } from 'node:child_process';
// import { MetadataConfiguration } from './types';
// import { _configure_core_args_ } from './utils';

// interface ICLI {
//   configuration?(options: MetadataConfiguration): void;
// }

export class CLI {
  private _cli: ChildProcessWithoutNullStreams;
  private _raw: ChildProcessWithoutNullStreams;

  // constructor(path?: string, config?: string) {
  //   const __raw_process__ = spawn('perl', _configure_core_args_(path, config, true));
  // }

  // private initialize(type: 'raw' | 'cli'): ChildProcessWithoutNullStreams {
  //   switch (type) {
  //     case 'raw':

  //   }
  // }
}
