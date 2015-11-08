import {EventEmitter} from 'angular2/core';
import {Task} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task({
  inputs: ['build'],
  outputs: ['subBuild']
})
export class HookTask {
  subBuild: EventEmitter = new EventEmitter(true);
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass HookTask instantiated.`);
  }
  build(): void {
    console.log(`> HookTask ran 'buid()'.`);
    setTimeout(() => this.subBuild.next(null));
  }
}
