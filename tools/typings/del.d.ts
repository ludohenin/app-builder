declare module 'del' {
  function del(path: string | string[], cb: Function): void;
  module del {}
  export = del;
}
