<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>

<h1 align="center">Board properties</h1>

Boards created by `Ic.initBoard()` have the following accessible properties:

<ul>
<li>board.boardName</li>
<li>board.w</li>
<li>board.b</li>
<li>board.activeColor</li>
<li>board.nonActiveColor</li>
<li>board.fen</li>
<li>board.enPassantBos</li>
<li>board.halfMove</li>
<li>board.fullMove</li>
<li>board.moveList</li>
<li>board.currentMove</li>
<li>board.isRotated</li>
<li>board.checks</li>
<li>board.isCheck</li>
<li>board.isCheckmate</li>
<li>board.isStalemate</li>
<li>board.isThreefold</li>
<li>board.isInsufficientMaterial</li>
<li>board.isFiftyMove</li>
<li>board.inDraw</li>
<li>board.promoteTo</li>
<li>board.manualResult</li>
<li>board.isHidden</li>
<li>board.legalUci</li>
<li>board.legalUciTree</li>
<li>board.legalRevTree</li>
<li>board.squares</li>
</ul>

#### Table `board.<properties>`:

Property | Type | Description
-------- | ---- | -----------
**boardName** | String | All **board**s have a unique **board name** that is set when created. This property can't be modified.<hr>Examples:<ul><li>`main_board.boardName //"main"`</li><li>`other_board.boardName //"other"`</li><li>`rff_board.boardName //"resume_from_fen"`</li></ul>
**w**<hr>**b** | Object | They both have the following sub-properties:<ul><li>**isBlack** (Boolean): `board.w.isBlack = false` and `board.b.isBlack = true`.</li><li>**sign** (Number): `board.w.sign = 1` and `board.b.sign = -1`.</li><li>**firstRankPos** (Number): `board.w.firstRankPos = 7` and `board.b.firstRankPos = 0`.</li><li>**secondRankPos** (Number): `board.w.secondRankPos = 6` and `board.b.secondRankPos = 1`.</li><li>**lastRankPos** (Number): `board.w.lastRankPos = 0` and `board.b.lastRankPos = 7`.</li><li>**singlePawnRankShift** (Number): `board.w.singlePawnRankShift = -1` and `board.b.singlePawnRankShift = 1`.</li><li>**pawn / knight / bishop / rook / queen / king** (Number): `board.w.<PIECE> = (1, 2, ..., 6)` and `board.b.<PIECE> = (-1, -2, ..., -6)`.</li><li>**kingBos** (String): `board.w.kingBos` and `board.b.kingBos` hold the **king bos** square of their respective king.</li><li>**castling** (Number): `board.w.castling` and `board.b.castling` hold the **castling rights** in a single digit value: `0 = no castling rights`, `1 = only short castle`, `2 = only long castle`, `3 = both castling rights`.</li><li>**materialDiff** (Array): `board.w.materialDiff` holds a **piece val array** (with *positive* **piece sign**s) of exceeding pieces that white has over black and `board.b.materialDiff` holds a **piece val array** (with *negative* **piece sign**s) of exceeding pieces that black has over white. Differences by more than one piece of the same value will result in appearing multiple times e.g. `[1, 1, ...]`.</li></ul>All sub-properties never change except for: **kingBos**, **castling** and **materialDiff**. These get updated automatically and reflect their current state.<hr>Examples:<ul><li>`board.w.isBlack //false`</li><li>`board.b.isBlack //true`</li><li>`board.w.sign //1`</li><li>`board.b.sign //-1`</li><li>`board.w.kingBos //"e1"`</li><li>`board.b.kingBos //"e8"`</li><li>`board.w.castling //3`</li><li>`board.b.castling //3`</li><li>`rff_board.w.materialDiff //[1, 4]`</li><li>`rff_board.b.materialDiff //[-2]`</li></ul>
**activeColor**<hr>**nonActiveColor** | String | `board.activeColor` holds `"w"` when **white** to move and `"b"` when **black** to move.<br><br>`board.nonActiveColor` holds `"w"` when **black** to move and `"b"` when **white** to move.<br><br>:zap:**Tip:** you can use `board[board.activeColor]` and `board[board.nonActiveColor]` to access the sub-properties of `board.w` and `board.b` <sup>(not respectively)</sup> depending on the actual **active** or **non active color**.<hr>Examples:<ul><li>`main_board.activeColor //"w"`</li><li>`main_board.nonActiveColor //"b"`</li><li>`rff_board.activeColor //"b"`</li><li>`rff_board.nonActiveColor //"w"`</li></ul>
**fen** | String | The **fen** (Forsyth–Edwards Notation) of the **board** in its current state.<hr>Examples:<ul><li>`main_board.fen //"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"`</li><li>`rff_board.fen //"r5k1/pp3ppp/7n/8/2P2P1K/3P1q2/P1PBb2P/R5QR b - - 3 22"`</li></ul>
**enPassantBos** | String | Holds the **En passant bos** square (if any) or an empty string.<br>It will also hold an empty string if there isn't a pawn that can legally make the En passant capture (without exposing the King).<hr>Examples:<ul><li>`board_after_e4_e6_e5_f5.enPassantBos //"f6"`</li><li>`board_no_enpass.enPassantBos //""`</li></ul>
**halfMove** | Number | The **halfmove clock**.<br><br>Starts with the default value of `0` unless the **fen** used to initiate the **board** provides the optional **halfmove/fullmove clocks**.<hr>Examples:<ul><li>`board.halfMove //0`</li><li>`board_after_e4.halfMove //0`</li><li>`board_after_e4_e5.halfMove //0`</li><li>`board_after_e4_e5_nf3.halfMove //1`</li><li>`rff_board.halfMove //3`</li></ul>
**fullMove** | Number | The **fullmove clock**.<br><br>Starts with the default value of `1` unless the **fen** used to initiate the **board** provides the optional **halfmove/fullmove clocks**.<hr>Examples:<ul><li>`board.fullMove //1`</li><li>`board_after_e4.fullMove //1`</li><li>`board_after_e4_e5.fullMove //2`</li><li>`board_after_e4_e5_nf3.fullMove //2`</li><li>`rff_board.fullMove //22`</li></ul>
**moveList** | Array | The **move list** is a collection of :pushpin:**move**s stored as an array `[move0, move1, ..., moveN]`.<br><br>The **fen** from where the **board** was first initialized is always stored in the first element `board.moveList[0].fen`.<hr>Examples:<ul><li>`board.moveList //[{...}]`</li><li>`board_after_nc3.moveList //[{...}, {...}]`</li></ul><hr>:pushpin:Move documentation link:<ul><li>[move properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/move-properties.md#move-properties).</li></ul>
**currentMove** | Number | The **current move** is the index of **move list** that the **board** is currently in.<br><br>If this "cursor" is not at the end of the **move list** when a new move is made, the **move list** will record the move and erase the rest.<br><br>This is always a zero-based index regardless of the initial **fullmove clock** used.<hr>Examples:<ul><li>`board.currentMove //0`</li><li>`board_after_e4.currentMove //1`</li><li>`board_after_e4_e5.currentMove //2`</li><li>`board_after_e4_e5_nf3.currentMove //3`</li><li>`rff_board.currentMove //0`</li></ul>
**isRotated** | Boolean | This affects the visual representation of the **board** in `board.ascii()` and `IcUi` from **isepic-chess-ui.js**.<hr>Examples:<ul><li>`board.isRotated //false`</li><li>`board_currently_rotated.isRotated //true`</li></ul>
**checks** | Number | The number of attacks to the **active** king.<hr>Examples:<ul><li>`board_not_in_check.checks //0`</li><li>`board_simple_check.checks //1`</li><li>`board_double_check.checks //2`</li></ul>
**isCheck** | Boolean | Indicates that the **active** king is being attacked at least once.<hr>Examples:<ul><li>`board_in_check.isCheck //true`</li><li>`board_in_checkmate.isCheck //true`</li><li>`board_in_stalemate.isCheck //false`</li><li>`board_not_in_check.isCheck //false`</li></ul>
**isCheckmate** | Boolean | Indicates that there aren't any legal moves for the side to move and the **active** king is at check.<hr>Examples:<ul><li>`board_in_check.isCheckmate //false`</li><li>`board_in_checkmate.isCheckmate //true`</li><li>`board_in_stalemate.isCheckmate //false`</li><li>`board_not_in_check.isCheckmate //false`</li></ul>
**isStalemate** | Boolean | Indicates that there aren't any legal moves for the side to move and the **active** king is not at check.<hr>Examples:<ul><li>`board_in_check.isStalemate //false`</li><li>`board_in_checkmate.isStalemate //false`</li><li>`board_in_stalemate.isStalemate //true`</li><li>`board_not_in_check.isStalemate //false`</li></ul>
**isThreefold** | Boolean | Indicates that the current position has appeared at least three times before.<hr>Examples:<ul><li>`not_repeated_thrice_before.isThreefold //false`</li><li>`repeated_thrice_before.isThreefold //true`</li></ul>
**isInsufficientMaterial** | Boolean | Indicates that there isn't enough material for either side to deliver a checkmate.<hr>Examples:<ul><li>`k_vs_k.isInsufficientMaterial //true`</li><li>`k_vs_kn.isInsufficientMaterial //true`</li><li>`k_vs_kb.isInsufficientMaterial //true`</li><li>`k_vs_knn.isInsufficientMaterial //false`</li><li>`kn_vs_kn.isInsufficientMaterial //false`</li><li>`k_vs_knb.isInsufficientMaterial //false`</li></ul>
**isFiftyMove** | Boolean | Indicates that no capture has been made and no pawn has been moved in the last 50 moves (100 half moves).<hr>Examples:<ul><li>`board_99halfmoves.isFiftyMove //false`</li><li>`board_100halfmoves.isFiftyMove //true`</li></ul>
**inDraw** | Boolean | Indicates that a draw is present.<br><br>Having a `board.manualResult` of `"1/2-1/2"` and being at the last move played will *not* affect this property.<hr>Examples:<ul><li>`main_board.inDraw //false`</li><li>`board_in_stalemate.inDraw //true`</li><li>`board_in_3fold.inDraw //true`</li><li>`board_100halfmoves.inDraw //true`</li><li>`board_insufficient_mat.inDraw //true`</li></ul>
**promoteTo** | Number | Promoted pawns will turn into this piece.<br><br>The value is stored as an **abs val** (from `2` knight to `5` queen).<hr>Examples:<ul><li>`board_q_option.promoteTo //5`</li><li>`board_r_option.promoteTo //4`</li><li>`board_b_option.promoteTo //3`</li><li>`board_n_option.promoteTo //2`</li></ul>
**manualResult** | String | This value is used to aid the PGN export to differentiate games that were not necessarily terminated via checkmate or stalemate.<br><br>The value is stored as `"*", "1-0", "0-1" or "1/2-1/2"`.<br><br>The default value is `"*"`. Parsing a PGN that contains a **result** (either by a tag or appearing at the end of the move list) or passing a `manualResult` **p option** to `Ic.initBoard({manualResult : ...})` can affect this value. It can also be modified with the **board method** `board.setManualResult(...)`.<br><br>Playing *any* move will set the value back to `"*"` (including moves resulting in checkmate and stalemate). The value will not change when navigating through moves or playing a **mock move**.<br><br>This property should not be confussed with a game result, `"*"` here means that the manual result is set to "automatic".<hr>Examples:<ul><li>`board.manualResult //"*"`</li><li>`board_b_resigned.manualResult //"1-0"`</li><li>`board_w_resigned.manualResult //"0-1"`</li><li>`board_draw_agreed.manualResult //"1/2-1/2"`</li></ul>
**isHidden** | Boolean | Indicates if a **board** is meant to be shown or hidden in the UI.<br><br>Only used when **isepic-chess-ui.js** is present (the property becomes irrelevant otherwise).<hr>Examples:<ul><li>`main_board.isHidden //false`</li><li>`h_board.isHidden //true`</li></ul>
**legalUci** | Array | Array with all the **legal uci moves**.<hr>Examples:<ul><li>`board.legalUci //["a2a3", ...]`</li><li>`board_after_e4.legalUci //["a7a6", ...]`</li></ul>
**legalUciTree** | Object | Collection with all the **legal uci moves** divided into arrays (one array per each **square bos** with at least one legal move).<hr>Examples:<ul><li>`board.legalUciTree //{a2 : ["a2a3", ...], b2 : ...}`</li><li>`board_after_e4.legalUciTree //{a7 : ["a7a6", ...], b7 : ...}`</li></ul>
**legalRevTree** | Object | Collection with all the **legal reversed moves**.<br><br>Instead of something conventional like *from-to*, this is distributed as *to-from* (while also storing a sub-level in between with a lowercased piece-char holding the *from*s).<br><br>This object is of great help when parsing a SAN move (the origin square is not apparent, but the piece and destination square can be extracted) and also in move disambiguation.<hr>Examples:<ul><li>`board.legalRevTree //{a3: {p : ["a2"], n : ["b1"]}, b3 : ...}`</li><li>`board_after_e4.legalRevTree //{a6: {p : ["a7"], n : ["b8"]}, b6 : ...}`</li></ul>
**squares** | Object | Collection of the 64 :pushpin:**square**s of the board.<br><br>:zap:**Tip:** the preferred way of selecting **square**s is via `board.getSquare(...)`.<hr>Examples:<ul><li>`board.squares["a1"] //Object{...}`</li><li>`board.squares["h8"] //Object{...}`</li></ul><hr>:pushpin:Square documentation link:<ul><li>[square properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/square-properties.md#square-properties).</li></ul>

<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>
