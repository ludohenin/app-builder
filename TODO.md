
## TODOs

- Add method makeInjector for Task decorator declaring providers. `src/injector.ts` `:3`
- Rename this file to `register`. `src/registry.ts` `:1`
- Add isAsync, injector. `src/registry.ts` `:13`
- Check if these types are required. `src/registry.ts` `:37`
- Find a way to handle identical file names from different origin (forbid or namespace ?). `src/registry.ts` `:71`
- See if it would make sense to not only be able to pass array os string but Types or Types[]. `src/registry.ts` `:85`
- Handle async tasks (Gulp handes async callback, returned stream & returned promise). `src/runner.ts` `:32`
- Move this into AppInjector as static method. `src/runner.ts` `:41`
- Check if the methods exist on the instance, throw otherwise. `src/runner.ts` `:51`
- Check for circular references. `src/runner.ts` `:81`

## NOTEs

- See if recursive scaning is required. `src/loader.ts` `:20`
- Should every task be registered as an observable? `src/registry.ts` `:44`
- Injected providers are not accessible at instanciation time. `src/runner.ts` `:40`
