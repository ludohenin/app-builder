import {Injectable} from 'angular2/angular2';
import {AppInjector} from './injector';
import {TaskLoader} from './loader';
import {TaskRegistry} from './registry';
import {TaskRunner} from './runner';


let builderInstance: Builder;

@Injectable()
export class Builder {
  constructor(private _taskRegistry: TaskRegistry,
              private _loader: TaskLoader,
              private _runner: TaskRunner) {
  }
  static init(coreProviders: any[], buildProviders?: any[]): void {
    let appInjector = AppInjector.init(coreProviders, buildProviders || []);
    builderInstance = appInjector.get(Builder);
  }
  static load(path: string | string[]): void {
    builderInstance._loader.load(path);
  }
  static task(taskname: string, sequence: any[]): void {
    builderInstance._taskRegistry.registerVirtualTask(taskname, sequence);
  }
  static start(taskname: string): void {
    builderInstance._runner.run(taskname);
  }
}
