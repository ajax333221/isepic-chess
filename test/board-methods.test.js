const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//[### ya via fenApply() ###] _getSquare
//_setSquare
//_countAttacks
//_toggleIsRotated //test con board hash. + otro test de toggle x2 = mismo hash
//_setPromoteTo
//_setCurrentMove
//_readFen
//_updateFenAndMisc
//_refinedFenTest
//_testCollision
//[### ya via fenApply() ###] _legalMoves
//[### ya via fenApply() ###] _isLegalMove
//_ascii
//_cloneBoardFrom
//_cloneBoardTo
//_moveCaller
//_refreshBoard (ponerle ui y sin ui o que?)

describe("Board methods", () => {
	describe("b.boardHash", () => {
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
	
	describe("b.isEqualBoard", () => {
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
});
