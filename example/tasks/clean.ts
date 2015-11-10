import {Task} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task()
export class Clean {
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass Clean instantiated.`);
  }
  all() {
    console.log(`> TaskClass Clean ran all().`);
    this.dist();
  }
  dist() {
    console.log(`> TaskClass Clean ran dist().`);
  }
}
