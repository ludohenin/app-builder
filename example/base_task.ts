export class BaseTask {
  gulp: any;
  plugins: any;
  config: any;
  constructor() {
    console.log(`> ${this.constructor.name} instantiated`);
  }
  default() {
    console.log(`> ${this.constructor.name} ran default() (method not implemented)`);
  }
}


// @Injectable()
// export class BaseTask {
//   constructor(/*public gulp: Gulp,
//               public plugins: GulpPlugins,
//               public config: Config*/) {
//     console.log(`> ${this.constructor.name} instantiated`);
//   }
//   default() {
//     console.log(`> ${this.constructor.name} ran default() (method not implemented)`);
//   }
// }
