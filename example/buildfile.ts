import {Builder} from '../app-buildr';
import {TASK_PROVIDERS} from './build.config';

console.log('');

let builder = Builder.init(TASK_PROVIDERS);

builder.load('example/tasks');

// task('build', ['test.task']);

builder.start('test.task');

console.log('');
