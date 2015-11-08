import {Task} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task({
  inputs: ['subBuild']
})
export class AnotherTask {
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass AnotherTask instantiated.`);
  }
  subBuild() {
    console.log(`> AnotherTask ran 'subBuild()'.`);
  }
}
