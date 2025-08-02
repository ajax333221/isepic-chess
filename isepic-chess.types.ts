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

export type PositiveOneShift = 1;
export type NegativeOneShift = -1;
export type PositiveTwoShift = 2;
export type NegativeTwoShift = -2;
export type Shift = PositiveOneShift | NegativeOneShift | PositiveTwoShift | NegativeTwoShift;

export type NoSquareClassName = '';
export type WhiteColor = 'w';
export type BlackColor = 'b';
export type Color = WhiteColor | BlackColor;
export type SquareClassName =
  | NoSquareClassName
  | `${WhiteColor}${LowercasePieceBal}`
  | `${BlackColor}${LowercasePieceBal}`;

export interface Square {
  pos: SquarePos;
  bos: SquareBos;
  rankPos: SquareRankPos;
  filePos: SquareFilePos;
  rankBos: SquareRankBos;
  fileBos: SquareFileBos;
  bal: SquareBal;
  absBal: SquareAbsBal;
  val: SquareVal;
  absVal: SquareAbsVal;
  className: SquareClassName;
  sign: Sign;
  isEmptySquare: boolean;
  isPawn: boolean;
  isKnight: boolean;
  isBishop: boolean;
  isRook: boolean;
  isQueen: boolean;
  isKing: boolean;
}

export type SquareMap = Record<SquareBos, Square>;

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
  singlePawnRankShift: NegativeOneShift;
  pawn: WpVal;
  knight: WnVal;
  bishop: WbVal;
  rook: WrVal;
  queen: WqVal;
  king: WkVal;
  kingBos: SquareBos;
  castling: CastlingRights;
  materialDiff: WPiecesVal[];
}

export interface BlackInfo {
  isBlack: TrueOnly;
  sign: BlackSign;
  firstRankPos: NumberZero;
  secondRankPos: NumberOne;
  lastRankPos: NumberSeven;
  singlePawnRankShift: PositiveOneShift;
  pawn: BpVal;
  knight: BnVal;
  bishop: BbVal;
  rook: BrVal;
  queen: BqVal;
  king: BkVal;
  kingBos: SquareBos;
  castling: CastlingRights;
  materialDiff: BPiecesVal[];
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
  getSquare: Function; //TODO: specify Params and Return
  setSquare: Function; //TODO: specify Params and Return
  attackersFromActive: Function; //TODO: specify Params and Return
  attackersFromNonActive: Function; //TODO: specify Params and Return
  toggleActiveNonActive(new_active?: boolean): boolean;
  toggleIsRotated(new_is_rotated?: boolean): boolean;
  setPromoteTo(qal: Qal): boolean;
  silentlyResetOptions(): void;
  silentlyResetManualResult(): void;
  setManualResult(str?: string): boolean;
  setCurrentMove(num?: number, is_goto?: boolean, is_puzzle_move?: boolean): boolean;
  loadFen(fen?: string, p?: OptionalParam): boolean;
  loadValidatedFen(fen?: string): void;
  getClocklessFenHelper(): string;
  updateFenAndMisc(sliced_fen_history?: string[]): void;
  refinedFenTest(): string;
  testCollision(
    op: TestCollisionOp,
    initial_qos: Qos,
    piece_direction: Direction,
    as_knight: boolean,
    max_shifts: number,
    allow_capture: boolean
  ): TestCollision;
  isLegalMove(mov?: Mov, p?: OptionalParam): boolean;
  legalMovesHelper(target_qos: Qos): LegalMovesHelper;
  legalMoves(target_qos: Qos, p?: OptionalParam): any[];
  legalFenMoves(target_qos: Qos): string[];
  legalSanMoves(target_qos: Qos): string[];
  legalUciMoves(target_qos: Qos): UciMove[];
  getCheckmateMoves(early_break?: boolean): UciMove[];
  getDrawMoves(early_break?: boolean): UciMove[];
  fenHistoryExport(): string[];
  pgnExport(): string;
  uciExport(): string;
  ascii(is_rotated?: boolean): string;
  boardHash(): number;
  isEqualBoard(to_woard: Woard): boolean;
  cloneBoardFrom(from_woard: Woard): boolean;
  cloneBoardTo(to_woard: Woard): boolean;
  reset(keep_options?: boolean): boolean;
  undoMove(): null | Move;
  undoMoves(decrease_by?: number): null | Move[];
  countLightDarkBishops(): ColorBishopCounts;
  updateHelper(obj?: any): boolean;
  fenWrapmoveHelper(mov?: string): null | Wrapmove;
  sanWrapmoveHelper(mov?: string): null | Wrapmove;
  getWrappedMove(mov?: Mov, p?: OptionalParam): null | WrappedMove;
  draftMove(mov?: Mov, p?: OptionalParam): DraftMove;
  playMove(mov: Mov, p?: OptionalParam, sliced_fen_history?: string[]): null | Move;
  playMoves(arr: Mov[], p?: OptionalParam, sliced_fen_history?: string[]): boolean;
  playRandomMove(p?: OptionalParam, sliced_fen_history?: string[]): null | Move;
  navFirst(): boolean;
  navPrevious(): boolean;
  navNext(): boolean;
  navLast(): boolean;
  navLinkMove(move_index?: number): boolean;
  refreshUi(animation_type?: any, play_sounds?: boolean): void;
  w: WhiteInfo;
  b: BlackInfo;
  activeColor: Color;
  nonActiveColor: Color;
  fen: string;
  enPassantBos: EnpassantSquareBos;
  halfMove: number;
  fullMove: number;
  moveList: Move[];
  currentMove: number;
  isRotated: boolean;
  isPuzzleMode: boolean;
  checks: number;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isThreefold: boolean;
  isInsufficientMaterial: boolean;
  isFiftyMove: boolean;
  inDraw: boolean;
  promoteTo: PromotePiecesVal;
  manualResult: ManualResult;
  isHidden: boolean;
  legalUci: UciMove[];
  legalUciTree: LegalUciTree;
  legalRevTree: LegalRevTree;
  squares: SquareMap;
}

export type Board = _Board;

export type Woard = null | string | Board;

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

export type DraftMove = Partial<{
  canMove: boolean;
  initialCachedSquare: Square;
  finalCachedSquare: Square;
  activeSideCastlingZero: boolean;
  putRookAtFileShift: Shift;
  removeRookAtFileShift: Shift;
  enPassantCaptureAtRankShift: Sign;
  pawnMoved: boolean;
  isEnPassantCapture: boolean;
  newEnPassantBos: SquareBos;
  captured: LowercasePieceBal;
  promotedVal: SquareVal;
  partialSan: string;
  withOverdisambiguated: string[];
}>;
