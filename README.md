<p align="center"><a href="https://github.com/ajax333221/isepic-chess"><img width="100" src="https://github.com/ajax333221/isepic-chess-ui/raw/master/css/images/ic_logo.png" alt="Ic.js logo"></a></p>

<h1 align="center">isepic-chess.js</h1>

<p align="center">
	<a href="https://github.com/ajax333221/isepic-chess/releases/latest"><img src="https://img.shields.io/github/v/release/ajax333221/isepic-chess.svg?colorB=dddddd" alt="latest release"></a>
	<a href="https://www.npmjs.com/package/isepic-chess"><img src="https://img.shields.io/npm/v/isepic-chess.svg" alt="npm version"></a>
	<a href="https://github.com/facebook/jest"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="tested with Jest"></a>
	<a href="#page_facing_up-copyright-and-license"><img src="https://img.shields.io/github/license/ajax333221/isepic-chess.svg" alt="license"></a>
	<a href="https://www.reddit.com/r/isepic_chess_js"><img src="https://img.shields.io/reddit/subreddit-subscribers/isepic_chess_js?style=social" alt="official subreddit"></a>
</p>

<br>

`isepic-chess.js` is a chess utility library written in JavaScript, it provides features like legal moves calculation, FEN validation, SAN parsing, etc. (see: [Features](https://github.com/ajax333221/isepic-chess#rocket-features)).

<strong>Flexibility:</strong> it strives to be flexible (inspired by JavaScript) and attempts to make things work without easily giving up and throwing errors.

<strong>Code coverage:</strong> the extra flexibility adds extra complexity and paths to be tested, but despite this, the code coverage is <strong>98~%</strong> <sup>(as of `v6.0.0`)</sup>.

<strong>Perft-tested:</strong> each release is tested against known <em>Perft positions</em> to ensure that the move generation tree of legal moves do not vary from the correct count.

<strong>UI-less:</strong> all the bloating code that a user interface brings is completely separated into this other project: [Isepic Chess UI](https://github.com/ajax333221/isepic-chess-ui).

<strong>Dependency-less:</strong> does not depend on any other library.

:pushpin: Table of contents
-------------

- [isepic-chess.js](https://github.com/ajax333221/isepic-chess#isepic-chessjs)
- [Table of contents](https://github.com/ajax333221/isepic-chess#pushpin-table-of-contents)
- [Installation](https://github.com/ajax333221/isepic-chess#computer_mouse-installation)
- [Node.js example](https://github.com/ajax333221/isepic-chess#green_heart-nodejs-example)
- [Demo](https://github.com/ajax333221/isepic-chess#eye-demo-from-isepic-chess-ui)
- [Features](https://github.com/ajax333221/isepic-chess#rocket-features)
- [Documentation](https://github.com/ajax333221/isepic-chess#book-documentation)
- [Copyright and license](https://github.com/ajax333221/isepic-chess#page_facing_up-copyright-and-license)

:computer_mouse: Installation
-------------

```
# NPM
npm install isepic-chess
```
Then: `const {Ic} = require("isepic-chess");`

<hr>

```html
# Web browser
<script src="./isepic-chess.js"></script>
```
The variable `Ic` will be added to window.

:green_heart: Node.js example
-------------

```js
const {Ic} = require("isepic-chess");

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
  pgn : example_pgn
});

console.log(board.ascii());
//   +------------------------+
// 8 | .  .  .  .  .  .  .  k |
// 7 | p  p  .  .  .  .  p  p |
// 6 | .  .  .  .  .  .  r  . |
// 5 | .  .  .  .  .  .  .  . |
// 4 | .  .  .  P  p  .  .  P |
// 3 | .  P  .  .  .  .  .  . |
// 2 | P  .  .  .  .  .  q  K |
// 1 | R  .  B  .  Q  .  .  . |
//   +------------------------+
//     a  b  c  d  e  f  g  h

console.log(board.fen);
// "7k/pp4pp/6r1/8/3Pp2P/1P6/P5qK/R1B1Q3 w - - 0 37"

var fen_arr = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r1bqk2r/pppp1pbp/2n2n2/4p3/5p2/2N3PN/PPPPP1BP/R1BQK2R w KQkq - 2 8",
  "r2qkb1r/pbp1p1p1/1pnp1n1p/5p2/4P2P/5NP1/PPPPKPB1/RNBQR3 w kq - 0 8",
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  "r2qkbnr/ppp4p/2np1p2/4p3/3PP3/P2B1N2/1PP2PpP/RNBQ1RK1 b kq - 1 11"
];

/* transform each FEN into arrays with their legal UCI moves for the g2 square */
var mapped = fen_arr.map(function(fen){
  return Ic.fenApply(fen, "legalUciMoves", ["g2"]);
});

console.log(mapped);
// [
//  ["g2g3", "g2g4"],
//  ["g2f1", "g2f3", "g2e4", "g2d5", "g2c6"],
//  ["g2h3", "g2h1", "g2f1"],
//  [],
//  ["g2f1n", "g2f1b", "g2f1r", "g2f1q"]
// ]

/* get only the positions where the white king is not in its original square */
var filtered = fen_arr.filter(function(fen){
  var obj, rtn;
  
  rtn = false;
  obj = Ic.fenGet(fen, "w");
  
  if(obj){
    rtn = (obj.w.kingBos!=="e1");
  }
  
  return rtn;
});

console.log(filtered);
// [
//  "r2qkb1r/pbp1p1p1/1pnp1n1p/5p2/4P2P/5NP1/PPPPKPB1/RNBQR3 w kq - 0 8",
//  "r2qkbnr/ppp4p/2np1p2/4p3/3PP3/P2B1N2/1PP2PpP/RNBQ1RK1 b kq - 1 11"
// ]
```

:eye: Demo <sup>(from [isepic-chess-ui](https://github.com/ajax333221/isepic-chess-ui))</sup>
-------------

https://ajax333221.github.io/isepic-chess-ui/

:rocket: Features
-------------

- Get legal moves
- Lookahead moves that result in checkmate / draw
- Check / checkmate / draw detection
- Pawn promotion options
- PGN import / export
- UCI import / export
- ASCII diagram
- Material difference
- Multiple boards at once
- Navigable move history and helper methods (first, last, previous, undo move, reset, etc.)
- Powerful FEN one-liner operations <sup>(`Ic.fenApply()` and `Ic.fenGet()`)</sup>
- Advanced FEN validation
- SAN parsing

:book: Documentation
-------------

- [Examples](https://github.com/ajax333221/isepic-chess/blob/master/docs/examples.md#examples)
- [Ic methods](https://github.com/ajax333221/isepic-chess/blob/master/docs/ic-methods.md#ic-methods)
- [Board methods](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-methods.md#board-methods)
- [Board properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-properties.md#board-properties)
- [Square properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/square-properties.md#square-properties)
- [Move properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/move-properties.md#move-properties)

:page_facing_up: Copyright and license
-------------

Copyright © 2021 Ajax Isepic (ajax333221)

Licensed under MIT License: http://opensource.org/licenses/mit-license.php
