import {init, load, task, start} from '../app-buildr';
import {TASK_PROVIDERS} from './build.config';


init(TASK_PROVIDERS);

load('example/tasks');

task('build.app', ['build.js',
                  'build.assets',
                  'async.task',
                  'build.index']);

task('build', ['clean:dist',
               'lint',
               'build.app']);


// Would normally be called with cli cmd: app-buildr test.task
start('clean:all');
console.log();
start('build');
