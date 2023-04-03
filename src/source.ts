import https from 'https';
import http from 'http';
import { Source, SourceType } from './types/source';
import { typeofSource } from './utils/source';

export function streamifySource(source: Source): Source | Promise<ReadableStream> {
  if (typeof source === 'string') {
    const sourceType = typeofSource(source);
    switch (sourceType) {
      case SourceType.file:
        return source;
      case SourceType.url_http:
        return remoteStream(source, sourceType);
      default:
        throw new Error(`Source type '${sourceType}' is not supported.`);
    }
  }
  return source;
}

function remoteStream(url: string, st: SourceType): Promise<ReadableStream> {
  return new Promise((resolve, reject) => {
    switch (st) {
      case SourceType.url_https:
      case SourceType.url_http:
        (SourceType.url_https ? https : http).get(url, (rs: any) => {
          if (!rs.statusCode || (rs.statusCode < 200 && rs.statusCode > 299)) {
            return reject(new Error(`Failed to load '${url}', status code: ${rs.statusCode}`));
          }
          resolve(rs as ReadableStream);
        });
        return;
      default:
        reject(new Error(`Source type '${st}' is not supported.`));
    }
  });
}
