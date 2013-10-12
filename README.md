Isepic Chess
================

This is a chess project written in JavaScript with some of the basic features you would expect to see like highlight legal moves, FEN validation, etc (see [Features](https://github.com/ajax333221/Isepic-Chess#features)). It uses jQuery for DOM manipulation and effects.

**Status:** the project is ongoing (see [To Do list](https://github.com/ajax333221/Isepic-Chess#to-do)).

I am trying to make the code as optimized as possible, I have spent hundreds hours on the structure and fully reviewed the code multiple times, I think my **'testCollision()'** function is a masterpiece on its own, this function serves 3 different purposes and is where the _all_ the magic happens. The function is a bit hard to understand, but once you know exactly what is it doing, you will realize its awesomeness. If I were to explain more or less what it does, it would be something along the lines:

> "it starts in a given square, then starts moving in one of the 8 possible directions until A) it advances the given number of steps B) it collides with a piece, or C) gets outside the board. Then returns an array with the gathered information. It also gives the option to ignore the things you don't want so it doesn't look for them. There are 3 functions that simplifies calling it 'testCandidateMoves()', 'testIsAttacked()' and 'testDisambiguationPos()'".

A simple example of the powerfulness of this function will be to call it 16 times (8 as knight) in all 8 directions to see if our king is in check:

	function countChecks(early_break, obj){
		var i, j, king_pos, as_knight, rtn_num_checks;
		
		rtn_num_checks = 0;
		king_pos = obj.ActiveColor ? obj.BKingPos : obj.WKingPos;
		
		outer:
		for(i = 2; i--; ){ //1...0
			as_knight = !i;
			
			for(j = 9; --j; ){ //8...1
				if(testIsAttacked(king_pos, j, null, as_knight, obj)){
					rtn_num_checks++;
					
					if(early_break){
						break outer;
					}
				}
			}
		}
		
		return rtn_num_checks;
	}

Features
-------------

- advanced FEN validation
- highlight of legal moves
- rotate board
- PGN move list
- ~~drag-and-drop pieces~~ (currently disabled)
- ~~underpromote pawns (e.g knight, bishop, etc)~~ (currently defaults to queen)

**Note (Jun 2013):** some features are temporally disabled as the project is getting a major rewrite to be more object oriented.

To Do
-------------

- show captured pieces
- read custom PGN
- one-click jump to position from the PGN move list
- support move variations
- manually set up positions

Copyright and License
-------------

Copyright © 2012 Ajax Isepic (ajax333221)

Licensed under MIT License: http://opensource.org/licenses/mit-license.php
