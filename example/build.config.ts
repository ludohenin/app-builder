import {bind} from 'angular2/angular2';
import * as gulp from 'gulp';
import * as plugins from 'gulp-load-plugins';
import * as config from './config';


export const TASK_PROVIDERS:any[] = [
  bind('gulp').toValue(gulp),
  bind('plugins').toValue(plugins),
  bind('config').toValue(config),
];
