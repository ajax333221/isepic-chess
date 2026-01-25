<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>

# Ic Methods

Isepic Chess library `isepic-chess.js` has the following available methods.

## Quick Reference

| Method | Returns | UI? | Brief |
|--------|---------|-----|-------|
| [`Ic.setSilentMode()`](#icsetsilentmodemuteconsole) | - | - | Turns on/off the silent mode to hide/show console.log()... |
| [`Ic.isLegalFen()`](#icislegalfenfen) | `Boolean` | - | Tests the validity of a fen string. |
| [`Ic.getBoard()`](#icgetboardboard) | **board** | - | Returns a board. |
| [`Ic.toVal()`](#ictovalqal) | **squareVal** | - | Converts the input to a square val. |
| [`Ic.toAbsVal()`](#ictoabsvalqal) | **squareAbsVal** | - | Converts the input to a square abs val. |
| [`Ic.toBal()`](#ictobalqal) | **squareBal** | - | Converts the input to a square bal. |
| [`Ic.toAbsBal()`](#ictoabsbalqal) | **squareAbsBal** | - | Converts the input to a square abs bal. |
| [`Ic.toClassName()`](#ictoclassnameqal) | **squareClassName** | - | Converts the input to a square class name. |
| [`Ic.toBos()`](#ictobosqos) | **squareBos** | - | Converts the input to a square bos. |
| [`Ic.toPos()`](#ictoposqos) | **squarePos** | - | Converts the input to a square pos. |
| [`Ic.getSign()`](#icgetsignzal) | **squareSign** | - | Infers the square sign from a Boolean or a square qal. |
| [`Ic.getRankPos()`](#icgetrankposqos) | **squareRankPos** | - | Converts the input to a square rank pos. |
| [`Ic.getFilePos()`](#icgetfileposqos) | **squareFilePos** | - | Converts the input to a square file pos. |
| [`Ic.getRankBos()`](#icgetrankbosqos) | **squareRankBos** | - | Converts the input to a square rank bos. |
| [`Ic.getFileBos()`](#icgetfilebosqos) | **squareFileBos** | - | Converts the input to a square file bos. |
| [`Ic.isInsideBoard()`](#icisinsideboardqos) | `Boolean` | - | Test to see if a square is valid or not. |
| [`Ic.sameSquare()`](#icsamesquareqos1-qos2) | `Boolean` | - | Test to see if two squares evaluate to the same square ... |
| [`Ic.countPieces()`](#iccountpiecesfen) | `Object` | - | Returns the total of each piece for white and black. |
| [`Ic.countLightDarkBishops()`](#iccountlightdarkbishopsfen) | `Object` | - | Returns the total of light and dark bishops for white a... |
| [`Ic.removeBoard()`](#icremoveboardboard) | `Boolean` | - | Removes a board completely. |
| [`Ic.isEqualBoard()`](#icisequalboardleftboard-rightboard) | `Boolean` | - | Tests for the equality of the board properties <sup>(ex... |
| [`Ic.cloneBoard()`](#iccloneboardtoboard-fromboard) | `Boolean` | ✓ | Clones the board properties <sup>(except for board.boar... |
| [`Ic.initBoard()`](#icinitboardp) | **board** | ✓ | Initializes/overwrites a board. |
| [`Ic.fenApply()`](#icfenapplyfen-fnname-args-p) | `(mixed results)` | - | Calls one of the allowed board methods (listed below) o... |
| [`Ic.fenGet()`](#icfengetfen-props-p) | `Object` | - | Get board properties (except for board.boardName) from ... |
| [`Ic.getBoardNames()`](#icgetboardnames) | `Array` | - | Returns a board names array. |

## Method Details

---

### `Ic.setSilentMode(muteConsole)`

Turns on/off the **silent mode** to hide/show `console.log()` messages.

The **slient mode** is initially turned on to prevent all console messages that could be emitted by the library.

<details>
<summary><strong>Parameters</strong></summary>

- `muteConsole` `(Boolean)`

</details>

**Returns:**

*None*

**Examples:**

```javascript
Ic.setSilentMode(true)
Ic.setSilentMode(false)
```

---

### `Ic.isLegalFen(fen)`

Tests the validity of a **fen** string.

No support for **Fischer random chess** (it will likely misclassify positions from this chess variant).

<details>
<summary><strong>Parameters</strong></summary>

- `fen` `(String)`

</details>

**Returns:**

- `Boolean`

**Examples:**

```javascript
Ic.isLegalFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") //true
Ic.isLegalFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -") //true
Ic.isLegalFen("0invalidfen0") //false
```

---

### `Ic.getBoard(board)`

Returns a **board**.

<details>
<summary><strong>Parameters</strong></summary>

- `board`
  - **boardName** `(String)`
  - **board** `(Object)`

</details>

**Returns:**

- *On success:*
  - **board** `(Object)`
- *On error:*
  - `null`

**Examples:**

```javascript
Ic.getBoard(myboard) //Object{...}
Ic.getBoard(nonexistent) //null
Ic.getBoard("myboard") //Object{...}
Ic.getBoard("nonexistent") //null
```

**See also:** [board properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-properties.md#board-properties), [board methods](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-methods.md#board-methods)

---

### `Ic.toVal(qal)`

Converts the input to a **square val**.

<details>
<summary><strong>Parameters</strong></summary>

- `qal`
  - **squareBal** `(String)`
  - **squareAbsBal** `(String)`
  - **squareVal** `(Number)`
  - **squareAbsVal** `(Number)`
  - **squareClassName** `(String)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareVal** `(Number)` — `-6 to 6`
- *On error:*
  - `Number` — `0`

**Examples:**

```javascript
Ic.toVal("b") //-3
Ic.toVal("K") //6
Ic.toVal("*") //0
Ic.toVal(-5) //-5
Ic.toVal("bq") //-5
Ic.toVal("err") //0
Ic.toVal(99) //6
Ic.toVal(-99) //-6
```

---

### `Ic.toAbsVal(qal)`

Converts the input to a **square abs val**.

<details>
<summary><strong>Parameters</strong></summary>

- `qal`
  - **squareBal** `(String)`
  - **squareAbsBal** `(String)`
  - **squareVal** `(Number)`
  - **squareAbsVal** `(Number)`
  - **squareClassName** `(String)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareAbsVal** `(Number)` — `0 to 6`
- *On error:*
  - `Number` — `0`

**Examples:**

```javascript
Ic.toAbsVal("b") //3
Ic.toAbsVal("K") //6
Ic.toAbsVal("*") //0
Ic.toAbsVal(-5) //5
Ic.toAbsVal("bq") //5
Ic.toAbsVal("err") //0
Ic.toAbsVal(99) //6
Ic.toAbsVal(-99) //6
```

---

### `Ic.toBal(qal)`

Converts the input to a **square bal**.

<details>
<summary><strong>Parameters</strong></summary>

- `qal`
  - **squareBal** `(String)`
  - **squareAbsBal** `(String)`
  - **squareVal** `(Number)`
  - **squareAbsVal** `(Number)`
  - **squareClassName** `(String)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareBal** `(String)` — `"k", "q", "r", "b", "n", "p", "*", "P", "N", "B", "R", "Q", "K"`
- *On error:*
  - `String` — `*`

**Examples:**

```javascript
Ic.toBal(-3) //"b"
Ic.toBal(6) //"K"
Ic.toBal(0) //"*"
Ic.toBal("q") //"q"
Ic.toBal("bq") //"q"
Ic.toBal("err") //"*"
Ic.toBal(99) //"K"
Ic.toBal(-99) //"k"
```

---

### `Ic.toAbsBal(qal)`

Converts the input to a **square abs bal**.

<details>
<summary><strong>Parameters</strong></summary>

- `qal`
  - **squareBal** `(String)`
  - **squareAbsBal** `(String)`
  - **squareVal** `(Number)`
  - **squareAbsVal** `(Number)`
  - **squareClassName** `(String)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareAbsBal** `(String)` — `"*", "P", "N", "B", "R", "Q", "K"`
- *On error:*
  - `String` — `*`

**Examples:**

```javascript
Ic.toAbsBal(-3) //"B"
Ic.toAbsBal(6) //"K"
Ic.toAbsBal(0) //"*"
Ic.toAbsBal("q") //"Q"
Ic.toAbsBal("bq") //"Q"
Ic.toAbsBal("err") //"*"
Ic.toAbsBal(99) //"K"
Ic.toAbsBal(-99) //"K"
```

---

### `Ic.toClassName(qal)`

Converts the input to a **square class name**.

<details>
<summary><strong>Parameters</strong></summary>

- `qal`
  - **squareBal** `(String)`
  - **squareAbsBal** `(String)`
  - **squareVal** `(Number)`
  - **squareAbsVal** `(Number)`
  - **squareClassName** `(String)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareClassName** `(String)` — `"bk", "bq", "br", "bb", "bn", "bp", "", "wp", "wn", "wb", "wr", "wq", "wk"`
- *On error:*
  - `String` — `""`

**Examples:**

```javascript
Ic.toClassName("b") //"bb"
Ic.toClassName("K") //"wk"
Ic.toClassName("*") //""
Ic.toClassName(-5) //"bq"
Ic.toClassName("bq") //"bq"
Ic.toClassName("err") //""
Ic.toClassName(99) //"wk"
Ic.toClassName(-99) //"bk"
```

---

### `Ic.toBos(qos)`

Converts the input to a **square bos**.

<details>
<summary><strong>Parameters</strong></summary>

- `qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareBos** `(String)` — `"a1" to "h8"`
- *On error:*
  - `null`

**Examples:**

```javascript
Ic.toBos([7, 0]) //"a1"
Ic.toBos([0, 0]) //"a8"
Ic.toBos([7, 7]) //"h1"
Ic.toBos([0, 7]) //"h8"
Ic.toBos("B2") //"b2"
```

---

### `Ic.toPos(qos)`

Converts the input to a **square pos**.

<details>
<summary><strong>Parameters</strong></summary>

- `qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squarePos** `(Array)` — `[0-7, 0-7]`
- *On error:*
  - `null`

**Examples:**

```javascript
Ic.toPos("a1") //[7, 0]
Ic.toPos("a8") //[0, 0]
Ic.toPos("h1") //[7, 7]
Ic.toPos("h8") //[0, 7]
Ic.toPos([6, 1]) //[6, 1]
```

---

### `Ic.getSign(zal)`

Infers the **square sign** from a Boolean or a square **qal**.

Boolean value `true` returns a negative sign (`-1`) and `false` a positive sign (`1`), the Boolean is meant to be the answer to *"is black the active color?"*.

Any non-Boolean value will pass through `toVal()` and have its **square val** tested to a greater-than-zero comparison. White pieces have a positive sign (`1`) and empty squares/black pieces a negative sign (`-1`).

<details>
<summary><strong>Parameters</strong></summary>

- `zal`
  - `Boolean`
  - `qal`
    - **squareBal** `(String)`
    - **squareAbsBal** `(String)`
    - **squareVal** `(Number)`
    - **squareAbsVal** `(Number)`
    - **squareClassName** `(String)`
    - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareSign** `(Number)` — `-1 or 1`
- *On error:*
  - `Number` — `-1`

**Examples:**

```javascript
Ic.getSign("q") //-1
Ic.getSign("Q") //1
Ic.getSign(-5) //-1
Ic.getSign(5) //1
Ic.getSign(true) //-1
Ic.getSign(false) //1
Ic.getSign("bq") //-1
Ic.getSign("wq") //1
Ic.getSign("err") //-1
```

---

### `Ic.getRankPos(qos)`

Converts the input to a **square rank pos**.

<details>
<summary><strong>Parameters</strong></summary>

- `qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareRankPos** `(Number)` — `0-7`
- *On error:*
  - `null`

**Examples:**

```javascript
Ic.getRankPos("a1") //7
Ic.getRankPos("a8") //0
Ic.getRankPos("h1") //7
Ic.getRankPos("h8") //0
Ic.getRankPos([3, 6]) //3
Ic.getRankPos([6, 3]) //6
```

---

### `Ic.getFilePos(qos)`

Converts the input to a **square file pos**.

<details>
<summary><strong>Parameters</strong></summary>

- `qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareFilePos** `(Number)` — `0-7`
- *On error:*
  - `null`

**Examples:**

```javascript
Ic.getFilePos("a1") //0
Ic.getFilePos("a8") //0
Ic.getFilePos("h1") //7
Ic.getFilePos("h8") //7
Ic.getFilePos([3, 6]) //6
Ic.getFilePos([6, 3]) //3
```

---

### `Ic.getRankBos(qos)`

Converts the input to a **square rank bos**.

<details>
<summary><strong>Parameters</strong></summary>

- `qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareRankBos** `(String)` — `1-8`
- *On error:*
  - `null`

**Examples:**

```javascript
Ic.getRankBos("a1") //"1"
Ic.getRankBos("a8") //"8"
Ic.getRankBos("h1") //"1"
Ic.getRankBos("h8") //"8"
Ic.getRankBos([3, 6]) //"5"
Ic.getRankBos([6, 3]) //"2"
```

---

### `Ic.getFileBos(qos)`

Converts the input to a **square file bos**.

<details>
<summary><strong>Parameters</strong></summary>

- `qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - **squareFileBos** `(String)` — `a-h`
- *On error:*
  - `null`

**Examples:**

```javascript
Ic.getFileBos("a1") //"a"
Ic.getFileBos("a8") //"a"
Ic.getFileBos("h1") //"h"
Ic.getFileBos("h8") //"h"
Ic.getFileBos([3, 6]) //"g"
Ic.getFileBos([6, 3]) //"d"
```

---

### `Ic.isInsideBoard(qos)`

Test to see if a square is valid or not.

<details>
<summary><strong>Parameters</strong></summary>

- `qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:**

- `Boolean`

**Examples:**

```javascript
Ic.isInsideBoard("a1") //true
Ic.isInsideBoard("a9") //false
Ic.isInsideBoard("i3") //false
Ic.isInsideBoard([7, 7]) //true
Ic.isInsideBoard([8, 8]) //false
```

---

### `Ic.sameSquare(qos1, qos2)`

Test to see if two **square**s evaluate to the same **square** or not.

<details>
<summary><strong>Parameters</strong></summary>

- `qos1`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`
- `qos2`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:**

- *On success:*
  - `Boolean`
- *On error:*
  - `Boolean` — `false`

**Examples:**

```javascript
Ic.sameSquare("a1", "a1") //true
Ic.sameSquare("d2", [6, 3]) //true
Ic.sameSquare([4, 5], [5, 4]) //false
```

---

### `Ic.countPieces(fen)`

Returns the total of each piece for white and black.

The **fen** doesn't need to be valid (it can be any string and it will stop after a white space or the end of the string).

<details>
<summary><strong>Parameters</strong></summary>

- `fen` `(String)`

</details>

**Returns:**

- *On success:*
  - `Object` — `{w: {...}, b: {...}}`
- *On error:*
  - `Object` — `{w: {p: 0, n: 0, b: 0, r: 0, q: 0, k: 0}, b: {p: 0, n: 0, b: 0, r: 0, q: 0, k: 0}}`

**Examples:**

```javascript
Ic.countPieces(defaultFen) //{w: {p: 8, n: 2, b: 2, r: 2, q: 1, k: 1}, b: {p: 8, n: 2, b: 2, r: 2, q: 1, k: 1}}
Ic.countPieces("badFenGetsParsedAnyway up until first space") //{w: {p: 1, n: 0, b: 0, r: 0, q: 0, k: 0}, b: {p: 0, n: 2, b: 1, r: 1, q: 0, k: 0}}
```

---

### `Ic.countLightDarkBishops(fen)`

Returns the total of light and dark bishops for white and black.

The **fen** doesn't need to be valid (it can be any string and it will stop after a white space or the end of the string).

<details>
<summary><strong>Parameters</strong></summary>

- `fen` `(String)`

</details>

**Returns:**

- *On success:*
  - `Object` — `{w: {...}, b: {...}}`
- *On error:*
  - `Object` — `{w: {lightSquaredBishops: 0, darkSquaredBishops: 0}, b: {lightSquaredBishops: 0, darkSquaredBishops: 0}}`

**Examples:**

```javascript
Ic.countLightDarkBishops(defaultFen) //{w: {lightSquaredBishops: 1, darkSquaredBishops: 1}, b: {lightSquaredBishops: 1, darkSquaredBishops: 1}}
Ic.countLightDarkBishops("badFenGetsParsedAnyway up until first space") //{w: {lightSquaredBishops: 0, darkSquaredBishops: 0}, b: {lightSquaredBishops: 1, darkSquaredBishops: 0}}
```

---

### `Ic.removeBoard(board)`

Removes a **board** completely.

<details>
<summary><strong>Parameters</strong></summary>

- `board`
  - **boardName** `(String)`
  - **board** `(Object)`

</details>

**Returns:**

- `Boolean`

**Examples:**

```javascript
Ic.removeBoard(myboard) //true
Ic.removeBoard(nonexistent) //false
Ic.removeBoard("myboard") //true
Ic.removeBoard("nonexistent") //false
```

---

### `Ic.isEqualBoard(leftBoard, rightBoard)`

Tests for the equality of the [board properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-properties.md#board-properties) <sup>(except for `board.boardName`)</sup> between two **board**s.

<details>
<summary><strong>Parameters</strong></summary>

- `leftBoard`
  - **boardName** `(String)`
  - **board** `(Object)`
- `rightBoard`
  - **boardName** `(String)`
  - **board** `(Object)`

</details>

**Returns:**

- *On success:*
  - `Boolean`
- *On error:*
  - `Boolean` — `false`

**Examples:**

```javascript
Ic.isEqualBoard("board", "board_copy") //true
Ic.isEqualBoard(same_board, same_board) //true
Ic.isEqualBoard("board", "other") //false
Ic.isEqualBoard(other_board, "nonexistent") //false
```

> ⚠️ **Possible errors:**
> - the *left board* is not found.
> - the *right board* is not found.

---

### `Ic.cloneBoard(toBoard, fromBoard)`

> 🔄 **Triggers UI refresh**

Clones the [board properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-properties.md#board-properties) <sup>(except for `board.boardName`)</sup> of a **board** to another **board**.

<details>
<summary><strong>Parameters</strong></summary>

- `toBoard`
  - **boardName** `(String)`
  - **board** `(Object)`
- `fromBoard`
  - **boardName** `(String)`
  - **board** `(Object)`

</details>

**Returns:**

- *On success:*
  - `Boolean` — `true`
- *On error:*
  - `Boolean` — `false`

**Examples:**

```javascript
Ic.cloneBoard(to_board, from_board) //true
Ic.cloneBoard(to_board, from_nonexistent) //false
Ic.cloneBoard("to_nonexistent", from_board) //false
Ic.cloneBoard(to_nonexistent, "from_nonexistent") //false
```

> ⚠️ **Possible errors:**
> - the *to board* is not found.
> - the *from board* is not found.
> - attempting to clone a board with itself.

---

### `Ic.initBoard(p?)`

> 🔄 **Triggers UI refresh**

Initializes/overwrites a **board**.

`isRotated = true` rotates the **board** to be displayed as black view.

`isPuzzleMode = true` changes the mode to **puzzle mode** (work in progress).

`skipFenValidation = true` skips the fen validation. This should only be used if the fen is known to pass the fen tests of `isepic-chess.js` or the fen was generated by `isepic-chess.js`.

`isHidden = true` prevents visual display or anything DOM-related when **isepic-chess-ui.js** is present (the flag becomes irrelevant otherwise).

`validOrBreak = true` (when loading a `pgn`) prevents having partially parsed games when a move is not recognized as playable, ensuring that either `null` or a **board** with the complete **original pgn** is returned.

`validOrBreak = true` (when loading a `uci`) prevents having partially parsed games when a move is not recognized as playable, ensuring that either `null` or a **board** with the complete **original uci** is returned.

`validOrBreak = true` (when loading a `fen` and not parsing a game `pgn` or `uci`) prevents the use of **default fen position**s when the **original fen** fails, ensuring that either `null` or a **board** with the **original fen** is returned.

The Boolean options (`isRotated`, `isPuzzleMode`, `skipFenValidation`, `isHidden` and `validOrBreak`) default to `false` when not set to a Boolean value of `true`.

`moveIndex` can be specified to set a `board.currentMove` after a game is parsed, if not specified it will result in the last parsed move `(board.moveList.length-1)`. When not parsing a game (`pgn` or `uci`), this parameter becomes irrelevant because the **current move** index will always be `0` since no moves would have been played/parsed.

`promoteTo` passes through `toAbsVal()`, any empty or invalid values will turn to `0` and default to `5` (queen), valid values out of bounds will stop at min of `2` (bishop) and max of `5` (queen).

`manualResult` can be set to `"*", "1-0", "0-1" or "1/2-1/2"` to change the default **board property** of `board.manualResult` of `"*"`. When used at the same time of `pgn`, this will have higher precedence than the attempts to parse the game result from the `pgn`.

If `boardName` is not a String (or is one but resolves to `""` after removing spaces), a **random board name** will be generated and used.

The **board name** will have any non-Alphanumeric values turned into underscores.

When using a **board name** that is already in use, the **board** with that **board name** will be used instead of creating a new **board** (old references to that **board** will continue to work).

`fen` can be mixed together with `pgn` and `uci` (`fen` will take precedence over the `pgn` **FEN tag**). The **default fen position** will be used if no **fen** is supplied.

If both `pgn` and `uci` are supplied, the **pgn** will take precedence and the **uci** will be ignored.

<details>
<summary><strong>Parameters</strong></summary>

- `p` `(Object)` — *optional*
  - `boardName` `(String)` — *optional*
  - `pgn` `(String)` — *optional*
  - `uci` `(String)` — *optional*
  - `fen` `(String)` — *optional*
  - `moveIndex` `(Number)` — *optional*
  - `isRotated` `(Boolean)` — *optional*
  - `isPuzzleMode` `(Boolean)` — *optional*
  - `skipFenValidation` `(Boolean)` — *optional*
  - `isHidden` `(Boolean)` — *optional*
  - `promoteTo` — *optional*
    - **squareBal** `(String)`
    - **squareAbsBal** `(String)`
    - **squareVal** `(Number)`
    - **squareAbsVal** `(Number)`
    - **squareClassName** `(String)`
    - **square** `(Object)`
  - `manualResult` `(String)` — *optional*
  - `validOrBreak` `(Boolean)` — *optional*

</details>

**Returns:**

- *On success:*
  - **board** `(Object)`
- *On error:*
  - `null`

**Examples:**

```javascript
Ic.initBoard({boardName: "main"}) //Object{...}
Ic.initBoard({fen: "8/k7/P7/K7/8/8/8/8 b - - 0 1", isRotated: true, promoteTo: "b"}) //Object{...}
Ic.initBoard({pgn: "0invalidpgn0", validOrBreak: true}) //null
Ic.initBoard({uci: "0invaliduci0", validOrBreak: true}) //null
Ic.initBoard({fen: "0invalidfen0", validOrBreak: true}) //null
```

**See also:** [board properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-properties.md#board-properties), [board methods](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-methods.md#board-methods)

> ⚠️ **Possible errors:**
> - `validOrBreak` is `true` and the *pgn* fails the parsing.
> - `validOrBreak` is `true` and the *uci* fails the parsing.
> - `validOrBreak` is `true` and the *fen* fails the **basic fen test**.
> - `validOrBreak` is `true` and the *fen* fails the **refined fen test**.

---

### `Ic.fenApply(fen, fnName?, args?, p?)`

Calls one of the allowed **board methods** (listed below) on a **temporal board** and returns the result.

The list of allowed `fnName` (String): `"playMove"`, `"playMoves"`, `"playRandomMove"`, `"legalMoves"`, `"legalFenMoves"`, `"legalSanMoves"`, `"legalUciMoves"`, `"isLegalMove"`, `"isLegalFen"`, `"getCheckmateMoves"`, `"getDrawMoves"`, `"getSquare"`, `"attackersFromActive"`, `"attackersFromNonActive"`, `"ascii"`, `"boardHash"`, `"countPieces"`, `"countLightDarkBishops"`.

`"isLegalFen"` is not a real **board method** and any error in the creation of the **temporal board** in `Ic.initBoard()` will be supressed in this call.

If **fnName** is not supplied, the default value is `"isLegalFen"` which returns the validity of **fen**.

The **args** parameter is optional in the sense that measures were taken to prevent crashes, but the function to be applied will probably be expecting real arguments.

The **p** options (`isRotated`, `promoteTo` and `skipFenValidation`) are passed to `Ic.initBoard()` when creating the **temporal board**.

<details>
<summary><strong>Parameters</strong></summary>

- `fen` `(String)`
- `fnName` `(String)` — *optional*
- `args` `(Array)` — *optional*
- `p` `(Object)` — *optional*
  - `isRotated` `(Boolean)` — *optional*
  - `promoteTo` — *optional*
    - **squareBal** `(String)`
    - **squareAbsBal** `(String)`
    - **squareVal** `(Number)`
    - **squareAbsVal** `(Number)`
    - **squareClassName** `(String)`
    - **square** `(Object)`
  - `skipFenValidation` `(Boolean)` — *optional*

</details>

**Returns:**

- *On success:*
  - `(mixed results)`
- *On error:*
  - `(mixed results)`

**Examples:**

```javascript
Ic.fenApply("r1bqkbnr/pppp2pp/2n2p2/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 1 4", "ascii") //"..."
Ic.fenApply("r1bqkbnr/pppp2pp/2n2p2/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 1 4") //true
Ic.fenApply("0invalidfen0") //false
Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "playMove", ["c2_a2", {delimiter: "_"}]) //Object{...}
Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "0invalidfnname0", ["a1"]) //null
```

> ⚠️ **Possible errors:**
> - (mixed reasons)

---

### `Ic.fenGet(fen, props?, p?)`

Get [board properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-properties.md#board-properties) (except for `board.boardName`) from a **fen**.

If **props** is not supplied (or resolves to empty), then all the **board properties** (except for `board.boardName`) will be returned by default.

The **board properties** are **case-sensitive**.

When passing a **string list**, this must be **space-separated** (not comma-separated).

Duplicated **board properties** will not result in errors and only the first occurrence will be used.

The **p** option `skipFenValidation` is passed to `Ic.initBoard()` when creating the **temporal board**.

<details>
<summary><strong>Parameters</strong></summary>

- `fen` `(String)`
- `props` — *optional*
  - **strList** `(String)`
  - **arrList** `(Array)`
- `p` `(Object)` — *optional*
  - `skipFenValidation` `(Boolean)` — *optional*

</details>

**Returns:**

- *On success:*
  - `Object` — `{propA: valA, propB: valB, ..., propZ: valZ}`
- *On error:*
  - `null`

**Examples:**

```javascript
Ic.fenGet("6k1/b7/8/8/5p2/7p/7P/7K w - - 0 54", "isStalemate inDraw") //{isStalemate: true, inDraw: true}
Ic.fenGet("6k1/b7/8/8/5p2/7p/7P/7K w - - 0 54", ["halfMove", "fullMove"]) //{halfMove: 0, fullMove: 54}
Ic.fenGet("0invalidfen0", "isCheck") //null
Ic.fenGet("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") //Object{...}
Ic.fenGet("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "fen 0invalidprop0") //null
```

> ⚠️ **Possible errors:**
> - `fen` is an **invalid fen**.
> - an **invalid property** was found in `props`.

---

### `Ic.getBoardNames()`

Returns a **board names array**.

The **board**s with `isHidden = true` are also included.

**Parameters:** None

**Returns:**

- **boardNamesArray** `(Array)`

**Examples:**

```javascript
Ic.getBoardNames() //["main", "other", "other_copy", "hidden_board", "resume_from_fen"]
Ic.getBoardNames() //[]
```


<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>
