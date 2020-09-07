const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//setSquare
//setCurrentMove
//readFen
//updateFenAndMisc
//refinedFenTest
//testCollision
//moveCaller
//
//(x) cloneBoardTo (completado)(es un Ic.utilityMisc.cloneBoardObjs())
//(x) cloneBoardFrom (completado)(es un Ic.utilityMisc.cloneBoardObjs())
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
			var board_obj;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(board_obj.boardHash()).toBe(764735748);
		});
		
		test("other position and board name not used in the hash", () => {
			var board_a, board_b, hash_a, hash_b, shared_fen;
			
			shared_fen="Bnb1kb1r/2qpppp1/1pp5/p6p/3Pn3/5N2/PPP2PPP/RNBQ1RK1 b k d3 0 8";
			
			board_a=Ic.initBoard({
				boardName : board_name,
				fen : shared_fen,
				isHidden : true,
				invalidFenStop : true
			});
			
			board_b=Ic.initBoard({
				boardName : other_board_name,
				fen : shared_fen,
				isHidden : true,
				invalidFenStop : true
			});
			
			hash_a=board_a.boardHash();
			hash_b=board_b.boardHash();
			
			expect(hash_a).toBe(-1331796314);
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
				invalidFenStop : true
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
});
