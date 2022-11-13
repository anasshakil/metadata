import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function __getDir() {
    return dirname(fileURLToPath(import.meta.url));
}