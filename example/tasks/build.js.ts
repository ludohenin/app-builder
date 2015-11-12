import {Task, EventEmitter} from '../../app-buildr';
import {BaseTask} from '../base_task';


@Task({ outputs: ['build'] })
export class BuildJs extends BaseTask {
  build: EventEmitter = new EventEmitter();
  default() {
    console.log(`> ${this.constructor.name} ran default()`);
    console.log(this.config);
    setTimeout(() => this.build.next(null), 1000);
  }
}
