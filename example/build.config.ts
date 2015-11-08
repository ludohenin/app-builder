import {bind} from 'angular2/angular2';
import * as gulp from 'gulp';
import * as plugins from 'gulp-load-plugins';

// DI TOKENS
// TODO: Improve as defintions are obviously not correct.
export class Gulp {}
export class GulpPlugins {}

export const TASK_PROVIDERS:any[] = [
  bind(Gulp).toValue(gulp),
  bind(GulpPlugins).toValue(plugins)
];
