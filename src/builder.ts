import {Injectable} from 'angular2/angular2';
import {AppInjector} from './injector';
import {TaskLoader} from './loader';
import {TaskRegistry} from './registry';
import {TaskRunner} from './runner';


@Injectable()
export class Builder {
  constructor(private _taskRegistry: TaskRegistry,
              private _loader: TaskLoader,
              private _runner: TaskRunner) {
  }
  public static init(coreProviders?: any[], buildProviders?: any[]): Builder {
    let appInjector = AppInjector.init(coreProviders, buildProviders || []);
    return appInjector.get(Builder);
  }
  load(path: string | string[]): void {
    this._loader.load(path);
  }
  start(taskname: string): void {
    this._runner.run(taskname);
  }
  task(taskname: string, sequence: any[]): void {
    this._taskRegistry.registerVirtualTask(taskname, sequence);
  }
}
