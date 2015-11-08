import {Injectable} from 'angular2/core';
import {TaskRegistry, EventRegistry, TaskEntry} from './task_registry';
import {AppInjector} from './task_manager';


@Injectable()
export class TaskRunner {
  constructor(private _taskRegistry: TaskRegistry,
              private _eventRegistry: EventRegistry) {
  }
  run(taskname: string) {
    console.log(this._taskRegistry);
    console.log(this._eventRegistry);
    // console.log(EVENTS_REGISTRY);
    let taskEntry: TaskEntry = this._taskRegistry.find({taskname});

    if (!taskEntry) {
      throw new Error(`Could not find task ${taskname}`); }

    let task = taskEntry.task;
    let taskInstance = AppInjector.get().resolveAndInstantiate(task);

    this._link(task, taskInstance);
  }
  private _link(task, taskInstance) {
    let outputs = this._eventRegistry.getOutputs(task);

    outputs.forEach(output => {
      let inputs = this._eventRegistry.getInputs(output.event);
      inputs.forEach(input => {
        let listnerTask = AppInjector.get().resolveAndInstantiate(input.task);
        let observable = taskInstance[output.event];
        let observer = listnerTask[output.event];
        observable.observer({next: observer.bind(listnerTask)});

        // link recursively.
        // TODO: Check for circular references.
        this._link(input.task, listnerTask);
      });
    });
  }
}
