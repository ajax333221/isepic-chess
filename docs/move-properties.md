<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>

<h1 align="center">Move properties</h1>

Moves from `board.playMove()` and manually selected from `board.moveList[<index>]` have the following accessible properties:

<ul>
<li>move.colorMoved</li>
<li>move.colorToPlay</li>
<li>move.fen</li>
<li>move.san</li>
<li>move.uci</li>
<li>move.comment</li>
<li>move.moveResult</li>
<li>move.canDraw</li>
<li>move.isCapture</li>
<li>move.fromBos</li>
<li>move.toBos</li>
<li>move.piece</li>
<li>move.promotion</li>
</ul>

#### Table `move.<properties>`:

Property | Type | Description
-------- | ---- | -----------
**colorMoved** | String | The **color** (`"w"` or `"b"`) that corresponds to this move.
**colorToPlay** | String | The **color** (`"w"` or `"b"`) that will be next to play after this move is played.
**fen** | String | The **fen** after this move is played.
**san** | String | The **san** for this move.
**uci** | String | The **uci** for this move.
**comment** | String | `"{...}"` a **comment** to be shown after the san for this move, it holds an empty string if no comment.
**moveResult** | String | If a checkmate or stalemate happened in this move, the value will be a **result** `"1-0", "0-1", "1/2-1/2"`, it holds an empty string otherwise.
**canDraw** | Boolean | The value of `board.inDraw` after this move is played.
**isCapture** | Boolean | `true` if there was a **piece capture** in this move.
**fromBos** | String | The origin (from) **squareBos**.
**toBos** | String | The destination (to) **squareBos**.
**piece** | String | The **lowercased piece bal** character.
**promotion** | String | The **lowercased promotion bal** character, it holds an empty string if no promotion.

<p align="center"><a href="https://github.com/ajax333221/isepic-chess#book-documentation">« Return</a></p>
