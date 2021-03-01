const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//manualResult (no con fenGet)
//promoteTo (no con fenGet) poner muchos advanced pawns y promoverlos todos (solo checkar el Fen final)
//moveList (no con fenGet) en misc hay san y moveResult, buscar un ejemplo completo (e.g. promotion)
//currentMove (no con fenGet) test de movelist split cuando currentMove no esta al final
//
//(mm) isHidden (N/A)(en ic solo afecta el board hash + solo cambia por ui)
//(mm) isUnlabeled (N/A)(solo cambia por ui) edit: ya no afecta board hash
//
//(x) isRotated (completado)(b.ascii() en board-methods.test.js + hasta se le hizo test por board hash)
//(x) inDraw = (N/A)(solo un caso edge de checkmate + 50move rule, pero ya en regression test)

describe("Board properties", () => {
	describe("w, b, activeColor, nonActiveColor, halfMove and fullMove", () => {
		var str_list, get_stalemate, get_checkmate, get_checkmate_double_check;
		
		str_list="w b activeColor nonActiveColor halfMove fullMove";
		
		get_stalemate=Ic.fenGet("5bnr/4p1pq/4Qpkr/7p/7P/4P3/PPPP1PP1/RNB1KBNR b KQ - 2 10", str_list);
		get_checkmate=Ic.fenGet("rnb1kbnr/pppp1ppp/4p3/8/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3", str_list);
		get_checkmate_double_check=Ic.fenGet("rnbqkbr1/pp1pn1pp/2pN4/5p1Q/4p3/4P3/PPPP1PPP/RNBK1B1R b q - 5 7", str_list);
		
		describe("b[b.activeColor]", () => {
			describe("static", () => {
				test("isBlack", () => {
					expect(get_stalemate[get_stalemate.activeColor].isBlack).toBe(true);
					expect(get_checkmate[get_checkmate.activeColor].isBlack).toBe(false);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].isBlack).toBe(true);
				});
				
				test("sign", () => {
					expect(get_stalemate[get_stalemate.activeColor].sign).toBe(-1);
					expect(get_checkmate[get_checkmate.activeColor].sign).toBe(1);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].sign).toBe(-1);
				});
				
				test("firstRankPos", () => {
					expect(get_stalemate[get_stalemate.activeColor].firstRankPos).toBe(0);
					expect(get_checkmate[get_checkmate.activeColor].firstRankPos).toBe(7);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].firstRankPos).toBe(0);
				});
				
				test("lastRankPos", () => {
					expect(get_stalemate[get_stalemate.activeColor].lastRankPos).toBe(7);
					expect(get_checkmate[get_checkmate.activeColor].lastRankPos).toBe(0);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].lastRankPos).toBe(7);
				});
				
				test("pawn, knight, bishop, rook, queen, king", () => {
					expect(get_stalemate[get_stalemate.activeColor].pawn).toBe(-1);
					expect(get_checkmate[get_checkmate.activeColor].pawn).toBe(1);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].pawn).toBe(-1);
					
					expect(get_stalemate[get_stalemate.activeColor].knight).toBe(-2);
					expect(get_checkmate[get_checkmate.activeColor].knight).toBe(2);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].knight).toBe(-2);
					
					expect(get_stalemate[get_stalemate.activeColor].bishop).toBe(-3);
					expect(get_checkmate[get_checkmate.activeColor].bishop).toBe(3);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].bishop).toBe(-3);
					
					expect(get_stalemate[get_stalemate.activeColor].rook).toBe(-4);
					expect(get_checkmate[get_checkmate.activeColor].rook).toBe(4);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].rook).toBe(-4);
					
					expect(get_stalemate[get_stalemate.activeColor].queen).toBe(-5);
					expect(get_checkmate[get_checkmate.activeColor].queen).toBe(5);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].queen).toBe(-5);
					
					expect(get_stalemate[get_stalemate.activeColor].king).toBe(-6);
					expect(get_checkmate[get_checkmate.activeColor].king).toBe(6);
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].king).toBe(-6);
				});
			});
			
			describe("mutable", () => {
				test("kingBos", () => {
					expect(get_stalemate[get_stalemate.activeColor].kingBos).toBe("g6");
					expect(get_checkmate[get_checkmate.activeColor].kingBos).toBe("e1");
					expect(get_checkmate_double_check[get_checkmate_double_check.activeColor].kingBos).toBe("e8");
				});
				
				//b.x.castling in "b.fen, b.w.castling and b.b.castling"
				
				//b.x.materialDiff in "b.w.materialDiff and b.b.materialDiff"
			});
		});
		
		describe("b[b.nonActiveColor]", () => {
			describe("static", () => {
				test("isBlack", () => {
					expect(get_stalemate[get_stalemate.nonActiveColor].isBlack).toBe(false);
					expect(get_checkmate[get_checkmate.nonActiveColor].isBlack).toBe(true);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].isBlack).toBe(false);
				});
				
				test("sign", () => {
					expect(get_stalemate[get_stalemate.nonActiveColor].sign).toBe(1);
					expect(get_checkmate[get_checkmate.nonActiveColor].sign).toBe(-1);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].sign).toBe(1);
				});
				
				test("firstRankPos", () => {
					expect(get_stalemate[get_stalemate.nonActiveColor].firstRankPos).toBe(7);
					expect(get_checkmate[get_checkmate.nonActiveColor].firstRankPos).toBe(0);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].firstRankPos).toBe(7);
				});
				
				test("lastRankPos", () => {
					expect(get_stalemate[get_stalemate.nonActiveColor].lastRankPos).toBe(0);
					expect(get_checkmate[get_checkmate.nonActiveColor].lastRankPos).toBe(7);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].lastRankPos).toBe(0);
				});
				
				test("pawn, knight, bishop, rook, queen, king", () => {
					expect(get_stalemate[get_stalemate.nonActiveColor].pawn).toBe(1);
					expect(get_checkmate[get_checkmate.nonActiveColor].pawn).toBe(-1);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].pawn).toBe(1);
					
					expect(get_stalemate[get_stalemate.nonActiveColor].knight).toBe(2);
					expect(get_checkmate[get_checkmate.nonActiveColor].knight).toBe(-2);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].knight).toBe(2);
					
					expect(get_stalemate[get_stalemate.nonActiveColor].bishop).toBe(3);
					expect(get_checkmate[get_checkmate.nonActiveColor].bishop).toBe(-3);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].bishop).toBe(3);
					
					expect(get_stalemate[get_stalemate.nonActiveColor].rook).toBe(4);
					expect(get_checkmate[get_checkmate.nonActiveColor].rook).toBe(-4);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].rook).toBe(4);
					
					expect(get_stalemate[get_stalemate.nonActiveColor].queen).toBe(5);
					expect(get_checkmate[get_checkmate.nonActiveColor].queen).toBe(-5);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].queen).toBe(5);
					
					expect(get_stalemate[get_stalemate.nonActiveColor].king).toBe(6);
					expect(get_checkmate[get_checkmate.nonActiveColor].king).toBe(-6);
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].king).toBe(6);
				});
			});
			
			describe("mutable", () => {
				test("kingBos", () => {
					expect(get_stalemate[get_stalemate.nonActiveColor].kingBos).toBe("e1");
					expect(get_checkmate[get_checkmate.nonActiveColor].kingBos).toBe("e8");
					expect(get_checkmate_double_check[get_checkmate_double_check.nonActiveColor].kingBos).toBe("d1");
				});
				
				//b.x.castling in "b.fen, b.w.castling and b.b.castling"
				
				//b.x.materialDiff in "b.w.materialDiff and b.b.materialDiff"
			});
		});
		
		test("b.activeColor", () => {
			expect(get_stalemate.activeColor).toBe("b");
			expect(get_checkmate.activeColor).toBe("w");
			expect(get_checkmate_double_check.activeColor).toBe("b");
		});
		
		test("b.nonActiveColor", () => {
			expect(get_stalemate.nonActiveColor).toBe("w");
			expect(get_checkmate.nonActiveColor).toBe("b");
			expect(get_checkmate_double_check.nonActiveColor).toBe("w");
		});
		
		test("b.halfMove", () => {
			expect(get_stalemate.halfMove).toBe(2);
			expect(get_checkmate.halfMove).toBe(1);
			expect(get_checkmate_double_check.halfMove).toBe(5);
		});
		
		test("b.fullMove", () => {
			expect(get_stalemate.fullMove).toBe(10);
			expect(get_checkmate.fullMove).toBe(3);
			expect(get_checkmate_double_check.fullMove).toBe(7);
		});
	});
	
	test("b.fen, b.w.castling and b.b.castling", () => {
		var temp, arr_list, current_fen;
		
		arr_list=["fen", "w", "b"];
		
		current_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		temp=Ic.fenGet(current_fen, arr_list);
		expect(temp.fen).toBe(current_fen);
		expect(temp.w.castling).toBe(3);
		expect(temp.b.castling).toBe(3);
		
		current_fen="rnbqkbnr/1ppp1pp1/p3p2p/8/8/P3P2P/1PPP1PPR/RNBQKBN1 b Qkq -";
		temp=Ic.fenGet(current_fen, arr_list);
		expect(temp.fen).toBe(current_fen+" 0 1");
		expect(temp.w.castling).toBe(2);
		expect(temp.b.castling).toBe(3);
		
		current_fen="1nbqkbnr/rppp1pp1/p3p2p/8/8/P3P2P/1PPP1PPR/RNBQKBN1 w Qk - 2 5";
		temp=Ic.fenGet(current_fen, arr_list);
		expect(temp.fen).toBe(current_fen);
		expect(temp.w.castling).toBe(2);
		expect(temp.b.castling).toBe(1);
		
		current_fen="1nbqkbnr/rppp1pp1/p3p2p/8/8/P3P2P/1PPPKPPR/RNBQ1BN1 b k - 3 5";
		temp=Ic.fenGet(current_fen, arr_list);
		expect(temp.fen).toBe(current_fen);
		expect(temp.w.castling).toBe(0);
		expect(temp.b.castling).toBe(1);
		
		current_fen="1nbq1bnr/rpppkpp1/p3p2p/8/8/P3P2P/1PPPKPPR/RNBQ1BN1 w - -";
		temp=Ic.fenGet(current_fen, arr_list);
		expect(temp.fen).toBe(current_fen+" 0 1");
		expect(temp.w.castling).toBe(0);
		expect(temp.b.castling).toBe(0);
	});
	
	test("b.w.materialDiff and b.b.materialDiff", () => {
		var temp, arr_list, current_fen;
		
		arr_list=["w", "b"];
		
		current_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		temp=Ic.fenGet(current_fen, arr_list);
		expect(temp.w.materialDiff).toEqual([]);
		expect(temp.b.materialDiff).toEqual([]);
		
		current_fen="k7/1r6/8/p6R/Pp6/8/1RR5/K7 b - -";
		temp=Ic.fenGet(current_fen, arr_list);
		expect(temp.w.materialDiff).toEqual([4, 4]);
		expect(temp.b.materialDiff).toEqual([-1]);
		
		current_fen="8/1rr5/nn4k1/2p1P3/2PP4/B5K1/Q1R5/8 w - -";
		temp=Ic.fenGet(current_fen, arr_list);
		expect(temp.w.materialDiff).toEqual([1, 1, 3, 5]);
		expect(temp.b.materialDiff).toEqual([-2, -2, -4]);
		
		current_fen="8/kr3pn1/qp4p1/p4b1p/P4B1P/QP4P1/KR3PN1/8 w - - 0 1";
		temp=Ic.fenGet(current_fen, arr_list);
		expect(temp.w.materialDiff).toEqual([]);
		expect(temp.b.materialDiff).toEqual([]);
	});
	
	test("b.squares", () => {
		var get_custom;
		
		get_custom=Ic.fenGet("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "squares");
		
		expect(Object.keys(get_custom.squares).length).toBe(64);
		
		expect(get_custom.squares["d6"].className).toBe("wk");
		expect(get_custom.squares["f6"].className).toBe("wr");
		expect(get_custom.squares["e8"].isKing).toBe(true);
		expect(get_custom.squares["a1"].val).toBe(0);
		expect(get_custom.squares["a2"].pos).toEqual([6, 0]);
		expect(get_custom.squares["a3"].bos).toBe("a3");
		expect(get_custom.squares["h1"].fileBos).toBe("h");
		expect(get_custom.squares["h2"].isEmptySquare).toBe(true);
	});
	
	test("b.enPassantBos", () => {
		expect(Ic.fenGet("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "enPassantBos").enPassantBos).toBe("");
		expect(Ic.fenGet("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", "enPassantBos").enPassantBos).toBe("e3");
		expect(Ic.fenGet("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6", "enPassantBos").enPassantBos).toBe("e6");
		expect(Ic.fenGet("rnbqkbnr/pppp1ppp/8/4p3/4P2P/8/PPPP1PP1/RNBQKBNR b KQkq h3 0 2", "enPassantBos").enPassantBos).toBe("h3");
		expect(Ic.fenGet("rnbqkbnr/pppp1pp1/8/4p2p/4P2P/8/PPPP1PP1/RNBQKBNR w KQkq h6 0 3", "enPassantBos").enPassantBos).toBe("h6");
		expect(Ic.fenGet("rnbqkbnr/pppp1pp1/8/4p2p/P3P2P/8/1PPP1PP1/RNBQKBNR b KQkq a3", "enPassantBos").enPassantBos).toBe("a3");
		expect(Ic.fenGet("rnbqkbnr/1ppp1pp1/8/p3p2p/P3P2P/8/1PPP1PP1/RNBQKBNR w KQkq a6 0 4", "enPassantBos").enPassantBos).toBe("a6");
		expect(Ic.fenGet("rnbqkbnr/1ppp1pp1/8/p3p2p/P1B1P2P/8/1PPP1PP1/RNBQK1NR b KQkq - 1 4", "enPassantBos").enPassantBos).toBe("");
	});
	
	test("b.checks", () => {
		expect(Ic.fenGet("5bnr/4p1pq/4Qpkr/7p/7P/4P3/PPPP1PP1/RNB1KBNR b KQ - 2 10", "checks").checks).toBe(0);
		expect(Ic.fenGet("rnb1kbnr/pppp1ppp/4p3/8/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3", "checks").checks).toBe(1);
		expect(Ic.fenGet("rnbqkbr1/pp1pn1pp/2pN4/5p1Q/4p3/4P3/PPPP1PPP/RNBK1B1R b q - 5 7", "checks").checks).toBe(2);
		
		expect(Ic.fenGet("8/k7/r7/8/8/2b5/8/K7 w - - 0 1", "checks").checks).toBe(2);
		expect(Ic.fenGet("8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1", "checks").checks).toBe(0);
		
		expect(Ic.fenGet("8/8/8/4b3/8/1k6/1B6/K1r5 w - - 0 1", "checks").checks).toBe(1);
		expect(Ic.fenGet("8/8/8/8/8/1k6/1B6/K1r5 w - - 0 1", "checks").checks).toBe(1);
		
		expect(Ic.fenGet("8/8/8/8/8/1k6/1r6/K7 w - - 0 1", "checks").checks).toBe(0);
		expect(Ic.fenGet("8/8/8/4B3/8/1k6/1r6/K7 w - - 0 1", "checks").checks).toBe(0);
	});
	
	test("b.isCheck", () => {
		expect(Ic.fenGet("8/k7/r7/8/8/2b5/8/K7 w - - 0 1", "isCheck").isCheck).toBe(true);
		expect(Ic.fenGet("8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1", "isCheck").isCheck).toBe(false);
	});
	
	test("b.isCheckmate", () => {
		expect(Ic.fenGet("8/8/8/4b3/8/1k6/1B6/K1r5 w - - 0 1", "isCheckmate").isCheckmate).toBe(true);
		expect(Ic.fenGet("8/8/8/8/8/1k6/1B6/K1r5 w - - 0 1", "isCheckmate").isCheckmate).toBe(false);
	});
	
	test("b.isStalemate", () => {
		expect(Ic.fenGet("8/8/8/8/8/1k6/1r6/K7 w - - 0 1", "isStalemate").isStalemate).toBe(true);
		expect(Ic.fenGet("8/8/8/4B3/8/1k6/1r6/K7 w - - 0 1", "isStalemate").isStalemate).toBe(false);
	});
	
	test("b.isThreefold and b.isFiftyMove", () => {
		var i, len, arr, threefold_all, fifty_all, board_name, board_obj;
		
		board_name="board_is_threefold_is_fifty_move";
		
		board_obj=Ic.initBoard({
			boardName : board_name,
			fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			validOrBreak : true
		});
		
		arr=["b1-c3", "b8-c6", "c3-b1", "c6-b8", "g1-f3", "g8-f6", "f3-g1", "f6-g8", "g1-f3", "g8-f6", "f3-g1", "f6-g8", "b1-c3", "b8-a6", "c3-d5", "a6-b8", "d5-c3", "g8-f6", "c3-b1", "h8-g8", "g1-f3", "g8-h8", "f3-g1", "f6-g8", "g1-f3", "g8-f6", "f3-d4", "f6-d5", "d4-b5", "d5-b4", "b5-a3", "b4-a6", "b1-c3", "b8-c6", "a3-b1", "a6-b8", "c3-e4", "c6-e5", "e4-g5", "e5-g4", "g5-f3", "g4-f6"];
		
		threefold_all="";
		fifty_all="";
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			board_obj.playMove(arr[i]);
			threefold_all+=(board_obj.isThreefold*1);
			fifty_all+=(board_obj.isFiftyMove*1);
		}
		
		for(i=0; i<15; i++){//0...14
			board_obj.playMove("h1-g1");
			threefold_all+=(board_obj.isThreefold*1);
			fifty_all+=(board_obj.isFiftyMove*1);
			
			board_obj.playMove("h8-g8");
			threefold_all+=(board_obj.isThreefold*1);
			fifty_all+=(board_obj.isFiftyMove*1);
			
			board_obj.playMove("g1-h1");
			threefold_all+=(board_obj.isThreefold*1);
			fifty_all+=(board_obj.isFiftyMove*1);
			
			board_obj.playMove("g8-h8");
			threefold_all+=(board_obj.isThreefold*1);
			fifty_all+=(board_obj.isFiftyMove*1);
		}
		
		expect(threefold_all).toBe("000000010001000010100000000000000000000001000000001111111111111111111111111111111111111111111111111111");
		
		expect(fifty_all).toBe("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111");
	});
	
	describe("b.isInsufficientMaterial", () => {
		test("cases returning false", () => {
			var i, len, arr;
			
			arr=["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "K6k/8/8/8/8/8/8/3BB3 w - - 0 1", "K6k/8/8/8/8/8/8/3BB3 b - - 0 1", "K6k/8/8/8/8/8/8/3bb3 w - - 0 1", "K6k/8/8/8/8/8/8/3bb3 b - - 0 1", "K6k/8/8/8/8/8/2bBb3/8 w - - 0 1", "K6k/8/8/8/8/8/2bBb3/8 b - - 0 1", "K6k/8/8/8/8/8/2BbB3/8 w - - 0 1", "K6k/8/8/8/8/8/2BbB3/8 b - - 0 1", "K6k/8/8/8/8/3Nb3/8/8 w - - 0 1", "K6k/8/8/8/8/3Nn3/8/8 w - - 0 1", "K6k/8/8/8/8/3NB3/8/8 w - - 0 1", "K6k/8/8/8/8/3NN3/8/8 w - - 0 1", "K6k/8/8/8/4P3/8/8/8 w - - 0 1", "K6k/8/8/8/4p3/8/8/8 w - - 0 1", "K6k/8/8/8/4R3/8/8/8 w - - 0 1", "K6k/8/8/8/4r3/8/8/8 w - - 0 1", "K6k/8/8/8/8/8/8/4Q3 w - - 0 1", "K6k/8/8/8/8/8/8/4q3 w - - 0 1"];
			
			for(i=0, len=arr.length; i<len; i++){//0<len
				expect(Ic.fenGet(arr[i], "isInsufficientMaterial").isInsufficientMaterial).toBe(false);
			}
		});
		
		test("cases returning true", () => {
			var i, len, arr;
			
			arr=["K6k/8/8/8/8/8/8/8 w - - 0 1", "K6k/8/8/8/8/3N4/8/8 w - - 0 1", "K6k/8/8/8/8/3N4/8/8 b - - 0 1", "K6k/8/8/8/8/3n4/8/8 w - - 0 1", "K6k/8/8/8/8/3n4/8/8 b - - 0 1", "K6k/8/8/8/8/3B4/8/8 w - - 0 1", "K6k/8/8/8/8/3B4/8/8 b - - 0 1", "K6k/8/8/8/8/3b4/8/8 w - - 0 1", "K6k/8/8/8/8/3b4/8/8 b - - 0 1", "K6k/8/8/8/8/3B4/2B5/1B6 w - - 0 1", "K6k/8/8/8/8/3B4/2B5/1B6 b - - 0 1", "K6k/8/8/8/8/3b4/2b5/1b6 w - - 0 1", "K6k/8/8/8/8/3b4/2b5/1b6 b - - 0 1", "K6k/8/8/8/8/3b4/2b1B3/1b1B4 w - - 0 1", "K6k/8/8/8/8/3b4/2b1B3/1b1B4 b - - 0 1", "K6k/8/8/8/8/4B3/3B4/2B5 w - - 0 1", "K6k/8/8/8/8/4B3/3B4/2B5 b - - 0 1", "K6k/8/8/8/8/4b3/3b4/2b5 w - - 0 1", "K6k/8/8/8/8/4b3/3b4/2b5 b - - 0 1", "K6k/8/8/8/8/4b3/3b1B2/2b1B3 w - - 0 1", "K6k/8/8/8/8/4b3/3b1B2/2b1B3 b - - 0 1"];
			
			for(i=0, len=arr.length; i<len; i++){//0<len
				expect(Ic.fenGet(arr[i], "isInsufficientMaterial").isInsufficientMaterial).toBe(true);
			}
		});
	});
});
