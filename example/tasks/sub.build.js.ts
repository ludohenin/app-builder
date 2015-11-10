import {Task, EventEmitter} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task({ outputs: ['subBuild'], inputs: ['build'] })
export class SubBuildJs {
  subBuild: EventEmitter = new EventEmitter();
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass SubBuildJs instantiated.`);
  }
  build() {
    console.log(`> TaskClass SubBuildJs ran build().`);
    setTimeout(() => this.subBuild.next(null), 1000);
  }
}
