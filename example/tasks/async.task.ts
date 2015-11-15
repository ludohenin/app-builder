import {Task} from '../../app-buildr';
import {BaseTask} from '../base_task';

@Task()
export class AsyncTask extends BaseTask {
  default(done) {
    console.log(`> ${this.constructor.name} ran default()`);
    setTimeout(() => done(), 2000);
  }
}
