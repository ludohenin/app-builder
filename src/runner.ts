import {Injectable} from 'angular2/angular2';
import {series} from 'async';
import {isFunction} from 'lodash';
import {AppInjector} from './injector';
import {hasAsyncCallback, parseInstruction} from './utils';
import {SequenceEntry, SequenceRegistry, TaskEntry, TaskRegistry} from './registry';

// TODO: See if parseInstruction can't be replace by getAction.

@Injectable()
export class TaskRunner {
  private _taskSequence: TaskInstruction[];
  private _queue;
  constructor(private _taskRegistry: TaskRegistry,
              private _sequenceRegistry: SequenceRegistry) {
  }
  run(instruction) {
    this._taskSequence = [];
    this._queue = [];
    let taskInstruction = this._getTaskInstruction(instruction);

    if (taskInstruction) {
      this._addTask(taskInstruction);
    } else {
      let sequenceInstruction = this._sequenceRegistry.find({ name: instruction });
      this._buildSequence(sequenceInstruction.sequence);
      this._taskSequence.forEach(taskInstruction => this._addTask(taskInstruction));
    }

    series(this._queue, function (err) {
      if (err) console.log(err);
      console.log('Completed');
    });
  }
  private _addTask(taskInstruction: TaskInstruction) {
    let taskInstance = this._getTaskInstance(taskInstruction.token);
    let action: string = taskInstruction.action;

    if (!taskInstance[action]) {
      throw new Error(`Could not find method ${action} in class ${taskInstance.constructor.name}`); }

    this._queue.push(done => {
      let isAsync = hasAsyncCallback(taskInstance[action]);
      taskInstance[action].call(taskInstance, isAsync ? done : null);
      if (!isAsync) done(null);
    });
  }
  private _getTaskInstance(taskClass: any): any {
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

    // this._link(taskClass, taskInstance);

    return taskInstance;
  }
  private _buildSequence(sequence: string[]): void {
    sequence.forEach(instruction => {
      let taskInstruction = this._getTaskInstruction(instruction);

      if (taskInstruction) {
        this._taskSequence.push(taskInstruction);
      } else {
        let sequenceEntry: SequenceEntry = this._sequenceRegistry.find({ name: instruction });
        this._buildSequence(sequenceEntry.sequence);
      }
    });
  }
  private _getTaskInstruction(instruction: string): TaskInstruction {
    let taskInstruction = parseInstruction(instruction);
    let taskEntry = this._taskRegistry.find({ name: taskInstruction.name });
    if (!taskEntry) return undefined;
    return {
      name: taskEntry.name,
      token: taskEntry.token,
      action: taskInstruction.action
    };
  }
}

// TODO: Rename interface TaskInstruction
interface TaskInstruction {
  name: string;
  token: any;
  action: string;
}
