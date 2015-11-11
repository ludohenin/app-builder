import {Task} from '../../app-buildr';
import {BaseTask} from '../base_task';


@Task()
export class Clean extends BaseTask {
  all() {
    console.log(`> TaskClass Clean ran all().`);
    this.dist();
  }
  dist() {
    console.log(`> TaskClass Clean ran dist().`);
  }
}
