import {Injectable} from 'angular2/angular2';
import {series} from 'async';
import {isFunction} from 'lodash';
import {EventRegistry, LoadedTaskEntry, TaskRegistry, VirtualTaskEntry} from './registry';
import {AppInjector} from './injector';
import {hasAsyncCallback, parseInstruction} from './utils';


export interface TaskInstruction {
  name: string;
  action: string;
}

interface AsyncFunction {
  (fn: () => void): void;
}


@Injectable()
export class TaskRunner {
  private _sequence: string[] = [];
  private _queue: AsyncFunction[] = [];
  constructor(private _taskRegistry: TaskRegistry,
              private _eventRegistry: EventRegistry) {
  }
  run(taskInstruction: string): void {
    let task = parseInstruction(taskInstruction);
    let taskEntry = this._taskRegistry.find({taskname: task.name});

    if (taskEntry.isVirtual) {
      this._runVirtual(taskEntry);
    } else {
      this._runSingle(taskInstruction);
    }
  }
  private _run() {
    console.log(this._queue);
    series(this._queue, function (err) {
      if (err) console.log(err);
      console.log('Completed');
    });
  }
  private _runSingle(taskInstruction: string): void {
    this._addTask(taskInstruction);
    this._run();
  }
  private _runVirtual(taskEntry: VirtualTaskEntry): void {
    this._buildSequence(taskEntry);
    this._sequence.forEach(instruction => this._addTask.call(this, instruction));
    this._run();
  }
  private _addTask(taskInstruction: string) {
    let task = parseInstruction(taskInstruction);
    let taskEntry = this._taskRegistry.find({taskname: task.name});

    if (!taskEntry) {
      throw new Error(`Could not find task ${task.name}, task not registered`); }

    let taskInstance = this._getTaskInstance(taskEntry);
    let taskAction: string;

    if (task.action) {
      if (!taskInstance[task.action]) {
        throw new Error(`Could not find method ${task.action} in class ${taskInstance.constructor.name}`); }
      taskAction = task.action;
    } else {
      if (!taskInstance['default']) {
        throw new Error(`Class ${taskInstance.constructor.name} has no default method`); }
      taskAction = 'default';
    }

    this._queue.push(done => {
      let isAsync = hasAsyncCallback(taskInstance[taskAction]);
      taskInstance[taskAction].call(taskInstance, isAsync ? done : null);
      if (isAsync) done();
    });
  }
  // TODO: Move to register class.
  private _getTaskInstance(taskEntry: LoadedTaskEntry): any {
    let taskClass = taskEntry.task;
    let taskInstance = AppInjector.injector.resolveAndInstantiate(taskClass);

    // Inject task dependencies.
    // Done this way to reduce constructor injection boilerplate of task class.
    // NOTE: Injected providers are not accessible at instanciation time.
    AppInjector.taskProviders.forEach((provider) => {
      let token = provider.token;
      let tokenname: string = isFunction(token) ? token.name : token;
      let propname: string = tokenname.charAt(0).toLowerCase() + tokenname.slice(1);
      taskInstance[propname] = AppInjector.injector.get(token);
    });

    this._link(taskClass, taskInstance);

    return taskInstance;
  }
  private _buildSequence(taskEntry: VirtualTaskEntry): void {
    taskEntry.sequence.forEach(taskInstruction => {
      let task = parseInstruction(taskInstruction);
      let taskEntry = this._taskRegistry.find({taskname: task.name});

      if (taskEntry.isVirtual) {
        this._buildSequence(taskEntry);
      } else {
        this._sequence.push(taskInstruction);
      }
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
