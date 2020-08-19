const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//MoveList (no con fenGet o sera siempre default)
//CurrentMove (no con fenGet o sera siempre default)
//IsRotated (no con fenGet o sera siempre default)
//PromoteTo (no con fenGet o sera siempre default)
//IsHidden (no con fenGet o sera siempre true)
//
//(x) SelectedBos (N/A)(siempre empty_string + solo cambia por ui)
//(x) InDraw = (N/A)(that.IsStalemate || that.IsThreefold || that.IsFiftyMove || that.IsInsufficientMaterial)

describe("Board properties", () => {
	describe("Active, NonActive, HalfMove, FullMove and InitialFullMove", () => {
		var strlist, get_stalemate, get_checkmate, get_checkmate_double_check;
		
		strlist="Active, NonActive, HalfMove, FullMove, InitialFullMove";
		
		get_stalemate=Ic.fenGet("5bnr/4p1pq/4Qpkr/7p/7P/4P3/PPPP1PP1/RNB1KBNR b KQ - 2 10", strlist);
		get_checkmate=Ic.fenGet("rnb1kbnr/pppp1ppp/4p3/8/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3", strlist);
		get_checkmate_double_check=Ic.fenGet("rnbqkbr1/pp1pn1pp/2pN4/5p1Q/4p3/4P3/PPPP1PPP/RNBK1B1R b q - 5 7", strlist);
		
		describe("Active", () => {
			test("b.Active.isBlack", () => {
				expect(get_stalemate.Active.isBlack).toBe(true);
				expect(get_checkmate.Active.isBlack).toBe(false);
				expect(get_checkmate_double_check.Active.isBlack).toBe(true);
			});
			
			test("b.Active.sign", () => {
				expect(get_stalemate.Active.sign).toBe(-1);
				expect(get_checkmate.Active.sign).toBe(1);
				expect(get_checkmate_double_check.Active.sign).toBe(-1);
			});
			
			test("b.Active.kingBos", () => {
				expect(get_stalemate.Active.kingBos).toBe("g6");
				expect(get_checkmate.Active.kingBos).toBe("e1");
				expect(get_checkmate_double_check.Active.kingBos).toBe("e8");
			});
			
			test("b.Active.checks", () => {
				expect(get_stalemate.Active.checks).toBe(0);
				expect(get_checkmate.Active.checks).toBe(1);
				expect(get_checkmate_double_check.Active.checks).toBe(2);
			});
		});
		
		describe("NonActive", () => {
			test("b.NonActive.isBlack", () => {
				expect(get_stalemate.NonActive.isBlack).toBe(false);
				expect(get_checkmate.NonActive.isBlack).toBe(true);
				expect(get_checkmate_double_check.NonActive.isBlack).toBe(false);
			});
			
			test("b.NonActive.sign", () => {
				expect(get_stalemate.NonActive.sign).toBe(1);
				expect(get_checkmate.NonActive.sign).toBe(-1);
				expect(get_checkmate_double_check.NonActive.sign).toBe(1);
			});
			
			test("b.NonActive.kingBos", () => {
				expect(get_stalemate.NonActive.kingBos).toBe("e1");
				expect(get_checkmate.NonActive.kingBos).toBe("e8");
				expect(get_checkmate_double_check.NonActive.kingBos).toBe("d1");
			});
			
			test("b.NonActive.checks", () => {
				expect(get_stalemate.NonActive.checks).toBe(0);
				expect(get_checkmate.NonActive.checks).toBe(0);
				expect(get_checkmate_double_check.NonActive.checks).toBe(0);
			});
		});
		
		test("b.HalfMove", () => {
			expect(get_stalemate.HalfMove).toBe(2);
			expect(get_checkmate.HalfMove).toBe(1);
			expect(get_checkmate_double_check.HalfMove).toBe(5);
		});
		
		test("b.FullMove", () => {
			expect(get_stalemate.FullMove).toBe(10);
			expect(get_checkmate.FullMove).toBe(3);
			expect(get_checkmate_double_check.FullMove).toBe(7);
		});
		
		test("b.InitialFullMove", () => {
			expect(get_stalemate.InitialFullMove).toBe(10);
			expect(get_checkmate.InitialFullMove).toBe(3);
			expect(get_checkmate_double_check.InitialFullMove).toBe(7);
			
			expect(Ic.fenGet("r1bqkb1r/pppppppp/2n2n2/8/8/2N2N2/PPPPPPPP/R1BQKB1R w KQkq -", "InitialFullMove").InitialFullMove).toBe(1);
		});
	});
	
	test("b.fen, b.WCastling and b.BCastling", () => {
		var temp, strlist, current_fen;
		
		strlist="fen, WCastling, BCastling";
		
		current_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		temp=Ic.fenGet(current_fen, strlist);
		expect(temp.fen).toBe(current_fen);
		expect(temp.WCastling).toBe(3);
		expect(temp.BCastling).toBe(3);
		
		current_fen="rnbqkbnr/1ppp1pp1/p3p2p/8/8/P3P2P/1PPP1PPR/RNBQKBN1 b Qkq -";
		temp=Ic.fenGet(current_fen, strlist);
		expect(temp.fen).toBe(current_fen+" 0 1");
		expect(temp.WCastling).toBe(2);
		expect(temp.BCastling).toBe(3);
		
		current_fen="1nbqkbnr/rppp1pp1/p3p2p/8/8/P3P2P/1PPP1PPR/RNBQKBN1 w Qk - 2 5";
		temp=Ic.fenGet(current_fen, strlist);
		expect(temp.fen).toBe(current_fen);
		expect(temp.WCastling).toBe(2);
		expect(temp.BCastling).toBe(1);
		
		current_fen="1nbqkbnr/rppp1pp1/p3p2p/8/8/P3P2P/1PPPKPPR/RNBQ1BN1 b k - 3 5";
		temp=Ic.fenGet(current_fen, strlist);
		expect(temp.fen).toBe(current_fen);
		expect(temp.WCastling).toBe(0);
		expect(temp.BCastling).toBe(1);
		
		current_fen="1nbq1bnr/rpppkpp1/p3p2p/8/8/P3P2P/1PPPKPPR/RNBQ1BN1 w - -";
		temp=Ic.fenGet(current_fen, strlist);
		expect(temp.fen).toBe(current_fen+" 0 1");
		expect(temp.WCastling).toBe(0);
		expect(temp.BCastling).toBe(0);
	});
	
	test("b.Squares", () => {
		var get_custom;
		
		get_custom=Ic.fenGet("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "Squares");
		
		expect(Object.keys(get_custom.Squares).length).toBe(64);
		
		expect(get_custom.Squares["d6"].className).toBe("wk");
		expect(get_custom.Squares["f6"].className).toBe("wr");
		expect(get_custom.Squares["e8"].isKing).toBe(true);
		expect(get_custom.Squares["a1"].val).toBe(0);
		expect(get_custom.Squares["a2"].pos).toEqual([6, 0]);
		expect(get_custom.Squares["a3"].bos).toBe("a3");
		expect(get_custom.Squares["h1"].fileBos).toBe("h");
		expect(get_custom.Squares["h2"].isEmptySquare).toBe(true);
	});
	
	test("b.EnPassantBos", () => {
		expect(Ic.fenGet("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "EnPassantBos").EnPassantBos).toBe("");
		expect(Ic.fenGet("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", "EnPassantBos").EnPassantBos).toBe("e3");
		expect(Ic.fenGet("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6", "EnPassantBos").EnPassantBos).toBe("e6");
		expect(Ic.fenGet("rnbqkbnr/pppp1ppp/8/4p3/4P2P/8/PPPP1PP1/RNBQKBNR b KQkq h3 0 2", "EnPassantBos").EnPassantBos).toBe("h3");
		expect(Ic.fenGet("rnbqkbnr/pppp1pp1/8/4p2p/4P2P/8/PPPP1PP1/RNBQKBNR w KQkq h6 0 3", "EnPassantBos").EnPassantBos).toBe("h6");
		expect(Ic.fenGet("rnbqkbnr/pppp1pp1/8/4p2p/P3P2P/8/1PPP1PP1/RNBQKBNR b KQkq a3", "EnPassantBos").EnPassantBos).toBe("a3");
		expect(Ic.fenGet("rnbqkbnr/1ppp1pp1/8/p3p2p/P3P2P/8/1PPP1PP1/RNBQKBNR w KQkq a6 0 4", "EnPassantBos").EnPassantBos).toBe("a6");
		expect(Ic.fenGet("rnbqkbnr/1ppp1pp1/8/p3p2p/P1B1P2P/8/1PPP1PP1/RNBQK1NR b KQkq - 1 4", "EnPassantBos").EnPassantBos).toBe("");
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
