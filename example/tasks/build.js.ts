import {Task, EventEmitter} from '../../app-buildr';
import {BaseTask} from '../base_task';
import {Gulp, GulpPlugins, Config} from '../build.config';


@Task({ outputs: ['build'] })
export class BuildJs extends BaseTask {
  build: EventEmitter = new EventEmitter();
  // NOTE: Injection does not work from parent class. How to make this more elegant ?
  constructor(public gulp: Gulp, public plugins: GulpPlugins, public config: Config) {
    super();
  }
  default() {
    console.log(`> ${this.constructor.name} ran default()`);
    console.log(this.config);
    setTimeout(() => this.build.next(null), 1000);
  }
}
