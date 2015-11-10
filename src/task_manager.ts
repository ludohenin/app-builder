import {Injector, Injectable} from 'angular2/core';
import {TaskLoader} from './task_loader';
import {TaskRegistry, EventRegistry} from './task_registry';
import {TaskRunner} from './task_runner';


export class AppInjector {
  private static _injector: Injector;
  private static _rootInjector: Injector;
  static init(providers: any[]): Injector {
    const CORE_PROVIDERS = [
      TaskRegistry,
      EventRegistry,
      Builder,
      TaskLoader,
      TaskRunner
    ];

    AppInjector._rootInjector = Injector.resolveAndCreate(CORE_PROVIDERS);
    // TODO: Allow to init only once.
    AppInjector._injector = AppInjector._rootInjector.resolveAndCreateChild(providers);
    return AppInjector._injector;
  }
  static get(): Injector {
    return AppInjector._injector;
  }
}


@Injectable()
export class Builder {
  constructor(private _taskRegistry: TaskRegistry,
              private _loader: TaskLoader,
              private _runner: TaskRunner) {
  }
  public static init(providers?: any[]): Builder {
    // TODO: See if all events can be linked here for easy debugging.
    let appInjector = AppInjector.init(providers || []);
    return appInjector.get(Builder);
  }
  load(path: string | string[]): void {
    this._loader.load(path);
  }
  start(taskname: string): void {
    this._runner.run(taskname);
  }
  task(taskname: string, sequence: any[]) {
    this._taskRegistry.registerVirtualTask(taskname, sequence);
  }
}
