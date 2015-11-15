import {
  classifyName,
  hasAsyncCallback,
  methodifyName,
  parseInstruction
} from '../src/utils';


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

  describe('Parse Instruction', () => {
    it('should parse the instruction', () => {
      var expected = { name: 'name', action: 'action' };
      expect(parseInstruction('name:action')).toEqual(expected);
      expect(parseInstruction('name: action')).toEqual(expected);
      expect(parseInstruction('name : action')).toEqual(expected);
      expect(parseInstruction(' name : action ')).toEqual(expected);
      expect(parseInstruction(' name : Action ')).toEqual(expected);
    });
  });

  describe('Has Async Callback', () => {
    it('should check if the passed function has an async callback', () => {
      var a = function() {/*noop*/};
      var b = function () {/*noop*/};
      var c = function myFunction() {/*noop*/};
      var d = function(done) {/*noop*/};
      var e = function (done) {/*noop*/};
      var f = function myOtherFunction(done) {/*noop*/};

      expect(hasAsyncCallback(a)).toEqual(false);
      expect(hasAsyncCallback(b)).toEqual(false);
      expect(hasAsyncCallback(c)).toEqual(false);
      expect(hasAsyncCallback(d)).toEqual(true);
      expect(hasAsyncCallback(e)).toEqual(true);
      expect(hasAsyncCallback(f)).toEqual(true);
    });
  });
});
