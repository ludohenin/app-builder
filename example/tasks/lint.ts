import {Task} from '../../app-buildr';
import {BaseTask} from '../base_task';


@Task({ name: 'lint' })
export class Lint extends BaseTask {}
