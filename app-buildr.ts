require('reflect-metadata/Reflect');

import {Builder} from './src/manager';

let builder: Builder;

export {EventEmitter} from 'angular2/angular2';
export {Task} from './src/metadata';
export function init(providers: any[]): void {
  builder = Builder.init(providers);
}
export function load(path: string|string[]) {
  isInit();
  builder.load(path);
}
export function task(name: string, seq: string[]) {
  isInit();
  builder.task(name, seq);
}
export function start(task: string) {
  isInit();
  builder.start(task);
}


function isInit() {
  if (!builder && !(builder instanceof Builder)) {
    throw new Error('You must run init first'); }
}
