import {Injectable} from 'angular2/angular2';
import {isFunction} from 'lodash';
import {EventRegistry, LoadedTaskEntry, TaskRegistry, VirtualTaskEntry} from './registry';
import {AppInjector} from './injector';
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
  run(taskInstruction: string): void {
    let task = parseInstruction(taskInstruction);
    let taskEntry = this._taskRegistry.find({taskname: task.name});

    if (!taskEntry) {
      throw new Error(`Could not find task ${task.name}, task not registered`); }

    if (taskEntry.isVirtual) {
      this._runVirtual(taskEntry);
    } else {
      this._run(task, taskEntry);
    }
  }
  // TODO: Handle async tasks (Gulp handes async callback, returned stream & returned promise).
  //       What do we handle here ?
  private _run(task: TaskInstruction, taskEntry: LoadedTaskEntry): void {
    let taskClass = taskEntry.task;
    let taskInstance = AppInjector.injector.resolveAndInstantiate(taskClass);

    // Inject task dependencies.
    // Done this way to reduce constructor injection boilerplate of task class.
    // NOTE: Injected providers are not accessible at instanciation time.
    // TODO: move this into AppInjector as static method.
    AppInjector.taskProviders.forEach((provider) => {
      let token = provider.token;
      let tokenname: string = isFunction(token) ? token.name : token;
      let propname: string = tokenname.charAt(0).toLowerCase() + tokenname.slice(1);
      taskInstance[propname] = AppInjector.injector.get(token);
    });

    this._link(taskClass, taskInstance);

    if (task.action) {
      taskInstance[task.action]();
    } else {
      taskInstance['default']();
    }
  }
  private _runVirtual(taskEntry: VirtualTaskEntry): void {
    taskEntry.sequence.forEach(taskInstruction => {
      this.run(taskInstruction);
    });
  }
  private _link(task: any, outputTaskInstance: any): void {
    let outputs = this._eventRegistry.getOutputs(task);

    outputs.forEach(output => {
      let inputs = this._eventRegistry.getInputs(output.eventname);
      inputs.forEach(input => {
        let inputTaskInstance = AppInjector.injector.resolveAndInstantiate(input.task);
        let observable = outputTaskInstance[output.eventaction];
        let observer = inputTaskInstance[input.eventaction];

        if (!(output.eventaction in outputTaskInstance)) {
          throw new Error(`Could not find ${output.eventaction} in task ${output.task.name}`); }
        if (!(input.eventaction in inputTaskInstance)) {
          throw new Error(`Could not find ${input.eventaction} in task ${input.task.name}`); }

        observable.subscribe({next: observer.bind(inputTaskInstance)});

        // link recursively.
        // TODO: Check for circular references.
        this._link(input.task, inputTaskInstance);
      });
    });
  }
}
