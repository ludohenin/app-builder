import {Injectable} from 'angular2/angular2';
import {Gulp, GulpPlugins} from './build.config';
import {Config} from './config';


@Injectable()
export class BaseTask {
  constructor(/*public gulp: Gulp,
              public plugins: GulpPlugins,
              public config: Config*/) {
    console.log(`> ${this.constructor.name} instantiated`);
  }
  default() {
    console.log(`> ${this.constructor.name} ran default() (method not implemented)`);
  }
}
