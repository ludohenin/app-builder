import {Task} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task()
export class Lint {
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass Lint instantiated.`);
  }
}
