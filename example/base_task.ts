import {Gulp, GulpPlugins} from './build.config';


export class BaseTask {
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass ${this.constructor.name} instantiated.`);
  }
}
