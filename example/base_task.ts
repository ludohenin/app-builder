export class BaseTask {
  // Properties declared to avoid compiler complaints.
  // They will be set later on dynamically from passed TASK_PROVIDERS.
  gulp: any;
  plugins: any;
  config: any;
  constructor() {
    console.log(`> ${this.constructor.name} instantiated`);
  }
  default(done?: () => void): void {
    console.log(`> ${this.constructor.name} ran default() (method not implemented)`);
  }
}
