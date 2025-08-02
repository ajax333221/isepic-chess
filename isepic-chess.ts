/*! Copyright (c) 2025 Ajax Isepic (ajax333221) Licensed MIT */

declare var exports: any, define: any;

import * as Ts from './isepic-chess.types';

(function (windw?, expts?, defin?) {
  var Ic = (function (_WIN?: any) {
    const _VERSION: string = '9.0.0';

    let _SILENT_MODE: boolean = true; //mutable
    let _BOARDS: Ts.Boards = {}; //mutable

    const _EMPTY_SQR: Ts.EmptyVal = 0;
    const _PAWN_W: Ts.WpVal = 1;
    const _KNIGHT_W: Ts.WnVal = 2;
    const _BISHOP_W: Ts.WbVal = 3;
    const _ROOK_W: Ts.WrVal = 4;
    const _QUEEN_W: Ts.WqVal = 5;
    const _KING_W: Ts.WkVal = 6;
    const _PAWN_B: Ts.BpVal = -1;
    const _KNIGHT_B: Ts.BnVal = -2;
    const _BISHOP_B: Ts.BbVal = -3;
    const _ROOK_B: Ts.BrVal = -4;
    const _QUEEN_B: Ts.BqVal = -5;
    const _KING_B: Ts.BkVal = -6;
    const _DIRECTION_TOP: Ts.DirectionTop = 1;
    const _DIRECTION_TOP_RIGHT: Ts.DirectionTopRight = 2;
    const _DIRECTION_RIGHT: Ts.DirectionRight = 3;
    const _DIRECTION_BOTTOM_RIGHT: Ts.DirectionBottomRight = 4;
    const _DIRECTION_BOTTOM: Ts.DirectionBottom = 5;
    const _DIRECTION_BOTTOM_LEFT: Ts.DirectionBottomLeft = 6;
    const _DIRECTION_LEFT: Ts.DirectionLeft = 7;
    const _DIRECTION_TOP_LEFT: Ts.DirectionTopLeft = 8;
    const _SHORT_CASTLE: Ts.ShortCastle = 1;
    const _LONG_CASTLE: Ts.LongCastle = 2;
    const _RESULT_ONGOING: Ts.OngoingResult = '*';
    const _RESULT_W_WINS: Ts.WhiteWinsResult = '1-0';
    const _RESULT_B_WINS: Ts.BlackWinsResult = '0-1';
    const _RESULT_DRAW: Ts.DrawResult = '1/2-1/2';
    const _DEFAULT_FEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    const _ALERT_LIGHT: Ts.AlertLight = 'light';
    const _ALERT_DARK: Ts.AlertDark = 'dark';
    const _ALERT_SUCCESS: Ts.AlertSuccess = 'success';
    const _ALERT_WARNING: Ts.AlertWarning = 'warning';
    const _ALERT_ERROR: Ts.AlertError = 'error';

    const _TEST_COLLISION_OP_CANDIDATE_MOVES: Ts.TestCollisionOpCandidateMoves = 1;
    const _TEST_COLLISION_OP_IS_ATTACKED: Ts.TestCollisionOpIsAttacked = 2;

    const _MUTABLE_KEYS: string[] = [
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

    function _promoteValHelper(pvqal: Ts.PreValidatedQal): Ts.PromotePiecesVal {
      // @ts-ignore
      let rtn: Ts.PromotePiecesVal = _toInt(toAbsVal(pvqal) || _QUEEN_W, _KNIGHT_W, _QUEEN_W);
      return rtn;
    }

    function _pgnResultHelper(str?: string): null | Ts.ManualResult {
      let rtn: null | Ts.ManualResult = null;

      str = String(str || '')
        .replace(/\s/g, '')
        .replace(/o/gi, '0')
        .replace(/½/g, '1/2');

      if (str === _RESULT_ONGOING || str === _RESULT_W_WINS || str === _RESULT_B_WINS || str === _RESULT_DRAW) {
        rtn = str;
      }

      return rtn;
    }

    function _strToValHelper(str: string): Ts.SquareVal {
      let rtn: Ts.SquareVal = _EMPTY_SQR;

      block: {
        if (!str) {
          break block;
        }

        if (!Number.isNaN(Number(str)) && _isIntOrStrInt(str)) {
          // @ts-ignore
          let temp: Ts.SquareVal = _toInt(str, _KING_B, _KING_W);

          rtn = temp;
          break block;
        }

        str = _trimSpaces(str);

        if (/^[pnbrqk]$/i.test(str)) {
          let temp = str.toLowerCase();

          // @ts-ignore
          let temp2: Ts.SquareVal = ('pnbrqk'.indexOf(temp) + 1) * getSign(str === temp);

          rtn = temp2;
          break block;
        }

        let pc_exec = /^([wb])([pnbrqk])$/.exec(str.toLowerCase());

        if (pc_exec) {
          // @ts-ignore
          let temp: Ts.SquareVal = ('pnbrqk'.indexOf(pc_exec[2]) + 1) * getSign(pc_exec[1] === 'b');

          rtn = temp;
          break block;
        }
      }

      return rtn;
    }

    function _strToBosHelper(str: string): null | Ts.SquareBos {
      let rtn: null | Ts.SquareBos = null;

      str = _trimSpaces(str);

      if (str && /^[a-h][1-8]$/i.test(str)) {
        // @ts-ignore
        rtn = str.toLowerCase();
      }

      return rtn;
    }

    function _arrToPosHelper(arr: any[]): null | Ts.SquarePos {
      let rtn: null | Ts.SquarePos = null;

      if (_isArray(arr) && arr.length === 2) {
        let pre_rank_pos = _toInt(arr[0]);
        let pre_file_pos = _toInt(arr[1]);

        if (pre_rank_pos <= 7 && pre_rank_pos >= 0 && pre_file_pos <= 7 && pre_file_pos >= 0) {
          // @ts-ignore
          let rank_pos: Ts.SquareRankPos = pre_rank_pos;
          // @ts-ignore
          let file_pos: Ts.SquareFilePos = pre_file_pos;

          rtn = [rank_pos, file_pos];
        }
      }

      return rtn;
    }

    function _pgnParserHelper(str: string): null | Ts.ParsedResult {
      let rtn: null | Ts.ParsedResult = null;

      block: {
        if (!_isNonBlankStr(str)) {
          break block;
        }

        let meta_tags: Ts.Metatags = {};
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
        let move_list: string[] = [];
        last_index = -1;
        rgxp = /\s+([1-9][0-9]*)*\s*\.*\s*\.*\s*([^\s]+)/g;

        let last_match: string = '';

        while ((mtch = rgxp.exec(g))) {
          last_index = rgxp.lastIndex;
          last_match = mtch[0];
          move_list.push(mtch[2]);
        }

        if (last_index === -1) {
          break block;
        }

        let game_result: Ts.ManualResult = _RESULT_ONGOING;
        let result_last_match: null | Ts.ManualResult = _pgnResultHelper(last_match);

        if (result_last_match) {
          move_list.pop();
          game_result = result_last_match;
        }

        if (meta_tags.Result) {
          let result_meta_tag: null | Ts.ManualResult = _pgnResultHelper(meta_tags.Result);

          if (result_meta_tag) {
            meta_tags.Result = result_meta_tag;
            game_result = result_meta_tag;
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

    function _uciParserHelper(str: string): null | string[] {
      let rtn: null | string[] = null;

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

    function _uciWrapmoveHelper(mov: Ts.Mov): null | Ts.Wrapmove {
      let rtn: null | Ts.Wrapmove = null;

      block: {
        if (!_isNonBlankStr(mov)) {
          break block;
        }

        let temp = _trimSpaces(String(mov));

        if (temp.length !== 4 && temp.length !== 5) {
          break block;
        }

        let pre_from_bos: Ts.PreValidatedQos = _strToBosHelper(temp.slice(0, 2));
        let pre_to_bos: Ts.PreValidatedQos = _strToBosHelper(temp.slice(2, 4));

        if (pre_from_bos === null || pre_to_bos === null) {
          break block;
        }

        // @ts-ignore
        let from_bos: Ts.SquareBos = pre_from_bos;
        // @ts-ignore
        let to_bos: Ts.SquareBos = pre_to_bos;

        let fromTo: Ts.MoveFromTo = [from_bos, to_bos];

        // @ts-ignore
        let possible_promote: Ts.NoLowercasePromotePiecesBal | Ts.LowercasePromotePiecesBal = temp.charAt(4) || '';

        rtn = [fromTo, possible_promote];
      }

      return rtn;
    }

    //p = {delimiter}
    function _joinedWrapmoveHelper(mov: Ts.Mov, p?: Ts.OptionalParam): null | Ts.MoveFromTo {
      let rtn: null | Ts.MoveFromTo = null;

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
        let pre_from_bos: Ts.PreValidatedQos = _strToBosHelper(temp2[0]);
        let pre_to_bos: Ts.PreValidatedQos = _strToBosHelper(temp2[1]);

        if (pre_from_bos === null || pre_to_bos === null) {
          break block;
        }

        // @ts-ignore
        let from_bos: Ts.SquareBos = pre_from_bos;
        // @ts-ignore
        let to_bos: Ts.SquareBos = pre_to_bos;

        let fromTo: Ts.MoveFromTo = [from_bos, to_bos];

        rtn = fromTo;
      }

      return rtn;
    }

    function _fromToWrapmoveHelper(mov: Ts.Mov): null | Ts.MoveFromTo {
      let rtn: null | Ts.MoveFromTo = null;

      block: {
        if (!_isArray(mov)) {
          break block;
        }

        // @ts-ignore
        if (mov.length !== 2) {
          break block;
        }

        if (!isInsideBoard(mov[0]) || !isInsideBoard(mov[1])) {
          break block;
        }

        // @ts-ignore
        let from_bos: Ts.SquareBos = toBos(mov[0]);
        // @ts-ignore
        let to_bos: Ts.SquareBos = toBos(mov[1]);

        let fromTo: Ts.MoveFromTo = [from_bos, to_bos];

        rtn = fromTo;
      }

      return rtn;
    }

    function _moveWrapmoveHelper(mov: Ts.Mov): null | Ts.Wrapmove {
      let rtn: null | Ts.Wrapmove = null;

      block: {
        if (!_isMove(mov)) {
          break block;
        }

        // @ts-ignore
        let possible_promote: Ts.NoLowercasePromotePiecesBal | Ts.LowercasePromotePiecesBal = mov.promotion || '';

        // @ts-ignore
        rtn = [[mov.fromBos, mov.toBos], possible_promote];
      }

      return rtn;
    }

    function _unreferencedMoveHelper(obj: Ts.Move): Ts.Move {
      let rtn: Ts.Move = {};

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

    function _nullboardHelper(board_name: string): Ts.Board {
      let rtn: Ts.Board;

      let pre_rtn: any = getBoard(board_name);

      if (pre_rtn === null) {
        // @ts-ignore
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

        pre_rtn = _BOARDS[board_name];
      }

      pre_rtn.w = {
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

      pre_rtn.b = {
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

      pre_rtn.activeColor = null;
      pre_rtn.nonActiveColor = null;
      pre_rtn.fen = null;
      pre_rtn.enPassantBos = null;
      pre_rtn.halfMove = null;
      pre_rtn.fullMove = null;
      pre_rtn.moveList = null;
      pre_rtn.currentMove = null;
      pre_rtn.isRotated = null;
      pre_rtn.isPuzzleMode = null;
      pre_rtn.checks = null;
      pre_rtn.isCheck = null;
      pre_rtn.isCheckmate = null;
      pre_rtn.isStalemate = null;
      pre_rtn.isThreefold = null;
      pre_rtn.isInsufficientMaterial = null;
      pre_rtn.isFiftyMove = null;
      pre_rtn.inDraw = null;
      pre_rtn.promoteTo = null;
      pre_rtn.manualResult = null;
      pre_rtn.isHidden = null;
      pre_rtn.legalUci = null;
      pre_rtn.legalUciTree = null;
      pre_rtn.legalRevTree = null;
      pre_rtn.squares = {};

      for (let i = 0; i < 8; i++) {
        //0...7
        for (let j = 0; j < 8; j++) {
          //0...7
          // @ts-ignore
          let validated_pos: Ts.SquarePos = [i, j];

          // @ts-ignore
          let validated_bos: Ts.SquareBos = toBos(validated_pos);

          pre_rtn.squares[validated_bos] = {
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

      rtn = pre_rtn;

      return rtn;
    }

    //!---------------- utilities

    function _consoleLog(msg: string, alert_type?: Ts.Alert): boolean {
      let rtn: boolean = false;

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

    function _isObject(obj: any): boolean {
      return typeof obj === 'object' && obj !== null && !_isArray(obj);
    }

    function _isArray(arr: any): boolean {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }

    function _isSquare(obj: any): boolean {
      return _isObject(obj) && typeof obj.bos === 'string';
    }

    function _isBoard(obj: any): boolean {
      return _isObject(obj) && typeof obj.boardName === 'string';
    }

    function _isMove(obj: any): boolean {
      return _isObject(obj) && typeof obj.fromBos === 'string' && typeof obj.toBos === 'string';
    }

    function _trimSpaces(str?: string): string {
      return String(str)
        .replace(/^\s+|\s+$/g, '')
        .replace(/\s\s+/g, ' ');
    }

    function _formatName(str?: string): string {
      return _trimSpaces(str)
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/__+/g, '_');
    }

    function _strContains(str: string, str_to_find: string): boolean {
      return String(str).indexOf(str_to_find) !== -1;
    }

    function _occurrences(str: string, str_rgxp: string): number {
      let rtn: number = 0;

      if (_isNonEmptyStr(str) && _isNonEmptyStr(str_rgxp)) {
        rtn = (str.match(RegExp(str_rgxp, 'g')) || []).length;
      }

      return rtn;
    }

    function _toInt(num: any, min_val?: any, max_val?: any): number {
      num = Number(num) || 0;
      num = num < 0 ? Math.ceil(num) : Math.floor(num);
      min_val = Number(min_val);
      max_val = Number(max_val);

      /*! NO remove default 0, (-0 || 0) = 0*/
      min_val = (Number.isNaN(min_val) ? -Infinity : min_val) || 0;
      max_val = (Number.isNaN(max_val) ? Infinity : max_val) || 0;

      return Math.min(Math.max(num, min_val), max_val);
    }

    function _isIntOrStrInt(num: any): boolean {
      return String(_toInt(num)) === String(num);
    }

    function _isNonEmptyStr(val: any): boolean {
      return !!(typeof val === 'string' && val);
    }

    function _isNonBlankStr(val: any): boolean {
      return !!(typeof val === 'string' && _trimSpaces(val));
    }

    function _hashCode(val: any): number {
      let rtn: number = 0;

      val = _isNonEmptyStr(val) ? val : '';

      for (let i = 0, len = val.length; i < len; i++) {
        //0<len
        rtn = (rtn << 5) - rtn + val.charCodeAt(i);
        rtn |= 0; //to 32bit integer
      }

      return rtn;
    }

    function _castlingChars(num: any): Ts.CastlingRightsStr {
      const castlingChars: Ts.CastlingRightsStr[] = ['', 'k', 'q', 'kq'];
      return castlingChars[_toInt(num, 0, castlingChars.length - 1)];
    }

    function _unreferenceP(p: any, changes?: Ts.ChangesTuple[]): object {
      let rtn: object = _isObject(p) ? { ...p } : {};

      if (_isArray(changes)) {
        for (let i = 0, len = changes!.length; i < len; i++) {
          //0<len
          if (!_isArray(changes?.[i]) || changes?.[i].length !== 2 || !_isNonBlankStr(changes[i][0])) {
            _consoleLog('[_unreferenceP]: unexpected format', _ALERT_ERROR);
            continue;
          }

          rtn[_trimSpaces(changes[i][0])] = changes[i][1];
        }
      }

      return rtn;
    }

    function _cleanSan(rtn: string): string {
      rtn = _isNonBlankStr(rtn) ? rtn : '';

      if (rtn) {
        while (rtn !== (rtn = rtn.replace(/\{[^{}]*\}/g, '\n'))); /*! TODO: keep comment*/
        while (rtn !== (rtn = rtn.replace(/\([^()]*\)/g, '\n')));
        while (rtn !== (rtn = rtn.replace(/\<[^<>]*\>/g, '\n')));

        rtn = rtn.replace(/(\t)|(\r?\n)|(\r\n?)/g, '\n');
        rtn = rtn.replace(/;+[^\n]*(\n|$)/g, '\n'); /*! TODO: keep comment*/

        rtn = rtn
          .replace(/^%.*\n?/gm, '')
          .replace(/^\n+|\n+$/g, '')
          .replace(/\n/g, ' ');

        rtn = rtn.replace(/\$\d+/g, ' '); /*! TODO: keep NAG*/
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

    function _cloneBoardToObj(to_obj: any = {}, from_woard: Ts.Woard): any {
      block: {
        if (!_isObject(to_obj)) {
          _consoleLog('[_cloneBoardToObj]: to_obj must be Object type', _ALERT_ERROR);
          break block;
        }

        let from_board: null | Ts.Board = getBoard(from_woard);

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
          //0<len
          let current_key = _MUTABLE_KEYS[i];
          let to_prop = to_obj[current_key];
          let from_prop = from_board[current_key];

          if (!to_prop && (current_key === 'w' || current_key === 'b' || current_key === 'squares')) {
            // @ts-ignore
            to_obj[current_key] = {};
            to_prop = to_obj[current_key];
          }

          //primitive data type
          if (!_isObject(from_prop) && !_isArray(from_prop)) {
            to_obj[current_key] = from_prop; //can't use to_prop, it's not a reference here
            continue;
          }

          if (current_key === 'legalUci') {
            // @ts-ignore
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

          let sub_keys = Object.keys(from_prop);

          for (let j = 0, len2 = sub_keys.length; j < len2; j++) {
            //0<len2
            let sub_current_key = sub_keys[j];
            let sub_to_prop = to_prop[sub_current_key];
            let sub_from_prop = from_prop[sub_current_key];

            if (!sub_to_prop && current_key === 'squares') {
              to_prop[sub_current_key] = {};
              sub_to_prop = to_prop[sub_current_key];
            }

            //primitive data type
            if (!_isObject(sub_from_prop) && !_isArray(sub_from_prop)) {
              _consoleLog('[_cloneBoardToObj]: unexpected primitive data type', _ALERT_ERROR);
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

            let sub_sub_keys = Object.keys(sub_from_prop);

            if (current_key === 'moveList' || current_key === 'legalRevTree') {
              to_prop[sub_current_key] = {};
              sub_to_prop = to_prop[sub_current_key];
              /*! NO put a "continue" in here*/
            }

            for (let k = 0, len3 = sub_sub_keys.length; k < len3; k++) {
              //0<len3
              let sub_sub_current_key = sub_sub_keys[k];
              //sub_sub_to_prop = sub_to_prop[sub_sub_current_key];
              let sub_sub_from_prop = sub_from_prop[sub_sub_current_key];

              if (current_key === 'legalRevTree') {
                sub_to_prop[sub_sub_current_key] = sub_sub_from_prop.slice(0); //can't use sub_sub_to_prop, it's not a reference here
                continue;
              }

              //object or array data type
              if (_isObject(sub_sub_from_prop) || _isArray(sub_sub_from_prop)) {
                _consoleLog('[_cloneBoardToObj]: unexpected type in key "' + sub_sub_current_key + '"', _ALERT_ERROR);
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

    function _basicFenTest(fen: string): string {
      let rtn_msg: string = '';

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
          //0...7
          let total_files_in_current_rank = 0;
          let last_is_num = false;

          for (let j = 0, len = fen_board_arr[i].length; j < len; j++) {
            //0<len
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

    function _perft(woard: Ts.Woard, depth: number, specific_uci?: Ts.UciMove): number {
      let rtn: number = 1;

      block: {
        if (depth < 1) {
          break block;
        }

        let board: null | Ts.Board = getBoard(woard);

        if (board === null) {
          break block;
        }

        if (board.isPuzzleMode) {
          break block;
        }

        let count = 0;

        for (let i = 0, len = board.legalUci!.length; i < len; i++) {
          //0<len
          if (specific_uci && specific_uci !== board.legalUci![i]) {
            continue;
          }

          if (depth === 1) {
            count++;
          } else {
            board.playMove!(board.legalUci![i], { isLegalMove: true });
            count += _perft(board, depth - 1);
            board.navPrevious!();
          }
        }

        rtn = count;
      }

      return rtn;
    }

    //!---------------- board

    //p = {rankShift, fileShift, isUnreferenced}
    function _getSquare(qos: Ts.Qos, p?: Ts.OptionalParam): null | Ts.Square {
      let that: Ts.Board = this;

      let rtn: null | Ts.Square = null;

      function _squareHelper(my_square: Ts.Square, is_unreferenced: boolean): Ts.Square {
        //uses: that
        let rtn_square: Ts.Square = my_square;

        if (is_unreferenced) {
          rtn_square = {
            pos: toPos(my_square.pos!), //unreference
            bos: my_square.bos,
            rankPos: getRankPos(my_square.pos!),
            filePos: getFilePos(my_square.pos!),
            rankBos: getRankBos(my_square.pos!),
            fileBos: getFileBos(my_square.pos!),
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
        let pre_validated_pos: Ts.PreValidatedSquarePos = [
          temp_pos[0] + _toInt(p.rankShift),
          temp_pos[1] + _toInt(p.fileShift),
        ];

        if (isInsideBoard(pre_validated_pos)) {
          // @ts-ignore
          let validated_pos: Ts.SquarePos = pre_validated_pos;
          rtn = _squareHelper(that!.squares![String(toBos(validated_pos) || '')], p.isUnreferenced);
        }
      }

      return rtn;
    }

    //p = {rankShift, fileShift}
    function _setSquare(qos: Ts.Qos, new_qal: Ts.Qal, p?: Ts.OptionalParam): null | Ts.Square {
      let that: Ts.Board = this;

      let rtn: null | Ts.Square = that?.getSquare?.(qos, _unreferenceP(p, [['isUnreferenced', false]])) || null;

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
          current_side!.kingBos = toBos(qos);
        }
      }

      return rtn;
    }

    function _attackersFromActive(target_qos: Ts.Qos, early_break?: boolean): number {
      let that: Ts.Board = this;

      that?.toggleActiveNonActive?.();
      let rtn_total_attackers: number = that?.attackersFromNonActive?.(target_qos, early_break);
      that?.toggleActiveNonActive?.();

      return rtn_total_attackers;
    }

    function _attackersFromNonActive(target_qos: Ts.Qos, early_break?: boolean): number {
      let that: Ts.Board = this;

      function _isAttacked(qos: Ts.Qos, piece_direction: Ts.Direction, as_knight: boolean): boolean {
        //uses: that

        let rtn_is_attacked: boolean = that?.testCollision?.(
          _TEST_COLLISION_OP_IS_ATTACKED,
          qos,
          piece_direction,
          as_knight,
          0,
          false
        ).isAttacked;

        return rtn_is_attacked;
      }

      let rtn_total_attackers = 0;

      // @ts-ignore
      let active_side: Ts.BlackInfo | Ts.WhiteInfo = that[that!.activeColor];
      // @ts-ignore
      let king_bos: Ts.SquareBos = active_side.kingBos;

      target_qos = target_qos || king_bos;

      outer: for (let i = 0; i < 2; i++) {
        //0...1
        let as_knight = !!i;

        for (let j = _DIRECTION_TOP; j <= _DIRECTION_TOP_LEFT; j++) {
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

    function _toggleActiveNonActive(new_active?: boolean): boolean {
      let that: Ts.Board = this;

      let rtn_changed: boolean = false;

      let temp = typeof new_active === 'boolean' ? new_active : !that[String(that!.activeColor)].isBlack;

      if ((temp ? 'b' : 'w') !== that.activeColor || (!temp ? 'b' : 'w') !== that.nonActiveColor) {
        rtn_changed = true;
        that.activeColor = temp ? 'b' : 'w';
        that.nonActiveColor = !temp ? 'b' : 'w';
      }

      return rtn_changed;
    }

    function _toggleIsRotated(new_is_rotated?: boolean): boolean {
      let that: Ts.Board = this;

      let rtn_changed: boolean = false;

      let temp = typeof new_is_rotated === 'boolean' ? new_is_rotated : !that.isRotated;

      if (temp !== that.isRotated) {
        rtn_changed = true;
        that.isRotated = temp;
        that?.refreshUi?.(0, false); //autorefresh
      }

      return rtn_changed;
    }

    function _setPromoteTo(qal: Ts.Qal): boolean {
      let that: Ts.Board = this;

      let rtn_changed: boolean = false;

      let temp = _promoteValHelper(qal);

      if (temp !== that.promoteTo) {
        rtn_changed = true;
        that.promoteTo = temp;
        that?.refreshUi?.(0, false); //autorefresh
      }

      return rtn_changed;
    }

    function _silentlyResetOptions(): void {
      let that: Ts.Board = this;

      that.isHidden = true; //prevents ui refresh from setPromoteTo()
      that.isRotated = false;
      that?.setPromoteTo?.(_QUEEN_W);
      that.isHidden = false;
    }

    function _silentlyResetManualResult(): void {
      let that: Ts.Board = this;

      let cache_is_hidden = that.isHidden;
      that.isHidden = true;
      that?.setManualResult?.(_RESULT_ONGOING);
      that.isHidden = cache_is_hidden;
    }

    function _setManualResult(str?: string): boolean {
      let that: Ts.Board = this;

      let rtn_changed: boolean = false;

      let temp = _pgnResultHelper(str) || _RESULT_ONGOING;

      if (temp !== that.manualResult) {
        rtn_changed = true;
        that.manualResult = temp;
        that?.refreshUi?.(0, false); //autorefresh
      }

      return rtn_changed;
    }

    function _setCurrentMove(num?, is_goto?, is_puzzle_move?): boolean {
      let that: Ts.Board = this;

      let rtn_changed: boolean = false;

      block: {
        if (that.isPuzzleMode && !is_puzzle_move) {
          break block;
        }

        let len = that!.moveList!.length;

        if (len < 2) {
          break block;
        }

        let that_current_move = Number(that!.currentMove);

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
        }); /*! NO remove skipFenValidation*/

        that?.refreshUi?.(is_goto ? 0 : num, true); //autorefresh
        rtn_changed = true;
      }

      return rtn_changed;
    }

    function _navFirst(): boolean {
      let that: Ts.Board = this;

      return that?.setCurrentMove?.(0); //autorefresh (sometimes)
    }

    function _navPrevious(): boolean {
      let that: Ts.Board = this;

      return that?.setCurrentMove?.(Number(that!.currentMove) - 1); //autorefresh (sometimes)
    }

    function _navNext(): boolean {
      let that: Ts.Board = this;

      return that?.setCurrentMove?.(Number(that!.currentMove) + 1); //autorefresh (sometimes)
    }

    function _navLast(): boolean {
      let that: Ts.Board = this;

      return that?.setCurrentMove?.(Number(that!.moveList!.length) - 1); //autorefresh (sometimes)
    }

    function _navLinkMove(move_index?: number): boolean {
      let that: Ts.Board = this;

      return that?.setCurrentMove?.(move_index); //autorefresh (sometimes)
    }

    //p = {skipFenValidation, keepOptions}
    function _loadFen(fen?, p?: Ts.OptionalParam): boolean {
      let that: Ts.Board = this;

      let rtn_changed: boolean = false;

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
          fen: fen,
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
          that?.refreshUi?.(0, false); //autorefresh
        }
      }

      return rtn_changed;
    }

    function _loadValidatedFen(fen?: string): void {
      let that: Ts.Board = this;

      for (let i = 0; i < 8; i++) {
        //0...7
        for (let j = 0; j < 8; j++) {
          //0...7
          that?.setSquare?.([i, j], _EMPTY_SQR);
        }
      }

      fen = _trimSpaces(fen);
      let fen_parts = fen.split(' ');
      let fen_board_arr = fen_parts[0].split('/');

      for (let i = 0; i < 8; i++) {
        //0...7
        let current_file = 0;

        for (let j = 0, len = fen_board_arr[i].length; j < len; j++) {
          //0<len
          let current_char = fen_board_arr[i].charAt(j);
          let current_num_or_nan = Number(current_char);

          if (!current_num_or_nan) {
            that?.setSquare?.([i, current_file], current_char);
          }

          current_file += current_num_or_nan || 1;
        }
      }

      // @ts-ignore
      let castling_w_rights: Ts.CastlingRights =
        (_strContains(fen_parts[2], 'K') ? _SHORT_CASTLE : 0) + (_strContains(fen_parts[2], 'Q') ? _LONG_CASTLE : 0);
      that!.w!.castling = castling_w_rights;

      // @ts-ignore
      let castling_b_rights: Ts.CastlingRights =
        (_strContains(fen_parts[2], 'k') ? _SHORT_CASTLE : 0) + (_strContains(fen_parts[2], 'q') ? _LONG_CASTLE : 0);
      that!.b!.castling = castling_b_rights;

      // @ts-ignore
      let en_passant_bos: Ts.EnpassantSquareBos = fen_parts[3].replace('-', '');
      that!.enPassantBos = en_passant_bos;

      that?.toggleActiveNonActive?.(fen_parts[1] === 'b');

      that.halfMove = Number(fen_parts[4]) || 0;
      that.fullMove = Number(fen_parts[5]) || 1;
    }

    function _getClocklessFenHelper(): string {
      let that: Ts.Board = this;

      let rtn: string = '';

      let fen_board = '';

      for (let i = 0; i < 8; i++) {
        //0...7
        let consecutive_empty_squares = 0;

        for (let j = 0; j < 8; j++) {
          //0...7
          let current_square: null | Ts.Square = that?.getSquare?.([i, j]);

          if (current_square !== null && !current_square.isEmptySquare) {
            fen_board += (consecutive_empty_squares || '') + (current_square.bal || '');
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

    function _updateFenAndMisc(sliced_fen_history?): void {
      let that: Ts.Board = this;

      that.checks = that?.attackersFromNonActive?.(null);
      that.isCheck = !!that.checks; /*! NO move below legalMovesHelper()*/

      that.legalUci = [];
      that.legalUciTree = {};
      that.legalRevTree = {};

      for (let i = 0; i < 8; i++) {
        //0...7
        for (let j = 0; j < 8; j++) {
          //0...7
          let legal_moves: Ts.LegalMovesHelper = that?.legalMovesHelper?.([i, j]);
          let len = legal_moves.uciMoves.length;

          if (!len) {
            continue;
          }

          // @ts-ignore
          let from_bos: Ts.SquareBos = toBos([i, j]);
          that.legalUciTree[from_bos] = [];

          for (let k = 0; k < len; k++) {
            //0<len
            let uci_move: Ts.UciMove = legal_moves.uciMoves[k];

            if (legal_moves.isPromotion) {
              for (let m = _KNIGHT_W; m <= _QUEEN_W; m++) {
                //2...5

                // @ts-ignore
                let uci_promotion_move: Ts.UciPromotionMove = uci_move + toBal(m).toLowerCase();

                that.legalUci.push(uci_promotion_move);
                that.legalUciTree[from_bos].push(uci_promotion_move);
              }
            } else {
              that.legalUci.push(uci_move);
              that.legalUciTree[from_bos].push(uci_move);
            }

            let to_bos = uci_move.slice(2, 4);

            if (!that.legalRevTree[to_bos]) {
              that.legalRevTree[to_bos] = {};
            }

            if (!that.legalRevTree[to_bos][legal_moves.piece]) {
              that.legalRevTree[to_bos][legal_moves.piece] = [];
            }

            that.legalRevTree[to_bos][legal_moves.piece].push(from_bos);
          }
        }
      }

      that.isCheckmate = that.isCheck && !that.legalUci.length;
      that.isStalemate = !that.isCheck && !that.legalUci.length;

      if (that.enPassantBos) {
        let can_en_passant = false;

        if (that.legalRevTree[that.enPassantBos] && that?.legalRevTree?.[String(that!.enPassantBos)]['p']) {
          can_en_passant = true;
        }

        if (!can_en_passant) {
          that.enPassantBos = ''; //remove inexecutable en passants
        }
      }

      let clockless_fen: string = that?.getClocklessFenHelper?.();
      that.fen = clockless_fen + ' ' + that.halfMove + ' ' + that.fullMove;
      that.isThreefold = false;

      if (sliced_fen_history || (that.moveList && Number(that!.currentMove) > 7 && Number(that!.halfMove) > 7)) {
        let times_found = 1;
        let fen_arr: any[] = sliced_fen_history || that?.fenHistoryExport?.();
        let i = sliced_fen_history ? sliced_fen_history.length - 1 : Number(that!.currentMove) - 1;

        for (; i >= 0; i--) {
          //(len-1)...0
          let fen_parts = fen_arr[i].split(' ');

          if (fen_parts.slice(0, 4).join(' ') === clockless_fen) {
            times_found++;

            if (times_found > 2) {
              that.isThreefold = true;
              break;
            }
          }

          if (fen_parts[4] === '0') {
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
          that.isInsufficientMaterial = total_pieces.w.n + total_pieces.b.n + total_pieces.w.b + total_pieces.b.b === 1; //k vs kn
        } else if (total_pieces.w.b + total_pieces.b.b) {
          let bishop_count: Ts.ColorBishopCounts = that?.countLightDarkBishops?.();

          let at_least_one_light = !!(bishop_count.w.lightSquaredBishops + bishop_count.b.lightSquaredBishops);
          let at_least_one_dark = !!(bishop_count.w.darkSquaredBishops + bishop_count.b.darkSquaredBishops);

          that.isInsufficientMaterial = at_least_one_light !== at_least_one_dark; //k(b*x) vs k(b*x)
        } else {
          //k vs k
          that.isInsufficientMaterial = true;
        }
      }

      that.isFiftyMove = Number(that!.halfMove) >= 100;

      that.inDraw =
        !that.isCheckmate && (that.isStalemate || that.isThreefold || that.isInsufficientMaterial || that.isFiftyMove);

      that.w!.materialDiff = [];
      that.b!.materialDiff = [];

      for (let i = _PAWN_W; i <= _KING_W; i++) {
        //1...6
        let piece_bal: Ts.SquareBal = toBal(-i);
        let current_diff = total_pieces.w[piece_bal] - total_pieces.b[piece_bal];

        for (let j = 0, len = Math.abs(current_diff); j < len; j++) {
          //0<len
          if (current_diff > 0) {
            let w_piece_val: Ts.WPiecesVal = i;
            that.w!.materialDiff.push(w_piece_val);
          } else {
            // @ts-ignore
            let b_piece_val: Ts.BPiecesVal = -i;
            that.b!.materialDiff.push(b_piece_val);
          }
        }
      }
    }

    function _refinedFenTest(): string {
      let that: Ts.Board = this;

      let rtn_msg: string = '';

      block: {
        let active_side: Ts.WhiteInfo | Ts.BlackInfo = that[String(that!.activeColor)];
        let non_active_side: Ts.WhiteInfo | Ts.BlackInfo = that[String(that!.nonActiveColor)];

        if (Number(that!.halfMove) - Number(active_side.isBlack) + 1 >= Number(that!.fullMove) * 2) {
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
          let en_passant_square: Ts.Square = that?.getSquare?.(that.enPassantBos);

          let infront_ep_is_empty: Ts.Square = that?.getSquare?.(en_passant_square, {
            rankShift: active_side.singlePawnRankShift,
          }).isEmptySquare;

          let behind_ep_val: Ts.SquareVal = that?.getSquare?.(en_passant_square, {
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

        let total_pieces = countPieces(String(that.fen));
        let bishop_count: Ts.ColorBishopCounts = that?.countLightDarkBishops?.();

        for (let i = 0; i < 2; i++) {
          //0...1
          let current_side = i ? total_pieces.b : total_pieces.w;
          let current_other_side = i ? total_pieces.w : total_pieces.b;
          let current_bishop_count = i ? bishop_count.b : bishop_count.w;

          //if(current_side.k!==1){...} done in _basicFenTest

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

        let fen_board = that!.fen!.split(' ')[0];

        for (let i = 0; i < 2; i++) {
          //0...1
          let current_side = i ? that.b : that.w;
          let min_captured = 0;

          for (let j = 0; j < 8; j++) {
            //0...7
            let total_pawns_in_current_file = 0;

            for (let k = 0; k < 8; k++) {
              //0...7
              total_pawns_in_current_file += Number(that?.getSquare?.([k, j]).val === current_side!.pawn);
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
          //0...1
          let current_side = i ? that.b : that.w;

          if (!current_side!.castling) {
            continue;
          }

          let temp = {
            completeActiveColor: i ? 'black' : 'white',
            originalKingBos: i ? 'e8' : 'e1',
            originalLongRookBos: i ? 'a8' : 'a1',
            originalShortRookBos: i ? 'h8' : 'h1',
          };

          if (that?.getSquare?.(temp.originalKingBos).val !== current_side!.king) {
            rtn_msg = 'Error [11] ' + temp.completeActiveColor + ' castling rights without king in original square';
            break block;
          }

          if (
            current_side!.castling !== _LONG_CASTLE &&
            that?.getSquare?.(temp.originalShortRookBos).val !== current_side!.rook
          ) {
            rtn_msg = 'Error [12] ' + temp.completeActiveColor + ' short castling rights with missing H-file rook';
            break block;
          }

          if (
            current_side!.castling !== _SHORT_CASTLE &&
            that?.getSquare?.(temp.originalLongRookBos).val !== current_side!.rook
          ) {
            rtn_msg = 'Error [13] ' + temp.completeActiveColor + ' long castling rights with missing A-file rook';
            break block;
          }
        }
      }

      return rtn_msg;
    }

    function _testCollision(
      op: Ts.TestCollisionOp,
      initial_qos: Ts.Qos,
      piece_direction: Ts.Direction,
      as_knight: boolean,
      max_shifts: number,
      allow_capture: boolean
    ): Ts.TestCollision {
      let that: Ts.Board = this;

      let rtn: Ts.TestCollision = {
        candidateMoves: [],
        isAttacked: false,
      };

      let active_side: Ts.WhiteInfo | Ts.BlackInfo = that[String(that!.activeColor)];

      // @ts-ignore
      piece_direction = _toInt(piece_direction, 1, 8);

      max_shifts = _toInt(as_knight ? 1 : max_shifts || 7);

      let rank_change = (as_knight ? [-2, -1, 1, 2, 2, 1, -1, -2] : [-1, -1, 0, 1, 1, 1, 0, -1])[piece_direction - 1];
      let file_change = (as_knight ? [1, 2, 2, 1, -1, -2, -2, -1] : [0, 1, 1, 1, 0, -1, -1, -1])[piece_direction - 1];

      for (let i = 0; i < max_shifts; i++) {
        //0<max_shifts
        let current_square: Ts.Square = that?.getSquare?.(initial_qos, {
          rankShift: rank_change * (i + 1),
          fileShift: file_change * (i + 1),
        });

        if (current_square === null) {
          break;
        }

        if (current_square.isEmptySquare) {
          if (op === 1) {
            // @ts-ignore
            rtn.candidateMoves.push(current_square.bos);
          }

          continue;
        }

        if (current_square.sign === active_side.sign) {
          break;
        }

        if (op === 1) {
          if (allow_capture && !current_square.isKing) {
            // @ts-ignore
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
            if (Number(current_square.sign) > 0) {
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

    function _legalMovesHelper(target_qos: Ts.Qos): Ts.LegalMovesHelper {
      let that: Ts.Board = this;

      let rtn: Ts.LegalMovesHelper = {
        uciMoves: [],
        piece: '',
        isPromotion: false,
      };

      function _candidateMoves(
        qos: Ts.Qos,
        piece_direction: Ts.Direction,
        as_knight: boolean,
        max_shifts: number,
        allow_capture: boolean
      ): Ts.SquareBos[] {
        //uses: that

        let rtn_candidate_moves: Ts.SquareBos[] = that?.testCollision?.(
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
        let target_cached_square: Ts.Square = that?.getSquare?.(target_qos, {
          isUnreferenced: true,
        });

        if (target_cached_square === null) {
          break block;
        }

        let active_side: Ts.WhiteInfo | Ts.BlackInfo = that[String(that!.activeColor)];
        let non_active_side: Ts.WhiteInfo | Ts.BlackInfo = that[String(that!.nonActiveColor)];

        if (target_cached_square.isEmptySquare || target_cached_square.sign === non_active_side.sign) {
          break block;
        }

        let pseudo_legal_arr: any[] = [];
        let en_passant_capturable_cached_square: null | Ts.Square = null;
        let is_promotion = false;

        // @ts-ignore
        let lc_piece: Ts.NoLowercasePieceBal | Ts.LowercasePieceBal = (target_cached_square.bal || '').toLowerCase();
        rtn.piece = lc_piece;

        // @ts-ignore
        let en_passant_bos: Ts.PreValidatedQos = that!.enPassantBos;

        if (target_cached_square.isKing) {
          for (let i = _DIRECTION_TOP; i <= _DIRECTION_TOP_LEFT; i++) {
            //1...8
            let king_candidate_moves: Ts.SquareBos[] = _candidateMoves(target_cached_square, i, false, 1, true);

            if (king_candidate_moves.length) {
              pseudo_legal_arr.push(king_candidate_moves);
            }
          }

          if (active_side.castling && !that.isCheck) {
            for (let i = 0; i < 2; i++) {
              //0...1
              let current_shift = {
                castleToSkip: i ? _SHORT_CASTLE : _LONG_CASTLE,
                direction: i ? _DIRECTION_LEFT : _DIRECTION_RIGHT,
                consecutiveEmpty: i ? 3 : 2,
                singleFileShift: i ? -1 : 1,
              };

              if (active_side.castling === current_shift.castleToSkip) {
                continue;
              }

              if (
                _candidateMoves(
                  target_cached_square,
                  current_shift.direction,
                  false,
                  current_shift.consecutiveEmpty,
                  false
                ).length !== current_shift.consecutiveEmpty
              ) {
                continue;
              }

              if (
                that?.attackersFromNonActive?.(
                  that?.getSquare?.(target_cached_square, { fileShift: current_shift.singleFileShift }),
                  true
                )
              ) {
                continue;
              }

              let shifted_square: Ts.Square = that?.getSquare?.(target_cached_square, {
                fileShift: current_shift.singleFileShift * 2,
              });

              pseudo_legal_arr.push([shifted_square]);
            }
          }
        } else if (target_cached_square.isPawn) {
          //any move played from pawns that are one square away from promotion will always cause a promotion
          is_promotion = target_cached_square.rankPos === non_active_side.secondRankPos;

          let pawn_candidate_moves: Ts.SquareBos[] = _candidateMoves(
            target_cached_square,
            active_side.isBlack ? _DIRECTION_BOTTOM : _DIRECTION_TOP,
            false,
            target_cached_square.rankPos === active_side.secondRankPos ? 2 : 1,
            false
          );

          if (pawn_candidate_moves.length) {
            pseudo_legal_arr.push(pawn_candidate_moves);
          }

          for (let i = 0; i < 2; i++) {
            //0...1
            let current_diagonal_square: null | Ts.Square = that?.getSquare?.(target_cached_square, {
              rankShift: active_side.singlePawnRankShift,
              fileShift: i ? -1 : 1,
            });

            if (current_diagonal_square === null) {
              continue;
            }

            let is_same_square = sameSquare(current_diagonal_square, en_passant_bos);

            if (
              is_same_square ||
              (current_diagonal_square.sign !== active_side.sign &&
                !current_diagonal_square.isEmptySquare &&
                !current_diagonal_square.isKing)
            ) {
              pseudo_legal_arr.push([current_diagonal_square]);
            }

            if (is_same_square) {
              en_passant_capturable_cached_square = that?.getSquare?.(current_diagonal_square, {
                rankShift: non_active_side.singlePawnRankShift,
                isUnreferenced: true,
              });
            }
          }
        } else {
          //knight, bishop, rook, queen
          let piece_directions: Ts.Direction[] = [];
          if (!target_cached_square.isBishop) {
            piece_directions.push(1, 3, 5, 7);
          }
          if (!target_cached_square.isRook) {
            piece_directions.push(2, 4, 6, 8);
          }

          for (let i = 0, len = piece_directions.length; i < len; i++) {
            //0<len
            let rest_candidate_moves: Ts.SquareBos[] = _candidateMoves(
              target_cached_square,
              piece_directions[i],
              !!target_cached_square.isKnight,
              0,
              true
            );

            if (rest_candidate_moves.length) {
              pseudo_legal_arr.push(rest_candidate_moves);
            }
          }
        }

        for (let i = 0, len = pseudo_legal_arr.length; i < len; i++) {
          //0<len
          for (let j = 0, len2 = pseudo_legal_arr[i].length; j < len2; j++) {
            //0<len2
            let current_cached_square: Ts.Square = that?.getSquare?.(pseudo_legal_arr[i][j], {
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
              // @ts-ignore
              let uci_move: Ts.UciMove = target_cached_square.bos + current_cached_square.bos;
              rtn.uciMoves.push(uci_move);
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

    //p = {returnType, squareType, delimiter}
    function _legalMoves(target_qos: Ts.Qos, p?: Ts.OptionalParam): any[] {
      let that: Ts.Board = this;

      let rtn: any[] = [];

      p = _unreferenceP(p);

      block: {
        let pre_legal_uci_in_bos = that?.legalUciTree?.[toBos(target_qos) || ''];

        if (!pre_legal_uci_in_bos || !pre_legal_uci_in_bos.length) {
          break block;
        }

        // @ts-ignore
        let legal_uci_in_bos: Ts.UciMove[] = pre_legal_uci_in_bos;

        legal_uci_in_bos = legal_uci_in_bos.slice(0);
        p.returnType = _isNonEmptyStr(p.returnType) ? p.returnType : 'toSquare';
        p.squareType = _isNonEmptyStr(p.squareType) ? p.squareType : 'bos';
        p.delimiter = _isNonEmptyStr(p.delimiter) ? p.delimiter.charAt(0) : '-';

        if (p.returnType === 'uci') {
          rtn = legal_uci_in_bos;
          break block;
        }

        let mov: any[] = [];
        let used_keys = {};
        let is_fen_or_san = p.returnType === 'fen' || p.returnType === 'san';

        for (let i = 0, len = legal_uci_in_bos.length; i < len; i++) {
          //0<len
          let temp2 = legal_uci_in_bos[i];

          if (is_fen_or_san) {
            let temp3 = that?.playMove?.(temp2, { isMockMove: true, isLegalMove: true, isUnreferenced: true });

            if (p.returnType === 'fen') {
              let fen_move: string = temp3.fen;
              mov.push(fen_move);
            } else {
              //type "san"
              let san_move: string = temp3.san;
              mov.push(san_move);
            }

            continue;
          }

          // @ts-ignore
          let from_bos: Ts.SquareBos = temp2.slice(0, 2);
          // @ts-ignore
          let to_bos: Ts.SquareBos = temp2.slice(2, 4);

          if (used_keys[to_bos]) {
            continue;
          }

          used_keys[to_bos] = true;

          if (p.returnType === 'joined') {
            let joined_move: string = from_bos + p.delimiter + to_bos;
            mov.push(joined_move);
          } else if (p.returnType === 'fromToSquares') {
            if (p.squareType === 'square') {
              let from_square: Ts.Square = that?.getSquare?.(from_bos, { isUnreferenced: true });
              let to_square: Ts.Square = that?.getSquare?.(to_bos, { isUnreferenced: true });

              let square_move_from_to: Ts.MoveFromTo = [from_square, to_square];
              mov.push(square_move_from_to);
            } else if (p.squareType === 'pos') {
              // @ts-ignore
              let from_pos: Ts.SquarePos = toPos(from_bos);
              // @ts-ignore
              let to_pos: Ts.SquarePos = toPos(to_bos);

              let pos_move_from_to: Ts.MoveFromTo = [from_pos, to_pos];
              mov.push(pos_move_from_to);
            } else {
              //type "bos"
              let bos_move_from_to: Ts.MoveFromTo = [from_bos, to_bos];
              mov.push(bos_move_from_to);
            }
          } else {
            //type "toSquare"
            if (p.squareType === 'square') {
              let to_square: Ts.Square = that?.getSquare?.(to_bos, { isUnreferenced: true });
              mov.push(to_square);
            } else if (p.squareType === 'pos') {
              // @ts-ignore
              let to_pos: Ts.SquarePos = toPos(to_bos);
              mov.push(to_pos);
            } else {
              //type "bos"
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

    function _legalFenMoves(target_qos: Ts.Qos) {
      let that: Ts.Board = this;

      return that?.legalMoves?.(target_qos, { returnType: 'fen' });
    }

    function _legalSanMoves(target_qos: Ts.Qos) {
      let that: Ts.Board = this;

      return that?.legalMoves?.(target_qos, { returnType: 'san' });
    }

    function _legalUciMoves(target_qos: Ts.Qos) {
      let that: Ts.Board = this;

      return that?.legalMoves?.(target_qos, { returnType: 'uci' });
    }

    //p = {delimiter}
    function _isLegalMove(mov?: Ts.Mov, p?: Ts.OptionalParam): boolean {
      let that: Ts.Board = this;

      let rtn: boolean = false;

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

        //can't easily use arr.indexOf(str) because the uci promotion char
        /*! NO use overcomplicated legalRevTree*/
        rtn = _strContains(legal_uci_in_bos.join(','), wrapped_move.fromBos + '' + wrapped_move.toBos);
      }

      return rtn;
    }

    function _getCheckmateMoves(early_break?: boolean): Ts.UciMove[] {
      let that: Ts.Board = this;

      let rtn: Ts.UciMove[] = [];

      outer: for (let i = 0, len = that!.legalUci!.length; i < len; i++) {
        //0<len
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

    function _getDrawMoves(early_break?: boolean): Ts.UciMove[] {
      let that: Ts.Board = this;

      let rtn: Ts.UciMove[] = [];

      outer: for (let i = 0, len = that!.legalUci!.length; i < len; i++) {
        //0<len
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

    function _fenHistoryExport(): string[] {
      let that: Ts.Board = this;

      let rtn: string[] = [];

      for (let i = 0, len = that!.moveList!.length; i < len; i++) {
        //0<len
        rtn.push(String(that?.moveList?.[i]?.fen));
      }

      return rtn;
    }

    function _pgnExport(): string {
      let that: Ts.Board = this;

      let rtn: string = '';

      /*! TODO p options: remove comments, max line len, tag white-list*/

      block: {
        let move_list: undefined | null | Ts.Move[] = that.moveList;

        if (!move_list?.length) {
          _consoleLog('[_pgnExport]: board without move zero', _ALERT_ERROR);
          break block;
        }

        let header: any = _unreferenceP({}); /*! TODO header from _pgnParserHelper()*/

        let initial_fen = move_list[0].fen || '';
        let black_starts = move_list[0].colorToPlay === 'b';

        let that_current_move = Number(that!.currentMove);
        let that_full_move = Number(that!.fullMove);

        let initial_full_move =
          that_full_move -
          Math.floor((that_current_move + Number(black_starts) - 1) / 2) +
          Number(black_starts === !(that_current_move % 2)) -
          1;

        let result_tag_ow: Ts.ManualResult = _RESULT_ONGOING;
        let text_game = '';

        for (let i = 0, len = move_list.length; i < len; i++) {
          //0<len
          if (i) {
            let current_move = initial_full_move + Math.floor((i + Number(black_starts) - 1) / 2);

            text_game += i !== 1 ? ' ' : '';
            text_game += move_list[i - 1].comment && black_starts === !!(i % 2) ? current_move + '...' : '';
            text_game += black_starts === !(i % 2) ? current_move + '. ' : '';
            text_game += move_list[i].san;

            if (move_list[i].comment) {
              text_game += ' ' + move_list[i].comment;
            }
          }

          if (move_list[i].moveResult) {
            // @ts-ignore
            result_tag_ow = move_list[i].moveResult;
          }
        }

        if (result_tag_ow === _RESULT_ONGOING) {
          if (move_list[move_list.length - 1].canDraw) {
            result_tag_ow = _RESULT_DRAW;
          }
        }

        if (that.manualResult !== _RESULT_ONGOING) {
          // @ts-ignore
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

        let ordered_tags: [string, string][] = [
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

        for (let i = 0, len = ordered_tags.length; i < len; i++) {
          //0<len
          rtn += '[' + ordered_tags[i][0] + ' "' + ordered_tags[i][1] + '"]\n';
        }

        rtn += '\n' + text_game;
      }

      return rtn;
    }

    function _uciExport(): string {
      let that: Ts.Board = this;

      let rtn: string = '';

      let uci_arr: Ts.UciMove[] = [];

      for (let i = 1, len = that!.moveList!.length; i < len; i++) {
        //1<len
        // @ts-ignore
        uci_arr.push(String(that?.moveList?.[i]?.uci));
      }

      if (uci_arr.length) {
        rtn = uci_arr.join(' ');
      }

      return rtn;
    }

    function _ascii(is_rotated?): string {
      let that: Ts.Board = this;

      let rtn: string = '   +------------------------+\n';

      let bottom_label = '';
      is_rotated = typeof is_rotated === 'boolean' ? is_rotated : that.isRotated;

      for (let i = 0; i < 8; i++) {
        //0...7
        for (let j = 0; j < 8; j++) {
          //0...7
          let current_square: Ts.Square = that?.getSquare?.(is_rotated ? [7 - i, 7 - j] : [i, j]);

          rtn += j ? '' : ' ' + current_square.rankBos + ' |';
          rtn += ' ' + (current_square.bal || '').replace('*', '.') + ' ';
          rtn += j === 7 ? '|\n' : '';

          bottom_label += i === j ? '  ' + current_square.fileBos : '';
        }
      }

      rtn += '   +------------------------+\n';
      rtn += '   ' + bottom_label + '\n';

      return rtn;
    }

    function _boardHash(): number {
      let that: Ts.Board = this;

      let temp = '';

      for (let i = 0, len = _MUTABLE_KEYS.length; i < len; i++) {
        //0<len
        temp += JSON.stringify(that[_MUTABLE_KEYS[i]]);
      }

      return _hashCode(temp);
    }

    function _isEqualBoard(to_woard: Ts.Woard): boolean {
      let that: Ts.Board = this;

      let rtn: boolean = false;

      block: {
        let to_board: null | Ts.Board = getBoard(to_woard);

        if (to_board === null) {
          _consoleLog("[_isEqualBoard]: to_woard doesn't exist", _ALERT_ERROR);
          break block;
        }

        rtn = that === to_board || that?.boardHash?.() === to_board?.boardHash?.();
      }

      return rtn;
    }

    function _cloneBoardFrom(from_woard: Ts.Woard): boolean {
      let that: Ts.Board = this;

      let rtn_changed: boolean = false;

      let hash_cache = that?.boardHash?.();

      _cloneBoardToObj(that, from_woard);

      if (that?.boardHash?.() !== hash_cache) {
        rtn_changed = true;
        that?.refreshUi?.(0, false); //autorefresh
      }

      return rtn_changed;
    }

    function _cloneBoardTo(to_woard: Ts.Woard): boolean {
      let that: Ts.Board = this;

      let rtn_changed: boolean = false;

      block: {
        let to_board: null | Ts.Board = getBoard(to_woard);

        if (to_board === null) {
          _consoleLog("[_cloneBoardTo]: to_woard doesn't exist", _ALERT_ERROR);
          break block;
        }

        let hash_cache = to_board?.boardHash?.();

        _cloneBoardToObj(to_board, that);

        if (to_board?.boardHash?.() !== hash_cache) {
          rtn_changed = true;
          to_board?.refreshUi?.(0, false); //autorefresh
        }
      }

      return rtn_changed;
    }

    function _reset(keep_options?): boolean {
      let that: Ts.Board = this;

      let rtn: boolean = that?.loadFen?.(_DEFAULT_FEN, {
        skipFenValidation: true,
        keepOptions: keep_options,
      });

      return rtn;
    }

    function _undoMove(): null | Ts.Move {
      let that: Ts.Board = this;

      let rtn: null | Ts.Move = null;

      block: {
        let temp = that?.undoMoves?.(1);

        if (temp.length !== 1) {
          break block;
        }

        rtn = temp[0];
      }

      return rtn;
    }

    function _undoMoves(decrease_by?): null | Ts.Move[] {
      let that: Ts.Board = this;

      let rtn: null | Ts.Move[] = [];

      block: {
        if (that.isPuzzleMode) {
          break block;
        }

        if (Number(that!.moveList!.length) < 2) {
          break block;
        }

        if (!decrease_by && decrease_by !== 0) {
          //both 0 and -0
          decrease_by = Infinity;
        }

        decrease_by = _toInt(decrease_by, 0, Number(that!.moveList!.length) - 1);

        if (!decrease_by) {
          break block;
        }

        let hash_cache = that?.boardHash?.();
        let cache_is_hidden = that.isHidden;
        that!.isHidden = true;
        that?.navLinkMove?.(Math.min(Number(that!.moveList!.length) - decrease_by - 1, Number(that!.currentMove)));
        that.isHidden = cache_is_hidden;

        rtn = new Array(decrease_by); //safe to use because every spot will be assigned below

        for (let i = 0; i < decrease_by; i++) {
          //0<decrease_by
          // @ts-ignore
          let move: Ts.Move = that!.moveList?.[Number(that!.moveList!.length) - i - 1];
          rtn[decrease_by - i - 1] = _unreferencedMoveHelper(move);
        }

        that.moveList = that!.moveList!.slice(0, -decrease_by);

        if (that?.boardHash?.() !== hash_cache) {
          that?.silentlyResetManualResult?.();
          that?.refreshUi?.(0, false); //autorefresh
        }
      }

      return rtn;
    }

    function _countLightDarkBishops(): Ts.ColorBishopCounts {
      let that: Ts.Board = this;

      let rtn: Ts.ColorBishopCounts = {
        w: { lightSquaredBishops: 0, darkSquaredBishops: 0 },
        b: { lightSquaredBishops: 0, darkSquaredBishops: 0 },
      };

      for (let i = 0; i < 8; i++) {
        //0...7
        for (let j = 0; j < 8; j++) {
          //0...7
          let current_square: Ts.Square = that?.getSquare?.([i, j]);

          if (current_square.isBishop) {
            let current_side: Ts.BishopCounts = Number(current_square.sign) > 0 ? rtn.w : rtn.b;

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

    function _updateHelper(obj?): boolean {
      let that: Ts.Board = this;

      let rtn: boolean = false;

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
          let temp: Ts.MoveResult = '';

          if (that.isCheckmate) {
            temp = that[String(that!.activeColor)].isBlack ? _RESULT_W_WINS : _RESULT_B_WINS;
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

    function _fenWrapmoveHelper(mov?): null | Ts.Wrapmove {
      let that: Ts.Board = this;

      let rtn: null | Ts.Wrapmove = null;

      block: {
        let parsed_promote: Ts.NoLowercasePromotePiecesBal | Ts.LowercasePromotePiecesBal = '';

        if (!_isNonBlankStr(mov)) {
          break block;
        }

        let silent_mode_cache = _SILENT_MODE;
        setSilentMode(true);
        let obj = fenGet(mov, 'squares activeColor');
        setSilentMode(silent_mode_cache);

        if (!obj || that.activeColor === obj.activeColor) {
          break block;
        }

        let from_squares: Ts.SquareBos[] = [];
        let to_squares: Ts.SquareBos[] = [];

        for (let i = 0; i < 8; i++) {
          //0...7
          for (let j = 0; j < 8; j++) {
            //0...7
            // @ts-ignore
            let current_bos: Ts.SquareBos = Ic.toBos([i, j]);

            let current_old_square: Ts.Square = that?.getSquare?.(current_bos);
            let current_new_square: Ts.Square = obj.squares[current_bos]; //can't use getSquare()

            if (current_old_square.val === current_new_square.val) {
              continue;
            }

            if (current_new_square.val === 0) {
              //piece disappearing
              //this excludes enpassant capture
              //can't be 0 here (no problem with inverted logic >0 being <=0)
              if (Number(current_old_square.val) > 0 === (that.activeColor === 'w')) {
                from_squares.push(current_bos);
              }
            } else {
              //piece overwriting
              //this excludes enemy piece changes in ally turn and wrong color promotion
              //can't be 0 here (no problem with inverted logic >0 being <=0)
              if (Number(current_new_square.val) > 0 === (that.activeColor === 'w')) {
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
          let is_long_castle = _strContains(from_squares.join(''), 'a');
          let king_rank_bos: Ts.SquareRankBos = that.activeColor === 'w' ? '1' : '8';

          // @ts-ignore
          let to_bos: Ts.SquareBos = (is_long_castle ? 'c' : 'g') + king_rank_bos;
          to_squares = [to_bos];

          // @ts-ignore
          let from_bos: Ts.SquareBos = 'e' + king_rank_bos;
          from_squares = [from_bos];
        }

        if (from_squares.length !== 1 || to_squares.length !== 1) {
          break block;
        }

        let pre_old_square: null | Ts.Square = that?.getSquare?.(from_squares[0]);

        if (pre_old_square === null) {
          break block;
        }

        let old_square: Ts.Square = pre_old_square;

        let pre_new_square: undefined | Ts.Square = obj.squares[to_squares[0]]; //can't use getSquare()

        if (!pre_new_square) {
          //this might be undefined but never null (is not a getSquare() return)
          break block;
        }

        let new_square: Ts.Square = pre_new_square;

        if (old_square.val !== new_square.val) {
          // @ts-ignore
          parsed_promote = new_square.bal || '';
        }

        // @ts-ignore
        rtn = [[old_square.bos, new_square.bos], parsed_promote];
      }

      return rtn;
    }

    function _sanWrapmoveHelper(mov?): null | Ts.Wrapmove {
      let that: Ts.Board = this;

      let rtn: null | Ts.Wrapmove = null;

      block: {
        let validated_move: null | Ts.MoveFromTo = null;
        let parsed_promote: Ts.NoLowercasePromotePiecesBal | Ts.LowercasePromotePiecesBal = '';
        mov = (' ' + mov).replace(/^\s+([1-9][0-9]*)*\s*\.*\s*\.*\s*/, '');

        if (!_isNonBlankStr(mov)) {
          break block;
        }

        let lc_piece: Ts.NoLowercasePieceBal | Ts.LowercasePieceBal = '';
        let to_bos: Ts.NoSquareBos | null | Ts.SquareBos = '';
        mov = _cleanSan(mov);

        if (/^[a-h]/.exec(mov)) {
          //pawn move
          lc_piece = 'p';
          let pawn_parse_exec = /([^=]+)=(.?).*$/.exec(mov);

          if (pawn_parse_exec) {
            mov = pawn_parse_exec[1];
            // @ts-ignore
            parsed_promote = pawn_parse_exec[2];
          }

          to_bos = toBos(mov.slice(-2));
        } else if (mov === 'O-O') {
          //castling king (short)
          lc_piece = 'k';
          to_bos = that[String(that!.activeColor)].isBlack ? 'g8' : 'g1';
        } else if (mov === 'O-O-O') {
          //castling king (long)
          lc_piece = 'k';
          to_bos = that[String(that!.activeColor)].isBlack ? 'c8' : 'c1';
        } else {
          let parse_exec = /^[NBRQK]/.exec(mov);

          if (parse_exec) {
            //knight, bishop, rook, queen, non-castling king
            // @ts-ignore
            lc_piece = parse_exec[0].toLowerCase();
            to_bos = toBos(mov.slice(-2));
          }
        }

        if (!lc_piece || !to_bos) {
          break block;
        }

        let temp: undefined | Ts.RevTreeChild = that?.legalRevTree?.[to_bos];

        if (!temp) {
          break block;
        }

        let bos_moves: undefined | Ts.SquareBos[] = temp[lc_piece];

        if (!bos_moves) {
          break block;
        }

        outer: for (let i = 0, len = bos_moves.length; i < len; i++) {
          //0<len
          let pgn_obj: Ts.DraftMove = that?.draftMove?.([bos_moves[i], to_bos], {
            isLegalMove: true,
          }); /*! NO pass unnecessary promoteTo*/

          if (!pgn_obj.canMove) {
            continue;
          }

          for (let j = 0, len2 = Number(pgn_obj?.withOverdisambiguated?.length); j < len2; j++) {
            //0<len2
            if (pgn_obj?.withOverdisambiguated && mov !== pgn_obj.withOverdisambiguated[j]) {
              continue;
            }

            validated_move = [bos_moves[i], to_bos];
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
    function _getWrappedMove(mov?, p?: Ts.OptionalParam): null | Ts.WrappedMove {
      let that: Ts.Board = this;

      let rtn: null | Ts.WrappedMove = null;

      let move_from_to: null | Ts.MoveFromTo = null;
      let bubbling_promoted_to: Ts.NoLowercasePromotePiecesBal | Ts.LowercasePromotePiecesBal = '';
      let is_confirmed_legal = false;

      block: {
        let res_uci: null | Ts.Wrapmove = _uciWrapmoveHelper(mov);

        if (res_uci) {
          bubbling_promoted_to = res_uci[1]; //default ""
          move_from_to = res_uci[0];
          break block;
        }

        let res_joined: null | Ts.MoveFromTo = _joinedWrapmoveHelper(mov, p);

        if (res_joined) {
          move_from_to = res_joined;
          break block;
        }

        let res_from_to: null | Ts.MoveFromTo = _fromToWrapmoveHelper(mov);

        if (res_from_to) {
          move_from_to = res_from_to;
          break block;
        }

        let res_move: null | Ts.Wrapmove = _moveWrapmoveHelper(mov);

        if (res_move) {
          bubbling_promoted_to = res_move[1]; //default ""
          move_from_to = res_move[0];
          break block;
        }

        let res_fen: null | Ts.Wrapmove = that?.fenWrapmoveHelper?.(mov);

        if (res_fen) {
          bubbling_promoted_to = res_fen[1]; //default ""
          move_from_to = res_fen[0];
          break block;
        }

        let res_san: null | Ts.Wrapmove = that?.sanWrapmoveHelper?.(mov); //place last for better performance

        if (res_san) {
          bubbling_promoted_to = res_san[1]; //default ""
          is_confirmed_legal = true;
          move_from_to = res_san[0];
          break block;
        }
      }

      if (move_from_to !== null) {
        let promotion_abs_val = toAbsVal(bubbling_promoted_to) || that.promoteTo || _QUEEN_W; /*! NO remove toAbsVal()*/

        // @ts-ignore
        let from_bos: Ts.SquareBos = move_from_to[0];
        // @ts-ignore
        let to_bos: Ts.SquareBos = move_from_to[1];

        rtn = {
          fromBos: from_bos,
          toBos: to_bos,
          promotion: _promoteValHelper(promotion_abs_val),
          isConfirmedLegalMove: is_confirmed_legal,
        };
      }

      return rtn;
    }

    //p = {promoteTo, delimiter, isLegalMove}
    function _draftMove(mov?, p?: Ts.OptionalParam): Ts.DraftMove {
      let that: Ts.Board = this;

      let rtn: Ts.DraftMove = {};

      p = _unreferenceP(p);

      block: {
        rtn.canMove = false;
        p.isLegalMove = p.isLegalMove === true;
        let wrapped_move: null | Ts.WrappedMove = that?.getWrappedMove?.(mov, p);

        if (wrapped_move === null) {
          break block;
        }

        if (wrapped_move.isConfirmedLegalMove) {
          p.isLegalMove = true;
        }

        if (!p.isLegalMove && !that?.isLegalMove?.(wrapped_move.fromBos + '' + wrapped_move.toBos)) {
          break block;
        }

        rtn.canMove = true;

        let bubbling_promoted_to: Ts.PromotePiecesVal = _promoteValHelper(
          toAbsVal(p.promoteTo) || wrapped_move.promotion
        ); /*! NO remove toAbsVal()*/

        let initial_cached_square: Ts.Square = that?.getSquare?.(wrapped_move.fromBos, {
          isUnreferenced: true,
        });

        let final_cached_square: Ts.Square = that?.getSquare?.(wrapped_move.toBos, {
          isUnreferenced: true,
        });

        rtn.initialCachedSquare = initial_cached_square;
        rtn.finalCachedSquare = final_cached_square;
        let active_side: Ts.WhiteInfo | Ts.BlackInfo = that[String(that!.activeColor)];
        let non_active_side: Ts.WhiteInfo | Ts.BlackInfo = that[String(that!.nonActiveColor)];

        let pawn_moved = false;
        let is_en_passant_capture = false;
        let new_en_passant_bos: Ts.SquareBos = '';
        let promoted_val: Ts.SquareVal = 0;
        let king_castled: Ts.CastlingRights = 0;

        // @ts-ignore
        let lc_captured: Ts.LowercasePieceBal = (final_cached_square.bal || '').replace('*', '').toLowerCase();

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

          if (Math.abs(Number(initial_cached_square.rankPos) - Number(final_cached_square.rankPos)) > 1) {
            //new enpassant
            new_en_passant_bos = that?.getSquare?.(final_cached_square, {
              rankShift: non_active_side.singlePawnRankShift,
            }).bos;
          } else if (sameSquare(final_cached_square, String(that!.enPassantBos))) {
            //enpassant capture
            lc_captured = 'p';
            is_en_passant_capture = true;

            rtn.enPassantCaptureAtRankShift = non_active_side.singlePawnRankShift;
          } else if (final_cached_square.rankPos === active_side.lastRankPos) {
            //promotion
            // @ts-ignore
            let new_promoted_val: Ts.SquareVal = bubbling_promoted_to * active_side.sign;
            promoted_val = new_promoted_val;
          }
        }

        let partial_san = '';
        let with_overdisambiguated: string[] = [];

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
          let is_ambiguous = false;
          let extra_file_bos: null | Ts.NoSquareBos | Ts.SquareFileBos = '';
          let extra_rank_bos: null | Ts.NoSquareBos | Ts.SquareRankBos = '';

          if (!initial_cached_square.isKing) {
            //knight, bishop, rook, queen
            let legal_rev_tree: undefined | Ts.RevTreeChild = that?.legalRevTree?.[final_cached_square.bos || ''];

            if (legal_rev_tree) {
              let bos_moves: Ts.SquareBos[] = legal_rev_tree[(initial_cached_square.bal || '').toLowerCase()];

              if (bos_moves?.length > 1) {
                is_ambiguous = true;
                let bos_csv_list = bos_moves.join(',');

                if (_occurrences(bos_csv_list, initial_cached_square.fileBos || '') > 1) {
                  extra_rank_bos = initial_cached_square.rankBos;
                }

                if (_occurrences(bos_csv_list, initial_cached_square.rankBos || '') > 1) {
                  extra_file_bos = initial_cached_square.fileBos;
                }
              }
            }
          }

          let temp = initial_cached_square.absBal || ''; //it should never empty though
          let temp2 = (final_cached_square.isEmptySquare ? '' : 'x') + final_cached_square.bos;

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
    function _playMove(mov?, p?: Ts.OptionalParam, sliced_fen_history?): null | Ts.Move {
      let that: Ts.Board = this;

      let rtn_move_obj: null | Ts.Move = null;

      p = _unreferenceP(p);

      block: {
        p.isMockMove = p.isMockMove === true;
        p.isInanimated = p.isInanimated === true;
        p.playSounds = p.playSounds === true;
        p.isUnreferenced = p.isUnreferenced === true;

        // @ts-ignore
        let that_movelist: Ts.Move[] = that!.moveList;

        if (that.isPuzzleMode) {
          let max_current_move_possible = that_movelist.length - 1;

          if (Number(that.currentMove) < max_current_move_possible) {
            let wrapped_move: null | Ts.WrappedMove = that?.getWrappedMove?.(mov, p);

            if (
              wrapped_move !== null &&
              (p.isLegalMove || wrapped_move.isConfirmedLegalMove || that?.isLegalMove?.(mov, p))
            ) {
              let is_promotion = !!that_movelist[Number(that.currentMove) + 1].promotion;
              let mov_uci =
                wrapped_move.fromBos +
                '' +
                wrapped_move.toBos +
                '' +
                (is_promotion ? toBal(wrapped_move.promotion).toLowerCase() : '');

              if (mov_uci === that_movelist[Number(that.currentMove) + 1].uci) {
                let on_solve_out_of_bounds = Number(that.currentMove) + 2 > max_current_move_possible;

                if (p.isMockMove) {
                  rtn_move_obj = on_solve_out_of_bounds
                    ? that_movelist[max_current_move_possible]
                    : that_movelist[Number(that.currentMove) + 2];
                } else {
                  if (p.isInanimated && on_solve_out_of_bounds) {
                    that?.setCurrentMove?.(max_current_move_possible, true, true);
                  } else {
                    that?.setCurrentMove?.(2, false, true);
                  }
                  rtn_move_obj = that_movelist[Number(that.currentMove)];
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
          if (that_movelist) {
            sliced_fen_history = that?.fenHistoryExport?.().slice(0, Number(that.currentMove) + 1);
          }

          rtn_move_obj = fenApply(that.fen, 'playMove', [mov, p, sliced_fen_history], {
            promoteTo: that.promoteTo,
            skipFenValidation: true,
          });

          break block;
        }

        let pgn_obj: Ts.DraftMove = that?.draftMove?.(mov, p);

        if (!pgn_obj.canMove) {
          break block;
        }

        let active_side: Ts.WhiteInfo | Ts.BlackInfo = that[String(that!.activeColor)];
        let non_active_side: Ts.WhiteInfo | Ts.BlackInfo = that[String(that!.nonActiveColor)];

        // @ts-ignore
        let initial_cached_square: Ts.Square = pgn_obj.initialCachedSquare;
        // @ts-ignore
        let final_cached_square: Ts.Square = pgn_obj.finalCachedSquare;

        if (pgn_obj.activeSideCastlingZero) {
          active_side.castling = 0;
        }

        if (pgn_obj.putRookAtFileShift) {
          that?.setSquare?.(final_cached_square, active_side.rook, {
            fileShift: pgn_obj.putRookAtFileShift,
          });
        }

        if (pgn_obj.removeRookAtFileShift) {
          that?.setSquare?.(final_cached_square, _EMPTY_SQR, {
            fileShift: pgn_obj.removeRookAtFileShift,
          });
        }

        if (pgn_obj.enPassantCaptureAtRankShift) {
          that?.setSquare?.(final_cached_square, _EMPTY_SQR, {
            rankShift: pgn_obj.enPassantCaptureAtRankShift,
          });
        }

        for (let i = 0; i < 2; i++) {
          //0...1
          let current_side: Ts.WhiteInfo | Ts.BlackInfo = i ? active_side : non_active_side;
          let current_square: Ts.Square = i ? initial_cached_square : final_cached_square;

          if (current_side.castling && current_square.isRook) {
            let current_rank_bos: Ts.SquareRankBos = current_side.isBlack ? '8' : '1';

            if (
              current_side.castling !== _LONG_CASTLE &&
              sameSquare(current_square, that?.getSquare?.('h' + current_rank_bos))
            ) {
              current_side.castling -= _SHORT_CASTLE;
            } else if (
              current_side.castling !== _SHORT_CASTLE &&
              sameSquare(current_square, that?.getSquare?.('a' + current_rank_bos))
            ) {
              current_side.castling -= _LONG_CASTLE;
            }
          }
        }

        // @ts-ignore
        that.enPassantBos = pgn_obj.newEnPassantBos;

        that?.setSquare?.(final_cached_square, pgn_obj.promotedVal || initial_cached_square.val);
        that?.setSquare?.(initial_cached_square, _EMPTY_SQR);
        that?.toggleActiveNonActive?.();

        // @ts-ignore
        that.halfMove++;
        if (pgn_obj.pawnMoved || final_cached_square.val) {
          that.halfMove = 0;
        }

        if (active_side.isBlack) {
          //active_side is toggled
          // @ts-ignore
          that.fullMove++;
        }

        that?.updateHelper?.({
          currentMove: Number(that.currentMove) + 1,
          slicedFenHistory: sliced_fen_history,
        });

        let complete_san = pgn_obj.partialSan || '';
        let move_res: Ts.MoveResult = '';

        if (that.isCheckmate) {
          complete_san += '#';
          move_res = non_active_side.isBlack ? _RESULT_W_WINS : _RESULT_B_WINS; //non_active_side is toggled
        } else if (that.isStalemate) {
          move_res = _RESULT_DRAW;
        } else if (that.isCheck) {
          //check but not checkmate
          complete_san += '+';
        }

        let autogen_comment = '';

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

        // @ts-ignore
        let lc_piece: Ts.NoLowercasePieceBal | Ts.LowercasePieceBal = (initial_cached_square.bal || '')
          .replace('*', '')
          .toLowerCase();

        // @ts-ignore
        let promotion_bal: Ts.NoLowercasePromotePiecesBal | Ts.LowercasePromotePiecesBal = (
          toBal(pgn_obj.promotedVal || 0) || ''
        )
          .replace('*', '')
          .toLowerCase();

        // @ts-ignore
        let uci_move: Ts.UciMove = initial_cached_square.bos + '' + final_cached_square.bos + '' + promotion_bal;

        if (Number(that.currentMove) !== that_movelist.length) {
          that.moveList = that_movelist.slice(0, Number(that.currentMove));
          that_movelist = that.moveList;
        }

        that_movelist.push({
          colorMoved: that.nonActiveColor,
          colorToPlay: that.activeColor,
          fen: that.fen,
          san: complete_san,
          uci: uci_move,
          fromBos: initial_cached_square.bos,
          toBos: final_cached_square.bos,
          enPassantBos: that.enPassantBos,
          piece: lc_piece,
          captured: pgn_obj.captured,
          promotion: promotion_bal,
          comment: autogen_comment,
          moveResult: move_res,
          canDraw: that.inDraw,
          isEnPassantCapture: pgn_obj.isEnPassantCapture,
        });

        rtn_move_obj = that_movelist[that_movelist.length - 1];

        if (p.isUnreferenced) {
          rtn_move_obj = _unreferencedMoveHelper(rtn_move_obj);
        }

        that?.silentlyResetManualResult?.();
        that?.refreshUi?.(p.isInanimated ? 0 : 1, p.playSounds); //autorefresh
      }

      return rtn_move_obj;
    }

    //p = {isMockMove, promoteTo, delimiter, isLegalMove, isInanimated, playSounds}
    function _playMoves(arr?, p?: Ts.OptionalParam, sliced_fen_history?): boolean {
      let that: Ts.Board = this;

      let rtn: boolean = false;

      let p_cache: Ts.OptionalParam = _unreferenceP(p, [['isUnreferenced', false]]);
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
          //0<len
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
        that?.refreshUi?.(p_cache.isInanimated ? 0 : 1, p_cache.playSounds); //autorefresh
      }

      return rtn;
    }

    //p = {isMockMove, promoteTo, isInanimated, playSounds, isUnreferenced}
    function _playRandomMove(p?: Ts.OptionalParam, sliced_fen_history?): null | Ts.Move {
      let that: Ts.Board = this;

      let rtn: null | Ts.Move = null;

      p = _unreferenceP(p, [['isLegalMove', true]]);

      block: {
        let uci_moves = that!.legalUci!.slice(0);

        //when there is a promotion overwrite (promoteTo), we should collapse them
        //into one move in order to keep the correct distribution of probabilities
        if (toVal(p.promoteTo)) {
          uci_moves = [];
          let used_keys = {};

          for (let i = 0, len = that!.legalUci!.length; i < len; i++) {
            //0<len
            // @ts-ignore
            let uci_without_promotion: Ts.UciMove = that.legalUci[i].slice(0, 4);

            if (used_keys[uci_without_promotion]) {
              continue;
            }

            used_keys[uci_without_promotion] = true;
            uci_moves.push(uci_without_promotion);
          }
        }

        if (!uci_moves.length) {
          break block;
        }

        rtn = that?.playMove?.(uci_moves[Math.floor(Math.random() * uci_moves.length)], p, sliced_fen_history);
      }

      return rtn;
    }

    //!---------------- board (using IcUi)

    function _refreshUi(animation_type?, play_sounds?): void {
      let that: Ts.Board = this;

      if (_WIN?.IcUi?.refreshUi) {
        _WIN.IcUi.refreshUi.apply(that, [animation_type, play_sounds]);
      }
    }

    //!---------------- ic

    class getChainableBoard {
      public board: Ts.Board;
      public stack: any[];

      constructor(woard: Ts.Woard) {
        let board: null | Ts.Board = getBoard(woard);

        if (board === null) {
          // @ts-ignore
          let new_board: Ts.Board = initBoard({
            ...(typeof woard === 'string' && { boardName: woard }),
          });

          this.board = new_board;
        } else {
          this.board = board;
        }

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

    function setSilentMode(val?): void {
      _SILENT_MODE = !!val;
    }

    function isLegalFen(fen?): boolean {
      return !!fenApply(fen, 'isLegalFen');
    }

    function getBoard(woard: Ts.Woard): null | Ts.Board {
      let rtn: null | Ts.Board = null;

      block: {
        if (_isBoard(woard)) {
          // @ts-ignore
          rtn = woard;
          break block;
        }

        if (_isNonEmptyStr(woard)) {
          // @ts-ignore
          woard = _formatName(woard);

          if (woard && _BOARDS[woard]) {
            // @ts-ignore
            rtn = _BOARDS[woard];
            break block;
          }
        }
      }

      return rtn;
    }

    function toVal(pvqal: Ts.PreValidatedQal): Ts.SquareVal {
      let rtn: Ts.SquareVal = _EMPTY_SQR;

      if (typeof pvqal === 'string') {
        rtn = _strToValHelper(pvqal);
      } else if (typeof pvqal === 'number') {
        // @ts-ignore
        rtn = _toInt(pvqal, _KING_B, _KING_W);
      } else if (_isSquare(pvqal)) {
        // @ts-ignore
        let validated_val: Ts.SquareVal = _toInt(pvqal.val, _KING_B, _KING_W);
        rtn = validated_val;
      }

      return rtn;
    }

    function toAbsVal(pvqal: Ts.PreValidatedQal): Ts.SquareAbsVal {
      // @ts-ignore
      let rtn: Ts.SquareAbsVal = Math.abs(toVal(pvqal));
      return rtn;
    }

    function toBal(pvqal: Ts.PreValidatedQal): Ts.SquareBal {
      let val: Ts.SquareVal = toVal(pvqal);

      let abs_val: Ts.SquareAbsVal = toAbsVal(pvqal);

      const ARR_ABS_BAL: Ts.SquareAbsBal[] = ['*', 'P', 'N', 'B', 'R', 'Q', 'K']; //deprecate asterisk character as _occurrences() might use RegExp("*", "g") if not cautious
      let abs_bal: Ts.SquareAbsBal = ARR_ABS_BAL[abs_val];

      // @ts-ignore
      let rtn: Ts.SquareBal = val === abs_val ? abs_bal : abs_bal.toLowerCase();

      return rtn;
    }

    function toAbsBal(pvqal: Ts.PreValidatedQal): Ts.SquareAbsBal {
      // @ts-ignore
      let validated_abs_bal: Ts.SquareAbsBal = toBal(toAbsVal(pvqal));
      return validated_abs_bal;
    }

    function toClassName(pvqal: Ts.PreValidatedQal): Ts.SquareClassName {
      let piece_bal: Ts.SquareBal = toBal(pvqal);

      // @ts-ignore
      let validated_abs_bal: Ts.SquareAbsBal = piece_bal.toUpperCase();

      // @ts-ignore
      let validated_class_name: Ts.SquareClassName =
        piece_bal !== '*' ? (piece_bal === validated_abs_bal ? 'w' : 'b') + validated_abs_bal.toLowerCase() : '';

      return validated_class_name;
    }

    function toBos(pvqos: Ts.PreValidatedQos): null | Ts.SquareBos {
      let rtn: null | Ts.SquareBos = null;

      if (_isArray(pvqos)) {
        // @ts-ignore
        let temp = _arrToPosHelper(pvqos);

        if (temp !== null) {
          // @ts-ignore
          let bos: Ts.SquareBos = 'abcdefgh'.charAt(temp[1]) + '' + (8 - temp[0]);
          rtn = bos;
        }
      } else if (typeof pvqos === 'string') {
        rtn = _strToBosHelper(pvqos);
      } else if (_isSquare(pvqos)) {
        // @ts-ignore
        rtn = _strToBosHelper(pvqos.bos);
      }

      return rtn;
    }

    function toPos(pvqos: Ts.PreValidatedQos): null | Ts.SquarePos {
      let rtn: null | Ts.SquarePos = null;

      if (typeof pvqos === 'string') {
        let temp = _strToBosHelper(pvqos);
        if (temp !== null) {
          // @ts-ignore
          rtn = [8 - Number(temp.charAt(1)), 'abcdefgh'.indexOf(temp.charAt(0))];
        }
      } else if (_isArray(pvqos)) {
        // @ts-ignore
        rtn = _arrToPosHelper(pvqos);
      } else if (_isSquare(pvqos)) {
        // @ts-ignore
        let validated_pos: Ts.SquarePos = pvqos.pos;
        rtn = _arrToPosHelper(validated_pos);
      }

      return rtn;
    }

    function getSign(pvzal: Ts.PreValidatedZal): Ts.Sign {
      return (typeof pvzal === 'boolean' ? !pvzal : toVal(pvzal) > 0) ? 1 : -1;
    }

    function getRankPos(pvqos: Ts.PreValidatedQos): null | Ts.SquareRankPos {
      let rtn: null | Ts.SquareRankPos = null;

      let pos = toPos(pvqos);

      if (pos !== null) {
        rtn = pos[0];
      }

      return rtn;
    }

    function getFilePos(pvqos: Ts.PreValidatedQos): null | Ts.SquareFilePos {
      let rtn: null | Ts.SquareFilePos = null;

      let pos = toPos(pvqos);

      if (pos !== null) {
        rtn = pos[1];
      }

      return rtn;
    }

    function getRankBos(pvqos: Ts.PreValidatedQos): null | Ts.SquareRankBos {
      let rtn: null | Ts.SquareRankBos = null;

      let bos = toBos(pvqos);

      if (bos !== null) {
        // @ts-ignore
        let validated_rank_bos: Ts.SquareRankBos = bos.charAt(1);
        rtn = validated_rank_bos;
      }

      return rtn;
    }

    function getFileBos(pvqos: Ts.PreValidatedQos): null | Ts.SquareFileBos {
      let rtn: null | Ts.SquareFileBos = null;

      let bos = toBos(pvqos);

      if (bos !== null) {
        // @ts-ignore
        let validated_file_bos: Ts.SquareFileBos = bos.charAt(0);
        rtn = validated_file_bos;
      }

      return rtn;
    }

    function isInsideBoard(pvqos: Ts.PreValidatedQos): boolean {
      let rtn: boolean = false;

      if (typeof pvqos === 'string') {
        rtn = _strToBosHelper(pvqos) !== null;
      } else if (_isArray(pvqos)) {
        // @ts-ignore
        rtn = _arrToPosHelper(pvqos) !== null;
      } else {
        rtn = _isSquare(pvqos);
      }

      return rtn;
    }

    function sameSquare(pvqos1: Ts.PreValidatedQos, pvqos2: Ts.PreValidatedQos): boolean {
      let rtn: boolean = false;

      pvqos1 = toBos(pvqos1);
      pvqos2 = toBos(pvqos2);

      if (pvqos1 !== null && pvqos2 !== null) {
        rtn = pvqos1 === pvqos2;
      }

      return rtn;
    }

    function countPieces(fen: string): Ts.ColorPieceCounts {
      let rtn: Ts.ColorPieceCounts = {
        w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
        b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
      };

      if (_isNonBlankStr(fen)) {
        let fen_board = _trimSpaces(fen).split(' ')[0];

        for (let i = _PAWN_W; i <= _KING_W; i++) {
          //1...6
          for (let j = 0; j < 2; j++) {
            //0...1
            let current_side: Ts.PieceCounts = j ? rtn.w : rtn.b;
            current_side[toBal(-i)] = _occurrences(fen_board, toBal(i * getSign(!j)));
          }
        }
      }

      return rtn;
    }

    function removeBoard(woard: Ts.Woard): boolean {
      let rtn: boolean = false;

      let del_board: null | Ts.Board = getBoard(woard);

      if (del_board !== null) {
        //if exists
        rtn = true;
        let del_board_name_cache = String(del_board!.boardName);
        del_board = null;
        _BOARDS[del_board_name_cache] = null;

        delete _BOARDS[del_board_name_cache];

        /*! TODO ui problem: autorefresh when removing loaded board. EDIT: can't easily select a non-hidden board*/
      }

      return rtn;
    }

    function isEqualBoard(left_woard: Ts.Woard, right_woard: Ts.Woard): boolean {
      let rtn: boolean = false;

      block: {
        let left_board: null | Ts.Board = getBoard(left_woard);

        if (left_board === null) {
          _consoleLog("[isEqualBoard]: left_woard doesn't exist", _ALERT_ERROR);
          break block;
        }

        rtn = left_board?.isEqualBoard?.(right_woard);
      }

      return rtn;
    }

    function cloneBoard(to_woard: Ts.Woard, from_woard: Ts.Woard): boolean {
      let rtn: boolean = false;

      block: {
        let to_board: null | Ts.Board = getBoard(to_woard);

        if (to_board === null) {
          _consoleLog("[cloneBoard]: to_woard doesn't exist", _ALERT_ERROR);
          break block;
        }

        rtn = to_board?.cloneBoardFrom?.(from_woard); //autorefresh (sometimes)
      }

      return rtn;
    }

    //p = {boardName, fen, pgn, uci, moveIndex, isRotated, isPuzzleMode, skipFenValidation, isHidden, promoteTo, manualResult, validOrBreak}
    function initBoard(p?: Ts.OptionalParam): null | Ts.Board {
      let rtn: null | Ts.Board = null;

      p = _unreferenceP(p);
      let board_created = false;
      let finished_block = false;

      let new_board: undefined | Ts.Board;

      block: {
        p.boardName = _isNonBlankStr(p.boardName)
          ? _formatName(p.boardName)
          : 'b_' + ((new Date().getTime() + '').slice(-10) + '' + Math.random().toString(36).slice(2, 7)).slice(-10);

        let board_name = p.boardName;
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

        let fen_was_valid = p.skipFenValidation || !_basicFenTest(p.fen);

        if (p.validOrBreak && !fen_was_valid) {
          _consoleLog('[initBoard]: "' + board_name + '" bad FEN', _ALERT_ERROR);
          break block;
        }

        new_board = _nullboardHelper(board_name);
        board_created = true;
        new_board.isHidden = true;
        let valid_fen = fen_was_valid ? p.fen : _DEFAULT_FEN;

        new_board.updateHelper({
          currentMove: 0,
          fen: valid_fen,
          skipFenValidation: true,
          resetMoveList: true,
        }); /*! NO remove skipFenValidation*/

        let postfen_was_valid = p.skipFenValidation || !new_board.refinedFenTest();

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
          }); /*! NO remove skipFenValidation*/
        }

        if (p.pgn) {
          let everything_parsed_pgn = new_board.playMoves(p.pgn.sanMoves); /*! NO p.validOrBreak short-circuit*/

          if (p.validOrBreak && !everything_parsed_pgn) {
            _consoleLog('[initBoard]: "' + board_name + '" bad PGN', _ALERT_ERROR);
            break block;
          } else {
            if (p.pgn.result !== _RESULT_ONGOING) {
              p.manualResult = _pgnResultHelper(p.manualResult) || p.pgn.result;
            }
          }
        } else if (p.uci) {
          let everything_parsed_uci = new_board.playMoves(p.uci); /*! NO p.validOrBreak short-circuit*/

          if (p.validOrBreak && !everything_parsed_uci) {
            _consoleLog('[initBoard]: "' + board_name + '" bad UCI', _ALERT_ERROR);
            break block;
          }
        }

        p.moveIndex = _isIntOrStrInt(p.moveIndex) ? p.moveIndex : new_board.moveList.length - 1;
        new_board.setCurrentMove(p.moveIndex, true); /*! NO move below isPuzzleMode*/
        new_board.isRotated = p.isRotated;
        new_board.isPuzzleMode = p.isPuzzleMode;
        new_board.setPromoteTo(p.promoteTo);
        new_board.setManualResult(p.manualResult);
        new_board.isHidden = p.isHidden;
        new_board.refreshUi(0, false); //autorefresh
        rtn = new_board;

        finished_block = true;
      }

      if (new_board !== undefined && board_created && !finished_block) {
        removeBoard(new_board);
      }

      return rtn;
    }

    //p = {isRotated, promoteTo, skipFenValidation}
    function fenApply(fen?, fn_name?, args?, p?: Ts.OptionalParam): any {
      let rtn: any = null;

      args = _isArray(args) ? args : [];
      p = _unreferenceP(p);

      let silent_mode_cache = _SILENT_MODE;

      fn_name = _isNonBlankStr(fn_name) ? _formatName(fn_name) : 'isLegalFen';

      if (fn_name === 'isLegalFen') {
        setSilentMode(true);
      }

      let board = initBoard({
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

    //p = {skipFenValidation}
    function fenGet(fen?, props?, p?: Ts.OptionalParam): any {
      let rtn: any = null;

      p = _unreferenceP(p);

      let board_created = false;
      let board_name = 'board_fenGet';

      block: {
        let board = initBoard({
          boardName: board_name,
          fen: fen,
          skipFenValidation: p.skipFenValidation,
          isHidden: true,
          validOrBreak: true,
        });

        if (board === null) {
          _consoleLog('[fenGet]: invalid FEN', _ALERT_ERROR);
          break block;
        }

        board = _cloneBoardToObj({ boardName: board_name + '_copy' }, board);

        if (board === null) {
          _consoleLog('[fenGet]: unexpected cloned board', _ALERT_ERROR);
          break block;
        }

        board_created = true;
        let board_keys: any[] = [];

        if (_isArray(props)) {
          board_keys = props;
        } else if (_isNonBlankStr(props)) {
          board_keys = _trimSpaces(props).split(' ');
        }

        if (!board_keys.length) {
          board_keys = _MUTABLE_KEYS.slice(0);
        }

        let rtn_pre = {};

        for (let i = 0, len = board_keys.length; i < len; i++) {
          //0<len
          let current_key = _formatName(board_keys[i]);

          if (current_key && !rtn_pre[current_key]) {
            let invalid_key = true;

            for (let j = 0, len2 = _MUTABLE_KEYS.length; j < len2; j++) {
              //0<len2
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
        removeBoard(board_name); //this removes the temporal board (the copy of the temporal board doesn't need removal)
      }

      return rtn;
    }

    function getBoardNames(): string[] {
      return Object.keys(_BOARDS);
    }

    function Ic(woard: Ts.Woard): any {
      return new getChainableBoard(woard);
    }

    Ic.version = _VERSION;
    Ic.setSilentMode = setSilentMode;
    Ic.isLegalFen = isLegalFen;
    Ic.getBoard = getBoard;
    Ic.toVal = toVal;
    Ic.toAbsVal = toAbsVal;
    Ic.toBal = toBal;
    Ic.toAbsBal = toAbsBal;
    Ic.toClassName = toClassName;
    Ic.toBos = toBos;
    Ic.toPos = toPos;
    Ic.getSign = getSign;
    Ic.getRankPos = getRankPos;
    Ic.getFilePos = getFilePos;
    Ic.getRankBos = getRankBos;
    Ic.getFileBos = getFileBos;
    Ic.isInsideBoard = isInsideBoard;
    Ic.sameSquare = sameSquare;
    Ic.countPieces = countPieces;
    Ic.removeBoard = removeBoard;
    Ic.isEqualBoard = isEqualBoard;
    Ic.cloneBoard = cloneBoard;
    Ic.initBoard = initBoard;
    Ic.fenApply = fenApply;
    Ic.fenGet = fenGet;
    Ic.getBoardNames = getBoardNames;
    Ic.utilityMisc = {
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

    return Ic;
  })(windw);

  //Browser
  if (windw !== null && windw !== undefined) {
    if (!windw['Ic']) {
      windw['Ic'] = Ic;
    }
  }

  //Node.js or any CommonJS
  if (expts !== null && expts !== undefined) {
    if (!expts['Ic']) {
      expts['Ic'] = Ic;
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
