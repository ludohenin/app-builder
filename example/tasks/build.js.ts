import {Task, EventEmitter} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';

// TODO: Find an elegant way to handle this case.
@Task({ outputs: ['build'] })
export class BuildJs {
  build: EventEmitter = new EventEmitter();
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass BuildJs instantiated.`);
    setTimeout(() => this.build.next(null), 1000);
  }
}
