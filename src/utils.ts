import path from 'node:path';
import { __dir__ } from '../__dir';

function _inject_config_file_(no_default?: boolean, cfg?: string): string[] {
  const noConfig = no_default === true && typeof cfg === 'string' && !(cfg.length > 0);
  if (noConfig) {
    return [];
  }
  return ['-config', cfg || path.join(__dir__(), '.config_files/default.cfg')];
}

export function _configure_core_args_(
  _path_: string = 'exiftool',
  config?: string,
  no_default?: boolean,
): string[] {
  const _default_config: string[] = [_path_, ..._inject_config_file_(no_default, config)];
  return [..._default_config, '-stay_open', 'true', '-@', '-'];
}
