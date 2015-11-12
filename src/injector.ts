import {Injector} from 'angular2/angular2';

// TODO: Add method makeInjector for Task decorator declaring providers.
let initialized: boolean = false;

export class AppInjector {
  private static _injector: Injector;
  private static _rootInjector: Injector;
  static init(corProviders: any[], providers: any[]): Injector {
    if (initialized) {
      throw new Error('AppInjector can only be initialized once'); }

    AppInjector._rootInjector = Injector.resolveAndCreate(corProviders);
    AppInjector._injector = AppInjector._rootInjector.resolveAndCreateChild(providers);
    initialized = true;
    return AppInjector._injector;
  }
  static get(): Injector {
    return AppInjector._injector;
  }
}


export class TaskInjection {
}