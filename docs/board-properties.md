<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>

# Board Properties

Boards created by `Ic.initBoard()` have the following accessible properties.

## Quick Reference

| Property | Type | Brief |
|----------|------|-------|
| [`board.boardName`](#boardboardname) | `String` | Unique board name set when created |
| [`board.w`](#boardw--boardb) | `Object` | White player properties |
| [`board.b`](#boardw--boardb) | `Object` | Black player properties |
| [`board.activeColor`](#boardactivecolor--boardnonactivecolor) | `String` | Color to move ("w" or "b") |
| [`board.nonActiveColor`](#boardactivecolor--boardnonactivecolor) | `String` | Color not to move |
| [`board.fen`](#boardfen) | `String` | Current FEN position |
| [`board.enPassantBos`](#boardenpassantbos) | `String` | En passant square or empty |
| [`board.halfMove`](#boardhalfmove) | `Number` | Halfmove clock |
| [`board.fullMove`](#boardfullmove) | `Number` | Fullmove clock |
| [`board.moveList`](#boardmovelist) | `Array` | Collection of moves |
| [`board.currentMove`](#boardcurrentmove) | `Number` | Current move index |
| [`board.isRotated`](#boardisrotated) | `Boolean` | Board rotation state |
| [`board.isPuzzleMode`](#boardispuzzlemode) | `Boolean` | Puzzle mode state |
| [`board.checks`](#boardchecks) | `Number` | Number of checks on active king |
| [`board.isCheck`](#boardischeck) | `Boolean` | King is in check |
| [`board.isCheckmate`](#boardischeckmate) | `Boolean` | Checkmate state |
| [`board.isStalemate`](#boardisstalemate) | `Boolean` | Stalemate state |
| [`board.isThreefold`](#boardisthreefold) | `Boolean` | Threefold repetition |
| [`board.isInsufficientMaterial`](#boardisinsufficientmaterial) | `Boolean` | Insufficient material draw |
| [`board.isFiftyMove`](#boardisfiftymove) | `Boolean` | Fifty-move rule |
| [`board.inDraw`](#boardindraw) | `Boolean` | Draw state |
| [`board.promoteTo`](#boardpromoteto) | `Number` | Promotion piece |
| [`board.manualResult`](#boardmanualresult) | `String` | Manual game result |
| [`board.isHidden`](#boardishidden) | `Boolean` | UI visibility |
| [`board.legalUci`](#boardlegaluci) | `Array` | All legal UCI moves |
| [`board.legalUciTree`](#boardlegalucitree) | `Object` | Legal moves by square |
| [`board.legalRevTree`](#boardlegalrevtree) | `Object` | Reversed move tree |
| [`board.squares`](#boardsquares) | `Object` | The 64 squares |

## Property Details

---

### `board.boardName`

All **board**s have a unique **board name** that is set when created. This property can't be modified.

**Type:** `String`

**Examples:**

```javascript
main_board.boardName //"main"
other_board.boardName //"other"
rff_board.boardName //"resume_from_fen"
```

---

### `board.w` / `board.b`

White and black player property objects.

**Type:** `Object`

<details>
<summary><strong>Sub-properties</strong></summary>

- `isBlack` `(Boolean)` — `board.w.isBlack = false` and `board.b.isBlack = true`
- `sign` `(Number)` — `board.w.sign = 1` and `board.b.sign = -1`
- `firstRankPos` `(Number)` — `board.w.firstRankPos = 7` and `board.b.firstRankPos = 0`
- `secondRankPos` `(Number)` — `board.w.secondRankPos = 6` and `board.b.secondRankPos = 1`
- `lastRankPos` `(Number)` — `board.w.lastRankPos = 0` and `board.b.lastRankPos = 7`
- `singlePawnRankShift` `(Number)` — `board.w.singlePawnRankShift = -1` and `board.b.singlePawnRankShift = 1`
- `pawn / knight / bishop / rook / queen / king` `(Number)` — `board.w.<PIECE> = (1, 2, ..., 6)` and `board.b.<PIECE> = (-1, -2, ..., -6)`
- `kingBos` `(String)` — `board.w.kingBos` and `board.b.kingBos` hold the **king bos** square of their respective king
- `castling` `(Number)` — `board.w.castling` and `board.b.castling` hold the **castling rights** in a single digit value: `0 = no castling rights`, `1 = only short castle`, `2 = only long castle`, `3 = both castling rights`
- `materialDiff` `(Array)` — `board.w.materialDiff` holds a **piece val array** (with *positive* **piece sign**s) of exceeding pieces that white has over black and `board.b.materialDiff` holds a **piece val array** (with *negative* **piece sign**s) of exceeding pieces that black has over white. Differences by more than one piece of the same value will result in appearing multiple times e.g. `[1, 1, ...]`

</details>

All sub-properties never change except for: **kingBos**, **castling** and **materialDiff**. These get updated automatically and reflect their current state.

**Examples:**

```javascript
board.w.isBlack //false
board.b.isBlack //true
board.w.sign //1
board.b.sign //-1
board.w.kingBos //"e1"
board.b.kingBos //"e8"
board.w.castling //3
board.b.castling //3
rff_board.w.materialDiff //[1, 4]
rff_board.b.materialDiff //[-2]
```

---

### `board.activeColor` / `board.nonActiveColor`

`board.activeColor` holds `"w"` when **white** to move and `"b"` when **black** to move.

`board.nonActiveColor` holds `"w"` when **black** to move and `"b"` when **white** to move.

**Type:** `String`

> [!TIP]
> You can use `board[board.activeColor]` and `board[board.nonActiveColor]` to access the sub-properties of `board.w` and `board.b` <sup>(not respectively)</sup> depending on the actual **active** or **non active color**.

**Examples:**

```javascript
main_board.activeColor //"w"
main_board.nonActiveColor //"b"
rff_board.activeColor //"b"
rff_board.nonActiveColor //"w"
```

---

### `board.fen`

The **fen** (Forsyth–Edwards Notation) of the **board** in its current state.

**Type:** `String`

**Examples:**

```javascript
main_board.fen //"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
rff_board.fen //"r5k1/pp3ppp/7n/8/2P2P1K/3P1q2/P1PBb2P/R5QR b - - 3 22"
```

---

### `board.enPassantBos`

Holds the **En passant bos** square (if any) or an empty string.

It will also hold an empty string if there isn't a pawn that can legally make the En passant capture without exposing the King.

**Type:** `String`

**Examples:**

```javascript
board_after_e4 //""
board_after_e4_e6_e5_f5.enPassantBos //"f6"
board_no_enpass.enPassantBos //""
```

---

### `board.halfMove`

The **halfmove clock**.

Starts with the default value of `0` unless the **fen** used to initiate the **board** provides the optional **halfmove/fullmove clocks**.

**Type:** `Number`

**Examples:**

```javascript
board.halfMove //0
board_after_e4.halfMove //0
board_after_e4_e5.halfMove //0
board_after_e4_e5_nf3.halfMove //1
rff_board.halfMove //3
```

---

### `board.fullMove`

The **fullmove clock**.

Starts with the default value of `1` unless the **fen** used to initiate the **board** provides the optional **halfmove/fullmove clocks**.

**Type:** `Number`

**Examples:**

```javascript
board.fullMove //1
board_after_e4.fullMove //1
board_after_e4_e5.fullMove //2
board_after_e4_e5_nf3.fullMove //2
rff_board.fullMove //22
```

---

### `board.moveList`

The **move list** is a collection of 📌**move**s stored as an array `[move0, move1, ..., moveN]`.

The **fen** from where the **board** was first initialized is always stored in the first element `board.moveList[0].fen`.

**Type:** `Array`

**Examples:**

```javascript
board.moveList //[{...}]
board_after_nc3.moveList //[{...}, {...}]
```

📌 **See also:**

- [move properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/move-properties.md#move-properties)

---

### `board.currentMove`

The **current move** is the index of **move list** that the **board** is currently in.

If this "cursor" is not at the end of the **move list** when a new move is made, the **move list** will record the move and erase the rest.

This is always a zero-based index regardless of the initial **fullmove clock** used.

**Type:** `Number`

**Examples:**

```javascript
board.currentMove //0
board_after_e4.currentMove //1
board_after_e4_e5.currentMove //2
board_after_e4_e5_nf3.currentMove //3
rff_board.currentMove //0
```

---

### `board.isRotated`

This affects the visual representation of the **board** in `board.ascii()` and `IcUi` from **isepic-chess-ui.js**.

**Type:** `Boolean`

**Examples:**

```javascript
board.isRotated //false
board_currently_rotated.isRotated //true
```

---

### `board.isPuzzleMode`

This enables **puzzle mode** 🚧 work in progress 🚧.

**Type:** `Boolean`

**Examples:**

```javascript
board.isPuzzleMode //false
board_with_puzzle.isPuzzleMode //true
```

---

### `board.checks`

The number of attacks to the **active** king.

**Type:** `Number`

**Examples:**

```javascript
board_not_in_check.checks //0
board_simple_check.checks //1
board_double_check.checks //2
```

---

### `board.isCheck`

Indicates that the **active** king is being attacked at least once.

**Type:** `Boolean`

**Examples:**

```javascript
board_in_check.isCheck //true
board_in_checkmate.isCheck //true
board_in_stalemate.isCheck //false
board_not_in_check.isCheck //false
```

---

### `board.isCheckmate`

Indicates that there aren't any legal moves for the side to move and the **active** king is at check.

**Type:** `Boolean`

**Examples:**

```javascript
board_in_check.isCheckmate //false
board_in_checkmate.isCheckmate //true
board_in_stalemate.isCheckmate //false
board_not_in_check.isCheckmate //false
```

---

### `board.isStalemate`

Indicates that there aren't any legal moves for the side to move and the **active** king is not at check.

**Type:** `Boolean`

**Examples:**

```javascript
board_in_check.isStalemate //false
board_in_checkmate.isStalemate //false
board_in_stalemate.isStalemate //true
board_not_in_check.isStalemate //false
```

---

### `board.isThreefold`

Indicates that the current position has appeared at least three times before.

**Type:** `Boolean`

**Examples:**

```javascript
not_repeated_thrice_before.isThreefold //false
repeated_thrice_before.isThreefold //true
```

---

### `board.isInsufficientMaterial`

Indicates that there isn't enough material for either side to deliver a checkmate.

**Type:** `Boolean`

**Examples:**

```javascript
k_vs_k.isInsufficientMaterial //true
k_vs_kn.isInsufficientMaterial //true
k_vs_kb.isInsufficientMaterial //true
k_vs_knn.isInsufficientMaterial //false
kn_vs_kn.isInsufficientMaterial //false
k_vs_knb.isInsufficientMaterial //false
```

---

### `board.isFiftyMove`

Indicates that no capture has been made and no pawn has been moved in the last 50 moves (100 half moves).

**Type:** `Boolean`

**Examples:**

```javascript
board_99halfmoves.isFiftyMove //false
board_100halfmoves.isFiftyMove //true
```

---

### `board.inDraw`

Indicates that a draw is present.

Having a `board.manualResult` of `"1/2-1/2"` and being at the last move played will *not* affect this property.

**Type:** `Boolean`

**Examples:**

```javascript
main_board.inDraw //false
board_in_stalemate.inDraw //true
board_in_3fold.inDraw //true
board_100halfmoves.inDraw //true
board_insufficient_mat.inDraw //true
```

---

### `board.promoteTo`

Promoted pawns will turn into this piece.

The value is stored as an **abs val** (from `2` knight to `5` queen).

**Type:** `Number`

**Examples:**

```javascript
board_q_option.promoteTo //5
board_r_option.promoteTo //4
board_b_option.promoteTo //3
board_n_option.promoteTo //2
```

---

### `board.manualResult`

This value is used to aid the PGN export to differentiate games that were not necessarily terminated via checkmate or stalemate.

The value is stored as `"*", "1-0", "0-1" or "1/2-1/2"`.

The default value is `"*"`. Parsing a PGN that contains a **result** (either by a tag or appearing at the end of the move list) or passing a `manualResult` **p option** to `Ic.initBoard({manualResult: ...})` can affect this value. It can also be modified with the **board method** `board.setManualResult(...)`.

Playing *any* move will set the value back to `"*"` (including moves resulting in checkmate and stalemate). The value will not change when navigating through moves or playing a **mock move**.

This property should not be confused with a game result, `"*"` here means that the manual result is set to "automatic".

**Type:** `String`

**Examples:**

```javascript
board.manualResult //"*"
board_b_resigned.manualResult //"1-0"
board_w_resigned.manualResult //"0-1"
board_draw_agreed.manualResult //"1/2-1/2"
```

---

### `board.isHidden`

Indicates if a **board** is meant to be shown or hidden in the UI.

Only used when **isepic-chess-ui.js** is present (the property becomes irrelevant otherwise).

**Type:** `Boolean`

**Examples:**

```javascript
main_board.isHidden //false
h_board.isHidden //true
```

---

### `board.legalUci`

Array with all the **legal uci moves**.

**Type:** `Array`

**Examples:**

```javascript
board.legalUci //["a2a3", ...]
board_after_e4.legalUci //["a7a6", ...]
```

---

### `board.legalUciTree`

Collection with all the **legal uci moves** divided into arrays (one array per each **square bos** with at least one legal move).

**Type:** `Object`

**Examples:**

```javascript
board.legalUciTree //{a2: ["a2a3", ...], b2: ...}
board_after_e4.legalUciTree //{a7: ["a7a6", ...], b7: ...}
```

---

### `board.legalRevTree`

Collection with all the **legal reversed moves**.

Instead of something conventional like *from-to*, this is distributed as *to-from* (while also storing a sub-level in between with a lowercased piece-char holding the *from*s).

This object is of great help when parsing a SAN move (the origin square is not apparent, but the piece and destination square can be extracted) and also in move disambiguation.

**Type:** `Object`

**Examples:**

```javascript
board.legalRevTree //{a3: {p: ["a2"], n: ["b1"]}, b3: ...}
board_after_e4.legalRevTree //{a6: {p: ["a7"], n: ["b8"]}, b6: ...}
```

---

### `board.squares`

Collection of the 64 📌**square**s of the board.

**Type:** `Object`

> [!TIP]
> The preferred way of selecting **square**s is via `board.getSquare(...)`.

**Examples:**

```javascript
board.squares["a1"] //Object{...}
board.squares["h8"] //Object{...}
```

📌 **See also:**

- [square properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/square-properties.md#square-properties)


<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>
