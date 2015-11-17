import {AppInjector} from './injector';
import {TaskRegistry} from './registry';

export function Task(options: {
  name: string;
}) {
  return function (target: any) {
    let taskRegistry: TaskRegistry = AppInjector.get(TaskRegistry);
    taskRegistry.add(options.name, target);

    return target;
  }
}
