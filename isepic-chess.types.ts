/** Copyright (c) 2025 Ajax Isepic (ajax333221) Licensed MIT */

export type SquareRankPos = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type SquareFilePos = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type SquareRankBos = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type SquareFileBos = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export type NoSquareBos = '';
export type SquarePos = [SquareRankPos, SquareFilePos];
export type SquareBos = NoSquareBos | `${SquareFileBos}${SquareRankBos}`;

export type PreValidatedSquarePos = [number, number];
export type PreValidatedSquareBos = string;

export type EmptyBal = '*';
export type WpBal = 'P';
export type BpBal = 'p';
export type WnBal = 'N';
export type BnBal = 'n';
export type WbBal = 'B';
export type BbBal = 'b';
export type WrBal = 'R';
export type BrBal = 'r';
export type WqBal = 'Q';
export type BqBal = 'q';
export type WkBal = 'K';
export type BkBal = 'k';

export type WPiecesBal = WpBal | WnBal | WbBal | WrBal | WqBal | WkBal;
export type BPiecesBal = BpBal | BnBal | BbBal | BrBal | BqBal | BkBal;

export type NoLowercasePromotePiecesBal = '';
export type LowercasePromotePiecesBal = BnBal | BbBal | BrBal | BqBal;
export type NoLowercasePieceBal = '';
export type LowercasePieceBal = BPiecesBal;

export type SquareAbsBal = EmptyBal | WPiecesBal;
export type SquareBal = SquareAbsBal | BPiecesBal;

export type PreValidatedSquareBal = string;

export type EmptyVal = 0;
export type WpVal = 1;
export type BpVal = -1;
export type WnVal = 2;
export type BnVal = -2;
export type WbVal = 3;
export type BbVal = -3;
export type WrVal = 4;
export type BrVal = -4;
export type WqVal = 5;
export type BqVal = -5;
export type WkVal = 6;
export type BkVal = -6;

export type WPiecesVal = WpVal | WnVal | WbVal | WrVal | WqVal | WkVal;
export type BPiecesVal = BpVal | BnVal | BbVal | BrVal | BqVal | BkVal;

export type PromotePiecesVal = WnVal | WbVal | WrVal | WqVal;

export type SquareAbsVal = EmptyVal | WPiecesVal;
export type SquareVal = SquareAbsVal | BPiecesVal;

export type PreValidatedSquareVal = number;

export type WhiteSign = 1;
export type BlackSign = -1;
export type Sign = WhiteSign | BlackSign;

export type NoSquareClassName = '';
export type WhiteColor = 'w';
export type BlackColor = 'b';
export type Color = WhiteColor | BlackColor;
export type SquareClassName =
  | NoSquareClassName
  | `${WhiteColor}${LowercasePieceBal}`
  | `${BlackColor}${LowercasePieceBal}`;

export interface Square {
  pos: null | SquarePos;
  bos: null | SquareBos;
  rankPos: null | SquareRankPos;
  filePos: null | SquareFilePos;
  rankBos: null | SquareRankBos;
  fileBos: null | SquareFileBos;
  bal: null | SquareBal;
  absBal: null | SquareAbsBal;
  val: null | SquareVal;
  absVal: null | SquareAbsVal;
  className: null | SquareClassName;
  sign: null | Sign;
  isEmptySquare: null | boolean;
  isPawn: null | boolean;
  isKnight: null | boolean;
  isBishop: null | boolean;
  isRook: null | boolean;
  isQueen: null | boolean;
  isKing: null | boolean;
}

export type SquareMap = Partial<{
  [key in SquareBos]: null | Square;
}>;

export type WhiteEnpassantRankBos = '3';
export type BlackEnpassantRankBos = '6';

export type WhiteEnpassantSquareBos = `${SquareFileBos}${WhiteEnpassantRankBos}`;
export type BlackEnpassantSquareBos = `${SquareFileBos}${BlackEnpassantRankBos}`;

export type EnpassantSquareBos = NoSquareBos | WhiteEnpassantSquareBos | BlackEnpassantSquareBos;

export type NoMoveResult = '';
export type OngoingResult = '*';
export type WhiteWinsResult = '1-0';
export type BlackWinsResult = '0-1';
export type DrawResult = '1/2-1/2';

export type MoveResult = NoMoveResult | WhiteWinsResult | BlackWinsResult | DrawResult;
export type ManualResult = OngoingResult | WhiteWinsResult | BlackWinsResult | DrawResult;

export type NoCastlingRights = 0;
export type ShortCastle = 1;
export type LongCastle = 2;
export type BothCastlingRights = 3;

export type CastlingRights = NoCastlingRights | ShortCastle | LongCastle | BothCastlingRights;

export type NoCastlingRightsStr = '';
export type ShortCastleStr = 'k';
export type LongCastleStr = 'q';
export type BothCastlingRightsStr = 'kq';

export type CastlingRightsStr = NoCastlingRightsStr | ShortCastleStr | LongCastleStr | BothCastlingRightsStr;

export type TrueOnly = true;
export type FalseOnly = false;

export type StringLenOne = string & { length: 1 };

export type NumberZero = 0;
export type NumberOne = 1;
export type NumberSix = 6;
export type NumberSeven = 7;

export interface WhiteInfo {
  isBlack: FalseOnly;
  sign: WhiteSign;
  firstRankPos: NumberSeven;
  secondRankPos: NumberSix;
  lastRankPos: NumberZero;
  singlePawnRankShift: BlackSign;
  pawn: WpVal;
  knight: WnVal;
  bishop: WbVal;
  rook: WrVal;
  queen: WqVal;
  king: WkVal;
  kingBos: null | SquareBos;
  castling: null | CastlingRights;
  materialDiff: null | WPiecesVal[];
}

export interface BlackInfo {
  isBlack: TrueOnly;
  sign: BlackSign;
  firstRankPos: NumberZero;
  secondRankPos: NumberOne;
  lastRankPos: NumberSeven;
  singlePawnRankShift: WhiteSign;
  pawn: BpVal;
  knight: BnVal;
  bishop: BbVal;
  rook: BrVal;
  queen: BqVal;
  king: BkVal;
  kingBos: null | SquareBos;
  castling: null | CastlingRights;
  materialDiff: null | BPiecesVal[];
}

export type WhiteUciPromotionMoveWihoutPromotionBal =
  | 'a7a8'
  | 'a7b8'
  | 'b7a8'
  | 'b7b8'
  | 'b7c8'
  | 'c7b8'
  | 'c7c8'
  | 'c7d8'
  | 'd7c8'
  | 'd7d8'
  | 'd7e8'
  | 'e7d8'
  | 'e7e8'
  | 'e7f8'
  | 'f7e8'
  | 'f7f8'
  | 'f7g8'
  | 'g7f8'
  | 'g7g8'
  | 'g7h8'
  | 'h7g8'
  | 'h7h8';

export type BlackUciPromotionMoveWihoutPromotionBal =
  | 'a2a1'
  | 'a2b1'
  | 'b2a1'
  | 'b2b1'
  | 'b2c1'
  | 'c2b1'
  | 'c2c1'
  | 'c2d1'
  | 'd2c1'
  | 'd2d1'
  | 'd2e1'
  | 'e2d1'
  | 'e2e1'
  | 'e2f1'
  | 'f2e1'
  | 'f2f1'
  | 'f2g1'
  | 'g2f1'
  | 'g2g1'
  | 'g2h1'
  | 'h2g1'
  | 'h2h1';

export type WhiteUciPromotionMove = `${WhiteUciPromotionMoveWihoutPromotionBal}${LowercasePromotePiecesBal}`;
export type BlackUciPromotionMove = `${BlackUciPromotionMoveWihoutPromotionBal}${LowercasePromotePiecesBal}`;
export type UciPromotionMove = WhiteUciPromotionMove | BlackUciPromotionMove;

export type NoUciMove = '';
export type UciMove = NoUciMove | `${SquareBos}${SquareBos}` | UciPromotionMove;

export type LegalUciTree = Partial<{
  [key in SquareBos]: UciMove[];
}>;

export type RevTreeChild = Partial<{
  [key in LowercasePieceBal]: SquareBos[];
}>;

export type LegalRevTree = Partial<{
  [key in SquareBos]: RevTreeChild;
}>;

export type Metatags = Partial<{
  [key: string]: any;
}>;

export type ParsedResult = {
  tags: Metatags;
  sanMoves: string[];
  result: ManualResult;
};

interface _Move {
  colorMoved: null | Color;
  colorToPlay: null | Color;
  fen: null | string;
  san: null | string;
  uci: null | UciMove;
  fromBos: null | SquareBos;
  toBos: null | SquareBos;
  enPassantBos: null | EnpassantSquareBos;
  piece: null | NoLowercasePieceBal | LowercasePieceBal;
  captured: null | NoLowercasePieceBal | LowercasePieceBal;
  promotion: null | NoLowercasePromotePiecesBal | LowercasePromotePiecesBal;
  comment: null | string;
  moveResult: null | MoveResult;
  canDraw: null | boolean;
  isEnPassantCapture: null | boolean;
}

export type Move = Partial<_Move>;

interface _Board {
  boardName: string;
  getSquare: Function;
  setSquare: Function;
  attackersFromActive: Function;
  attackersFromNonActive: Function;
  toggleActiveNonActive: Function;
  toggleIsRotated: Function;
  setPromoteTo: Function;
  silentlyResetOptions: Function;
  silentlyResetManualResult: Function;
  setManualResult: Function;
  setCurrentMove: Function;
  loadFen: Function;
  loadValidatedFen: Function;
  getClocklessFenHelper: Function;
  updateFenAndMisc: Function;
  refinedFenTest: Function;
  testCollision: Function;
  isLegalMove: Function;
  legalMovesHelper: Function;
  legalMoves: Function;
  legalFenMoves: Function;
  legalSanMoves: Function;
  legalUciMoves: Function;
  getCheckmateMoves: Function;
  getDrawMoves: Function;
  fenHistoryExport: Function;
  pgnExport: Function;
  uciExport: Function;
  ascii: Function;
  boardHash: Function;
  isEqualBoard: Function;
  cloneBoardFrom: Function;
  cloneBoardTo: Function;
  reset: Function;
  undoMove: Function;
  undoMoves: Function;
  countLightDarkBishops: Function;
  updateHelper: Function;
  fenWrapmoveHelper: Function;
  sanWrapmoveHelper: Function;
  getWrappedMove: Function;
  draftMove: Function;
  playMove: Function;
  playMoves: Function;
  playRandomMove: Function;
  navFirst: Function;
  navPrevious: Function;
  navNext: Function;
  navLast: Function;
  navLinkMove: Function;
  refreshUi: Function;
  w: WhiteInfo;
  b: BlackInfo;
  activeColor: null | Color;
  nonActiveColor: null | Color;
  fen: null | string;
  enPassantBos: null | EnpassantSquareBos;
  halfMove: null | number;
  fullMove: null | number;
  moveList: null | Move[];
  currentMove: null | number;
  isRotated: null | boolean;
  isPuzzleMode: null | boolean;
  checks: null | number;
  isCheck: null | boolean;
  isCheckmate: null | boolean;
  isStalemate: null | boolean;
  isThreefold: null | boolean;
  isInsufficientMaterial: null | boolean;
  isFiftyMove: null | boolean;
  inDraw: null | boolean;
  promoteTo: null | PromotePiecesVal;
  manualResult: null | ManualResult;
  isHidden: null | boolean;
  legalUci: null | UciMove[];
  legalUciTree: null | LegalUciTree;
  legalRevTree: null | LegalRevTree;
  squares: SquareMap;
}

export type Board = Partial<_Board>;

export type Boards = Partial<{
  [key: string]: null | Board;
}>;

export type DirectionTop = 1;
export type DirectionTopRight = 2;
export type DirectionRight = 3;
export type DirectionBottomRight = 4;
export type DirectionBottom = 5;
export type DirectionBottomLeft = 6;
export type DirectionLeft = 7;
export type DirectionTopLeft = 8;

export type Direction =
  | DirectionTop
  | DirectionTopRight
  | DirectionRight
  | DirectionBottomRight
  | DirectionBottom
  | DirectionBottomLeft
  | DirectionLeft
  | DirectionTopLeft;

export type AlertLight = 'light';
export type AlertDark = 'dark';
export type AlertSuccess = 'success';
export type AlertWarning = 'warning';
export type AlertError = 'error';

export type Alert = AlertLight | AlertDark | AlertSuccess | AlertWarning | AlertError;

export type TestCollisionOpCandidateMoves = 1;
export type TestCollisionOpIsAttacked = 2;

export type TestCollisionOp = TestCollisionOpCandidateMoves | TestCollisionOpIsAttacked;

export type Qal = SquareBal | SquareAbsBal | SquareVal | SquareAbsVal | SquareClassName | Square;
export type Qos = SquareBos | SquarePos | Square;
export type Zal = Qal | boolean;

export type PreValidatedQal = null | Qal | PreValidatedSquareVal | PreValidatedSquareBal;
export type PreValidatedQos = null | Qos | PreValidatedSquarePos | PreValidatedSquareBos;
export type PreValidatedZal = Zal | PreValidatedQal;

export type MoveFromTo = [Qos, Qos];

export type Mov = string | MoveFromTo | Move | UciMove;

export type Wrapmove = [MoveFromTo, NoLowercasePromotePiecesBal | LowercasePromotePiecesBal];

export type WrappedMove = {
  fromBos: SquareBos;
  toBos: SquareBos;
  promotion: PromotePiecesVal;
  isConfirmedLegalMove: boolean;
};

export type ChangesTuple = [string, any];

export type OptionalParam = null | Record<string, any>;

export type PieceCounts = {
  [key in BPiecesBal]: number;
};

export type ColorPieceCounts = {
  [key in Color]: PieceCounts;
};

export type BishopCounts = {
  lightSquaredBishops: number;
  darkSquaredBishops: number;
};

export type LegalMovesHelper = {
  uciMoves: UciMove[];
  piece: NoLowercasePieceBal | LowercasePieceBal;
  isPromotion: boolean;
};

export type TestCollision = {
  candidateMoves: SquareBos[];
  isAttacked: boolean;
};

export type ColorBishopCounts = {
  [key in Color]: BishopCounts;
};
