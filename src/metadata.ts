import {makeDecorator} from 'angular2/src/core/util/decorators';


interface TaskMetadataOptions {
  inputs?: string[];
  outputs?: string[];
  [key: string]: string[];
}

interface TaskFactory {
  (obj?: TaskMetadataOptions): any;
}

export class TaskMetadata {
  constructor(public options: TaskMetadataOptions) {
  }
}

export var Task: TaskFactory = <TaskFactory>makeDecorator(TaskMetadata);
