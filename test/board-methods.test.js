const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//setSquare
//countAttacks
//toggleIsRotated //test con board hash. + otro test de toggle x2 = mismo hash
//setPromoteTo
//setCurrentMove
//readFen
//updateFenAndMisc
//refinedFenTest
//testCollision
//ascii
//cloneBoardFrom
//cloneBoardTo
//moveCaller
//
//(x) navFirst (N/A)(ui only)
//(x) navPrevious (N/A)(ui only)
//(x) navNext (N/A)(ui only)
//(x) navLast (N/A)(ui only)
//(x) navLinkMove (N/A)(ui only)
//(x) refreshBoard (N/A)(ui only)

describe("Board methods", () => {
	describe("b.boardHash()", () => {
		var board_name, other_board_name;
		
		board_name="board_hash";
		other_board_name="board_hash_other";
		
		test("default position", () => {
			Ic.initBoard({
				boardName : board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.selectBoard(board_name).boardHash()).toBe(1497980971);
		});
		
		test("other position and board name not used in the hash", () => {
			var hash_a, hash_b, shared_fen;
			
			shared_fen="Bnb1kb1r/2qpppp1/1pp5/p6p/3Pn3/5N2/PPP2PPP/RNBQ1RK1 b k d3 0 8";
			
			Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				isHidden : true,
				invalidFenStop : true
			});
			
			Ic.initBoard({
				boardName : other_board_name,
				fen : shared_fen,
				isHidden : true,
				invalidFenStop : true
			});
			
			hash_a=Ic.selectBoard(board_name).boardHash();
			hash_b=Ic.selectBoard(other_board_name).boardHash();
			
			expect(hash_a).toBe(1277588826);
			expect(hash_a===hash_b).toBe(true);
			expect(Ic.selectBoard(board_name)===Ic.selectBoard(other_board_name)).toBe(false);
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
		});
		
		test("after making moves", () => {
			var board_a, board_b;
			
			board_a=Ic.selectBoard(board_name);
			board_b=Ic.selectBoard(other_board_name);
			
			board_a.moveCaller("a2", "a4");
			expect(board_a.isEqualBoard(board_b)).toBe(false);
			expect(board_b.isEqualBoard(board_a)).toBe(false);
			
			board_b.moveCaller("a2", "a4");
			expect(board_a.isEqualBoard(board_b)).toBe(true);
			expect(board_b.isEqualBoard(board_a)).toBe(true);
		});
	});
	
	test("b.legalMoves()", () => {
		expect(Ic.mapToBos(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2"])).sort()).toEqual(["a2", "d2", "b2"].sort());
		
		expect(Ic.mapToBos(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2"])).sort()).toEqual([].sort());
		
		expect(Ic.mapToBos(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"])])).sort()).toEqual(["a3", "a4"].sort());
	});
	
	test("b.isLegalMove()", () => {
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["c2", "a2"])).toBe(true);
		
		expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["a2", "c2"])).toBe(false);
		
		expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalMove", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"]), Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a4"])])).toBe(true);
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
});