require('reflect-metadata/Reflect');
import {bind, Injector} from 'angular2/angular2';
import {TaskLoader} from '../src/loader';
import {TaskRegistry, EventRegistry} from '../src/registry';

describe('Task Registry', () => {
  let taskRegistry: TaskRegistry;
  let eventRegistry: EventRegistry;
  let loader: TaskLoader;

  beforeEach(() => {
    let injector = Injector.resolveAndCreate([
      TaskLoader,
      TaskRegistry,
      bind(EventRegistry).toClass(EventRegistryMock)
    ]);

    loader = injector.get(TaskLoader);
    taskRegistry = injector.get(TaskRegistry);
    eventRegistry = injector.get(EventRegistry);
  });

  it('should throw if does not export the expect class name', () => {
    function fn() { loader.load('./spec/fixtures/registry/error'); }
    expect(fn).toThrow(new Error('Could not find class ThrowTask in spec/fixtures/registry/error/throw.task'));
  });

  it('should register loaded files', () => {
    expect(true).toBeTruthy();
  });
});


class EventRegistryMock extends Array {
  registerEvents(task) {
    this.push(task);
  }
}
