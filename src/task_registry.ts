import {Injectable} from 'angular2/core';
import * as _ from 'lodash';
import {join} from 'path';
import {classifyName} from './utils';
import {TaskMetadata} from './task_metadata';


export interface TaskEntry {
  filename: string;
  taskname: string;
  classname: string;
  task: any;
}

export interface EventEntry {
  type: string;
  event: string;
  task: any;
}

class Registry extends Array {
  reset(): void {
    this.splice(0, this.length);
  }
  find(query): TaskEntry {
    return _.find(this, query);
  }
}

@Injectable()
export class EventRegistry extends Registry {
  private static getTaskMetadata(annotations: any[]): TaskMetadata {
    return _.find((annotations), (annotation) => annotation instanceof TaskMetadata);
  }
  registerEvents(task: TaskMetadata): void {
    let annotations = Reflect.getOwnMetadata('annotations', task) || [];
    let annotation = EventRegistry.getTaskMetadata(annotations);

    ['inputs', 'outputs'].forEach(type => {
      if (!annotation.options) return;
      let events = annotation.options[type] || [];
      events.forEach((event) => {
        // TODO: Normalize event name my-event.name => myEventName()
        let eventEntry: EventEntry = {type, event, task};
        this.push(eventEntry);
      });
    });
  }
  getOutputs(task: any) {
    return _.where(this, {task, type: 'outputs'});
  }
  getInputs(event: string) {
    return _.where(this, {event, type: 'inputs'});
  }
}

@Injectable()
export class TaskRegistry extends Registry {
  constructor(private _eventRegistry: EventRegistry) {
    super();
  }
  registerTask(path: string): (taskname: string) => void {
    return (taskname: string): void => {
      let filename = join(path, `${taskname}`);
      let filename_abs = join(process.cwd(), filename);
      let classname = classifyName(taskname);
      let task = require(filename_abs)[classname];

      // let exist = this.find({taskname});
      // if (!task) {
      //   throw new Error (`Could not find class ${classname} in ${filename}`); }
      // if (exist) {
      //   throw new Error(`Task ${taskname} is already registered from ${exist.filename}`); }

      // Register tasks.
      let taskEntry: TaskEntry = {filename, taskname, classname, task};
      this.push(taskEntry);
      // Register task events.
      this._eventRegistry.registerEvents(task);
    };
  }
}
