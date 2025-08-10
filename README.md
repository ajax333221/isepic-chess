<p align="center"><a href="https://github.com/ajax333221/isepic-chess"><img width="100" src="https://github.com/ajax333221/isepic-chess-ui/raw/master/css/images/ic_logo.png" alt="Ic.js logo"></a></p>

<h1 align="center">isepic-chess.js</h1>

<p align="center">
	<a href="https://github.com/ajax333221/isepic-chess/releases/latest"><img src="https://img.shields.io/github/v/release/ajax333221/isepic-chess.svg?colorB=dddddd" alt="latest release"></a>
	<a href="https://www.npmjs.com/package/isepic-chess"><img src="https://img.shields.io/npm/v/isepic-chess.svg" alt="npm version"></a>
	<a href="https://github.com/facebook/jest"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="tested with Jest"></a>
	<a href="#page_facing_up-copyright-and-license"><img src="https://img.shields.io/github/license/ajax333221/isepic-chess.svg" alt="license"></a>
  <a href="https://github.com/search?q=repo%3Aajax333221%2Fisepic-chess++language%3ATypeScript&type=code"><img src="https://img.shields.io/badge/built%20with-typescript-3178C6?style=flat&logo=typescript&logoColor=white" alt="built with TypeScript"></a>
	<a href="https://www.reddit.com/r/isepic_chess_js"><img src="https://img.shields.io/reddit/subreddit-subscribers/isepic_chess_js?style=social" alt="official subreddit"></a>
</p>

<br>

`isepic-chess.js` is a lightweight and flexible chess utility library for JavaScript, providing robust features like legal moves calculation, FEN validation, SAN parsing, and more. It emphasizes a UI-less and dependency-less design, making it a powerful backend for any chess application.

<ul>
<li><strong>:sparkles: Flexibility:</strong> Inspired by JavaScript's flexibility, it strives to make things work without easily giving up and throwing errors.</li>
<li><strong>:white_check_mark: Code Coverage:</strong> Despite its flexibility and complexity, it achieves an impressive <strong>98~%</strong> code coverage <sup>(as of `v6.0.0`)</sup>, ensuring reliability.</li>
<li><strong>:chart_with_upwards_trend: Perft-Tested:</strong> Each release is rigorously tested against known Perft positions to guarantee accurate move generation.</li>
<li><strong>:no_entry_sign: UI-less:</strong> All user interface code is completely separated into the <a href="https://github.com/ajax333221/isepic-chess-ui">Isepic Chess UI</a> project, keeping this library lightweight</li>
<li><strong>:x: Dependency-less:</strong> It operates entirely without relying on any other external libraries.</li>
</ul>

## :pushpin: Table of contents

- [isepic-chess.js](https://github.com/ajax333221/isepic-chess#isepic-chessjs)
- [Table of contents](https://github.com/ajax333221/isepic-chess#pushpin-table-of-contents)
- [Installation](https://github.com/ajax333221/isepic-chess#computer_mouse-installation)
- [Node.js example](https://github.com/ajax333221/isepic-chess#green_heart-nodejs-example)
- [Demo](https://github.com/ajax333221/isepic-chess#eye-demo-from-isepic-chess-ui)
- [Features](https://github.com/ajax333221/isepic-chess#rocket-features)
- [Documentation](https://github.com/ajax333221/isepic-chess#book-documentation)
- [Copyright and license](https://github.com/ajax333221/isepic-chess#page_facing_up-copyright-and-license)

## :computer_mouse: Installation

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

## :green_heart: Node.js example

```js
const { Ic } = require('isepic-chess');

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
  pgn: example_pgn,
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
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  'r1bqk2r/pppp1pbp/2n2n2/4p3/5p2/2N3PN/PPPPP1BP/R1BQK2R w KQkq - 2 8',
  'r2qkb1r/pbp1p1p1/1pnp1n1p/5p2/4P2P/5NP1/PPPPKPB1/RNBQR3 w kq - 0 8',
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  'r2qkbnr/ppp4p/2np1p2/4p3/3PP3/P2B1N2/1PP2PpP/RNBQ1RK1 b kq - 1 11',
];

/* transform each FEN into arrays with their legal SAN moves for the g2 square */
var mapped = fen_arr.map((fen) => Ic.fenApply(fen, 'legalSanMoves', ['g2']));

console.log(mapped);
// [
//  ["g3", "g4"],
//  ["Bf1", "Bf3", "Be4", "Bd5", "Bxc6"],
//  ["Bh3", "Bh1", "Bf1"],
//  [],
//  ["gxf1=N", "gxf1=B", "gxf1=R+", "gxf1=Q+"]
// ]

/* get only the positions where the white king is not in its original square */
var filtered = fen_arr.filter((fen) => {
  var obj, rtn;

  rtn = false;
  obj = Ic.fenGet(fen, 'w');

  if (obj) {
    rtn = obj.w.kingBos !== 'e1';
  }

  return rtn;
});

console.log(filtered);
// [
//  "r2qkb1r/pbp1p1p1/1pnp1n1p/5p2/4P2P/5NP1/PPPPKPB1/RNBQR3 w kq - 0 8",
//  "r2qkbnr/ppp4p/2np1p2/4p3/3PP3/P2B1N2/1PP2PpP/RNBQ1RK1 b kq - 1 11"
// ]

var methodChaining = Ic('otherBoard')
  .playMoves(['f3', 'e5', 'g4'])
  .getCheckmateMoves()
  .undoMove()
  .playMoves(['e4', 'Qh4'])
  .uciExport()
  .legalUciMoves('g2');

console.log(methodChaining.stack);
// [
//  true,
//  ["d8h4"],
//  {
//   "colorMoved": "w",
//   "colorToPlay": "b",
//   "fen": "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2",
//   "san": "g4",
//   "uci": "g2g4",
//   "piece": "p",
//   ...
//  },
//  true,
//  "f2f3 e7e5 e2e4 d8h4"
//  ["g2g3"]
// ]

console.log(methodChaining.board.legalUci);
// ["g2g3", "e1e2"]
```

## :eye: Demo <sup>(from [isepic-chess-ui](https://github.com/ajax333221/isepic-chess-ui))</sup>

https://ajax333221.github.io/isepic-chess-ui/

## :rocket: Features

<h4><strong>Core Game Logic:</strong></h4>
<ul>
<li><strong>Generates Legal Moves:</strong> Efficiently calculates all legal moves for any given board state.</li>
<li><strong>Detects Checks, Checkmates &amp; Draws:</strong> Identifies when a king is in check and recognizes checkmate and various draw positions. It also includes functions to find moves that <em>lead to</em> checkmate or a draw.</li>
<li><strong>Handles Pawn Promotion:</strong> Offers options to specify the desired promotion piece (Queen, Rook, Bishop, Knight).</li>
<li><strong>Calculates Material Difference:</strong> Quickly determines the material advantage for each side.</li>
<li><strong>Analyzes Square Control:</strong> Provides functionality to determine the number of attackers/defenders on any given square.</li>
</ul>

<h4><strong>Game State Management:</strong></h4>
<ul>
<li><strong>Comprehensive FEN Support:</strong> Imports (<code>loadFen</code>), exports (<code>toFen</code>), and performs advanced validation of FEN strings. Features powerful one-liner operations via <code>Ic.fenApply()</code> and <code>Ic.fenGet()</code>.</li>
<li><strong>PGN Import/Export:</strong> Supports importing and exporting games in Portable Game Notation (PGN).</li>
<li><strong>UCI Import/Export:</strong> Compatible with Universal Chess Interface (UCI) for moves.</li>
<li><strong>Parses SAN (Standard Algebraic Notation):</strong> Converts human-readable SAN move strings into a machine-interpretable format for board operations.</li>
<li><strong>Navigable Move History:</strong> Offers full control over game history with methods for navigating (<code>navFirst</code>, <code>navLast</code>, <code>navPrevious</code>, <code>navNext</code>, <code>undoMove</code>, <code>redoMove</code>, <code>toMove</code>, <code>reset</code>).</li>
<li><strong>Multiple Board Instances:</strong> Allows managing several independent chess boards concurrently.</li>
</ul>

<h4><strong>Miscellaneous:</strong></h4>
<ul>
<li><strong>Type-Safe (TypeScript):</strong> Rewritten in TypeScript for improved code quality, maintainability, and enhanced developer experience.</li>
<li><strong>Chainable Board Methods:</strong> Provides a fluent API for chaining multiple board operations together for concise code.</li>
<li><strong>Generates ASCII Board Diagrams:</strong> Creates visual ASCII representations of the board state, useful for debugging or console output.</li>
<li><strong>Puzzle Mode:</strong> (&#x1f6a7; work in progress &#x1f6a7;) An upcoming feature designed to facilitate the creation, analysis, and solving of chess puzzles directly within the library.</li>
</ul>

## :book: Documentation

- [Examples](https://github.com/ajax333221/isepic-chess/blob/master/docs/examples.md#examples)
- [Ic methods](https://github.com/ajax333221/isepic-chess/blob/master/docs/ic-methods.md#ic-methods)
- [Board methods](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-methods.md#board-methods)
- [Board properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-properties.md#board-properties)
- [Square properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/square-properties.md#square-properties)
- [Move properties](https://github.com/ajax333221/isepic-chess/blob/master/docs/move-properties.md#move-properties)

## :page_facing_up: Copyright and license

Copyright © 2025 Ajax Isepic (ajax333221)

Licensed under MIT License: http://opensource.org/licenses/mit-license.php
