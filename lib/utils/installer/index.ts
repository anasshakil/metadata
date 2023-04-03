import os from 'os';
import path from 'path';
import { __dir__ } from '../../../__dir';

export function getExifTool(): void {
  const script = path.join(__dir__(), os.platform() === 'win32' ? 'windows.cmd' : 'unix.sh');
  console.log(script);
}
