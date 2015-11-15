import {classifyName, methodifyName, parseInstruction} from '../src/utils';

describe('Utils', () => {
  describe('Classify Name', () => {
    it('should transform a string', () => {
      expect(classifyName('filename')).toEqual('Filename');
      expect(classifyName('Filename')).toEqual('Filename');
      expect(classifyName('FILENAME')).toEqual('Filename');
      expect(classifyName('file.name')).toEqual('FileName');
      expect(classifyName('file_name')).toEqual('FileName');
      expect(classifyName('file-name')).toEqual('FileName');
      expect(classifyName(' filename ')).toEqual('Filename');
      expect(classifyName('_filename_')).toEqual('Filename');
      expect(classifyName(' _a-much.longer filename_ ')).toEqual('AMuchLongerFilename');
    });
  });

  describe('Methodify Name', () => {
    it('should transform a string', () => {
      expect(methodifyName('filename')).toEqual('filename');
      expect(methodifyName('Filename')).toEqual('filename');
      expect(methodifyName('fileName')).toEqual('fileName');
      expect(methodifyName('file.name')).toEqual('fileName');
      expect(methodifyName('file-name')).toEqual('fileName');
      expect(methodifyName('file_name')).toEqual('fileName');
      expect(methodifyName(' file-name ')).toEqual('fileName');
      expect(methodifyName(' _file-name_ ')).toEqual('fileName');
    });
  });

  describe('PArse Instruction', () => {
    it('should parse the instruction', () => {
      var expected = { name: 'name', action: 'action' };
      expect(parseInstruction('name:action')).toEqual(expected);
      expect(parseInstruction('name: action')).toEqual(expected);
      expect(parseInstruction('name : action')).toEqual(expected);
      expect(parseInstruction(' name : action ')).toEqual(expected);
      expect(parseInstruction(' name : Action ')).toEqual(expected);
    });
  });
});
