isepic-chess.js
================

`isepic-chess.js` is a chess utility library written in JavaScript, it provides features like legal moves calculation, FEN validation, SAN parsing, etc. (see: [Features](https://github.com/ajax333221/isepic-chess#features)).

> **Note:** As of `v2.6.0` <sup>(April, 2020)</sup>, everything visual (HTML board, piece animations, etc.) is now developed separately at [isepic-chess-ui (GitHub repo)](https://github.com/ajax333221/isepic-chess-ui), this means that the core library no longer depends on jQuery (or any other dependency).

Table of contents
-------------

- [isepic-chess.js](https://github.com/ajax333221/isepic-chess#isepic-chessjs)
- [Table of contents](https://github.com/ajax333221/isepic-chess#table-of-contents)
- [Installation](https://github.com/ajax333221/isepic-chess#installation)
- [Node.js example](https://github.com/ajax333221/isepic-chess#nodejs-example)
- [Demo](https://github.com/ajax333221/isepic-chess#demo-from-isepic-chess-ui)
- [Features](https://github.com/ajax333221/isepic-chess#features)
- [Documentation](https://github.com/ajax333221/isepic-chess#documentation)
	- [Ic methods](https://github.com/ajax333221/isepic-chess#list-of-icmethods)
	- [Board properties](https://github.com/ajax333221/isepic-chess#list-of-boardproperties)
	- [Board methods](https://github.com/ajax333221/isepic-chess#list-of-boardmethods)
	- [Square properties](https://github.com/ajax333221/isepic-chess#list-of-squareproperties)
- [To do](https://github.com/ajax333221/isepic-chess#to-do)
- [Copyright and license](https://github.com/ajax333221/isepic-chess#copyright-and-license)

Installation
-------------

```
# NPM
npm install isepic-chess
```
Then: `const {Ic} = require("isepic-chess");`

<hr>

```
# Web browser
<script src="./isepic-chess.js"></script>
```
The variable `Ic` will be added to window.

Node.js example
-------------

```
const {Ic} = require("isepic-chess");

var board, ascii_diagram, example_pgn;

example_pgn = `[Event "example game"]
[SetUp "1"]
[FEN "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"]

2. Qf3 Nc6 3. Bc4`;

board = Ic.initBoard({
  boardName : "example_board",
  pgn : example_pgn
});

// board.currentMove is set back to 0 when a PGN is parsed,
// to play moves from the end we navigate to the end.
board.navLast();

// same than passing a SAN move of "Nd4"
board.playMove("c6-d4");

// "Qxf7", "Qxf7++", "Q3xf7+", "Qfxf7", "Qf3xf7 {comment}", etc
board.playMove("Qxf7#");

ascii_diagram = board.ascii();

module.exports = (ascii_diagram+"\nIs Checkmate? = "+board.isCheckmate);
//    +------------------------+
//  8 | r  .  b  q  k  b  n  r |
//  7 | p  p  p  p  .  Q  p  p |
//  6 | .  .  .  .  .  .  .  . |
//  5 | .  .  .  .  p  .  .  . |
//  4 | .  .  B  n  P  .  .  . |
//  3 | .  .  .  .  .  .  .  . |
//  2 | P  P  P  P  .  P  P  P |
//  1 | R  N  B  .  K  .  N  R |
//    +------------------------+
//      a  b  c  d  e  f  g  h
// 
// Is Checkmate? = true

/* for a graphical user interface see https://github.com/ajax333221/isepic-chess-ui */
```

Demo <sup>(from [isepic-chess-ui](https://github.com/ajax333221/isepic-chess-ui))</sup>
-------------

https://ajax333221.github.io/isepic-chess-ui/

Features
-------------

- PGN viewer
- Advanced FEN validation
- Get legal moves
- Material difference
- Multiple boards at once
- Pawn promotion options
- Check / checkmate / draw detection
- SAN parsing
- ASCII diagram
- Extense parameter-flexibility

Documentation
-------------

#### List of `Ic.<methods>(...)`:

Isepic Chess library `isepic-chess.js` has the following available methods.

Function | Parameters | Return | Board refresh? | Description
-------- | ---------- | ------ | ---------------- | -----------
**setSilentMode**(<br>*muteConsole*<br>) | <ul><li>muteConsole (Boolean)</li></ul> | - | No | Turns on/off the **silent mode** to hide/show `console.log()` messages.<br><br>The **slient mode** is initially turned on to prevent all console messages that could be emitted by the library.<hr>Examples:<ul><li>`Ic.setSilentMode(true)`</li><li>`Ic.setSilentMode(false)`</li></ul>
**getBoard**(<br>*board*<br>) | <ul><li>board:<ul><li>**boardName** (String)</li><li>**board** (Object)</li></ul></li></ul> | Success:<ul><li>**board** (Object)</li></ul><hr>Error:<ul><li>null</li></ul> | No | Returns a :pushpin:**board**.<hr>Examples:<ul><li>`Ic.getBoard(myboard) //Object{...}`</li><li>`Ic.getBoard(nonexistent) //null`</li><li>`Ic.getBoard("myboard") //Object{...}`</li><li>`Ic.getBoard("nonexistent") //null`</li></ul><hr>:pushpin:Board documentation links:<ul><li>[board properties](https://github.com/ajax333221/isepic-chess#list-of-boardproperties).</li><li>[board methods](https://github.com/ajax333221/isepic-chess#list-of-boardmethods).</li></ul>
**toVal**(<br>*qal*<br>) | <ul><li>qal:<ul><li>**squareBal** (String)</li><li>**squareAbsBal** (String)</li><li>**squareVal** (Number)</li><li>**squareAbsVal** (Number)</li><li>**squareClassName** (String)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareVal** (Number): `-6 to 6`</li></ul><hr>Error:<ul><li>Number: `0`</li></ul> | No | Converts the input to a **square val**.<hr>Examples:<ul><li>`Ic.toVal("b") //-3`</li><li>`Ic.toVal("K") //6`</li><li>`Ic.toVal("*") //0`</li><li>`Ic.toVal(-5) //-5`</li><li>`Ic.toVal("bq") //-5`</li><li>`Ic.toVal("err") //0`</li><li>`Ic.toVal(99) //6`</li><li>`Ic.toVal(-99) //-6`</li></ul>
**toAbsVal**(<br>*qal*<br>) | <ul><li>qal:<ul><li>**squareBal** (String)</li><li>**squareAbsBal** (String)</li><li>**squareVal** (Number)</li><li>**squareAbsVal** (Number)</li><li>**squareClassName** (String)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareAbsVal** (Number): `0 to 6`</li></ul><hr>Error:<ul><li>Number: `0`</li></ul> | No | Converts the input to a **square abs val**.<hr>Examples:<ul><li>`Ic.toAbsVal("b") //3`</li><li>`Ic.toAbsVal("K") //6`</li><li>`Ic.toAbsVal("*") //0`</li><li>`Ic.toAbsVal(-5) //5`</li><li>`Ic.toAbsVal("bq") //5`</li><li>`Ic.toAbsVal("err") //0`</li><li>`Ic.toAbsVal(99) //6`</li><li>`Ic.toAbsVal(-99) //6`</li></ul>
**toBal**(<br>*qal*<br>) | <ul><li>qal:<ul><li>**squareBal** (String)</li><li>**squareAbsBal** (String)</li><li>**squareVal** (Number)</li><li>**squareAbsVal** (Number)</li><li>**squareClassName** (String)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareBal** (String): `"k", "q", "r", "b", "n", "p", "*", "P", "N", "B", "R", "Q", "K"`</li></ul><hr>Error:<ul><li>String: `*`</li></ul> | No | Converts the input to a **square bal**.<hr>Examples:<ul><li>`Ic.toBal(-3) //"b"`</li><li>`Ic.toBal(6) //"K"`</li><li>`Ic.toBal(0) //"*"`</li><li>`Ic.toBal("q") //"q"`</li><li>`Ic.toBal("bq") //"q"`</li><li>`Ic.toBal("err") //"*"`</li><li>`Ic.toBal(99) //"K"`</li><li>`Ic.toBal(-99) //"k"`</li></ul>
**toAbsBal**(<br>*qal*<br>) | <ul><li>qal:<ul><li>**squareBal** (String)</li><li>**squareAbsBal** (String)</li><li>**squareVal** (Number)</li><li>**squareAbsVal** (Number)</li><li>**squareClassName** (String)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareAbsBal** (String): `"*", "P", "N", "B", "R", "Q", "K"`</li></ul><hr>Error:<ul><li>String: `*`</li></ul> | No | Converts the input to a **square abs bal**.<hr>Examples:<ul><li>`Ic.toAbsBal(-3) //"B"`</li><li>`Ic.toAbsBal(6) //"K"`</li><li>`Ic.toAbsBal(0) //"*"`</li><li>`Ic.toAbsBal("q") //"Q"`</li><li>`Ic.toAbsBal("bq") //"Q"`</li><li>`Ic.toAbsBal("err") //"*"`</li><li>`Ic.toAbsBal(99) //"K"`</li><li>`Ic.toAbsBal(-99) //"K"`</li></ul>
**toClassName**(<br>*qal*<br>) | <ul><li>qal:<ul><li>**squareBal** (String)</li><li>**squareAbsBal** (String)</li><li>**squareVal** (Number)</li><li>**squareAbsVal** (Number)</li><li>**squareClassName** (String)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareClassName** (String): `"bk", "bq", "br", "bb", "bn", "bp", "", "wp", "wn", "wb", "wr", "wq", "wk"`</li></ul><hr>Error:<ul><li>String: `""`</li></ul> | No | Converts the input to a **square class name**.<hr>Examples:<ul><li>`Ic.toClassName("b") //"bb"`</li><li>`Ic.toClassName("K") //"wk"`</li><li>`Ic.toClassName("*") //""`</li><li>`Ic.toClassName(-5) //"bq"`</li><li>`Ic.toClassName("bq") //"bq"`</li><li>`Ic.toClassName("err") //""`</li><li>`Ic.toClassName(99) //"wk"`</li><li>`Ic.toClassName(-99) //"bk"`</li></ul>
**toBos**(<br>*qos*<br>) | <ul><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareBos** (String): `"a1" to "h8"`</li></ul><hr>Error:<ul><li>null</li></ul> | No | Converts the input to a **square bos**.<hr>Examples:<ul><li>`Ic.toBos([7, 0]) //"a1"`</li><li>`Ic.toBos([0, 0]) //"a8"`</li><li>`Ic.toBos([7, 7]) //"h1"`</li><li>`Ic.toBos([0, 7]) //"h8"`</li><li>`Ic.toBos("B2") //"b2"`</li></ul>
**toPos**(<br>*qos*<br>) | <ul><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squarePos** (Array): `[0-7, 0-7]`</li></ul><hr>Error:<ul><li>null</li></ul> | No | Converts the input to a **square pos**.<hr>Examples:<ul><li>`Ic.toPos("a1") //[7, 0]`</li><li>`Ic.toPos("a8") //[0, 0]`</li><li>`Ic.toPos("h1") //[7, 7]`</li><li>`Ic.toPos("h8") //[0, 7]`</li><li>`Ic.toPos([6, 1]) //[6, 1]`</li></ul>
**getSign**(<br>*zal*<br>) | <ul><li>zal:<ul><li>Boolean</li><li>qal:<ul><li>**squareBal** (String)</li><li>**squareAbsBal** (String)</li><li>**squareVal** (Number)</li><li>**squareAbsVal** (Number)</li><li>**squareClassName** (String)</li><li>**square** (Object)</li></ul></li></ul></li></ul> | Success:<ul><li>**squareSign** (Number): `-1 or 1`</li></ul><hr>Error:<ul><li>Number: `-1`</li></ul> | No | Infers the **square sign** from a Boolean or a square **qal**.<br><br>Boolean value `true` returns a negative sign (`-1`) and `false` a positive sign (`1`), the Boolean is meant to be the answer to *"is black the active color?"*.<br><br>Any non-Boolean value will pass through `toVal()` and have its **square val** tested to a greater-than-zero comparison. White pieces have a positive sign (`1`) and empty squares/black pieces a negative sign (`-1`).<hr>Examples:<ul><li>`Ic.getSign("q") //-1`</li><li>`Ic.getSign("Q") //1`</li><li>`Ic.getSign(-5) //-1`</li><li>`Ic.getSign(5) //1`</li><li>`Ic.getSign(true) //-1`</li><li>`Ic.getSign(false) //1`</li><li>`Ic.getSign("bq") //-1`</li><li>`Ic.getSign("wq") //1`</li><li>`Ic.getSign("err") //-1`</li></ul>
**getRankPos**(<br>*qos*<br>) | <ul><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareRankPos** (Number): `0-7`</li></ul><hr>Error:<ul><li>null</li></ul> | No | Converts the input to a **square rank pos**.<hr>Examples:<ul><li>`Ic.getRankPos("a1") //7`</li><li>`Ic.getRankPos("a8") //0`</li><li>`Ic.getRankPos("h1") //7`</li><li>`Ic.getRankPos("h8") //0`</li><li>`Ic.getRankPos([3, 6]) //3`</li><li>`Ic.getRankPos([6, 3]) //6`</li></ul>
**getFilePos**(<br>*qos*<br>) | <ul><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareFilePos** (Number): `0-7`</li></ul><hr>Error:<ul><li>null</li></ul> | No | Converts the input to a **square file pos**.<hr>Examples:<ul><li>`Ic.getFilePos("a1") //0`</li><li>`Ic.getFilePos("a8") //0`</li><li>`Ic.getFilePos("h1") //7`</li><li>`Ic.getFilePos("h8") //7`</li><li>`Ic.getFilePos([3, 6]) //6`</li><li>`Ic.getFilePos([6, 3]) //3`</li></ul>
**getRankBos**(<br>*qos*<br>) | <ul><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareRankBos** (String): `1-8`</li></ul><hr>Error:<ul><li>null</li></ul> | No | Converts the input to a **square rank bos**.<hr>Examples:<ul><li>`Ic.getRankBos("a1") //"1"`</li><li>`Ic.getRankBos("a8") //"8"`</li><li>`Ic.getRankBos("h1") //"1"`</li><li>`Ic.getRankBos("h8") //"8"`</li><li>`Ic.getRankBos([3, 6]) //"5"`</li><li>`Ic.getRankBos([6, 3]) //"2"`</li></ul>
**getFileBos**(<br>*qos*<br>) | <ul><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**squareFileBos** (String): `a-h`</li></ul><hr>Error:<ul><li>null</li></ul> | No | Converts the input to a **square file bos**.<hr>Examples:<ul><li>`Ic.getFileBos("a1") //"a"`</li><li>`Ic.getFileBos("a8") //"a"`</li><li>`Ic.getFileBos("h1") //"h"`</li><li>`Ic.getFileBos("h8") //"h"`</li><li>`Ic.getFileBos([3, 6]) //"g"`</li><li>`Ic.getFileBos([6, 3]) //"d"`</li></ul>
**isInsideBoard**(<br>*qos*<br>) | <ul><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Boolean | No | Test to see if a square is valid or not.<hr>Examples:<ul><li>`Ic.isInsideBoard("a1") //true`</li><li>`Ic.isInsideBoard("a9") //false`</li><li>`Ic.isInsideBoard("i3") //false`</li><li>`Ic.isInsideBoard([7, 7]) //true`</li><li>`Ic.isInsideBoard([8, 8]) //false`</li></ul>
**sameSquare**(<br>*qos1*,<br>*qos2*<br>) | <ul><li>qos1:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li><li>qos2:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>Boolean</li></ul><hr>Error:<ul><li>Boolean: `false`</li></ul> | No | Test to see if two **square**s evaluate to the same **square** or not.<hr>Examples:<ul><li>`Ic.sameSquare("a1", "a1") //true`</li><li>`Ic.sameSquare("d2", [6, 3]) //true`</li><li>`Ic.sameSquare([4, 5], [5, 4]) //false`</li></ul>
**countPieces**(<br>*fen*<br>) | <ul><li>fen (String)</li></ul> | Success:<ul><li>Object: `{w:{...}, b:{...}}`</li></ul><hr>Error:<ul><li>Object: `{w:{p:0, n:0, b:0, r:0, q:0, k:0}, b:{p:0, n:0, b:0, r:0, q:0, k:0}}`</li></ul> | No | Returns the total of each piece for white and black.<br><br>The **fen** doesn't need to be valid (it can be any string and it will stop after a white space or the end of the string).<hr>Examples:<ul><li>`Ic.countPieces(defaultFen) //{w:{p:8, n:2, b:2, r:2, q:1, k:1}, b:{p:8, n:2, b:2, r:2, q:1, k:1}}`</li><li>`Ic.countPieces("badFenGetsParsedAnyway up until first space") //{w:{p:1, n:0, b:0, r:0, q:0, k:0}, b:{p:0, n:2, b:1, r:1, q:0, k:0}}`</li></ul>
**removeBoard**(<br>*board*<br>) | <ul><li>board:<ul><li>**boardName** (String)</li><li>**board** (Object)</li></ul></li></ul> | Boolean | No | Removes a **board** completely.<hr>Examples:<ul><li>`Ic.removeBoard(myboard) //true`</li><li>`Ic.removeBoard(nonexistent) //false`</li><li>`Ic.removeBoard("myboard") //true`</li><li>`Ic.removeBoard("nonexistent") //false`</li></ul>
**isEqualBoard**(<br>*leftBoard*,<br>*rightBoard*<br>) | <ul><li>leftBoard:<ul><li>**boardName** (String)</li><li>**board** (Object)</li></ul></li><li>rightBoard:<ul><li>**boardName** (String)</li><li>**board** (Object)</li></ul></li></ul> | Success:<ul><li>Boolean</li></ul><hr>:small_red_triangle_down:Error:<ul><li>Boolean: `false`</li></ul> | No | Tests for the equality of the [board properties](https://github.com/ajax333221/isepic-chess#list-of-boardproperties) <sup>(except for `board.boardName`)</sup> between two **board**s.<hr>Examples:<ul><li>`Ic.isEqualBoard("board", "board_copy") //true`</li><li>`Ic.isEqualBoard(same_board, same_board) //true`</li><li>`Ic.isEqualBoard("board", "other") //false`</li><li>`Ic.isEqualBoard(other_board, "nonexistent") //false`</li></ul><hr>:small_red_triangle_down:Error emits a `console.log(...)` when:<ul><li>the *left board* is not found.</li><li>the *right board* is not found.</li></ul>
**cloneBoard**(<br>*toBoard*,<br>*fromBoard*<br>) | <ul><li>toBoard:<ul><li>**boardName** (String)</li><li>**board** (Object)</li></ul></li><li>fromBoard:<ul><li>**boardName** (String)</li><li>**board** (Object)</li></ul></li></ul> | Success:<ul><li>Boolean: `true`</li></ul><hr>:small_red_triangle_down:Error:<ul><li>Boolean: `false`</li></ul> | Yes | Clones the [board properties](https://github.com/ajax333221/isepic-chess#list-of-boardproperties) <sup>(except for `board.boardName`)</sup> of a **board** to another **board**.<hr>Examples:<ul><li>`Ic.cloneBoard(to_board, from_board) //true`</li><li>`Ic.cloneBoard(to_board, from_nonexistent) //false`</li><li>`Ic.cloneBoard("to_nonexistent", from_board) //false`</li><li>`Ic.cloneBoard(to_nonexistent, "from_nonexistent") //false`</li></ul><hr>:small_red_triangle_down:Error emits a `console.log(...)` when:<ul><li>the *to board* is not found.</li><li>the *from board* is not found.</li><li>attempting to clone a board with itself.</li></ul>
**initBoard**(<br>*p*<br>) | <ul><li>:eight_pointed_black_star:p (Object):<ul><li>:eight_spoked_asterisk:boardName (String)</li><li>:eight_spoked_asterisk:pgn (String)</li><li>:eight_spoked_asterisk:fen (String)</li><li>:eight_spoked_asterisk:isRotated (Boolean)</li><li>:eight_spoked_asterisk:isHidden (Boolean)</li><li>:eight_spoked_asterisk:isUnlabeled (Boolean)</li><li>:eight_spoked_asterisk:promoteTo:<ul><li>**squareBal** (String)</li><li>**squareAbsBal** (String)</li><li>**squareVal** (Number)</li><li>**squareAbsVal** (Number)</li><li>**squareClassName** (String)</li><li>**square** (Object)</li></ul></li><li>:eight_spoked_asterisk:validOrBreak (Boolean)</li></ul></li></ul><hr>:eight_pointed_black_star:Optional Parameter<br>:eight_spoked_asterisk:Optional Object key | Success:<ul><li>**board** (Object)</li></ul><hr>:small_red_triangle_down:Error:<ul><li>null</li></ul> | Yes | Initializes/overwrites a :pushpin:**board**.<br><br>`isRotated = true` rotates the **board** to be displayed as black view.<br><br>`isHidden = true` prevents visual display or anything DOM-related when **isepic-chess-ui.js** is present (the flag becomes irrelevant otherwise).<br><br>`isUnlabeled = true` removes the **board labels** when **isepic-chess-ui.js** is present (the flag becomes irrelevant otherwise).<br><br>`validOrBreak = true` (when loading a **pgn**) prevents having partially parsed games when a move is not recognized as playable, ensuring that either `null` or a **board** with the complete **original pgn** is returned.<br><br>`validOrBreak = true` (when loading a **fen**) prevents the use of **default fen position**s when the **original fen** fails, ensuring that either `null` or a **board** with the **original fen** is returned.<br><br>The Boolean options (`isRotated`, `isHidden`, `isUnlabeled` and `validOrBreak`) default to `false` if they are not set a Boolean value of `true`.<br><br>`promoteTo` passes through `toAbsVal()`, any empty or invalid values will turn to `0` and default to `5` (queen), valid values out of bounds will stop at min of `2` (bishop) and max of `5` (queen).<br><br>If `boardName` is not a String (or is one but resolves to `""` after removing spaces), a **default board name** will be set (`board_<timestamp>`).<br><br>The **board name** will have any non-Alphanumeric values turned into underscores.<br><br>When using a **board name** that is already in use, the **board** with that **board name** will be used instead of creating a new **board** (old references to that **board** will continue to work).<br><br>`fen` and `pgn` can be mixed together (`fen` will take precedence over the PGN **FEN tag**). The **default fen position** will be used if no **fen** is supplied.<hr>Examples:<ul><li>`Ic.initBoard({ boardName : "main" }) //Object{...}`</li><li>`Ic.initBoard({ fen : "8/k7/P7/K7/8/8/8/8 b - - 0 1", isRotated : true, promoteTo : "b" }) //Object{...}`</li><li>`Ic.initBoard({ pgn : "0invalidpgn0", validOrBreak : true }) //null`</li><li>`Ic.initBoard({ fen : "0invalidfen0", validOrBreak : true }) //null`</li></ul><hr>:pushpin:Board documentation links:<ul><li>[board properties](https://github.com/ajax333221/isepic-chess#list-of-boardproperties).</li><li>[board methods](https://github.com/ajax333221/isepic-chess#list-of-boardmethods).</li></ul><hr>:small_red_triangle_down:Error emits a `console.log(...)` when:<ul><li>the *board* creation fails.</li><li>`validOrBreak` is `true` and the *pgn* fails the parsing.</li><li>`validOrBreak` is `true` and the *fen* fails the **basic fen test**.</li><li>`validOrBreak` is `true` and the *fen* fails the **refined fen test**.</li></ul>
**fenApply**(<br>*fen*,<br>`"legalMoves"`,<br>[<br>*initialQos*<br>]<br>) | <ul><li>fen (String)</li><li>`"legalMoves"` (String)</li><li>initialQos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**finalBosArray** (Array)</li></ul><hr>Error:<ul><li>Array: `[]`</li></ul> | No | Returns a **final bos array** with all the squares that a piece from an **initial qos** square can legally move to.<br><br>Passing an **initial qos** square with a **square val** of `0` or a **non active sign** will result in a `[]`.<hr>Examples:<ul><li>`Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2"]) //["d2", "b2", "a2"]`</li><li>`Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2"]) //[]`</li><li>`Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5"]) //["c6", "d7", "c4", "a6"]`</li><li>`Ic.fenApply("0invalidfen0", "legalMoves", ["a2"]) //[]`</li></ul>
**fenApply**(<br>*fen*,<br>`"legalSanMoves"`,<br>[<br>*initialQos*<br>]<br>) | <ul><li>fen (String)</li><li>`"legalSanMoves"` (String)</li><li>initialQos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**finalSanArray** (Array)</li></ul><hr>Error:<ul><li>Array: `[]`</li></ul> | No | Returns a **final san array** with all the san moves that a piece from an **initial qos** square can legally move to.<br><br>Passing an **initial qos** square with a **square val** of `0` or a **non active sign** will result in a `[]`.<hr>Examples:<ul><li>`Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalSanMoves", ["c2"]) //["Rd2", "Rb2", "Rxa2"]`</li><li>`Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalSanMoves", ["a2"]) //[]`</li><li>`Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalSanMoves", ["b5"]) //["Bc6", "Bxd7+", "Bxc4", "Ba6"]`</li><li>`Ic.fenApply("0invalidfen0", "legalSanMoves", ["a2"]) //[]`</li></ul>
**fenApply**(<br>*fen*,<br>`"isLegalMove"`,<br>[<br>*mov*,<br>*p*<br>]<br>) | <ul><li>fen (String)</li><li>`"isLegalMove"` (String)</li><li>mov:<ul><li>**moveSan** (String)</li><li>**moveJoined** (String)</li><li>**moveFromTo** (Array)</li><li>**move** (Object)</li></ul></li><li>:eight_pointed_black_star:p (Object):<ul><li>:eight_spoked_asterisk:delimiter (String)</li></ul></li></ul><hr>:eight_pointed_black_star:Optional Parameter<br>:eight_spoked_asterisk:Optional Object key | Success:<ul><li>Boolean</li></ul><hr>Error:<ul><li>Boolean: `false`</li></ul> | No | Test to see if a move is legal or not.<br><br>`delimiter` is a single character to look for in **moveJoined** (like `"-" in "a2-a4"`) to allow the use of any delimiters. Defaults to `"-"` if not specified.<hr>Examples:<ul><li>`Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["Rxa2"]) //true`</li><li>`Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["c2-a2"]) //true`</li><li>`Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["c2_a2", {delimiter : "_"}]) //true`</li><li>`Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", [["c2", "a2"]]) //true`</li><li>`Ic.fenApply("0invalidfen0", "isLegalMove", [["a2", "a3"]]) //false`</li></ul>
**fenApply**(<br>*fen*,<br>`"isLegalFen"`<br>) | <ul><li>fen (String)</li><li>`"isLegalFen"` (String)</li></ul> | Boolean | No | Test to see if a **fen** position is legal or not.<hr>Examples:<ul><li>`Ic.fenApply("8/8/8/8/8/1k6/8/1K1r4 w - - 0 1", "isLegalFen") //true`</li><li>`Ic.fenApply("0invalidfen0", "isLegalFen") //false`</li><li>`Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/1P6/1PPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalFen") //false`</li></ul>
**fenApply**(<br>*fen*,<br>`"getSquare"`,<br>[<br>*qos*,<br>*p*<br>]<br>) | <ul><li>fen (String)</li><li>`"getSquare"` (String)</li><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li><li>:eight_pointed_black_star:p (Object):<ul><li>:eight_spoked_asterisk:rankShift (Number): `-7 to 7`</li><li>:eight_spoked_asterisk:fileShift (Number): `-7 to 7`</li></ul></li></ul><hr>:eight_pointed_black_star:Optional Parameter<br>:eight_spoked_asterisk:Optional Object key | Success:<ul><li>**square** (Object)</li></ul><hr>Error:<ul><li>null</li></ul> | No | Returns a :pushpin:**square** <sup>(unreferenced copy)</sup>.<br><br>If the **square** is invalid (before or after shifting by `rankShift` and `fileShift`), then `null` will be returned.<hr>Examples:<ul><li>`Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["e8"]) //Object{...}`</li><li>`Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", [[2, 5]]) //Object{...}`</li><li>`Ic.fenApply("0invalidfen0", "getSquare", ["a2"]) //null`</li></ul><hr>:pushpin:Square documentation link:<ul><li>[square properties](https://github.com/ajax333221/isepic-chess#list-of-squareproperties).</li></ul>
**fenGet**(<br>*fen*,<br>*props*<br>) | <ul><li>fen (String)</li><li>props:<ul><li>**strList** (String)</li><li>**arrList** (Array)</li></ul></li></ul> | Success:<ul><li>Object: `{propA:valA, propB:valB, ..., propZ:valZ}`</li></ul><hr>:small_red_triangle_down:Error:<ul><li>null</li></ul> | No | Get [board properties](https://github.com/ajax333221/isepic-chess#list-of-boardproperties) <sup>(except for `board.boardName`)</sup> from a **fen**.<br><br>The **board properties** are **case-sensitive**.<br><br>When passing a **string list**, this must be **space-separated** <sup>(not comma-separated)</sup>.<br><br>Duplicated **board properties** will not result in errors and only the first occurrence will be used.<hr>Examples:<ul><li>`Ic.fenGet("6k1/b7/8/8/5p2/7p/7P/7K w - - 0 54", "isStalemate inDraw") //{isStalemate : true, inDraw : true}`</li><li>`Ic.fenGet("6k1/b7/8/8/5p2/7p/7P/7K w - - 0 54", ["halfMove", "fullMove"]) //{halfMove : 0, fullMove : 54}`</li><li>`Ic.fenGet("0invalidfen0", "isCheck") //null`</li><li>`Ic.fenGet("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "") //null`</li><li>`Ic.fenGet("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "fen 0invalidprop0") //null`</li></ul><hr>:small_red_triangle_down:Error emits a `console.log(...)` when:<ul><li>`fen` is an **invalid fen**.</li><li>an **invalid property** was found in `props`.</li><li>not one **valid property** was found in `props`.</li></ul>
**getBoardNames**() | - | **boardNamesArray** (Array) | No | Returns a **board names array**.<br><br>The **board**s with `isHidden = true` are also included.<hr>Examples:<ul><li>`Ic.getBoardNames() //["main", "other", "other_copy", "hidden_board", "resume_from_fen"]`</li><li>`Ic.getBoardNames() //[]`</li></ul>

<hr>

#### List of `board.<properties>`:

Boards created by `Ic.initBoard()` have the following accessible properties.

Property | Type | Description
------- | ---- | -----------
**boardName** | String | All **board**s have a unique **board name** that is set when created. This property can't be modified.<hr>Examples:<ul><li>`main_board.boardName //"main"`</li><li>`other_board.boardName //"other"`</li><li>`rff_board.boardName //"resume_from_fen"`</li></ul>
**w**<hr>**b** | Object | They both have the following sub-properties:<ul><li>**isBlack** (Boolean): `board.w.isBlack = false` and `board.b.isBlack = true`.</li><li>**sign** (Number): `board.w.sign = 1` and `board.b.sign = -1`.</li><li>**firstRankPos** (Number): `board.w.firstRankPos = 7` and `board.b.firstRankPos = 0`.</li><li>**secondRankPos** (Number): `board.w.secondRankPos = 6` and `board.b.secondRankPos = 1`.</li><li>**lastRankPos** (Number): `board.w.lastRankPos = 0` and `board.b.lastRankPos = 7`.</li><li>**singlePawnRankShift** (Number): `board.w.singlePawnRankShift = -1` and `board.b.singlePawnRankShift = 1`.</li><li>**pawn / knight / bishop / rook / queen / king** (Number): `board.w.<PIECE> = (1, 2, ..., 6)` and `board.b.<PIECE> = (-1, -2, ..., -6)`.</li><li>**kingBos** (String): `board.w.kingBos` and `board.b.kingBos` hold the **king bos** square of their respective king.</li><li>**castling** (Number): `board.w.castling` and `board.b.castling` hold the **castling rights** in a single digit value: `0 = no castling rights`, `1 = only short castle`, `2 = only long castle`, `3 = both castling rights`.</li><li>**materialDiff** (Array): `board.w.materialDiff` holds a **piece val array** (with *positive* **piece sign**s) of exceeding pieces that white has over black and `board.b.materialDiff` holds a **piece val array** (with *negative* **piece sign**s) of exceeding pieces that black has over white. Differences by more than one piece of the same value will result in appearing multiple times e.g. `[1, 1, ...]`.</li></ul>All sub-properties never change except for: **kingBos**, **castling** and **materialDiff**. These get updated automatically and reflect their current state.<hr>Examples:<ul><li>`board.w.isBlack //false`</li><li>`board.b.isBlack //true`</li><li>`board.w.sign //1`</li><li>`board.b.sign //-1`</li><li>`board.w.kingBos //"e1"`</li><li>`board.b.kingBos //"e8"`</li><li>`board.w.castling //3`</li><li>`board.b.castling //3`</li><li>`rff_board.w.materialDiff //[1, 4]`</li><li>`rff_board.b.materialDiff //[-2]`</li></ul>
**activeColor**<hr>**nonActiveColor** | String | `board.activeColor` holds `"w"` when **white** to move and `"b"` when **black** to move.<br><br>`board.nonActiveColor` holds `"w"` when **black** to move and `"b"` when **white** to move.<br><br>:zap:**Tip:** you can use `board[board.activeColor]` and `board[board.nonActiveColor]` to access the sub-properties of `board.w` and `board.b` <sup>(not respectively)</sup> depending on the actual **active** or **non active color**.<hr>Examples:<ul><li>`main_board.activeColor //"w"`</li><li>`main_board.nonActiveColor //"b"`</li><li>`rff_board.activeColor //"b"`</li><li>`rff_board.nonActiveColor //"w"`</li></ul>
**fen** | String | The **fen** (Forsyth–Edwards Notation) of the **board** in its current state.<hr>Examples:<ul><li>`main_board.fen //"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"`</li><li>`rff_board.fen //"r5k1/pp3ppp/7n/8/2P2P1K/3P1q2/P1PBb2P/R5QR b - - 3 22"`</li></ul>
**enPassantBos** | String | Holds the **En passant bos** square (if any) or an empty string.<hr>Examples:<ul><li>`board_after_e4.enPassantBos //"e3"`</li><li>`board_no_enpass.enPassantBos //""`</li></ul>
**halfMove** | Number | The **halfmove clock**.<br><br>Starts with the default value of `0` unless the **fen** used to initiate the **board** provides the optional **halfmove/fullmove clocks**.<hr>Examples:<ul><li>`board.halfMove //0`</li><li>`board_after_e4.halfMove //0`</li><li>`board_after_e4_e5.halfMove //0`</li><li>`board_after_e4_e5_nf3.halfMove //1`</li><li>`rff_board.halfMove //3`</li></ul>
**fullMove** | Number | The **fullmove clock**.<br><br>Starts with the default value of `1` unless the **fen** used to initiate the **board** provides the optional **halfmove/fullmove clocks**.<hr>Examples:<ul><li>`board.fullMove //1`</li><li>`board_after_e4.fullMove //1`</li><li>`board_after_e4_e5.fullMove //2`</li><li>`board_after_e4_e5_nf3.fullMove //2`</li><li>`rff_board.fullMove //22`</li></ul>
**moveList** | Array | The **move list** `[move0, move1, ..., moveN]` with the elements being objects with the following properties:<ul><li>**Fen** (String): the fen after the current move is played.</li><li>**PGNmove** (String): the san move.</li><li>**PGNend** (String): if the game finished in this move `"1-0", "0-1", "1/2-1/2"` or an empty string.</li><li>**FromBos** (String): the origin square bos.</li><li>**ToBos** (String): the destination square bos.</li><li>**InitialVal** (Number): the initial piece val (before a possible pawn promotion).</li><li>**FinalVal** (Number): the final piece val (after a possible pawn promotion).</li><li>**KingCastled** (Number): the value can be `0, 1, 2` (`0` = didn't castle, `1` = castled kingside, `2` = castled queenside).</li></ul>The first element `move0` doesn't represent a move, this object holds the **fen** (`board.moveList[0].Fen`) from where the **board** was initialized (every other key will be `""` and `0`).<hr>Examples:<ul><li>`board.moveList //[{...}]`</li><li>`board_after_nc3.moveList //[{...}, {...}]`</li></ul>
**currentMove** | Number | The **current move** is the index of **move list** that the **board** is currently in.<br><br>If this "cursor" is not at the end of the **move list** when a new move is made, the **move list** will record the move and erase the rest.<br><br>This is always a zero-based index regardless of the initial **fullmove clock** used.<hr>Examples:<ul><li>`board.currentMove //0`</li><li>`board_after_e4.currentMove //1`</li><li>`board_after_e4_e5.currentMove //2`</li><li>`board_after_e4_e5_nf3.currentMove //3`</li><li>`rff_board.currentMove //0`</li></ul>
**isRotated** | Boolean | This affects the visual representation of the **board** in `board.ascii()` and `IcUi` from **isepic-chess-ui.js**.<hr>Examples:<ul><li>`board.isRotated //false`</li><li>`board_currently_rotated.isRotated //true`</li></ul>
**checks** | Number | The number of attacks to the **active** king.<hr>Examples:<ul><li>`board_not_in_check.checks //0`</li><li>`board_simple_check.checks //1`</li><li>`board_double_check.checks //2`</li></ul>
**isCheck** | Boolean | Indicates that the **active** king is being attacked at least once.<hr>Examples:<ul><li>`board_in_check.isCheck //true`</li><li>`board_in_checkmate.isCheck //true`</li><li>`board_in_stalemate.isCheck //false`</li><li>`board_not_in_check.isCheck //false`</li></ul>
**isCheckmate** | Boolean | Indicates that there aren't any legal moves for the side to move and the **active** king is at check.<hr>Examples:<ul><li>`board_in_check.isCheckmate //false`</li><li>`board_in_checkmate.isCheckmate //true`</li><li>`board_in_stalemate.isCheckmate //false`</li><li>`board_not_in_check.isCheckmate //false`</li></ul>
**isStalemate** | Boolean | Indicates that there aren't any legal moves for the side to move and the **active** king is not at check.<hr>Examples:<ul><li>`board_in_check.isStalemate //false`</li><li>`board_in_checkmate.isStalemate //false`</li><li>`board_in_stalemate.isStalemate //true`</li><li>`board_not_in_check.isStalemate //false`</li></ul>
**isThreefold** | Boolean | Indicates that the current position has appeared at least three times before.<hr>Examples:<ul><li>`not_repeated_thrice_before.isThreefold //false`</li><li>`repeated_thrice_before.isThreefold //true`</li></ul>
**isFiftyMove** | Boolean | Indicates that no capture has been made and no pawn has been moved in the last 50 moves (100 half moves).<hr>Examples:<ul><li>`board_99halfmoves.isFiftyMove //false`</li><li>`board_100halfmoves.isFiftyMove //true`</li></ul>
**isInsufficientMaterial** | Boolean | Indicates that there isn't enough material for either side to deliver a checkmate.<hr>Examples:<ul><li>`k_vs_k.isInsufficientMaterial //true`</li><li>`k_vs_kn.isInsufficientMaterial //true`</li><li>`k_vs_kb.isInsufficientMaterial //true`</li><li>`k_vs_knn.isInsufficientMaterial //false`</li><li>`kn_vs_kn.isInsufficientMaterial //false`</li><li>`k_vs_knb.isInsufficientMaterial //false`</li></ul>
**inDraw** | Boolean | Indicates that a draw is present.<hr>Examples:<ul><li>`main_board.inDraw //false`</li><li>`board_in_stalemate.inDraw //true`</li><li>`board_in_3fold.inDraw //true`</li><li>`board_100halfmoves.inDraw //true`</li><li>`board_insufficient_mat.inDraw //true`</li></ul>
**promoteTo** | Number | Promoted pawns will turn into this piece.<br><br>The value is stored as an **abs val** (from `2` knight to `5` queen).<hr>Examples:<ul><li>`board_q_option.promoteTo //5`</li><li>`board_r_option.promoteTo //4`</li><li>`board_b_option.promoteTo //3`</li><li>`board_n_option.promoteTo //2`</li></ul>
**selectedBos** | String | Holds the **ui selected bos** square (if any) or an empty string.<br><br>Only used when **isepic-chess-ui.js** is present (the property becomes irrelevant otherwise).<hr>Examples:<ul><li>`board_e2_selected_in_ui.selectedBos //"e2"`</li><li>`board_after_e4.selectedBos //""`</li></ul>
**isHidden** | Boolean | Indicates if a **board** is meant to be shown or hidden in the UI.<br><br>Only used when **isepic-chess-ui.js** is present (the property becomes irrelevant otherwise).<hr>Examples:<ul><li>`main_board.isHidden //false`</li><li>`h_board.isHidden //true`</li></ul>
**isUnlabeled** | Boolean | This can be used to remove the **board labels** in the UI.<br><br>Only used when **isepic-chess-ui.js** is present (the property becomes irrelevant otherwise).<hr>Examples:<ul><li>`main_board.isUnlabeled //false`</li><li>`unlabeled_board.isUnlabeled //true`</li></ul>
**squares** | Object | Collection of the 64 :pushpin:**square**s of the board.<br><br>:zap:**Tip:** the preferred way of selecting **square**s is via `board.getSquare(...)`.<hr>Examples:<ul><li>`board.squares["a1"] //Object{...}`</li><li>`board.squares["h8"] //Object{...}`</li></ul><hr>:pushpin:Square documentation link:<ul><li>[square properties](https://github.com/ajax333221/isepic-chess#list-of-squareproperties).</li></ul>

<hr>

#### List of `board.<methods>(...)`:

Boards created by `Ic.initBoard()` have the following available methods.

Function | Parameters | Return | Board refresh? | Description
-------- | ---------- | ------ | ---------------- | -----------
**playMove**(<br>*mov*,<br>*p*<br>) | <ul><li>mov:<ul><li>**moveSan** (String)</li><li>**moveJoined** (String)</li><li>**moveFromTo** (Array)</li><li>**move** (Object)</li></ul></li><li>:eight_pointed_black_star:p (Object):<ul><li>:eight_spoked_asterisk:isMockMove (Boolean)</li><li>:eight_spoked_asterisk:promoteTo</li><li>:eight_spoked_asterisk:delimiter (String)</li></ul></li></ul><hr>:eight_pointed_black_star:Optional Parameter<br>:eight_spoked_asterisk:Optional Object key | Success:<ul><li>**move** (Object)</li></ul><hr>Error:<ul><li>null</li></ul> | Yes | Returns a :pushpin:**move**.<br><br>(... *temporal-draft*: if the move is legal, it makes the move, updates everything internally and refreshes the ui (if exists) ...)<br><br>`isMockMove` plays the move on a temporal board instead.<br><br>`promoteTo` takes precedence over everything when specified and a pawn promotion takes place.<br><br>`delimiter` is a single character to look for in **moveJoined** (like `"-" in "a2-a4"`) to allow the use of any delimiters. Defaults to `"-"` if not specified.<hr>:pushpin:Move documentation link:<ul><li>Not available.</li></ul>
**toggleIsRotated**(<br>*newIsRotated*<br>) | <ul><li>:eight_pointed_black_star:newIsRotated (Boolean):</li></ul><hr>:eight_pointed_black_star:Optional Parameter | Boolean | Yes | (... *temporal-draft*: toggles (or sets) the **board property** of `board.isRotated`, when passing the Boolean parameter this will set instead of toggle ...)
**setPromoteTo**(<br>*qal*<br>) | <ul><li>qal:<ul><li>**squareBal** (String)</li><li>**squareAbsBal** (String)</li><li>**squareVal** (Number)</li><li>**squareAbsVal** (Number)</li><li>**squareClassName** (String)</li><li>**square** (Object)</li></ul></li></ul> | Boolean | Yes | (... *temporal-draft*: changes the **board property** of `board.promoteTo` after interpreting the input ...)
**setCurrentMove**(<br>*val*,<br>*isGoto*<br>) | <ul><li>val (Number)</li><li>:eight_pointed_black_star:isGoto (Boolean)</li></ul><hr>:eight_pointed_black_star:Optional Parameter | Boolean | Yes | (... *temporal-draft*: changes the **board property** of `board.currentMove` either by a shift value or a jump-to value ...)
**navFirst**() | - | Boolean | Yes | Performs a `board.setCurrentMove(0)`.<hr>Examples:<ul><li>`board.navFirst() //true`</li><li>`board.navFirst() //false`</li></ul>
**navPrevious**() | - | Boolean | Yes | Performs a `board.setCurrentMove(board.currentMove-1)`.<hr>Examples:<ul><li>`board.navPrevious() //true`</li><li>`board.navPrevious() //false`</li></ul>
**navNext**() | - | Boolean | Yes | Performs a `board.setCurrentMove(board.currentMove+1)`.<hr>Examples:<ul><li>`board.navNext() //true`</li><li>`board.navNext() //false`</li></ul>
**navLast**() | - | Boolean | Yes | Performs a `board.setCurrentMove(board.moveList.length-1)`.<hr>Examples:<ul><li>`board.navLast() //true`</li><li>`board.navLast() //false`</li></ul>
**navLinkMove**(<br>*moveIndex*<br>) | <ul><li>moveIndex (Number)</li></ul> | Boolean | Yes | Performs a `board.setCurrentMove(moveIndex)`.<hr>Examples:<ul><li>`board.navLinkMove(2) //true`</li><li>`board.navLinkMove(2) //false`</li></ul>
**cloneBoardFrom**(<br>*fromBoard*<br>) | <ul><li>fromBoard:<ul><li>**boardName** (String)</li><li>**board** (Object)</li></ul></li></ul> | Boolean | Yes | (... *temporal-draft*: copies all the board properties (except `board.boardName`) from another board into this board ...)
**cloneBoardTo**(<br>*toBoard*<br>) | <ul><li>toBoard:<ul><li>**boardName** (String)</li><li>**board** (Object)</li></ul></li></ul> | Boolean | Yes | (... *temporal-draft*: copies all the board properties (except `board.boardName`) from this board into another board ...)
**ascii**(<br>*isRotated*<br>) | <ul><li>:eight_pointed_black_star:isRotated (Boolean):</li></ul><hr>:eight_pointed_black_star:Optional Parameter | String | No | Returns a **chess diagram** made of text.<br><br>Boolean parameters will take precedence over the **board property** of `board.isRotated`.<br><br>A line feed `\n` is used as the line break character.
**getSquare**(<br>*qos*,<br>*p*<br>) | <ul><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li><li>:eight_pointed_black_star:p (Object):<ul><li>:eight_spoked_asterisk:rankShift (Number): `-7 to 7`</li><li>:eight_spoked_asterisk:fileShift (Number): `-7 to 7`</li><li>:eight_spoked_asterisk:isUnreferenced (Boolean)</li></ul></li></ul><hr>:eight_pointed_black_star:Optional Parameter<br>:eight_spoked_asterisk:Optional Object key | Success:<ul><li>**square** (Object)</li></ul><hr>Error:<ul><li>null</li></ul> | No | Returns a :pushpin:**square**.<br><br>If the **square** is invalid (before or after shifting by `rankShift` and `fileShift`), then `null` will be returned.<br><br>`isUnreferenced = true` means that the returned **square** will not be referenced (updates made to the **board** can't affect these unreferenced copies).<hr>Examples:<ul><li>`board.getSquare("e4") //Object{...}`</li><li>`board.getSquare("a1", {rankShift:-7, fileShift:7}) //Object{...}`</li><li>`board.getSquare("0invalidsquare0") //null`</li></ul><hr>:pushpin:Square documentation link:<ul><li>[square properties](https://github.com/ajax333221/isepic-chess#list-of-squareproperties).</li></ul>
**setSquare**(<br>*qos*,<br>*qal*,<br>*p*<br>) | <ul><li>qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li><li>qal:<ul><li>**squareBal** (String)</li><li>**squareAbsBal** (String)</li><li>**squareVal** (Number)</li><li>**squareAbsVal** (Number)</li><li>**squareClassName** (String)</li><li>**square** (Object)</li></ul></li><li>:eight_pointed_black_star:p (Object):<ul><li>:eight_spoked_asterisk:rankShift (Number): `-7 to 7`</li><li>:eight_spoked_asterisk:fileShift (Number): `-7 to 7`</li></ul></li></ul><hr>:eight_pointed_black_star:Optional Parameter<br>:eight_spoked_asterisk:Optional Object key | Boolean | No | (... *temporal-draft*: changes the **board property** of `board.squares.x`, the **square** object will have every non-static property updated, supports the rank/file shifting like `board.getSquare()`, Note: no validation happens, no castle rights get updated and no ui refresh occurs ...)
**countAttacks**(<br>*qos*,<br>*earlyBreak*<br>) | <ul><li>:eight_pointed_black_star:qos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li><li>:eight_pointed_black_star:earlyBreak (Boolean)</li></ul><hr>:eight_pointed_black_star:Optional Parameter | Number | No | (... *temporal-draft*: this can be called to know how many times enemy pieces are attacking a square, you can pass a boolean to short-circuit and stop looking after a single attack on the square and you will get 0 or 1, it is a waste of resources to re-count the times attacked to the king square as this information is already calculated and stored in `board.checks`, the active side king bos will be used as default if the optional qos is missing ...)
**isLegalMove**(<br>*mov*,<br>*p*<br>) | <ul><li>mov:<ul><li>**moveSan** (String)</li><li>**moveJoined** (String)</li><li>**moveFromTo** (Array)</li><li>**move** (Object)</li></ul></li><li>:eight_pointed_black_star:p (Object):<ul><li>:eight_spoked_asterisk:delimiter (String)</li></ul></li></ul><hr>:eight_pointed_black_star:Optional Parameter<br>:eight_spoked_asterisk:Optional Object key | Success:<ul><li>Boolean</li></ul><hr>Error:<ul><li>Boolean: `false`</li></ul> | No | Test to see if a move is legal or not.<br><br>`delimiter` is a single character to look for in **moveJoined** (like `"-" in "a2-a4"`) to allow the use of any delimiters. Defaults to `"-"` if not specified.<hr>Examples:<ul><li>`board.isLegalMove("Nf3") //true`</li><li>`board.isLegalMove("g1-f3") //true`</li><li>`board.isLegalMove("g1_f3", {delimiter : "_"}) //true`</li><li>`board.isLegalMove(["g1", [5, 5]]) //true`</li><li>`board.isLegalMove("0invalidsan0") //false`</li><li>`board.isLegalMove("a1-h7") //false`</li><li>`board.isLegalMove(["a1", "0invalidsquare0"]) //false`</li></ul>
**legalMoves**(<br>*initialQos*<br>) | <ul><li>initialQos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**finalBosArray** (Array)</li></ul><hr>Error:<ul><li>Array: `[]`</li></ul> | No | Returns a **final bos array** with all the squares that a piece from an **initial qos** square can legally move to.<br><br>Passing an **initial qos** square with a **square val** of `0` or a **non active sign** will result in a `[]`.<hr>Examples:<ul><li>`board.legalMoves("b1") //["c3", "a3"]`</li><li>`board.legalMoves("a3") //[]`</li><li>`board.legalMoves("e7") //[]`</li><li>`board.legalMoves("0invalidsquare0") //[]`</li></ul>
**legalSanMoves**(<br>*initialQos*<br>) | <ul><li>initialQos:<ul><li>**squareBos** (String)</li><li>**squarePos** (Array)</li><li>**square** (Object)</li></ul></li></ul> | Success:<ul><li>**finalSanArray** (Array)</li></ul><hr>Error:<ul><li>Array: `[]`</li></ul> | No | Returns a **final san array** with all the san moves that a piece from an **initial qos** square can legally move to.<br><br>Passing an **initial qos** square with a **square val** of `0` or a **non active sign** will result in a `[]`.<hr>Examples:<ul><li>`board.legalSanMoves("b1") //["Nc3", "Na3"]`</li><li>`board.legalSanMoves("a3") //[]`</li><li>`board.legalSanMoves("e7") //[]`</li><li>`board.legalSanMoves("0invalidsquare0") //[]`</li></ul>
**isEqualBoard**(<br>*toBoard*<br>) | <ul><li>toBoard:<ul><li>**boardName** (String)</li><li>**board** (Object)</li></ul></li></ul> | Success:<ul><li>Boolean</li></ul><hr>:small_red_triangle_down:Error:<ul><li>Boolean: `false`</li></ul> | No | Tests for the equality of the [board properties](https://github.com/ajax333221/isepic-chess#list-of-boardproperties) <sup>(except for `board.boardName`)</sup> between the calling **board** and another **board**.<hr>Examples:<ul><li>`board.isEqualBoard("board_copy") //true`</li><li>`board.isEqualBoard(other_board) //false`</li><li>`same_board.isEqualBoard(same_board) //true`</li><li>`other_board.isEqualBoard("nonexistent") //false`</li></ul><hr>:small_red_triangle_down:Error emits a `console.log(...)` if the *to board* is not found.

<sup>And the [board UI methods](https://github.com/ajax333221/isepic-chess-ui#list-of-boarduimethods) when **isepic-chess-ui.js** is present.</sup>

<hr>

#### List of `square.<properties>`:

Squares from `board.getSquare()` <sup>(including unreferenced copies)</sup> and manually selected from `board.squares[<a1-h8>]` have the following accessible properties.

Property | Type | Description
------- | ---- | -----------
**pos** | Array | **squarePos**: `[0-7, 0-7]`
**bos** | String | **squareBos**: `"a1" to "h8"`
**rankPos** | Number | **squareRankPos**: `0-7`
**filePos** | Number | **squareFilePos**: `0-7`
**rankBos** | String | **squareRankBos**: `1-8`
**fileBos** | String | **squareFileBos**: `a-h`
**bal** | String | **squareBal**: `"k", "q", "r", "b", "n", "p", "*", "P", "N", "B", "R", "Q", "K"`
**absBal** | String | **squareAbsBal**: `"*", "P", "N", "B", "R", "Q", "K"`
**val** | Number | **squareVal**: `-6 to 6`
**absVal** | Number | **squareAbsVal**: `0 to 6`
**className** | String | **squareClassName**: `"bk", "bq", "br", "bb", "bn", "bp", "", "wp", "wn", "wb", "wr", "wq", "wk"`
**sign** | Number | **squareSign**: `-1 or 1`
**isEmptySquare** | Boolean | `true` when the **square abs val** is `0`
**isPawn** | Boolean | `true` when the **square abs val** is `1`
**isKnight** | Boolean | `true` when the **square abs val** is `2`
**isBishop** | Boolean | `true` when the **square abs val** is `3`
**isRook** | Boolean | `true` when the **square abs val** is `4`
**isQueen** | Boolean | `true` when the **square abs val** is `5`
**isKing** | Boolean | `true` when the **square abs val** is `6`

To do
-------------

- **Relocate the documentation** to `./docs` <sup>(path ignored in the npm package)</sup> and keep the `README.md` simple
- **PGN viewer** (include the parsed game score from the PGN and keep game comments instead of deleting them)
- **Parse multiple games** (currently the parser can only handle one game at a time)
- **PGN export** (a real export that includes the tags would be good to have)
- **Assign game scores** (option to end a game at any moment)
- **Parse games from files** (read games from `.txt` and `.pgn`)
- **Custom PNBRQK chars**

Copyright and license
-------------

Copyright © 2020 Ajax Isepic (ajax333221)

Licensed under MIT License: http://opensource.org/licenses/mit-license.php
