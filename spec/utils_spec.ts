import {classifyName} from '../src/utils';


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
});
