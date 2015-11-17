import {Task, EventEmitter} from '../../app-buildr';
import {BaseTask} from '../base_task';


@Task({ outputs: ['build'] })
export class BuildJs extends BaseTask {
  build: EventEmitter<any> = new EventEmitter();
  default(done) {
    console.log(`> ${this.constructor.name} ran default()`);
    console.log(this.config);
    setTimeout(() => {
      this.build.next(null);
      done();
    }, 1000);
  }
}
