import {isFunction} from 'lodash';

/**
 * Tansform a string into PascalCase.
 * #example: my.string-to_transfrom => MyStringToTransfrom
 */
export function classifyName(name: string): string {
  return name.toLowerCase()
    .replace(/[-_\.]+/g, ' ')
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/^./, $1 => $1.toUpperCase())
    .replace(/ (.)/g, $1 => $1.toUpperCase())
    .replace(/ /g, '' );
}

/**
 * Tansform a string into camelCase.
 * #example: my.string-to_transfrom => myStringToTransfrom
 */
export function methodifyName(name: string): string {
  name = name.replace(/[-_\.]+/g, ' ');
  name = name.trim();
  return name.split(/[\s]+/g)
    .map((frag: string, i: number) => {
      return i > 0
        ? frag.charAt(0).toUpperCase() + frag.slice(1)
        : frag.charAt(0).toLowerCase() + frag.slice(1);
    }).join('');
}

/**
 * Extract name (task, event ...) and normalized method name.
 * #example: build:my-action => {name: build, method: myAction}
 */
export function parseInstruction(instruction: string): {
  name: string;
  action: string;
} {
  let frags = instruction.split(':');
  let name = frags[0].trim();
  let action = frags[1] ? methodifyName(frags[1]) : 'default';

  return {name, action};
}

/**
 * Test a function signature and if it has an argument.
 * In the context of this tool, this would mean it is an async callback.
 */
export function hasAsyncCallback(fn: (cb?: () => void) => void): boolean {
  if (!isFunction(fn)) return false;
  let re = /function(.*?)\(.+\)/;
  return re.test(fn.toString());
}
