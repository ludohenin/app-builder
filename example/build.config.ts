import {bind, Injectable} from 'angular2/angular2';
import * as gulp from 'gulp';
import * as plugins from 'gulp-load-plugins';
import {TaskInjection} from '../app-buildr';
import * as config from './config';

// DI TOKENS
// TODO: Improve as defintions are obviously not correct.
export class Gulp {}
export class GulpPlugins {}
export class Config {}

// NOTE: This is to avoid the constructor boilerplate.
@Injectable()
class TaskInjectionImplementation {
  constructor(public gulp: Gulp,
              public plugins: GulpPlugins,
              public config: Config) {}
}

export const TASK_PROVIDERS:any[] = [
  bind(Gulp).toValue(gulp),
  bind(GulpPlugins).toValue(plugins),
  bind(Config).toValue(config),
  bind(TaskInjection).toClass(TaskInjectionImplementation)
];
