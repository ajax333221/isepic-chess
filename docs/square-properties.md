<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>

# Square Properties

Squares from `board.getSquare()` and manually selected from `board.squares[<a1-h8>]` have the following accessible properties.

## Quick Reference

| Property | Type | Brief |
|----------|------|-------|
| [`square.pos`](#squarepos) | `Array` | Position as `[rank, file]` |
| [`square.bos`](#squarebos) | `String` | Board square notation |
| [`square.rankPos`](#squarerankpos) | `Number` | Rank position (0-7) |
| [`square.filePos`](#squarefilepos) | `Number` | File position (0-7) |
| [`square.rankBos`](#squarerankbos) | `String` | Rank notation (1-8) |
| [`square.fileBos`](#squarefilebos) | `String` | File notation (a-h) |
| [`square.bal`](#squarebal) | `String` | Piece letter with case |
| [`square.absBal`](#squareabsbal) | `String` | Piece letter uppercase |
| [`square.val`](#squareval) | `Number` | Piece value with sign |
| [`square.absVal`](#squareabsval) | `Number` | Piece value absolute |
| [`square.className`](#squareclassname) | `String` | CSS class name |
| [`square.sign`](#squaresign) | `Number` | Piece sign (-1 or 1) |
| [`square.isEmptySquare`](#squareisemptysquare) | `Boolean` | Is empty |
| [`square.isPawn`](#squareispawn) | `Boolean` | Is pawn |
| [`square.isKnight`](#squareisknight) | `Boolean` | Is knight |
| [`square.isBishop`](#squareisbishop) | `Boolean` | Is bishop |
| [`square.isRook`](#squareisrook) | `Boolean` | Is rook |
| [`square.isQueen`](#squareisqueen) | `Boolean` | Is queen |
| [`square.isKing`](#squareisking) | `Boolean` | Is king |

## Property Details

---

### `square.pos`

**squarePos**: Position as array `[rankPos, filePos]`.

**Type:** `Array` — `[0-7, 0-7]`

**Examples:**

```javascript
board.getSquare("a1").pos //[7, 0]
board.getSquare("h8").pos //[0, 7]
board.getSquare("e4").pos //[4, 4]
```

---

### `square.bos`

**squareBos**: Board square notation.

**Type:** `String` — `"a1"` to `"h8"`

**Examples:**

```javascript
board.getSquare([7, 0]).bos //"a1"
board.getSquare([0, 7]).bos //"h8"
board.getSquare([4, 4]).bos //"e4"
```

---

### `square.rankPos`

**squareRankPos**: Rank position (0 = 8th rank, 7 = 1st rank).

**Type:** `Number` — `0-7`

**Examples:**

```javascript
board.getSquare("a1").rankPos //7
board.getSquare("a8").rankPos //0
board.getSquare("e4").rankPos //4
```

---

### `square.filePos`

**squareFilePos**: File position (0 = a-file, 7 = h-file).

**Type:** `Number` — `0-7`

**Examples:**

```javascript
board.getSquare("a1").filePos //0
board.getSquare("h1").filePos //7
board.getSquare("e4").filePos //4
```

---

### `square.rankBos`

**squareRankBos**: Rank in board notation.

**Type:** `String` — `"1"` to `"8"`

**Examples:**

```javascript
board.getSquare("a1").rankBos //"1"
board.getSquare("a8").rankBos //"8"
board.getSquare("e4").rankBos //"4"
```

---

### `square.fileBos`

**squareFileBos**: File in board notation.

**Type:** `String` — `"a"` to `"h"`

**Examples:**

```javascript
board.getSquare("a1").fileBos //"a"
board.getSquare("h1").fileBos //"h"
board.getSquare("e4").fileBos //"e"
```

---

### `square.bal`

**squareBal**: Piece letter with case (lowercase = black, uppercase = white, `"*"` = empty).

**Type:** `String` — `"k"`, `"q"`, `"r"`, `"b"`, `"n"`, `"p"`, `"*"`, `"P"`, `"N"`, `"B"`, `"R"`, `"Q"`, `"K"`

**Examples:**

```javascript
board.getSquare("e1").bal //"K"
board.getSquare("e8").bal //"k"
board.getSquare("e4").bal //"*"
```

---

### `square.absBal`

**squareAbsBal**: Piece letter uppercase (`"*"` = empty).

**Type:** `String` — `"*"`, `"P"`, `"N"`, `"B"`, `"R"`, `"Q"`, `"K"`

**Examples:**

```javascript
board.getSquare("e1").absBal //"K"
board.getSquare("e8").absBal //"K"
board.getSquare("e4").absBal //"*"
```

---

### `square.val`

**squareVal**: Piece value with sign (positive = white, negative = black, 0 = empty).

**Type:** `Number` — `-6` to `6`

**Examples:**

```javascript
board.getSquare("e1").val //6
board.getSquare("e8").val //-6
board.getSquare("e2").val //1
board.getSquare("e4").val //0
```

---

### `square.absVal`

**squareAbsVal**: Absolute piece value.

**Type:** `Number` — `0` to `6`

**Examples:**

```javascript
board.getSquare("e1").absVal //6
board.getSquare("e8").absVal //6
board.getSquare("e2").absVal //1
board.getSquare("e4").absVal //0
```

---

### `square.className`

**squareClassName**: CSS class name for the piece.

**Type:** `String` — `"bk"`, `"bq"`, `"br"`, `"bb"`, `"bn"`, `"bp"`, `""`, `"wp"`, `"wn"`, `"wb"`, `"wr"`, `"wq"`, `"wk"`

**Examples:**

```javascript
board.getSquare("e1").className //"wk"
board.getSquare("e8").className //"bk"
board.getSquare("e4").className //""
```

---

### `square.sign`

**squareSign**: Piece sign (1 = white, -1 = black or empty).

**Type:** `Number` — `-1` or `1`

**Examples:**

```javascript
board.getSquare("e1").sign //1
board.getSquare("e8").sign //-1
board.getSquare("e4").sign //-1
```

---

### `square.isEmptySquare`

`true` when the **square abs val** is `0`.

**Type:** `Boolean`

**Examples:**

```javascript
board.getSquare("e1").isEmptySquare //false
board.getSquare("e4").isEmptySquare //true
```

---

### `square.isPawn`

`true` when the **square abs val** is `1`.

**Type:** `Boolean`

**Examples:**

```javascript
board.getSquare("e2").isPawn //true
board.getSquare("e1").isPawn //false
```

---

### `square.isKnight`

`true` when the **square abs val** is `2`.

**Type:** `Boolean`

**Examples:**

```javascript
board.getSquare("b1").isKnight //true
board.getSquare("e1").isKnight //false
```

---

### `square.isBishop`

`true` when the **square abs val** is `3`.

**Type:** `Boolean`

**Examples:**

```javascript
board.getSquare("c1").isBishop //true
board.getSquare("e1").isBishop //false
```

---

### `square.isRook`

`true` when the **square abs val** is `4`.

**Type:** `Boolean`

**Examples:**

```javascript
board.getSquare("a1").isRook //true
board.getSquare("e1").isRook //false
```

---

### `square.isQueen`

`true` when the **square abs val** is `5`.

**Type:** `Boolean`

**Examples:**

```javascript
board.getSquare("d1").isQueen //true
board.getSquare("e1").isQueen //false
```

---

### `square.isKing`

`true` when the **square abs val** is `6`.

**Type:** `Boolean`

**Examples:**

```javascript
board.getSquare("e1").isKing //true
board.getSquare("d1").isKing //false
```


<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>
