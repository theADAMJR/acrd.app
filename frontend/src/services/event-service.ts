import { EventEmitter } from 'events';

const events = new EventEmitter();
(global as any)['events'] = events;

export default events;