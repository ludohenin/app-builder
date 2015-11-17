import {Task} from '../../app-buildr';
import {BaseTask} from '../base_task';


@Task({ name: 'clean' })
export class Clean extends BaseTask {
  all() {
    console.log(`> ${this.constructor.name} ran all().`);
    this.dist();
  }
  dist() {
    console.log(`> ${this.constructor.name} ran dist().`);
  }
}
