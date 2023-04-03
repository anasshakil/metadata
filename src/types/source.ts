import { IncomingMessage } from 'http';

export type Source = string | ReadableStream<any>;

export enum SourceType {
  'unknown',
  'file',
  'url_https',
  'url_http',
}

export type SourceTypeOptions = {
  allowUnsecureUrl?: boolean;
};

export type StreamReadable = ReadableStream<any> | IncomingMessage;
