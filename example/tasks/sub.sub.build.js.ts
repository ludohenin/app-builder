import {Task} from '../../app-buildr';
import {BaseTask} from '../base_task';


@Task({ inputs: ['subBuild:build'] })
export class SubSubBuildJs extends BaseTask {
  build() {
    console.log(`> TaskClass SubSubBuildJs ran build().`);
  }
}
