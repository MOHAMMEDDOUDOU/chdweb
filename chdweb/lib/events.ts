import { EventEmitter } from 'events';

class RealtimeEmitter extends EventEmitter {}

export const realtimeEmitter = new RealtimeEmitter();

export type RealtimeEvent = {
  entity: 'product' | 'offer';
  action: 'create' | 'update' | 'delete';
  id?: string;
  timestamp: number;
};

export function emitRealtimeEvent(event: RealtimeEvent) {
  realtimeEmitter.emit('event', event);
}
