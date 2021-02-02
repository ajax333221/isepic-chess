const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//setSquare
//readValidatedFen
//updateFenAndMisc
//refinedFenTest (hay unos fen en misc.)
//testCollision
//toggleIsRotated (re-hacer asi bien con y sin boolean + return value)
//setPromoteTo (return value)
//setManualResult (return value)
//setCurrentMove (return value)
//toggleActiveNonActive (return value)
//playMove = via fen apply
//getWrappedMove
//(?mm) countLightDarkBishops
//(?mm) draftMove
//
//(x) sanWrapmoveHelper (se hara por b.getWrappedMove())
//(x) legalMovesHelper (se hara por b.legalMoves() y b.legalSanMoves())
//(x) cloneBoardTo (completado)(es un Ic.utilityMisc.cloneBoardObjs())
//(x) cloneBoardFrom (completado)(es un Ic.utilityMisc.cloneBoardObjs())
//(x) navFirst (se hara por b.setCurrentMove())
//(x) navPrevious (se hara por b.setCurrentMove())
//(x) navNext (se hara por b.setCurrentMove())
//(x) navLast (se hara por b.setCurrentMove())
//(x) navLinkMove (se hara por b.setCurrentMove())
//(x) refreshUi (N/A)(ui only)

describe("Board methods", () => {
	describe("b.boardHash()", () => {
		var board_name, other_board_name;
		
		board_name="board_hash";
		other_board_name="board_hash_other";
		
		test("default position", () => {
			var board_obj;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				isHidden : true,
				validOrBreak : true
			});
			
			expect(board_obj.boardHash()).toBe(310579461);
		});
		
		test("boardName and selectedBos not used in the hash", () => {
			var board_a, board_b, hash_a, hash_b, shared_fen;
			
			shared_fen="Bnb1kb1r/2qpppp1/1pp5/p6p/3Pn3/5N2/PPP2PPP/RNBQ1RK1 b k d3 0 8";
			
			board_a=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				isHidden : true,
				validOrBreak : true
			});
			
			board_b=Ic.initBoard({
				boardName : other_board_name,
				fen : shared_fen,
				isHidden : true,
				validOrBreak : true
			});
			
			board_a.selectedBos="a2";
			
			hash_a=board_a.boardHash();
			hash_b=board_b.boardHash();
			
			expect(hash_a).toBe(1663179513);
			expect(hash_a===hash_b).toBe(true);
			expect(board_a===board_b).toBe(false);
		});
	});
	
	describe("b.isEqualBoard()", () => {
		var board_name, other_board_name;
		
		board_name="board_is_equal";
		other_board_name="board_hash_other";
		
		test("(x to y), (y to x), (x to itself) and (y to itself)", () => {
			var board_a, board_b;
			
			board_a=Ic.initBoard({
				boardName : board_name,
				isHidden : true
			});
			
			board_b=Ic.initBoard({
				boardName : other_board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				isHidden : true
			});
			
			expect(board_a.isEqualBoard(board_b)).toBe(true);
			expect(board_b.isEqualBoard(board_a)).toBe(true);
			expect(board_a.isEqualBoard(board_a)).toBe(true);
			expect(board_b.isEqualBoard(board_b)).toBe(true);
			
			board_a.playMove("a2-a4");
			expect(board_a.isEqualBoard(board_b)).toBe(false);
			expect(board_b.isEqualBoard(board_a)).toBe(false);
			
			board_b.playMove("a2-a4");
			expect(board_a.isEqualBoard(board_b)).toBe(true);
			expect(board_b.isEqualBoard(board_a)).toBe(true);
		});
	});
	
	test("b.legalMoves()", () => {
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2"]).sort()).toEqual(["a2", "d2", "b2"].sort());
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2"]).sort()).toEqual([].sort());
		
		expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5"]).sort()).toEqual(["c6", "d7", "c4", "a6"].sort());
		
		expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"])]).sort()).toEqual(["a3", "a4"].sort());
		
		/*agregar unos de Checkmate, y quizas de disamb tambien*/
	});
	
	test("b.legalSanMoves()", () => {
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalSanMoves", ["c2"]).sort()).toEqual(["Rd2", "Rb2", "Rxa2"].sort());
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalSanMoves", ["a2"]).sort()).toEqual([].sort());
		
		expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalSanMoves", ["b5"]).sort()).toEqual(["Bc6", "Bxd7+", "Bxc4", "Ba6"].sort());
		
		expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalSanMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"])]).sort()).toEqual(["a3", "a4"].sort());
		
		/*agregar unos de Checkmate, y quizas de disamb tambien*/
	});
	
	test("b.isLegalMove()", () => {
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["Rxa2"])).toBe(true);
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["Ra2"])).toBe(false);
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["c2-a2"])).toBe(true);
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["a2-c2"])).toBe(false);
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["c2_a2", {delimiter : "_"}])).toBe(true);
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["a2_c2", {delimiter : "_"}])).toBe(false);
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", [["c2", "a2"]])).toBe(true);
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", [["a2", "c2"]])).toBe(false);
		
		expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalMove", [[Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"]), Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a4"])]])).toBe(true);
	});
	
	test("b.getSquare()", () => {
		expect(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["e8"]).val).toBe(-6);
		
		expect(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", [[2, 5]]).val).toBe(4);
		
		expect(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["d7", {rankShift : 1, fileShift : 2}]).isRook).toBe(true);
		
		expect(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", [[3, 3], {rankShift : -1}]).val).toBe(6);
		
		expect(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["f8"]), {fileShift : -1}]).val).toBe(-6);
		
		expect(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["e8", {rankShift : -1}])).toBeNull();
		
		expect(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["e1", {rankShift : 1}])).toBeNull();
		
		expect(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["a4", {fileShift : -1}])).toBeNull();
		
		expect(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["h4", {fileShift : 1}])).toBeNull();
	});
	
	describe("ascii, toggleIsRotated, countAttacks and setPromoteTo", () => {
		var board_name;
		
		board_name="board_shared_ascii";
		
		test("b.ascii(), b.toggleIsRotated(), b.countAttacks() and b.setPromoteTo()", () => {
			var temp, board_obj, rotated_yes, rotated_no;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "8/2PR4/8/p5PK/P1Q2n2/3PNp2/5q1r/4nb1k w - - 0 1",
				isRotated : true,
				promoteTo : "b",
				isHidden : true,
				validOrBreak : true
			});
			
			rotated_no=board_obj.ascii(false);
			rotated_yes=board_obj.ascii(true);
			
			expect(board_obj.ascii()===rotated_yes).toBe(true);
			expect(board_obj.ascii()).toBe(
`   +------------------------+
 1 | k  .  b  n  .  .  .  . |
 2 | r  .  q  .  .  .  .  . |
 3 | .  .  p  N  P  .  .  . |
 4 | .  .  n  .  .  Q  .  P |
 5 | K  P  .  .  .  .  .  p |
 6 | .  .  .  .  .  .  .  . |
 7 | .  .  .  .  R  P  .  . |
 8 | .  .  .  .  .  .  .  . |
   +------------------------+
     h  g  f  e  d  c  b  a
`
			);
			
			temp=board_obj.boardHash();
			
			board_obj.toggleIsRotated();
			board_obj.toggleIsRotated();
			expect(temp===board_obj.boardHash()).toBe(true);
			
			board_obj.toggleIsRotated();
			expect(temp===board_obj.boardHash()).toBe(false);
			
			expect(board_obj.ascii()===rotated_no).toBe(true);
			expect(board_obj.ascii()).toBe(
`   +------------------------+
 8 | .  .  .  .  .  .  .  . |
 7 | .  .  P  R  .  .  .  . |
 6 | .  .  .  .  .  .  .  . |
 5 | p  .  .  .  .  .  P  K |
 4 | P  .  Q  .  .  n  .  . |
 3 | .  .  .  P  N  p  .  . |
 2 | .  .  .  .  .  q  .  r |
 1 | .  .  .  .  n  b  .  k |
   +------------------------+
     a  b  c  d  e  f  g  h
`
			);
			
			expect(board_obj.countAttacks()).toBe(2);
			expect(board_obj.countAttacks("g2")).toBe(7);
			expect(board_obj.countAttacks("g2", true)).toBe(1);
			expect(board_obj.countAttacks("g4", false)).toBe(0);
			expect(board_obj.countAttacks("g4", true)).toBe(0);
			
			expect(board_obj.promoteTo).toBe(3);
			
			board_obj.setPromoteTo(4);
			expect(board_obj.promoteTo).toBe(4);
			
			board_obj.setPromoteTo(99);
			expect(board_obj.promoteTo).toBe(5);
			
			board_obj.setPromoteTo(-3);
			expect(board_obj.promoteTo).toBe(3);
			
			board_obj.setPromoteTo(-1);
			expect(board_obj.promoteTo).toBe(2);
		});
	});
	
	describe("b.pgnExport()", () => {
		var board_name, shared_fen, w_win_pgn, b_win_pgn, stalemate_pgn, unfinished_pgn, pgn_base;
		
		board_name="board_pgn_export";
		
		shared_fen="1k6/8/K7/3Q4/8/8/p7/8 w - - 0 1";
		
		w_win_pgn=`1. Ka5 Kc8 2. Ka6 Kb8 3. Qb7#`;//1-0
		b_win_pgn=`1. Qb3+ Kc8 2. Ka7 a1=Q+ 3. Qa3 Kc7 4. Qa2 Qxa2#`;//0-1
		stalemate_pgn=`1. Qxa2 Ka8 2. Kb6+ Kb8 3. Qa6`;//½-½
		unfinished_pgn=`1. Ka5 Kc7 2. Qh5 Kd7 3. Kb5`;//unfinished
		
		pgn_base=`[Event "Chess game"]
[Site "?"]
[Date "????.??.??"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "_RESULT_"]
[SetUp "1"]
[FEN "1k6/8/K7/3Q4/8/8/p7/8 w - - 0 1"]

_MOVES_`;
		
		test("MoveResult 1-0 in index 0 and n", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				pgn : w_win_pgn,
				isHidden : true,
				validOrBreak : true
			});
			
			pgn_to_compare=pgn_base.replace("_RESULT_", "1-0").replace("_MOVES_", (w_win_pgn+" 1-0"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("1-0");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1-0").replace("_MOVES_", (w_win_pgn+" 1-0"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("0-1");
			pgn_to_compare=pgn_base.replace("_RESULT_", "0-1").replace("_MOVES_", (w_win_pgn+" 0-1"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("1/2-1/2");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1/2-1/2").replace("_MOVES_", (w_win_pgn+" 1/2-1/2"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("*");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1-0").replace("_MOVES_", (w_win_pgn+" 1-0"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
		});
		
		test("MoveResult 0-1 in index 0 and n", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				pgn : b_win_pgn,
				isHidden : true,
				validOrBreak : true
			});
			
			pgn_to_compare=pgn_base.replace("_RESULT_", "0-1").replace("_MOVES_", (b_win_pgn+" 0-1"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("1-0");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1-0").replace("_MOVES_", (b_win_pgn+" 1-0"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("0-1");
			pgn_to_compare=pgn_base.replace("_RESULT_", "0-1").replace("_MOVES_", (b_win_pgn+" 0-1"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("1/2-1/2");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1/2-1/2").replace("_MOVES_", (b_win_pgn+" 1/2-1/2"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("*");
			pgn_to_compare=pgn_base.replace("_RESULT_", "0-1").replace("_MOVES_", (b_win_pgn+" 0-1"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
		});
		
		test("MoveResult 1/2-1/2 in index 0 and n", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				pgn : stalemate_pgn,
				isHidden : true,
				validOrBreak : true
			});
			
			pgn_to_compare=pgn_base.replace("_RESULT_", "1/2-1/2").replace("_MOVES_", (stalemate_pgn+" {Stalemate} 1/2-1/2"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("1-0");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1-0").replace("_MOVES_", (stalemate_pgn+" {Stalemate} 1-0"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("0-1");
			pgn_to_compare=pgn_base.replace("_RESULT_", "0-1").replace("_MOVES_", (stalemate_pgn+" {Stalemate} 0-1"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("1/2-1/2");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1/2-1/2").replace("_MOVES_", (stalemate_pgn+" {Stalemate} 1/2-1/2"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("*");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1/2-1/2").replace("_MOVES_", (stalemate_pgn+" {Stalemate} 1/2-1/2"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
		});
		
		test("MoveResult empty in index 0 and n", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				pgn : unfinished_pgn,
				isHidden : true,
				validOrBreak : true
			});
			
			pgn_to_compare=pgn_base.replace("_RESULT_", "*").replace("_MOVES_", (unfinished_pgn+" *"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("1-0");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1-0").replace("_MOVES_", (unfinished_pgn+" 1-0"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("0-1");
			pgn_to_compare=pgn_base.replace("_RESULT_", "0-1").replace("_MOVES_", (unfinished_pgn+" 0-1"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("1/2-1/2");
			pgn_to_compare=pgn_base.replace("_RESULT_", "1/2-1/2").replace("_MOVES_", (unfinished_pgn+" 1/2-1/2"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.setManualResult("*");
			pgn_to_compare=pgn_base.replace("_RESULT_", "*").replace("_MOVES_", (unfinished_pgn+" *"));
			
			board_obj.navFirst();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.navLast();
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
		});
		
		test("auto-claim draw when CanDraw", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "8/3k4/1r6/8/4P3/3K4/6R1/8 w - - 99 102",
				isHidden : true,
				validOrBreak : true
			});
			
			pgn_to_compare=pgn_base.replace("_RESULT_", "*").replace("_MOVES_", "*").replace("1k6/8/K7/3Q4/8/8/p7/8 w - - 0 1", "8/3k4/1r6/8/4P3/3K4/6R1/8 w - - 99 102");
			
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.playMove("g2-b2");
			
			pgn_to_compare=pgn_base.replace("_RESULT_", "1/2-1/2").replace("_MOVES_", "102. Rb2 {50 moves rule} 1/2-1/2").replace("1k6/8/K7/3Q4/8/8/p7/8 w - - 0 1", "8/3k4/1r6/8/4P3/3K4/6R1/8 w - - 99 102");
			
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
			
			board_obj.playMove("b6-b2");
			
			pgn_to_compare=pgn_base.replace("_RESULT_", "*").replace("_MOVES_", "102. Rb2 {50 moves rule} Rxb2 *").replace("1k6/8/K7/3Q4/8/8/p7/8 w - - 0 1", "8/3k4/1r6/8/4P3/3K4/6R1/8 w - - 99 102");
			
			expect(board_obj.pgnExport()).toBe(pgn_to_compare);
		});
	});
});
