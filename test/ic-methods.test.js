const {Ic}=require("../isepic-chess");

//Ic.setSilentMode(false);

//---to do:
//
//getBoardNames
//setSilentMode
//boardExists (+ que deje igual silent mode)
//selectBoard
//countPieces
//removeBoard (si se le pasaba undefined crasheaba, pero se arreglo)
//isEqualBoard
//cloneBoard
//fenGet (pero solo invalid board, properties, etc)

describe("Ic methods", () => {
	var bad_shared_values, bad_shared_positions;
	
	//used in: Ic.toVal(), Ic.toAbsVal(), Ic.toBal(), Ic.toAbsBal(), Ic.toClassName()
	bad_shared_values=["", " ", false, true, , null, ("x"*9), {}, [], [1], [1, 1, 1], "err", 0, -0, "*", "5", "-5", "xx", "XQ", "BX", "BQxyz"];
	
	//used in: aaaaaaaaaaaaaaaaaaaaa continuar en fnIcToBos
	bad_shared_positions=["", " ", false, true, , null, ("x"*9), {}, [], [1], [1, 1, 1], "z1", "z9", "a9", "ABCxyz", 0, 1, 8, Infinity, -Infinity];
	
	describe("Ic.toVal", () => {
		var board_name;
		
		board_name="board_to_val";
		
		test("default value: 0", () => {
			var i, len, default_val;
			
			default_val=0;
			
			for(i=0, len=bad_shared_values.length; i<len; i++){//0<len
				expect(Ic.toVal(bad_shared_values[i])).toBe(default_val);
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.toVal("p")).toBe(-1);
			expect(Ic.toVal("n")).toBe(-2);
			expect(Ic.toVal("b")).toBe(-3);
			expect(Ic.toVal("R")).toBe(4);
			expect(Ic.toVal("Q")).toBe(5);
			expect(Ic.toVal("K")).toBe(6);
			expect(Ic.toVal(-1)).toBe(-1);
			expect(Ic.toVal(-2)).toBe(-2);
			expect(Ic.toVal(-3)).toBe(-3);
			expect(Ic.toVal(4)).toBe(4);
			expect(Ic.toVal(5)).toBe(5);
			expect(Ic.toVal(6)).toBe(6);
			expect(Ic.toVal("bp")).toBe(-1);
			expect(Ic.toVal("bn")).toBe(-2);
			expect(Ic.toVal("bb")).toBe(-3);
			expect(Ic.toVal("wr")).toBe(4);
			expect(Ic.toVal("wq")).toBe(5);
			expect(Ic.toVal("wk")).toBe(6);
			expect(Ic.toVal(-99)).toBe(-6);
			expect(Ic.toVal(99)).toBe(6);
			expect(Ic.toVal("BQ")).toBe(-5);
		});
		
		test("square input", () => {
			Ic.initBoard({
				boardName : board_name,
				fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.toVal(Ic.selectBoard(board_name).Squares["c8"])).toBe(-6);
		});
	});
	
	describe("Ic.toAbsVal", () => {
		var board_name;
		
		board_name="board_to_abs_val";
		
		test("default value: 0", () => {
			var i, len, default_val;
			
			default_val=0;
			
			for(i=0, len=bad_shared_values.length; i<len; i++){//0<len
				expect(Ic.toAbsVal(bad_shared_values[i])).toBe(default_val);
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.toAbsVal("p")).toBe(1);
			expect(Ic.toAbsVal("n")).toBe(2);
			expect(Ic.toAbsVal("b")).toBe(3);
			expect(Ic.toAbsVal("R")).toBe(4);
			expect(Ic.toAbsVal("Q")).toBe(5);
			expect(Ic.toAbsVal("K")).toBe(6);
			expect(Ic.toAbsVal(-1)).toBe(1);
			expect(Ic.toAbsVal(-2)).toBe(2);
			expect(Ic.toAbsVal(-3)).toBe(3);
			expect(Ic.toAbsVal(4)).toBe(4);
			expect(Ic.toAbsVal(5)).toBe(5);
			expect(Ic.toAbsVal(6)).toBe(6);
			expect(Ic.toAbsVal("bp")).toBe(1);
			expect(Ic.toAbsVal("bn")).toBe(2);
			expect(Ic.toAbsVal("bb")).toBe(3);
			expect(Ic.toAbsVal("wr")).toBe(4);
			expect(Ic.toAbsVal("wq")).toBe(5);
			expect(Ic.toAbsVal("wk")).toBe(6);
			expect(Ic.toAbsVal(-99)).toBe(6);
			expect(Ic.toAbsVal(99)).toBe(6);
			expect(Ic.toAbsVal("BQ")).toBe(5);
		});
		
		test("square input", () => {
			Ic.initBoard({
				boardName : board_name,
				fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.toAbsVal(Ic.selectBoard(board_name).Squares["c8"])).toBe(6);
		});
	});
	
	describe("Ic.toBal", () => {
		var board_name;
		
		board_name="board_to_bal";
		
		test("default value: *", () => {
			var i, len, default_val;
			
			default_val="*";
			
			for(i=0, len=bad_shared_values.length; i<len; i++){//0<len
				expect(Ic.toBal(bad_shared_values[i])).toBe(default_val);
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.toBal("p")).toBe("p");
			expect(Ic.toBal("n")).toBe("n");
			expect(Ic.toBal("b")).toBe("b");
			expect(Ic.toBal("R")).toBe("R");
			expect(Ic.toBal("Q")).toBe("Q");
			expect(Ic.toBal("K")).toBe("K");
			expect(Ic.toBal(-1)).toBe("p");
			expect(Ic.toBal(-2)).toBe("n");
			expect(Ic.toBal(-3)).toBe("b");
			expect(Ic.toBal(4)).toBe("R");
			expect(Ic.toBal(5)).toBe("Q");
			expect(Ic.toBal(6)).toBe("K");
			expect(Ic.toBal("bp")).toBe("p");
			expect(Ic.toBal("bn")).toBe("n");
			expect(Ic.toBal("bb")).toBe("b");
			expect(Ic.toBal("wr")).toBe("R");
			expect(Ic.toBal("wq")).toBe("Q");
			expect(Ic.toBal("wk")).toBe("K");
			expect(Ic.toBal(-99)).toBe("k");
			expect(Ic.toBal(99)).toBe("K");
			expect(Ic.toBal("BQ")).toBe("q");
		});
		
		test("square input", () => {
			Ic.initBoard({
				boardName : board_name,
				fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.toBal(Ic.selectBoard(board_name).Squares["c8"])).toBe("k");
		});
	});
	
	describe("Ic.toAbsBal", () => {
		var board_name;
		
		board_name="board_to_abs_bal";
		
		test("default value: *", () => {
			var i, len, default_val;
			
			default_val="*";
			
			for(i=0, len=bad_shared_values.length; i<len; i++){//0<len
				expect(Ic.toAbsBal(bad_shared_values[i])).toBe(default_val);
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.toAbsBal("p")).toBe("P");
			expect(Ic.toAbsBal("n")).toBe("N");
			expect(Ic.toAbsBal("b")).toBe("B");
			expect(Ic.toAbsBal("R")).toBe("R");
			expect(Ic.toAbsBal("Q")).toBe("Q");
			expect(Ic.toAbsBal("K")).toBe("K");
			expect(Ic.toAbsBal(-1)).toBe("P");
			expect(Ic.toAbsBal(-2)).toBe("N");
			expect(Ic.toAbsBal(-3)).toBe("B");
			expect(Ic.toAbsBal(4)).toBe("R");
			expect(Ic.toAbsBal(5)).toBe("Q");
			expect(Ic.toAbsBal(6)).toBe("K");
			expect(Ic.toAbsBal("bp")).toBe("P");
			expect(Ic.toAbsBal("bn")).toBe("N");
			expect(Ic.toAbsBal("bb")).toBe("B");
			expect(Ic.toAbsBal("wr")).toBe("R");
			expect(Ic.toAbsBal("wq")).toBe("Q");
			expect(Ic.toAbsBal("wk")).toBe("K");
			expect(Ic.toAbsBal(-99)).toBe("K");
			expect(Ic.toAbsBal(99)).toBe("K");
			expect(Ic.toAbsBal("BQ")).toBe("Q");
		});
		
		test("square input", () => {
			Ic.initBoard({
				boardName : board_name,
				fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.toAbsBal(Ic.selectBoard(board_name).Squares["c8"])).toBe("K");
		});
	});
	
	describe("Ic.toClassName", () => {
		var board_name;
		
		board_name="board_to_class_name";
		
		test("default value: empty_string", () => {
			var i, len, default_val;
			
			default_val="";
			
			for(i=0, len=bad_shared_values.length; i<len; i++){//0<len
				expect(Ic.toClassName(bad_shared_values[i])).toBe(default_val);
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.toClassName("p")).toBe("bp");
			expect(Ic.toClassName("n")).toBe("bn");
			expect(Ic.toClassName("b")).toBe("bb");
			expect(Ic.toClassName("R")).toBe("wr");
			expect(Ic.toClassName("Q")).toBe("wq");
			expect(Ic.toClassName("K")).toBe("wk");
			expect(Ic.toClassName(-1)).toBe("bp");
			expect(Ic.toClassName(-2)).toBe("bn");
			expect(Ic.toClassName(-3)).toBe("bb");
			expect(Ic.toClassName(4)).toBe("wr");
			expect(Ic.toClassName(5)).toBe("wq");
			expect(Ic.toClassName(6)).toBe("wk");
			expect(Ic.toClassName("bp")).toBe("bp");
			expect(Ic.toClassName("bn")).toBe("bn");
			expect(Ic.toClassName("bb")).toBe("bb");
			expect(Ic.toClassName("wr")).toBe("wr");
			expect(Ic.toClassName("wq")).toBe("wq");
			expect(Ic.toClassName("wk")).toBe("wk");
			expect(Ic.toClassName(-99)).toBe("bk");
			expect(Ic.toClassName(99)).toBe("wk");
			expect(Ic.toClassName("BQ")).toBe("bq");
		});
		
		test("square input", () => {
			Ic.initBoard({
				boardName : board_name,
				fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.toClassName(Ic.selectBoard(board_name).Squares["c8"])).toBe("bk");
		});
	});
	
	describe("Ic.initBoard", () => {
		var board_name, other_board_name;
		
		board_name="board_init";
		other_board_name="board_init_other";
		
		test("optional clocks are added", () => {
			Ic.initBoard({
				boardName : board_name,
				fen : "8/r6k/8/8/8/R6K/8/8 w - -",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.selectBoard(board_name).Fen).toBe("8/r6k/8/8/8/R6K/8/8 w - - 0 1");
		});
		
		test("original board is overwritten by valid fen and references still work", () => {
			var temp=Ic.initBoard({
				boardName : board_name,
				fen : "8/1r5k/8/8/8/1R5K/8/8 w - - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.selectBoard(board_name).Fen).toBe("8/1r5k/8/8/8/1R5K/8/8 w - - 0 1");
			expect(temp===Ic.selectBoard(board_name)).toBe(true);
		});
		
		test("original board is not overwritten by invalid fen and null is returned (invalidFenStop=true)", () => {
			var temp=Ic.initBoard({
				boardName : board_name,
				fen : "0invalidfen0",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.selectBoard(board_name).Fen).toBe("8/1r5k/8/8/8/1R5K/8/8 w - - 0 1");
			expect(temp).toBeNull();
		});
		
		test("original board is not overwritten by creating other board", () => {
			Ic.initBoard({
				boardName : other_board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.selectBoard(board_name).Fen).toBe("8/1r5k/8/8/8/1R5K/8/8 w - - 0 1");
		});
		
		test("original board is overwritten to default fen by invalid fen (invalidFenStop=false)", () => {
			var temp;
			
			temp=Ic.initBoard({
				boardName : board_name,
				fen : "0invalidfen0",
				isHidden : true
			});
			
			expect(Ic.selectBoard(board_name).Fen).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
			expect(temp).not.toBeNull();
		});
	});
});
