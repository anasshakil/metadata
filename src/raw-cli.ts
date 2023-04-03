import { CLI } from './cli';
import { StreamObservable } from './observer';

export class Raw extends StreamObservable implements CLI {}
