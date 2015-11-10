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
  return name.toLowerCase()
    .replace( /[-_\.]+/g, ' ')
    .trim()
    .replace( /[^\w\s]/g, '')
    .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
    .replace( / /g, '' );
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
  let action = frags[1] ? methodifyName(frags[1]) : undefined;

  return {name, action};
}
