const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//Active.isBlack
//Active.sign
//Active.kingBos
//NonActive.isBlack
//NonActive.sign
//NonActive.kingBos
//NonActive.checks (que sea 0)
//Fen
//WCastling
//BCastling
//EnPassantBos
//HalfMove
//FullMove
//InitialFullMove (siempre igual que full move)
//MoveList (va ser default)
//CurrentMove (va ser default)
//IsRotated (va ser default)
//InDraw
//PromoteTo (va ser default)
//SelectedBos (va ser default)
//IsHidden (va ser default)
//Squares

describe("Board properties", () => {
	describe("Active and NonActive", () => {
		describe("Active", () => {
			test("b.Active.checks", () => {
				expect(Ic.fenGet("8/k7/r7/8/8/2b5/8/K7 w - - 0 1", "Active").Active.checks).toBe(2);
				expect(Ic.fenGet("8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1", "Active").Active.checks).toBe(0);
			});
		});
		
		/*describe("NonActive", () => {
			//...
		});*/
	});
	
	test("b.MaterialDiff", () => {
		expect(Ic.fenGet("k7/1r6/8/p6R/Pp6/8/1RR5/K7 b - - 0 1", "MaterialDiff").MaterialDiff).toEqual({w:[4, 4], b:[-1]});
		
		expect(Ic.fenGet("8/1rr5/nn4k1/2p1P3/2PP4/B5K1/Q1R5/8 w - - 0 1", "MaterialDiff").MaterialDiff).toEqual({w:[1, 1, 3, 5], b:[-2, -2, -4]});
		
		expect(Ic.fenGet("8/kr3pn1/qp4p1/p4b1p/P4B1P/QP4P1/KR3PN1/8 w - - 0 1", "MaterialDiff").MaterialDiff).toEqual({w:[], b:[]});
	});
	
	test("b.IsCheck", () => {
		expect(Ic.fenGet("8/k7/r7/8/8/2b5/8/K7 w - - 0 1", "IsCheck").IsCheck).toBe(true);
		expect(Ic.fenGet("8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1", "IsCheck").IsCheck).toBe(false);
	});
	
	test("b.IsCheckmate", () => {
		expect(Ic.fenGet("8/8/8/4b3/8/1k6/1B6/K1r5 w - - 0 1", "IsCheckmate").IsCheckmate).toBe(true);
		expect(Ic.fenGet("8/8/8/8/8/1k6/1B6/K1r5 w - - 0 1", "IsCheckmate").IsCheckmate).toBe(false);
	});
	
	test("b.IsStalemate", () => {
		expect(Ic.fenGet("8/8/8/8/8/1k6/1r6/K7 w - - 0 1", "IsStalemate").IsStalemate).toBe(true);
		expect(Ic.fenGet("8/8/8/4B3/8/1k6/1r6/K7 w - - 0 1", "IsStalemate").IsStalemate).toBe(false);
	});
	
	test("b.IsThreefold and b.IsFiftyMove", () => {
		var i, len, arr, threefold_all, fifty_all, board_name, board_obj;
		
		board_name="board_is_threefold_is_fifty_move";
		
		board_obj=Ic.initBoard({
			boardName : board_name,
			fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		arr=[["b1", "c3"], ["b8", "c6"], ["c3", "b1"], ["c6", "b8"], ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"], ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"], ["b1", "c3"], ["b8", "a6"], ["c3", "d5"], ["a6", "b8"], ["d5", "c3"], ["g8", "f6"], ["c3", "b1"], ["h8", "g8"], ["g1", "f3"], ["g8", "h8"], ["f3", "g1"], ["f6", "g8"], ["g1", "f3"], ["g8", "f6"], ["f3", "d4"], ["f6", "d5"], ["d4", "b5"], ["d5", "b4"], ["b5", "a3"], ["b4", "a6"], ["b1", "c3"], ["b8", "c6"], ["a3", "b1"], ["a6", "b8"], ["c3", "e4"], ["c6", "e5"], ["e4", "g5"], ["e5", "g4"], ["g5", "f3"], ["g4", "f6"]];
		
		threefold_all="";
		fifty_all="";
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			board_obj.moveCaller(arr[i][0], arr[i][1]);
			threefold_all+=(board_obj.IsThreefold*1);
			fifty_all+=(board_obj.IsFiftyMove*1);
		}
		
		for(i=0; i<15; i++){//0...14
			board_obj.moveCaller("h1", "g1");
			threefold_all+=(board_obj.IsThreefold*1);
			fifty_all+=(board_obj.IsFiftyMove*1);
			
			board_obj.moveCaller("h8", "g8");
			threefold_all+=(board_obj.IsThreefold*1);
			fifty_all+=(board_obj.IsFiftyMove*1);
			
			board_obj.moveCaller("g1", "h1");
			threefold_all+=(board_obj.IsThreefold*1);
			fifty_all+=(board_obj.IsFiftyMove*1);
			
			board_obj.moveCaller("g8", "h8");
			threefold_all+=(board_obj.IsThreefold*1);
			fifty_all+=(board_obj.IsFiftyMove*1);
		}
		
		expect(threefold_all).toBe("000000010001000010100000000000000000000001000000001111111111111111111111111111111111111111111111111111");
		
		expect(fifty_all).toBe("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111");
	});
	
	describe("b.IsInsufficientMaterial", () => {
		test("cases returning false", () => {
			var i, len, arr;
			
			arr=["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "K6k/8/8/8/8/8/8/3BB3 w - - 0 1", "K6k/8/8/8/8/8/8/3BB3 b - - 0 1", "K6k/8/8/8/8/8/8/3bb3 w - - 0 1", "K6k/8/8/8/8/8/8/3bb3 b - - 0 1", "K6k/8/8/8/8/8/2bBb3/8 w - - 0 1", "K6k/8/8/8/8/8/2bBb3/8 b - - 0 1", "K6k/8/8/8/8/8/2BbB3/8 w - - 0 1", "K6k/8/8/8/8/8/2BbB3/8 b - - 0 1", "K6k/8/8/8/8/3Nb3/8/8 w - - 0 1", "K6k/8/8/8/8/3Nn3/8/8 w - - 0 1", "K6k/8/8/8/8/3NB3/8/8 w - - 0 1", "K6k/8/8/8/8/3NN3/8/8 w - - 0 1", "K6k/8/8/8/4P3/8/8/8 w - - 0 1", "K6k/8/8/8/4p3/8/8/8 w - - 0 1", "K6k/8/8/8/4R3/8/8/8 w - - 0 1", "K6k/8/8/8/4r3/8/8/8 w - - 0 1", "K6k/8/8/8/8/8/8/4Q3 w - - 0 1", "K6k/8/8/8/8/8/8/4q3 w - - 0 1"];
			
			for(i=0, len=arr.length; i<len; i++){//0<len
				expect(Ic.fenGet(arr[i], "IsInsufficientMaterial").IsInsufficientMaterial).toBe(false);
			}
		});
		
		test("cases returning true", () => {
			var i, len, arr;
			
			arr=["K6k/8/8/8/8/8/8/8 w - - 0 1", "K6k/8/8/8/8/3N4/8/8 w - - 0 1", "K6k/8/8/8/8/3N4/8/8 b - - 0 1", "K6k/8/8/8/8/3n4/8/8 w - - 0 1", "K6k/8/8/8/8/3n4/8/8 b - - 0 1", "K6k/8/8/8/8/3B4/8/8 w - - 0 1", "K6k/8/8/8/8/3B4/8/8 b - - 0 1", "K6k/8/8/8/8/3b4/8/8 w - - 0 1", "K6k/8/8/8/8/3b4/8/8 b - - 0 1", "K6k/8/8/8/8/3B4/2B5/1B6 w - - 0 1", "K6k/8/8/8/8/3B4/2B5/1B6 b - - 0 1", "K6k/8/8/8/8/3b4/2b5/1b6 w - - 0 1", "K6k/8/8/8/8/3b4/2b5/1b6 b - - 0 1", "K6k/8/8/8/8/3b4/2b1B3/1b1B4 w - - 0 1", "K6k/8/8/8/8/3b4/2b1B3/1b1B4 b - - 0 1", "K6k/8/8/8/8/4B3/3B4/2B5 w - - 0 1", "K6k/8/8/8/8/4B3/3B4/2B5 b - - 0 1", "K6k/8/8/8/8/4b3/3b4/2b5 w - - 0 1", "K6k/8/8/8/8/4b3/3b4/2b5 b - - 0 1", "K6k/8/8/8/8/4b3/3b1B2/2b1B3 w - - 0 1", "K6k/8/8/8/8/4b3/3b1B2/2b1B3 b - - 0 1"];
			
			for(i=0, len=arr.length; i<len; i++){//0<len
				expect(Ic.fenGet(arr[i], "IsInsufficientMaterial").IsInsufficientMaterial).toBe(true);
			}
		});
	});
});
