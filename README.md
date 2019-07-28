Isepic-Chess.js
================

Isepic-Chess.js is a chess utility library written in JavaScript, it provides basic features like legal moves calculation, move list navigation, FEN position validation, etc. (see: [Features](https://github.com/ajax333221/Isepic-Chess#features)). It uses jQuery for DOM manipulation and object clonning/traversing.

Demo
-------------

http://ajax333221.github.io/Isepic-Chess/

Features
-------------

- advanced FEN validation
- highlight legal moves / last move
- move list navigation
- pawn promotion options
- ~~drag-and-drop pieces~~ (currently disabled)
- chess-font by ajax333221 ![White King](css/images/wk.png "white king")![White Queen](css/images/wq.png "white queen")![White Rook](css/images/wr.png "white rook")![White Bishop](css/images/wb.png "white bishop")![White Knight](css/images/wn.png "white knight")![White Pawn](css/images/wp.png "white pawn")![Black King](css/images/bk.png "black king")![Black Queen](css/images/bq.png "black queen")![Black Rook](css/images/br.png "black rook")![Black Bishop](css/images/bb.png "black bishop")![Black Knight](css/images/bn.png "black knight")![Black Pawn](css/images/bp.png "black pawn")

Documentation
-------------

Function | Parameters | Return | Description
-------- | ---------- | ------ | -----------
**boardExists**(<br>*boardName*<br>) | <ul><li>boardName (String)</li></ul> | <ul><li>Boolean</li></ul> | Test to see if a board exists or not.<hr>Examples: <ul><li>`IsepicChess.boardExists("myboard") //true`</li><li>`IsepicChess.boardExists("nonexistent") //false`</li></ul>
**selectBoard**(<br>*boardName*<br>) | <ul><li>boardName (String)</li></ul> | Success:<ul><li>**boardObj** (Object)</li></ul><hr>:small_red_triangle_down:Error: <ul><li>null</li></ul> | Returns the board object (usually to call a **board.function**).<hr>Examples: <ul><li>`IsepicChess.selectBoard("myboard") //Object{...}`</li><li>`IsepicChess.selectBoard("nonexistent") //null`</li></ul><hr>:small_red_triangle_down:Error emits a `console.log(...)` if the board is not found.
**toVal**(<br>*qal*<br>) | <ul><li>qal: <ul><li>**pieceBal** (String)</li><li>**pieceAbsBal** (String)</li><li>**pieceVal** (Number)</li><li>**pieceAbsVal** (Number)</li></ul></li></ul> | Success:<ul><li>**pieceVal** (Number): `-6 to 6`</li></ul><hr>Error: <ul><li>Number: `0`</li></ul> | Converts the input to a **piece val**.<hr>Examples: <ul><li>`IsepicChess.toVal("b") //-3`</li><li>`IsepicChess.toVal("K") //6`</li><li>`IsepicChess.toVal("*") //0`</li><li>`IsepicChess.toVal(-5) //-5`</li><li>`IsepicChess.toVal("err") //0`</li><li>`IsepicChess.toVal(99) //6`</li><li>`IsepicChess.toVal(-99) //-6`</li></ul>
**toAbsVal**(<br>*qal*<br>) | <ul><li>qal: <ul><li>**pieceBal** (String)</li><li>**pieceAbsBal** (String)</li><li>**pieceVal** (Number)</li><li>**pieceAbsVal** (Number)</li></ul></li></ul> | Success:<ul><li>**pieceAbsVal** (Number): `0 to 6`</li></ul><hr>Error: <ul><li>Number: `0`</li></ul> | Converts the input to a **piece abs val**.<hr>Examples: <ul><li>`IsepicChess.toAbsVal("b") //3`</li><li>`IsepicChess.toAbsVal("K") //6`</li><li>`IsepicChess.toAbsVal("*") //0`</li><li>`IsepicChess.toAbsVal(-5) //5`</li><li>`IsepicChess.toAbsVal("err") //0`</li><li>`IsepicChess.toAbsVal(99) //6`</li><li>`IsepicChess.toAbsVal(-99) //6`</li></ul>
**toBal**(<br>*qal*<br>) | <ul><li>qal: <ul><li>**pieceBal** (String)</li><li>**pieceAbsBal** (String)</li><li>**pieceVal** (Number)</li><li>**pieceAbsVal** (Number)</li></ul></li></ul> | Success:<ul><li>**pieceBal** (String): `"k", "q", "r", "b", "n", "p", "*", "P", "N", "B", "R", "Q", "K"`</li></ul><hr>Error: <ul><li>String: `*`</li></ul> | Converts the input to a **piece bal**.<hr>Examples: <ul><li>`IsepicChess.toBal(-3) //"b"`</li><li>`IsepicChess.toBal(6) //"K"`</li><li>`IsepicChess.toBal(0) //"*"`</li><li>`IsepicChess.toBal("q") //"q"`</li><li>`IsepicChess.toBal("err") //"*"`</li><li>`IsepicChess.toBal(99) //"K"`</li><li>`IsepicChess.toBal(-99) //"k"`</li></ul>
**toAbsBal**(<br>*qal*<br>) | <ul><li>qal: <ul><li>**pieceBal** (String)</li><li>**pieceAbsBal** (String)</li><li>**pieceVal** (Number)</li><li>**pieceAbsVal** (Number)</li></ul></li></ul> | Success:<ul><li>**pieceAbsBal** (String): `"*", "P", "N", "B", "R", "Q", "K"`</li></ul><hr>Error: <ul><li>String: `*`</li></ul> | Converts the input to a **piece abs bal**.<hr>Examples: <ul><li>`IsepicChess.toAbsBal(-3) //"B"`</li><li>`IsepicChess.toAbsBal(6) //"K"`</li><li>`IsepicChess.toAbsBal(0) //"*"`</li><li>`IsepicChess.toAbsBal("q") //"Q"`</li><li>`IsepicChess.toAbsBal("err") //"*"`</li><li>`IsepicChess.toAbsBal(99) //"K"`</li><li>`IsepicChess.toAbsBal(-99) //"K"`</li></ul>
**toPieceClass**(<br>*qal*<br>) | <ul><li>qal: <ul><li>**pieceBal** (String)</li><li>**pieceAbsBal** (String)</li><li>**pieceVal** (Number)</li><li>**pieceAbsVal** (Number)</li></ul></li></ul> | Success:<ul><li>**pieceClass** (String): `"bk", "bq", "br", "bb", "bn", "bp", "", "wp", "wn", "wb", "wr", "wq", "wk"`</li></ul><hr>Error: <ul><li>String: `""`</li></ul> | Converts the input to a **piece class**.<hr>Examples: <ul><li>`IsepicChess.toPieceClass("b") //"bb"`</li><li>`IsepicChess.toPieceClass("K") //"wk"`</li><li>`IsepicChess.toPieceClass("*") //""`</li><li>`IsepicChess.toPieceClass(-5) //"bq"`</li><li>`IsepicChess.toPieceClass("err") //""`</li><li>`IsepicChess.toPieceClass(99) //"wk"`</li><li>`IsepicChess.toPieceClass(-99) //"bk"`</li></ul>
**toBos**(<br>*qos*<br>) | <ul><li>qos: <ul><li>**pieceBos** (String)</li><li>**piecePos** (Array)</li></ul></li></ul> | On valid input:<ul><li>**pieceBos** (String): `"a1" to "h8"`</li></ul><hr>On bad input: <ul><li>**unknown** (?): `?`</li></ul> | Converts the input to a **piece bos**.<hr>Examples: <ul><li>`IsepicChess.toBos([7, 0]) //"a1"`</li><li>`IsepicChess.toBos([0, 0]) //"a8"`</li><li>`IsepicChess.toBos([7, 7]) //"h1"`</li><li>`IsepicChess.toBos([0, 7]) //"h8"`</li><li>`IsepicChess.toBos("B2") //"b2"`</li></ul>
**toPos**(<br>*qos*<br>) | <ul><li>qos: <ul><li>**pieceBos** (String)</li><li>**piecePos** (Array)</li></ul></li></ul> | On valid input:<ul><li>**piecePos** (Array): `[0-7, 0-7]`</li></ul><hr>On bad input: <ul><li>**unknown** (?): `?`</li></ul> | Converts the input to a **piece pos**.<hr>Examples: <ul><li>`IsepicChess.toPos("a1") //[7, 0]`</li><li>`IsepicChess.toPos("a8") //[0, 0]`</li><li>`IsepicChess.toPos("h1") //[7, 7]`</li><li>`IsepicChess.toPos("h8") //[0, 7]`</li><li>`IsepicChess.toPos([6, 1]) //[6, 1]`</li></ul>
**getSign**(<br>*zal*<br>) | <ul><li>zal: <ul><li>Boolean</li><li>qal: <ul><li>**pieceBal** (String)</li><li>**pieceAbsBal** (String)</li><li>**pieceVal** (Number)</li><li>**pieceAbsVal** (Number)</li></ul></li></ul></li></ul> | Success:<ul><li>**pieceSign** (Number): `-1 or 1`</li></ul><hr>Error: <ul><li>Number: `-1`</li></ul> | Infers the **piece sign** from a Boolean or a **piece qal**.<br><br>Boolean value `true` returns a negative sign (`-1`) and `false` a positive sign (`1`), the Boolean is meant to be the answer to *"is black the active color?"* (this way it can be used with `board.Active.isBlack`).<br><br>Any non-Boolean value will pass through `toVal()` and have its **piece val** tested to a greater-than-zero comparison. White pieces have a positive sign (`1`) and empty squares/black pieces a negative sign (`-1`).<hr>Examples: <ul><li>`IsepicChess.getSign("q") //-1`</li><li>`IsepicChess.getSign("Q") //1`</li><li>`IsepicChess.getSign(true) //-1`</li><li>`IsepicChess.getSign(false) //1`</li><li>`IsepicChess.getSign("err") //-1`</li></ul>
**getRankPos**(<br>*qos*<br>) | <ul><li>qos: <ul><li>**pieceBos** (String)</li><li>**piecePos** (Array)</li></ul></li></ul> | On valid input:<ul><li>**rankPos** (Number): `0-7`</li></ul><hr>On bad input: <ul><li>**unknown** (?): `?`</li></ul> | Converts the input to a **rank pos**.<hr>Examples: <ul><li>`IsepicChess.getRankPos("a1") //7`</li><li>`IsepicChess.getRankPos("a8") //0`</li><li>`IsepicChess.getRankPos("h1") //7`</li><li>`IsepicChess.getRankPos("h8") //0`</li><li>`IsepicChess.getRankPos([3, 6]) //3`</li><li>`IsepicChess.getRankPos([6, 3]) //6`</li></ul>
**getFilePos**(<br>*qos*<br>) | <ul><li>qos: <ul><li>**pieceBos** (String)</li><li>**piecePos** (Array)</li></ul></li></ul> | On valid input:<ul><li>**filePos** (Number): `0-7`</li></ul><hr>On bad input: <ul><li>**unknown** (?): `?`</li></ul> | Converts the input to a **file pos**.<hr>Examples: <ul><li>`IsepicChess.getFilePos("a1") //0`</li><li>`IsepicChess.getFilePos("a8") //0`</li><li>`IsepicChess.getFilePos("h1") //7`</li><li>`IsepicChess.getFilePos("h8") //7`</li><li>`IsepicChess.getFilePos([3, 6]) //6`</li><li>`IsepicChess.getFilePos([6, 3]) //3`</li></ul>
**getRankBos**(<br>*qos*<br>) | <ul><li>qos: <ul><li>**pieceBos** (String)</li><li>**piecePos** (Array)</li></ul></li></ul> | On valid input:<ul><li>**rankBos** (String): `1-8`</li></ul><hr>On bad input: <ul><li>**unknown** (?): `?`</li></ul> | Converts the input to a **rank bos**.<hr>Examples: <ul><li>`IsepicChess.getRankBos("a1") //"1"`</li><li>`IsepicChess.getRankBos("a8") //"8"`</li><li>`IsepicChess.getRankBos("h1") //"1"`</li><li>`IsepicChess.getRankBos("h8") //"8"`</li><li>`IsepicChess.getRankBos([3, 6]) //"5"`</li><li>`IsepicChess.getRankBos([6, 3]) //"2"`</li></ul>
**getFileBos**(<br>*qos*<br>) | <ul><li>qos: <ul><li>**pieceBos** (String)</li><li>**piecePos** (Array)</li></ul></li></ul> | On valid input:<ul><li>**fileBos** (String): `a-h`</li></ul><hr>On bad input: <ul><li>**unknown** (?): `?`</li></ul> | Converts the input to a **file bos**.<hr>Examples: <ul><li>`IsepicChess.getFileBos("a1") //"a"`</li><li>`IsepicChess.getFileBos("a8") //"a"`</li><li>`IsepicChess.getFileBos("h1") //"h"`</li><li>`IsepicChess.getFileBos("h8") //"h"`</li><li>`IsepicChess.getFileBos([3, 6]) //"g"`</li><li>`IsepicChess.getFileBos([6, 3]) //"d"`</li></ul>
**isInsideBoard**(<br>*qos*<br>) | <ul><li>qos: <ul><li>**pieceBos** (String)</li><li>**piecePos** (Array)</li></ul></li></ul> | Boolean | Test to see if a **qos** is inside the board or not.<hr>Examples: <ul><li>`IsepicChess.isInsideBoard("a1") //true`</li><li>`IsepicChess.isInsideBoard("a9") //false`</li><li>`IsepicChess.isInsideBoard("i3") //false`</li><li>`IsepicChess.isInsideBoard([7, 7]) //true`</li><li>`IsepicChess.isInsideBoard([8, 8]) //false`</li></ul>
**sameSqr**(<br>*qos1*,<br>*qos2*<br>) | <ul><li>qos1: <ul><li>**pieceBos** (String)</li><li>**piecePos** (Array)</li></ul></li><li>qos2: <ul><li>**pieceBos** (String)</li><li>**piecePos** (Array)</li></ul></li></ul> | Boolean | Test to see if two **qos** evaluate to the same square.<hr>Examples: <ul><li>`IsepicChess.sameSqr("a1", "a1") //true`</li><li>`IsepicChess.sameSqr("d2", [6, 3]) //true`</li><li>`IsepicChess.sameSqr([4, 5], [5, 4]) //false`</li></ul>
**removeBoard**(<br>*boardName*<br>) | <ul><li>boardName (String)</li></ul> | Success:<ul><li>Boolean: `true`</li></ul><hr>:small_red_triangle_down:Error: <ul><li>Boolean: `false`</li></ul> | Removes a board completely.<hr>Examples: <ul><li>`IsepicChess.removeBoard("myboard") //true`</li><li>`IsepicChess.removeBoard("nonexistent") //false`</li></ul><hr>:small_red_triangle_down:Error emits a `console.log(...)` if the board is not found.

:wrench: ... **list under construction** ... :wrench:

To Do
-------------

- PGN viewer
- show captured pieces
- move list variations
- set-up position mode

Copyright and License
-------------

Copyright © 2012 Ajax Isepic (ajax333221)

Licensed under MIT License: http://opensource.org/licenses/mit-license.php
