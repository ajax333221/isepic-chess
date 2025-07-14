/*! Copyright (c) 2025 Ajax Isepic (ajax333221) Licensed MIT */
(function (windw, expts, defin) {
  var Ic = (function (_WIN) {
    var _VERSION = '8.7.2';
    var _SILENT_MODE = true;
    var _BOARDS = {};
    var _EMPTY_SQR = 0;
    var _PAWN_W = 1;
    var _KNIGHT_W = 2;
    var _BISHOP_W = 3;
    var _ROOK_W = 4;
    var _QUEEN_W = 5;
    var _KING_W = 6;
    var _PAWN_B = -1;
    var _KNIGHT_B = -2;
    var _BISHOP_B = -3;
    var _ROOK_B = -4;
    var _QUEEN_B = -5;
    var _KING_B = -6;
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
    var _ALERT_LIGHT = 'light';
    var _ALERT_DARK = 'dark';
    var _ALERT_SUCCESS = 'success';
    var _ALERT_WARNING = 'warning';
    var _ALERT_ERROR = 'error';
    var _TEST_COLLISION_OP_CANDIDATE_MOVES = 1;
    var _TEST_COLLISION_OP_IS_ATTACKED = 2;
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
      'isPuzzleMode',
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
    //!---------------- helpers
    function _promoteValHelper(pvqal) {
      let rtn = _toInt(toAbsVal(pvqal) || _QUEEN_W, _KNIGHT_W, _QUEEN_W);
      return rtn;
    }
    function _pgnResultHelper(str) {
      let rtn = null;
      str = String(str || '')
        .replace(/\s/g, '')
        .replace(/o/gi, '0')
        .replace(/½/g, '1/2');
      if (str === _RESULT_ONGOING || str === _RESULT_W_WINS || str === _RESULT_B_WINS || str === _RESULT_DRAW) {
        rtn = str;
      }
      return rtn;
    }
    function _strToValHelper(str) {
      let rtn = 0;
      block: {
        if (!str) {
          break block;
        }
        if (!Number.isNaN(Number(str)) && _isIntOrStrInt(str)) {
          let temp = _toInt(str, _KING_B, _KING_W);
          rtn = temp;
          break block;
        }
        str = _trimSpaces(str);
        if (/^[pnbrqk]$/i.test(str)) {
          let temp = str.toLowerCase();
          let temp2 = ('pnbrqk'.indexOf(temp) + 1) * getSign(str === temp);
          rtn = temp2;
          break block;
        }
        let pc_exec = /^([wb])([pnbrqk])$/.exec(str.toLowerCase());
        if (pc_exec) {
          let temp = ('pnbrqk'.indexOf(pc_exec[2]) + 1) * getSign(pc_exec[1] === 'b');
          rtn = temp;
          break block;
        }
      }
      return rtn;
    }
    function _strToBosHelper(str) {
      let rtn = null;
      str = _trimSpaces(str);
      if (str && /^[a-h][1-8]$/i.test(str)) {
        rtn = str.toLowerCase();
      }
      return rtn;
    }
    function _arrToPosHelper(arr) {
      let rtn = null;
      if (_isArray(arr) && arr.length === 2) {
        let rank_pos = _toInt(arr[0]);
        let file_pos = _toInt(arr[1]);
        if (rank_pos <= 7 && rank_pos >= 0 && file_pos <= 7 && file_pos >= 0) {
          rtn = [rank_pos, file_pos];
        }
      }
      return rtn;
    }
    function _pgnParserHelper(str) {
      let rtn = null;
      block: {
        if (!_isNonBlankStr(str)) {
          break block;
        }
        let meta_tags = {};
        let last_index = -1;
        let rgxp = /\[\s*(\w+)\s+\"([^\"]*)\"\s*\]/g;
        str = str.replace(/“|”/g, '"');
        let mtch;
        while ((mtch = rgxp.exec(str))) {
          last_index = rgxp.lastIndex;
          meta_tags[_trimSpaces(mtch[1])] = _trimSpaces(mtch[2]);
        }
        if (last_index === -1) {
          last_index = 0;
        }
        let g = ' ' + _cleanSan(str.slice(last_index));
        let move_list = [];
        last_index = -1;
        rgxp = /\s+([1-9][0-9]*)*\s*\.*\s*\.*\s*([^\s]+)/g;
        let temp;
        while ((mtch = rgxp.exec(g))) {
          last_index = rgxp.lastIndex;
          temp = mtch[0];
          move_list.push(mtch[2]);
        }
        if (last_index === -1) {
          break block;
        }
        let game_result = _RESULT_ONGOING;
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
      let rtn = null;
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
      let rtn = null;
      block: {
        if (!_isNonBlankStr(mov)) {
          break block;
        }
        let temp = _trimSpaces(String(mov));
        if (temp.length !== 4 && temp.length !== 5) {
          break block;
        }
        let temp2 = [_strToBosHelper(temp.slice(0, 2)), _strToBosHelper(temp.slice(2, 4))];
        if (temp2[0] === null || temp2[1] === null) {
          break block;
        }
        let fromTo = temp2;
        let possible_promote = temp.charAt(4) || '';
        rtn = [fromTo, possible_promote];
      }
      return rtn;
    }
    function _joinedWrapmoveHelper(mov, p) {
      let rtn = null;
      p = _unreferenceP(p);
      block: {
        p.delimiter = _isNonEmptyStr(p.delimiter) ? p.delimiter.charAt(0) : '-';
        if (!_isNonBlankStr(mov)) {
          break block;
        }
        let temp = _trimSpaces(String(mov));
        if (temp.length !== 5 || temp.charAt(2) !== p.delimiter) {
          break block;
        }
        let temp2 = temp.split(p.delimiter);
        let temp3 = [_strToBosHelper(temp2[0]), _strToBosHelper(temp2[1])];
        if (temp3[0] === null || temp3[1] === null) {
          break block;
        }
        let fromTo = temp3;
        rtn = fromTo;
      }
      return rtn;
    }
    function _fromToWrapmoveHelper(mov) {
      let rtn = null;
      block: {
        if (!_isArray(mov)) {
          break block;
        }
        if (mov.length !== 2) {
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
      let rtn = null;
      block: {
        if (!_isMove(mov)) {
          break block;
        }
        let possible_promote = mov.promotion || '';
        rtn = [[mov.fromBos, mov.toBos], possible_promote];
      }
      return rtn;
    }
    function _unreferencedMoveHelper(obj) {
      let rtn = {};
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
      let rtn = getBoard(board_name);
      if (rtn === null) {
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
        rtn = _BOARDS[board_name];
      }
      rtn.w = {
        //static
        isBlack: false,
        sign: 1,
        firstRankPos: 7,
        secondRankPos: 6,
        lastRankPos: 0,
        singlePawnRankShift: -1,
        pawn: _PAWN_W,
        knight: _KNIGHT_W,
        bishop: _BISHOP_W,
        rook: _ROOK_W,
        queen: _QUEEN_W,
        king: _KING_W,
        //mutable
        kingBos: null,
        castling: null,
        materialDiff: null,
      };
      rtn.b = {
        //static
        isBlack: true,
        sign: -1,
        firstRankPos: 0,
        secondRankPos: 1,
        lastRankPos: 7,
        singlePawnRankShift: 1,
        pawn: _PAWN_B,
        knight: _KNIGHT_B,
        bishop: _BISHOP_B,
        rook: _ROOK_B,
        queen: _QUEEN_B,
        king: _KING_B,
        //mutable
        kingBos: null,
        castling: null,
        materialDiff: null,
      };
      rtn.activeColor = null;
      rtn.nonActiveColor = null;
      rtn.fen = null;
      rtn.enPassantBos = null;
      rtn.halfMove = null;
      rtn.fullMove = null;
      rtn.moveList = null;
      rtn.currentMove = null;
      rtn.isRotated = null;
      rtn.isPuzzleMode = null;
      rtn.checks = null;
      rtn.isCheck = null;
      rtn.isCheckmate = null;
      rtn.isStalemate = null;
      rtn.isThreefold = null;
      rtn.isInsufficientMaterial = null;
      rtn.isFiftyMove = null;
      rtn.inDraw = null;
      rtn.promoteTo = null;
      rtn.manualResult = null;
      rtn.isHidden = null;
      rtn.legalUci = null;
      rtn.legalUciTree = null;
      rtn.legalRevTree = null;
      rtn.squares = {};
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          let validated_pos = [i, j];
          let validated_bos = toBos(validated_pos);
          rtn.squares[validated_bos] = {
            //static
            pos: validated_pos,
            bos: validated_bos,
            rankPos: getRankPos(validated_pos),
            filePos: getFilePos(validated_pos),
            rankBos: getRankBos(validated_pos),
            fileBos: getFileBos(validated_pos),
            //mutable
            bal: null,
            absBal: null,
            val: null,
            absVal: null,
            className: null,
            sign: null,
            isEmptySquare: null,
            isPawn: null,
            isKnight: null,
            isBishop: null,
            isRook: null,
            isQueen: null,
            isKing: null,
          };
        }
      }
      return rtn;
    }
    //!---------------- utilities
    function _consoleLog(msg, alert_type) {
      let rtn = false;
      if (!_SILENT_MODE) {
        rtn = true;
        switch (alert_type) {
          case _ALERT_LIGHT:
            console.log(msg);
            break;
          case _ALERT_DARK:
            console.log(msg);
            break;
          case _ALERT_SUCCESS:
            console.log(msg);
            break;
          case _ALERT_WARNING:
            console.warn(msg);
            break;
          case _ALERT_ERROR:
            console.error(msg);
            break;
          default:
            console.log(msg);
            alert_type = _ALERT_LIGHT;
        }
        if (_WIN?.IcUi?.pushAlert) {
          _WIN.IcUi.pushAlert.apply(null, [msg, alert_type]);
        }
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
      let rtn = 0;
      if (_isNonEmptyStr(str) && _isNonEmptyStr(str_rgxp)) {
        rtn = (str.match(RegExp(str_rgxp, 'g')) || []).length;
      }
      return rtn;
    }
    function _toInt(num, min_val, max_val) {
      num = Number(num) || 0;
      num = num < 0 ? Math.ceil(num) : Math.floor(num);
      min_val = Number(min_val);
      max_val = Number(max_val);
      /*! NO remove default 0, (-0 || 0) = 0*/
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
      let rtn = 0;
      val = _isNonEmptyStr(val) ? val : '';
      for (let i = 0, len = val.length; i < len; i++) {
        rtn = (rtn << 5) - rtn + val.charCodeAt(i);
        rtn |= 0;
      }
      return rtn;
    }
    function _castlingChars(num) {
      const castlingChars = ['', 'k', 'q', 'kq'];
      return castlingChars[_toInt(num, 0, castlingChars.length - 1)];
    }
    function _unreferenceP(p, changes) {
      let rtn = _isObject(p) ? { ...p } : {};
      if (_isArray(changes)) {
        for (let i = 0, len = changes.length; i < len; i++) {
          if (!_isArray(changes?.[i]) || changes?.[i].length !== 2 || !_isNonBlankStr(changes[i][0])) {
            _consoleLog('[_unreferenceP]: unexpected format', _ALERT_ERROR);
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
        while (rtn !== (rtn = rtn.replace(/\{[^{}]*\}/g, '\n')));
        /*! TODO: keep comment*/
        while (rtn !== (rtn = rtn.replace(/\([^()]*\)/g, '\n')));
        while (rtn !== (rtn = rtn.replace(/\<[^<>]*\>/g, '\n')));
        rtn = rtn.replace(/(\t)|(\r?\n)|(\r\n?)/g, '\n');
        rtn = rtn.replace(/;+[^\n]*(\n|$)/g, '\n');
        /*! TODO: keep comment*/
        rtn = rtn
          .replace(/^%.*\n?/gm, '')
          .replace(/^\n+|\n+$/g, '')
          .replace(/\n/g, ' ');
        rtn = rtn.replace(/\$\d+/g, ' ');
        /*! TODO: keep NAG*/
        rtn = rtn.replace(/[^a-h0-9nrqkxo /½=-]/gi, '');
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
      block: {
        if (!_isObject(to_obj)) {
          _consoleLog('[_cloneBoardToObj]: to_obj must be Object type', _ALERT_ERROR);
          break block;
        }
        let from_board = getBoard(from_woard);
        if (from_board === null) {
          _consoleLog("[_cloneBoardToObj]: from_woard doesn't exist", _ALERT_ERROR);
          break block;
        }
        if (to_obj === from_board) {
          _consoleLog('[_cloneBoardToObj]: trying to self clone', _ALERT_ERROR);
          break block;
        }
        to_obj.moveList = [];
        to_obj.legalUci = [];
        to_obj.legalUciTree = {};
        to_obj.legalRevTree = {};
        for (let i = 0, len = _MUTABLE_KEYS.length; i < len; i++) {
          let current_key = _MUTABLE_KEYS[i];
          let to_prop = to_obj[current_key];
          let from_prop = from_board[current_key];
          if (!to_prop && (current_key === 'w' || current_key === 'b' || current_key === 'squares')) {
            to_obj[current_key] = {};
            to_prop = to_obj[current_key];
          }
          if (!_isObject(from_prop) && !_isArray(from_prop)) {
            to_obj[current_key] = from_prop;
            continue;
          }
          if (current_key === 'legalUci') {
            to_obj.legalUci = from_board.legalUci.slice(0);
            continue;
          }
          if (current_key === 'w' || current_key === 'b') {
            to_prop.materialDiff = from_prop.materialDiff.slice(0);
            to_prop.isBlack = from_prop.isBlack;
            to_prop.sign = from_prop.sign;
            to_prop.firstRankPos = from_prop.firstRankPos;
            to_prop.secondRankPos = from_prop.secondRankPos;
            to_prop.lastRankPos = from_prop.lastRankPos;
            to_prop.singlePawnRankShift = from_prop.singlePawnRankShift;
            to_prop.pawn = from_prop.pawn;
            to_prop.knight = from_prop.knight;
            to_prop.bishop = from_prop.bishop;
            to_prop.rook = from_prop.rook;
            to_prop.queen = from_prop.queen;
            to_prop.king = from_prop.king;
            to_prop.kingBos = from_prop.kingBos;
            to_prop.castling = from_prop.castling;
            continue;
          }
          let sub_keys = Object.keys(from_prop);
          for (let j = 0, len2 = sub_keys.length; j < len2; j++) {
            let sub_current_key = sub_keys[j];
            let sub_to_prop = to_prop[sub_current_key];
            let sub_from_prop = from_prop[sub_current_key];
            if (!sub_to_prop && current_key === 'squares') {
              to_prop[sub_current_key] = {};
              sub_to_prop = to_prop[sub_current_key];
            }
            if (!_isObject(sub_from_prop) && !_isArray(sub_from_prop)) {
              _consoleLog('[_cloneBoardToObj]: unexpected primitive data type', _ALERT_ERROR);
              continue;
            }
            if (current_key === 'legalUciTree') {
              to_prop[sub_current_key] = sub_from_prop.slice(0);
              continue;
            }
            if (current_key === 'squares') {
              sub_to_prop.pos = sub_from_prop.pos.slice(0);
              sub_to_prop.bos = sub_from_prop.bos;
              sub_to_prop.rankPos = sub_from_prop.rankPos;
              sub_to_prop.filePos = sub_from_prop.filePos;
              sub_to_prop.rankBos = sub_from_prop.rankBos;
              sub_to_prop.fileBos = sub_from_prop.fileBos;
              sub_to_prop.bal = sub_from_prop.bal;
              sub_to_prop.absBal = sub_from_prop.absBal;
              sub_to_prop.val = sub_from_prop.val;
              sub_to_prop.absVal = sub_from_prop.absVal;
              sub_to_prop.className = sub_from_prop.className;
              sub_to_prop.sign = sub_from_prop.sign;
              sub_to_prop.isEmptySquare = sub_from_prop.isEmptySquare;
              sub_to_prop.isPawn = sub_from_prop.isPawn;
              sub_to_prop.isKnight = sub_from_prop.isKnight;
              sub_to_prop.isBishop = sub_from_prop.isBishop;
              sub_to_prop.isRook = sub_from_prop.isRook;
              sub_to_prop.isQueen = sub_from_prop.isQueen;
              sub_to_prop.isKing = sub_from_prop.isKing;
              continue;
            }
            let sub_sub_keys = Object.keys(sub_from_prop);
            if (current_key === 'moveList' || current_key === 'legalRevTree') {
              to_prop[sub_current_key] = {};
              sub_to_prop = to_prop[sub_current_key];
              /*! NO put a "continue" in here*/
            }
            for (let k = 0, len3 = sub_sub_keys.length; k < len3; k++) {
              let sub_sub_current_key = sub_sub_keys[k];
              let sub_sub_from_prop = sub_from_prop[sub_sub_current_key];
              if (current_key === 'legalRevTree') {
                sub_to_prop[sub_sub_current_key] = sub_sub_from_prop.slice(0);
                continue;
              }
              if (_isObject(sub_sub_from_prop) || _isArray(sub_sub_from_prop)) {
                _consoleLog('[_cloneBoardToObj]: unexpected type in key "' + sub_sub_current_key + '"', _ALERT_ERROR);
                continue;
              }
              sub_to_prop[sub_sub_current_key] = sub_sub_from_prop;
            }
          }
        }
      }
      return to_obj;
    }
    function _basicFenTest(fen) {
      let rtn_msg = '';
      block: {
        fen = String(fen);
        if (fen.length < 20) {
          rtn_msg = 'Error [0] fen is too short';
          break block;
        }
        fen = _trimSpaces(fen);
        let optional_clocks = fen.replace(
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
        let fen_board = fen.split(' ')[0];
        let fen_board_arr = fen_board.split('/');
        for (let i = 0; i < 8; i++) {
          let total_files_in_current_rank = 0;
          let last_is_num = false;
          for (let j = 0, len = fen_board_arr[i].length; j < len; j++) {
            let current_num_or_nan = Number(fen_board_arr[i].charAt(j));
            let current_is_num = !!current_num_or_nan;
            if (last_is_num && current_is_num) {
              rtn_msg = 'Error [3] two consecutive numeric values';
              break block;
            }
            last_is_num = current_is_num;
            total_files_in_current_rank += current_num_or_nan || 1;
          }
          if (total_files_in_current_rank !== 8) {
            rtn_msg = 'Error [4] rank without exactly 8 columns';
            break block;
          }
        }
        let index_w_king = fen_board.indexOf('K');
        if (index_w_king === -1 || fen_board.lastIndexOf('K') !== index_w_king) {
          rtn_msg = 'Error [5] board without exactly one white king';
          break block;
        }
        let index_b_king = fen_board.indexOf('k');
        if (index_b_king === -1 || fen_board.lastIndexOf('k') !== index_b_king) {
          rtn_msg = 'Error [6] board without exactly one black king';
          break block;
        }
      }
      return rtn_msg;
    }
    function _perft(woard, depth, specific_uci) {
      let rtn = 1;
      block: {
        if (depth < 1) {
          break block;
        }
        let board = getBoard(woard);
        if (board === null) {
          break block;
        }
        if (board.isPuzzleMode) {
          break block;
        }
        let count = 0;
        for (let i = 0, len = board.legalUci.length; i < len; i++) {
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
    //!---------------- board
    function _getSquare(qos, p) {
      let that = this;
      let rtn = null;
      function _squareHelper(my_square, is_unreferenced) {
        let rtn_square = my_square;
        if (is_unreferenced) {
          rtn_square = {
            pos: toPos(my_square.pos),
            //unreference
            bos: my_square.bos,
            rankPos: getRankPos(my_square.pos),
            filePos: getFilePos(my_square.pos),
            rankBos: getRankBos(my_square.pos),
            fileBos: getFileBos(my_square.pos),
            bal: my_square.bal,
            absBal: my_square.absBal,
            val: my_square.val,
            absVal: my_square.absVal,
            className: my_square.className,
            sign: my_square.sign,
            isEmptySquare: my_square.isEmptySquare,
            isPawn: my_square.isPawn,
            isKnight: my_square.isKnight,
            isBishop: my_square.isBishop,
            isRook: my_square.isRook,
            isQueen: my_square.isQueen,
            isKing: my_square.isKing,
          };
        }
        return rtn_square;
      }
      p = _unreferenceP(p);
      let temp_pos = toPos(qos);
      p.isUnreferenced = p.isUnreferenced === true;
      if (temp_pos !== null) {
        let pre_validated_pos = [temp_pos[0] + _toInt(p.rankShift), temp_pos[1] + _toInt(p.fileShift)];
        if (isInsideBoard(pre_validated_pos)) {
          let validated_pos = pre_validated_pos;
          rtn = _squareHelper(that.squares[String(toBos(validated_pos) || '')], p.isUnreferenced);
        }
      }
      return rtn;
    }
    function _setSquare(qos, new_qal, p) {
      let that = this;
      let rtn = that?.getSquare?.(qos, _unreferenceP(p, [['isUnreferenced', false]])) || null;
      block: {
        if (rtn === null) {
          break block;
        }
        let new_val = toVal(new_qal);
        if (rtn.val === new_val) {
          break block;
        }
        let new_abs_val = toAbsVal(new_val);
        rtn.bal = toBal(new_val);
        rtn.absBal = toAbsBal(new_val);
        rtn.val = new_val;
        rtn.absVal = new_abs_val;
        rtn.className = toClassName(new_val);
        rtn.sign = getSign(new_val);
        rtn.isEmptySquare = new_abs_val === _EMPTY_SQR;
        rtn.isPawn = new_abs_val === _PAWN_W;
        rtn.isKnight = new_abs_val === _KNIGHT_W;
        rtn.isBishop = new_abs_val === _BISHOP_W;
        rtn.isRook = new_abs_val === _ROOK_W;
        rtn.isQueen = new_abs_val === _QUEEN_W;
        rtn.isKing = new_abs_val === _KING_W;
        if (rtn.isKing) {
          let current_side = rtn.sign < 0 ? that.b : that.w;
          current_side.kingBos = toBos(qos);
        }
      }
      return rtn;
    }
    function _attackersFromActive(target_qos, early_break) {
      let that = this;
      that?.toggleActiveNonActive?.();
      let rtn_total_attackers = that?.attackersFromNonActive?.(target_qos, early_break);
      that?.toggleActiveNonActive?.();
      return rtn_total_attackers;
    }
    function _attackersFromNonActive(target_qos, early_break) {
      let that = this;
      function _isAttacked(qos, piece_direction, as_knight) {
        let rtn_is_attacked = that?.testCollision?.(
          _TEST_COLLISION_OP_IS_ATTACKED,
          qos,
          piece_direction,
          as_knight,
          null,
          null
        ).isAttacked;
        return rtn_is_attacked;
      }
      let rtn_total_attackers = 0;
      let active_side = that[that.activeColor];
      let king_bos = active_side.kingBos;
      target_qos = target_qos || king_bos;
      outer: for (let i = 0; i < 2; i++) {
        let as_knight = !!i;
        for (let j = _DIRECTION_TOP; j <= _DIRECTION_TOP_LEFT; j++) {
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
      let that = this;
      let rtn_changed = false;
      let temp = typeof new_active === 'boolean' ? new_active : !that[that.activeColor].isBlack;
      if ((temp ? 'b' : 'w') !== that.activeColor || (!temp ? 'b' : 'w') !== that.nonActiveColor) {
        rtn_changed = true;
        that.activeColor = temp ? 'b' : 'w';
        that.nonActiveColor = !temp ? 'b' : 'w';
      }
      return rtn_changed;
    }
    function _toggleIsRotated(new_is_rotated) {
      let that = this;
      let rtn_changed = false;
      let temp = typeof new_is_rotated === 'boolean' ? new_is_rotated : !that.isRotated;
      if (temp !== that.isRotated) {
        rtn_changed = true;
        that.isRotated = temp;
        that?.refreshUi?.(0, false);
      }
      return rtn_changed;
    }
    function _setPromoteTo(qal) {
      let that = this;
      let rtn_changed = false;
      let temp = _promoteValHelper(qal);
      if (temp !== that.promoteTo) {
        rtn_changed = true;
        that.promoteTo = temp;
        that?.refreshUi?.(0, false);
      }
      return rtn_changed;
    }
    function _silentlyResetOptions() {
      let that = this;
      that.isHidden = true;
      that.isRotated = false;
      that?.setPromoteTo?.(_QUEEN_W);
      that.isHidden = false;
    }
    function _silentlyResetManualResult() {
      let that = this;
      let cache_is_hidden = that.isHidden;
      that.isHidden = true;
      that?.setManualResult?.(_RESULT_ONGOING);
      that.isHidden = cache_is_hidden;
    }
    function _setManualResult(str) {
      let that = this;
      let rtn_changed = false;
      let temp = _pgnResultHelper(str) || _RESULT_ONGOING;
      if (temp !== that.manualResult) {
        rtn_changed = true;
        that.manualResult = temp;
        that?.refreshUi?.(0, false);
      }
      return rtn_changed;
    }
    function _setCurrentMove(num, is_goto, is_puzzle_move) {
      let that = this;
      let rtn_changed = false;
      block: {
        if (that.isPuzzleMode && !is_puzzle_move) {
          break block;
        }
        let len = that.moveList.length;
        if (len < 2) {
          break block;
        }
        let that_current_move = Number(that.currentMove);
        if (typeof is_goto !== 'boolean') {
          num = _toInt(num, 0, len - 1);
          let diff = num - that_current_move;
          is_goto = Math.abs(diff) !== 1;
          num = is_goto ? num : diff;
        }
        num = _toInt(num);
        let temp = _toInt(is_goto ? num : num + that_current_move, 0, len - 1);
        if (temp === that_current_move) {
          break block;
        }
        that?.updateHelper?.({
          currentMove: temp,
          // @ts-ignore
          fen: that.moveList[temp].fen,
          skipFenValidation: true,
        });
        /*! NO remove skipFenValidation*/
        that?.refreshUi?.(is_goto ? 0 : num, true);
        rtn_changed = true;
      }
      return rtn_changed;
    }
    function _navFirst() {
      let that = this;
      return that?.setCurrentMove?.(0);
    }
    function _navPrevious() {
      let that = this;
      return that?.setCurrentMove?.(Number(that.currentMove) - 1);
    }
    function _navNext() {
      let that = this;
      return that?.setCurrentMove?.(Number(that.currentMove) + 1);
    }
    function _navLast() {
      let that = this;
      return that?.setCurrentMove?.(Number(that.moveList.length) - 1);
    }
    function _navLinkMove(move_index) {
      let that = this;
      return that?.setCurrentMove?.(move_index);
    }
    function _loadFen(fen, p) {
      let that = this;
      let rtn_changed = false;
      p = _unreferenceP(p);
      block: {
        if (that.isPuzzleMode) {
          break block;
        }
        p.skipFenValidation = p.skipFenValidation === true;
        p.keepOptions = p.keepOptions === true;
        let hash_cache = that?.boardHash?.();
        let temp = that?.updateHelper?.({
          currentMove: 0,
          fen,
          skipFenValidation: p.skipFenValidation,
          resetOptions: !p.keepOptions,
          resetMoveList: true,
        });
        if (!temp) {
          _consoleLog('[_loadFen]: bad FEN', _ALERT_ERROR);
          break block;
        }
        that?.silentlyResetManualResult?.();
        if (that?.boardHash?.() !== hash_cache) {
          rtn_changed = true;
          that?.refreshUi?.(0, false);
        }
      }
      return rtn_changed;
    }
    function _loadValidatedFen(fen) {
      let that = this;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          that?.setSquare?.([i, j], _EMPTY_SQR);
        }
      }
      fen = _trimSpaces(fen);
      let fen_parts = fen.split(' ');
      let fen_board_arr = fen_parts[0].split('/');
      for (let i = 0; i < 8; i++) {
        let current_file = 0;
        for (let j = 0, len = fen_board_arr[i].length; j < len; j++) {
          let current_char = fen_board_arr[i].charAt(j);
          let current_num_or_nan = Number(current_char);
          if (!current_num_or_nan) {
            that?.setSquare?.([i, current_file], current_char);
          }
          current_file += current_num_or_nan || 1;
        }
      }
      let castling_w_rights =
        (_strContains(fen_parts[2], 'K') ? _SHORT_CASTLE : 0) + (_strContains(fen_parts[2], 'Q') ? _LONG_CASTLE : 0);
      that.w.castling = castling_w_rights;
      let castling_b_rights =
        (_strContains(fen_parts[2], 'k') ? _SHORT_CASTLE : 0) + (_strContains(fen_parts[2], 'q') ? _LONG_CASTLE : 0);
      that.b.castling = castling_b_rights;
      let en_passant_bos = fen_parts[3].replace('-', '');
      that.enPassantBos = en_passant_bos;
      that?.toggleActiveNonActive?.(fen_parts[1] === 'b');
      that.halfMove = Number(fen_parts[4]) || 0;
      that.fullMove = Number(fen_parts[5]) || 1;
    }
    function _getClocklessFenHelper() {
      let that = this;
      let rtn = '';
      let fen_board = '';
      for (let i = 0; i < 8; i++) {
        let consecutive_empty_squares = 0;
        for (let j = 0; j < 8; j++) {
          let current_square = that?.getSquare?.([i, j]);
          if (!current_square.isEmptySquare) {
            fen_board += (consecutive_empty_squares || '') + current_square.bal;
            consecutive_empty_squares = -1;
          }
          consecutive_empty_squares++;
        }
        fen_board += (consecutive_empty_squares || '') + (i !== 7 ? '/' : '');
      }
      rtn += fen_board;
      rtn += ' ' + that.activeColor;
      rtn += ' ' + (_castlingChars(that?.w?.castling).toUpperCase() + '' + _castlingChars(that?.b?.castling) || '-');
      rtn += ' ' + (that.enPassantBos || '-');
      return rtn;
    }
    function _updateFenAndMisc(sliced_fen_history) {
      let that = this;
      let temp,
        temp2,
        from_bos,
        to_bos,
        can_en_passant,
        times_found,
        bishop_count,
        at_least_one_light,
        at_least_one_dark;
      that.checks = that?.attackersFromNonActive?.(null);
      that.isCheck = !!that.checks;
      /*! NO move below legalMovesHelper()*/
      that.legalUci = [];
      that.legalUciTree = {};
      that.legalRevTree = {};
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          let temp3 = that?.legalMovesHelper?.([i, j]);
          let len = temp3.uciMoves.length;
          if (!len) {
            continue;
          }
          from_bos = toBos([i, j]);
          that.legalUciTree[from_bos] = [];
          for (let k = 0; k < len; k++) {
            temp2 = temp3.uciMoves[k];
            if (temp3.isPromotion) {
              for (let m = _KNIGHT_W; m <= _QUEEN_W; m++) {
                let uci_promotion_move = temp2 + toBal(m).toLowerCase();
                that.legalUci.push(uci_promotion_move);
                that.legalUciTree[from_bos].push(uci_promotion_move);
              }
            } else {
              that.legalUci.push(temp2);
              that.legalUciTree[from_bos].push(temp2);
            }
            to_bos = temp2.slice(2, 4);
            if (!that.legalRevTree[to_bos]) {
              that.legalRevTree[to_bos] = {};
            }
            if (!that.legalRevTree[to_bos][temp3.piece]) {
              that.legalRevTree[to_bos][temp3.piece] = [];
            }
            that.legalRevTree[to_bos][temp3.piece].push(from_bos);
          }
        }
      }
      that.isCheckmate = that.isCheck && !that.legalUci.length;
      that.isStalemate = !that.isCheck && !that.legalUci.length;
      if (that.enPassantBos) {
        can_en_passant = false;
        if (that.legalRevTree[that.enPassantBos] && that?.legalRevTree?.[String(that.enPassantBos)]['p']) {
          can_en_passant = true;
        }
        if (!can_en_passant) {
          that.enPassantBos = '';
        }
      }
      let clockless_fen = that?.getClocklessFenHelper?.();
      that.fen = clockless_fen + ' ' + that.halfMove + ' ' + that.fullMove;
      that.isThreefold = false;
      if (sliced_fen_history || (that.moveList && Number(that.currentMove) > 7 && Number(that.halfMove) > 7)) {
        times_found = 1;
        temp = sliced_fen_history || that?.fenHistoryExport?.();
        let i = sliced_fen_history ? sliced_fen_history.length - 1 : Number(that.currentMove) - 1;
        for (; i >= 0; i--) {
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
      let total_pieces = countPieces(clockless_fen);
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
          that.isInsufficientMaterial = total_pieces.w.n + total_pieces.b.n + total_pieces.w.b + total_pieces.b.b === 1;
        } else if (total_pieces.w.b + total_pieces.b.b) {
          bishop_count = that?.countLightDarkBishops?.();
          at_least_one_light = !!(bishop_count.w.lightSquaredBishops + bishop_count.b.lightSquaredBishops);
          at_least_one_dark = !!(bishop_count.w.darkSquaredBishops + bishop_count.b.darkSquaredBishops);
          that.isInsufficientMaterial = at_least_one_light !== at_least_one_dark;
        } else {
          that.isInsufficientMaterial = true;
        }
      }
      that.isFiftyMove = Number(that.halfMove) >= 100;
      that.inDraw =
        !that.isCheckmate && (that.isStalemate || that.isThreefold || that.isInsufficientMaterial || that.isFiftyMove);
      that.w.materialDiff = [];
      that.b.materialDiff = [];
      for (let i = _PAWN_W; i <= _KING_W; i++) {
        temp = toBal(-i);
        let current_diff = total_pieces.w[temp] - total_pieces.b[temp];
        for (let j = 0, len = Math.abs(current_diff); j < len; j++) {
          if (current_diff > 0) {
            let w_piece_val = i;
            that.w.materialDiff.push(w_piece_val);
          } else {
            let b_piece_val = -i;
            that.b.materialDiff.push(b_piece_val);
          }
        }
      }
    }
    function _refinedFenTest() {
      let that = this;
      let rtn_msg = '';
      block: {
        let active_side = that[String(that.activeColor)];
        let non_active_side = that[String(that.nonActiveColor)];
        if (Number(that.halfMove) - active_side.isBlack + 1 >= Number(that.fullMove) * 2) {
          rtn_msg = 'Error [0] exceeding half moves ratio';
          break block;
        }
        if (Number(that.checks) > 2) {
          rtn_msg = 'Error [1] king is checked more times than possible';
          break block;
        }
        if (that?.attackersFromActive?.(null, true)) {
          rtn_msg = 'Error [2] non-active king in check';
          break block;
        }
        if (that.enPassantBos) {
          let en_passant_square = that?.getSquare?.(that.enPassantBos);
          let infront_ep_is_empty = that?.getSquare?.(en_passant_square, {
            rankShift: active_side.singlePawnRankShift,
          }).isEmptySquare;
          let behind_ep_val = that?.getSquare?.(en_passant_square, {
            rankShift: non_active_side.singlePawnRankShift,
          }).val;
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
        let total_pieces = countPieces(String(that.fen));
        let bishop_count = that?.countLightDarkBishops?.();
        for (let i = 0; i < 2; i++) {
          let current_side = i ? total_pieces.b : total_pieces.w;
          let current_other_side = i ? total_pieces.w : total_pieces.b;
          let current_bishop_count = i ? bishop_count.b : bishop_count.w;
          if (current_side.p > 8) {
            rtn_msg = 'Error [' + (i + 4) + '] more than 8 pawns';
            break block;
          }
          let current_promoted_count =
            Math.max(current_side.n - 2, 0) +
            Math.max(current_bishop_count.lightSquaredBishops - 1, 0) +
            Math.max(current_bishop_count.darkSquaredBishops - 1, 0) +
            Math.max(current_side.r - 2, 0) +
            Math.max(current_side.q - 1, 0);
          let temp =
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
        let fen_board = that.fen.split(' ')[0];
        for (let i = 0; i < 2; i++) {
          let current_side = i ? that.b : that.w;
          let min_captured = 0;
          for (let j = 0; j < 8; j++) {
            let total_pawns_in_current_file = 0;
            for (let k = 0; k < 8; k++) {
              total_pawns_in_current_file += Number(that?.getSquare?.([k, j]).val === current_side.pawn);
            }
            if (total_pawns_in_current_file > 1) {
              let temp = j === 0 || j === 7 ? [1, 3, 6, 10, 99] : [1, 2, 4, 6, 9];
              min_captured += temp[total_pawns_in_current_file - 2];
            }
          }
          if (min_captured > 15 - _occurrences(fen_board, i ? 'P|N|B|R|Q' : 'p|n|b|r|q')) {
            rtn_msg = 'Error [10] not enough captured pieces to support the total doubled pawns';
            break block;
          }
        }
        for (let i = 0; i < 2; i++) {
          let current_side = i ? that.b : that.w;
          if (!current_side.castling) {
            continue;
          }
          let temp = {
            completeActiveColor: i ? 'black' : 'white',
            originalKingBos: i ? 'e8' : 'e1',
            originalLongRookBos: i ? 'a8' : 'a1',
            originalShortRookBos: i ? 'h8' : 'h1',
          };
          if (that?.getSquare?.(temp.originalKingBos).val !== current_side.king) {
            rtn_msg = 'Error [11] ' + temp.completeActiveColor + ' castling rights without king in original square';
            break block;
          }
          if (
            current_side.castling !== _LONG_CASTLE &&
            that?.getSquare?.(temp.originalShortRookBos).val !== current_side.rook
          ) {
            rtn_msg = 'Error [12] ' + temp.completeActiveColor + ' short castling rights with missing H-file rook';
            break block;
          }
          if (
            current_side.castling !== _SHORT_CASTLE &&
            that?.getSquare?.(temp.originalLongRookBos).val !== current_side.rook
          ) {
            rtn_msg = 'Error [13] ' + temp.completeActiveColor + ' long castling rights with missing A-file rook';
            break block;
          }
        }
      }
      return rtn_msg;
    }
    function _testCollision(op, initial_qos, piece_direction, as_knight, max_shifts, allow_capture) {
      let that = this;
      let rtn = {
        candidateMoves: [],
        isAttacked: false,
      };
      let active_side = that[String(that.activeColor)];
      piece_direction = _toInt(piece_direction, 1, 8);
      max_shifts = _toInt(as_knight ? 1 : max_shifts || 7);
      let rank_change = (as_knight ? [-2, -1, 1, 2, 2, 1, -1, -2] : [-1, -1, 0, 1, 1, 1, 0, -1])[piece_direction - 1];
      let file_change = (as_knight ? [1, 2, 2, 1, -1, -2, -2, -1] : [0, 1, 1, 1, 0, -1, -1, -1])[piece_direction - 1];
      for (let i = 0; i < max_shifts; i++) {
        let current_square = that?.getSquare?.(initial_qos, {
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
      let that = this;
      let rtn = {
        uciMoves: [],
        piece: '',
        isPromotion: false,
      };
      var i,
        j,
        len,
        len2,
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
        non_active_side;
      function _candidateMoves(qos, piece_direction, as_knight, max_shifts, allow_capture) {
        let rtn_candidate_moves = that?.testCollision?.(
          _TEST_COLLISION_OP_CANDIDATE_MOVES,
          qos,
          piece_direction,
          as_knight,
          max_shifts,
          allow_capture
        ).candidateMoves;
        return rtn_candidate_moves;
      }
      block: {
        target_cached_square = that?.getSquare?.(target_qos, {
          isUnreferenced: true,
        });
        if (target_cached_square === null) {
          break block;
        }
        active_side = that[String(that.activeColor)];
        non_active_side = that[String(that.nonActiveColor)];
        if (target_cached_square.isEmptySquare || target_cached_square.sign === non_active_side.sign) {
          break block;
        }
        pseudo_legal_arr = [];
        en_passant_capturable_cached_square = null;
        is_promotion = false;
        rtn.piece = target_cached_square.bal.toLowerCase();
        let en_passant_bos = that.enPassantBos;
        if (target_cached_square.isKing) {
          for (i = _DIRECTION_TOP; i <= _DIRECTION_TOP_LEFT; i++) {
            temp = _candidateMoves(target_cached_square, i, false, 1, true);
            if (temp.length) {
              pseudo_legal_arr.push(temp);
            }
          }
          if (active_side.castling && !that.isCheck) {
            for (i = 0; i < 2; i++) {
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
                that?.attackersFromNonActive?.(
                  that?.getSquare?.(target_cached_square, { fileShift: temp2.singleFileShift }),
                  true
                )
              ) {
                continue;
              }
              temp = that?.getSquare?.(target_cached_square, {
                fileShift: temp2.singleFileShift * 2,
              });
              pseudo_legal_arr.push([temp]);
            }
          }
        } else if (target_cached_square.isPawn) {
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
            current_diagonal_square = that?.getSquare?.(target_cached_square, {
              rankShift: active_side.singlePawnRankShift,
              fileShift: i ? -1 : 1,
            });
            if (current_diagonal_square === null) {
              continue;
            }
            temp = sameSquare(current_diagonal_square, en_passant_bos);
            if (
              temp ||
              (current_diagonal_square.sign !== active_side.sign &&
                !current_diagonal_square.isEmptySquare &&
                !current_diagonal_square.isKing)
            ) {
              pseudo_legal_arr.push([current_diagonal_square]);
            }
            if (temp) {
              en_passant_capturable_cached_square = that?.getSquare?.(current_diagonal_square, {
                rankShift: non_active_side.singlePawnRankShift,
                isUnreferenced: true,
              });
            }
          }
        } else {
          piece_directions = [];
          if (!target_cached_square.isBishop) {
            piece_directions.push(1, 3, 5, 7);
          }
          if (!target_cached_square.isRook) {
            piece_directions.push(2, 4, 6, 8);
          }
          for (i = 0, len = piece_directions.length; i < len; i++) {
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
          for (j = 0, len2 = pseudo_legal_arr[i].length; j < len2; j++) {
            current_cached_square = that?.getSquare?.(pseudo_legal_arr[i][j], {
              isUnreferenced: true,
            });
            that?.setSquare?.(current_cached_square, target_cached_square.val);
            that?.setSquare?.(target_cached_square, _EMPTY_SQR);
            if (en_passant_capturable_cached_square !== null) {
              if (sameSquare(current_cached_square, en_passant_bos)) {
                that?.setSquare?.(en_passant_capturable_cached_square, _EMPTY_SQR);
              }
            }
            if (!that?.attackersFromNonActive?.(null, true)) {
              rtn.uciMoves.push(target_cached_square.bos + current_cached_square.bos);
            }
            that?.setSquare?.(current_cached_square, current_cached_square.val);
            that?.setSquare?.(target_cached_square, target_cached_square.val);
            if (en_passant_capturable_cached_square !== null) {
              that?.setSquare?.(en_passant_capturable_cached_square, en_passant_capturable_cached_square.val);
            }
          }
        }
        if (rtn.uciMoves.length) {
          rtn.isPromotion = is_promotion;
        }
      }
      return rtn;
    }
    function _legalMoves(target_qos, p) {
      let that = this;
      let rtn = [];
      p = _unreferenceP(p);
      block: {
        let pre_legal_uci_in_bos = that?.legalUciTree?.[toBos(target_qos) || ''];
        if (!pre_legal_uci_in_bos || !pre_legal_uci_in_bos.length) {
          break block;
        }
        let legal_uci_in_bos = pre_legal_uci_in_bos;
        legal_uci_in_bos = legal_uci_in_bos.slice(0);
        p.returnType = _isNonEmptyStr(p.returnType) ? p.returnType : 'toSquare';
        p.squareType = _isNonEmptyStr(p.squareType) ? p.squareType : 'bos';
        p.delimiter = _isNonEmptyStr(p.delimiter) ? p.delimiter.charAt(0) : '-';
        if (p.returnType === 'uci') {
          rtn = legal_uci_in_bos;
          break block;
        }
        let mov = [];
        let used_keys = {};
        let is_fen_or_san = p.returnType === 'fen' || p.returnType === 'san';
        for (let i = 0, len = legal_uci_in_bos.length; i < len; i++) {
          let temp2 = legal_uci_in_bos[i];
          if (is_fen_or_san) {
            let temp3 = that?.playMove?.(temp2, { isMockMove: true, isLegalMove: true, isUnreferenced: true });
            if (p.returnType === 'fen') {
              let fen_move = temp3.fen;
              mov.push(fen_move);
            } else {
              let san_move = temp3.san;
              mov.push(san_move);
            }
            continue;
          }
          let from_bos = temp2.slice(0, 2);
          let to_bos = temp2.slice(2, 4);
          if (used_keys[to_bos]) {
            continue;
          }
          used_keys[to_bos] = true;
          if (p.returnType === 'joined') {
            let joined_move = from_bos + p.delimiter + to_bos;
            mov.push(joined_move);
          } else if (p.returnType === 'fromToSquares') {
            if (p.squareType === 'square') {
              let from_square = that?.getSquare?.(from_bos, { isUnreferenced: true });
              let to_square = that?.getSquare?.(to_bos, { isUnreferenced: true });
              let square_move_from_to = [from_square, to_square];
              mov.push(square_move_from_to);
            } else if (p.squareType === 'pos') {
              let from_pos = toPos(from_bos);
              let to_pos = toPos(to_bos);
              let pos_move_from_to = [from_pos, to_pos];
              mov.push(pos_move_from_to);
            } else {
              let bos_move_from_to = [from_bos, to_bos];
              mov.push(bos_move_from_to);
            }
          } else {
            if (p.squareType === 'square') {
              let to_square = that?.getSquare?.(to_bos, { isUnreferenced: true });
              mov.push(to_square);
            } else if (p.squareType === 'pos') {
              let to_pos = toPos(to_bos);
              mov.push(to_pos);
            } else {
              mov.push(to_bos);
            }
          }
        }
        if (is_fen_or_san && mov.length !== legal_uci_in_bos.length) {
          break block;
        }
        rtn = mov;
      }
      return rtn;
    }
    function _legalFenMoves(target_qos) {
      let that = this;
      return that?.legalMoves?.(target_qos, { returnType: 'fen' });
    }
    function _legalSanMoves(target_qos) {
      let that = this;
      return that?.legalMoves?.(target_qos, { returnType: 'san' });
    }
    function _legalUciMoves(target_qos) {
      let that = this;
      return that?.legalMoves?.(target_qos, { returnType: 'uci' });
    }
    function _isLegalMove(mov, p) {
      let that = this;
      let rtn = false;
      block: {
        let wrapped_move = that?.getWrappedMove?.(mov, p);
        if (wrapped_move === null) {
          break block;
        }
        if (wrapped_move.isConfirmedLegalMove) {
          rtn = true;
          break block;
        }
        let legal_uci_in_bos = that?.legalUciTree?.[wrapped_move.fromBos];
        if (!legal_uci_in_bos || !legal_uci_in_bos.length) {
          break block;
        }
        /*! NO use overcomplicated legalRevTree*/
        rtn = _strContains(legal_uci_in_bos.join(','), wrapped_move.fromBos + '' + wrapped_move.toBos);
      }
      return rtn;
    }
    function _getCheckmateMoves(early_break) {
      let that = this;
      let rtn = [];
      outer: for (let i = 0, len = that.legalUci.length; i < len; i++) {
        let temp = that?.playMove?.(that?.legalUci?.[i], { isLegalMove: true, isMockMove: true });
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
      let that = this;
      let rtn = [];
      outer: for (let i = 0, len = that.legalUci.length; i < len; i++) {
        let temp = that?.playMove?.(that?.legalUci?.[i], { isLegalMove: true, isMockMove: true });
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
      let that = this;
      let rtn = [];
      for (let i = 0, len = that.moveList.length; i < len; i++) {
        rtn.push(String(that?.moveList?.[i]?.fen));
      }
      return rtn;
    }
    function _pgnExport() {
      let that = this;
      let rtn = '';
      /*! TODO p options: remove comments, max line len, tag white-list*/
      var i,
        len,
        header,
        ordered_tags,
        result_tag_ow,
        move_list,
        black_starts,
        initial_fen,
        initial_full_move,
        current_move,
        text_game;
      header = _unreferenceP(header);
      /*! TODO header from _pgnParserHelper()*/
      move_list = that.moveList;
      initial_fen = move_list[0].fen;
      black_starts = move_list[0].colorToPlay === 'b';
      let that_current_move = Number(that.currentMove);
      let that_full_move = Number(that.fullMove);
      initial_full_move =
        that_full_move -
        Math.floor((that_current_move + black_starts - 1) / 2) +
        Number(black_starts === !(that_current_move % 2)) -
        1;
      result_tag_ow = _RESULT_ONGOING;
      text_game = '';
      for (i = 0, len = move_list.length; i < len; i++) {
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
        rtn += '[' + ordered_tags[i][0] + ' "' + ordered_tags[i][1] + '"]\n';
      }
      rtn += '\n' + text_game;
      return rtn;
    }
    function _uciExport() {
      let that = this;
      let rtn = '';
      let uci_arr = [];
      for (let i = 1, len = that.moveList.length; i < len; i++) {
        uci_arr.push(String(that?.moveList?.[i]?.uci));
      }
      if (uci_arr.length) {
        rtn = uci_arr.join(' ');
      }
      return rtn;
    }
    function _ascii(is_rotated) {
      let that = this;
      let rtn = '   +------------------------+\n';
      let bottom_label = '';
      is_rotated = typeof is_rotated === 'boolean' ? is_rotated : that.isRotated;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          let current_square = that?.getSquare?.(is_rotated ? [7 - i, 7 - j] : [i, j]);
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
      let that = this;
      let temp = '';
      for (let i = 0, len = _MUTABLE_KEYS.length; i < len; i++) {
        temp += JSON.stringify(that[_MUTABLE_KEYS[i]]);
      }
      return _hashCode(temp);
    }
    function _isEqualBoard(to_woard) {
      let that = this;
      let rtn = false;
      block: {
        let to_board = getBoard(to_woard);
        if (to_board === null) {
          _consoleLog("[_isEqualBoard]: to_woard doesn't exist", _ALERT_ERROR);
          break block;
        }
        rtn = that === to_board || that?.boardHash?.() === to_board?.boardHash?.();
      }
      return rtn;
    }
    function _cloneBoardFrom(from_woard) {
      let that = this;
      let rtn_changed = false;
      let hash_cache = that?.boardHash?.();
      _cloneBoardToObj(that, from_woard);
      if (that?.boardHash?.() !== hash_cache) {
        rtn_changed = true;
        that?.refreshUi?.(0, false);
      }
      return rtn_changed;
    }
    function _cloneBoardTo(to_woard) {
      let that = this;
      let rtn_changed = false;
      block: {
        let to_board = getBoard(to_woard);
        if (to_board === null) {
          _consoleLog("[_cloneBoardTo]: to_woard doesn't exist", _ALERT_ERROR);
          break block;
        }
        let hash_cache = to_board?.boardHash?.();
        _cloneBoardToObj(to_board, that);
        if (to_board?.boardHash?.() !== hash_cache) {
          rtn_changed = true;
          to_board?.refreshUi?.(0, false);
        }
      }
      return rtn_changed;
    }
    function _reset(keep_options) {
      let that = this;
      let rtn = that?.loadFen?.(_DEFAULT_FEN, {
        skipFenValidation: true,
        keepOptions: keep_options,
      });
      return rtn;
    }
    function _undoMove() {
      let that = this;
      let rtn = null;
      block: {
        let temp = that?.undoMoves?.(1);
        if (temp.length !== 1) {
          break block;
        }
        rtn = temp[0];
      }
      return rtn;
    }
    function _undoMoves(decrease_by) {
      let that = this;
      let rtn = [];
      block: {
        if (that.isPuzzleMode) {
          break block;
        }
        if (Number(that.moveList.length) < 2) {
          break block;
        }
        if (!decrease_by && decrease_by !== 0) {
          decrease_by = Infinity;
        }
        decrease_by = _toInt(decrease_by, 0, Number(that.moveList.length) - 1);
        if (!decrease_by) {
          break block;
        }
        let hash_cache = that?.boardHash?.();
        let cache_is_hidden = that.isHidden;
        that.isHidden = true;
        that?.navLinkMove?.(Math.min(Number(that.moveList.length) - decrease_by - 1, Number(that.currentMove)));
        that.isHidden = cache_is_hidden;
        rtn = new Array(decrease_by);
        for (let i = 0; i < decrease_by; i++) {
          let move = that.moveList?.[Number(that.moveList.length) - i - 1];
          rtn[decrease_by - i - 1] = _unreferencedMoveHelper(move);
        }
        that.moveList = that.moveList.slice(0, -decrease_by);
        if (that?.boardHash?.() !== hash_cache) {
          that?.silentlyResetManualResult?.();
          that?.refreshUi?.(0, false);
        }
      }
      return rtn;
    }
    function _countLightDarkBishops() {
      let that = this;
      let rtn = {
        w: { lightSquaredBishops: 0, darkSquaredBishops: 0 },
        b: { lightSquaredBishops: 0, darkSquaredBishops: 0 },
      };
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          let current_square = that?.getSquare?.([i, j]);
          if (current_square.isBishop) {
            let current_side = current_square.sign > 0 ? rtn.w : rtn.b;
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
      let that = this;
      let rtn = false;
      block: {
        if (!_isObject(obj)) {
          _consoleLog('[_updateHelper]: wrong input type', _ALERT_ERROR);
          break block;
        }
        if (obj.fen) {
          let fen_was_valid = obj.skipFenValidation || isLegalFen(obj.fen);
          if (!fen_was_valid) {
            _consoleLog('[_updateHelper]: bad FEN', _ALERT_ERROR);
            break block;
          }
        }
        that.currentMove = _toInt(obj.currentMove);
        if (obj.fen) {
          that?.loadValidatedFen?.(obj.fen);
        }
        that?.updateFenAndMisc?.(obj.slicedFenHistory);
        if (obj.resetMoveList) {
          let temp = '';
          if (that.isCheckmate) {
            temp = that[String(that.activeColor)].isBlack ? _RESULT_W_WINS : _RESULT_B_WINS;
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
          that?.silentlyResetOptions?.();
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
          for (j = 0; j < 8; j++) {
            current_bos = Ic2.toBos([i, j]);
            old_square = that.getSquare(current_bos);
            new_square = obj.squares[current_bos];
            if (old_square.val === new_square.val) {
              continue;
            }
            if (new_square.val === 0) {
              if (old_square.val > 0 === (that.activeColor === 'w')) {
                from_squares.push(current_bos);
              }
            } else {
              if (new_square.val > 0 === (that.activeColor === 'w')) {
                to_squares.push(current_bos);
              }
            }
          }
        }
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
        new_square = obj.squares[to_squares[0]];
        if (!new_square) {
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
          lc_piece = 'p';
          parse_exec = /([^=]+)=(.?).*$/.exec(mov);
          if (parse_exec) {
            mov = parse_exec[1];
            parsed_promote = parse_exec[2];
          }
          to_bos = toBos(mov.slice(-2));
        } else if (mov === 'O-O') {
          lc_piece = 'k';
          to_bos = that[that.activeColor].isBlack ? 'g8' : 'g1';
        } else if (mov === 'O-O-O') {
          lc_piece = 'k';
          to_bos = that[that.activeColor].isBlack ? 'c8' : 'c1';
        } else {
          parse_exec = /^[NBRQK]/.exec(mov);
          if (parse_exec) {
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
          pgn_obj = that.draftMove([temp[i], to_bos], { isLegalMove: true });
          /*! NO pass unnecessary promoteTo*/
          if (!pgn_obj.canMove) {
            continue;
          }
          for (j = 0, len2 = pgn_obj.withOverdisambiguated.length; j < len2; j++) {
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
    function _getWrappedMove(mov, p) {
      var that, temp, bubbling_promoted_to, is_confirmed_legal, rtn;
      that = this;
      rtn = null;
      block: {
        bubbling_promoted_to = 0;
        is_confirmed_legal = false;
        temp = _uciWrapmoveHelper(mov);
        if (temp) {
          bubbling_promoted_to = temp[1];
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
          bubbling_promoted_to = temp[1];
          rtn = temp[0];
          break block;
        }
        temp = that.fenWrapmoveHelper(mov);
        if (temp) {
          bubbling_promoted_to = temp[1];
          rtn = temp[0];
          break block;
        }
        temp = that.sanWrapmoveHelper(mov);
        if (temp) {
          bubbling_promoted_to = temp[1];
          is_confirmed_legal = true;
          rtn = temp[0];
          break block;
        }
      }
      if (rtn) {
        temp = toAbsVal(bubbling_promoted_to) || that.promoteTo || _QUEEN_W;
        /*! NO remove toAbsVal()*/
        rtn = {
          fromBos: rtn[0],
          toBos: rtn[1],
          promotion: _promoteValHelper(temp),
          isConfirmedLegalMove: is_confirmed_legal,
        };
      }
      return rtn;
    }
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
        bubbling_promoted_to = _promoteValHelper(toAbsVal(p.promoteTo) || wrapped_move.promotion);
        /*! NO remove toAbsVal()*/
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
              king_castled = _SHORT_CASTLE;
              rtn.putRookAtFileShift = -1;
              rtn.removeRookAtFileShift = 1;
            } else if (final_cached_square.filePos === 2) {
              king_castled = _LONG_CASTLE;
              rtn.putRookAtFileShift = 1;
              rtn.removeRookAtFileShift = -2;
            }
          }
        } else if (initial_cached_square.isPawn) {
          pawn_moved = true;
          if (Math.abs(initial_cached_square.rankPos - final_cached_square.rankPos) > 1) {
            new_en_passant_bos = that.getSquare(final_cached_square, {
              rankShift: non_active_side.singlePawnRankShift,
            }).bos;
          } else if (sameSquare(final_cached_square, that.enPassantBos)) {
            lc_captured = 'p';
            is_en_passant_capture = true;
            rtn.enPassantCaptureAtRankShift = non_active_side.singlePawnRankShift;
          } else if (final_cached_square.rankPos === active_side.lastRankPos) {
            promoted_val = bubbling_promoted_to * active_side.sign;
          }
        }
        partial_san = '';
        with_overdisambiguated = [];
        if (king_castled) {
          partial_san += king_castled === _LONG_CASTLE ? 'O-O-O' : 'O-O';
          with_overdisambiguated.push(partial_san);
        } else if (pawn_moved) {
          if (initial_cached_square.fileBos !== final_cached_square.fileBos) {
            partial_san += initial_cached_square.fileBos + 'x';
          }
          partial_san += final_cached_square.bos;
          with_overdisambiguated.push(partial_san);
          if (promoted_val) {
            partial_san += '=' + toAbsBal(promoted_val);
          }
        } else {
          is_ambiguous = false;
          extra_file_bos = '';
          extra_rank_bos = '';
          if (!initial_cached_square.isKing) {
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
              partial_san += temp + initial_cached_square.fileBos + temp2;
              with_overdisambiguated.push(partial_san);
              with_overdisambiguated.push(temp + initial_cached_square.rankBos + temp2);
            }
            if (extra_file_bos || extra_rank_bos) {
              partial_san += temp + extra_file_bos + extra_rank_bos + temp2;
              with_overdisambiguated.push(partial_san);
            }
            if (!extra_file_bos || !extra_rank_bos) {
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
        is_promotion,
        mov_uci,
        wrapped_move,
        max_current_move_possible,
        on_solve_out_of_bounds,
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
        if (that.isPuzzleMode) {
          max_current_move_possible = that.moveList.length - 1;
          if (that.currentMove < max_current_move_possible) {
            wrapped_move = that.getWrappedMove(mov, p);
            if (
              wrapped_move !== null &&
              (p.isLegalMove || wrapped_move.isConfirmedLegalMove || that.isLegalMove(mov, p))
            ) {
              is_promotion = !!that.moveList[that.currentMove + 1].promotion;
              mov_uci =
                wrapped_move.fromBos +
                '' +
                wrapped_move.toBos +
                (is_promotion ? toBal(wrapped_move.promotion).toLowerCase() : '');
              if (mov_uci === that.moveList[that.currentMove + 1].uci) {
                on_solve_out_of_bounds = that.currentMove + 2 > max_current_move_possible;
                if (p.isMockMove) {
                  rtn_move_obj = on_solve_out_of_bounds
                    ? that.moveList[max_current_move_possible]
                    : that.moveList[that.currentMove + 2];
                } else {
                  if (p.isInanimated && on_solve_out_of_bounds) {
                    that.setCurrentMove(max_current_move_possible, true, true);
                  } else {
                    that.setCurrentMove(2, false, true);
                  }
                  rtn_move_obj = that.moveList[that.currentMove];
                }
                if (p.isUnreferenced) {
                  rtn_move_obj = _unreferencedMoveHelper(rtn_move_obj);
                }
              }
            }
          }
          break block;
        }
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
          move_res = non_active_side.isBlack ? _RESULT_W_WINS : _RESULT_B_WINS;
        } else if (that.isStalemate) {
          move_res = _RESULT_DRAW;
        } else if (that.isCheck) {
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
            autogen_comment = '{50 moves rule}';
          }
        }
        temp = (initial_cached_square.bal.replace('*', '') || '').toLowerCase();
        temp2 = (toBal(pgn_obj.promotedVal).replace('*', '') || '').toLowerCase();
        temp3 = initial_cached_square.bos + '' + final_cached_square.bos + temp2;
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
        that.refreshUi(p.isInanimated ? 0 : 1, p.playSounds);
      }
      return rtn_move_obj;
    }
    function _playMoves(arr, p, sliced_fen_history) {
      let that = this;
      let rtn = false;
      let p_cache = _unreferenceP(p, [['isUnreferenced', false]]);
      p = _unreferenceP(p, [
        ['isInanimated', true],
        ['playSounds', false],
        ['isUnreferenced', false],
      ]);
      let at_least_one_parsed = false;
      block: {
        if (!_isArray(arr) || !arr.length) {
          break block;
        }
        let everything_parsed = true;
        let cache_is_hidden = that.isHidden;
        that.isHidden = true;
        for (let i = 0, len = arr.length; i < len; i++) {
          if (that?.playMove?.(arr[i], p, sliced_fen_history) === null) {
            everything_parsed = false;
            break;
          }
          at_least_one_parsed = true;
        }
        that.isHidden = cache_is_hidden;
        if (!everything_parsed) {
          break block;
        }
        rtn = true;
      }
      if (at_least_one_parsed) {
        that?.refreshUi?.(p_cache.isInanimated ? 0 : 1, p_cache.playSounds);
      }
      return rtn;
    }
    function _playRandomMove(p, sliced_fen_history) {
      var i, len, that, temp, temp2, used_keys, rtn;
      that = this;
      rtn = null;
      p = _unreferenceP(p, [['isLegalMove', true]]);
      block: {
        temp = that.legalUci.slice(0);
        if (toVal(p.promoteTo)) {
          temp = [];
          used_keys = {};
          for (i = 0, len = that.legalUci.length; i < len; i++) {
            temp2 = that.legalUci[i].slice(0, 4);
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
    //!---------------- board (using IcUi)
    function _refreshUi(animation_type, play_sounds) {
      let that = this;
      if (_WIN?.IcUi?.refreshUi) {
        _WIN.IcUi.refreshUi.apply(that, [animation_type, play_sounds]);
      }
    }
    //!---------------- ic
    class getChainableBoard {
      board;
      stack;
      constructor(woard) {
        let board = getBoard(woard);
        this.board =
          board === null
            ? initBoard({
                ...(typeof woard === 'string' && { boardName: woard }),
              })
            : board;
        this.stack = [];
        for (const key in this.board) {
          if (typeof this.board[key] === 'function') {
            this[key] = (...args) => {
              const result = this.board[key].apply(this.board, args);
              this.stack.push(result);
              return this;
            };
          }
        }
      }
    }
    function setSilentMode(val) {
      _SILENT_MODE = !!val;
    }
    function isLegalFen(fen) {
      return fenApply(fen, 'isLegalFen');
    }
    function getBoard(woard) {
      let rtn = null;
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
    function toVal(pvqal) {
      let rtn = 0;
      if (typeof pvqal === 'string') {
        rtn = _strToValHelper(pvqal);
      } else if (typeof pvqal === 'number') {
        rtn = _toInt(pvqal, _KING_B, _KING_W);
      } else if (_isSquare(pvqal)) {
        let validated_val = _toInt(pvqal.val, _KING_B, _KING_W);
        rtn = validated_val;
      }
      return rtn;
    }
    function toAbsVal(pvqal) {
      let rtn = Math.abs(toVal(pvqal));
      return rtn;
    }
    function toBal(pvqal) {
      let val = toVal(pvqal);
      let abs_val = toAbsVal(pvqal);
      const ARR_ABS_BAL = ['*', 'P', 'N', 'B', 'R', 'Q', 'K'];
      let abs_bal = ARR_ABS_BAL[abs_val];
      let rtn = val === abs_val ? abs_bal : abs_bal.toLowerCase();
      return rtn;
    }
    function toAbsBal(pvqal) {
      let validated_abs_bal = toBal(toAbsVal(pvqal));
      return validated_abs_bal;
    }
    function toClassName(pvqal) {
      let piece_bal = toBal(pvqal);
      let validated_abs_bal = piece_bal.toUpperCase();
      let validated_class_name =
        piece_bal !== '*' ? (piece_bal === validated_abs_bal ? 'w' : 'b') + validated_abs_bal.toLowerCase() : '';
      return validated_class_name;
    }
    function toBos(pvqos) {
      let rtn = null;
      if (_isArray(pvqos)) {
        let temp = _arrToPosHelper(pvqos);
        if (temp !== null) {
          let bos = 'abcdefgh'.charAt(temp[1]) + '' + (8 - temp[0]);
          rtn = bos;
        }
      } else if (typeof pvqos === 'string') {
        rtn = _strToBosHelper(pvqos);
      } else if (_isSquare(pvqos)) {
        rtn = _strToBosHelper(pvqos.bos);
      }
      return rtn;
    }
    function toPos(pvqos) {
      let rtn = null;
      if (typeof pvqos === 'string') {
        let temp = _strToBosHelper(pvqos);
        if (temp !== null) {
          rtn = [8 - Number(temp.charAt(1)), 'abcdefgh'.indexOf(temp.charAt(0))];
        }
      } else if (_isArray(pvqos)) {
        rtn = _arrToPosHelper(pvqos);
      } else if (_isSquare(pvqos)) {
        let validated_pos = pvqos.pos;
        rtn = _arrToPosHelper(validated_pos);
      }
      return rtn;
    }
    function getSign(pvzal) {
      return (typeof pvzal === 'boolean' ? !pvzal : toVal(pvzal) > 0) ? 1 : -1;
    }
    function getRankPos(pvqos) {
      let rtn = null;
      let pos = toPos(pvqos);
      if (pos !== null) {
        rtn = pos[0];
      }
      return rtn;
    }
    function getFilePos(pvqos) {
      let rtn = null;
      let pos = toPos(pvqos);
      if (pos !== null) {
        rtn = pos[1];
      }
      return rtn;
    }
    function getRankBos(pvqos) {
      let rtn = null;
      let bos = toBos(pvqos);
      if (bos !== null) {
        let validated_rank_bos = bos.charAt(1);
        rtn = validated_rank_bos;
      }
      return rtn;
    }
    function getFileBos(pvqos) {
      let rtn = null;
      let bos = toBos(pvqos);
      if (bos !== null) {
        let validated_file_bos = bos.charAt(0);
        rtn = validated_file_bos;
      }
      return rtn;
    }
    function isInsideBoard(pvqos) {
      let rtn = false;
      if (typeof pvqos === 'string') {
        rtn = _strToBosHelper(pvqos) !== null;
      } else if (_isArray(pvqos)) {
        rtn = _arrToPosHelper(pvqos) !== null;
      } else {
        rtn = _isSquare(pvqos);
      }
      return rtn;
    }
    function sameSquare(pvqos1, pvqos2) {
      let rtn = false;
      pvqos1 = toBos(pvqos1);
      pvqos2 = toBos(pvqos2);
      if (pvqos1 !== null && pvqos2 !== null) {
        rtn = pvqos1 === pvqos2;
      }
      return rtn;
    }
    function countPieces(fen) {
      let rtn = {
        w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
        b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
      };
      if (_isNonBlankStr(fen)) {
        let fen_board = _trimSpaces(fen).split(' ')[0];
        for (let i = _PAWN_W; i <= _KING_W; i++) {
          for (let j = 0; j < 2; j++) {
            let current_side = j ? rtn.w : rtn.b;
            current_side[toBal(-i)] = _occurrences(fen_board, toBal(i * getSign(!j)));
          }
        }
      }
      return rtn;
    }
    function removeBoard(woard) {
      let rtn = false;
      let del_board = getBoard(woard);
      if (del_board !== null) {
        rtn = true;
        let del_board_name_cache = String(del_board.boardName);
        del_board = null;
        _BOARDS[del_board_name_cache] = null;
        delete _BOARDS[del_board_name_cache];
        /*! TODO ui problem: autorefresh when removing loaded board. EDIT: can't easily select a non-hidden board*/
      }
      return rtn;
    }
    function isEqualBoard(left_woard, right_woard) {
      let rtn = false;
      block: {
        let left_board = getBoard(left_woard);
        if (left_board === null) {
          _consoleLog("[isEqualBoard]: left_woard doesn't exist", _ALERT_ERROR);
          break block;
        }
        rtn = left_board?.isEqualBoard?.(right_woard);
      }
      return rtn;
    }
    function cloneBoard(to_woard, from_woard) {
      let rtn = false;
      block: {
        let to_board = getBoard(to_woard);
        if (to_board === null) {
          _consoleLog("[cloneBoard]: to_woard doesn't exist", _ALERT_ERROR);
          break block;
        }
        rtn = to_board?.cloneBoardFrom?.(from_woard);
      }
      return rtn;
    }
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
          : 'b_' +
            (
              (/* @__PURE__ */ new Date().getTime() + '').slice(-10) +
              '' +
              Math.random().toString(36).slice(2, 7)
            ).slice(-10);
        board_name = p.boardName;
        p.isRotated = p.isRotated === true;
        p.isPuzzleMode = p.isPuzzleMode === true;
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
          _consoleLog('[initBoard]: "' + board_name + '" bad FEN', _ALERT_ERROR);
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
        });
        /*! NO remove skipFenValidation*/
        postfen_was_valid = p.skipFenValidation || !new_board.refinedFenTest();
        if (p.validOrBreak && !postfen_was_valid) {
          _consoleLog('[initBoard]: "' + board_name + '" bad postFEN', _ALERT_ERROR);
          break block;
        }
        if (!postfen_was_valid) {
          new_board.updateHelper({
            currentMove: 0,
            fen: _DEFAULT_FEN,
            skipFenValidation: true,
            resetMoveList: true,
          });
          /*! NO remove skipFenValidation*/
        }
        if (p.pgn) {
          everything_parsed = new_board.playMoves(p.pgn.sanMoves);
          /*! NO p.validOrBreak short-circuit*/
          if (p.validOrBreak && !everything_parsed) {
            _consoleLog('[initBoard]: "' + board_name + '" bad PGN', _ALERT_ERROR);
            break block;
          } else {
            if (p.pgn.result !== _RESULT_ONGOING) {
              p.manualResult = _pgnResultHelper(p.manualResult) || p.pgn.result;
            }
          }
        } else if (p.uci) {
          everything_parsed = new_board.playMoves(p.uci);
          /*! NO p.validOrBreak short-circuit*/
          if (p.validOrBreak && !everything_parsed) {
            _consoleLog('[initBoard]: "' + board_name + '" bad UCI', _ALERT_ERROR);
            break block;
          }
        }
        p.moveIndex = _isIntOrStrInt(p.moveIndex) ? p.moveIndex : new_board.moveList.length - 1;
        new_board.setCurrentMove(p.moveIndex, true);
        /*! NO move below isPuzzleMode*/
        new_board.isRotated = p.isRotated;
        new_board.isPuzzleMode = p.isPuzzleMode;
        new_board.setPromoteTo(p.promoteTo);
        new_board.setManualResult(p.manualResult);
        new_board.isHidden = p.isHidden;
        new_board.refreshUi(0, false);
        rtn = new_board;
        finished_block = true;
      }
      if (board_created && !finished_block) {
        removeBoard(new_board);
      }
      return rtn;
    }
    function fenApply(fen, fn_name, args, p) {
      let rtn = null;
      args = _isArray(args) ? args : [];
      p = _unreferenceP(p);
      let silent_mode_cache = _SILENT_MODE;
      fn_name = _isNonBlankStr(fn_name) ? _formatName(fn_name) : 'isLegalFen';
      if (fn_name === 'isLegalFen') {
        setSilentMode(true);
      }
      let board = initBoard({
        boardName: 'board_fenApply_' + fn_name,
        fen,
        isRotated: p.isRotated,
        promoteTo: p.promoteTo,
        skipFenValidation: p.skipFenValidation,
        isHidden: true,
        validOrBreak: true,
      });
      if (fn_name === 'isLegalFen') {
        setSilentMode(silent_mode_cache);
      }
      let board_created = board !== null;
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
          _consoleLog('[fenApply]: invalid function name "' + fn_name + '"', _ALERT_ERROR);
      }
      if (board_created) {
        removeBoard(board);
      }
      return rtn;
    }
    function fenGet(fen, props, p) {
      let rtn = null;
      var board, board_name, board_created, board_keys, current_key, invalid_key, rtn_pre;
      p = _unreferenceP(p);
      board_created = false;
      block: {
        board_name = 'board_fenGet';
        board = initBoard({
          boardName: board_name,
          fen,
          skipFenValidation: p.skipFenValidation,
          isHidden: true,
          validOrBreak: true,
        });
        if (board === null) {
          _consoleLog('[fenGet]: invalid FEN', _ALERT_ERROR);
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
        for (let i = 0, len = board_keys.length; i < len; i++) {
          current_key = _formatName(board_keys[i]);
          if (current_key && !rtn_pre[current_key]) {
            invalid_key = true;
            for (let j = 0, len2 = _MUTABLE_KEYS.length; j < len2; j++) {
              if (current_key === _MUTABLE_KEYS[j]) {
                invalid_key = false;
                rtn_pre[current_key] = board[current_key];
                break;
              }
            }
            if (invalid_key) {
              _consoleLog('[fenGet]: invalid property name "' + current_key + '"', _ALERT_ERROR);
              break block;
            }
          }
        }
        rtn = rtn_pre;
      }
      if (board_created) {
        removeBoard(board_name);
      }
      return rtn;
    }
    function getBoardNames() {
      return Object.keys(_BOARDS);
    }
    function Ic2(woard) {
      return new getChainableBoard(woard);
    }
    Ic2.version = _VERSION;
    Ic2.setSilentMode = setSilentMode;
    Ic2.isLegalFen = isLegalFen;
    Ic2.getBoard = getBoard;
    Ic2.toVal = toVal;
    Ic2.toAbsVal = toAbsVal;
    Ic2.toBal = toBal;
    Ic2.toAbsBal = toAbsBal;
    Ic2.toClassName = toClassName;
    Ic2.toBos = toBos;
    Ic2.toPos = toPos;
    Ic2.getSign = getSign;
    Ic2.getRankPos = getRankPos;
    Ic2.getFilePos = getFilePos;
    Ic2.getRankBos = getRankBos;
    Ic2.getFileBos = getFileBos;
    Ic2.isInsideBoard = isInsideBoard;
    Ic2.sameSquare = sameSquare;
    Ic2.countPieces = countPieces;
    Ic2.removeBoard = removeBoard;
    Ic2.isEqualBoard = isEqualBoard;
    Ic2.cloneBoard = cloneBoard;
    Ic2.initBoard = initBoard;
    Ic2.fenApply = fenApply;
    Ic2.fenGet = fenGet;
    Ic2.getBoardNames = getBoardNames;
    Ic2.utilityMisc = {
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
    };
    return Ic2;
  })(windw);
  if (windw !== null && windw !== void 0) {
    if (!windw['Ic']) {
      windw['Ic'] = Ic;
    }
  }
  if (expts !== null && expts !== void 0) {
    if (!expts['Ic']) {
      expts['Ic'] = Ic;
    }
  }
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
