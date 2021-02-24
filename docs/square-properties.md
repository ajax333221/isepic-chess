<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>

<h1 align="center">Square properties</h1>

Squares from `board.getSquare()` and manually selected from `board.squares[<a1-h8>]` have the following accessible properties:

<ul>
<li>square.pos</li>
<li>square.bos</li>
<li>square.rankPos</li>
<li>square.filePos</li>
<li>square.rankBos</li>
<li>square.fileBos</li>
<li>square.bal</li>
<li>square.absBal</li>
<li>square.val</li>
<li>square.absVal</li>
<li>square.className</li>
<li>square.sign</li>
<li>square.isEmptySquare</li>
<li>square.isPawn</li>
<li>square.isKnight</li>
<li>square.isBishop</li>
<li>square.isRook</li>
<li>square.isQueen</li>
<li>square.isKing</li>
</ul>

#### Table `square.<properties>`:

Property | Type | Description
-------- | ---- | -----------
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

<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>
