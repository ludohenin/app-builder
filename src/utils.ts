/**
 * Tansform a string into PascalNameCase.
 * #example: my.string-to_transfrom => MyStringToTransfrom
 */
export function classifyName(name: string): string {
  return name.toLowerCase()
    // Replaces any -, _ or . characters with a space.
    .replace(/[-_\.]+/g, ' ')
    // Removes any non alphanumeric characters.
    .replace(/[^\w\s]/g, '')
    // Uppercases the first character in each group.
    .replace(/^./, $1 => $1.toUpperCase())
    .replace(/ (.)/g, $1 => $1.toUpperCase())
    // Removes spaces.
    .replace(/ /g, '' );
}
