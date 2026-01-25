<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>

# Move Properties

Moves from `board.playMove()` and manually selected from `board.moveList[<index>]` have the following accessible properties.

## Quick Reference

| Property | Type | Brief |
|----------|------|-------|
| [`move.colorMoved`](#movecolormoved) | `String` | Color that made this move |
| [`move.colorToPlay`](#movecolortoplay) | `String` | Color to play next |
| [`move.fen`](#movefen) | `String` | FEN after this move |
| [`move.san`](#movesan) | `String` | SAN notation |
| [`move.uci`](#moveuci) | `String` | UCI notation |
| [`move.fromBos`](#movefrombos) | `String` | Origin square |
| [`move.toBos`](#movetobos) | `String` | Destination square |
| [`move.enPassantBos`](#moveenpassantbos) | `String` | En passant square |
| [`move.piece`](#movepiece) | `String` | Piece that moved |
| [`move.captured`](#movecaptured) | `String` | Captured piece |
| [`move.promotion`](#movepromotion) | `String` | Promotion piece |
| [`move.comment`](#movecomment) | `String` | Move comment |
| [`move.moveResult`](#movemoveresult) | `String` | Game result if ended |
| [`move.canDraw`](#movecandraw) | `Boolean` | Draw claimable |
| [`move.isEnPassantCapture`](#moveisenpassantcapture) | `Boolean` | Was en passant capture |

## Property Details

---

### `move.colorMoved`

The **color** (`"w"` or `"b"`) that corresponds to this move.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].colorMoved //"w"
board_after_e4_e5.moveList[2].colorMoved //"b"
```

---

### `move.colorToPlay`

The **color** (`"w"` or `"b"`) that will be next to play after this move is played.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].colorToPlay //"b"
board_after_e4_e5.moveList[2].colorToPlay //"w"
```

---

### `move.fen`

The **fen** after this move is played.

**Type:** `String`

**Examples:**

```javascript
board.moveList[0].fen //"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
board_after_e4.moveList[1].fen //"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
```

---

### `move.san`

The **san** (Standard Algebraic Notation) for this move.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].san //"e4"
board_after_e4_e5.moveList[2].san //"e5"
board_after_e4_e5_nf3.moveList[3].san //"Nf3"
```

---

### `move.uci`

The **uci** (Universal Chess Interface) for this move.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].uci //"e2e4"
board_after_e4_e5_nf3.moveList[3].uci //"g1f3"
board_after_promotion.moveList[1].uci //"e7e8q"
```

---

### `move.fromBos`

The origin (from) **squareBos**.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].fromBos //"e2"
board_after_e4_e5_nf3.moveList[3].fromBos //"g1"
```

---

### `move.toBos`

The destination (to) **squareBos**.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].toBos //"e4"
board_after_e4_e5_nf3.moveList[3].toBos //"f3"
```

---

### `move.enPassantBos`

The En passant **squareBos** if there was a pawn push of two squares and a pawn can legally make the capture via En passant, it holds an empty string otherwise.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].enPassantBos //""
board_after_e4_e6_e5_f5.moveList[4].enPassantBos //"f6"
```

---

### `move.piece`

The **lowercased piece bal** character.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].piece //"p"
board_after_e4_e5_nf3.moveList[3].piece //"n"
board_after_short_castle.moveList[1].piece //"k"
```

---

### `move.captured`

The **lowercased captured bal** character, it holds an empty string if no capture.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].captured //""
board_after_exd5.moveList[1].captured //"p"
board_after_nxb5.moveList[1].captured //"b"
```

---

### `move.promotion`

The **lowercased promotion bal** character, it holds an empty string if no promotion.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].promotion //""
board_after_e8q.moveList[1].promotion //"q"
board_after_e8n.moveList[1].promotion //"n"
```

---

### `move.comment`

`"{...}"` a **comment** to be shown after the san for this move, it holds an empty string if no comment.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].comment //""
board_with_comment.moveList[1].comment //"{Best move!}"
```

---

### `move.moveResult`

If a checkmate or stalemate happened in this move, the value will be a **result** `"1-0"`, `"0-1"`, `"1/2-1/2"`, it holds an empty string otherwise.

**Type:** `String`

**Examples:**

```javascript
board_after_e4.moveList[1].moveResult //""
board_after_checkmate_w.moveList[1].moveResult //"1-0"
board_after_checkmate_b.moveList[1].moveResult //"0-1"
board_after_stalemate.moveList[1].moveResult //"1/2-1/2"
```

---

### `move.canDraw`

The value of `board.inDraw` after this move is played.

**Type:** `Boolean`

**Examples:**

```javascript
board_after_e4.moveList[1].canDraw //false
board_after_stalemate.moveList[1].canDraw //true
board_after_threefold.moveList[1].canDraw //true
```

---

### `move.isEnPassantCapture`

Tells if there was an En passant capture in this move.

**Type:** `Boolean`

**Examples:**

```javascript
board_after_e4.moveList[1].isEnPassantCapture //false
board_after_exf6_enpassant.moveList[1].isEnPassantCapture //true
```


<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>
