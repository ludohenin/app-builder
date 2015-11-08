import {Injectable} from 'angular2/core';
import {readdirSync, existsSync, lstatSync} from 'fs';
import * as _ from 'lodash';
import {join} from 'path';

import {TaskRegistry} from './task_registry';

@Injectable()
export class TaskLoader {
  constructor(private _registry: TaskRegistry) {
  }
  public static scandir(path: string, callback: (taskname: string) => any): void {
    if (!existsSync(path)) return;

    walk(path);

    function walk(path) {
      readdirSync(path).forEach(function(file) {
        let curPath = join(path, file);
        // if (lstatSync(curPath).isDirectory()) { // recurse
        //   path = file;
        //   walk(curPath);
        // }
        if (lstatSync(curPath).isFile() && file.endsWith('.ts')) {
          let taskname = file.replace(/(\.ts)/, '');
          callback(taskname);
        }
      });
    }
  }
  load(path: string | string[]): void {
    let paths = _.isArray(path) ? path : [path];
    paths.forEach(path => TaskLoader.scandir(path, this._registry.registerTask(path)));
  }
}
