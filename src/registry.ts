import {find} from 'lodash';

class Registry extends Array {
  // TODO: Check if these types are required.
  find(query: any): any {
    return find(this, query);
  }
}

export class TaskRegistry extends Registry {
  add(name: string, token: any): void {
    this.push({ name, token });
  }
}

export class SequenceRegistry extends Registry {
  add(name: string, sequence: string[]) {
    this.push({ name, sequence });
  }
}

export interface TaskEntry {
  name: string;
  token: any;
}

export interface SequenceEntry {
  name: string;
  sequence: string[];
}
