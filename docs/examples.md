<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>

<h1 align="center">Examples</h1>

<p>Some examples of recurrent tasks users might have:</p>

<ul>
<li><a href="#1">Creating a board</a></li>
<li><a href="#2">Creating a board (and keeping a reference)</a></li>
<li><a href="#3">Loading a FEN position</a></li>
<li><a href="#4">Validating a FEN position</a></li>
<li><a href="#5">PGN parsing</a></li>
<li><a href="#6">How to know if a position is in check/checkmate/draw/etc.?</a></li>
<li><a href="#7">How to get legal moves? (for a specific square)</a></li>
<li><a href="#8">How to get legal moves? (all legal moves)</a></li>
<li><a href="#9">Playing a move</a></li>
<li><a href="#10">Playing multiple moves</a></li>
<li><a href="#11">Playing a random move</a></li>
<li><a href="#12">Method chaining</a></li>
</ul>

<h3 id="1">→ Creating a board</h3>
<strong>Method A:</strong>

```js
Ic.initBoard();
```

<strong>Method B:</strong>

```js
Ic();
```

<hr>

<h3 id="2">→ Creating a board (and keeping a reference)</h3>
<strong>Method A:</strong>

```js
var board = Ic.initBoard();
```

<strong>Method B:</strong>

```js
var board = Ic().board;
```

<strong>Method C:</strong>

```js
Ic.initBoard({
  boardName: "board_name"
});

var board = Ic.getBoard("board_name");
```

<strong>Method D:</strong>

```js
Ic("board_name");

var board = Ic.getBoard("board_name");
```

<hr>

<h3 id="3">→ Loading a FEN position</h3>
<strong>Loading into a board (Object):</strong>

```js
var board = Ic.initBoard();

board.loadFen("r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3");
```

<strong>Initializing/overwriting a board (Object):</strong>

```js
Ic.initBoard({
  fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"
});
```

<hr>

<h3 id="4">→ Validating a FEN position</h3>
<strong>Method A:</strong>

```js
Ic.isLegalFen(fen);
```

<strong>Method B:</strong>

```js
Ic.fenApply(fen); //or Ic.fenApply(fen, "isLegalFen")
```

<strong>Method C:</strong>

```js
var p = {
  fen: fen,
  validOrBreak: true
};

(Ic.initBoard(p) !== null)
```

<small><strong>Note:</strong> this method will cause a UI refresh when using `isepic-chess-ui.js`.</small>
<br><small><strong>Note:</strong> this method will send console log errors when the board creation fails.</small>

<hr>

<h3 id="5">→ PGN parsing</h3>
<strong>Method A:</strong>

```js
var example_pgn = `[Event "m1 London"]
[Site "?"]
[Date "1861.07.??"]
[Round "9"]
[White "Kolisch, Ignatz"]
[Black "Anderssen, Adolf"]
[Result "0-1"]
[Annotator "JvR"]
[SetUp "1"]
[FEN "5r1k/pp4pp/3r3q/8/3PpP1P/1P2NbP1/PB1Q3K/R7 b - - 0 30"]
[PlyCount "13"]
[EventDate "1861.??.??"]

30... Rxf4 $1 {Anderssen starts fireworks.} 31. Qe1 (31.gxf4 $2 Qxh4+ 32.Kg1
Rg6+) 31... Rg6 (31...Rxh4+ $1 32.gxh4 Rg6 $1) 32. Bc1 (32.Ng2 $1) 32... Rxh4+
$1 33. gxh4 Qf4+ 34. Kh3 Bg2+ $1 35. Nxg2 Qf3+ 36. Kh2 Qxg2# { Anderssen won
the match by this mate (+4, =2, -3).} 0-1`;

var board = Ic.initBoard({
  pgn: example_pgn
});
```

<hr>

<h3 id="6">→ How to know if a position is in check/checkmate/draw/etc.?</h3>
<strong>From the board properties of a board (Object):</strong>

```js
var board = Ic.initBoard();

board.isCheck;
board.isCheckmate;
board.inDraw;
...
```

<strong>From a FEN position:</strong>

```js
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var temp = Ic.fenGet(fen, "isCheck isCheckmate inDraw"); //space-separated board properties

var in_check = false;

if(temp !== null){
  in_check = temp.isCheck;
}
```

Or

```js
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var temp = Ic.fenGet(fen, "isCheck");

var in_check = (temp !== null ? temp.isCheck : false);
```

<small><strong>Note:</strong> we need to guard against `Ic.fenGet()` returning `null` (because `null.isCheck` would cause a breaking error).</small>

<hr>

<h3 id="7">→ How to get legal moves? (for a specific square)</h3>
<strong>From a board method call of a board (Object):</strong>

```js
var board = Ic.initBoard();

board.legalMoves("b1"); //["c3", "a3"]

board.legalFenMoves("b1"); //["rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR b KQkq - 1 1", "rnbqkbnr/pppppppp/8/8/8/N7/PPPPPPPP/R1BQKBNR b KQkq - 1 1"]

board.legalSanMoves("b1"); //["Nc3", "Na3"]

board.legalUciMoves("b1"); //["b1c3", "b1a3"]
```

<strong>From a FEN position:</strong>

```js
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

Ic.fenApply(fen, "legalMoves", ["b1"]); //["c3", "a3"]

Ic.fenApply(fen, "legalFenMoves", ["b1"]); //["rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR b KQkq - 1 1", "rnbqkbnr/pppppppp/8/8/8/N7/PPPPPPPP/R1BQKBNR b KQkq - 1 1"]

Ic.fenApply(fen, "legalSanMoves", ["b1"]); //["Nc3", "Na3"]

Ic.fenApply(fen, "legalUciMoves", ["b1"]); //["b1c3", "b1a3"]
```

<hr>

<h3 id="8">→ How to get legal moves? (all legal moves)</h3>
<strong>From the board properties of a board (Object):</strong>

```js
var board = Ic.initBoard();

board.legalUci;
//["a2a3", "a2a4", "b2b3", "b2b4", "c2c3", "c2c4", "d2d3", "d2d4", "e2e3", "e2e4", "f2f3", "f2f4", "g2g3", "g2g4", "h2h3", "h2h4", "b1c3", "b1a3", "g1h3", "g1f3"]

board.legalUciTree;
/*{
  "a2": ["a2a3", "a2a4"],
  "b2": ["b2b3", "b2b4"],
  "c2": ["c2c3", "c2c4"],
  "d2": ["d2d3", "d2d4"],
  "e2": ["e2e3", "e2e4"],
  "f2": ["f2f3", "f2f4"],
  "g2": ["g2g3", "g2g4"],
  "h2": ["h2h3", "h2h4"],
  "b1": ["b1c3", "b1a3"],
  "g1": ["g1h3", "g1f3"]
}*/

board.legalRevTree;
/*{
  "a3": {"p": ["a2"], "n": ["b1"]},
  "a4": {"p": ["a2"]},
  "b3": {"p": ["b2"]},
  "b4": {"p": ["b2"]},
  "c3": {"p": ["c2"], "n": ["b1"]},
  "c4": {"p": ["c2"]},
  "d3": {"p": ["d2"]},
  "d4": {"p": ["d2"]},
  "e3": {"p": ["e2"]},
  "e4": {"p": ["e2"]},
  "f3": {"p": ["f2"], "n": ["g1"]},
  "f4": {"p": ["f2"]},
  "g3": {"p": ["g2"]},
  "g4": {"p": ["g2"]},
  "h3": {"p": ["h2"], "n": ["g1"]},
  "h4": {"p": ["h2"]}
}*/
```

<strong>From a FEN position:</strong>

```js
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var temp = Ic.fenGet(fen, "legalUci legalUciTree legalRevTree");

if(temp !== null){ ... }
```

<hr>

<h3 id="9">→ Playing a move</h3>
<strong>Affecting the board:</strong>

```js
var board = Ic.initBoard();

board.playMove("e4");
```

<strong>Without affecting the board (mock move):</strong>

```js
var board = Ic.initBoard();

board.playMove("e4", {isMockMove: true});
```

<small><strong>Note:</strong> useful when interested in a future move (Object) but without actually making the move.</small>

<strong>From a FEN position:</strong>

```js
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

Ic.fenApply(fen, "playMove", ["e4"]);
```

<hr>

<h3 id="10">→ Playing multiple moves</h3>
<strong>Playing moves into a board (Object):</strong>

```js
var board = Ic.initBoard();

board.playMoves(["e4", "e7-e5", "Nf3", "f8c5"]); //you can mix move-types
```

<strong>From a FEN position:</strong>

```js
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

Ic.fenApply(fen, "playMoves", [["e4", "e7-e5", "Nf3", "f8c5"]]); //notice the double [[]]
```

<small><strong>Note:</strong> playing multiple moves into a temporal board that will instantly get deleted is very unusual and will have only one specific narrow goal (the returned Boolean to test if all the moves can be successfully played to the FEN or not), but I chose to include this example out of consistency.</small>

<hr>

<h3 id="11">→ Playing a random move</h3>
<strong>Playing a random move into a board (Object):</strong>

```js
var board = Ic.initBoard();

board.playRandomMove();
```

<strong>Playing a random move into a board (Object), but enforcing a promotion piece:</strong>

```js
var board = Ic.initBoard();

board.playRandomMove({promoteTo: "q"});
```

<strong>From a FEN position:</strong>

```js
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

Ic.fenApply(fen, "playRandomMove");
Ic.fenApply(fen, "playRandomMove", [{promoteTo: "q"}]);
```

<hr>

<h3 id="12">→ Method chaining</h3>
<strong>Creating a "chainable board" object:</strong>

```js
var methodChaining = Ic("board_name");

methodChaining.playRandomMove().playRandomMove().playRandomMove();

console.log(methodChaining);
// chainable board (Object)
// |
// |---stack (Array)
// |
// |---board (Object)
// |   |
// |   |---<board properties>
// |   |
// |   \---<board methods>
// |
// \---<chainable board methods>
//     |
//     |---applies the corresponding board method call and appends the result to the stack
//     |
//     \---returns itself as chainable board (Object)

console.log(methodChaining.stack);
// [...]

console.log(methodChaining.board);
// board (Object)
```

<small><strong>Note:</strong> if the selector identifies an existing board, that board will be used. Otherwise, a new board will be created with the board name (if provided).</small>
<br><small><strong>Note:</strong> each time the `Ic(...)` function is called, a new stack will be initialized. However, reusing a reference to the chainable board will append results to the existing stack.</small>

<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>
