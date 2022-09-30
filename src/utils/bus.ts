import mitt, { Emitter } from 'mitt';

type Events = {
  [key: string]: any;
};
const eventBus: Emitter<Events> = mitt<Events>();
export default eventBus