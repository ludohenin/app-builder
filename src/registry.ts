import {Injectable} from 'angular2/angular2';
import * as _ from 'lodash';
import {join} from 'path';
import {classifyName, parseInstruction} from './utils';
import {TaskMetadata} from './metadata';


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
  // TODO: Check if this types are required.
  find<TaskEntry,VirtualTaskEntry>(query: any) {
    return _.find(this, query);
  }
}


@Injectable()
export class EventRegistry extends Registry {
  private static getTaskMetadata(annotations: any[]): TaskMetadata {
    return _.find((annotations), (annotation) => annotation instanceof TaskMetadata);
  }
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
  getOutputs(task: any): EventEntry[] {
    return _.where(this, {task, type: 'outputs'});
  }
  getInputs(eventname: string): EventEntry[] {
    return _.where(this, {eventname, type: 'inputs'});
  }
}


@Injectable()
export class TaskRegistry extends Registry {
  constructor(private _eventRegistry: EventRegistry) {
    super();
  }
  registerLoadedTask(path: string): (taskname: string) => void {
    return (taskname: string): void => {
      let filename = join(path, taskname);
      let filename_abs = join(process.cwd(), filename);
      let classname = classifyName(taskname);
      let task = require(filename_abs)[classname];
      let isVirtual = false;

      // let exist = this.find({taskname});
      // if (!task) {
      //   throw new Error (`Could not find class ${classname} in ${filename}`); }
      // if (exist) {
      //   throw new Error(`Task ${taskname} is already registered from ${exist.filename}`); }

      let taskEntry: TaskEntry = {filename, taskname, classname, task, isVirtual};
      this.push(taskEntry);

      this._eventRegistry.registerEvents(task);
    };
  }
  registerVirtualTask(taskname: string, sequence: string[]): void {
    let isVirtual = true;
    let taskEntry: VirtualTaskEntry = {taskname, sequence, isVirtual};

    this.push(taskEntry);
  }
}
