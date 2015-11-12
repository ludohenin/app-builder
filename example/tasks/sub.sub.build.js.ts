import {Task} from '../../app-buildr';
import {BaseTask} from '../base_task';


@Task({ inputs: ['subBuild'] })
export class SubSubBuildJs extends BaseTask {}
