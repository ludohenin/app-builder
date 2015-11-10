import {Task, EventEmitter} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task({
  outputs: ['subBuild:build'],
  inputs: ['build:onbuild']
})
export class SubBuildJs {
  build: EventEmitter = new EventEmitter();
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass SubBuildJs instantiated.`);
  }
  onbuild() {
    console.log(`> TaskClass SubBuildJs ran build().`);
    setTimeout(() => this.build.next(null), 1000);
  }
}
