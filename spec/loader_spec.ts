require('reflect-metadata/Reflect');
import {bind, Injector} from 'angular2/angular2';
import {TaskLoader} from '../src/loader';
import {TaskRegistry} from '../src/registry';

describe('Loader', () => {
  let loader: TaskLoader;
  let registry: TaskRegistryMock;

  beforeEach(() => {
    let injector = Injector.resolveAndCreate([
      TaskLoader,
      bind(TaskRegistry).toClass(TaskRegistryMock)
    ]);

    registry = injector.get(TaskRegistry);
    loader = injector.get(TaskLoader);
  });

  it('should have load method', () => {
    expect(loader.load).toEqual(jasmine.any(Function));
  });

  it('should load relative to cwd', () => {
    loader.load('./fixtures/loader');
    expect(registry.length).toEqual(0);
  });

  it('should load file and register them', () => {
    loader.load('./spec/fixtures/loader');
    expect(registry.length).toEqual(2);
    expect(registry[0]).toEqual('file1');
    expect(registry[1]).toEqual('file2');
  });

  it('should accept an array of path and load them', () => {
    loader.load([
      './spec/fixtures/loader',
      './spec/fixtures/loader/tasks'
    ]);
    expect(registry.length).toEqual(3);
    expect(registry[0]).toEqual('file1');
    expect(registry[1]).toEqual('file2');
    expect(registry[2]).toEqual('task1');
  });
});


// DI mock implementation.
class TaskRegistryMock extends Array {
  registerLoadedTask(path) {
    return (filename) => this.push(filename);
  }
}
