import { EventEmitter } from 'events';

const events = new EventEmitter();
global['events'] = events;

export default events;