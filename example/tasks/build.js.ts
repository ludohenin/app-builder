import {Task, EventEmitter} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task({ outputs: ['build'] })
export class BuildJs {
  build: EventEmitter = new EventEmitter();
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass BuildJs instantiated.`);
    setTimeout(() => this.build.next(null), 1000);
  }
}
