import {EventEmitter} from 'angular2/core';
import {Task} from '../../app-buildr';
import {Gulp, GulpPlugins} from '../build.config';


@Task({
  outputs: ['build']
})
export class TestTask {
  public build: EventEmitter = new EventEmitter(true);
  constructor(private gulp: Gulp, private plugins: GulpPlugins) {
    console.log(`> TaskClass TestTask instantiated.`);
    setTimeout(() => this.build.next(null), 1000);
  }
}
