import {Injectable} from 'angular2/angular2';
import {readdirSync, existsSync, lstatSync} from 'fs';
import {isArray} from 'lodash';
import {join} from 'path';
import {TaskRegistry} from './registry';


@Injectable()
export class TaskLoader {
  constructor(private _registry: TaskRegistry) {
  }
  private static scandir(path: string, callback: (taskname: string) => any): void {
    if (!existsSync(path)) return;

    walk(path);

    function walk(path: string): void {
      readdirSync(path).forEach(function(file) {
        let curPath = join(path, file);
        // NOTE: See if recursive scaning is required.
        if (lstatSync(curPath).isFile() && file.endsWith('.ts')) {
          let taskname = file.replace(/(\.ts)$/, '');
          callback(taskname);
        }
      });
    }
  }
  /**
   * Load task files and register them.
   */
  load(path: string | string[]): void {
    let paths = isArray(path) ? path : [path];
    paths.forEach(path => TaskLoader.scandir(path, this._registry.registerLoadedTask(path)));
  }
}
