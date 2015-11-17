import {forwardRef, Inject, Injectable} from 'angular2/angular2';
import {readdirSync, existsSync, lstatSync} from 'fs';
import {isArray} from 'lodash';
import {join} from 'path';


@Injectable()
export class TaskLoader {
  constructor(@Inject(forwardRef(() => Loader)) private _loader: ILoader) {
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
    paths.forEach(path => TaskLoader.scandir(path, this._loader.load(path)));
  }
}


@Injectable()
export class Loader implements ILoader {
  load(path: string): (taskname: string) => void {
    return (taskname: string): void => {
      let filename = join(path, taskname);
      let filename_abs = join(process.cwd(), filename);
      require(filename_abs);
    };
  }
}


export interface ILoader {
  load(path: string): (taskname: string) => void
}
