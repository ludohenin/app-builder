import {makeDecorator} from 'angular2/src/core/util/decorators';


interface TaskFactory {
  (obj?: {
    inputs?: string[];
    outputs?: string[];
  });
}

export class TaskMetadata {
  constructor(public options) {
    console.log(`> class TaskMetadata instantiated`);
  }
}

export var Task: TaskFactory = <TaskFactory>makeDecorator(TaskMetadata);


// Read this:
// https://github.com/angular/angular/blob/be3e7db5db23424d9134ea0eda32c0da5bea6779/modules/angular2/src/core/linker/element_injector.ts
class TaskProvider {}
