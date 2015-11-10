import {init, load, task, start} from '../app-buildr';
import {TASK_PROVIDERS} from './build.config';


init(TASK_PROVIDERS);

load('example/tasks');

task('build', ['clean:dist',
               'lint',
               'build.js',
               'build.assets',
               'build.index']);


// Would normally be called with cli cmd: app-buildr test.task
start('clean:all');
console.log('');
start('build');
