require('reflect-metadata/Reflect');

// TODO: Move all this into src folder.

import {Builder} from './src/builder';
import {TaskLoader} from './src/loader';
import {TaskRegistry, EventRegistry} from './src/registry';
import {TaskRunner} from './src/runner';


const CORE_PROVIDERS = [
  Builder,
  EventRegistry,
  TaskLoader,
  TaskRegistry,
  TaskRunner
];


let builder: Builder;

export {EventEmitter} from 'angular2/angular2';
export {Task} from './src/metadata';
export function init(buildProviders: any[]): void {
  builder = Builder.init(CORE_PROVIDERS, buildProviders);
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


// ----------
// Helper.
function isInit() {
  if (!builder && !(builder instanceof Builder)) {
    throw new Error('You must run init first'); }
}
