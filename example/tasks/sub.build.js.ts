import {Task, EventEmitter} from '../../app-buildr';
import {BaseTask} from '../base_task';


@Task({
  outputs: ['subBuild:build'],
  inputs: ['build:onbuild']
})
export class SubBuildJs extends BaseTask {
  build: EventEmitter = new EventEmitter();
  onbuild() {
    console.log(`> ${this.constructor.name} ran build().`);
    setTimeout(() => this.build.next(null), 1000);
  }
}
