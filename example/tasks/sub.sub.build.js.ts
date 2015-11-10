import {Task} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task({ inputs: ['subBuild'] })
export class SubSubBuildJs {
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass SubSubBuildJs instantiated.`);
  }
  subBuild() {
    console.log(`> TaskClass SubSubBuildJs ran subBuild().`);
  }
}
