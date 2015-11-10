import {Injectable} from 'angular2/core';
import {TaskRegistry, EventRegistry, TaskEntry, VirtualTaskEntry} from './task_registry';
import {AppInjector} from './task_manager';
import {parseInstruction} from './utils';


export interface TaskInstruction {
  name: string;
  action: string;
}

@Injectable()
export class TaskRunner {
  constructor(private _taskRegistry: TaskRegistry,
              private _eventRegistry: EventRegistry) {
  }
  run(taskToRun: string) {
    let task = parseInstruction(taskToRun);
    let taskEntry = this._taskRegistry.find({taskname: task.name});

    if (!taskEntry) {
      throw new Error(`Could not find task ${task.name}`); }

    if (taskEntry.isVirtual) {
      this._runVirtual(taskEntry);
    } else {
      this._run(task, taskEntry);
    }
  }
  private _run(task: TaskInstruction, taskEntry: TaskEntry): void {
    let taskClass = taskEntry.task;
    let taskInstance = AppInjector.get().resolveAndInstantiate(taskClass);

    this._link(taskClass, taskInstance);

    if (task.action) {
      if (!taskInstance[task.action]) {
        throw new Error(`Could not find action ${task.action} in task ${task.name}`); }

      taskInstance[task.action]();
    }
  }
  private _runVirtual(taskEntry: VirtualTaskEntry): void {
    let _this = this;
    taskEntry.sequence.forEach(taskname => {
      _this.run(taskname);
    });
  }
  private _link(task, taskInstance): void {
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
