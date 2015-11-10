import {Injector, Injectable} from 'angular2/angular2';
import {TaskLoader} from './loader';
import {TaskRegistry, EventRegistry} from './registry';
import {TaskRunner} from './runner';


// TODO: Add method makeInjector for TaskMetadata declaring providers.
let initialized: boolean = false;

export class AppInjector {
  private static _injector: Injector;
  private static _rootInjector: Injector;
  static init(providers: any[]): Injector {
    if (initialized) {
      throw new Error('AppInjector can only be initialized once'); }

    const CORE_PROVIDERS = [
      Builder,
      EventRegistry,
      TaskLoader,
      TaskRegistry,
      TaskRunner
    ];

    AppInjector._rootInjector = Injector.resolveAndCreate(CORE_PROVIDERS);
    AppInjector._injector = AppInjector._rootInjector.resolveAndCreateChild(providers);
    initialized = true;
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
  task(taskname: string, sequence: any[]): void {
    this._taskRegistry.registerVirtualTask(taskname, sequence);
  }
}
