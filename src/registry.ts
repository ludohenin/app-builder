// TODO: Rename this file to `register`.
import {forwardRef, Inject, Injectable} from 'angular2/angular2';
import {find, where} from 'lodash';
import {join} from 'path';
import {TaskMetadata} from './metadata';
import {classifyName, parseInstruction} from './utils';

interface TaskEntry {
  isVirtual: boolean;
  taskname: string;
}

// TODO: add isAsync, injector.
export interface LoadedTaskEntry extends TaskEntry {
  filename: string;
  classname: string;
  task: any;
}

export interface VirtualTaskEntry extends TaskEntry {
  sequence: string[];
}

export interface EventEntry {
  type: string;
  eventname: string;
  eventaction: string;
  task: any;
}

export interface EventInstruction {
  name: string;
  action: string;
}

class Registry extends Array {
  // TODO: Check if these types are required.
  find<LoadedTaskEntry,VirtualTaskEntry>(query: any) {
    return find(this, query);
  }
}


// NOTE: Should every task be registered as an observable?
//       Would enable observers to subscribe without manually declaring observables.
//       But maybe not such a good idea. Declarative way of registring a root task
//       reponsible to trigger the event seems more reliable.
//       One solution could be to only register as observable virtual tasks.
@Injectable()
export class TaskRegistry extends Registry {
  constructor(@Inject(forwardRef(() => EventRegistry)) private _eventRegistry) {
    super();
  }
  /**
   * Register tasks from loaded task files.
   * Task files must export a class whose name is a classified name of the
   * file name.
   * #example: my.awesome.task.ts => export MyAwesomeTask {}
   */
  registerLoadedTask(path: string): (taskname: string) => void {
    return (taskname: string): void => {
      let filename = join(path, taskname);
      let filename_abs = join(process.cwd(), filename);
      let classname = classifyName(taskname);
      let task = require(filename_abs)[classname];
      let isVirtual = false;

      if (!task) {
        throw new Error (`Could not find class ${classname} in ${filename}`); }

      // TODO: Find a way to handle identical file names from different origin (forbid or namespace ?).
      // let exist = this.find({taskname});
      // if (exist) {
      //   throw new Error(`Task ${taskname} is already registered from ${exist.filename}`); }

      let taskEntry: LoadedTaskEntry = {filename, taskname, classname, task, isVirtual};
      this.push(taskEntry);

      this._eventRegistry.registerEvents(task);
    };
  }
  /**
   * Register virtal tasks.
   * Typical use case is to define sequences of loaded tasks.
   * TODO: See if it would make sense to not only be able to pass array os string but Types or Types[].
   */
  registerVirtualTask(taskname: string, sequence: string[]): void {
    let isVirtual = true;
    let taskEntry: VirtualTaskEntry = {taskname, sequence, isVirtual};

    this.push(taskEntry);
  }
}


@Injectable()
export class EventRegistry extends Registry {
  private static getTaskMetadata(annotations: any[]): TaskMetadata {
    return find((annotations), (annotation) => annotation instanceof TaskMetadata);
  }
  /**
   * Register events using the decorated Type to retrieve the options.
   * Event string can map to internal task class observables and observers.
   * #example: inputs: ['build:onbuild'] => eventname : property/method name.
   */
  registerEvents(task: any): void {
    let annotations = Reflect.getOwnMetadata('annotations', task) || [];
    let annotation = EventRegistry.getTaskMetadata(annotations);

    ['inputs', 'outputs'].forEach(type => {
      if (!annotation.options) return;
      let events: string[] = annotation.options[type] || [];
      events.forEach((EventInstruction) => {
        let event = parseInstruction(EventInstruction);
        let eventaction = event.action || (type === 'inputs' ? 'default' : event.name);
        let eventEntry: EventEntry = {type,
                                      eventname: event.name,
                                      eventaction,
                                      task};
        this.push(eventEntry);
      });
    });
  }
  /**
   * Get observables map.
   */
  getOutputs(task: any): EventEntry[] {
    return where(this, {task, type: 'outputs'});
  }
  /**
   * Get observers map.
   */
  getInputs(eventname: string): EventEntry[] {
    return where(this, {eventname, type: 'inputs'});
  }
}
