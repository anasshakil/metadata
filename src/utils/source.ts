import { SourceType, SourceTypeOptions } from '../types';

export function typeofSource(source: string, options: SourceTypeOptions = {}): SourceType {
  const { allowUnsecureUrl } = options;
  const https = /^https:\/\//g;
  if (typeof source !== 'string') {
    return SourceType.unknown;
  }
  source = source.trim();
  if (new RegExp(`^http${allowUnsecureUrl ? '' : 's'}://`, 'g').test(source)) {
    return https.test(source) ? SourceType.url_https : SourceType.url_http;
  }
  return SourceType.file;
}
