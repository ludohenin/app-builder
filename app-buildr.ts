require('reflect-metadata/Reflect');
import {Builder} from './src/builder';
import {TaskLoader, Loader} from './src/loader';
import {SequenceRegistry, TaskRegistry} from './src/registry';
import {TaskRunner} from './src/runner';

const CORE_PROVIDERS = [
  Builder,
  Loader,
  SequenceRegistry,
  TaskRegistry,
  TaskLoader,
  TaskRunner
];

export {EventEmitter} from 'angular2/angular2';
export {Task} from './src/metadata';
export function init(providers: any[]) {
  Builder.init(CORE_PROVIDERS, providers);
}
export let load  = Builder.load;
export let task  = Builder.task;
export let start = Builder.start;
