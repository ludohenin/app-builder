import {Task} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task({
  inputs: ['subBuild']
})
export class AnotherTestTask {
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass AnotherTestTask instantiated.`);
  }
  subBuild() {
    console.log(`> AnotherTestTask ran 'subBuild()'.`);
  }
}
