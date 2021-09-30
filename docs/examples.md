<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>

<h1 align="center">Examples</h1>

<p>Some examples of recurrent tasks users might have:</p>

<ul>
<li><a href="#1">Creating a board</a></li>
<li><a href="#2">Creating a board (and keeping a reference)</a></li>
<li><a href="#3">Validating a FEN position</a></li>
<li><a href="#4">PGN parsing</a></li>
<li><a href="#5">How to know if a position is in check/checkmate/draw/etc.?</a></li>
<li><a href="#6">How to get legal moves? (for a specific square)</a></li>
<li><a href="#7">How to get legal moves? (all legal moves)</a></li>
<li><a href="#8">Playing a move</a></li>
<li><a href="#9">Playing multiple moves</a></li>
</ul>

<h3 id="1">→ Creating a board</h3>

<h5>Method A:</h5>
<pre>Ic.initBoard();</pre>

<hr>

<h3 id="2">→ Creating a board (and keeping a reference)</h3>

<h5>Method A:</h5>
<pre>var board = Ic.initBoard();</pre>

<h5>Method B:</h5>
<pre>Ic.initBoard({
    boardName: "board_name"
});
<br>var board = Ic.getBoard("board_name");</pre>

<hr>

<h3 id="3">→ Validating a FEN position</h3>

<h5>Method A:</h5>
<pre>Ic.isLegalFen(fen);</pre>

<h5>Method B:</h5>
<pre>Ic.fenApply(fen); //or Ic.fenApply(fen, "isLegalFen")</pre>

<h5>Method C:</h5>
<pre>var p = {
    fen: fen,
    validOrBreak: true
};
<br>(Ic.initBoard(p) !== null)</pre>

<small><strong>Note:</strong> this method will cause a UI refresh when using `isepic-chess-ui.js`.</small>
<br><small><strong>Note:</strong> this method will send console log errors when the board creation fails.</small>

<hr>

<h3 id="4">→ PGN parsing</h3>
<h5>Method A:</h5>
<pre>var example_pgn = `[Event "m1 London"]
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
<br>var board = Ic.initBoard({pgn: example_pgn});</pre>

<hr>

<h3 id="5">→ How to know if a position is in check/checkmate/draw/etc.?</h3>
<h5>From the board properties of a board (Object):</h5>
<pre>var board = Ic.initBoard();
<br>board.isCheck;
board.isCheckmate;
board.inDraw;
...</pre>

<h5>From a FEN position:</h5>
<pre>var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
<br>var temp = Ic.fenGet(fen, "isCheck isCheckmate inDraw"); //space-separated board properties
<br>var in_check = false;
<br>if(temp !== null){
    in_check = temp.isCheck;
}</pre>

Or

<pre>var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
<br>var temp = Ic.fenGet(fen, "isCheck");
<br>var in_check = (temp !== null ? temp.isCheck : false);</pre>

<small><strong>Note:</strong> we need to guard against `Ic.fenGet()` returning `null` (because `null.isCheck` would cause a breaking error).</small>

<hr>

<h3 id="6">→ How to get legal moves? (for a specific square)</h3>
<h5>From a board method call of a board (Object):</h5>
<pre>var board = Ic.initBoard();
<br>board.legalMoves("b1"); //["c3", "a3"]
<br>board.legalFenMoves("b1"); //["rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR b KQkq - 1 1", "rnbqkbnr/pppppppp/8/8/8/N7/PPPPPPPP/R1BQKBNR b KQkq - 1 1"]
<br>board.legalSanMoves("b1"); //["Nc3", "Na3"]
<br>board.legalUciMoves("b1"); //["b1c3", "b1a3"]</pre>

<h5>From a FEN position:</h5>
<pre>var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
<br>Ic.fenApply(fen, "legalMoves", ["b1"]); //["c3", "a3"]
<br>Ic.fenApply(fen, "legalFenMoves", ["b1"]); //["rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR b KQkq - 1 1", "rnbqkbnr/pppppppp/8/8/8/N7/PPPPPPPP/R1BQKBNR b KQkq - 1 1"]
<br>Ic.fenApply(fen, "legalSanMoves", ["b1"]); //["Nc3", "Na3"]
<br>Ic.fenApply(fen, "legalUciMoves", ["b1"]); //["b1c3", "b1a3"]</pre>

<hr>

<h3 id="7">→ How to get legal moves? (all legal moves)</h3>
<h5>From the board properties of a board (Object):</h5>
<pre>var board = Ic.initBoard();
<br>board.legalUci;
//["a2a3", "a2a4", "b2b3", "b2b4", "c2c3", "c2c4", "d2d3", "d2d4", "e2e3", "e2e4", "f2f3", "f2f4", "g2g3", "g2g4", "h2h3", "h2h4", "b1c3", "b1a3", "g1h3", "g1f3"]
<br>board.legalUciTree;
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
<br>board.legalRevTree;
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
}*/</pre>

<h5>From a FEN position:</h5>
<pre>var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
<br>var temp = Ic.fenGet(fen, "legalUci legalUciTree legalRevTree");
<br>if(temp !== null){ ... }</pre>

<hr>

<h3 id="8">→ Playing a move</h3>
<h5>Affecting the board:</h5>
<pre>var board = Ic.initBoard();
<br>board.playMove("e4");</pre>

<h5>Without affecting the board (mock move):</h5>
<pre>var board = Ic.initBoard();
<br>board.playMove("e4", {isMockMove: true});</pre>

<small><strong>Note:</strong> useful when interested in a future move (Object) but without actually making the move.</small>

<h5>From a FEN position:</h5>
<pre>var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
<br>Ic.fenApply(fen, "playMove", ["e4"]);</pre>

<hr>

<h3 id="9">→ Playing multiple moves</h3>
<h5>Playing moves into a board (Object):</h5>
<pre>var board = Ic.initBoard();
<br>board.playMoves(["e4", "e7-e5", "Nf3", "f8c5"]); //you can mix move-types</pre>

<h5>From a FEN position:</h5>
<pre>var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
<br>Ic.fenApply(fen, "playMoves", [["e4", "e7-e5", "Nf3", "f8c5"]]); //notice the double [[]]</pre>

<small><strong>Note:</strong> playing multiple moves into a temporal board that will instantly get deleted is very unusual and will have only one specific narrow goal (the returned Boolean to test if all the moves can be successfully played to the FEN or not), but I chose to include this example out of consistency.</small>

<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>
