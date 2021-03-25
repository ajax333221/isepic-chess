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
//toggleActiveNonActive (return value)
//playMove = via fen apply
//getWrappedMove
//draftMove
//
//(x) sanWrapmoveHelper (se hara por b.getWrappedMove())
//(x) legalMovesHelper (se hara por b.legalMoves() y b.legalSanMoves())
//(x) refreshUi (N/A)(ui only)

describe("Board methods", () => {
	describe("b.boardHash()", () => {
		var board_name, other_board_name;
		
		board_name="board_hash";
		other_board_name="board_hash_other";
		
		test("default position", () => {
			var board_obj, shared_fen;
			
			shared_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				skipFenValidation : true
			});
			
			expect(board_obj.boardHash()).toBe(343365617);
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				isHidden : true,
				skipFenValidation : true
			});
			
			expect(board_obj.boardHash()).toBe(1880872456);
			expect(Ic.fenApply(shared_fen, "boardHash", [], {skipFenValidation : true})).toBe(1880872456);
		});
		
		test("boardName not used in the hash", () => {
			var board_a, board_b, hash_a, hash_b, shared_fen;
			
			shared_fen="Bnb1kb1r/2qpppp1/1pp5/p6p/3Pn3/5N2/PPP2PPP/RNBQ1RK1 b k d3 0 8";
			
			board_a=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				skipFenValidation : true
			});
			
			board_b=Ic.initBoard({
				boardName : other_board_name,
				fen : shared_fen,
				skipFenValidation : true
			});
			
			hash_a=board_a.boardHash();
			hash_b=board_b.boardHash();
			
			expect(hash_a).toBe(-604108863);
			expect(hash_a===hash_b).toBe(true);
			expect(board_a===board_b).toBe(false);
		});
	});
	
	describe("b.isEqualBoard()", () => {
		var board_name, other_board_name;
		
		board_name="board_is_equal";
		other_board_name="board_hash_other";
		
		test("(x to y), (y to x), (x to itself) and (y to itself)", () => {
			var board_a, board_b, shared_fen;
			
			shared_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
			
			board_a=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				skipFenValidation : true
			});
			
			board_b=Ic.initBoard({
				boardName : other_board_name,
				fen : shared_fen,
				skipFenValidation : true
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
			
			Ic.setSilentMode(true);
			expect(board_a.isEqualBoard("0invalid0")).toBe(false);
			expect(board_b.isEqualBoard("0invalid0")).toBe(false);
			Ic.setSilentMode(false);
		});
	});
	
	describe("b.legalMoves()", () => {
		test("returnType=(default)toSquare, squareType=(default)bos", () => {
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2"], {skipFenValidation : true}).sort()).toEqual(["a2", "d2", "b2"].sort());
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2"], {skipFenValidation : true}).sort()).toEqual([].sort());
			
			expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5"], {skipFenValidation : true}).sort()).toEqual(["c6", "d7", "c4", "a6"].sort());
			
			expect(Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalMoves", ["b7"], {skipFenValidation : true}).sort()).toEqual(["b8", "c8", "a8"].sort());
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true})], {skipFenValidation : true}).sort()).toEqual(["a3", "a4"].sort());
		});
		
		test("returnType=(default)toSquare, squareType=square", () => {
			var p, temp;
			
			p={squareType : "square"};
			
			temp=Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2", p], {skipFenValidation : true});
			expect(temp.length).toBe(3);
			expect(Ic.utilityMisc.isSquare(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isSquare(temp[1])).toBe(true);
			expect(Ic.utilityMisc.isSquare(temp[2])).toBe(true);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual(["a2", "d2", "b2"].sort());
			
			temp=Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2", p], {skipFenValidation : true});
			expect(temp.length).toBe(0);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual([].sort());
			
			temp=Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5", p], {skipFenValidation : true});
			expect(temp.length).toBe(4);
			expect(Ic.utilityMisc.isSquare(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isSquare(temp[1])).toBe(true);
			expect(Ic.utilityMisc.isSquare(temp[2])).toBe(true);
			expect(Ic.utilityMisc.isSquare(temp[3])).toBe(true);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual(["c6", "d7", "c4", "a6"].sort());
			
			temp=Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalMoves", ["b7", p], {skipFenValidation : true});
			expect(temp.length).toBe(3);
			expect(Ic.utilityMisc.isSquare(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isSquare(temp[1])).toBe(true);
			expect(Ic.utilityMisc.isSquare(temp[2])).toBe(true);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual(["b8", "c8", "a8"].sort());
			
			temp=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true}), p], {skipFenValidation : true});
			expect(temp.length).toBe(2);
			expect(Ic.utilityMisc.isSquare(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isSquare(temp[1])).toBe(true);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual(["a3", "a4"].sort());
		});
		
		test("returnType=(default)toSquare, squareType=pos", () => {
			var p, temp;
			
			p={squareType : "pos"};
			
			temp=Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2", p], {skipFenValidation : true});
			expect(temp.length).toBe(3);
			expect(Ic.utilityMisc.isArray(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[1])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[2])).toBe(true);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual(["a2", "d2", "b2"].sort());
			
			temp=Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2", p], {skipFenValidation : true});
			expect(temp.length).toBe(0);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual([].sort());
			
			temp=Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5", p], {skipFenValidation : true});
			expect(temp.length).toBe(4);
			expect(Ic.utilityMisc.isArray(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[1])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[2])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[3])).toBe(true);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual(["c6", "d7", "c4", "a6"].sort());
			
			temp=Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalMoves", ["b7", p], {skipFenValidation : true});
			expect(temp.length).toBe(3);
			expect(Ic.utilityMisc.isArray(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[1])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[2])).toBe(true);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual(["b8", "c8", "a8"].sort());
			
			temp=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true}), p], {skipFenValidation : true});
			expect(temp.length).toBe(2);
			expect(Ic.utilityMisc.isArray(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[1])).toBe(true);
			expect(temp.map(x => Ic.toBos(x)).sort()).toEqual(["a3", "a4"].sort());
		});
		
		test("returnType=joined, delimiter=(default)-", () => {
			var p;
			
			p={returnType : "joined"};
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2", p], {skipFenValidation : true}).sort()).toEqual(["c2-a2", "c2-d2", "c2-b2"].sort());
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2", p], {skipFenValidation : true}).sort()).toEqual([].sort());
			
			expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5", p], {skipFenValidation : true}).sort()).toEqual(["b5-c6", "b5-d7", "b5-c4", "b5-a6"].sort());
			
			expect(Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalMoves", ["b7", p], {skipFenValidation : true}).sort()).toEqual(["b7-b8", "b7-c8", "b7-a8"].sort());
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true}), p], {skipFenValidation : true}).sort()).toEqual(["a2-a3", "a2-a4"].sort());
		});
		
		test("returnType=joined, delimiter=_", () => {
			var p;
			
			p={returnType : "joined", delimiter : "_"};
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2", p], {skipFenValidation : true}).sort()).toEqual(["c2_a2", "c2_d2", "c2_b2"].sort());
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2", p], {skipFenValidation : true}).sort()).toEqual([].sort());
			
			expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5", p], {skipFenValidation : true}).sort()).toEqual(["b5_c6", "b5_d7", "b5_c4", "b5_a6"].sort());
			
			expect(Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalMoves", ["b7", p], {skipFenValidation : true}).sort()).toEqual(["b7_b8", "b7_c8", "b7_a8"].sort());
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true}), p], {skipFenValidation : true}).sort()).toEqual(["a2_a3", "a2_a4"].sort());
		});
		
		test("returnType=fromToSquares, squareType=(default)bos", () => {
			var p;
			
			p={returnType : "fromToSquares"};
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2", p], {skipFenValidation : true}).sort()).toEqual([["c2", "a2"], ["c2", "d2"], ["c2", "b2"]].sort());
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2", p], {skipFenValidation : true}).sort()).toEqual([].sort());
			
			expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5", p], {skipFenValidation : true}).sort()).toEqual([["b5", "c6"], ["b5", "d7"], ["b5", "c4"], ["b5", "a6"]].sort());
			
			expect(Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalMoves", ["b7", p], {skipFenValidation : true}).sort()).toEqual([["b7", "b8"], ["b7", "c8"], ["b7", "a8"]].sort());
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true}), p], {skipFenValidation : true}).sort()).toEqual([["a2", "a3"], ["a2", "a4"]].sort());
		});
		
		test("returnType=fromToSquares, squareType=pos", () => {
			var p;
			
			p={returnType : "fromToSquares", squareType : "pos"};
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2", p], {skipFenValidation : true}).sort()).toEqual([[[6, 2], [6, 0]], [[6, 2], [6, 3]], [[6, 2], [6, 1]]].sort());
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2", p], {skipFenValidation : true}).sort()).toEqual([].sort());
			
			expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5", p], {skipFenValidation : true}).sort()).toEqual([[[3, 1], [2, 2]], [[3, 1], [1, 3]], [[3, 1], [4, 2]], [[3, 1], [2, 0]]].sort());
			
			expect(Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalMoves", ["b7", p], {skipFenValidation : true}).sort()).toEqual([[[1, 1], [0, 1]], [[1, 1], [0, 2]], [[1, 1], [0, 0]]].sort());
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true}), p], {skipFenValidation : true}).sort()).toEqual([[[6, 0], [5, 0]], [[6, 0], [4, 0]]].sort());
		});
		
		test("returnType=fromToSquares, squareType=square", () => {
			var p, temp;
			
			p={returnType : "fromToSquares", squareType : "square"};
			
			temp=Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2", p], {skipFenValidation : true});
			expect(temp.length).toBe(3);
			expect(Ic.utilityMisc.isArray(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[1])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[2])).toBe(true);
			expect(temp.map(x => Ic.toBos(x[1])).sort()).toEqual(["a2", "d2", "b2"].sort());
			
			temp=Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2", p], {skipFenValidation : true});
			expect(temp.length).toBe(0);
			expect(temp.map(x => Ic.toBos(x[1])).sort()).toEqual([].sort());
			
			temp=Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5", p], {skipFenValidation : true});
			expect(temp.length).toBe(4);
			expect(Ic.utilityMisc.isArray(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[1])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[2])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[3])).toBe(true);
			expect(temp.map(x => Ic.toBos(x[1])).sort()).toEqual(["c6", "d7", "c4", "a6"].sort());
			
			temp=Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalMoves", ["b7", p], {skipFenValidation : true});
			expect(temp.length).toBe(3);
			expect(Ic.utilityMisc.isArray(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[1])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[2])).toBe(true);
			expect(temp.map(x => Ic.toBos(x[1])).sort()).toEqual(["b8", "c8", "a8"].sort());
			
			temp=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true}), p], {skipFenValidation : true});
			expect(temp.length).toBe(2);
			expect(Ic.utilityMisc.isArray(temp[0])).toBe(true);
			expect(Ic.utilityMisc.isArray(temp[1])).toBe(true);
			expect(temp.map(x => Ic.toBos(x[1])).sort()).toEqual(["a3", "a4"].sort());
		});
		
		test("returnType=(x)san", () => {
			var p;
			
			p={returnType : "san"};
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2", p], {skipFenValidation : true}).sort()).toEqual(["Rd2", "Rb2", "Rxa2"].sort());
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2", p], {skipFenValidation : true}).sort()).toEqual([].sort());
			
			expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalMoves", ["b5", p], {skipFenValidation : true}).sort()).toEqual(["Bc6", "Bxd7+", "Bxc4", "Ba6"].sort());
			
			expect(Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalMoves", ["b7", p], {skipFenValidation : true}).sort()).toEqual(["b8=Q+", "b8=N", "b8=B+", "b8=R", "bxc8=Q+", "bxc8=N", "bxc8=B", "bxc8=R+", "bxa8=Q", "bxa8=N#", "bxa8=B", "bxa8=R"].sort());
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true}), p], {skipFenValidation : true}).sort()).toEqual(["a3", "a4"].sort());
		});
	});
	
	test("b.legalSanMoves()", () => {
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalSanMoves", ["c2"], {skipFenValidation : true}).sort()).toEqual(["Rd2", "Rb2", "Rxa2"].sort());
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalSanMoves", ["a2"], {skipFenValidation : true}).sort()).toEqual([].sort());
		
		expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalSanMoves", ["b5"], {skipFenValidation : true}).sort()).toEqual(["Bc6", "Bxd7+", "Bxc4", "Ba6"].sort());
		
		expect(Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalSanMoves", ["b7"], {skipFenValidation : true}).sort()).toEqual(["b8=Q+", "b8=N", "b8=B+", "b8=R", "bxc8=Q+", "bxc8=N", "bxc8=B", "bxc8=R+", "bxa8=Q", "bxa8=N#", "bxa8=B", "bxa8=R"].sort());
		
		expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalSanMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true})], {skipFenValidation : true}).sort()).toEqual(["a3", "a4"].sort());
	});
	
	test("b.legalUciMoves()", () => {
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalUciMoves", ["c2"], {skipFenValidation : true}).sort()).toEqual(["c2d2", "c2b2", "c2a2"].sort());
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalUciMoves", ["a2"], {skipFenValidation : true}).sort()).toEqual([].sort());
		
		expect(Ic.fenApply("1rq1k2r/p1pb1pp1/1p3n1p/1Bb1N3/P1p1P3/2P2P1P/1P4P1/R1BQ1R1K w k - 0 1", "legalUciMoves", ["b5"], {skipFenValidation : true}).sort()).toEqual(["b5c6", "b5d7", "b5c4", "b5a6"].sort());
		
		expect(Ic.fenApply("r1bn3r/pPkpppbp/2n3p1/8/2N5/1R6/1PPPPPPR/2BQKBN1 w - - 7 20", "legalUciMoves", ["b7"], {skipFenValidation : true}).sort()).toEqual(["b7b8q", "b7b8n", "b7b8b", "b7b8r", "b7c8q", "b7c8n", "b7c8b", "b7c8r", "b7a8q", "b7a8n", "b7a8b", "b7a8r"].sort());
		
		expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalUciMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true})], {skipFenValidation : true}).sort()).toEqual(["a2a3", "a2a4"].sort());
	});
	
	describe("b.isLegalMove()", () => {
		var shared_fen, shared_promo_fen;
		
		shared_fen="8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1";
		shared_promo_fen="rn1qkbnr/1P1ppppp/2p5/8/8/8/1PPPPPPP/RNBQKBNR w KQkq - 0 5";
		
		test("san move", () => {
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["Rxa2"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["Ra2"], {skipFenValidation : true})).toBe(false);
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["Rxa9"], {skipFenValidation : true})).toBe(false);
			
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8="], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=z"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=p"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=k"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=Z"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=P"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=K"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=0"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=1"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=6"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=9"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=q"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=Q"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["bxa8=5"], {skipFenValidation : true})).toBe(true);
		});
		
		test("uci move", () => {
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["c2a2"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["a2c2"], {skipFenValidation : true})).toBe(false);
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["c9a9"], {skipFenValidation : true})).toBe(false);
			
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8 "], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8="], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8z"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8p"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8k"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8Z"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8P"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8K"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a80"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a81"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a86"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a89"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8q"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a8Q"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_promo_fen, "isLegalMove", ["b7a85"], {skipFenValidation : true})).toBe(true);
		});
		
		test("joined move", () => {
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["c2-a2"], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["a2-c2"], {skipFenValidation : true})).toBe(false);
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["a9-c9"], {skipFenValidation : true})).toBe(false);
			
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["c2_a2", {delimiter : "_"}], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["a2_c2", {delimiter : "_"}], {skipFenValidation : true})).toBe(false);
			expect(Ic.fenApply(shared_fen, "isLegalMove", ["a9_c9", {delimiter : "_"}], {skipFenValidation : true})).toBe(false);
		});
		
		test("from to move", () => {
			expect(Ic.fenApply(shared_fen, "isLegalMove", [["c2", "a2"]], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_fen, "isLegalMove", [["a2", "c2"]], {skipFenValidation : true})).toBe(false);
			expect(Ic.fenApply(shared_fen, "isLegalMove", [["a9", "c9"]], {skipFenValidation : true})).toBe(false);
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalMove", [[Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"], {skipFenValidation : true}), Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a4"], {skipFenValidation : true})]], {skipFenValidation : true})).toBe(true);
		});
		
		test("object move", () => {
			expect(Ic.fenApply(shared_fen, "isLegalMove", [Ic.fenApply(shared_fen, "playMove", ["c2-a2"], {skipFenValidation : true})], {skipFenValidation : true})).toBe(true);
			expect(Ic.fenApply(shared_fen, "isLegalMove", [Ic.fenApply(shared_fen, "playMove", ["a2-c2"], {skipFenValidation : true})], {skipFenValidation : true})).toBe(false);
			expect(Ic.fenApply(shared_fen, "isLegalMove", [Ic.fenApply(shared_fen, "playMove", ["c9-a9"], {skipFenValidation : true})], {skipFenValidation : true})).toBe(false);
		});
	});
	
	test("b.getSquare()", () => {
		var shared_fen;
		
		shared_fen="4k3/8/3K1R2/8/8/8/8/8 b - - 0 1";
		
		expect(Ic.fenApply(shared_fen, "getSquare", ["e8"], {skipFenValidation : true}).val).toBe(-6);
		
		expect(Ic.fenApply(shared_fen, "getSquare", [[2, 5]], {skipFenValidation : true}).val).toBe(4);
		
		expect(Ic.fenApply(shared_fen, "getSquare", ["d7", {rankShift : 1, fileShift : 2}], {skipFenValidation : true}).isRook).toBe(true);
		
		expect(Ic.fenApply(shared_fen, "getSquare", [[3, 3], {rankShift : -1}], {skipFenValidation : true}).val).toBe(6);
		
		expect(Ic.fenApply(shared_fen, "getSquare", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["f8"], {skipFenValidation : true}), {fileShift : -1}], {skipFenValidation : true}).val).toBe(-6);
		
		expect(Ic.fenApply(shared_fen, "getSquare", ["e8", {rankShift : -1}], {skipFenValidation : true})).toBeNull();
		
		expect(Ic.fenApply(shared_fen, "getSquare", ["e1", {rankShift : 1}], {skipFenValidation : true})).toBeNull();
		
		expect(Ic.fenApply(shared_fen, "getSquare", ["a4", {fileShift : -1}], {skipFenValidation : true})).toBeNull();
		
		expect(Ic.fenApply(shared_fen, "getSquare", ["h4", {fileShift : 1}], {skipFenValidation : true})).toBeNull();
	});
	
	test("b.countAttacks()", () => {
		var shared_fen;
		
		shared_fen="8/2PR4/8/p5PK/P1Q2n2/3PNp2/5q1r/4nb1k w - - 0 1";
		
		expect(Ic.fenApply(shared_fen, "countAttacks", [], {skipFenValidation : true})).toBe(2);
		expect(Ic.fenApply(shared_fen, "countAttacks", [null], {skipFenValidation : true})).toBe(2);
		expect(Ic.fenApply(shared_fen, "countAttacks", [null, true], {skipFenValidation : true})).toBe(1);
		expect(Ic.fenApply(shared_fen, "countAttacks", [null, false], {skipFenValidation : true})).toBe(2);
		
		expect(Ic.fenApply(shared_fen, "countAttacks", ["g2"], {skipFenValidation : true})).toBe(7);
		expect(Ic.fenApply(shared_fen, "countAttacks", ["g2", true], {skipFenValidation : true})).toBe(1);
		expect(Ic.fenApply(shared_fen, "countAttacks", ["g2", false], {skipFenValidation : true})).toBe(7);
		
		expect(Ic.fenApply(shared_fen, "countAttacks", ["g4"], {skipFenValidation : true})).toBe(0);
		expect(Ic.fenApply(shared_fen, "countAttacks", ["g4", false], {skipFenValidation : true})).toBe(0);
		expect(Ic.fenApply(shared_fen, "countAttacks", ["g4", true], {skipFenValidation : true})).toBe(0);
	});
	
	test("b.ascii()", () => {
		var shared_fen, w_view_diagram, b_view_diagram;
		
		shared_fen="r1b2rk1/ppp1bppp/2N5/8/3qN3/8/PPPP1PPP/R1BQ1RK1 b - - 0 9";
		
		w_view_diagram=`   +------------------------+
 8 | r  .  b  .  .  r  k  . |
 7 | p  p  p  .  b  p  p  p |
 6 | .  .  N  .  .  .  .  . |
 5 | .  .  .  .  .  .  .  . |
 4 | .  .  .  q  N  .  .  . |
 3 | .  .  .  .  .  .  .  . |
 2 | P  P  P  P  .  P  P  P |
 1 | R  .  B  Q  .  R  K  . |
   +------------------------+
     a  b  c  d  e  f  g  h
`;
		
		b_view_diagram=`   +------------------------+
 1 | .  K  R  .  Q  B  .  R |
 2 | P  P  P  .  P  P  P  P |
 3 | .  .  .  .  .  .  .  . |
 4 | .  .  .  N  q  .  .  . |
 5 | .  .  .  .  .  .  .  . |
 6 | .  .  .  .  .  N  .  . |
 7 | p  p  p  b  .  p  p  p |
 8 | .  k  r  .  .  b  .  r |
   +------------------------+
     h  g  f  e  d  c  b  a
`;
		
		expect(Ic.fenApply(shared_fen, "ascii", [], {skipFenValidation : true})).toBe(w_view_diagram);
		expect(Ic.fenApply(shared_fen, "ascii", [], {isRotated : false, skipFenValidation : true})).toBe(w_view_diagram);
		
		expect(Ic.fenApply(shared_fen, "ascii", [], {isRotated : true, skipFenValidation : true})).toBe(b_view_diagram);
		
		expect(Ic.fenApply(shared_fen, "ascii", [false], {skipFenValidation : true})).toBe(w_view_diagram);
		expect(Ic.fenApply(shared_fen, "ascii", [false], {isRotated : false, skipFenValidation : true})).toBe(w_view_diagram);
		expect(Ic.fenApply(shared_fen, "ascii", [false], {isRotated : true, skipFenValidation : true})).toBe(w_view_diagram);
		
		expect(Ic.fenApply(shared_fen, "ascii", [true], {skipFenValidation : true})).toBe(b_view_diagram);
		expect(Ic.fenApply(shared_fen, "ascii", [true], {isRotated : false, skipFenValidation : true})).toBe(b_view_diagram);
		expect(Ic.fenApply(shared_fen, "ascii", [true], {isRotated : true, skipFenValidation : true})).toBe(b_view_diagram);
	});
	
	test("b.countLightDarkBishops()", () => {
		var current_fen;
		
		current_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		expect(Ic.fenApply(current_fen, "countLightDarkBishops", [], {skipFenValidation : true})).toEqual({
			w : {lightSquaredBishops : 1, darkSquaredBishops : 1},
			b : {lightSquaredBishops : 1, darkSquaredBishops : 1}
		});
		
		current_fen="8/q5n1/p2k1b1r/Qp2bb1p/1P5P/RK1B3N/4B3/8 b - - 0 1";
		expect(Ic.fenApply(current_fen, "countLightDarkBishops", [], {skipFenValidation : true})).toEqual({
			w : {lightSquaredBishops : 2, darkSquaredBishops : 0},
			b : {lightSquaredBishops : 1, darkSquaredBishops : 2}
		});
	});
	
	test("b.cloneBoardFrom() and b.cloneBoardTo()", () => {
		var board_a_name, board_b_name, board_a, board_b;
		
		//b.cloneBoardFrom() covered with Ic.utilityMisc.cloneBoardObjs()
		//b.cloneBoardTo() covered with Ic.utilityMisc.cloneBoardObjs()
		
		board_a_name="board_a";
		board_b_name="board_b";
		
		board_a=Ic.initBoard({
			boardName : board_a_name,
			fen : "r1b1kbnr/ppppqppp/2n1p3/8/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 4 4",
			skipFenValidation : true
		});
		
		board_b=Ic.initBoard({
			boardName : board_b_name,
			fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			skipFenValidation : true
		});
		
		Ic.setSilentMode(true);
		expect(board_a.cloneBoardFrom(board_a)).toBe(false);
		expect(board_b.cloneBoardFrom(board_b)).toBe(false);
		expect(board_a.cloneBoardTo(board_a)).toBe(false);
		expect(board_b.cloneBoardTo(board_b)).toBe(false);
		
		expect(board_a.cloneBoardTo("0invalid0")).toBe(false);
		expect(board_b.cloneBoardTo("0invalid0")).toBe(false);
		Ic.setSilentMode(false);
		
		expect(Ic.isEqualBoard(board_a_name, board_b_name)).toBe(false);
		
		expect(board_b.cloneBoardFrom(board_a)).toBe(true);
		expect(Ic.isEqualBoard(board_a_name, board_b_name)).toBe(true);
		expect(board_b.fen).toBe("r1b1kbnr/ppppqppp/2n1p3/8/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 4 4");
		
		board_a.playMove("e8-d8");
		expect(Ic.isEqualBoard(board_a_name, board_b_name)).toBe(false);
		
		expect(board_a.cloneBoardTo(board_b)).toBe(true);
		expect(Ic.isEqualBoard(board_a_name, board_b_name)).toBe(true);
		expect(board_b.fen).toBe("r1bk1bnr/ppppqppp/2n1p3/8/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 w - - 5 5");
	});
	
	describe("mix: ascii, toggleIsRotated and setPromoteTo", () => {
		var board_name;
		
		board_name="board_shared_ascii";
		
		test("mix: b.ascii(), b.toggleIsRotated() and b.setPromoteTo()", () => {
			var temp, board_obj, rotated_yes, rotated_no;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "8/2PR4/8/p5PK/P1Q2n2/3PNp2/5q1r/4nb1k w - - 0 1",
				isRotated : true,
				promoteTo : "b",
				skipFenValidation : true
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
		
		test("moveResult 1-0 in index 0 and n", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				pgn : w_win_pgn,
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
		
		test("moveResult 0-1 in index 0 and n", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				pgn : b_win_pgn,
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
		
		test("moveResult 1/2-1/2 in index 0 and n", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				pgn : stalemate_pgn,
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
		
		test("moveResult empty in index 0 and n", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				pgn : unfinished_pgn,
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
		
		test("auto-claim draw when canDraw", () => {
			var board_obj, pgn_to_compare;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "8/3k4/1r6/8/4P3/3K4/6R1/8 w - - 99 102",
				skipFenValidation : true
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
	
	test("b.uciExport()", () => {
		var board_name, board_obj, uci_to_compare;
		
		board_name="board_uci_export";
		
		board_obj=Ic.initBoard({
			boardName : board_name,
			fen : "8/7P/8/4p3/5p2/1n3P2/pk4P1/4K2R b K - 0 1",
			skipFenValidation : true
		});
		
		uci_to_compare="";
		expect(board_obj.uciExport()).toBe(uci_to_compare);
		
		uci_to_compare="e5e4";
		board_obj.playMove("e5-e4");
		expect(board_obj.uciExport()).toBe(uci_to_compare);
		
		uci_to_compare="e5e4 e1g1";
		board_obj.playMove("e1-g1");
		expect(board_obj.uciExport()).toBe(uci_to_compare);
		
		uci_to_compare="e5e4 e1g1 a2a1r";
		board_obj.playMove("a1=R");
		expect(board_obj.uciExport()).toBe(uci_to_compare);
		
		uci_to_compare="e5e4 e1g1 a2a1r h7h8q";
		board_obj.playMove("h8=Q");
		expect(board_obj.uciExport()).toBe(uci_to_compare);
	});
	
	test("b.navFirst(), b.navPrevious(), b.navNext(), b.navLast(), b.navLinkMove() and b.setCurrentMove()", () => {
		var temp, board_name, board_obj;
		
		board_name="board_nav";
		
		board_obj=Ic.initBoard({
			boardName : board_name,
			fen : "2kr1bnr/pppbpppp/2n5/7q/5B2/2NP1N2/PPPQ1PPP/R3KB1R b KQ - 4 7",
			skipFenValidation : true
		});
		
		temp=board_obj.navFirst();
		expect(temp).toBe(false);
		
		temp=board_obj.navPrevious();
		expect(temp).toBe(false);
		
		temp=board_obj.navNext();
		expect(temp).toBe(false);
		
		temp=board_obj.navLast();
		expect(temp).toBe(false);
		
		temp=board_obj.navLinkMove(0);
		expect(temp).toBe(false);
		
		temp=board_obj.navLinkMove(1);
		expect(temp).toBe(false);
		
		temp=board_obj.navLinkMove(-1);
		expect(temp).toBe(false);
		
		expect(board_obj.currentMove).toBe(0);
		
		board_obj.playMove("g8-f6");
		
		expect(board_obj.currentMove).toBe(1);
		
		temp=board_obj.navFirst();
		expect(temp).toBe(true);
		
		temp=board_obj.navFirst();
		expect(temp).toBe(false);
		
		temp=board_obj.navPrevious();
		expect(temp).toBe(false);
		
		expect(board_obj.currentMove).toBe(0);
		
		temp=board_obj.navLast();
		expect(temp).toBe(true);
		
		temp=board_obj.navLast();
		expect(temp).toBe(false);
		
		temp=board_obj.navNext();
		expect(temp).toBe(false);
		
		expect(board_obj.currentMove).toBe(1);
		
		board_obj.playMove("e1-c1");
		
		temp=board_obj.navLinkMove(1);
		expect(temp).toBe(true);
		
		temp=board_obj.navLinkMove(1);
		expect(temp).toBe(false);
		
		temp=board_obj.navPrevious();
		expect(temp).toBe(true);
		
		temp=board_obj.navPrevious();
		expect(temp).toBe(false);
		
		temp=board_obj.navLinkMove(1);
		expect(temp).toBe(true);
		
		temp=board_obj.navLinkMove(1);
		expect(temp).toBe(false);
		
		temp=board_obj.navNext();
		expect(temp).toBe(true);
		
		temp=board_obj.navNext();
		expect(temp).toBe(false);
		
		board_obj.playMove("e7-e6");
		
		temp=board_obj.navLinkMove(-Infinity);
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(0);
		
		temp=board_obj.navLinkMove(Infinity);
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(3);
		
		temp=board_obj.navLinkMove("2");
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(2);
		
		temp=board_obj.navLinkMove("x");
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(0);
		
		temp=board_obj.setCurrentMove(1, true);
		expect(temp).toBe(true);
		
		temp=board_obj.setCurrentMove(1, true);
		expect(temp).toBe(false);
		
		expect(board_obj.currentMove).toBe(1);
		
		temp=board_obj.setCurrentMove(1, false);
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(2);
		
		temp=board_obj.setCurrentMove(1, false);
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(3);
		
		temp=board_obj.setCurrentMove(-2, false);
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(1);
		
		temp=board_obj.setCurrentMove(-2, false);
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(0);
		
		temp=board_obj.setCurrentMove(2, false);
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(2);
		
		temp=board_obj.setCurrentMove(2, false);
		expect(temp).toBe(true);
		
		expect(board_obj.currentMove).toBe(3);
	});
});
