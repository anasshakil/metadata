import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function __dir__() {
    return dirname(fileURLToPath(import.meta.url));
}