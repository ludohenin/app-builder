import {Task} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task()
export class BuildIndex {
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass BuildIndex instantiated.`);
  }
}
