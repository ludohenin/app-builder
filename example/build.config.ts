import {bind, provide} from 'angular2/angular2';
import * as gulp from 'gulp';
import * as plugins from 'gulp-load-plugins';
import {Config} from './config';

// DI TOKENS
// TODO: Improve as defintions are obviously not correct.
export class Gulp {}
export class GulpPlugins {}
export {Config} from './config';;

export const TASK_PROVIDERS:any[] = [
  bind(Gulp).toValue(gulp),
  bind(GulpPlugins).toValue(plugins),
  Config
];
