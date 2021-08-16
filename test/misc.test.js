const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

describe("Misc.", () => {
	describe("Regression tests", () => {
		var board_name, other_board_name;
		
		board_name="board_regression_tests";
		other_board_name="board_regression_tests_other";
		
		describe("Disambiguation related", () => {
			test("pinned pieces are ignored as candidates", () => {
				expect(Ic.fenApply("rnb1kbnr/pp1p2pp/2p2p2/q3p3/4PN2/2NP4/PPP2PPP/R1BQKB1R w KQkq - 0 6", "playMove", ["f4-e2"], {skipFenValidation : true}).san).toBe("Ne2");
			});
		});
		
		describe("isLegalMove related", () => {
			test("move search matching to-from in from-to-from-to...", () => {
				expect(Ic.fenApply("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "isLegalMove", ["f6-f3"], {skipFenValidation : true})).toBe(false);
			});
		});
		
		describe("Promotion related", () => {
			var shared_fen;
			
			shared_fen="rn1qkbnr/1P1ppppp/2p5/8/8/8/1PPPPPPP/RNBQKBNR w KQkq - 0 5";
			
			test("K should change to Q", () => {
				expect(Ic.fenApply(shared_fen, "playMove", ["b7-a8", {promoteTo : "K"}], {skipFenValidation : true}).san).toBe("bxa8=Q");
			});
			
			test("P should change to N", () => {
				expect(Ic.fenApply(shared_fen, "playMove", ["b7-a8", {promoteTo : "P"}], {skipFenValidation : true}).san).toBe("bxa8=N");
			});
			
			test("valid promoteTo option should overwrite SAN", () => {
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=R", {promoteTo : "N"}], {skipFenValidation : true}).san).toBe("bxa8=N");
			});
			
			test("valid promoteTo option should overwrite UCI", () => {
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8r", {promoteTo : "N"}], {skipFenValidation : true}).san).toBe("bxa8=N");
			});
			
			test("invalid promoteTo option should NOT overwrite SAN", () => {
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=R", {promoteTo : "W"}], {skipFenValidation : true}).san).toBe("bxa8=R");
			});
			
			test("invalid promoteTo option should NOT overwrite UCI", () => {
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8r", {promoteTo : "W"}], {skipFenValidation : true}).san).toBe("bxa8=R");
			});
			
			test("unconventional SAN promotion", () => {
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=q"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=6"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=5"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=r"], {skipFenValidation : true}).san).toBe("bxa8=R");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=4"], {skipFenValidation : true}).san).toBe("bxa8=R");
				
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=n"], {skipFenValidation : true}).san).toBe("bxa8=N");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=2"], {skipFenValidation : true}).san).toBe("bxa8=N");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=1"], {skipFenValidation : true}).san).toBe("bxa8=N");
				
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8="], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8= "], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=0"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=_"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=X"], {skipFenValidation : true}).san).toBe("bxa8=Q");
			});
			
			test("unconventional UCI promotion", () => {
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8q"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a86"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a85"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8r"], {skipFenValidation : true}).san).toBe("bxa8=R");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a84"], {skipFenValidation : true}).san).toBe("bxa8=R");
				
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8n"], {skipFenValidation : true}).san).toBe("bxa8=N");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a82"], {skipFenValidation : true}).san).toBe("bxa8=N");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a81"], {skipFenValidation : true}).san).toBe("bxa8=N");
				
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8 "], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a80"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8_"], {skipFenValidation : true}).san).toBe("bxa8=Q");
				expect(Ic.fenApply(shared_fen, "playMove", ["b7a8X"], {skipFenValidation : true}).san).toBe("bxa8=Q");
			});
			
			test("valid SAN should overwrite board promoteTo", () => {
				var board_obj;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : shared_fen,
					promoteTo : "R",
					skipFenValidation : true
				});
				
				expect(board_obj.playMove("bxa8=B").san).toBe("bxa8=B");
			});
			
			test("valid UCI should overwrite board promoteTo", () => {
				var board_obj;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : shared_fen,
					promoteTo : "R",
					skipFenValidation : true
				});
				
				expect(board_obj.playMove("b7a8b").san).toBe("bxa8=B");
			});
			
			test("invalid SAN should NOT overwrite board promoteTo", () => {
				var board_obj;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : shared_fen,
					promoteTo : "R",
					skipFenValidation : true
				});
				
				expect(board_obj.playMove("bxa8=X").san).toBe("bxa8=R");
			});
			
			test("invalid UCI should NOT overwrite board promoteTo", () => {
				var board_obj;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : shared_fen,
					promoteTo : "R",
					skipFenValidation : true
				});
				
				expect(board_obj.playMove("b7a8X").san).toBe("bxa8=R");
			});
			
			test("board.promoteTo in isMockMove from board is lowest priority", () => {
				var board_obj;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : shared_fen,
					promoteTo : "B",
					skipFenValidation : true
				});
				
				expect(board_obj.playMove("bxa8", {isMockMove : true}).san).toBe("bxa8=B");
				expect(board_obj.playMove("bxa8=X", {isMockMove : true}).san).toBe("bxa8=B");
				expect(board_obj.playMove("bxa8=N", {isMockMove : true}).san).toBe("bxa8=N");
				expect(board_obj.playMove("bxa8=N", {isMockMove : true, promoteTo : "R"}).san).toBe("bxa8=R");
				expect(board_obj.playMove("bxa8=N", {isMockMove : true, promoteTo : "X"}).san).toBe("bxa8=N");
				expect(board_obj.playMove("bxa8=X", {isMockMove : true, promoteTo : "X"}).san).toBe("bxa8=B");
			});
			
			test("board.promoteTo in isMockMove from fenApply is lowest priority", () => {
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8"], {promoteTo : "B", skipFenValidation : true}).san).toBe("bxa8=B");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=X"], {promoteTo : "B", skipFenValidation : true}).san).toBe("bxa8=B");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=N"], {promoteTo : "B", skipFenValidation : true}).san).toBe("bxa8=N");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=N", {promoteTo : "R"}], {promoteTo : "B", skipFenValidation : true}).san).toBe("bxa8=R");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=N", {promoteTo : "X"}], {promoteTo : "B", skipFenValidation : true}).san).toBe("bxa8=N");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=X", {promoteTo : "X"}], {promoteTo : "B", skipFenValidation : true}).san).toBe("bxa8=B");
				expect(Ic.fenApply(shared_fen, "playMove", ["bxa8=X", {promoteTo : "X"}], {promoteTo : "X", skipFenValidation : true}).san).toBe("bxa8=Q");
			});
		});
		
		describe("Enpassant related", () => {
			test("enpassant capture made with a non-pawn piece", () => {
				expect(Ic.fenApply("rnbqkbnr/1pp1pp2/p7/3pQ1p1/2K4p/3P4/PPP1PPPP/RNB2BNR w kq d6 0 8", "legalMoves", ["e5"], {skipFenValidation : true}).sort()).toEqual(["d5"].sort());
			});
			
			test("taking enpassant results in self check", () => {
				expect(Ic.fenApply("8/8/1k6/8/2pP4/8/8/6BK b - d3 0 1", "isLegalMove", ["c4-d3"], {skipFenValidation : true})).toBe(false);
				expect(Ic.fenApply("r1b1kbnr/ppp3pp/3q4/P2nPp2/3p4/7K/1PP2PP1/RNBQ1BNR w kq f6 0 10", "legalMoves", ["e5"], {skipFenValidation : true}).sort()).toEqual(["d6", "e6"].sort());
			});
			
			test("missing option to remove check via enpassant", () => {
				expect(Ic.fenApply("8/8/8/3k4/3pP3/8/8/7K b - e3 0 1", "isLegalMove", ["d4-e3"], {skipFenValidation : true})).toBe(true);
			});
			
			test("enpassant capture discovered double check", () => {
				var board_obj;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : "8/8/7k/6pP/5BKR/8/8/8 w - g6 0 1",
					skipFenValidation : true
				});
				
				board_obj.playMove("h5-g6");
				
				expect(board_obj.checks).toBe(2);
			});
		});
		
		describe("Castle related", () => {
			test("castling", () => {
				var temp;
				
				temp="2q1k3/3ppp2/5r2/7b/8/4n3/3PPP2/R3K2R w KQ - 0 1";
				
				//jumping attacked squares (white)
				expect(Ic.fenApply(temp, "isLegalMove", ["e1-c1"], {skipFenValidation : true})).toBe(false);//long
				expect(Ic.fenApply(temp, "isLegalMove", ["e1-g1"], {skipFenValidation : true})).toBe(false);//short
				
				temp="r3k2r/3pBp2/8/3N4/8/8/3PPP2/3QK3 b kq - 0 1";
				
				//jumping attacked squares (black)
				expect(Ic.fenApply(temp, "isLegalMove", ["e8-c8"], {skipFenValidation : true})).toBe(false);//long
				expect(Ic.fenApply(temp, "isLegalMove", ["e8-g8"], {skipFenValidation : true})).toBe(false);//short
				
				temp="qk6/pp5b/8/8/8/8/3PPP2/R3K3 w Q - 0 1";
				
				//b1 attack should not prevent long castle (white)
				expect(Ic.fenApply(temp, "isLegalMove", ["e1-c1"], {skipFenValidation : true})).toBe(true);
				
				temp="r3k3/3ppp2/N7/8/8/8/5PPP/6QK b q - 0 1";
				
				//b8 attack should not prevent long castle (black)
				expect(Ic.fenApply(temp, "isLegalMove", ["e8-c8"], {skipFenValidation : true})).toBe(true);
				
				temp="qk6/pp6/8/8/8/8/3PPPn1/R3K2R w KQ - 0 1";
				
				//castling in check (white)
				expect(Ic.fenApply(temp, "isLegalMove", ["e1-c1"], {skipFenValidation : true})).toBe(false);//long
				expect(Ic.fenApply(temp, "isLegalMove", ["e1-g1"], {skipFenValidation : true})).toBe(false);//short
				
				temp="r3k2r/3pppN1/8/8/8/8/5PPP/6QK b kq - 0 1";
				
				//castling in check (black)
				expect(Ic.fenApply(temp, "isLegalMove", ["e8-c8"], {skipFenValidation : true})).toBe(false);//long
				expect(Ic.fenApply(temp, "isLegalMove", ["e8-g8"], {skipFenValidation : true})).toBe(false);//short
			});
			
			test("SAN castling", () => {
				var temp;
				
				temp="r3k2r/1pn1ppp1/3pb3/8/8/3PB3/1PN1PPP1/R3K2R w KQkq - 0 1";
				
				expect(Ic.fenApply(temp, "playMove", ["O-O-O"], {skipFenValidation : true}).san).toBe("O-O-O");
				expect(Ic.fenApply(temp, "playMove", ["o-o-o"], {skipFenValidation : true}).san).toBe("O-O-O");
				expect(Ic.fenApply(temp, "playMove", ["0-0-0"], {skipFenValidation : true}).san).toBe("O-O-O");
				
				expect(Ic.fenApply(temp, "playMove", ["O-O"], {skipFenValidation : true}).san).toBe("O-O");
				expect(Ic.fenApply(temp, "playMove", ["o-o"], {skipFenValidation : true}).san).toBe("O-O");
				expect(Ic.fenApply(temp, "playMove", ["0-0"], {skipFenValidation : true}).san).toBe("O-O");
			});
			
			test("FEN castling", () => {
				var temp, fen_move;
				
				temp="r3k2r/3ppp2/2p3p1/8/8/2P3P1/3PPP2/R3K2R w KQkq - 0 1";
				
				fen_move="r3k2r/3ppp2/2p3p1/8/8/2P3P1/3PPP2/R4RK1 b kq - 1 1";
				expect(Ic.fenApply(temp, "playMove", [fen_move], {skipFenValidation : true}).san).toBe("O-O");
				
				fen_move="r3k2r/3ppp2/2p3p1/8/8/2P3P1/3PPP2/2KR3R b kq - 1 1";
				expect(Ic.fenApply(temp, "playMove", [fen_move], {skipFenValidation : true}).san).toBe("O-O-O");
				
				temp="r3k2r/3ppp2/2p3p1/8/8/2P3P1/3PPP2/R3K2R b KQkq - 0 1";
				
				fen_move="r4rk1/3ppp2/2p3p1/8/8/2P3P1/3PPP2/R3K2R w KQ - 1 2";
				expect(Ic.fenApply(temp, "playMove", [fen_move], {skipFenValidation : true}).san).toBe("O-O");
				
				fen_move="2kr3r/3ppp2/2p3p1/8/8/2P3P1/3PPP2/R3K2R w KQ - 1 2";
				expect(Ic.fenApply(temp, "playMove", [fen_move], {skipFenValidation : true}).san).toBe("O-O-O");
			});
			
			test("removing castle rights", () => {
				var board_obj, board_other;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : "r3k2r/4p3/8/3bb3/8/8/Q3P2Q/R3K2R w KQkq - 0 1",
					skipFenValidation : true
				});
				
				board_other=Ic.initBoard({
					boardName : other_board_name,
					fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
					skipFenValidation : true
				});
				
				expect(board_obj.w.castling).toBe(3);
				expect(board_obj.b.castling).toBe(3);
				
				//w losing long-castle right by rook-move
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("a1-d1");
				expect(board_other.w.castling).toBe(1);
				expect(board_other.b.castling).toBe(3);
				
				//w losing short-castle right by rook-move
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("h1-f1");
				expect(board_other.w.castling).toBe(2);
				expect(board_other.b.castling).toBe(3);
				
				//w losing both castling rights by king-move
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("e1-d1");
				expect(board_other.w.castling).toBe(0);
				expect(board_other.b.castling).toBe(3);
				
				//w losing both castling rights by long-castle
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("e1-c1");
				expect(board_other.w.castling).toBe(0);
				expect(board_other.b.castling).toBe(3);
				
				//w losing both castling rights by short-castle
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("e1-g1");
				expect(board_other.w.castling).toBe(0);
				expect(board_other.b.castling).toBe(3);
				
				//w making b lose long-castle right by rook-capture
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("a2-a8");
				expect(board_other.w.castling).toBe(3);
				expect(board_other.b.castling).toBe(1);
				
				//w making b lose short-castle right by rook-capture
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("h2-h8");
				expect(board_other.w.castling).toBe(3);
				expect(board_other.b.castling).toBe(2);
				
				board_obj.playMove("e2-e3");
				expect(board_obj.w.castling).toBe(3);
				expect(board_obj.b.castling).toBe(3);
				
				//b losing long-castle right by rook-move
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("a8-d8");
				expect(board_other.w.castling).toBe(3);
				expect(board_other.b.castling).toBe(1);
				
				//b losing short-castle right by rook-move
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("h8-f8");
				expect(board_other.w.castling).toBe(3);
				expect(board_other.b.castling).toBe(2);
				
				//b losing both castling rights by king-move
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("e8-d8");
				expect(board_other.w.castling).toBe(3);
				expect(board_other.b.castling).toBe(0);
				
				//b losing both castling rights by long-castle
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("e8-c8");
				expect(board_other.w.castling).toBe(3);
				expect(board_other.b.castling).toBe(0);
				
				//b losing both castling rights by short-castle
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("e8-g8");
				expect(board_other.w.castling).toBe(3);
				expect(board_other.b.castling).toBe(0);
				
				//b making w lose long-castle right by rook-capture
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("e5-a1");
				expect(board_other.w.castling).toBe(1);
				expect(board_other.b.castling).toBe(3);
				
				//b making w lose short-castle right by rook-capture
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				board_other.playMove("d5-h1");
				expect(board_other.w.castling).toBe(2);
				expect(board_other.b.castling).toBe(3);
			});
		});
		
		test("SAN check symbol, checkmate symbol, 1-0, 0-1 and 1/2-1/2", () => {
			var board_obj, board_other;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "k7/P7/4q3/8/8/4Q3/p7/K7 w - - 0 1",
				skipFenValidation : true
			});
			
			board_other=Ic.initBoard({
				boardName : other_board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				skipFenValidation : true
			});
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			board_other.playMoves(["e3-b3", "e6-b3"]);
			
			//stalemate (white turn)
			expect(board_other.moveList[board_other.moveList.length-1].moveResult).toBe("1/2-1/2");
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			board_other.playMoves(["e3-d4", "e6-b6", "d4-b6"]);
			
			//stalemate (black turn)
			expect(board_other.moveList[board_other.moveList.length-1].moveResult).toBe("1/2-1/2");
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			board_other.playMoves(["e3-b6", "e6-h3", "b6-b8"]);
			
			//checkmate (white win)
			expect(board_other.moveList[board_other.moveList.length-1].san).toBe("Qb8#");
			expect(board_other.moveList[board_other.moveList.length-1].moveResult).toBe("1-0");
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			board_other.playMoves(["e3-f4", "e6-b3", "f4-h6", "b3-b1"]);
			
			//checkmate (black win)
			expect(board_other.moveList[board_other.moveList.length-1].san).toBe("Qb1#");
			expect(board_other.moveList[board_other.moveList.length-1].moveResult).toBe("0-1");
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			board_other.playMove("e3-e4");
			
			//check (white performs check)
			expect(board_other.moveList[board_other.moveList.length-1].san).toBe("Qe4+");
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			board_other.playMoves(["e3-h6", "e6-e5"]);
			
			//check (black performs check)
			expect(board_other.moveList[board_other.moveList.length-1].san).toBe("Qe5+");
		});
		
		test("Ic.toPos() returns a reference", () => {
			var temp, board_obj;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				skipFenValidation : true
			});
			
			temp=Ic.toPos(board_obj.squares["a2"].pos);/*NO b.getSquare()*/
			
			expect(temp===Ic.toPos(board_obj.squares["a2"].pos).sort()).toBe(false);/*NO b.getSquare()*/
		});
		
		test("b.getSquare() isUnreferenced not working", () => {
			var temp, temp2, board_obj, board_other;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				skipFenValidation : true
			});
			
			board_other=Ic.initBoard({
				boardName : other_board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				skipFenValidation : true
			});
			
			temp=board_obj.getSquare("b2", {isUnreferenced : false});
			temp2=board_obj.getSquare("b2", {isUnreferenced : true});
			
			board_obj.playMoves(["b2-b3", "h7-h6", "c1-b2"]);
			
			expect(temp.isBishop).toBe(true);
			expect(temp2.isPawn).toBe(true);
			
			temp=board_other.getSquare("b2", {isUnreferenced : false});
			
			expect(temp.isPawn).toBe(true);
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			temp2=board_other.getSquare("b2", {isUnreferenced : false});
			
			board_obj.playMoves(["h6-h5", "b2-c1"]);
			
			expect(temp.isBishop).toBe(true);
			expect(temp2.isBishop).toBe(true);
			expect(board_obj.getSquare("b2", {isUnreferenced : false}).isEmptySquare).toBe(true);
			expect(board_obj.getSquare("b2", {isUnreferenced : true}).isEmptySquare).toBe(true);
		});
		
		describe("Ic.utilityMisc.cloneBoardObjs()", () => {
			test("cloning unmutable squares.x.pos", () => {
				var temp, temp2, board_obj, board_other;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
					skipFenValidation : true
				});
				
				board_other=Ic.initBoard({
					boardName : other_board_name,
					fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
					skipFenValidation : true
				});
				
				temp=board_obj.getSquare("e4", {isUnreferenced : false});
				temp2=board_other.getSquare("e4", {isUnreferenced : false});
				
				expect(temp.pos).toEqual(temp2.pos);
				expect(temp.pos===temp2.pos).toBe(false);
				
				temp.pos=[0, 0];
				
				expect(board_obj.getSquare("e4", {isUnreferenced : false}).pos).toEqual([0, 0]);
				
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				
				expect(temp2.pos).not.toEqual([0, 0]);
				expect(temp.pos===temp2.pos).toBe(false);
			});
		});
		
		test("Mixed PGN Comments and Escape mechanism", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]

% a4 a5
1. e4 {;} 1... e5 2. Nf3 d6 ; d4 x y {
% 2... Nc6 } 3. d3 d5 ;} 2... Na6
4. d4 Nh6 {}{} 5. Rg1`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn,
				validOrBreak : true
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("rnbqkb1r/ppp2ppp/7n/3pp3/3PP3/5N2/PPP2PPP/RNBQKBR1 b Qkq - 2 5");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
		});
		
		test("Checkmate and 50-move rule", () => {
			var fen;
			
			fen="rnbqkr2/ppppppNp/n5p1/2b5/8/P1N5/1PPPPPPP/R1BQKB1R b KQq - 100 52";
			
			expect(Ic.fenGet(fen, "isCheckmate isFiftyMove inDraw", {skipFenValidation : true})).toEqual({isCheckmate:true, isFiftyMove:true, inDraw:false});
		});
	});
	
	describe("Old tests", () => {
		var board_name, other_board_name;
		
		board_name="board_old_tests";
		other_board_name="board_old_tests_other";
		
		test("Basic functionality, part 1 of 2", () => {
			var board_obj;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				skipFenValidation : true
			});
			
			board_obj.playMoves(["e2-e4", "f7-f5", "d1-h5"]);
			
			//checks
			expect(board_obj.checks).toBe(1);
			
			//remove check via pawn blocking
			expect(board_obj.legalMoves("g7").sort()).toEqual(["g6"].sort());
			
			//basic b.moveList format, enpassant and clocks
			expect(board_obj.moveList[0].fen).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
			expect(board_obj.moveList[1].fen).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
			expect(board_obj.moveList[2].fen).toBe("rnbqkbnr/ppppp1pp/8/5p2/4P3/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 2");
			expect(board_obj.moveList[3].fen).toBe("rnbqkbnr/ppppp1pp/8/5p1Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2");
			
			board_obj.playMoves(["g7-g6", "h5-g6"]);
			
			//remove check via pawn capture
			expect(board_obj.legalMoves("h7").sort()).toEqual(["g6"].sort());
			
			board_obj.playMoves(["h7-g6", "f1-b5", "h8-h2", "b5-d7"]);
			
			//remove check via (knight, bishop, queen, king) capture and via (king) moving out of check
			expect(board_obj.legalMoves("b8").sort()).toEqual(["d7"].sort());
			expect(board_obj.legalMoves("c8").sort()).toEqual(["d7"].sort());
			expect(board_obj.legalMoves("d8").sort()).toEqual(["d7"].sort());
			expect(board_obj.legalMoves("e8").sort()).toEqual(["d7", "f7"].sort());
			
			board_obj.playMoves(["e8-f7", "e4-f5", "h2-h6", "g1-f3", "a7-a5", "f5-g6", "f7-f6", "g6-g7", "a8-a6", "d7-e8", "f6-f5", "e8-f7", "h6-c6"]);
			
			board_obj.setPromoteTo(4);
			
			board_obj.playMove("g7-f8");
			
			//SAN underpromote to rook
			expect(board_obj.moveList[board_obj.moveList.length-1].san).toBe("gxf8=R");
			
			board_obj.playMoves(["a5-a4", "f7-g6"]);
			
			//two active checks via discovered check
			expect(board_obj.checks).toBe(2);
			
			board_obj.playMoves(["f5-g6", "e1-g1"]);
			
			//wrong legal moves for empty square, b to move
			expect(board_obj.legalMoves("e4").sort()).toEqual([].sort());
			
			board_obj.playMove("a6-b6");
			
			//wrong legal moves for empty square, w to move
			expect(board_obj.legalMoves("e4").sort()).toEqual([].sort());
			
			//prevent pawn capture via moving forward (two squares, white)
			expect(board_obj.legalMoves("a2").sort()).toEqual(["a3"].sort());
			
			//pgn disambiguation
			expect(board_obj.moveList[board_obj.moveList.length-1].san).toBe("Rab6");
			
			//two squares pawn movement
			expect(board_obj.legalMoves("b2").sort()).toEqual(["b3", "b4"].sort());
			
			board_obj.playMove("b2-b4");
			
			//pawn can capture enpassant or move
			expect(board_obj.legalMoves("a4").sort()).toEqual(["a3", "b3"].sort());
			
			board_obj.playMove("c6-f6");
			
			//rook movement with capture
			expect(board_obj.legalMoves("f8").sort()).toEqual(["g8", "d8", "e8", "f7", "f6"].sort());
			
			//knight movement, prevent capture ally
			expect(board_obj.legalMoves("b1").sort()).toEqual(["c3", "a3"].sort());
			
			board_obj.playMove("a2-a3");
			
			//prevent pawn capture via moving forward (one square, black)
			expect(board_obj.legalMoves("a4").sort()).toEqual([].sort());
			
			board_obj.playMove("b6-a6");
			
			//no pgn disambiguation needed
			expect(board_obj.moveList[board_obj.moveList.length-1].san).toBe("Ra6");
			
			//single square pawn movement
			expect(board_obj.legalMoves("b4").sort()).toEqual(["b5"].sort());
		});
		
		test("Basic functionality, part 2 of 2", () => {
			var board_obj, board_other;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "r3k2r/4p3/3B1P2/2NpN1N1/1Pn1n1n1/3b1p2/4P3/R3K2R w KQkq - 0 1",
				skipFenValidation : true
			});
			
			board_other=Ic.initBoard({
				boardName : other_board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				skipFenValidation : true
			});
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			//incorrect white castling moves
			expect(board_other.legalMoves(board_other[board_other.activeColor].kingBos).sort()).toEqual(["g1", "c1", "d1", "f1"].sort());
			
			board_other.playMove("b4-b5");
			
			//incorrect black castling moves
			expect(board_other.legalMoves(board_other[board_other.activeColor].kingBos).sort()).toEqual(["f8", "d8", "c8", "g8"].sort());
			
			board_other.playMove("c4-d2");
			
			//preventing to long castle with b1 attacked
			expect(board_other.legalMoves(board_other[board_other.activeColor].kingBos).sort()).toEqual(["c1", "d1"].sort());
			
			board_other.playMove("d6-e7");
			
			//castle not being prevented via first square
			expect(board_other.legalMoves(board_other[board_other.activeColor].kingBos).sort()).toEqual([].sort());
			
			board_other.playMove("d2-b1");
			
			//allowing to long castle with b1 occupied
			expect(board_other.legalMoves(board_other[board_other.activeColor].kingBos).sort()).toEqual(["f1", "g1", "d1"].sort());
			
			board_other.playMoves(["g5-h3", "b1-d2", "h3-g5", "d2-f1"]);
			
			//allowing to short castle with f1 occupied
			expect(board_other.legalMoves(board_other[board_other.activeColor].kingBos).sort()).toEqual(["f1", "c1", "d1"].sort());
			
			board_other.playMoves(["g5-h3", "f1-d2", "h3-g5", "g4-e3"]);
			
			//allowing to long castle with d1 attacked
			expect(board_other.legalMoves(board_other[board_other.activeColor].kingBos).sort()).toEqual([].sort());
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			board_other.playMove("f6-f7");
			
			//allowing to castle with king at check (black)
			expect(board_other.legalMoves(board_other[board_other.activeColor].kingBos).sort()).toEqual(["d8", "f8"].sort());
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			board_other.playMoves(["b4-b5", "c4-a3", "b5-b6", "a3-c2"]);
			
			//allowing to castle with king at check (white)
			expect(board_other.legalMoves(board_other[board_other.activeColor].kingBos).sort()).toEqual(["d1", "f1"].sort());
			
			board_other.setPromoteTo("wn");
			
			board_other.playMoves(["e1-d1", "f3-f2", "d1-c1", "f2-f1"]);
			
			//setPromoteTo(wrong color className: w to b)
			expect(board_other.getSquare("f1").val).toBe(-2);
			
			board_other.playMoves(["b6-b7", "g4-h2"]);
			
			board_other.setPromoteTo("bn");
			
			board_other.playMove("b7-a8");
			
			//setPromoteTo(wrong color className: b to w)
			expect(board_other.getSquare("a8").className).toBe("wn");
		});
	});
});
