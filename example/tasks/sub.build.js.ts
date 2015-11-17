import {Task, EventEmitter} from '../../app-buildr';
import {BaseTask} from '../base_task';


@Task({ name: 'sub.build.js' })
export class SubBuildJs extends BaseTask {
  build: EventEmitter<any> = new EventEmitter();
  onbuild() {
    console.log(`> ${this.constructor.name} ran build().`);
    setTimeout(() => this.build.next(null), 3000);
  }
}
