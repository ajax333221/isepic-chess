const { Ic } = require('../isepic-chess');

Ic.setSilentMode(false);

describe('Ic utility methods', () => {
  test('Ic.utilityMisc.consoleLog()', () => {
    Ic.setSilentMode(true);
    expect(Ic.utilityMisc.consoleLog("this doesn't print because the silent mode")).toBe(false);
    Ic.setSilentMode(false);

    //expect(Ic.utilityMisc.consoleLog("this gets printed when not commented out")).toBe(true);
  });

  test('Ic.utilityMisc.isObject()', () => {
    expect(Ic.utilityMisc.isObject({})).toBe(true);
    expect(Ic.utilityMisc.isObject({ hello: 'world' })).toBe(true);
    expect(
      Ic.utilityMisc.isObject(
        Ic.fenGet('8/3k4/3p4/8/2P5/2KP4/8/8 w - - 0 1', 'squares', { skipFenValidation: true }).squares['c3']
      )
    ).toBe(true);
    expect(Ic.utilityMisc.isObject({ bos: 'this technically is a square' })).toBe(true);
    expect(Ic.utilityMisc.isObject(Ic.initBoard())).toBe(true);
    expect(Ic.utilityMisc.isObject({ boardName: 'this technically is a board' })).toBe(true);
    expect(Ic.utilityMisc.isObject([])).toBe(false);
    expect(Ic.utilityMisc.isObject(['hello', 'world', '!'])).toBe(false);
    expect(Ic.utilityMisc.isObject(null)).toBe(false);
  });

  test('Ic.utilityMisc.isArray()', () => {
    expect(Ic.utilityMisc.isArray({})).toBe(false);
    expect(Ic.utilityMisc.isArray({ hello: 'world' })).toBe(false);
    expect(
      Ic.utilityMisc.isArray(
        Ic.fenGet('8/3k4/3p4/8/2P5/2KP4/8/8 w - - 0 1', 'squares', { skipFenValidation: true }).squares['c3']
      )
    ).toBe(false);
    expect(Ic.utilityMisc.isArray({ bos: 'this technically is a square' })).toBe(false);
    expect(Ic.utilityMisc.isArray(Ic.initBoard())).toBe(false);
    expect(Ic.utilityMisc.isArray({ boardName: 'this technically is a board' })).toBe(false);
    expect(Ic.utilityMisc.isArray([])).toBe(true);
    expect(Ic.utilityMisc.isArray(['hello', 'world', '!'])).toBe(true);
    expect(Ic.utilityMisc.isArray(null)).toBe(false);
  });

  test('Ic.utilityMisc.isSquare()', () => {
    expect(Ic.utilityMisc.isSquare({})).toBe(false);
    expect(Ic.utilityMisc.isSquare({ hello: 'world' })).toBe(false);
    expect(
      Ic.utilityMisc.isSquare(
        Ic.fenGet('8/3k4/3p4/8/2P5/2KP4/8/8 w - - 0 1', 'squares', { skipFenValidation: true }).squares['c3']
      )
    ).toBe(true);
    expect(Ic.utilityMisc.isSquare({ bos: 'this technically is a square' })).toBe(true);
    expect(Ic.utilityMisc.isSquare(Ic.initBoard())).toBe(false);
    expect(Ic.utilityMisc.isSquare({ boardName: 'this technically is a board' })).toBe(false);
    expect(Ic.utilityMisc.isSquare([])).toBe(false);
    expect(Ic.utilityMisc.isSquare(['hello', 'world', '!'])).toBe(false);
    expect(Ic.utilityMisc.isSquare(null)).toBe(false);
  });

  test('Ic.utilityMisc.isBoard()', () => {
    expect(Ic.utilityMisc.isBoard({})).toBe(false);
    expect(Ic.utilityMisc.isBoard({ hello: 'world' })).toBe(false);
    expect(
      Ic.utilityMisc.isBoard(
        Ic.fenGet('8/3k4/3p4/8/2P5/2KP4/8/8 w - - 0 1', 'squares', { skipFenValidation: true }).squares['c3']
      )
    ).toBe(false);
    expect(Ic.utilityMisc.isBoard({ bos: 'this technically is a square' })).toBe(false);
    expect(Ic.utilityMisc.isBoard(Ic.initBoard())).toBe(true);
    expect(Ic.utilityMisc.isBoard({ boardName: 'this technically is a board' })).toBe(true);
    expect(Ic.utilityMisc.isBoard([])).toBe(false);
    expect(Ic.utilityMisc.isBoard(['hello', 'world', '!'])).toBe(false);
    expect(Ic.utilityMisc.isBoard(null)).toBe(false);
  });

  describe('Ic.utilityMisc.isMove()', () => {
    test('should return true', () => {
      var temp;

      temp = { fromBos: 'a2', toBos: 'a3' };
      expect(Ic.utilityMisc.isMove(temp)).toBe(true);

      temp = { fromBos: 'a2', toBos: 'a3', someExtraKey: 9 };
      expect(Ic.utilityMisc.isMove(temp)).toBe(true);

      temp = { fromBos: '', toBos: '' };
      expect(Ic.utilityMisc.isMove(temp)).toBe(true);
    });

    test('should return false', () => {
      var temp;

      temp = {};
      expect(Ic.utilityMisc.isMove(temp)).toBe(false);

      temp = { fromBos: 'a2' };
      expect(Ic.utilityMisc.isMove(temp)).toBe(false);

      temp = { toBos: 'a3' };
      expect(Ic.utilityMisc.isMove(temp)).toBe(false);

      temp = { fromBos: true, toBos: true };
      expect(Ic.utilityMisc.isMove(temp)).toBe(false);
    });
  });

  test('Ic.utilityMisc.trimSpaces()', () => {
    expect(Ic.utilityMisc.trimSpaces('  abc')).toBe('abc');
    expect(Ic.utilityMisc.trimSpaces('abc  ')).toBe('abc');
    expect(Ic.utilityMisc.trimSpaces('a  b  c')).toBe('a b c');
    expect(Ic.utilityMisc.trimSpaces('  a  b c ')).toBe('a b c');
    expect(Ic.utilityMisc.trimSpaces(' ')).toBe('');
    expect(Ic.utilityMisc.trimSpaces('     ')).toBe('');
    expect(Ic.utilityMisc.trimSpaces('')).toBe('');
    expect(Ic.utilityMisc.trimSpaces('x' * 9)).toBe('NaN');
    expect(Ic.utilityMisc.trimSpaces()).toBe('undefined');
    expect(Ic.utilityMisc.trimSpaces([, 2, ' ', null, '', '  ', Infinity, '  a  b  ', 'x' * 9])).toBe(
      ',2, ,,, ,Infinity, a b ,NaN'
    );
  });

  test('Ic.utilityMisc.formatName()', () => {
    expect(Ic.utilityMisc.formatName(' a  Bc ')).toBe('a_Bc');
    expect(Ic.utilityMisc.formatName(' ')).toBe('');
    expect(Ic.utilityMisc.formatName('')).toBe('');
    expect(Ic.utilityMisc.formatName('ñ')).toBe('_');
    expect(Ic.utilityMisc.formatName('ññ')).toBe('_');
    expect(Ic.utilityMisc.formatName('ña')).toBe('_a');
    expect(Ic.utilityMisc.formatName('añ')).toBe('a_');
    expect(Ic.utilityMisc.formatName('_ñañ_')).toBe('_a_');
    expect(Ic.utilityMisc.formatName('ñ_ñañ_ñ')).toBe('_a_');
    expect(Ic.utilityMisc.formatName('a_ñ_a')).toBe('a_a');
  });

  test('Ic.utilityMisc.strContains()', () => {
    var str_base;

    str_base = 'abc de -5 6NaNf';

    expect(Ic.utilityMisc.strContains('', 'a')).toBe(false);
    expect(Ic.utilityMisc.strContains(str_base, 'x')).toBe(false);
    expect(Ic.utilityMisc.strContains(str_base, 'cd')).toBe(false);
    expect(Ic.utilityMisc.strContains(str_base, 'A')).toBe(false);
    expect(Ic.utilityMisc.strContains(str_base, -6)).toBe(false);

    expect(Ic.utilityMisc.strContains('', '')).toBe(true);
    expect(Ic.utilityMisc.strContains(str_base, '')).toBe(true);
    expect(Ic.utilityMisc.strContains(str_base, str_base)).toBe(true);
    expect(Ic.utilityMisc.strContains(str_base, 'a')).toBe(true);
    expect(Ic.utilityMisc.strContains(str_base, 'f')).toBe(true);
    expect(Ic.utilityMisc.strContains(str_base, 'c d')).toBe(true);
    expect(Ic.utilityMisc.strContains(str_base, ' ')).toBe(true);
    expect(Ic.utilityMisc.strContains(str_base, 5)).toBe(true);
    expect(Ic.utilityMisc.strContains(str_base, -5)).toBe(true);
    expect(Ic.utilityMisc.strContains(str_base, 'x' * 9)).toBe(true);
  });

  test('Ic.utilityMisc.occurrences()', () => {
    var str_base;

    str_base = ' ababABA  BABabab ';

    expect(Ic.utilityMisc.occurrences(str_base, '')).toBe(0);
    expect(Ic.utilityMisc.occurrences(str_base, ' ')).toBe(4);
    expect(Ic.utilityMisc.occurrences(str_base, str_base)).toBe(1);
    expect(Ic.utilityMisc.occurrences('', 'a')).toBe(0);
    expect(Ic.utilityMisc.occurrences('', '')).toBe(0);
    expect(Ic.utilityMisc.occurrences(str_base, 'x')).toBe(0);
    expect(Ic.utilityMisc.occurrences(str_base, 'a')).toBe(4);
    expect(Ic.utilityMisc.occurrences(str_base, 'ba')).toBe(2);
    expect(Ic.utilityMisc.occurrences(str_base, 'ab')).toBe(4);
    expect(Ic.utilityMisc.occurrences(str_base, 'bab')).toBe(2);
    expect(Ic.utilityMisc.occurrences('aAa', 'A')).toBe(1);
    expect(Ic.utilityMisc.occurrences('oóo', 'ó')).toBe(1);
    expect(Ic.utilityMisc.occurrences('1', 1)).toBe(0);
    expect(Ic.utilityMisc.occurrences(1, '1')).toBe(0);
    expect(Ic.utilityMisc.occurrences(1, 1)).toBe(0);
    expect(Ic.utilityMisc.occurrences(' abc Ddd  eEfFgGhHiIII  jk ', 'e|D|k|i|x')).toBe(4);
  });

  test('Ic.utilityMisc.toInt()', () => {
    expect(Ic.utilityMisc.toInt(1.1)).toBe(1);
    expect(Ic.utilityMisc.toInt(-1.1)).toBe(-1);
    expect(Ic.utilityMisc.toInt(2, -3, 3)).toBe(2);
    expect(Ic.utilityMisc.toInt(-4, -3, 3)).toBe(-3);
    expect(Ic.utilityMisc.toInt(4, -3, 3)).toBe(3);
    expect(Ic.utilityMisc.toInt(1, 3, -3)).toBe(-3);
    expect(Ic.utilityMisc.toInt(-8, 3, -3)).toBe(-3);
    expect(Ic.utilityMisc.toInt(8, 3, -3)).toBe(-3);
    expect(Ic.utilityMisc.toInt(-5.1, -7, 0)).toBe(-5);
    expect(Ic.utilityMisc.toInt(-9, -7, 0)).toBe(-7);
    expect(Ic.utilityMisc.toInt(9, -7, 0)).toBe(0);
    expect(Ic.utilityMisc.toInt(5.1, 0, 7)).toBe(5);
    expect(Ic.utilityMisc.toInt(-9, 0, 7)).toBe(0);
    expect(Ic.utilityMisc.toInt(9, 0, 7)).toBe(7);
    expect(Ic.utilityMisc.toInt('4.1')).toBe(4);
    expect(Ic.utilityMisc.toInt('-4.1')).toBe(-4);
    expect(Ic.utilityMisc.toInt('x')).toBe(0);
    expect(1 / Ic.utilityMisc.toInt(-0)).toBe(Infinity);
    expect(1 / Ic.utilityMisc.toInt(0)).toBe(Infinity);
    expect(Ic.utilityMisc.toInt(3, undefined, -5)).toBe(-5);
    expect(Ic.utilityMisc.toInt(-8, undefined, -5)).toBe(-8);
    expect(Ic.utilityMisc.toInt(3, -5, undefined)).toBe(3);
    expect(Ic.utilityMisc.toInt(-8, -5, undefined)).toBe(-5);
    expect(Ic.utilityMisc.toInt(0, 'x', 0)).toBe(0);
    expect(Ic.utilityMisc.toInt(-5, 'x', 5)).toBe(-5);
    expect(Ic.utilityMisc.toInt(0, 0, 'x')).toBe(0);
    expect(Ic.utilityMisc.toInt(5, -5, 'x')).toBe(5);
    expect(1 / Ic.utilityMisc.toInt(-5, -0, 5)).toBe(Infinity);
    expect(1 / Ic.utilityMisc.toInt(5, -5, -0)).toBe(Infinity);
    expect(Ic.utilityMisc.toInt()).toBe(0);
    expect(Ic.utilityMisc.toInt('')).toBe(0);
    expect(Ic.utilityMisc.toInt(false)).toBe(0);
    expect(Ic.utilityMisc.toInt(true)).toBe(1);
  });

  describe('Ic.utilityMisc.isIntOrStrInt()', () => {
    expect(Ic.utilityMisc.isIntOrStrInt(0)).toBe(true);
    expect(Ic.utilityMisc.isIntOrStrInt('0')).toBe(true);
    expect(Ic.utilityMisc.isIntOrStrInt(-0)).toBe(true);
    expect(Ic.utilityMisc.isIntOrStrInt('4')).toBe(true);
    expect(Ic.utilityMisc.isIntOrStrInt(-4)).toBe(true);
    expect(Ic.utilityMisc.isIntOrStrInt('-4')).toBe(true);
    expect(Ic.utilityMisc.isIntOrStrInt(4.0)).toBe(true); //4.0===4
    expect(Ic.utilityMisc.isIntOrStrInt(-4.0)).toBe(true); //-4.0===-4
    expect(Ic.utilityMisc.isIntOrStrInt(-Infinity)).toBe(true);
    expect(Ic.utilityMisc.isIntOrStrInt('-Infinity')).toBe(true);
    expect(Ic.utilityMisc.isIntOrStrInt(Infinity)).toBe(true);
    expect(Ic.utilityMisc.isIntOrStrInt('Infinity')).toBe(true);

    expect(Ic.utilityMisc.isIntOrStrInt('')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('x')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('x' * 9)).toBe(false); //NaN
    expect(Ic.utilityMisc.isIntOrStrInt()).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt(undefined)).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('undefined')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt(true)).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt(false)).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('true')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('false')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('-0')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt(4.1)).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('4.1')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt(-4.1)).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('-4.1')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('4.0')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('-4.0')).toBe(false);
    expect(Ic.utilityMisc.isIntOrStrInt('04')).toBe(false);
  });

  describe('Ic.utilityMisc.isNonEmptyStr()', () => {
    expect(Ic.utilityMisc.isNonEmptyStr('a')).toBe(true);
    expect(Ic.utilityMisc.isNonEmptyStr('  ')).toBe(true);
    expect(Ic.utilityMisc.isNonEmptyStr(' ')).toBe(true);

    expect(Ic.utilityMisc.isNonEmptyStr('')).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr()).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr(undefined)).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr(true)).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr(false)).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr('x' * 9)).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr(0)).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr(4)).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr(-Infinity)).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr(Infinity)).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr([])).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr(['a'])).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr({})).toBe(false);
    expect(Ic.utilityMisc.isNonEmptyStr({ a: 'a' })).toBe(false);
  });

  describe('Ic.utilityMisc.isNonBlankStr()', () => {
    expect(Ic.utilityMisc.isNonBlankStr('a')).toBe(true);

    expect(Ic.utilityMisc.isNonBlankStr('  ')).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr(' ')).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr('')).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr()).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr(undefined)).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr(true)).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr(false)).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr('x' * 9)).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr(0)).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr(4)).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr(-Infinity)).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr(Infinity)).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr([])).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr(['a'])).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr({})).toBe(false);
    expect(Ic.utilityMisc.isNonBlankStr({ a: 'a' })).toBe(false);
  });

  describe('Ic.utilityMisc.hashCode()', () => {
    test('default value', () => {
      var i, len, arr, default_val;

      default_val = 0;

      arr = [
        '',
        false,
        true,
        ,
        null,
        'x' * 9,
        {},
        [],
        [1],
        [1, 1, 1],
        0,
        1,
        8,
        -0,
        -1,
        -8,
        Infinity,
        -Infinity,
        [3, 8],
        [8, 3],
        [8, 8],
        [3, -1],
        [-1, 3],
        [-1, -1],
      ];

      for (i = 0, len = arr.length; i < len; i++) {
        //0<len
        expect(Ic.utilityMisc.hashCode(arr[i])).toBe(default_val);
      }
    });

    test('normal inputs', () => {
      expect(Ic.utilityMisc.hashCode('Aa')).toBe(2112);
      expect(Ic.utilityMisc.hashCode('Aa')).toBe(Ic.utilityMisc.hashCode('BB'));
      expect(Ic.utilityMisc.hashCode(' ')).toBe(32);
    });
  });

  test('Ic.utilityMisc.castlingChars()', () => {
    expect(Ic.utilityMisc.castlingChars()).toBe('');
    expect(Ic.utilityMisc.castlingChars(-9)).toBe('');
    expect(Ic.utilityMisc.castlingChars('-1')).toBe('');
    expect(Ic.utilityMisc.castlingChars(false)).toBe('');

    expect(Ic.utilityMisc.castlingChars(0)).toBe('');
    expect(Ic.utilityMisc.castlingChars(1)).toBe('k');
    expect(Ic.utilityMisc.castlingChars(2)).toBe('q');
    expect(Ic.utilityMisc.castlingChars(3)).toBe('kq');

    expect(Ic.utilityMisc.castlingChars(9)).toBe('kq');
    expect(Ic.utilityMisc.castlingChars('1')).toBe('k');
    expect(Ic.utilityMisc.castlingChars(true)).toBe('k');
  });

  describe('Ic.utilityMisc.unreferenceP()', () => {
    test('default value', () => {
      var i, len, arr, default_val;

      default_val = {};

      arr = [
        '',
        false,
        true,
        ,
        null,
        'x' * 9,
        {},
        [],
        [1],
        [1, 1, 1],
        0,
        1,
        8,
        -0,
        -1,
        -8,
        Infinity,
        -Infinity,
        [3, 8],
        [8, 3],
        [8, 8],
        [3, -1],
        [-1, 3],
        [-1, -1],
      ];

      for (i = 0, len = arr.length; i < len; i++) {
        //0<len
        Ic.setSilentMode(true);
        expect(Ic.utilityMisc.unreferenceP(arr[i])).toEqual(default_val);
        Ic.setSilentMode(false);
      }
    });

    test('normal inputs', () => {
      expect(Ic.utilityMisc.unreferenceP({}, [['henlo', 'frend']])).toEqual({ henlo: 'frend' });
      expect(Ic.utilityMisc.unreferenceP({ henlo: 'worlmnd' }, [['henlo', 'frend']])).toEqual({ henlo: 'frend' });
      expect(
        Ic.utilityMisc.unreferenceP({ a: 'x' }, [
          ['a', 'y'],
          ['a', 'z'],
        ])
      ).toEqual({ a: 'z' });

      Ic.setSilentMode(true);
      expect(
        Ic.utilityMisc.unreferenceP({ henlo: 'worlmnd', other: true, unchanged: 3 }, [
          ['henlo', 'frend'],
          ['three', 'get', 'skipped'],
          ['other', false],
        ])
      ).toEqual({ henlo: 'frend', other: false, unchanged: 3 });
      Ic.setSilentMode(false);
    });
  });

  test('Ic.utilityMisc.cleanSan()', () => {
    expect(Ic.utilityMisc.cleanSan('0123456789')).toBe('0123456789');
    expect(Ic.utilityMisc.cleanSan('abcdefghijklmnopqrstuvwxyz-')).toBe('abcdefghkn0qrx');
    expect(Ic.utilityMisc.cleanSan('ABCDEFGHIJKLMNOPQRSTUVWXYZ-')).toBe('ABCDEFGHKN0QRX');
    expect(Ic.utilityMisc.cleanSan('=/ ½')).toBe('=/ 1/2');

    expect(Ic.utilityMisc.cleanSan('O-O-O')).toBe('O-O-O');
    expect(Ic.utilityMisc.cleanSan('o-o-o')).toBe('O-O-O');
    expect(Ic.utilityMisc.cleanSan('0-0-0')).toBe('O-O-O');
    expect(Ic.utilityMisc.cleanSan('O---O---O')).toBe('O-O-O');
    expect(Ic.utilityMisc.cleanSan('o---o---o')).toBe('O-O-O');
    expect(Ic.utilityMisc.cleanSan('0---0---0')).toBe('O-O-O');

    expect(Ic.utilityMisc.cleanSan('O-O')).toBe('O-O');
    expect(Ic.utilityMisc.cleanSan('o-o')).toBe('O-O');
    expect(Ic.utilityMisc.cleanSan('0-0')).toBe('O-O');
    expect(Ic.utilityMisc.cleanSan('O---O')).toBe('O-O');
    expect(Ic.utilityMisc.cleanSan('o---o')).toBe('O-O');
    expect(Ic.utilityMisc.cleanSan('0---0')).toBe('O-O');

    expect(Ic.utilityMisc.cleanSan('½-½')).toBe('1/2-1/2');
    expect(Ic.utilityMisc.cleanSan('O-1')).toBe('0-1');
    expect(Ic.utilityMisc.cleanSan('o-1')).toBe('0-1');
    expect(Ic.utilityMisc.cleanSan('0-1')).toBe('0-1');
    expect(Ic.utilityMisc.cleanSan('1-O')).toBe('1-0');
    expect(Ic.utilityMisc.cleanSan('1-o')).toBe('1-0');
    expect(Ic.utilityMisc.cleanSan('1-0')).toBe('1-0');
    expect(Ic.utilityMisc.cleanSan('½---½')).toBe('1/2-1/2');
    expect(Ic.utilityMisc.cleanSan('O---1')).toBe('0-1');
    expect(Ic.utilityMisc.cleanSan('o---1')).toBe('0-1');
    expect(Ic.utilityMisc.cleanSan('0---1')).toBe('0-1');
    expect(Ic.utilityMisc.cleanSan('1---O')).toBe('1-0');
    expect(Ic.utilityMisc.cleanSan('1---o')).toBe('1-0');
    expect(Ic.utilityMisc.cleanSan('1---0')).toBe('1-0');

    expect(Ic.utilityMisc.cleanSan('e4;escape after')).toBe('e4');
    expect(Ic.utilityMisc.cleanSan(' e4 ; escape after ')).toBe('e4');

    expect(Ic.utilityMisc.cleanSan('%escape whole line')).toBe('');
    expect(Ic.utilityMisc.cleanSan('e%4')).toBe('e4'); //mm

    expect(Ic.utilityMisc.cleanSan(' a3 ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  e4  e5  ')).toBe('e4 e5');

    expect(Ic.utilityMisc.cleanSan('a3#')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3++')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3+')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3+-')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3-+')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3!')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3!!')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3!?')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3?!')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3?')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3??')).toBe('a3');

    expect(Ic.utilityMisc.cleanSan('  a3  #  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  ++  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  +  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  +-  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  -+  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  !  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  !!  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  !?  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  ?!  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  ?  ')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('  a3  ??  ')).toBe('a3');

    expect(Ic.utilityMisc.cleanSan('a3 ()<>[]')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3 (())<()>[()]')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3 ([])<[]>[[]]')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3 (<>)<<>>[<>]')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3 (()<>[])')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3 <()[]>')).toBe('a3');
    expect(Ic.utilityMisc.cleanSan('a3 [()<>[]]')).toBe('a3');
  });

  describe('Ic.utilityMisc.cloneBoardToObj()', () => {
    var board_name, other_board_name, board_obj, board_other;

    board_name = 'board_clone_board_objs';
    other_board_name = 'board_clone_board_objs_other';

    test('to_board vs from_board', () => {
      board_obj = Ic.initBoard({
        boardName: board_name,
        fen: 'r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 2 2',
        skipFenValidation: true,
      });

      board_other = Ic.initBoard({
        boardName: other_board_name,
        fen: 'r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 2 2',
        skipFenValidation: true,
      });

      board_obj.playMove('c3-e4');

      board_other.playMoves(['g2-g3', 'h7-h6', 'f1-g2', 'h6-h5', 'g2-e4']);

      Ic.utilityMisc.cloneBoardToObj(board_other, board_obj);

      expect(board_other.moveList[1].san).toBe('Ne4');
      expect(!!board_other.moveList[2]).toBe(false);
      expect(board_other.getSquare('e4').val).toBe(2);
      expect(board_other.isEqualBoard(board_obj)).toBe(true);

      board_other.playMoves(['g7-g5', 'e4-g5', 'e7-e5', 'e2-e4', 'd8-g5', 'd2-d3', 'g5-c1']);

      expect(board_other.w.materialDiff).toEqual([1]);
      expect(board_other.b.materialDiff).toEqual([-2, -3]);

      Ic.utilityMisc.cloneBoardToObj(board_other, board_obj);

      //if we go back to push them one by one and forget to start with a [],
      //then shorter arrays won't overwrite larger arrays properly
      expect(board_other.w.materialDiff).toEqual([]);
      expect(board_other.b.materialDiff).toEqual([]);

      board_obj.w.materialDiff.push(5);
      board_obj.b.materialDiff.push(-5);

      //missing materialDiff.slice(0) binds the two references
      expect(board_other.w.materialDiff).toEqual([]);
      expect(board_other.b.materialDiff).toEqual([]);
      expect(board_other.w.materialDiff).not.toEqual([5]);
      expect(board_other.b.materialDiff).not.toEqual([-5]);

      board_obj.w.materialDiff.pop();
      board_obj.b.materialDiff.pop();
    });

    test('to_emtpy_obj vs from_board', () => {
      var obj, output;

      board_obj = Ic.initBoard({
        boardName: board_name,
      });

      obj = {};

      Ic.utilityMisc.cloneBoardToObj(obj, board_obj);

      expect(Object.keys(obj.w).length).toEqual(Object.keys(board_obj.w).length);
      expect(Object.keys(obj.b).length).toEqual(Object.keys(board_obj.b).length);
      expect(Object.keys(obj.squares.a1).length).toEqual(Object.keys(board_obj.squares.a1).length);

      output =
        '{"moveList":[{"colorMoved":"b","colorToPlay":"w","fen":"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","san":"","uci":"","fromBos":"","toBos":"","enPassantBos":"","piece":"","captured":"","promotion":"","comment":"","moveResult":"","canDraw":false,"isEnPassantCapture":false}],"legalUci":["a2a3","a2a4","b2b3","b2b4","c2c3","c2c4","d2d3","d2d4","e2e3","e2e4","f2f3","f2f4","g2g3","g2g4","h2h3","h2h4","b1c3","b1a3","g1h3","g1f3"],"legalUciTree":{"a2":["a2a3","a2a4"],"b2":["b2b3","b2b4"],"c2":["c2c3","c2c4"],"d2":["d2d3","d2d4"],"e2":["e2e3","e2e4"],"f2":["f2f3","f2f4"],"g2":["g2g3","g2g4"],"h2":["h2h3","h2h4"],"b1":["b1c3","b1a3"],"g1":["g1h3","g1f3"]},"legalRevTree":{"a3":{"p":["a2"],"n":["b1"]},"a4":{"p":["a2"]},"b3":{"p":["b2"]},"b4":{"p":["b2"]},"c3":{"p":["c2"],"n":["b1"]},"c4":{"p":["c2"]},"d3":{"p":["d2"]},"d4":{"p":["d2"]},"e3":{"p":["e2"]},"e4":{"p":["e2"]},"f3":{"p":["f2"],"n":["g1"]},"f4":{"p":["f2"]},"g3":{"p":["g2"]},"g4":{"p":["g2"]},"h3":{"p":["h2"],"n":["g1"]},"h4":{"p":["h2"]}},"w":{"materialDiff":[],"isBlack":false,"sign":1,"firstRankPos":7,"secondRankPos":6,"lastRankPos":0,"singlePawnRankShift":-1,"pawn":1,"knight":2,"bishop":3,"rook":4,"queen":5,"king":6,"kingBos":"e1","castling":3},"b":{"materialDiff":[],"isBlack":true,"sign":-1,"firstRankPos":0,"secondRankPos":1,"lastRankPos":7,"singlePawnRankShift":1,"pawn":-1,"knight":-2,"bishop":-3,"rook":-4,"queen":-5,"king":-6,"kingBos":"e8","castling":3},"activeColor":"w","nonActiveColor":"b","fen":"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","enPassantBos":"","halfMove":0,"fullMove":1,"currentMove":0,"isRotated":false,"checks":0,"isCheck":false,"isCheckmate":false,"isStalemate":false,"isThreefold":false,"isInsufficientMaterial":false,"isFiftyMove":false,"inDraw":false,"promoteTo":5,"manualResult":"*","isHidden":false,"squares":{"a8":{"pos":[0,0],"bos":"a8","rankPos":0,"filePos":0,"rankBos":"8","fileBos":"a","bal":"r","absBal":"R","val":-4,"absVal":4,"className":"br","sign":-1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":true,"isQueen":false,"isKing":false},"b8":{"pos":[0,1],"bos":"b8","rankPos":0,"filePos":1,"rankBos":"8","fileBos":"b","bal":"n","absBal":"N","val":-2,"absVal":2,"className":"bn","sign":-1,"isEmptySquare":false,"isPawn":false,"isKnight":true,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"c8":{"pos":[0,2],"bos":"c8","rankPos":0,"filePos":2,"rankBos":"8","fileBos":"c","bal":"b","absBal":"B","val":-3,"absVal":3,"className":"bb","sign":-1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":true,"isRook":false,"isQueen":false,"isKing":false},"d8":{"pos":[0,3],"bos":"d8","rankPos":0,"filePos":3,"rankBos":"8","fileBos":"d","bal":"q","absBal":"Q","val":-5,"absVal":5,"className":"bq","sign":-1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":true,"isKing":false},"e8":{"pos":[0,4],"bos":"e8","rankPos":0,"filePos":4,"rankBos":"8","fileBos":"e","bal":"k","absBal":"K","val":-6,"absVal":6,"className":"bk","sign":-1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":true},"f8":{"pos":[0,5],"bos":"f8","rankPos":0,"filePos":5,"rankBos":"8","fileBos":"f","bal":"b","absBal":"B","val":-3,"absVal":3,"className":"bb","sign":-1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":true,"isRook":false,"isQueen":false,"isKing":false},"g8":{"pos":[0,6],"bos":"g8","rankPos":0,"filePos":6,"rankBos":"8","fileBos":"g","bal":"n","absBal":"N","val":-2,"absVal":2,"className":"bn","sign":-1,"isEmptySquare":false,"isPawn":false,"isKnight":true,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"h8":{"pos":[0,7],"bos":"h8","rankPos":0,"filePos":7,"rankBos":"8","fileBos":"h","bal":"r","absBal":"R","val":-4,"absVal":4,"className":"br","sign":-1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":true,"isQueen":false,"isKing":false},"a7":{"pos":[1,0],"bos":"a7","rankPos":1,"filePos":0,"rankBos":"7","fileBos":"a","bal":"p","absBal":"P","val":-1,"absVal":1,"className":"bp","sign":-1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"b7":{"pos":[1,1],"bos":"b7","rankPos":1,"filePos":1,"rankBos":"7","fileBos":"b","bal":"p","absBal":"P","val":-1,"absVal":1,"className":"bp","sign":-1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"c7":{"pos":[1,2],"bos":"c7","rankPos":1,"filePos":2,"rankBos":"7","fileBos":"c","bal":"p","absBal":"P","val":-1,"absVal":1,"className":"bp","sign":-1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"d7":{"pos":[1,3],"bos":"d7","rankPos":1,"filePos":3,"rankBos":"7","fileBos":"d","bal":"p","absBal":"P","val":-1,"absVal":1,"className":"bp","sign":-1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"e7":{"pos":[1,4],"bos":"e7","rankPos":1,"filePos":4,"rankBos":"7","fileBos":"e","bal":"p","absBal":"P","val":-1,"absVal":1,"className":"bp","sign":-1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"f7":{"pos":[1,5],"bos":"f7","rankPos":1,"filePos":5,"rankBos":"7","fileBos":"f","bal":"p","absBal":"P","val":-1,"absVal":1,"className":"bp","sign":-1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"g7":{"pos":[1,6],"bos":"g7","rankPos":1,"filePos":6,"rankBos":"7","fileBos":"g","bal":"p","absBal":"P","val":-1,"absVal":1,"className":"bp","sign":-1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"h7":{"pos":[1,7],"bos":"h7","rankPos":1,"filePos":7,"rankBos":"7","fileBos":"h","bal":"p","absBal":"P","val":-1,"absVal":1,"className":"bp","sign":-1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"a6":{"pos":[2,0],"bos":"a6","rankPos":2,"filePos":0,"rankBos":"6","fileBos":"a","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"b6":{"pos":[2,1],"bos":"b6","rankPos":2,"filePos":1,"rankBos":"6","fileBos":"b","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"c6":{"pos":[2,2],"bos":"c6","rankPos":2,"filePos":2,"rankBos":"6","fileBos":"c","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"d6":{"pos":[2,3],"bos":"d6","rankPos":2,"filePos":3,"rankBos":"6","fileBos":"d","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"e6":{"pos":[2,4],"bos":"e6","rankPos":2,"filePos":4,"rankBos":"6","fileBos":"e","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"f6":{"pos":[2,5],"bos":"f6","rankPos":2,"filePos":5,"rankBos":"6","fileBos":"f","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"g6":{"pos":[2,6],"bos":"g6","rankPos":2,"filePos":6,"rankBos":"6","fileBos":"g","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"h6":{"pos":[2,7],"bos":"h6","rankPos":2,"filePos":7,"rankBos":"6","fileBos":"h","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"a5":{"pos":[3,0],"bos":"a5","rankPos":3,"filePos":0,"rankBos":"5","fileBos":"a","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"b5":{"pos":[3,1],"bos":"b5","rankPos":3,"filePos":1,"rankBos":"5","fileBos":"b","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"c5":{"pos":[3,2],"bos":"c5","rankPos":3,"filePos":2,"rankBos":"5","fileBos":"c","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"d5":{"pos":[3,3],"bos":"d5","rankPos":3,"filePos":3,"rankBos":"5","fileBos":"d","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"e5":{"pos":[3,4],"bos":"e5","rankPos":3,"filePos":4,"rankBos":"5","fileBos":"e","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"f5":{"pos":[3,5],"bos":"f5","rankPos":3,"filePos":5,"rankBos":"5","fileBos":"f","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"g5":{"pos":[3,6],"bos":"g5","rankPos":3,"filePos":6,"rankBos":"5","fileBos":"g","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"h5":{"pos":[3,7],"bos":"h5","rankPos":3,"filePos":7,"rankBos":"5","fileBos":"h","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"a4":{"pos":[4,0],"bos":"a4","rankPos":4,"filePos":0,"rankBos":"4","fileBos":"a","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"b4":{"pos":[4,1],"bos":"b4","rankPos":4,"filePos":1,"rankBos":"4","fileBos":"b","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"c4":{"pos":[4,2],"bos":"c4","rankPos":4,"filePos":2,"rankBos":"4","fileBos":"c","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"d4":{"pos":[4,3],"bos":"d4","rankPos":4,"filePos":3,"rankBos":"4","fileBos":"d","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"e4":{"pos":[4,4],"bos":"e4","rankPos":4,"filePos":4,"rankBos":"4","fileBos":"e","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"f4":{"pos":[4,5],"bos":"f4","rankPos":4,"filePos":5,"rankBos":"4","fileBos":"f","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"g4":{"pos":[4,6],"bos":"g4","rankPos":4,"filePos":6,"rankBos":"4","fileBos":"g","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"h4":{"pos":[4,7],"bos":"h4","rankPos":4,"filePos":7,"rankBos":"4","fileBos":"h","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"a3":{"pos":[5,0],"bos":"a3","rankPos":5,"filePos":0,"rankBos":"3","fileBos":"a","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"b3":{"pos":[5,1],"bos":"b3","rankPos":5,"filePos":1,"rankBos":"3","fileBos":"b","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"c3":{"pos":[5,2],"bos":"c3","rankPos":5,"filePos":2,"rankBos":"3","fileBos":"c","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"d3":{"pos":[5,3],"bos":"d3","rankPos":5,"filePos":3,"rankBos":"3","fileBos":"d","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"e3":{"pos":[5,4],"bos":"e3","rankPos":5,"filePos":4,"rankBos":"3","fileBos":"e","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"f3":{"pos":[5,5],"bos":"f3","rankPos":5,"filePos":5,"rankBos":"3","fileBos":"f","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"g3":{"pos":[5,6],"bos":"g3","rankPos":5,"filePos":6,"rankBos":"3","fileBos":"g","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"h3":{"pos":[5,7],"bos":"h3","rankPos":5,"filePos":7,"rankBos":"3","fileBos":"h","bal":"*","absBal":"*","val":0,"absVal":0,"className":"","sign":-1,"isEmptySquare":true,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"a2":{"pos":[6,0],"bos":"a2","rankPos":6,"filePos":0,"rankBos":"2","fileBos":"a","bal":"P","absBal":"P","val":1,"absVal":1,"className":"wp","sign":1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"b2":{"pos":[6,1],"bos":"b2","rankPos":6,"filePos":1,"rankBos":"2","fileBos":"b","bal":"P","absBal":"P","val":1,"absVal":1,"className":"wp","sign":1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"c2":{"pos":[6,2],"bos":"c2","rankPos":6,"filePos":2,"rankBos":"2","fileBos":"c","bal":"P","absBal":"P","val":1,"absVal":1,"className":"wp","sign":1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"d2":{"pos":[6,3],"bos":"d2","rankPos":6,"filePos":3,"rankBos":"2","fileBos":"d","bal":"P","absBal":"P","val":1,"absVal":1,"className":"wp","sign":1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"e2":{"pos":[6,4],"bos":"e2","rankPos":6,"filePos":4,"rankBos":"2","fileBos":"e","bal":"P","absBal":"P","val":1,"absVal":1,"className":"wp","sign":1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"f2":{"pos":[6,5],"bos":"f2","rankPos":6,"filePos":5,"rankBos":"2","fileBos":"f","bal":"P","absBal":"P","val":1,"absVal":1,"className":"wp","sign":1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"g2":{"pos":[6,6],"bos":"g2","rankPos":6,"filePos":6,"rankBos":"2","fileBos":"g","bal":"P","absBal":"P","val":1,"absVal":1,"className":"wp","sign":1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"h2":{"pos":[6,7],"bos":"h2","rankPos":6,"filePos":7,"rankBos":"2","fileBos":"h","bal":"P","absBal":"P","val":1,"absVal":1,"className":"wp","sign":1,"isEmptySquare":false,"isPawn":true,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"a1":{"pos":[7,0],"bos":"a1","rankPos":7,"filePos":0,"rankBos":"1","fileBos":"a","bal":"R","absBal":"R","val":4,"absVal":4,"className":"wr","sign":1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":true,"isQueen":false,"isKing":false},"b1":{"pos":[7,1],"bos":"b1","rankPos":7,"filePos":1,"rankBos":"1","fileBos":"b","bal":"N","absBal":"N","val":2,"absVal":2,"className":"wn","sign":1,"isEmptySquare":false,"isPawn":false,"isKnight":true,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"c1":{"pos":[7,2],"bos":"c1","rankPos":7,"filePos":2,"rankBos":"1","fileBos":"c","bal":"B","absBal":"B","val":3,"absVal":3,"className":"wb","sign":1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":true,"isRook":false,"isQueen":false,"isKing":false},"d1":{"pos":[7,3],"bos":"d1","rankPos":7,"filePos":3,"rankBos":"1","fileBos":"d","bal":"Q","absBal":"Q","val":5,"absVal":5,"className":"wq","sign":1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":true,"isKing":false},"e1":{"pos":[7,4],"bos":"e1","rankPos":7,"filePos":4,"rankBos":"1","fileBos":"e","bal":"K","absBal":"K","val":6,"absVal":6,"className":"wk","sign":1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":false,"isQueen":false,"isKing":true},"f1":{"pos":[7,5],"bos":"f1","rankPos":7,"filePos":5,"rankBos":"1","fileBos":"f","bal":"B","absBal":"B","val":3,"absVal":3,"className":"wb","sign":1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":true,"isRook":false,"isQueen":false,"isKing":false},"g1":{"pos":[7,6],"bos":"g1","rankPos":7,"filePos":6,"rankBos":"1","fileBos":"g","bal":"N","absBal":"N","val":2,"absVal":2,"className":"wn","sign":1,"isEmptySquare":false,"isPawn":false,"isKnight":true,"isBishop":false,"isRook":false,"isQueen":false,"isKing":false},"h1":{"pos":[7,7],"bos":"h1","rankPos":7,"filePos":7,"rankBos":"1","fileBos":"h","bal":"R","absBal":"R","val":4,"absVal":4,"className":"wr","sign":1,"isEmptySquare":false,"isPawn":false,"isKnight":false,"isBishop":false,"isRook":true,"isQueen":false,"isKing":false}}}';
      expect(JSON.stringify(obj)).toEqual(output);
    });

    test('boardName preservation', () => {
      var obj, fake_board_name;

      board_obj = Ic.initBoard({
        boardName: board_name,
      });

      fake_board_name = 'fake_board_test';
      obj = { boardName: fake_board_name };

      Ic.utilityMisc.cloneBoardToObj(obj, board_obj);

      expect(obj.boardName).toBe(fake_board_name);
    });

    describe('return values', () => {
      describe('same input-output reference = true', () => {
        test('passing a board object returns exactly the same reference as output', () => {
          var temp;

          board_obj = Ic.initBoard({
            boardName: board_name,
          });

          board_other = Ic.initBoard({
            boardName: other_board_name,
            fen: 'r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 2 2',
            skipFenValidation: true,
          });

          temp = Ic.utilityMisc.cloneBoardToObj(board_other, board_obj);

          expect(temp === board_other).toBe(true);
        });

        test('passing an emtpy object returns exactly the same reference as output', () => {
          var obj, temp;

          board_obj = Ic.initBoard({
            boardName: board_name,
          });

          obj = {};
          temp = Ic.utilityMisc.cloneBoardToObj(obj, board_obj);

          expect(temp === obj).toBe(true);
        });

        test('passing an invalid input (different than undefined) returns the same primitive value as output', () => {
          var i, len, temp, arr;

          board_obj = Ic.initBoard({
            boardName: board_name,
          });

          arr = [false, true, null, '', 'x', 0, 1, -1];

          Ic.setSilentMode(true);
          for (i = 0, len = arr.length; i < len; i++) {
            temp = Ic.utilityMisc.cloneBoardToObj(arr[i], board_obj);
            expect(temp === arr[i]).toBe(true);
          }
          Ic.setSilentMode(false);
        });
      });

      describe('same input-output reference = false', () => {
        test('undefined parameter defaults to an empty object and returns it with the copied values as output', () => {
          var obj, temp;

          board_obj = Ic.initBoard({
            boardName: board_name,
          });

          obj = undefined;
          temp = Ic.utilityMisc.cloneBoardToObj(obj, board_obj);
          expect(temp === obj).not.toBe(true);
          expect(Object.keys(temp).length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Ic.utilityMisc.basicFenTest()', () => {
    describe('Error type: 0', () => {
      var len, error_msg;

      error_msg = 'Error [0]';
      len = error_msg.length;

      test('fen too short (less than 20 length)', () => {
        expect(Ic.utilityMisc.basicFenTest('').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest(' ').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('x').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('8/8/8/8/8/8/8/8').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('k7/8/8/8/8/8/8/K7').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('0000000000000000019').substring(0, len)).toBe(error_msg);
      });
    });

    describe('Error type: 1', () => {
      var len, error_msg;

      error_msg = 'Error [1]';
      len = error_msg.length;

      test('wrong structure (20 or more length)', () => {
        expect(Ic.utilityMisc.basicFenTest('00000000000000000020').substring(0, len)).toBe(error_msg);
      });

      test('color need to be w or b', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR W KQkq - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR B KQkq - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq - 0 1').substring(0, len)
        ).toBe(error_msg);
      });

      test('castling', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqkq - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQKQ - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w QKqk - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - 0 1').substring(0, len)
        ).toBe(error_msg);
      });

      test('wrong piece char', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/xppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ - 0 1').substring(0, len)
        ).toBe(error_msg);
      });

      test('pawns on promotion rank', () => {
        expect(Ic.utilityMisc.basicFenTest('P7/8/7K/8/8/7k/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('p7/8/7K/8/8/7k/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('8/8/7K/8/8/7k/8/P7 b - - 0 1').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('8/8/7K/8/8/7k/8/p7 b - - 0 1').substring(0, len)).toBe(error_msg);

        expect(Ic.utilityMisc.basicFenTest('P7/8/7K/8/8/7k/8/p7 b - - 0 1').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('p7/8/7K/8/8/7k/8/P7 b - - 0 1').substring(0, len)).toBe(error_msg);

        expect(Ic.utilityMisc.basicFenTest('P7/8/7K/8/8/7k/8/P7 b - - 0 1').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('p7/8/7K/8/8/7k/8/p7 b - - 0 1').substring(0, len)).toBe(error_msg);
      });

      test('bad enpassant square', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d2 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d4 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d7 0 2').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d5 0 2').substring(0, len)
        ).toBe(error_msg);
      });

      test('one white space missing', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNRw KQkq - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR wKQkq - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq- 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -0 1').substring(0, len)
        ).toBe(error_msg);
      });
    });

    describe('Error type: 2', () => {
      var len, error_msg;

      error_msg = 'Error [2]';
      len = error_msg.length;

      test('full move at 0', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0').substring(0, len)
        ).toBe(error_msg);
      });

      test('half move with 0X', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 01 1').substring(0, len)
        ).toBe(error_msg);
      });

      test('full move with 0X', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 2 02').substring(0, len)
        ).toBe(error_msg);
      });

      test('half move non numeric', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - a 1').substring(0, len)
        ).toBe(error_msg);
      });

      test('full move non numeric', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 1 a').substring(0, len)
        ).toBe(error_msg);
      });
    });

    describe('Error type: 3', () => {
      var len, error_msg;

      error_msg = 'Error [3]';
      len = error_msg.length;

      test('consecutive numbers', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbnr/pppppppp/44/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(Ic.utilityMisc.basicFenTest('8/8/1K51/8/8/7k/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);

        expect(Ic.utilityMisc.basicFenTest('8/8/K32P1/8/8/7k/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);

        expect(Ic.utilityMisc.basicFenTest('8/8/61K/8/8/7k/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);
      });
    });

    describe('Error type: 4', () => {
      var len, error_msg;

      error_msg = 'Error [4]';
      len = error_msg.length;

      test('not exactly 8 columns', () => {
        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbn1/ppppppppr/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(
          Ic.utilityMisc.basicFenTest('rnbqkbn1/3r3/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1').substring(0, len)
        ).toBe(error_msg);

        expect(Ic.utilityMisc.basicFenTest('R7R/8/K7/8/8/7k/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);

        expect(Ic.utilityMisc.basicFenTest('8/8/K8/8/8/7k/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);

        expect(Ic.utilityMisc.basicFenTest('8/8/8K/8/8/7k/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);
      });
    });

    describe('Error type: 5', () => {
      var len, error_msg;

      error_msg = 'Error [5]';
      len = error_msg.length;

      test('missing wk', () => {
        expect(Ic.utilityMisc.basicFenTest('8/8/8/8/8/8/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);

        expect(Ic.utilityMisc.basicFenTest('k7/8/8/8/8/8/8/8 w - - 0 1').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('8/7k/8/8/8/8/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);
      });

      test('more than one wk', () => {
        expect(Ic.utilityMisc.basicFenTest('K6K/8/8/8/8/8/8/k7 w - - 0 1').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('8/K6K/8/8/8/7k/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);
      });
    });

    describe('Error type: 6', () => {
      var len, error_msg;

      error_msg = 'Error [6]';
      len = error_msg.length;

      test('missing bk', () => {
        expect(Ic.utilityMisc.basicFenTest('K7/8/8/8/8/8/8/8 w - - 0 1').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('8/7K/8/8/8/8/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);
      });

      test('more than one bk', () => {
        expect(Ic.utilityMisc.basicFenTest('k6k/8/8/8/8/8/8/K7 w - - 0 1').substring(0, len)).toBe(error_msg);
        expect(Ic.utilityMisc.basicFenTest('8/k6k/8/8/8/7K/8/8 b - - 0 1').substring(0, len)).toBe(error_msg);
      });
    });
  });

  describe('Ic.utilityMisc.perft()', () => {
    var board_name, current_p;

    board_name = 'board_perft';

    current_p = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      boardName: board_name,
      skipFenValidation: true,
    };
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 0)).toBe(1);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 1)).toBe(20);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 2)).toBe(400);
    //depth=3 ... toBe(8902) ... [v6.3.0 = passed]
    //depth=4 ... toBe(197281) ... [v6.3.0 = passed]
    //depth=5 ... toBe(4865609) ... [v6.3.0 = passed]
    //depth=6 ... toBe(119060324) ... [untested]
    //depth=7 ... toBe(3195901860) ... [untested]

    current_p = {
      fen: 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
      boardName: board_name,
      skipFenValidation: true,
    };
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 0)).toBe(1);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 1)).toBe(48);
    //depth=2 ... toBe(2039) ... [v6.3.0 = passed]
    //depth=3 ... toBe(97862) ... [v6.3.0 = passed]
    //depth=4 ... toBe(4085603) ... [v6.3.0 = passed]
    //depth=5 ... toBe(193690690) ... [untested]
    //depth=6 ... toBe(8031647685) ... [untested]

    current_p = { fen: '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', boardName: board_name, skipFenValidation: true };
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 0)).toBe(1);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 1)).toBe(14);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 2)).toBe(191);
    //depth=3 ... toBe(2812) ... [v5.9.0 = passed]
    //depth=4 ... toBe(43238) ... [v5.9.0 = passed]
    //depth=5 ... toBe(674624) ... [v5.8.2 = passed]
    //depth=6 ... toBe(11030083) ... [untested]
    //depth=7 ... toBe(178633661) ... [untested]

    current_p = {
      fen: 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10',
      boardName: board_name,
      skipFenValidation: true,
    };
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 0)).toBe(1);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 1)).toBe(46);
    //depth=2 ... toBe(2079) ... [v5.9.0 = passed]
    //depth=3 ... toBe(89890) ... [v5.9.0 = passed]
    //depth=4 ... toBe(3894594) ... [untested]
    //depth=5 ... toBe(164075551) ... [untested]

    current_p = {
      fen: 'rnbqk1nr/p1pp1ppp/1p6/2b1p1B1/8/1QPP4/PP2PPPP/RN2KBNR b KQkq - 2 4',
      boardName: board_name,
      skipFenValidation: true,
    };
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 0)).toBe(1);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 1)).toBe(31);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 2)).toBe(1116);
    //depth=3 ... toBe(33828) ... [v5.9.0 = passed]
    //depth=4 ... toBe(1184142) ... [v6.10.0 = passed]
    //depth=5 ... toBe(36838554) ... [untested]
    //depth=6 ... toBe(1272676278) ... [untested]

    current_p = {
      fen: 'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8',
      boardName: board_name,
      skipFenValidation: true,
    };
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 0, 'd7c8')).toBe(1); //uci not found
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 0, 'd7c8q')).toBe(1);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 0)).toBe(1);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 1, 'd7c8')).toBe(0); //uci not found
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 1, 'd7c8q')).toBe(1);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 1)).toBe(44);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 2, 'd7c8')).toBe(0); //uci not found
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 2, 'd7c8q')).toBe(31);
    expect(Ic.utilityMisc.perft(Ic.initBoard(current_p), 2)).toBe(1486);
    //[d7c8q]depth=3 ... toBe(1459) ... [v5.9.0 = passed]
    //[d7c8r]depth=3 ... toBe(1296) ... [v5.9.0 = passed]
    //[d7c8b]depth=3 ... toBe(1668) ... [v5.9.0 = passed]
    //[d7c8n]depth=3 ... toBe(1607) ... [v5.9.0 = passed]
    //depth=3 ... toBe(62379) ... [v5.9.0 = passed]
    //depth=4 ... toBe(2103487) ... [untested]
    //depth=5 ... toBe(89941194) ... [untested]
  });
});
