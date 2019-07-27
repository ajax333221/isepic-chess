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
**boardExists**(<br>*boardName*<br>) | <ul><li>boardName (String)</li></ul> | <ul><li>Boolean</li></ul> | See if a board exists or not.<hr>Examples: <ul><li>`IsepicChess.boardExists("myboard") //true`</li><li>`IsepicChess.boardExists("nonexistent") //false`</li></ul>
**selectBoard**(<br>*boardName*<br>) | <ul><li>boardName (String)</li></ul> | Success:<ul><li>**boardObj** (Object)</li></ul><hr>:small_red_triangle_down:Error: <ul><li>null</li></ul> | Used to have a board returned (usually to call a **board.function**).<hr>Examples: <ul><li>`IsepicChess.selectBoard("myboard") //Object{...}`</li><li>`IsepicChess.selectBoard("nonexistent") //null`</li></ul><hr>:small_red_triangle_down:Error emits a `console.log(...)`
**toVal**(<br>*qal*<br>) | <ul><li>qal (String/Number): <ul><li>**pieceBal** (String): `"k", "q", "r", "b", "n", "p", "*", "P", "N", "B", "R", "Q", "K"`</li><li>**pieceVal** (Number): `-6 to 6`</li></ul></li></ul> | Success:<ul><li>**pieceVal** (Number): `-6 to 6`</li></ul><hr>Error: <ul><li>**pieceVal** (Number): `0`</li></ul> | Converts **piece bals** and **piece vals** to **piece vals**.<hr>Examples: <ul><li>`IsepicChess.toVal("b") //-3`</li><li>`IsepicChess.toVal("K") //6`</li><li>`IsepicChess.toVal("*") //0`</li><li>`IsepicChess.toVal(-5) //-5`</li><li>`IsepicChess.toVal("err") //0`</li></ul>
**toAbsVal**(<br>*qal*<br>) | <ul><li>qal (String/Number): <ul><li>**pieceBal** (String): `"k", "q", "r", "b", "n", "p", "*", "P", "N", "B", "R", "Q", "K"`</li><li>**pieceVal** (Number): `-6 to 6`</li></ul></li></ul> | Success:<ul><li>**pieceAbsVal** (Number): `0 to 6`</li></ul><hr>Error: <ul><li>**pieceAbsVal** (Number): `0`</li></ul> | Converts **piece bals** and **piece vals** to **piece abs vals**.<hr>Examples: <ul><li>`IsepicChess.toAbsVal("b") //3`</li><li>`IsepicChess.toAbsVal("K") //6`</li><li>`IsepicChess.toAbsVal("*") //0`</li><li>`IsepicChess.toAbsVal(-5) //5`</li><li>`IsepicChess.toAbsVal("err") //0`</li></ul>
**toPieceClass**(<br>*qal*<br>) | <ul><li>qal (String/Number): <ul><li>**pieceBal** (String): `"k", "q", "r", "b", "n", "p", "*", "P", "N", "B", "R", "Q", "K"`</li><li>**pieceVal** (Number): `-6 to 6`</li></ul></li></ul> | Success:<ul><li>**pieceClass** (String): `"bk", "bq", "br", "bb", "bn", "bp", "", "wp", "wn", "wb", "wr", "wq", "wk"`</li></ul><hr>Error: <ul><li>**pieceClass** (String): `""`</li></ul> | Converts **piece bals** and **piece vals** to **piece classes**.<hr>Examples: <ul><li>`IsepicChess.toPieceClass("b") //"bb"`</li><li>`IsepicChess.toPieceClass("K") //"wk"`</li><li>`IsepicChess.toPieceClass("*") //""`</li><li>`IsepicChess.toPieceClass(-5) //"bq"`</li><li>`IsepicChess.toPieceClass("err") //""`</li></ul>

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
