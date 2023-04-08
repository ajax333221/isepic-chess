/** Copyright (c) 2023 Ajax Isepic (ajax333221) Licensed MIT */

/* jshint undef:true, unused:true, jquery:false, curly:true, latedef:nofunc, bitwise:false, eqeqeq:true, esversion:9 */

/* globals exports, define */

(function (windw, expts, defin) {
  var Ic = (function (_WIN) {
    var _VERSION = '8.5.2';

    var _SILENT_MODE = true;
    var _BOARDS = {};
    var _EMPTY_SQR = 0;
    var _PAWN = 1;
    var _KNIGHT = 2;
    var _BISHOP = 3;
    var _ROOK = 4;
    var _QUEEN = 5;
    var _KING = 6;
    var _DIRECTION_TOP = 1;
    var _DIRECTION_TOP_RIGHT = 2;
    var _DIRECTION_RIGHT = 3;
    var _DIRECTION_BOTTOM_RIGHT = 4;
    var _DIRECTION_BOTTOM = 5;
    var _DIRECTION_BOTTOM_LEFT = 6;
    var _DIRECTION_LEFT = 7;
    var _DIRECTION_TOP_LEFT = 8;
    var _SHORT_CASTLE = 1;
    var _LONG_CASTLE = 2;
    var _RESULT_ONGOING = '*';
    var _RESULT_W_WINS = '1-0';
    var _RESULT_B_WINS = '0-1';
    var _RESULT_DRAW = '1/2-1/2';
    var _DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    var _MUTABLE_KEYS = [
      'w',
      'b',
      'activeColor',
      'nonActiveColor',
      'fen',
      'enPassantBos',
      'halfMove',
      'fullMove',
      'moveList',
      'currentMove',
      'isRotated',
      'checks',
      'isCheck',
      'isCheckmate',
      'isStalemate',
      'isThreefold',
      'isInsufficientMaterial',
      'isFiftyMove',
      'inDraw',
      'promoteTo',
      'manualResult',
      'isHidden',
      'legalUci',
      'legalUciTree',
      'legalRevTree',
      'squares',
    ];

    //---------------- helpers

    function _promoteValHelper(qal) {
      return _toInt(toAbsVal(qal) || _QUEEN, _KNIGHT, _QUEEN);
    }

    function _pgnResultHelper(str) {
      var rtn;

      rtn = '';
      str = String(str).replace(/\s/g, '').replace(/o/gi, '0').replace(/½/g, '1/2');

      if (str === _RESULT_ONGOING || str === _RESULT_W_WINS || str === _RESULT_B_WINS || str === _RESULT_DRAW) {
        rtn = str;
      }

      return rtn;
    }

    function _strToValHelper(str) {
      var temp, pc_exec, rtn;

      rtn = 0;

      block: {
        if (!str) {
          break block;
        }

        if (!Number.isNaN(str * 1) && _isIntOrStrInt(str)) {
          rtn = _toInt(str, -_KING, _KING);
          break block;
        }

        str = _trimSpaces(str);

        if (/^[pnbrqk]$/i.test(str)) {
          temp = str.toLowerCase();
          rtn = ('pnbrqk'.indexOf(temp) + 1) * getSign(str === temp);
          break block;
        }

        pc_exec = /^([wb])([pnbrqk])$/.exec(str.toLowerCase());

        if (pc_exec) {
          rtn = ('pnbrqk'.indexOf(pc_exec[2]) + 1) * getSign(pc_exec[1] === 'b');
          break block;
        }
      }

      return rtn;
    }

    function _strToBosHelper(str) {
      var rtn;

      rtn = null;
      str = _trimSpaces(str);

      if (str && /^[a-h][1-8]$/i.test(str)) {
        rtn = str.toLowerCase();
      }

      return rtn;
    }

    function _arrToPosHelper(arr) {
      var rank_pos, file_pos, rtn;

      rtn = null;

      if (_isArray(arr) && arr.length === 2) {
        rank_pos = _toInt(arr[0]);
        file_pos = _toInt(arr[1]);

        if (rank_pos <= 7 && rank_pos >= 0 && file_pos <= 7 && file_pos >= 0) {
          rtn = [rank_pos, file_pos];
        }
      }

      return rtn;
    }

    function _pgnParserHelper(str) {
      var g, temp, rgxp, mtch, meta_tags, move_list, game_result, last_index, rtn;

      rtn = null;

      block: {
        if (!_isNonBlankStr(str)) {
          break block;
        }

        meta_tags = {};
        last_index = -1;
        rgxp = /\[\s*(\w+)\s+\"([^\"]*)\"\s*\]/g;
        str = str.replace(/“|”/g, '"');

        while ((mtch = rgxp.exec(str))) {
          last_index = rgxp.lastIndex;

          meta_tags[_trimSpaces(mtch[1])] = _trimSpaces(mtch[2]);
        }

        if (last_index === -1) {
          last_index = 0;
        }

        g = ' ' + _cleanSan(str.slice(last_index));
        move_list = [];
        last_index = -1;
        rgxp = /\s+([1-9][0-9]*)*\s*\.*\s*\.*\s*([^\s]+)/g;

        while ((mtch = rgxp.exec(g))) {
          last_index = rgxp.lastIndex;
          temp = mtch[0];
          move_list.push(mtch[2]);
        }

        if (last_index === -1) {
          break block;
        }

        game_result = _RESULT_ONGOING;
        temp = _pgnResultHelper(temp);

        if (temp) {
          move_list.pop();
          game_result = temp;
        }

        if (meta_tags.Result) {
          temp = _pgnResultHelper(meta_tags.Result);

          if (temp) {
            meta_tags.Result = temp;
            game_result = temp;
          }
        }

        rtn = {
          tags: meta_tags,
          sanMoves: move_list,
          result: game_result,
        };
      }

      return rtn;
    }

    function _uciParserHelper(str) {
      var rtn;

      rtn = null;

      block: {
        if (!_isNonBlankStr(str)) {
          break block;
        }

        str = _trimSpaces(str)
          .replace(/[^a-h1-8 nrq]/gi, '')
          .toLowerCase();

        if (!str) {
          break block;
        }

        rtn = str.split(' ');
      }

      return rtn;
    }

    function _uciWrapmoveHelper(mov) {
      var temp, possible_promote, rtn;

      rtn = null;

      block: {
        if (!_isNonBlankStr(mov)) {
          break block;
        }

        mov = _trimSpaces(mov);

        if (mov.length !== 4 && mov.length !== 5) {
          break block;
        }

        temp = [_strToBosHelper(mov.slice(0, 2)), _strToBosHelper(mov.slice(2, 4))];

        if (temp[0] === null || temp[1] === null) {
          break block;
        }

        possible_promote = mov.charAt(4) || '';
        rtn = [temp, possible_promote];
      }

      return rtn;
    }

    //p = {delimiter}
    function _joinedWrapmoveHelper(mov, p) {
      var temp, rtn;

      rtn = null;
      p = _unreferenceP(p);

      block: {
        p.delimiter = _isNonEmptyStr(p.delimiter) ? p.delimiter.charAt(0) : '-';

        if (!_isNonBlankStr(mov)) {
          break block;
        }

        mov = _trimSpaces(mov);

        if (mov.length !== 5 || mov.charAt(2) !== p.delimiter) {
          break block;
        }

        temp = mov.split(p.delimiter);
        temp = [_strToBosHelper(temp[0]), _strToBosHelper(temp[1])];

        if (temp[0] === null || temp[1] === null) {
          break block;
        }

        rtn = temp;
      }

      return rtn;
    }

    function _fromToWrapmoveHelper(mov) {
      var rtn;

      rtn = null;

      block: {
        if (!_isArray(mov) || mov.length !== 2) {
          break block;
        }

        if (!isInsideBoard(mov[0]) || !isInsideBoard(mov[1])) {
          break block;
        }

        rtn = [toBos(mov[0]), toBos(mov[1])];
      }

      return rtn;
    }

    function _moveWrapmoveHelper(mov) {
      var possible_promote, rtn;

      rtn = null;

      block: {
        if (!_isMove(mov)) {
          break block;
        }

        possible_promote = mov.promotion || '';
        rtn = [[mov.fromBos, mov.toBos], possible_promote];
      }

      return rtn;
    }

    function _unreferencedMoveHelper(obj) {
      var rtn;

      rtn = {};
      rtn.colorMoved = obj.colorMoved;
      rtn.colorToPlay = obj.colorToPlay;
      rtn.fen = obj.fen;
      rtn.san = obj.san;
      rtn.uci = obj.uci;
      rtn.fromBos = obj.fromBos;
      rtn.toBos = obj.toBos;
      rtn.enPassantBos = obj.enPassantBos;
      rtn.piece = obj.piece;
      rtn.captured = obj.captured;
      rtn.promotion = obj.promotion;
      rtn.comment = obj.comment;
      rtn.moveResult = obj.moveResult;
      rtn.canDraw = obj.canDraw;
      rtn.isEnPassantCapture = obj.isEnPassantCapture;

      return rtn;
    }

    function _nullboardHelper(board_name) {
      var i, j, temp, current_pos, current_bos, target;

      target = getBoard(board_name);

      if (target === null) {
        _BOARDS[board_name] = {
          boardName: board_name,
          getSquare: _getSquare,
          setSquare: _setSquare,
          attackersFromActive: _attackersFromActive,
          attackersFromNonActive: _attackersFromNonActive,
          toggleActiveNonActive: _toggleActiveNonActive,
          toggleIsRotated: _toggleIsRotated,
          setPromoteTo: _setPromoteTo,
          silentlyResetOptions: _silentlyResetOptions,
          silentlyResetManualResult: _silentlyResetManualResult,
          setManualResult: _setManualResult,
          setCurrentMove: _setCurrentMove,
          loadFen: _loadFen,
          loadValidatedFen: _loadValidatedFen,
          getClocklessFenHelper: _getClocklessFenHelper,
          updateFenAndMisc: _updateFenAndMisc,
          refinedFenTest: _refinedFenTest,
          testCollision: _testCollision,
          isLegalMove: _isLegalMove,
          legalMovesHelper: _legalMovesHelper,
          legalMoves: _legalMoves,
          legalFenMoves: _legalFenMoves,
          legalSanMoves: _legalSanMoves,
          legalUciMoves: _legalUciMoves,
          getCheckmateMoves: _getCheckmateMoves,
          getDrawMoves: _getDrawMoves,
          fenHistoryExport: _fenHistoryExport,
          pgnExport: _pgnExport,
          uciExport: _uciExport,
          ascii: _ascii,
          boardHash: _boardHash,
          isEqualBoard: _isEqualBoard,
          cloneBoardFrom: _cloneBoardFrom,
          cloneBoardTo: _cloneBoardTo,
          reset: _reset,
          undoMove: _undoMove,
          undoMoves: _undoMoves,
          countLightDarkBishops: _countLightDarkBishops,
          updateHelper: _updateHelper,
          fenWrapmoveHelper: _fenWrapmoveHelper,
          sanWrapmoveHelper: _sanWrapmoveHelper,
          getWrappedMove: _getWrappedMove,
          draftMove: _draftMove,
          playMove: _playMove,
          playMoves: _playMoves,
          playRandomMove: _playRandomMove,
          navFirst: _navFirst,
          navPrevious: _navPrevious,
          navNext: _navNext,
          navLast: _navLast,
          navLinkMove: _navLinkMove,
          refreshUi: _refreshUi,
        };

        target = _BOARDS[board_name];
      }

      target.w = {
        //static
        isBlack: false,
        sign: 1,
        firstRankPos: 7,
        secondRankPos: 6,
        lastRankPos: 0,
        singlePawnRankShift: -1,
        pawn: _PAWN,
        knight: _KNIGHT,
        bishop: _BISHOP,
        rook: _ROOK,
        queen: _QUEEN,
        king: _KING,
        //mutable
        kingBos: null,
        castling: null,
        materialDiff: null,
      };

      target.b = {
        //static
        isBlack: true,
        sign: -1,
        firstRankPos: 0,
        secondRankPos: 1,
        lastRankPos: 7,
        singlePawnRankShift: 1,
        pawn: -_PAWN,
        knight: -_KNIGHT,
        bishop: -_BISHOP,
        rook: -_ROOK,
        queen: -_QUEEN,
        king: -_KING,
        //mutable
        kingBos: null,
        castling: null,
        materialDiff: null,
      };

      target.activeColor = null;
      target.nonActiveColor = null;
      target.fen = null;
      target.enPassantBos = null;
      target.halfMove = null;
      target.fullMove = null;
      target.moveList = null;
      target.currentMove = null;
      target.isRotated = null;
      target.checks = null;
      target.isCheck = null;
      target.isCheckmate = null;
      target.isStalemate = null;
      target.isThreefold = null;
      target.isInsufficientMaterial = null;
      target.isFiftyMove = null;
      target.inDraw = null;
      target.promoteTo = null;
      target.manualResult = null;
      target.isHidden = null;
      target.legalUci = null;
      target.legalUciTree = null;
      target.legalRevTree = null;
      target.squares = {};

      for (i = 0; i < 8; i++) {
        //0...7
        for (j = 0; j < 8; j++) {
          //0...7
          current_pos = [i, j];
          current_bos = toBos(current_pos);
          target.squares[current_bos] = {};
          temp = target.squares[current_bos];

          //static
          temp.pos = current_pos;
          temp.bos = current_bos;
          temp.rankPos = getRankPos(current_pos);
          temp.filePos = getFilePos(current_pos);
          temp.rankBos = getRankBos(current_pos);
          temp.fileBos = getFileBos(current_pos);

          //mutable
          temp.bal = null;
          temp.absBal = null;
          temp.val = null;
          temp.absVal = null;
          temp.className = null;
          temp.sign = null;
          temp.isEmptySquare = null;
          temp.isPawn = null;
          temp.isKnight = null;
          temp.isBishop = null;
          temp.isRook = null;
          temp.isQueen = null;
          temp.isKing = null;
        }
      }

      return target;
    }

    //---------------- utilities

    function _consoleLog(msg) {
      var rtn;

      rtn = false;

      if (!_SILENT_MODE) {
        rtn = true;
        console.log(msg);
      }

      return rtn;
    }

    function _isObject(obj) {
      return typeof obj === 'object' && obj !== null && !_isArray(obj);
    }

    function _isArray(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }

    function _isSquare(obj) {
      return _isObject(obj) && typeof obj.bos === 'string';
    }

    function _isBoard(obj) {
      return _isObject(obj) && typeof obj.boardName === 'string';
    }

    function _isMove(obj) {
      return _isObject(obj) && typeof obj.fromBos === 'string' && typeof obj.toBos === 'string';
    }

    function _trimSpaces(str) {
      return String(str)
        .replace(/^\s+|\s+$/g, '')
        .replace(/\s\s+/g, ' ');
    }

    function _formatName(str) {
      return _trimSpaces(str)
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/__+/g, '_');
    }

    function _strContains(str, str_to_find) {
      return String(str).indexOf(str_to_find) !== -1;
    }

    function _occurrences(str, str_rgxp) {
      var rtn;

      rtn = 0;

      if (_isNonEmptyStr(str) && _isNonEmptyStr(str_rgxp)) {
        rtn = (str.match(RegExp(str_rgxp, 'g')) || []).length;
      }

      return rtn;
    }

    function _toInt(num, min_val, max_val) {
      num = num * 1 || 0;
      num = num < 0 ? Math.ceil(num) : Math.floor(num);
      min_val *= 1;
      max_val *= 1;

      /*NO remove default 0, (-0 || 0) = 0*/
      min_val = (Number.isNaN(min_val) ? -Infinity : min_val) || 0;
      max_val = (Number.isNaN(max_val) ? Infinity : max_val) || 0;

      return Math.min(Math.max(num, min_val), max_val);
    }

    function _isIntOrStrInt(num) {
      return String(_toInt(num)) === String(num);
    }

    function _isNonEmptyStr(val) {
      return !!(typeof val === 'string' && val);
    }

    function _isNonBlankStr(val) {
      return !!(typeof val === 'string' && _trimSpaces(val));
    }

    function _hashCode(val) {
      var i, len, hash;

      hash = 0;
      val = _isNonEmptyStr(val) ? val : '';

      for (i = 0, len = val.length; i < len; i++) {
        //0<len
        hash = (hash << 5) - hash + val.charCodeAt(i);
        hash |= 0; //to 32bit integer
      }

      return hash;
    }

    function _castlingChars(num) {
      return ['', 'k', 'q', 'kq'][_toInt(num, 0, 3)];
    }

    function _unreferenceP(p, changes) {
      var i, len, rtn;

      rtn = _isObject(p) ? { ...p } : {};

      if (_isArray(changes)) {
        for (i = 0, len = changes.length; i < len; i++) {
          //0<len
          if (!_isArray(changes[i]) || changes[i].length !== 2 || !_isNonBlankStr(changes[i][0])) {
            _consoleLog('Error[_unreferenceP]: unexpected format');
            continue;
          }

          rtn[_trimSpaces(changes[i][0])] = changes[i][1];
        }
      }

      return rtn;
    }

    function _cleanSan(rtn) {
      rtn = _isNonBlankStr(rtn) ? rtn : '';

      if (rtn) {
        while (rtn !== (rtn = rtn.replace(/\{[^{}]*\}/g, '\n'))); /*TODO: keep comment*/
        while (rtn !== (rtn = rtn.replace(/\([^()]*\)/g, '\n')));
        while (rtn !== (rtn = rtn.replace(/\<[^<>]*\>/g, '\n')));

        rtn = rtn.replace(/(\t)|(\r?\n)|(\r\n?)/g, '\n');
        rtn = rtn.replace(/;+[^\n]*(\n|$)/g, '\n'); /*TODO: keep comment*/

        rtn = rtn
          .replace(/^%.*\n?/gm, '')
          .replace(/^\n+|\n+$/g, '')
          .replace(/\n/g, ' ');

        rtn = rtn.replace(/\$\d+/g, ' '); /*TODO: keep NAG*/
        rtn = rtn.replace(/[^a-h0-9nrqkxo /½=-]/gi, ''); //no planned support for P and e.p.
        rtn = rtn.replace(/\s*\-+\s*/g, '-');
        rtn = rtn.replace(/0-0-0/g, 'w').replace(/0-0/g, 'v');
        rtn = rtn.replace(/o-o-o/gi, 'w').replace(/o-o/gi, 'v');
        rtn = rtn.replace(/o/gi, '0').replace(/½/g, '1/2');

        rtn = rtn
          .replace(/1\-0/g, ' i ')
          .replace(/0\-1/g, ' j ')
          .replace(/1\/2\-1\/2/g, ' z ');

        rtn = rtn.replace(/\-/g, ' ');
        rtn = rtn.replace(/w/g, 'O-O-O').replace(/v/g, 'O-O');
        rtn = rtn.replace(/i/g, _RESULT_W_WINS).replace(/j/g, _RESULT_B_WINS).replace(/z/g, _RESULT_DRAW);
        rtn = _trimSpaces(rtn);
      }

      return rtn;
    }

    function _cloneBoardToObj(to_obj = {}, from_woard) {
      var i,
        j,
        k,
        len,
        len2,
        len3,
        current_key,
        to_prop,
        from_prop,
        sub_current_key,
        sub_from_prop,
        sub_to_prop,
        sub_sub_current_key,
        sub_sub_from_prop,
        //sub_sub_to_prop,
        sub_keys,
        sub_sub_keys,
        from_board;

      block: {
        if (!_isObject(to_obj)) {
          _consoleLog('Error[_cloneBoardToObj]: to_obj must be Object type');
          break block;
        }

        from_board = getBoard(from_woard);

        if (from_board === null) {
          _consoleLog("Error[_cloneBoardToObj]: from_woard doesn't exist");
          break block;
        }

        if (to_obj === from_board) {
          _consoleLog('Error[_cloneBoardToObj]: trying to self clone');
          break block;
        }

        to_obj.moveList = [];
        to_obj.legalUci = [];
        to_obj.legalUciTree = {};
        to_obj.legalRevTree = {};

        for (i = 0, len = _MUTABLE_KEYS.length; i < len; i++) {
          //0<len
          current_key = _MUTABLE_KEYS[i];
          to_prop = to_obj[current_key];
          from_prop = from_board[current_key];

          if (!to_prop && (current_key === 'w' || current_key === 'b' || current_key === 'squares')) {
            to_obj[current_key] = {};
            to_prop = to_obj[current_key];
          }

          //primitive data type
          if (!_isObject(from_prop) && !_isArray(from_prop)) {
            to_obj[current_key] = from_prop; //can't use to_prop, it's not a reference here
            continue;
          }

          if (current_key === 'legalUci') {
            to_obj.legalUci = from_board.legalUci.slice(0);
            continue;
          }

          if (current_key === 'w' || current_key === 'b') {
            //["w" | "b"] object of (12 static + 3 mutables = 15) Note: materialDiff is array

            //object or array data type
            to_prop.materialDiff = from_prop.materialDiff.slice(0); //mutables

            //primitive data type
            to_prop.isBlack = from_prop.isBlack; //static
            to_prop.sign = from_prop.sign; //static
            to_prop.firstRankPos = from_prop.firstRankPos; //static
            to_prop.secondRankPos = from_prop.secondRankPos; //static
            to_prop.lastRankPos = from_prop.lastRankPos; //static
            to_prop.singlePawnRankShift = from_prop.singlePawnRankShift; //static
            to_prop.pawn = from_prop.pawn; //static
            to_prop.knight = from_prop.knight; //static
            to_prop.bishop = from_prop.bishop; //static
            to_prop.rook = from_prop.rook; //static
            to_prop.queen = from_prop.queen; //static
            to_prop.king = from_prop.king; //static
            to_prop.kingBos = from_prop.kingBos; //mutables
            to_prop.castling = from_prop.castling; //mutables
            continue;
          }

          sub_keys = Object.keys(from_prop);

          for (j = 0, len2 = sub_keys.length; j < len2; j++) {
            //0<len2
            sub_current_key = sub_keys[j];
            sub_to_prop = to_prop[sub_current_key];
            sub_from_prop = from_prop[sub_current_key];

            if (!sub_to_prop && current_key === 'squares') {
              to_prop[sub_current_key] = {};
              sub_to_prop = to_prop[sub_current_key];
            }

            //primitive data type
            if (!_isObject(sub_from_prop) && !_isArray(sub_from_prop)) {
              _consoleLog('Error[_cloneBoardToObj]: unexpected primitive data type');
              continue;
            }

            if (current_key === 'legalUciTree') {
              //["legalUciTree"] object of (0-64), array of (0-N)

              to_prop[sub_current_key] = sub_from_prop.slice(0); //can't use sub_to_prop, it's not a reference here
              continue;
            }

            if (current_key === 'squares') {
              //["squares"] object of (64), object of (6 static + 13 mutables = 19) Note: pos is array

              //object or array data type
              sub_to_prop.pos = sub_from_prop.pos.slice(0); //static

              //primitive data type
              sub_to_prop.bos = sub_from_prop.bos; //static
              sub_to_prop.rankPos = sub_from_prop.rankPos; //static
              sub_to_prop.filePos = sub_from_prop.filePos; //static
              sub_to_prop.rankBos = sub_from_prop.rankBos; //static
              sub_to_prop.fileBos = sub_from_prop.fileBos; //static
              sub_to_prop.bal = sub_from_prop.bal; //mutables
              sub_to_prop.absBal = sub_from_prop.absBal; //mutables
              sub_to_prop.val = sub_from_prop.val; //mutables
              sub_to_prop.absVal = sub_from_prop.absVal; //mutables
              sub_to_prop.className = sub_from_prop.className; //mutables
              sub_to_prop.sign = sub_from_prop.sign; //mutables
              sub_to_prop.isEmptySquare = sub_from_prop.isEmptySquare; //mutables
              sub_to_prop.isPawn = sub_from_prop.isPawn; //mutables
              sub_to_prop.isKnight = sub_from_prop.isKnight; //mutables
              sub_to_prop.isBishop = sub_from_prop.isBishop; //mutables
              sub_to_prop.isRook = sub_from_prop.isRook; //mutables
              sub_to_prop.isQueen = sub_from_prop.isQueen; //mutables
              sub_to_prop.isKing = sub_from_prop.isKing; //mutables
              continue;
            }

            sub_sub_keys = Object.keys(sub_from_prop);

            if (current_key === 'moveList' || current_key === 'legalRevTree') {
              to_prop[sub_current_key] = {};
              sub_to_prop = to_prop[sub_current_key];
              /*NO put a "continue" in here*/
            }

            for (k = 0, len3 = sub_sub_keys.length; k < len3; k++) {
              //0<len3
              sub_sub_current_key = sub_sub_keys[k];
              //sub_sub_to_prop = sub_to_prop[sub_sub_current_key];
              sub_sub_from_prop = sub_from_prop[sub_sub_current_key];

              if (current_key === 'legalRevTree') {
                sub_to_prop[sub_sub_current_key] = sub_sub_from_prop.slice(0); //can't use sub_sub_to_prop, it's not a reference here
                continue;
              }

              //object or array data type
              if (_isObject(sub_sub_from_prop) || _isArray(sub_sub_from_prop)) {
                _consoleLog('Error[_cloneBoardToObj]: unexpected type in key "' + sub_sub_current_key + '"');
                continue;
              }

              //primitive data type
              sub_to_prop[sub_sub_current_key] = sub_sub_from_prop; //can't use sub_sub_to_prop, it's not a reference here
            }
          }
        }
      }

      return to_obj;
    }

    function _basicFenTest(fen) {
      var i,
        j,
        len,
        temp,
        optional_clocks,
        last_is_num,
        current_is_num,
        fen_board,
        fen_board_arr,
        total_files_in_current_rank,
        rtn_msg;

      rtn_msg = '';

      block: {
        fen = String(fen);

        if (fen.length < 20) {
          rtn_msg = 'Error [0] fen is too short';
          break block;
        }

        fen = _trimSpaces(fen);

        optional_clocks = fen.replace(
          /^([rnbqkRNBQK1-8]+\/)([rnbqkpRNBQKP1-8]+\/){6}([rnbqkRNBQK1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])($|\s)/,
          ''
        );

        if (fen.length === optional_clocks.length) {
          rtn_msg = 'Error [1] invalid fen structure';
          break block;
        }

        if (optional_clocks.length) {
          if (!/^(0|[1-9][0-9]*)\s([1-9][0-9]*)$/.test(optional_clocks)) {
            rtn_msg = 'Error [2] invalid half/full move';
            break block;
          }
        }

        fen_board = fen.split(' ')[0];
        fen_board_arr = fen_board.split('/');

        for (i = 0; i < 8; i++) {
          //0...7
          total_files_in_current_rank = 0;
          last_is_num = false;

          for (j = 0, len = fen_board_arr[i].length; j < len; j++) {
            //0<len
            temp = fen_board_arr[i].charAt(j) * 1;
            current_is_num = !!temp;

            if (last_is_num && current_is_num) {
              rtn_msg = 'Error [3] two consecutive numeric values';
              break block;
            }

            last_is_num = current_is_num;
            total_files_in_current_rank += temp || 1;
          }

          if (total_files_in_current_rank !== 8) {
            rtn_msg = 'Error [4] rank without exactly 8 columns';
            break block;
          }
        }

        temp = fen_board.indexOf('K');

        if (temp === -1 || fen_board.lastIndexOf('K') !== temp) {
          rtn_msg = 'Error [5] board without exactly one white king';
          break block;
        }

        temp = fen_board.indexOf('k');

        if (temp === -1 || fen_board.lastIndexOf('k') !== temp) {
          rtn_msg = 'Error [6] board without exactly one black king';
          break block;
        }
      }

      return rtn_msg;
    }

    function _perft(woard, depth, specific_uci) {
      var i, len, board, count, rtn;

      rtn = 1;

      block: {
        if (depth < 1) {
          break block;
        }

        board = getBoard(woard);

        if (board === null) {
          break block;
        }

        count = 0;

        for (i = 0, len = board.legalUci.length; i < len; i++) {
          //0<len
          if (specific_uci && specific_uci !== board.legalUci[i]) {
            continue;
          }

          if (depth === 1) {
            count++;
          } else {
            board.playMove(board.legalUci[i], { isLegalMove: true });
            count += _perft(board, depth - 1);
            board.navPrevious();
          }
        }

        rtn = count;
      }

      return rtn;
    }

    //---------------- board

    //p = {rankShift, fileShift, isUnreferenced}
    function _getSquare(qos, p) {
      var that, temp_pos, pre_validated_pos, rtn;

      that = this;

      function _squareHelper(my_square, is_unreferenced) {
        //uses: that
        var temp, rtn_square;

        rtn_square = my_square;

        if (is_unreferenced) {
          temp = {};

          temp.pos = toPos(my_square.pos); //unreference
          temp.bos = my_square.bos;
          temp.rankPos = getRankPos(my_square.pos);
          temp.filePos = getFilePos(my_square.pos);
          temp.rankBos = getRankBos(my_square.pos);
          temp.fileBos = getFileBos(my_square.pos);
          temp.bal = my_square.bal;
          temp.absBal = my_square.absBal;
          temp.val = my_square.val;
          temp.absVal = my_square.absVal;
          temp.className = my_square.className;
          temp.sign = my_square.sign;
          temp.isEmptySquare = my_square.isEmptySquare;
          temp.isPawn = my_square.isPawn;
          temp.isKnight = my_square.isKnight;
          temp.isBishop = my_square.isBishop;
          temp.isRook = my_square.isRook;
          temp.isQueen = my_square.isQueen;
          temp.isKing = my_square.isKing;

          rtn_square = temp;
        }

        return rtn_square;
      }

      rtn = null;
      p = _unreferenceP(p);
      temp_pos = toPos(qos);
      p.isUnreferenced = p.isUnreferenced === true;

      if (temp_pos !== null) {
        pre_validated_pos = [temp_pos[0] + _toInt(p.rankShift), temp_pos[1] + _toInt(p.fileShift)];

        if (isInsideBoard(pre_validated_pos)) {
          rtn = _squareHelper(that.squares[toBos(pre_validated_pos)], p.isUnreferenced);
        }
      }

      return rtn;
    }

    //p = {rankShift, fileShift}
    function _setSquare(qos, new_qal, p) {
      var that, current_side, new_val, new_abs_val, rtn;

      that = this;
      rtn = that.getSquare(qos, _unreferenceP(p, [['isUnreferenced', false]]));

      block: {
        if (rtn === null) {
          break block;
        }

        new_val = toVal(new_qal);

        if (rtn.val === new_val) {
          break block;
        }

        new_abs_val = toAbsVal(new_val);

        rtn.bal = toBal(new_val);
        rtn.absBal = toAbsBal(new_val);
        rtn.val = new_val;
        rtn.absVal = new_abs_val;
        rtn.className = toClassName(new_val);
        rtn.sign = getSign(new_val);
        rtn.isEmptySquare = new_abs_val === _EMPTY_SQR;
        rtn.isPawn = new_abs_val === _PAWN;
        rtn.isKnight = new_abs_val === _KNIGHT;
        rtn.isBishop = new_abs_val === _BISHOP;
        rtn.isRook = new_abs_val === _ROOK;
        rtn.isQueen = new_abs_val === _QUEEN;
        rtn.isKing = new_abs_val === _KING;

        if (rtn.isKing) {
          current_side = rtn.sign < 0 ? that.b : that.w;
          current_side.kingBos = toBos(qos);
        }
      }

      return rtn;
    }

    function _attackersFromActive(target_qos, early_break) {
      var that, rtn_total_attackers;

      that = this;
      that.toggleActiveNonActive();
      rtn_total_attackers = that.attackersFromNonActive(target_qos, early_break);
      that.toggleActiveNonActive();

      return rtn_total_attackers;
    }

    function _attackersFromNonActive(target_qos, early_break) {
      var i, j, that, as_knight, active_side, rtn_total_attackers;

      that = this;

      function _isAttacked(qos, piece_direction, as_knight) {
        //uses: that
        return that.testCollision(2, qos, piece_direction, as_knight, null, null).isAttacked;
      }

      rtn_total_attackers = 0;
      active_side = that[that.activeColor];
      target_qos = target_qos || active_side.kingBos;

      outer: for (i = 0; i < 2; i++) {
        //0...1
        as_knight = !!i;

        for (j = _DIRECTION_TOP; j <= _DIRECTION_TOP_LEFT; j++) {
          //1...8
          if (_isAttacked(target_qos, j, as_knight)) {
            rtn_total_attackers++;

            if (early_break) {
              break outer;
            }
          }
        }
      }

      return rtn_total_attackers;
    }

    function _toggleActiveNonActive(new_active) {
      var that, temp, rtn_changed;

      that = this;
      rtn_changed = false;
      temp = typeof new_active === 'boolean' ? new_active : !that[that.activeColor].isBlack;

      if ((temp ? 'b' : 'w') !== that.activeColor || (!temp ? 'b' : 'w') !== that.nonActiveColor) {
        rtn_changed = true;
        that.activeColor = temp ? 'b' : 'w';
        that.nonActiveColor = !temp ? 'b' : 'w';
      }

      return rtn_changed;
    }

    function _toggleIsRotated(new_is_rotated) {
      var that, temp, rtn_changed;

      that = this;
      rtn_changed = false;
      temp = typeof new_is_rotated === 'boolean' ? new_is_rotated : !that.isRotated;

      if (temp !== that.isRotated) {
        rtn_changed = true;
        that.isRotated = temp;
        that.refreshUi(0, false); //autorefresh
      }

      return rtn_changed;
    }

    function _setPromoteTo(qal) {
      var that, temp, rtn_changed;

      that = this;
      rtn_changed = false;
      temp = _promoteValHelper(qal);

      if (temp !== that.promoteTo) {
        rtn_changed = true;
        that.promoteTo = temp;
        that.refreshUi(0, false); //autorefresh
      }

      return rtn_changed;
    }

    function _silentlyResetOptions() {
      var that;

      that = this;
      that.isHidden = true; //prevents ui refresh from setPromoteTo()
      that.isRotated = false;
      that.setPromoteTo(_QUEEN);
      that.isHidden = false;
    }

    function _silentlyResetManualResult() {
      var that, temp;

      that = this;
      temp = that.isHidden;
      that.isHidden = true;
      that.setManualResult(_RESULT_ONGOING);
      that.isHidden = temp;
    }

    function _setManualResult(str) {
      var that, temp, rtn_changed;

      that = this;
      rtn_changed = false;
      temp = _pgnResultHelper(str) || _RESULT_ONGOING;

      if (temp !== that.manualResult) {
        rtn_changed = true;
        that.manualResult = temp;
        that.refreshUi(0, false); //autorefresh
      }

      return rtn_changed;
    }

    function _setCurrentMove(num, is_goto) {
      var len, that, temp, diff, rtn_changed;

      that = this;
      rtn_changed = false;

      block: {
        len = that.moveList.length;

        if (len < 2) {
          break block;
        }

        if (typeof is_goto !== 'boolean') {
          num = _toInt(num, 0, len - 1);
          diff = num - that.currentMove;
          is_goto = Math.abs(diff) !== 1;
          num = is_goto ? num : diff;
        }

        num = _toInt(num);
        temp = _toInt(is_goto ? num : num + that.currentMove, 0, len - 1);

        if (temp === that.currentMove) {
          break block;
        }

        that.updateHelper({
          currentMove: temp,
          fen: that.moveList[temp].fen,
          skipFenValidation: true,
        }); /*NO remove skipFenValidation*/

        that.refreshUi(is_goto ? 0 : num, true); //autorefresh
        rtn_changed = true;
      }

      return rtn_changed;
    }

    function _navFirst() {
      var that;

      that = this;

      return that.setCurrentMove(0); //autorefresh (sometimes)
    }

    function _navPrevious() {
      var that;

      that = this;

      return that.setCurrentMove(that.currentMove - 1); //autorefresh (sometimes)
    }

    function _navNext() {
      var that;

      that = this;

      return that.setCurrentMove(that.currentMove + 1); //autorefresh (sometimes)
    }

    function _navLast() {
      var that;

      that = this;

      return that.setCurrentMove(that.moveList.length - 1); //autorefresh (sometimes)
    }

    function _navLinkMove(move_index) {
      var that;

      that = this;

      return that.setCurrentMove(move_index); //autorefresh (sometimes)
    }

    //p = {skipFenValidation, keepOptions}
    function _loadFen(fen, p) {
      var that, temp, hash_cache, rtn_changed;

      that = this;
      rtn_changed = false;
      p = _unreferenceP(p);

      block: {
        p.skipFenValidation = p.skipFenValidation === true;
        p.keepOptions = p.keepOptions === true;
        hash_cache = that.boardHash();

        temp = that.updateHelper({
          currentMove: 0,
          fen: fen,
          skipFenValidation: p.skipFenValidation,
          resetOptions: !p.keepOptions,
          resetMoveList: true,
        });

        if (!temp) {
          _consoleLog('Error[_loadFen]: bad FEN');
          break block;
        }

        that.silentlyResetManualResult();

        if (that.boardHash() !== hash_cache) {
          rtn_changed = true;
          that.refreshUi(0, false); //autorefresh
        }
      }

      return rtn_changed;
    }

    function _loadValidatedFen(fen) {
      var i, j, len, that, fen_parts, current_file, current_char, fen_board_arr, skip_files;

      that = this;

      for (i = 0; i < 8; i++) {
        //0...7
        for (j = 0; j < 8; j++) {
          //0...7
          that.setSquare([i, j], _EMPTY_SQR);
        }
      }

      fen = _trimSpaces(fen);
      fen_parts = fen.split(' ');
      fen_board_arr = fen_parts[0].split('/');

      for (i = 0; i < 8; i++) {
        //0...7
        current_file = 0;

        for (j = 0, len = fen_board_arr[i].length; j < len; j++) {
          //0<len
          current_char = fen_board_arr[i].charAt(j);
          skip_files = current_char * 1;

          if (!skip_files) {
            that.setSquare([i, current_file], current_char);
          }

          current_file += skip_files || 1;
        }
      }

      that.w.castling =
        (_strContains(fen_parts[2], 'K') ? _SHORT_CASTLE : 0) + (_strContains(fen_parts[2], 'Q') ? _LONG_CASTLE : 0);
      that.b.castling =
        (_strContains(fen_parts[2], 'k') ? _SHORT_CASTLE : 0) + (_strContains(fen_parts[2], 'q') ? _LONG_CASTLE : 0);

      that.enPassantBos = fen_parts[3].replace('-', '');

      that.toggleActiveNonActive(fen_parts[1] === 'b');

      that.halfMove = fen_parts[4] * 1 || 0;
      that.fullMove = fen_parts[5] * 1 || 1;
    }

    function _getClocklessFenHelper() {
      var i, j, that, fen_board, current_square, consecutive_empty_squares, rtn;

      that = this;
      fen_board = '';

      for (i = 0; i < 8; i++) {
        //0...7
        consecutive_empty_squares = 0;

        for (j = 0; j < 8; j++) {
          //0...7
          current_square = that.getSquare([i, j]);

          if (!current_square.isEmptySquare) {
            fen_board += (consecutive_empty_squares || '') + current_square.bal;
            consecutive_empty_squares = -1;
          }

          consecutive_empty_squares++;
        }

        fen_board += (consecutive_empty_squares || '') + (i !== 7 ? '/' : '');
      }

      rtn = fen_board;
      rtn += ' ' + that.activeColor;
      rtn += ' ' + (_castlingChars(that.w.castling).toUpperCase() + '' + _castlingChars(that.b.castling) || '-');
      rtn += ' ' + (that.enPassantBos || '-');

      return rtn;
    }

    function _updateFenAndMisc(sliced_fen_history) {
      var i,
        j,
        k,
        m,
        len,
        that,
        temp,
        temp2,
        current_diff,
        from_bos,
        to_bos,
        can_en_passant,
        total_pieces,
        clockless_fen,
        times_found,
        bishop_count,
        at_least_one_light,
        at_least_one_dark;

      that = this;
      that.checks = that.attackersFromNonActive(null);
      that.isCheck = !!that.checks; /*NO move below legalMovesHelper()*/

      that.legalUci = [];
      that.legalUciTree = {};
      that.legalRevTree = {};

      for (i = 0; i < 8; i++) {
        //0...7
        for (j = 0; j < 8; j++) {
          //0...7
          temp = that.legalMovesHelper([i, j]);
          len = temp.uciMoves.length;

          if (!len) {
            continue;
          }

          from_bos = toBos([i, j]);
          that.legalUciTree[from_bos] = [];

          for (k = 0; k < len; k++) {
            //0<len
            temp2 = temp.uciMoves[k];

            if (temp.isPromotion) {
              for (m = _KNIGHT; m <= _QUEEN; m++) {
                //2...5
                that.legalUci.push(temp2 + toBal(m).toLowerCase());
                that.legalUciTree[from_bos].push(temp2 + toBal(m).toLowerCase());
              }
            } else {
              that.legalUci.push(temp2);
              that.legalUciTree[from_bos].push(temp2);
            }

            to_bos = temp2.slice(2, 4);

            if (!that.legalRevTree[to_bos]) {
              that.legalRevTree[to_bos] = {};
            }

            if (!that.legalRevTree[to_bos][temp.piece]) {
              that.legalRevTree[to_bos][temp.piece] = [];
            }

            that.legalRevTree[to_bos][temp.piece].push(from_bos);
          }
        }
      }

      that.isCheckmate = that.isCheck && !that.legalUci.length;
      that.isStalemate = !that.isCheck && !that.legalUci.length;

      if (that.enPassantBos) {
        can_en_passant = false;

        if (that.legalRevTree[that.enPassantBos] && that.legalRevTree[that.enPassantBos]['p']) {
          can_en_passant = true;
        }

        if (!can_en_passant) {
          that.enPassantBos = ''; //remove inexecutable en passants
        }
      }

      clockless_fen = that.getClocklessFenHelper();
      that.fen = clockless_fen + ' ' + that.halfMove + ' ' + that.fullMove;
      that.isThreefold = false;

      if (sliced_fen_history || (that.moveList && that.currentMove > 7 && that.halfMove > 7)) {
        times_found = 1;
        temp = sliced_fen_history || that.fenHistoryExport();
        i = sliced_fen_history ? sliced_fen_history.length - 1 : that.currentMove - 1;

        for (; i >= 0; i--) {
          //(len-1)...0
          temp2 = temp[i].split(' ');

          if (temp2.slice(0, 4).join(' ') === clockless_fen) {
            times_found++;

            if (times_found > 2) {
              that.isThreefold = true;
              break;
            }
          }

          if (temp2[4] === '0') {
            break;
          }
        }
      }

      total_pieces = countPieces(clockless_fen);
      that.isInsufficientMaterial = false;

      if (
        !(
          total_pieces.w.p +
          total_pieces.b.p +
          total_pieces.w.r +
          total_pieces.b.r +
          total_pieces.w.q +
          total_pieces.b.q
        )
      ) {
        if (total_pieces.w.n + total_pieces.b.n) {
          that.isInsufficientMaterial = total_pieces.w.n + total_pieces.b.n + total_pieces.w.b + total_pieces.b.b === 1; //k vs kn
        } else if (total_pieces.w.b + total_pieces.b.b) {
          bishop_count = that.countLightDarkBishops();

          at_least_one_light = !!(bishop_count.w.lightSquaredBishops + bishop_count.b.lightSquaredBishops);
          at_least_one_dark = !!(bishop_count.w.darkSquaredBishops + bishop_count.b.darkSquaredBishops);

          that.isInsufficientMaterial = at_least_one_light !== at_least_one_dark; //k(b*x) vs k(b*x)
        } else {
          //k vs k
          that.isInsufficientMaterial = true;
        }
      }

      that.isFiftyMove = that.halfMove >= 100;

      that.inDraw =
        !that.isCheckmate && (that.isStalemate || that.isThreefold || that.isInsufficientMaterial || that.isFiftyMove);

      that.w.materialDiff = [];
      that.b.materialDiff = [];

      for (i = _PAWN; i <= _KING; i++) {
        //1...6
        temp = toBal(-i);
        current_diff = total_pieces.w[temp] - total_pieces.b[temp];

        for (j = 0, len = Math.abs(current_diff); j < len; j++) {
          //0<len
          if (current_diff > 0) {
            that.w.materialDiff.push(i);
          } else {
            that.b.materialDiff.push(-i);
          }
        }
      }
    }

    function _refinedFenTest() {
      var i,
        j,
        k,
        that,
        temp,
        en_passant_square,
        behind_ep_val,
        infront_ep_is_empty,
        bishop_count,
        total_pieces,
        fen_board,
        total_pawns_in_current_file,
        min_captured,
        active_side,
        non_active_side,
        current_side,
        current_other_side,
        current_bishop_count,
        current_promoted_count,
        rtn_msg;

      that = this;
      rtn_msg = '';

      block: {
        active_side = that[that.activeColor];
        non_active_side = that[that.nonActiveColor];

        if (that.halfMove - active_side.isBlack + 1 >= that.fullMove * 2) {
          rtn_msg = 'Error [0] exceeding half moves ratio';
          break block;
        }

        if (that.checks > 2) {
          rtn_msg = 'Error [1] king is checked more times than possible';
          break block;
        }

        if (that.attackersFromActive(null, true)) {
          rtn_msg = 'Error [2] non-active king in check';
          break block;
        }

        if (that.enPassantBos) {
          en_passant_square = that.getSquare(that.enPassantBos);

          infront_ep_is_empty = that.getSquare(en_passant_square, {
            rankShift: active_side.singlePawnRankShift,
          }).isEmptySquare;

          behind_ep_val = that.getSquare(en_passant_square, {
            rankShift: non_active_side.singlePawnRankShift,
          }).val;

          //it is OK if the en passant can't be played next turn or no adjacent pawns exist
          if (
            that.halfMove ||
            !en_passant_square.isEmptySquare ||
            en_passant_square.rankPos !== (active_side.isBlack ? 5 : 2) ||
            !infront_ep_is_empty ||
            behind_ep_val !== non_active_side.pawn
          ) {
            rtn_msg = 'Error [3] bad en-passant';
            break block;
          }
        }

        total_pieces = countPieces(that.fen);
        bishop_count = that.countLightDarkBishops();

        for (i = 0; i < 2; i++) {
          //0...1
          current_side = i ? total_pieces.b : total_pieces.w;
          current_other_side = i ? total_pieces.w : total_pieces.b;
          current_bishop_count = i ? bishop_count.b : bishop_count.w;

          //if(current_side.k!==1){...} done in _basicFenTest

          if (current_side.p > 8) {
            rtn_msg = 'Error [' + (i + 4) + '] more than 8 pawns';
            break block;
          }

          current_promoted_count =
            Math.max(current_side.n - 2, 0) +
            Math.max(current_bishop_count.lightSquaredBishops - 1, 0) +
            Math.max(current_bishop_count.darkSquaredBishops - 1, 0) +
            Math.max(current_side.r - 2, 0) +
            Math.max(current_side.q - 1, 0);

          temp =
            current_other_side.p +
            current_other_side.n +
            current_other_side.b +
            current_other_side.r +
            current_other_side.q +
            current_other_side.k;

          if (temp === 16 && current_promoted_count) {
            rtn_msg = 'Error [' + (i + 6) + '] promoted pieces without capturing any piece';
            break block;
          }

          if (current_promoted_count > 8 - current_side.p) {
            rtn_msg = 'Error [' + (i + 8) + '] promoted pieces exceed the number of missing pawns';
            break block;
          }
        }

        fen_board = that.fen.split(' ')[0];

        for (i = 0; i < 2; i++) {
          //0...1
          current_side = i ? that.b : that.w;
          min_captured = 0;

          for (j = 0; j < 8; j++) {
            //0...7
            total_pawns_in_current_file = 0;

            for (k = 0; k < 8; k++) {
              //0...7
              total_pawns_in_current_file += that.getSquare([k, j]).val === current_side.pawn;
            }

            if (total_pawns_in_current_file > 1) {
              temp = j === 0 || j === 7 ? [1, 3, 6, 10, 99] : [1, 2, 4, 6, 9];

              min_captured += temp[total_pawns_in_current_file - 2];
            }
          }

          if (min_captured > 15 - _occurrences(fen_board, i ? 'P|N|B|R|Q' : 'p|n|b|r|q')) {
            rtn_msg = 'Error [10] not enough captured pieces to support the total doubled pawns';
            break block;
          }
        }

        for (i = 0; i < 2; i++) {
          //0...1
          current_side = i ? that.b : that.w;

          if (!current_side.castling) {
            continue;
          }

          temp = {
            completeActiveColor: i ? 'black' : 'white',
            originalKingBos: i ? 'e8' : 'e1',
            originalLongRookBos: i ? 'a8' : 'a1',
            originalShortRookBos: i ? 'h8' : 'h1',
          };

          if (that.getSquare(temp.originalKingBos).val !== current_side.king) {
            rtn_msg = 'Error [11] ' + temp.completeActiveColor + ' castling rights without king in original square';
            break block;
          }

          if (
            current_side.castling !== _LONG_CASTLE &&
            that.getSquare(temp.originalShortRookBos).val !== current_side.rook
          ) {
            rtn_msg = 'Error [12] ' + temp.completeActiveColor + ' short castling rights with missing H-file rook';
            break block;
          }

          if (
            current_side.castling !== _SHORT_CASTLE &&
            that.getSquare(temp.originalLongRookBos).val !== current_side.rook
          ) {
            rtn_msg = 'Error [13] ' + temp.completeActiveColor + ' long castling rights with missing A-file rook';
            break block;
          }
        }
      }

      return rtn_msg;
    }

    function _testCollision(op, initial_qos, piece_direction, as_knight, max_shifts, allow_capture) {
      var i, that, current_square, rank_change, file_change, active_side, rtn;

      that = this;

      rtn = {
        candidateMoves: [],
        isAttacked: false,
      };

      active_side = that[that.activeColor];
      piece_direction = _toInt(piece_direction, 1, 8);
      rank_change = (as_knight ? [-2, -1, 1, 2, 2, 1, -1, -2] : [-1, -1, 0, 1, 1, 1, 0, -1])[piece_direction - 1];
      file_change = (as_knight ? [1, 2, 2, 1, -1, -2, -2, -1] : [0, 1, 1, 1, 0, -1, -1, -1])[piece_direction - 1];
      max_shifts = _toInt(as_knight ? 1 : max_shifts || 7);

      for (i = 0; i < max_shifts; i++) {
        //0<max_shifts
        current_square = that.getSquare(initial_qos, {
          rankShift: rank_change * (i + 1),
          fileShift: file_change * (i + 1),
        });

        if (current_square === null) {
          break;
        }

        if (current_square.isEmptySquare) {
          if (op === 1) {
            rtn.candidateMoves.push(current_square.bos);
          }

          continue;
        }

        if (current_square.sign === active_side.sign) {
          break;
        }

        if (op === 1) {
          if (allow_capture && !current_square.isKing) {
            rtn.candidateMoves.push(current_square.bos);
          }
        }

        if (op === 2) {
          if (as_knight) {
            if (current_square.isKnight) {
              rtn.isAttacked = true;
            }
          } else if (current_square.isKing) {
            if (!i) {
              rtn.isAttacked = true;
            }
          } else if (current_square.isQueen) {
            rtn.isAttacked = true;
          } else if (piece_direction % 2) {
            if (current_square.isRook) {
              rtn.isAttacked = true;
            }
          } else if (current_square.isBishop) {
            rtn.isAttacked = true;
          } else if (!i && current_square.isPawn) {
            if (current_square.sign > 0) {
              if (piece_direction === _DIRECTION_BOTTOM_RIGHT || piece_direction === _DIRECTION_BOTTOM_LEFT) {
                rtn.isAttacked = true;
              }
            } else {
              if (piece_direction === _DIRECTION_TOP_RIGHT || piece_direction === _DIRECTION_TOP_LEFT) {
                rtn.isAttacked = true;
              }
            }
          }
        }

        break;
      }

      return rtn;
    }

    function _legalMovesHelper(target_qos) {
      var i,
        j,
        len,
        len2,
        that,
        temp,
        temp2,
        current_cached_square,
        target_cached_square,
        current_diagonal_square,
        pseudo_legal_arr,
        is_promotion,
        en_passant_capturable_cached_square,
        piece_directions,
        active_side,
        non_active_side,
        rtn;

      that = this;

      function _candidateMoves(qos, piece_direction, as_knight, max_shifts, allow_capture) {
        //uses: that
        return that.testCollision(1, qos, piece_direction, as_knight, max_shifts, allow_capture).candidateMoves;
      }

      rtn = {
        uciMoves: [],
        piece: '',
        isPromotion: false,
      };

      block: {
        target_cached_square = that.getSquare(target_qos, {
          isUnreferenced: true,
        });

        if (target_cached_square === null) {
          break block;
        }

        active_side = that[that.activeColor];
        non_active_side = that[that.nonActiveColor];

        if (target_cached_square.isEmptySquare || target_cached_square.sign === non_active_side.sign) {
          break block;
        }

        pseudo_legal_arr = [];
        en_passant_capturable_cached_square = null;
        is_promotion = false;
        rtn.piece = target_cached_square.bal.toLowerCase();

        if (target_cached_square.isKing) {
          for (i = _DIRECTION_TOP; i <= _DIRECTION_TOP_LEFT; i++) {
            //1...8
            temp = _candidateMoves(target_cached_square, i, false, 1, true);

            if (temp.length) {
              pseudo_legal_arr.push(temp);
            }
          }

          if (active_side.castling && !that.isCheck) {
            for (i = 0; i < 2; i++) {
              //0...1
              temp2 = {
                castleToSkip: i ? _SHORT_CASTLE : _LONG_CASTLE,
                direction: i ? _DIRECTION_LEFT : _DIRECTION_RIGHT,
                consecutiveEmpty: i ? 3 : 2,
                singleFileShift: i ? -1 : 1,
              };

              if (active_side.castling === temp2.castleToSkip) {
                continue;
              }

              if (
                _candidateMoves(target_cached_square, temp2.direction, false, temp2.consecutiveEmpty, false).length !==
                temp2.consecutiveEmpty
              ) {
                continue;
              }

              if (
                that.attackersFromNonActive(
                  that.getSquare(target_cached_square, { fileShift: temp2.singleFileShift }),
                  true
                )
              ) {
                continue;
              }

              temp = that.getSquare(target_cached_square, {
                fileShift: temp2.singleFileShift * 2,
              });

              pseudo_legal_arr.push([temp]);
            }
          }
        } else if (target_cached_square.isPawn) {
          //any move played from pawns that are one square away from promotion will always cause a promotion
          is_promotion = target_cached_square.rankPos === non_active_side.secondRankPos;

          temp = _candidateMoves(
            target_cached_square,
            active_side.isBlack ? _DIRECTION_BOTTOM : _DIRECTION_TOP,
            false,
            target_cached_square.rankPos === active_side.secondRankPos ? 2 : 1,
            false
          );

          if (temp.length) {
            pseudo_legal_arr.push(temp);
          }

          for (i = 0; i < 2; i++) {
            //0...1
            current_diagonal_square = that.getSquare(target_cached_square, {
              rankShift: active_side.singlePawnRankShift,
              fileShift: i ? -1 : 1,
            });

            if (current_diagonal_square === null) {
              continue;
            }

            temp = sameSquare(current_diagonal_square, that.enPassantBos);

            if (
              temp ||
              (current_diagonal_square.sign !== active_side.sign &&
                !current_diagonal_square.isEmptySquare &&
                !current_diagonal_square.isKing)
            ) {
              pseudo_legal_arr.push([current_diagonal_square]);
            }

            if (temp) {
              en_passant_capturable_cached_square = that.getSquare(current_diagonal_square, {
                rankShift: non_active_side.singlePawnRankShift,
                isUnreferenced: true,
              });
            }
          }
        } else {
          //knight, bishop, rook, queen
          piece_directions = [];
          if (!target_cached_square.isBishop) {
            piece_directions.push(1, 3, 5, 7);
          }
          if (!target_cached_square.isRook) {
            piece_directions.push(2, 4, 6, 8);
          }

          for (i = 0, len = piece_directions.length; i < len; i++) {
            //0<len
            temp = _candidateMoves(
              target_cached_square,
              piece_directions[i],
              target_cached_square.isKnight,
              null,
              true
            );

            if (temp.length) {
              pseudo_legal_arr.push(temp);
            }
          }
        }

        for (i = 0, len = pseudo_legal_arr.length; i < len; i++) {
          //0<len
          for (j = 0, len2 = pseudo_legal_arr[i].length; j < len2; j++) {
            //0<len2
            current_cached_square = that.getSquare(pseudo_legal_arr[i][j], {
              isUnreferenced: true,
            });

            that.setSquare(current_cached_square, target_cached_square.val);
            that.setSquare(target_cached_square, _EMPTY_SQR);

            if (en_passant_capturable_cached_square !== null) {
              if (sameSquare(current_cached_square, that.enPassantBos)) {
                that.setSquare(en_passant_capturable_cached_square, _EMPTY_SQR);
              }
            }

            if (!that.attackersFromNonActive(null, true)) {
              rtn.uciMoves.push(target_cached_square.bos + current_cached_square.bos);
            }

            that.setSquare(current_cached_square, current_cached_square.val);
            that.setSquare(target_cached_square, target_cached_square.val);

            if (en_passant_capturable_cached_square !== null) {
              that.setSquare(en_passant_capturable_cached_square, en_passant_capturable_cached_square.val);
            }
          }
        }

        if (rtn.uciMoves.length) {
          rtn.isPromotion = is_promotion;
        }
      }

      return rtn;
    }

    //p = {returnType, squareType, delimiter}
    function _legalMoves(target_qos, p) {
      var i, len, that, temp, temp2, temp3, is_fen_or_san, from_bos, to_bos, used_keys, legal_uci_in_bos, rtn;

      that = this;
      rtn = [];
      p = _unreferenceP(p);

      block: {
        legal_uci_in_bos = that.legalUciTree[toBos(target_qos)];

        if (!legal_uci_in_bos || !legal_uci_in_bos.length) {
          break block;
        }

        legal_uci_in_bos = legal_uci_in_bos.slice(0);
        p.returnType = _isNonEmptyStr(p.returnType) ? p.returnType : 'toSquare';
        p.squareType = _isNonEmptyStr(p.squareType) ? p.squareType : 'bos';
        p.delimiter = _isNonEmptyStr(p.delimiter) ? p.delimiter.charAt(0) : '-';

        if (p.returnType === 'uci') {
          rtn = legal_uci_in_bos;
          break block;
        }

        temp = [];
        used_keys = {};
        is_fen_or_san = p.returnType === 'fen' || p.returnType === 'san';

        for (i = 0, len = legal_uci_in_bos.length; i < len; i++) {
          //0<len
          temp2 = legal_uci_in_bos[i];

          if (is_fen_or_san) {
            temp3 = that.playMove(temp2, { isMockMove: true, isLegalMove: true, isUnreferenced: true });

            if (p.returnType === 'fen') {
              temp.push(temp3.fen);
            } else {
              //type "san"
              temp.push(temp3.san);
            }

            continue;
          }

          from_bos = temp2.slice(0, 2);
          to_bos = temp2.slice(2, 4);

          if (used_keys[to_bos]) {
            continue;
          }

          used_keys[to_bos] = true;

          if (p.returnType === 'joined') {
            temp.push(from_bos + p.delimiter + to_bos);
          } else if (p.returnType === 'fromToSquares') {
            if (p.squareType === 'square') {
              temp.push([
                that.getSquare(from_bos, { isUnreferenced: true }),
                that.getSquare(to_bos, { isUnreferenced: true }),
              ]);
            } else if (p.squareType === 'pos') {
              temp.push([toPos(from_bos), toPos(to_bos)]);
            } else {
              //type "bos"
              temp.push([from_bos, to_bos]);
            }
          } else {
            //type "toSquare"
            if (p.squareType === 'square') {
              temp.push(that.getSquare(to_bos, { isUnreferenced: true }));
            } else if (p.squareType === 'pos') {
              temp.push(toPos(to_bos));
            } else {
              //type "bos"
              temp.push(to_bos);
            }
          }
        }

        if (is_fen_or_san && temp.length !== legal_uci_in_bos.length) {
          break block;
        }

        rtn = temp;
      }

      return rtn;
    }

    function _legalFenMoves(target_qos) {
      var that;

      that = this;

      return that.legalMoves(target_qos, { returnType: 'fen' });
    }

    function _legalSanMoves(target_qos) {
      var that;

      that = this;

      return that.legalMoves(target_qos, { returnType: 'san' });
    }

    function _legalUciMoves(target_qos) {
      var that;

      that = this;

      return that.legalMoves(target_qos, { returnType: 'uci' });
    }

    //p = {delimiter}
    function _isLegalMove(mov, p) {
      var that, wrapped_move, legal_uci_in_bos, rtn;

      that = this;
      rtn = false;

      block: {
        wrapped_move = that.getWrappedMove(mov, p);

        if (wrapped_move === null) {
          break block;
        }

        if (wrapped_move.isConfirmedLegalMove) {
          rtn = true;

          break block;
        }

        legal_uci_in_bos = that.legalUciTree[wrapped_move.fromBos];

        if (!legal_uci_in_bos || !legal_uci_in_bos.length) {
          break block;
        }

        //can't easily use arr.indexOf(str) because the uci promotion char
        /*NO use overcomplicated legalRevTree*/
        rtn = _strContains(legal_uci_in_bos.join(','), wrapped_move.fromBos + '' + wrapped_move.toBos);
      }

      return rtn;
    }

    function _getCheckmateMoves(early_break) {
      var i, len, that, temp, rtn;

      that = this;
      rtn = [];

      outer: for (i = 0, len = that.legalUci.length; i < len; i++) {
        //0<len
        temp = that.playMove(that.legalUci[i], { isLegalMove: true, isMockMove: true });

        if (temp.moveResult && !temp.canDraw) {
          rtn.push(temp.uci);

          if (early_break) {
            break outer;
          }
        }
      }

      return rtn;
    }

    function _getDrawMoves(early_break) {
      var i, len, that, temp, rtn;

      that = this;
      rtn = [];

      outer: for (i = 0, len = that.legalUci.length; i < len; i++) {
        //0<len
        temp = that.playMove(that.legalUci[i], { isLegalMove: true, isMockMove: true });

        if (temp.canDraw) {
          rtn.push(temp.uci);

          if (early_break) {
            break outer;
          }
        }
      }

      return rtn;
    }

    function _fenHistoryExport() {
      var i, len, that, rtn;

      that = this;
      rtn = [];

      for (i = 0, len = that.moveList.length; i < len; i++) {
        //0<len
        rtn.push(that.moveList[i].fen);
      }

      return rtn;
    }

    function _pgnExport() {
      /*TODO p options: remove comments, max line len, tag white-list*/
      var i,
        len,
        that,
        header,
        ordered_tags,
        result_tag_ow,
        move_list,
        black_starts,
        initial_fen,
        initial_full_move,
        current_move,
        text_game,
        rtn;

      that = this;
      rtn = '';

      header = _unreferenceP(header); /*TODO header from _pgnParserHelper()*/
      move_list = that.moveList;
      initial_fen = move_list[0].fen;
      black_starts = move_list[0].colorToPlay === 'b';

      initial_full_move =
        that.fullMove -
        Math.floor((that.currentMove + black_starts - 1) / 2) +
        (black_starts === !(that.currentMove % 2)) -
        1;

      result_tag_ow = _RESULT_ONGOING;
      text_game = '';

      for (i = 0, len = move_list.length; i < len; i++) {
        //0<len
        if (i) {
          current_move = initial_full_move + Math.floor((i + black_starts - 1) / 2);

          text_game += i !== 1 ? ' ' : '';
          text_game += move_list[i - 1].comment && black_starts === !!(i % 2) ? current_move + '...' : '';
          text_game += black_starts === !(i % 2) ? current_move + '. ' : '';
          text_game += move_list[i].san;

          if (move_list[i].comment) {
            text_game += ' ' + move_list[i].comment;
          }
        }

        if (move_list[i].moveResult) {
          result_tag_ow = move_list[i].moveResult;
        }
      }

      if (result_tag_ow === _RESULT_ONGOING) {
        if (move_list[move_list.length - 1].canDraw) {
          result_tag_ow = _RESULT_DRAW;
        }
      }

      if (that.manualResult !== _RESULT_ONGOING) {
        result_tag_ow = that.manualResult;
      }

      if (text_game) {
        if (black_starts) {
          text_game = initial_full_move + '...' + text_game;
        }

        text_game += ' ' + result_tag_ow;
      } else {
        text_game += result_tag_ow;
      }

      text_game = text_game || _RESULT_ONGOING;

      ordered_tags = [
        ['Event', header.Event || 'Chess game'],
        ['Site', header.Site || '?'],
        ['Date', header.Date || '????.??.??'],
        ['Round', header.Round || '?'],
        ['White', header.White || '?'],
        ['Black', header.Black || '?'],
        ['Result', result_tag_ow],
      ];

      if (initial_fen !== _DEFAULT_FEN) {
        ordered_tags.push(['SetUp', '1']);
        ordered_tags.push(['FEN', initial_fen]);
      }

      for (i = 0, len = ordered_tags.length; i < len; i++) {
        //0<len
        rtn += '[' + ordered_tags[i][0] + ' "' + ordered_tags[i][1] + '"]\n';
      }

      rtn += '\n' + text_game;

      return rtn;
    }

    function _uciExport() {
      var i, len, that, uci_arr, rtn;

      that = this;
      rtn = '';
      uci_arr = [];

      for (i = 1, len = that.moveList.length; i < len; i++) {
        //1<len
        uci_arr.push(that.moveList[i].uci);
      }

      if (uci_arr.length) {
        rtn = uci_arr.join(' ');
      }

      return rtn;
    }

    function _ascii(is_rotated) {
      var i, j, that, bottom_label, current_square, rtn;

      that = this;
      is_rotated = typeof is_rotated === 'boolean' ? is_rotated : that.isRotated;
      rtn = '   +------------------------+\n';
      bottom_label = '';

      for (i = 0; i < 8; i++) {
        //0...7
        for (j = 0; j < 8; j++) {
          //0...7
          current_square = that.getSquare(is_rotated ? [7 - i, 7 - j] : [i, j]);

          rtn += j ? '' : ' ' + current_square.rankBos + ' |';
          rtn += ' ' + current_square.bal.replace('*', '.') + ' ';
          rtn += j === 7 ? '|\n' : '';

          bottom_label += i === j ? '  ' + current_square.fileBos : '';
        }
      }

      rtn += '   +------------------------+\n';
      rtn += '   ' + bottom_label + '\n';

      return rtn;
    }

    function _boardHash() {
      var i, len, that, temp;

      that = this;
      temp = '';

      for (i = 0, len = _MUTABLE_KEYS.length; i < len; i++) {
        //0<len
        temp += JSON.stringify(that[_MUTABLE_KEYS[i]]);
      }

      return _hashCode(temp);
    }

    function _isEqualBoard(to_woard) {
      var that, to_board, rtn;

      that = this;
      rtn = false;

      block: {
        to_board = getBoard(to_woard);

        if (to_board === null) {
          _consoleLog("Error[_isEqualBoard]: to_woard doesn't exist");
          break block;
        }

        rtn = that === to_board || that.boardHash() === to_board.boardHash();
      }

      return rtn;
    }

    function _cloneBoardFrom(from_woard) {
      var that, hash_cache, rtn_changed;

      that = this;
      hash_cache = that.boardHash();
      rtn_changed = false;

      _cloneBoardToObj(that, from_woard);

      if (that.boardHash() !== hash_cache) {
        rtn_changed = true;
        that.refreshUi(0, false); //autorefresh
      }

      return rtn_changed;
    }

    function _cloneBoardTo(to_woard) {
      var that, hash_cache, to_board, rtn_changed;

      that = this;
      rtn_changed = false;

      block: {
        to_board = getBoard(to_woard);

        if (to_board === null) {
          _consoleLog("Error[_cloneBoardTo]: to_woard doesn't exist");
          break block;
        }

        hash_cache = to_board.boardHash();

        _cloneBoardToObj(to_board, that);

        if (to_board.boardHash() !== hash_cache) {
          rtn_changed = true;
          to_board.refreshUi(0, false); //autorefresh
        }
      }

      return rtn_changed;
    }

    function _reset(keep_options) {
      var that, hash_cache, rtn_changed;

      that = this;
      rtn_changed = false;
      hash_cache = that.boardHash();

      that.updateHelper({
        currentMove: 0,
        fen: _DEFAULT_FEN,
        skipFenValidation: true,
        resetOptions: !keep_options,
        resetMoveList: true,
      }); /*NO remove skipFenValidation*/

      that.silentlyResetManualResult();

      if (that.boardHash() !== hash_cache) {
        rtn_changed = true;
        that.refreshUi(0, false); //autorefresh
      }

      return rtn_changed;
    }

    function _undoMove() {
      var that, temp, rtn;

      that = this;
      rtn = null;

      block: {
        temp = that.undoMoves(1);

        if (temp.length !== 1) {
          break block;
        }

        rtn = temp[0];
      }

      return rtn;
    }

    function _undoMoves(decrease_by) {
      var i, that, temp, hash_cache, rtn;

      that = this;
      rtn = [];

      block: {
        if (that.moveList.length < 2) {
          break block;
        }

        if (!decrease_by && decrease_by !== 0) {
          //both 0 and -0
          decrease_by = Infinity;
        }

        decrease_by = _toInt(decrease_by, 0, that.moveList.length - 1);

        if (!decrease_by) {
          break block;
        }

        hash_cache = that.boardHash();
        temp = that.isHidden;
        that.isHidden = true;
        that.navLinkMove(Math.min(that.moveList.length - decrease_by - 1, that.currentMove));
        that.isHidden = temp;

        rtn = new Array(decrease_by); //safe to use because every spot will be assigned below

        for (i = 0; i < decrease_by; i++) {
          //0<decrease_by
          rtn[decrease_by - i - 1] = _unreferencedMoveHelper(that.moveList[that.moveList.length - i - 1]);
        }

        that.moveList = that.moveList.slice(0, -decrease_by);

        if (that.boardHash() !== hash_cache) {
          that.silentlyResetManualResult();
          that.refreshUi(0, false); //autorefresh
        }
      }

      return rtn;
    }

    function _countLightDarkBishops() {
      var i, j, that, current_square, current_side, rtn;

      that = this;

      rtn = {
        w: { lightSquaredBishops: 0, darkSquaredBishops: 0 },
        b: { lightSquaredBishops: 0, darkSquaredBishops: 0 },
      };

      for (i = 0; i < 8; i++) {
        //0...7
        for (j = 0; j < 8; j++) {
          //0...7
          current_square = that.getSquare([i, j]);

          if (current_square.isBishop) {
            current_side = current_square.sign > 0 ? rtn.w : rtn.b;

            if ((i + j) % 2) {
              current_side.darkSquaredBishops++;
            } else {
              current_side.lightSquaredBishops++;
            }
          }
        }
      }

      return rtn;
    }

    function _updateHelper(obj) {
      var that, temp, fen_was_valid, rtn;

      that = this;
      rtn = false;

      block: {
        if (!_isObject(obj)) {
          _consoleLog('Error[_updateHelper]: wrong input type');
          break block;
        }

        if (obj.fen) {
          fen_was_valid = obj.skipFenValidation || isLegalFen(obj.fen);

          if (!fen_was_valid) {
            _consoleLog('Error[_updateHelper]: bad FEN');
            break block;
          }
        }

        that.currentMove = _toInt(obj.currentMove);

        if (obj.fen) {
          that.loadValidatedFen(obj.fen);
        }

        that.updateFenAndMisc(obj.slicedFenHistory);

        if (obj.resetMoveList) {
          temp = '';

          if (that.isCheckmate) {
            temp = that[that.activeColor].isBlack ? _RESULT_W_WINS : _RESULT_B_WINS;
          } else if (that.isStalemate) {
            temp = _RESULT_DRAW;
          }

          that.moveList = [
            {
              colorMoved: that.nonActiveColor,
              colorToPlay: that.activeColor,
              fen: that.fen,
              san: '',
              uci: '',
              fromBos: '',
              toBos: '',
              enPassantBos: that.enPassantBos,
              piece: '',
              captured: '',
              promotion: '',
              comment: '',
              moveResult: temp,
              canDraw: that.inDraw,
              isEnPassantCapture: false,
            },
          ];
        }

        if (obj.resetOptions) {
          that.silentlyResetOptions();
        }

        rtn = true;
      }

      return rtn;
    }

    function _fenWrapmoveHelper(mov) {
      var i,
        j,
        that,
        obj,
        from_squares,
        to_squares,
        current_bos,
        old_square,
        new_square,
        parsed_promote,
        is_long_castle,
        king_rank,
        silent_mode_cache,
        rtn;

      that = this;
      rtn = null;

      block: {
        parsed_promote = '';

        if (!_isNonBlankStr(mov)) {
          break block;
        }

        silent_mode_cache = _SILENT_MODE;
        setSilentMode(true);
        obj = fenGet(mov, 'squares activeColor');
        setSilentMode(silent_mode_cache);

        if (!obj || that.activeColor === obj.activeColor) {
          break block;
        }

        from_squares = [];
        to_squares = [];

        for (i = 0; i < 8; i++) {
          //0...7
          for (j = 0; j < 8; j++) {
            //0...7
            current_bos = Ic.toBos([i, j]);
            old_square = that.getSquare(current_bos);
            new_square = obj.squares[current_bos]; //can't use getSquare()

            if (old_square.val === new_square.val) {
              continue;
            }

            if (new_square.val === 0) {
              //piece disappearing
              //this excludes enpassant capture
              //can't be 0 here (no problem with inverted logic >0 being <=0)
              if (old_square.val > 0 === (that.activeColor === 'w')) {
                from_squares.push(current_bos);
              }
            } else {
              //piece overwriting
              //this excludes enemy piece changes in ally turn and wrong color promotion
              //can't be 0 here (no problem with inverted logic >0 being <=0)
              if (new_square.val > 0 === (that.activeColor === 'w')) {
                to_squares.push(current_bos);
              }
            }
          }
        }

        //4 changes (len=2 + len=2) : king castled
        //2 changes (len=1 + len=1) : one piece moved
        //1 or 3 changes : invalid
        //0 changes : nothing moved
        if (from_squares.length === 2 && to_squares.length === 2) {
          is_long_castle = _strContains(from_squares.join(''), 'a');
          king_rank = that.activeColor === 'w' ? 1 : 8;

          to_squares = [(is_long_castle ? 'c' : 'g') + king_rank];
          from_squares = ['e' + king_rank];
        }

        if (from_squares.length !== 1 || to_squares.length !== 1) {
          break block;
        }

        old_square = that.getSquare(from_squares[0]);

        if (old_square === null) {
          break block;
        }

        new_square = obj.squares[to_squares[0]]; //can't use getSquare()

        if (!new_square) {
          //this might be undefined but never null (is not a getSquare() return)
          break block;
        }

        if (old_square.val !== new_square.val) {
          parsed_promote = new_square.bal;
        }

        rtn = [[old_square.bos, new_square.bos], parsed_promote];
      }

      return rtn;
    }

    function _sanWrapmoveHelper(mov) {
      var i, j, len, len2, that, temp, to_bos, validated_move, parsed_promote, lc_piece, parse_exec, pgn_obj, rtn;

      that = this;
      rtn = null;

      block: {
        validated_move = null;
        parsed_promote = '';
        mov = (' ' + mov).replace(/^\s+([1-9][0-9]*)*\s*\.*\s*\.*\s*/, '');

        if (!_isNonBlankStr(mov)) {
          break block;
        }

        lc_piece = '';
        to_bos = '';
        mov = _cleanSan(mov);

        if (/^[a-h]/.exec(mov)) {
          //pawn move
          lc_piece = 'p';
          parse_exec = /([^=]+)=(.?).*$/.exec(mov);

          if (parse_exec) {
            mov = parse_exec[1];
            parsed_promote = parse_exec[2];
          }

          to_bos = toBos(mov.slice(-2));
        } else if (mov === 'O-O') {
          //castling king (short)
          lc_piece = 'k';
          to_bos = that[that.activeColor].isBlack ? 'g8' : 'g1';
        } else if (mov === 'O-O-O') {
          //castling king (long)
          lc_piece = 'k';
          to_bos = that[that.activeColor].isBlack ? 'c8' : 'c1';
        } else {
          parse_exec = /^[NBRQK]/.exec(mov);

          if (parse_exec) {
            //knight, bishop, rook, queen, non-castling king
            lc_piece = parse_exec[0].toLowerCase();
            to_bos = toBos(mov.slice(-2));
          }
        }

        if (!lc_piece || !to_bos) {
          break block;
        }

        temp = that.legalRevTree[to_bos];

        if (!temp) {
          break block;
        }

        temp = temp[lc_piece];

        if (!temp) {
          break block;
        }

        outer: for (i = 0, len = temp.length; i < len; i++) {
          //0<len
          pgn_obj = that.draftMove([temp[i], to_bos], { isLegalMove: true }); /*NO pass unnecessary promoteTo*/

          if (!pgn_obj.canMove) {
            continue;
          }

          for (j = 0, len2 = pgn_obj.withOverdisambiguated.length; j < len2; j++) {
            //0<len2
            if (mov !== pgn_obj.withOverdisambiguated[j]) {
              continue;
            }

            validated_move = [temp[i], to_bos];
            break outer;
          }
        }

        if (validated_move === null) {
          break block;
        }

        rtn = [validated_move, parsed_promote];
      }

      return rtn;
    }

    //p = {delimiter}
    function _getWrappedMove(mov, p) {
      var that, temp, bubbling_promoted_to, is_confirmed_legal, rtn;

      that = this;
      rtn = null;

      block: {
        bubbling_promoted_to = 0;
        is_confirmed_legal = false;
        temp = _uciWrapmoveHelper(mov);

        if (temp) {
          bubbling_promoted_to = temp[1]; //default ""
          rtn = temp[0];
          break block;
        }

        temp = _joinedWrapmoveHelper(mov, p);

        if (temp) {
          rtn = temp;
          break block;
        }

        temp = _fromToWrapmoveHelper(mov);

        if (temp) {
          rtn = temp;
          break block;
        }

        temp = _moveWrapmoveHelper(mov);

        if (temp) {
          bubbling_promoted_to = temp[1]; //default ""
          rtn = temp[0];
          break block;
        }

        temp = that.fenWrapmoveHelper(mov);

        if (temp) {
          bubbling_promoted_to = temp[1]; //default ""
          rtn = temp[0];
          break block;
        }

        temp = that.sanWrapmoveHelper(mov); //place last for better performance

        if (temp) {
          bubbling_promoted_to = temp[1]; //default ""
          is_confirmed_legal = true;
          rtn = temp[0];
          break block;
        }
      }

      if (rtn) {
        temp = toAbsVal(bubbling_promoted_to) || that.promoteTo || _QUEEN; /*NO remove toAbsVal()*/

        rtn = {
          fromBos: rtn[0],
          toBos: rtn[1],
          promotion: _promoteValHelper(temp),
          isConfirmedLegalMove: is_confirmed_legal,
        };
      }

      return rtn;
    }

    //p = {promoteTo, delimiter, isLegalMove}
    function _draftMove(mov, p) {
      var that,
        temp,
        temp2,
        initial_cached_square,
        final_cached_square,
        new_en_passant_bos,
        pawn_moved,
        is_en_passant_capture,
        promoted_val,
        lc_captured,
        wrapped_move,
        bubbling_promoted_to,
        king_castled,
        partial_san,
        with_overdisambiguated,
        extra_file_bos,
        extra_rank_bos,
        active_side,
        non_active_side,
        is_ambiguous,
        rtn;

      that = this;
      rtn = {};
      p = _unreferenceP(p);

      block: {
        rtn.canMove = false;
        p.isLegalMove = p.isLegalMove === true;
        wrapped_move = that.getWrappedMove(mov, p);

        if (wrapped_move === null) {
          break block;
        }

        if (wrapped_move.isConfirmedLegalMove) {
          p.isLegalMove = true;
        }

        if (!p.isLegalMove && !that.isLegalMove(wrapped_move.fromBos + '' + wrapped_move.toBos)) {
          break block;
        }

        rtn.canMove = true;

        bubbling_promoted_to = _promoteValHelper(
          toAbsVal(p.promoteTo) || wrapped_move.promotion
        ); /*NO remove toAbsVal()*/

        initial_cached_square = that.getSquare(wrapped_move.fromBos, {
          isUnreferenced: true,
        });

        final_cached_square = that.getSquare(wrapped_move.toBos, {
          isUnreferenced: true,
        });

        rtn.initialCachedSquare = initial_cached_square;
        rtn.finalCachedSquare = final_cached_square;
        active_side = that[that.activeColor];
        non_active_side = that[that.nonActiveColor];

        pawn_moved = false;
        is_en_passant_capture = false;
        new_en_passant_bos = '';
        lc_captured = (final_cached_square.bal.replace('*', '') || '').toLowerCase();
        promoted_val = 0;
        king_castled = 0;

        if (initial_cached_square.isKing) {
          if (active_side.castling) {
            rtn.activeSideCastlingZero = true;

            if (final_cached_square.filePos === 6) {
              //short
              king_castled = _SHORT_CASTLE;
              rtn.putRookAtFileShift = -1;
              rtn.removeRookAtFileShift = 1;
            } else if (final_cached_square.filePos === 2) {
              //long
              king_castled = _LONG_CASTLE;
              rtn.putRookAtFileShift = 1;
              rtn.removeRookAtFileShift = -2;
            }
          }
        } else if (initial_cached_square.isPawn) {
          pawn_moved = true;

          if (Math.abs(initial_cached_square.rankPos - final_cached_square.rankPos) > 1) {
            //new enpassant
            new_en_passant_bos = that.getSquare(final_cached_square, {
              rankShift: non_active_side.singlePawnRankShift,
            }).bos;
          } else if (sameSquare(final_cached_square, that.enPassantBos)) {
            //enpassant capture
            lc_captured = 'p';
            is_en_passant_capture = true;

            rtn.enPassantCaptureAtRankShift = non_active_side.singlePawnRankShift;
          } else if (final_cached_square.rankPos === active_side.lastRankPos) {
            //promotion
            promoted_val = bubbling_promoted_to * active_side.sign;
          }
        }

        partial_san = '';
        with_overdisambiguated = [];

        if (king_castled) {
          //castling king
          partial_san += king_castled === _LONG_CASTLE ? 'O-O-O' : 'O-O';
          with_overdisambiguated.push(partial_san);
        } else if (pawn_moved) {
          //pawn move
          if (initial_cached_square.fileBos !== final_cached_square.fileBos) {
            partial_san += initial_cached_square.fileBos + 'x';
          }

          partial_san += final_cached_square.bos;
          with_overdisambiguated.push(partial_san);

          if (promoted_val) {
            partial_san += '=' + toAbsBal(promoted_val);
          }
        } else {
          //knight, bishop, rook, queen, non-castling king
          is_ambiguous = false;
          extra_file_bos = '';
          extra_rank_bos = '';

          if (!initial_cached_square.isKing) {
            //knight, bishop, rook, queen
            temp = that.legalRevTree[final_cached_square.bos];

            if (temp) {
              temp = temp[initial_cached_square.bal.toLowerCase()];

              if (temp && temp.length > 1) {
                is_ambiguous = true;
                temp = temp.join(',');

                if (_occurrences(temp, initial_cached_square.fileBos) > 1) {
                  extra_rank_bos = initial_cached_square.rankBos;
                }

                if (_occurrences(temp, initial_cached_square.rankBos) > 1) {
                  extra_file_bos = initial_cached_square.fileBos;
                }
              }
            }
          }

          temp = initial_cached_square.absBal;
          temp2 = (final_cached_square.isEmptySquare ? '' : 'x') + final_cached_square.bos;

          if (is_ambiguous) {
            if (!extra_file_bos && !extra_rank_bos) {
              //none
              partial_san += temp + initial_cached_square.fileBos + temp2;
              with_overdisambiguated.push(partial_san);
              with_overdisambiguated.push(temp + initial_cached_square.rankBos + temp2);
            }

            if (extra_file_bos || extra_rank_bos) {
              //one or both
              partial_san += temp + extra_file_bos + extra_rank_bos + temp2;
              with_overdisambiguated.push(partial_san);
            }

            if (!extra_file_bos || !extra_rank_bos) {
              //none or one (but not both)
              with_overdisambiguated.push(temp + initial_cached_square.fileBos + initial_cached_square.rankBos + temp2);
            }
          } else {
            partial_san += temp + temp2;
            with_overdisambiguated.push(partial_san);
            with_overdisambiguated.push(temp + initial_cached_square.fileBos + temp2);
            with_overdisambiguated.push(temp + initial_cached_square.rankBos + temp2);
            with_overdisambiguated.push(temp + initial_cached_square.fileBos + initial_cached_square.rankBos + temp2);
          }
        }

        rtn.pawnMoved = pawn_moved;
        rtn.isEnPassantCapture = is_en_passant_capture;
        rtn.newEnPassantBos = new_en_passant_bos;
        rtn.captured = lc_captured;
        rtn.promotedVal = promoted_val;
        rtn.partialSan = partial_san;
        rtn.withOverdisambiguated = with_overdisambiguated;
      }

      return rtn;
    }

    //p = {isMockMove, promoteTo, delimiter, isLegalMove, isInanimated, playSounds, isUnreferenced}
    function _playMove(mov, p, sliced_fen_history) {
      var i,
        that,
        temp,
        temp2,
        temp3,
        initial_cached_square,
        final_cached_square,
        pgn_obj,
        complete_san,
        move_res,
        active_side,
        non_active_side,
        current_side,
        autogen_comment,
        rtn_move_obj;

      that = this;
      rtn_move_obj = null;
      p = _unreferenceP(p);

      block: {
        p.isMockMove = p.isMockMove === true;
        p.isInanimated = p.isInanimated === true;
        p.playSounds = p.playSounds === true;
        p.isUnreferenced = p.isUnreferenced === true;

        if (p.isMockMove) {
          if (that.moveList) {
            sliced_fen_history = that.fenHistoryExport().slice(0, that.currentMove + 1);
          }

          rtn_move_obj = fenApply(that.fen, 'playMove', [mov, p, sliced_fen_history], {
            promoteTo: that.promoteTo,
            skipFenValidation: true,
          });

          break block;
        }

        pgn_obj = that.draftMove(mov, p);

        if (!pgn_obj.canMove) {
          break block;
        }

        active_side = that[that.activeColor];
        non_active_side = that[that.nonActiveColor];
        initial_cached_square = pgn_obj.initialCachedSquare;
        final_cached_square = pgn_obj.finalCachedSquare;

        if (pgn_obj.activeSideCastlingZero) {
          active_side.castling = 0;
        }

        if (pgn_obj.putRookAtFileShift) {
          that.setSquare(final_cached_square, active_side.rook, {
            fileShift: pgn_obj.putRookAtFileShift,
          });
        }

        if (pgn_obj.removeRookAtFileShift) {
          that.setSquare(final_cached_square, _EMPTY_SQR, {
            fileShift: pgn_obj.removeRookAtFileShift,
          });
        }

        if (pgn_obj.enPassantCaptureAtRankShift) {
          that.setSquare(final_cached_square, _EMPTY_SQR, {
            rankShift: pgn_obj.enPassantCaptureAtRankShift,
          });
        }

        for (i = 0; i < 2; i++) {
          //0...1
          current_side = i ? active_side : non_active_side;
          temp = i ? initial_cached_square : final_cached_square;

          if (current_side.castling && temp.isRook) {
            temp2 = current_side.isBlack ? '8' : '1';

            if (current_side.castling !== _LONG_CASTLE && sameSquare(temp, that.getSquare('h' + temp2))) {
              current_side.castling -= _SHORT_CASTLE;
            } else if (current_side.castling !== _SHORT_CASTLE && sameSquare(temp, that.getSquare('a' + temp2))) {
              current_side.castling -= _LONG_CASTLE;
            }
          }
        }

        that.enPassantBos = pgn_obj.newEnPassantBos;
        that.setSquare(final_cached_square, pgn_obj.promotedVal || initial_cached_square.val);
        that.setSquare(initial_cached_square, _EMPTY_SQR);
        that.toggleActiveNonActive();

        that.halfMove++;
        if (pgn_obj.pawnMoved || final_cached_square.val) {
          that.halfMove = 0;
        }

        if (active_side.isBlack) {
          //active_side is toggled
          that.fullMove++;
        }

        that.updateHelper({
          currentMove: that.currentMove + 1,
          slicedFenHistory: sliced_fen_history,
        });

        complete_san = pgn_obj.partialSan;
        move_res = '';

        if (that.isCheckmate) {
          complete_san += '#';
          move_res = non_active_side.isBlack ? _RESULT_W_WINS : _RESULT_B_WINS; //non_active_side is toggled
        } else if (that.isStalemate) {
          move_res = _RESULT_DRAW;
        } else if (that.isCheck) {
          //check but not checkmate
          complete_san += '+';
        }

        autogen_comment = '';

        if (that.inDraw) {
          if (that.isStalemate) {
            autogen_comment = '{Stalemate}';
          } else if (that.isThreefold) {
            autogen_comment = '{3-fold repetition}';
          } else if (that.isInsufficientMaterial) {
            autogen_comment = '{Insufficient material}';
          } else if (that.isFiftyMove) {
            //no need to !b.isCheckmate since b.inDraw=true
            autogen_comment = '{50 moves rule}';
          }
        }

        temp = (initial_cached_square.bal.replace('*', '') || '').toLowerCase(); //piece
        temp2 = (toBal(pgn_obj.promotedVal).replace('*', '') || '').toLowerCase(); //promotion
        temp3 = initial_cached_square.bos + '' + final_cached_square.bos + '' + temp2; //uci

        if (that.currentMove !== that.moveList.length) {
          that.moveList = that.moveList.slice(0, that.currentMove);
        }

        that.moveList.push({
          colorMoved: that.nonActiveColor,
          colorToPlay: that.activeColor,
          fen: that.fen,
          san: complete_san,
          uci: temp3,
          fromBos: initial_cached_square.bos,
          toBos: final_cached_square.bos,
          enPassantBos: that.enPassantBos,
          piece: temp,
          captured: pgn_obj.captured,
          promotion: temp2,
          comment: autogen_comment,
          moveResult: move_res,
          canDraw: that.inDraw,
          isEnPassantCapture: pgn_obj.isEnPassantCapture,
        });

        rtn_move_obj = that.moveList[that.moveList.length - 1];

        if (p.isUnreferenced) {
          rtn_move_obj = _unreferencedMoveHelper(rtn_move_obj);
        }

        that.silentlyResetManualResult();
        that.refreshUi(p.isInanimated ? 0 : 1, p.playSounds); //autorefresh
      }

      return rtn_move_obj;
    }

    //p = {isMockMove, promoteTo, delimiter, isLegalMove, isInanimated, playSounds}
    function _playMoves(arr, p, sliced_fen_history) {
      var i, len, that, temp, p_cache, at_least_one_parsed, everything_parsed, rtn;

      that = this;
      rtn = false;

      p_cache = _unreferenceP(p, [['isUnreferenced', false]]);
      p = _unreferenceP(p, [
        ['isInanimated', true],
        ['playSounds', false],
        ['isUnreferenced', false],
      ]);
      at_least_one_parsed = false;

      block: {
        if (!_isArray(arr) || !arr.length) {
          break block;
        }

        everything_parsed = true;
        temp = that.isHidden;
        that.isHidden = true;

        for (i = 0, len = arr.length; i < len; i++) {
          //0<len
          if (that.playMove(arr[i], p, sliced_fen_history) === null) {
            everything_parsed = false;
            break;
          } else {
            at_least_one_parsed = true;
          }
        }

        that.isHidden = temp;

        if (!everything_parsed) {
          break block;
        }

        rtn = true;
      }

      if (at_least_one_parsed) {
        that.refreshUi(p_cache.isInanimated ? 0 : 1, p_cache.playSounds); //autorefresh
      }

      return rtn;
    }

    //p = {isMockMove, promoteTo, isInanimated, playSounds, isUnreferenced}
    function _playRandomMove(p, sliced_fen_history) {
      var i, len, that, temp, temp2, used_keys, rtn;

      that = this;
      rtn = null;
      p = _unreferenceP(p, [['isLegalMove', true]]);

      block: {
        temp = that.legalUci.slice(0);

        //when there is a promotion overwrite (promoteTo), we should collapse them
        //into one move in order to keep the correct distribution of probabilities
        if (toVal(p.promoteTo)) {
          temp = [];
          used_keys = {};

          for (i = 0, len = that.legalUci.length; i < len; i++) {
            //0<len
            temp2 = that.legalUci[i].slice(0, 4); //uci without promotion char

            if (used_keys[temp2]) {
              continue;
            }

            used_keys[temp2] = true;
            temp.push(temp2);
          }
        }

        if (!temp.length) {
          break block;
        }

        rtn = that.playMove(temp[Math.floor(Math.random() * temp.length)], p, sliced_fen_history);
      }

      return rtn;
    }

    //---------------- board (using IcUi)

    function _refreshUi(animation_type, play_sounds) {
      var that;

      that = this;

      if (_WIN && _WIN.IcUi && _WIN.IcUi.refreshUi) {
        _WIN.IcUi.refreshUi.apply(that, [animation_type, play_sounds]);
      }
    }

    //---------------- ic

    function setSilentMode(val) {
      _SILENT_MODE = !!val;
    }

    function isLegalFen(fen) {
      return fenApply(fen, 'isLegalFen');
    }

    function getBoard(woard) {
      var rtn;

      rtn = null;

      block: {
        if (_isBoard(woard)) {
          rtn = woard;
          break block;
        }

        if (_isNonEmptyStr(woard)) {
          woard = _formatName(woard);

          if (woard && _BOARDS[woard]) {
            rtn = _BOARDS[woard];
            break block;
          }
        }
      }

      return rtn;
    }

    function toVal(qal) {
      var rtn;

      rtn = 0;

      if (typeof qal === 'string') {
        rtn = _strToValHelper(qal);
      } else if (typeof qal === 'number') {
        rtn = _toInt(qal, -_KING, _KING);
      } else if (_isSquare(qal)) {
        rtn = _toInt(qal.val, -_KING, _KING);
      }

      return rtn;
    }

    function toAbsVal(qal) {
      return Math.abs(toVal(qal));
    }

    function toBal(qal) {
      var temp, val, abs_val;

      val = toVal(qal);
      abs_val = toAbsVal(qal);
      temp = ['*', 'p', 'n', 'b', 'r', 'q', 'k'][abs_val]; //deprecate asterisk character as _occurrences() might use RegExp("*", "g") if not cautious

      return val === abs_val ? temp.toUpperCase() : temp;
    }

    function toAbsBal(qal) {
      return toBal(toAbsVal(qal));
    }

    function toClassName(qal) {
      var piece_bal, piece_lc_bal;

      piece_bal = toBal(qal);
      piece_lc_bal = piece_bal.toLowerCase();

      return piece_bal !== '*' ? (piece_bal === piece_lc_bal ? 'b' : 'w') + piece_lc_bal : '';
    }

    function toBos(qos) {
      var rtn;

      rtn = null;

      if (_isArray(qos)) {
        qos = _arrToPosHelper(qos);

        if (qos !== null) {
          rtn = 'abcdefgh'.charAt(qos[1]) + '' + (8 - qos[0]);
        }
      } else if (typeof qos === 'string') {
        rtn = _strToBosHelper(qos);
      } else if (_isSquare(qos)) {
        rtn = _strToBosHelper(qos.bos);
      }

      return rtn;
    }

    function toPos(qos) {
      var rtn;

      rtn = null;

      if (typeof qos === 'string') {
        qos = _strToBosHelper(qos);

        if (qos !== null) {
          rtn = [8 - qos.charAt(1) * 1, 'abcdefgh'.indexOf(qos.charAt(0))];
        }
      } else if (_isArray(qos)) {
        rtn = _arrToPosHelper(qos);
      } else if (_isSquare(qos)) {
        rtn = _arrToPosHelper(qos.pos);
      }

      return rtn;
    }

    function getSign(zal) {
      return (typeof zal === 'boolean' ? !zal : toVal(zal) > 0) ? 1 : -1;
    }

    function getRankPos(qos) {
      var pos, rtn;

      rtn = null;
      pos = toPos(qos);

      if (pos !== null) {
        rtn = pos[0];
      }

      return rtn;
    }

    function getFilePos(qos) {
      var pos, rtn;

      rtn = null;
      pos = toPos(qos);

      if (pos !== null) {
        rtn = pos[1];
      }

      return rtn;
    }

    function getRankBos(qos) {
      var bos, rtn;

      rtn = null;
      bos = toBos(qos);

      if (bos !== null) {
        rtn = bos.charAt(1);
      }

      return rtn;
    }

    function getFileBos(qos) {
      var bos, rtn;

      rtn = null;
      bos = toBos(qos);

      if (bos !== null) {
        rtn = bos.charAt(0);
      }

      return rtn;
    }

    function isInsideBoard(qos) {
      var rtn;

      rtn = false;

      if (typeof qos === 'string') {
        rtn = _strToBosHelper(qos) !== null;
      } else if (_isArray(qos)) {
        rtn = _arrToPosHelper(qos) !== null;
      } else {
        rtn = _isSquare(qos);
      }

      return rtn;
    }

    function sameSquare(qos1, qos2) {
      var rtn;

      rtn = false;
      qos1 = toBos(qos1);
      qos2 = toBos(qos2);

      if (qos1 !== null && qos2 !== null) {
        rtn = qos1 === qos2;
      }

      return rtn;
    }

    function countPieces(fen) {
      var i, j, fen_board, current_side, rtn;

      rtn = {
        w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
        b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
      };

      if (_isNonBlankStr(fen)) {
        fen_board = _trimSpaces(fen).split(' ')[0];

        for (i = _PAWN; i <= _KING; i++) {
          //1...6
          for (j = 0; j < 2; j++) {
            //0...1
            current_side = j ? rtn.w : rtn.b;
            current_side[toBal(-i)] = _occurrences(fen_board, toBal(i * getSign(!j)));
          }
        }
      }

      return rtn;
    }

    function removeBoard(woard) {
      var del_board, del_board_name_cache, rtn;

      rtn = false;
      del_board = getBoard(woard);

      if (del_board !== null) {
        //if exists
        rtn = true;
        del_board_name_cache = del_board.boardName;
        del_board = null;
        _BOARDS[del_board_name_cache] = null;

        delete _BOARDS[del_board_name_cache];

        /*TODO ui problem: autorefresh when removing loaded board. EDIT: can't easily select a non-hidden board*/
      }

      return rtn;
    }

    function isEqualBoard(left_woard, right_woard) {
      var left_board, rtn;

      rtn = false;

      block: {
        left_board = getBoard(left_woard);

        if (left_board === null) {
          _consoleLog("Error[isEqualBoard]: left_woard doesn't exist");
          break block;
        }

        rtn = left_board.isEqualBoard(right_woard);
      }

      return rtn;
    }

    function cloneBoard(to_woard, from_woard) {
      var to_board, rtn;

      rtn = false;

      block: {
        to_board = getBoard(to_woard);

        if (to_board === null) {
          _consoleLog("Error[cloneBoard]: to_woard doesn't exist");
          break block;
        }

        rtn = to_board.cloneBoardFrom(from_woard); //autorefresh (sometimes)
      }

      return rtn;
    }

    //p = {boardName, fen, pgn, uci, moveIndex, isRotated, skipFenValidation, isHidden, promoteTo, manualResult, validOrBreak}
    function initBoard(p) {
      var temp,
        board_created,
        board_name,
        fen_was_valid,
        postfen_was_valid,
        new_board,
        everything_parsed,
        finished_block,
        rtn;

      rtn = null;
      p = _unreferenceP(p);
      board_created = false;
      finished_block = false;

      block: {
        p.boardName = _isNonBlankStr(p.boardName)
          ? _formatName(p.boardName)
          : 'b_' + ((new Date().getTime() + '').slice(-10) + '' + Math.random().toString(36).slice(2, 7)).slice(-10);

        board_name = p.boardName;
        p.isRotated = p.isRotated === true;
        p.skipFenValidation = p.skipFenValidation === true;
        p.isHidden = p.isHidden === true;
        p.validOrBreak = p.validOrBreak === true;
        p.pgn = _pgnParserHelper(p.pgn);

        if (p.pgn) {
          p.fen = p.fen || p.pgn.tags.FEN || _DEFAULT_FEN;
        } else {
          p.uci = _uciParserHelper(p.uci);

          if (p.uci) {
            p.fen = p.fen || _DEFAULT_FEN;
          }
        }

        fen_was_valid = p.skipFenValidation || !_basicFenTest(p.fen);

        if (p.validOrBreak && !fen_was_valid) {
          _consoleLog('Error[initBoard]: "' + board_name + '" bad FEN');
          break block;
        }

        new_board = _nullboardHelper(board_name);
        board_created = true;
        new_board.isHidden = true;
        temp = fen_was_valid ? p.fen : _DEFAULT_FEN;

        new_board.updateHelper({
          currentMove: 0,
          fen: temp,
          skipFenValidation: true,
          resetMoveList: true,
        }); /*NO remove skipFenValidation*/

        postfen_was_valid = p.skipFenValidation || !new_board.refinedFenTest();

        if (p.validOrBreak && !postfen_was_valid) {
          _consoleLog('Error[initBoard]: "' + board_name + '" bad postFEN');
          break block;
        }

        if (!postfen_was_valid) {
          new_board.updateHelper({
            currentMove: 0,
            fen: _DEFAULT_FEN,
            skipFenValidation: true,
            resetMoveList: true,
          }); /*NO remove skipFenValidation*/
        }

        if (p.pgn) {
          everything_parsed = new_board.playMoves(p.pgn.sanMoves); /*NO p.validOrBreak short-circuit*/

          if (p.validOrBreak && !everything_parsed) {
            _consoleLog('Error[initBoard]: "' + board_name + '" bad PGN');
            break block;
          } else {
            if (p.pgn.result !== _RESULT_ONGOING) {
              p.manualResult = _pgnResultHelper(p.manualResult) || p.pgn.result;
            }
          }
        } else if (p.uci) {
          everything_parsed = new_board.playMoves(p.uci); /*NO p.validOrBreak short-circuit*/

          if (p.validOrBreak && !everything_parsed) {
            _consoleLog('Error[initBoard]: "' + board_name + '" bad UCI');
            break block;
          }
        }

        p.moveIndex = _isIntOrStrInt(p.moveIndex) ? p.moveIndex : new_board.moveList.length - 1;
        new_board.setCurrentMove(p.moveIndex, true);
        new_board.isRotated = p.isRotated;
        new_board.setPromoteTo(p.promoteTo);
        new_board.setManualResult(p.manualResult);
        new_board.isHidden = p.isHidden;
        new_board.refreshUi(0, false); //autorefresh
        rtn = new_board;

        finished_block = true;
      }

      if (board_created && !finished_block) {
        removeBoard(new_board);
      }

      return rtn;
    }

    //p = {isRotated, promoteTo, skipFenValidation}
    function fenApply(fen, fn_name, args, p) {
      var board, board_created, silent_mode_cache, rtn;

      rtn = null;
      args = _isArray(args) ? args : [];
      p = _unreferenceP(p);
      board_created = false;
      silent_mode_cache = _SILENT_MODE;
      fn_name = _isNonBlankStr(fn_name) ? _formatName(fn_name) : 'isLegalFen';

      if (fn_name === 'isLegalFen') {
        setSilentMode(true);
      }

      board = initBoard({
        boardName: 'board_fenApply_' + fn_name,
        fen: fen,
        isRotated: p.isRotated,
        promoteTo: p.promoteTo,
        skipFenValidation: p.skipFenValidation,
        isHidden: true,
        validOrBreak: true,
      });

      if (fn_name === 'isLegalFen') {
        setSilentMode(silent_mode_cache);
      }

      board_created = board !== null;

      switch (fn_name) {
        case 'playMove':
          rtn = board_created
            ? _playMove.apply(board, [
                args[0],
                _unreferenceP(args[1], [
                  ['isMockMove', false],
                  ['isUnreferenced', true],
                ]),
                args[2],
              ])
            : null;
          break;
        case 'playMoves':
          rtn = board_created ? _playMoves.apply(board, args) : false;
          break;
        case 'playRandomMove':
          rtn = board_created
            ? _playRandomMove.apply(board, [_unreferenceP(args[0], [['isUnreferenced', true]]), args[1]])
            : null;
          break;
        case 'legalMoves':
          rtn = board_created ? _legalMoves.apply(board, args) : [];
          break;
        case 'legalFenMoves':
          rtn = board_created ? _legalFenMoves.apply(board, args) : [];
          break;
        case 'legalSanMoves':
          rtn = board_created ? _legalSanMoves.apply(board, args) : [];
          break;
        case 'legalUciMoves':
          rtn = board_created ? _legalUciMoves.apply(board, args) : [];
          break;
        case 'isLegalMove':
          rtn = board_created ? _isLegalMove.apply(board, args) : false;
          break;
        case 'isLegalFen':
          rtn = board_created;
          break;
        case 'getCheckmateMoves':
          rtn = board_created ? _getCheckmateMoves.apply(board, args) : [];
          break;
        case 'getDrawMoves':
          rtn = board_created ? _getDrawMoves.apply(board, args) : [];
          break;
        case 'getSquare':
          rtn = board_created
            ? _getSquare.apply(board, [args[0], _unreferenceP(args[1], [['isUnreferenced', true]])])
            : null;
          break;
        case 'attackersFromActive':
          rtn = board_created ? _attackersFromActive.apply(board, args) : 0;
          break;
        case 'attackersFromNonActive':
          rtn = board_created ? _attackersFromNonActive.apply(board, args) : 0;
          break;
        case 'ascii':
          rtn = board_created ? _ascii.apply(board, args) : '';
          break;
        case 'boardHash':
          rtn = board_created ? _boardHash.apply(board, args) : '';
          break;
        case 'countLightDarkBishops':
          rtn = board_created
            ? _countLightDarkBishops.apply(board, args)
            : {
                w: { lightSquaredBishops: 0, darkSquaredBishops: 0 },
                b: { lightSquaredBishops: 0, darkSquaredBishops: 0 },
              };
          break;
        default:
          _consoleLog('Error[fenApply]: invalid function name "' + fn_name + '"');
      }

      if (board_created) {
        removeBoard(board);
      }

      return rtn;
    }

    //p = {skipFenValidation}
    function fenGet(fen, props, p) {
      var i, j, len, len2, board, board_name, board_created, board_keys, current_key, invalid_key, rtn_pre, rtn;

      rtn = null;
      p = _unreferenceP(p);
      board_created = false;

      block: {
        board_name = 'board_fenGet';

        board = initBoard({
          boardName: board_name,
          fen: fen,
          skipFenValidation: p.skipFenValidation,
          isHidden: true,
          validOrBreak: true,
        });

        if (board === null) {
          _consoleLog('Error[fenGet]: invalid FEN');
          break block;
        }

        board = _cloneBoardToObj({ boardName: board_name + '_copy' }, board);
        board_created = true;
        board_keys = [];

        if (_isArray(props)) {
          board_keys = props;
        } else if (_isNonBlankStr(props)) {
          board_keys = _trimSpaces(props).split(' ');
        }

        if (!board_keys.length) {
          board_keys = _MUTABLE_KEYS.slice(0);
        }

        rtn_pre = {};

        for (i = 0, len = board_keys.length; i < len; i++) {
          //0<len
          current_key = _formatName(board_keys[i]);

          if (current_key && !rtn_pre[current_key]) {
            invalid_key = true;

            for (j = 0, len2 = _MUTABLE_KEYS.length; j < len2; j++) {
              //0<len2
              if (current_key === _MUTABLE_KEYS[j]) {
                invalid_key = false;
                rtn_pre[current_key] = board[current_key];
                break;
              }
            }

            if (invalid_key) {
              _consoleLog('Error[fenGet]: invalid property name "' + current_key + '"');
              break block;
            }
          }
        }

        rtn = rtn_pre;
      }

      if (board_created) {
        removeBoard(board_name); //this removes the temporal board (the copy of the temporal board doesn't need removal)
      }

      return rtn;
    }

    function getBoardNames() {
      return Object.keys(_BOARDS);
    }

    return {
      version: _VERSION,
      setSilentMode: setSilentMode,
      isLegalFen: isLegalFen,
      getBoard: getBoard,
      toVal: toVal,
      toAbsVal: toAbsVal,
      toBal: toBal,
      toAbsBal: toAbsBal,
      toClassName: toClassName,
      toBos: toBos,
      toPos: toPos,
      getSign: getSign,
      getRankPos: getRankPos,
      getFilePos: getFilePos,
      getRankBos: getRankBos,
      getFileBos: getFileBos,
      isInsideBoard: isInsideBoard,
      sameSquare: sameSquare,
      countPieces: countPieces,
      removeBoard: removeBoard,
      isEqualBoard: isEqualBoard,
      cloneBoard: cloneBoard,
      initBoard: initBoard,
      fenApply: fenApply,
      fenGet: fenGet,
      getBoardNames: getBoardNames,
      utilityMisc: {
        consoleLog: _consoleLog,
        isObject: _isObject,
        isArray: _isArray,
        isSquare: _isSquare,
        isBoard: _isBoard,
        isMove: _isMove,
        trimSpaces: _trimSpaces,
        formatName: _formatName,
        strContains: _strContains,
        occurrences: _occurrences,
        toInt: _toInt,
        isIntOrStrInt: _isIntOrStrInt,
        isNonEmptyStr: _isNonEmptyStr,
        isNonBlankStr: _isNonBlankStr,
        hashCode: _hashCode,
        castlingChars: _castlingChars,
        unreferenceP: _unreferenceP,
        cleanSan: _cleanSan,
        cloneBoardToObj: _cloneBoardToObj,
        basicFenTest: _basicFenTest,
        perft: _perft,
      },
    };
  })(windw);

  //Browser
  if (windw !== null) {
    if (!windw.Ic) {
      windw.Ic = Ic;
    }
  }

  //Node.js or any CommonJS
  if (expts !== null) {
    if (!expts.Ic) {
      expts.Ic = Ic;
    }
  }

  //RequireJS environment
  if (typeof defin === 'function' && defin.amd) {
    defin(function () {
      return Ic;
    });
  }
})(
  typeof window !== 'undefined' ? window : null,
  typeof exports !== 'undefined' ? exports : null,
  typeof define !== 'undefined' ? define : null
);
