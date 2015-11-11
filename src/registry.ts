import {Injectable} from 'angular2/angular2';
import {find, where} from 'lodash';
import {join} from 'path';
import {TaskMetadata} from './metadata';
import {classifyName, parseInstruction} from './utils';

// TODO: add isAsync, injector
export interface TaskEntry {
  isVirtual: boolean;
  filename: string;
  taskname: string;
  classname: string;
  task: any;
}

export interface VirtualTaskEntry {
  isVirtual: boolean;
  taskname: string;
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
  find<TaskEntry,VirtualTaskEntry>(query: any) {
    return find(this, query);
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
        let eventEntry: EventEntry = {type,
                                      eventname: event.name,
                                      eventaction: event.action || event.name,
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


@Injectable()
export class TaskRegistry extends Registry {
  constructor(private _eventRegistry: EventRegistry) {
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

      // let exist = this.find({taskname});
      // if (exist) {
      //   throw new Error(`Task ${taskname} is already registered from ${exist.filename}`); }

      let taskEntry: TaskEntry = {filename, taskname, classname, task, isVirtual};
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
