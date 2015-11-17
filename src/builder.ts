import {Injectable} from 'angular2/angular2';
import {AppInjector} from './injector';
import {TaskLoader} from './loader';
import {SequenceRegistry, TaskRegistry} from './registry';
import {TaskRunner} from './runner';


let builderInstance: Builder;


@Injectable()
export class Builder {
  constructor(private _loader: TaskLoader,
              private _sequenceRegistry: SequenceRegistry,
              private _taskRegistry: TaskRegistry,
              private _runner: TaskRunner) {
  }
  static init(coreProviders: any[], buildProviders?: any[]): void {
    let appInjector = AppInjector.init(coreProviders, buildProviders || []);
    builderInstance = appInjector.get(Builder);
  }
  static load(path: string | string[]): void {
    builderInstance._loader.load(path);
  }
  static task(name: string, sequence: any[]): void {
    builderInstance._sequenceRegistry.add(name, sequence);
  }
  static start(taskname: string): void {
    builderInstance._runner.run(taskname);
  }
}
