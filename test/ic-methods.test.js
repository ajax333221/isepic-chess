const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//+testcase for pgn (validOrBreak true/false) in Ic.initBoard()
//getBoardNames
//getBoard
//removeBoard (si se le pasaba undefined crasheaba, pero se arreglo)
//
//(x) isEqualBoard (completado)(es un b.isEqualBoard())
//(x) cloneBoard (completado)(es un Ic.utilityMisc.cloneBoardObjs())
//(x) setSilentMode (N/A)

describe("Ic methods", () => {
	var bad_shared_values, bad_shared_squares, bad_shared_fen;
	
	//used in: Ic.toVal(), Ic.toAbsVal(), Ic.toBal(), Ic.toAbsBal(), Ic.toClassName(), Ic.getSign()
	//Note: getSign() skips the 'false' value
	bad_shared_values=["", " ", false, true, , null, ("x"*9), {}, [], [1], [1, 1, 1], "err", 0, -0, "*", "xx", "XQ", "BX", "BQxyz"];
	
	//used in: Ic.toBos(), Ic.toPos(), Ic.getRankPos(), Ic.getFilePos(), Ic.getRankBos(), Ic.getFileBos(), Ic.isInsideBoard()
	bad_shared_squares=["", " ", false, true, , null, ("x"*9), {}, [], [1], [1, 1, 1], "z1", "z9", "a9", "ABCxyz", 0, 1, 8, Infinity, -Infinity, "Infinity", "-Infinity", [3, 8], [8, 3], [8, 8], [3, -1], [-1, 3], [-1, -1]];
	
	//used in: Ic.fenApply()
	bad_shared_fen=["", " ", false, true, , null, ("x"*9), {}, [], [1], [1, 1, 1], "err", 0, -0, "*", 99, -99, Infinity, -Infinity, "Infinity", "-Infinity"];
	
	describe("Ic.toVal()", () => {
		test("default value", () => {
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
			expect(Ic.toVal("-5")).toBe(-5);
			expect(Ic.toVal("5")).toBe(5);
			expect(Ic.toVal(Infinity)).toBe(6);
			expect(Ic.toVal(-Infinity)).toBe(-6);
			expect(Ic.toVal("Infinity")).toBe(6);
			expect(Ic.toVal("-Infinity")).toBe(-6);
		});
		
		test("square input", () => {
			var square_c8;
			
			square_c8=Ic.fenApply("2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1", "getSquare", ["c8"]);
			
			expect(Ic.toVal(square_c8)).toBe(-6);
		});
	});
	
	describe("Ic.toAbsVal()", () => {
		test("default value", () => {
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
			expect(Ic.toAbsVal("-5")).toBe(5);
			expect(Ic.toAbsVal("5")).toBe(5);
			expect(Ic.toAbsVal(Infinity)).toBe(6);
			expect(Ic.toAbsVal(-Infinity)).toBe(6);
			expect(Ic.toAbsVal("Infinity")).toBe(6);
			expect(Ic.toAbsVal("-Infinity")).toBe(6);
		});
		
		test("square input", () => {
			var square_c8;
			
			square_c8=Ic.fenApply("2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1", "getSquare", ["c8"]);
			
			expect(Ic.toAbsVal(square_c8)).toBe(6);
		});
	});
	
	describe("Ic.toBal()", () => {
		test("default value", () => {
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
			expect(Ic.toBal("-5")).toBe("q");
			expect(Ic.toBal("5")).toBe("Q");
			expect(Ic.toBal(Infinity)).toBe("K");
			expect(Ic.toBal(-Infinity)).toBe("k");
			expect(Ic.toBal("Infinity")).toBe("K");
			expect(Ic.toBal("-Infinity")).toBe("k");
		});
		
		test("square input", () => {
			var square_c8;
			
			square_c8=Ic.fenApply("2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1", "getSquare", ["c8"]);
			
			expect(Ic.toBal(square_c8)).toBe("k");
		});
	});
	
	describe("Ic.toAbsBal()", () => {
		test("default value", () => {
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
			expect(Ic.toAbsBal("-5")).toBe("Q");
			expect(Ic.toAbsBal("5")).toBe("Q");
			expect(Ic.toAbsBal(Infinity)).toBe("K");
			expect(Ic.toAbsBal(-Infinity)).toBe("K");
			expect(Ic.toAbsBal("Infinity")).toBe("K");
			expect(Ic.toAbsBal("-Infinity")).toBe("K");
		});
		
		test("square input", () => {
			var square_c8;
			
			square_c8=Ic.fenApply("2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1", "getSquare", ["c8"]);
			
			expect(Ic.toAbsBal(square_c8)).toBe("K");
		});
	});
	
	describe("Ic.toClassName()", () => {
		test("default value", () => {
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
			expect(Ic.toClassName("-5")).toBe("bq");
			expect(Ic.toClassName("5")).toBe("wq");
			expect(Ic.toClassName(Infinity)).toBe("wk");
			expect(Ic.toClassName(-Infinity)).toBe("bk");
			expect(Ic.toClassName("Infinity")).toBe("wk");
			expect(Ic.toClassName("-Infinity")).toBe("bk");
		});
		
		test("square input", () => {
			var square_c8;
			
			square_c8=Ic.fenApply("2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1", "getSquare", ["c8"]);
			
			expect(Ic.toClassName(square_c8)).toBe("bk");
		});
	});
	
	describe("Ic.getSign()", () => {
		test("default value", () => {
			var i, len, default_val;
			
			default_val=-1;
			
			for(i=0, len=bad_shared_values.length; i<len; i++){//0<len
				if(bad_shared_values[i]!==false){
					expect(Ic.getSign(bad_shared_values[i])).toBe(default_val);
				}
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.getSign("p")).toBe(-1);
			expect(Ic.getSign("n")).toBe(-1);
			expect(Ic.getSign("b")).toBe(-1);
			expect(Ic.getSign("R")).toBe(1);
			expect(Ic.getSign("Q")).toBe(1);
			expect(Ic.getSign("K")).toBe(1);
			expect(Ic.getSign(-1)).toBe(-1);
			expect(Ic.getSign(-2)).toBe(-1);
			expect(Ic.getSign(-3)).toBe(-1);
			expect(Ic.getSign(4)).toBe(1);
			expect(Ic.getSign(5)).toBe(1);
			expect(Ic.getSign(6)).toBe(1);
			expect(Ic.getSign("bp")).toBe(-1);
			expect(Ic.getSign("bn")).toBe(-1);
			expect(Ic.getSign("bb")).toBe(-1);
			expect(Ic.getSign("wr")).toBe(1);
			expect(Ic.getSign("wq")).toBe(1);
			expect(Ic.getSign("wk")).toBe(1);
			expect(Ic.getSign(-99)).toBe(-1);
			expect(Ic.getSign(99)).toBe(1);
			expect(Ic.getSign("BQ")).toBe(-1);
			expect(Ic.getSign("-5")).toBe(-1);
			expect(Ic.getSign("5")).toBe(1);
			expect(Ic.getSign(Infinity)).toBe(1);
			expect(Ic.getSign(-Infinity)).toBe(-1);
			expect(Ic.getSign("Infinity")).toBe(1);
			expect(Ic.getSign("-Infinity")).toBe(-1);
		});
		
		test("square input", () => {
			var square_c8;
			
			square_c8=Ic.fenApply("2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1", "getSquare", ["c8"]);
			
			expect(Ic.getSign(square_c8)).toBe(-1);
		});
	});
	
	describe("Ic.toBos()", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_squares.length; i<len; i++){//0<len
				expect(Ic.toBos(bad_shared_squares[i])).toBeNull();
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.toBos([0, 0])).toBe("a8");
			expect(Ic.toBos([0, 7])).toBe("h8");
			expect(Ic.toBos([7, 0])).toBe("a1");
			expect(Ic.toBos([7, 7])).toBe("h1");
			expect(Ic.toBos("a8")).toBe("a8");
			expect(Ic.toBos("h8")).toBe("h8");
			expect(Ic.toBos("a1")).toBe("a1");
			expect(Ic.toBos("h1")).toBe("h1");
			expect(Ic.toBos([4, 3])).toBe("d4");
			expect(Ic.toBos([3, 4])).toBe("e5");
			expect(Ic.toBos([3, 3])).toBe("d5");
			expect(Ic.toBos([4, 4])).toBe("e4");
			expect(Ic.toBos([2, 6])).toBe("g6");
			expect(Ic.toBos([6, 2])).toBe("c2");
			expect(Ic.toBos([2, 2])).toBe("c6");
			expect(Ic.toBos([6, 6])).toBe("g2");
			expect(Ic.toBos([false, false])).toBe("a8");
			expect(Ic.toBos([false, true])).toBe("b8");
			expect(Ic.toBos([true, false])).toBe("a7");
			expect(Ic.toBos([true, true])).toBe("b7");
			expect(Ic.toBos("A1")).toBe("a1");
			expect(Ic.toBos("B2")).toBe("b2");
			expect(Ic.toBos("C3")).toBe("c3");
			expect(Ic.toBos("D4")).toBe("d4");
			expect(Ic.toBos("E5")).toBe("e5");
			expect(Ic.toBos("F6")).toBe("f6");
			expect(Ic.toBos("G7")).toBe("g7");
			expect(Ic.toBos("H8")).toBe("h8");
		});
		
		test("square input", () => {
			var square_e7;
			
			square_e7=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]);
			
			expect(Ic.toBos(square_e7)).toBe("e7");
		});
	});
	
	describe("Ic.toPos()", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_squares.length; i<len; i++){//0<len
				expect(Ic.toPos(bad_shared_squares[i])).toBeNull();
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.toPos([0, 0])).toEqual([0, 0]);
			expect(Ic.toPos([0, 7])).toEqual([0, 7]);
			expect(Ic.toPos([7, 0])).toEqual([7, 0]);
			expect(Ic.toPos([7, 7])).toEqual([7, 7]);
			expect(Ic.toPos("a8")).toEqual([0, 0]);
			expect(Ic.toPos("h8")).toEqual([0, 7]);
			expect(Ic.toPos("a1")).toEqual([7, 0]);
			expect(Ic.toPos("h1")).toEqual([7, 7]);
			expect(Ic.toPos([4, 3])).toEqual([4, 3]);
			expect(Ic.toPos([3, 4])).toEqual([3, 4]);
			expect(Ic.toPos([3, 3])).toEqual([3, 3]);
			expect(Ic.toPos([4, 4])).toEqual([4, 4]);
			expect(Ic.toPos([2, 6])).toEqual([2, 6]);
			expect(Ic.toPos([6, 2])).toEqual([6, 2]);
			expect(Ic.toPos([2, 2])).toEqual([2, 2]);
			expect(Ic.toPos([6, 6])).toEqual([6, 6]);
			expect(Ic.toPos([false, false])).toEqual([0, 0]);
			expect(Ic.toPos([false, true])).toEqual([0, 1]);
			expect(Ic.toPos([true, false])).toEqual([1, 0]);
			expect(Ic.toPos([true, true])).toEqual([1, 1]);
			expect(Ic.toPos("A1")).toEqual([7, 0]);
			expect(Ic.toPos("B2")).toEqual([6, 1]);
			expect(Ic.toPos("C3")).toEqual([5, 2]);
			expect(Ic.toPos("D4")).toEqual([4, 3]);
			expect(Ic.toPos("E5")).toEqual([3, 4]);
			expect(Ic.toPos("F6")).toEqual([2, 5]);
			expect(Ic.toPos("G7")).toEqual([1, 6]);
			expect(Ic.toPos("H8")).toEqual([0, 7]);
		});
		
		test("square input", () => {
			var square_e7;
			
			square_e7=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]);
			
			expect(Ic.toPos(square_e7)).toEqual([1, 4]);
		});
	});
	
	describe("Ic.getRankPos()", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_squares.length; i<len; i++){//0<len
				expect(Ic.getRankPos(bad_shared_squares[i])).toBeNull();
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.getRankPos([0, 0])).toBe(0);
			expect(Ic.getRankPos([0, 7])).toBe(0);
			expect(Ic.getRankPos([7, 0])).toBe(7);
			expect(Ic.getRankPos([7, 7])).toBe(7);
			expect(Ic.getRankPos("a8")).toBe(0);
			expect(Ic.getRankPos("h8")).toBe(0);
			expect(Ic.getRankPos("a1")).toBe(7);
			expect(Ic.getRankPos("h1")).toBe(7);
			expect(Ic.getRankPos([4, 3])).toBe(4);
			expect(Ic.getRankPos([3, 4])).toBe(3);
			expect(Ic.getRankPos([3, 3])).toBe(3);
			expect(Ic.getRankPos([4, 4])).toBe(4);
			expect(Ic.getRankPos([2, 6])).toBe(2);
			expect(Ic.getRankPos([6, 2])).toBe(6);
			expect(Ic.getRankPos([2, 2])).toBe(2);
			expect(Ic.getRankPos([6, 6])).toBe(6);
			expect(Ic.getRankPos([false, false])).toBe(0);
			expect(Ic.getRankPos([false, true])).toBe(0);
			expect(Ic.getRankPos([true, false])).toBe(1);
			expect(Ic.getRankPos([true, true])).toBe(1);
			expect(Ic.getRankPos("A1")).toBe(7);
			expect(Ic.getRankPos("B2")).toBe(6);
			expect(Ic.getRankPos("C3")).toBe(5);
			expect(Ic.getRankPos("D4")).toBe(4);
			expect(Ic.getRankPos("E5")).toBe(3);
			expect(Ic.getRankPos("F6")).toBe(2);
			expect(Ic.getRankPos("G7")).toBe(1);
			expect(Ic.getRankPos("H8")).toBe(0);
		});
		
		test("square input", () => {
			var square_e7;
			
			square_e7=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]);
			
			expect(Ic.getRankPos(square_e7)).toBe(1);
		});
	});
	
	describe("Ic.getFilePos()", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_squares.length; i<len; i++){//0<len
				expect(Ic.getFilePos(bad_shared_squares[i])).toBeNull();
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.getFilePos([0, 0])).toBe(0);
			expect(Ic.getFilePos([0, 7])).toBe(7);
			expect(Ic.getFilePos([7, 0])).toBe(0);
			expect(Ic.getFilePos([7, 7])).toBe(7);
			expect(Ic.getFilePos("a8")).toBe(0);
			expect(Ic.getFilePos("h8")).toBe(7);
			expect(Ic.getFilePos("a1")).toBe(0);
			expect(Ic.getFilePos("h1")).toBe(7);
			expect(Ic.getFilePos([4, 3])).toBe(3);
			expect(Ic.getFilePos([3, 4])).toBe(4);
			expect(Ic.getFilePos([3, 3])).toBe(3);
			expect(Ic.getFilePos([4, 4])).toBe(4);
			expect(Ic.getFilePos([2, 6])).toBe(6);
			expect(Ic.getFilePos([6, 2])).toBe(2);
			expect(Ic.getFilePos([2, 2])).toBe(2);
			expect(Ic.getFilePos([6, 6])).toBe(6);
			expect(Ic.getFilePos([false, false])).toBe(0);
			expect(Ic.getFilePos([false, true])).toBe(1);
			expect(Ic.getFilePos([true, false])).toBe(0);
			expect(Ic.getFilePos([true, true])).toBe(1);
			expect(Ic.getFilePos("A1")).toBe(0);
			expect(Ic.getFilePos("B2")).toBe(1);
			expect(Ic.getFilePos("C3")).toBe(2);
			expect(Ic.getFilePos("D4")).toBe(3);
			expect(Ic.getFilePos("E5")).toBe(4);
			expect(Ic.getFilePos("F6")).toBe(5);
			expect(Ic.getFilePos("G7")).toBe(6);
			expect(Ic.getFilePos("H8")).toBe(7);
		});
		
		test("square input", () => {
			var square_e7;
			
			square_e7=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]);
			
			expect(Ic.getFilePos(square_e7)).toBe(4);
		});
	});
	
	describe("Ic.getRankBos()", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_squares.length; i<len; i++){//0<len
				expect(Ic.getRankBos(bad_shared_squares[i])).toBeNull();
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.getRankBos([0, 0])).toBe("8");
			expect(Ic.getRankBos([0, 7])).toBe("8");
			expect(Ic.getRankBos([7, 0])).toBe("1");
			expect(Ic.getRankBos([7, 7])).toBe("1");
			expect(Ic.getRankBos("a8")).toBe("8");
			expect(Ic.getRankBos("h8")).toBe("8");
			expect(Ic.getRankBos("a1")).toBe("1");
			expect(Ic.getRankBos("h1")).toBe("1");
			expect(Ic.getRankBos([4, 3])).toBe("4");
			expect(Ic.getRankBos([3, 4])).toBe("5");
			expect(Ic.getRankBos([3, 3])).toBe("5");
			expect(Ic.getRankBos([4, 4])).toBe("4");
			expect(Ic.getRankBos([2, 6])).toBe("6");
			expect(Ic.getRankBos([6, 2])).toBe("2");
			expect(Ic.getRankBos([2, 2])).toBe("6");
			expect(Ic.getRankBos([6, 6])).toBe("2");
			expect(Ic.getRankBos([false, false])).toBe("8");
			expect(Ic.getRankBos([false, true])).toBe("8");
			expect(Ic.getRankBos([true, false])).toBe("7");
			expect(Ic.getRankBos([true, true])).toBe("7");
			expect(Ic.getRankBos("A1")).toBe("1");
			expect(Ic.getRankBos("B2")).toBe("2");
			expect(Ic.getRankBos("C3")).toBe("3");
			expect(Ic.getRankBos("D4")).toBe("4");
			expect(Ic.getRankBos("E5")).toBe("5");
			expect(Ic.getRankBos("F6")).toBe("6");
			expect(Ic.getRankBos("G7")).toBe("7");
			expect(Ic.getRankBos("H8")).toBe("8");
		});
		
		test("square input", () => {
			var square_e7;
			
			square_e7=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]);
			
			expect(Ic.getRankBos(square_e7)).toBe("7");
		});
	});
	
	describe("Ic.getFileBos()", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_squares.length; i<len; i++){//0<len
				expect(Ic.getFileBos(bad_shared_squares[i])).toBeNull();
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.getFileBos([0, 0])).toBe("a");
			expect(Ic.getFileBos([0, 7])).toBe("h");
			expect(Ic.getFileBos([7, 0])).toBe("a");
			expect(Ic.getFileBos([7, 7])).toBe("h");
			expect(Ic.getFileBos("a8")).toBe("a");
			expect(Ic.getFileBos("h8")).toBe("h");
			expect(Ic.getFileBos("a1")).toBe("a");
			expect(Ic.getFileBos("h1")).toBe("h");
			expect(Ic.getFileBos([4, 3])).toBe("d");
			expect(Ic.getFileBos([3, 4])).toBe("e");
			expect(Ic.getFileBos([3, 3])).toBe("d");
			expect(Ic.getFileBos([4, 4])).toBe("e");
			expect(Ic.getFileBos([2, 6])).toBe("g");
			expect(Ic.getFileBos([6, 2])).toBe("c");
			expect(Ic.getFileBos([2, 2])).toBe("c");
			expect(Ic.getFileBos([6, 6])).toBe("g");
			expect(Ic.getFileBos([false, false])).toBe("a");
			expect(Ic.getFileBos([false, true])).toBe("b");
			expect(Ic.getFileBos([true, false])).toBe("a");
			expect(Ic.getFileBos([true, true])).toBe("b");
			expect(Ic.getFileBos("A1")).toBe("a");
			expect(Ic.getFileBos("B2")).toBe("b");
			expect(Ic.getFileBos("C3")).toBe("c");
			expect(Ic.getFileBos("D4")).toBe("d");
			expect(Ic.getFileBos("E5")).toBe("e");
			expect(Ic.getFileBos("F6")).toBe("f");
			expect(Ic.getFileBos("G7")).toBe("g");
			expect(Ic.getFileBos("H8")).toBe("h");
		});
		
		test("square input", () => {
			var square_e7;
			
			square_e7=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]);
			
			expect(Ic.getFileBos(square_e7)).toBe("e");
		});
	});
	
	describe("Ic.isInsideBoard()", () => {
		test("default value", () => {
			var i, len, default_val;
			
			default_val=false;
			
			for(i=0, len=bad_shared_squares.length; i<len; i++){//0<len
				expect(Ic.isInsideBoard(bad_shared_squares[i])).toBe(default_val);
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.isInsideBoard([0, 0])).toBe(true);
			expect(Ic.isInsideBoard([0, 7])).toBe(true);
			expect(Ic.isInsideBoard([7, 0])).toBe(true);
			expect(Ic.isInsideBoard([7, 7])).toBe(true);
			expect(Ic.isInsideBoard("a8")).toBe(true);
			expect(Ic.isInsideBoard("h8")).toBe(true);
			expect(Ic.isInsideBoard("a1")).toBe(true);
			expect(Ic.isInsideBoard("h1")).toBe(true);
			expect(Ic.isInsideBoard([4, 3])).toBe(true);
			expect(Ic.isInsideBoard([3, 4])).toBe(true);
			expect(Ic.isInsideBoard([3, 3])).toBe(true);
			expect(Ic.isInsideBoard([4, 4])).toBe(true);
			expect(Ic.isInsideBoard([2, 6])).toBe(true);
			expect(Ic.isInsideBoard([6, 2])).toBe(true);
			expect(Ic.isInsideBoard([2, 2])).toBe(true);
			expect(Ic.isInsideBoard([6, 6])).toBe(true);
			expect(Ic.isInsideBoard([false, false])).toBe(true);
			expect(Ic.isInsideBoard([false, true])).toBe(true);
			expect(Ic.isInsideBoard([true, false])).toBe(true);
			expect(Ic.isInsideBoard([true, true])).toBe(true);
			expect(Ic.isInsideBoard("A1")).toBe(true);
			expect(Ic.isInsideBoard("B2")).toBe(true);
			expect(Ic.isInsideBoard("C3")).toBe(true);
			expect(Ic.isInsideBoard("D4")).toBe(true);
			expect(Ic.isInsideBoard("E5")).toBe(true);
			expect(Ic.isInsideBoard("F6")).toBe(true);
			expect(Ic.isInsideBoard("G7")).toBe(true);
			expect(Ic.isInsideBoard("H8")).toBe(true);
		});
		
		test("square input", () => {
			var square_e7;
			
			square_e7=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]);
			
			expect(Ic.isInsideBoard(square_e7)).toBe(true);
		});
	});
	
	describe("Ic.sameSquare()", () => {
		test("normal inputs", () => {
			expect(Ic.sameSquare("d2", [6, 3])).toBe(true);
			expect(Ic.sameSquare("a1", "A1")).toBe(true);
			expect(Ic.sameSquare("zz", [0, 0])).toBe(false);
			expect(Ic.sameSquare("z2", [6, 0])).toBe(false);
			expect(Ic.sameSquare("a8", [-99, 0])).toBe(false);
			expect(Ic.sameSquare("b1", [99, 1])).toBe(false);
			expect(Ic.sameSquare("h1", [99, 99])).toBe(false);
			expect(Ic.sameSquare("h8", [0, 99])).toBe(false);
			expect(Ic.sameSquare("z9", "z9")).toBe(false);
			expect(Ic.sameSquare(null, null)).toBe(false);
		});
		
		test("boolean pos", () => {
			var i, len, arr, arr2;
			
			arr=[[true, true], [true, false], [false, true], [false, false]];
			arr2=[[1, 1], [1, 0], [0, 1], [0, 0]];
			
			for(i=0, len=arr.length; i<len; i++){//0<len
				expect(Ic.sameSquare(arr[i], arr2[i])).toBe(true);
			}
		});
		
		test("p-p, p-b, b-p, b-b", () => {
			var w, x, y, z, len, arr;
			
			arr=[0, 1, 2, 3, 4, 5, 6, 7];
			len=arr.length;
			
			for(w=0; w<len; w++){//0<len
				for(x=0; x<len; x++){//0<len
					for(y=0; y<len; y++){//0<len
						for(z=0; z<len; z++){//0<len
							//pos, pos
							expect(Ic.sameSquare([arr[w], arr[x]], [arr[y], arr[z]])).toBe(arr[w]===arr[y] && arr[x]===arr[z]);
							
							//pos, bos
							expect(Ic.sameSquare([arr[w], arr[x]], Ic.toBos([arr[y], arr[z]]))).toBe(arr[w]===arr[y] && arr[x]===arr[z]);
							
							//bos, pos
							expect(Ic.sameSquare(Ic.toBos([arr[w], arr[x]]), [arr[y], arr[z]])).toBe(arr[w]===arr[y] && arr[x]===arr[z]);
							
							//bos, bos
							expect(Ic.sameSquare(Ic.toBos([arr[w], arr[x]]), Ic.toBos([arr[y], arr[z]]))).toBe(arr[w]===arr[y] && arr[x]===arr[z]);
						}
					}
				}
			}
		});
		
		test("square input", () => {
			var square_e7;
			
			square_e7=Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]);
			
			expect(Ic.sameSquare(square_e7, "e7")).toBe(true);
		});
	});
	
	test("Ic.countPieces()", () => {
		expect(Ic.countPieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toEqual({w:{p:8, n:2, b:2, r:2, q:1, k:1}, b:{p:8, n:2, b:2, r:2, q:1, k:1}});
		
		expect(Ic.countPieces("1n1Rkb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/2K5 b k - 1 17")).toEqual({w:{p:7, n:0, b:1, r:1, q:0, k:1}, b:{p:5, n:1, b:1, r:1, q:1, k:1}});
		
		expect(Ic.countPieces("rnbqkbnr/p1pp2pp/p3p3/5P2/1P6/8/P1PP1PPP/RNBQK1NR b KQkq b3 0 4")).toEqual({w:{p:8, n:2, b:1, r:2, q:1, k:1}, b:{p:7, n:2, b:2, r:2, q:1, k:1}});
		
		expect(Ic.countPieces(" rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 ")).toEqual({w:{p:8, n:2, b:2, r:2, q:1, k:1}, b:{p:8, n:2, b:2, r:2, q:1, k:1}});
		
		expect(Ic.countPieces("badFenGetsParsedAnyway up until first space")).toEqual({w:{p:1, n:0, b:0, r:0, q:0, k:0}, b:{p:0, n:2, b:1, r:1, q:0, k:0}});
		
		expect(Ic.countPieces("BBBBBBBBBBBBBBBBBBBbBpPpb nNkK")).toEqual({w:{p:1, n:0, b:20, r:0, q:0, k:0}, b:{p:2, n:0, b:2, r:0, q:0, k:0}});
	});
	
	describe("Ic.initBoard()", () => {
		var board_name, other_board_name;
		
		board_name="board_init";
		other_board_name="board_init_other";
		
		test("init from missing optional clocks", () => {
			var board_obj;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "8/r6k/8/8/8/R6K/8/8 w - -",
				isHidden : true,
				validOrBreak : true
			});
			
			expect(board_obj.fen).toBe("8/r6k/8/8/8/R6K/8/8 w - - 0 1");
		});
		
		test("original board is overwritten by valid fen and old references still point to the same board", () => {
			var temp;
			
			temp=Ic.getBoard(board_name);
			expect(temp.fen).toBe("8/r6k/8/8/8/R6K/8/8 w - - 0 1");
			
			Ic.initBoard({
				boardName : board_name,
				fen : "8/1r5k/8/8/8/1R5K/8/8 w - - 0 1",
				isHidden : true,
				validOrBreak : true
			});
			
			expect(temp.fen).toBe("8/1r5k/8/8/8/1R5K/8/8 w - - 0 1");
			expect(Ic.getBoard(board_name).fen).toBe("8/1r5k/8/8/8/1R5K/8/8 w - - 0 1");
		});
		
		test("original board is not overwritten by invalid fen and null is returned (validOrBreak=true)", () => {
			var board_obj;
			
			Ic.setSilentMode(true);
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "0invalidfen0",
				isHidden : true,
				validOrBreak : true
			});
			
			Ic.setSilentMode(false);
			
			expect(Ic.getBoard(board_name).fen).toBe("8/1r5k/8/8/8/1R5K/8/8 w - - 0 1");
			expect(board_obj).toBeNull();
		});
		
		test("original board is not overwritten by creating other board", () => {
			Ic.initBoard({
				boardName : other_board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				isHidden : true,
				validOrBreak : true
			});
			
			expect(Ic.getBoard(board_name).fen).toBe("8/1r5k/8/8/8/1R5K/8/8 w - - 0 1");
		});
		
		test("original board is overwritten to default fen by invalid fen (validOrBreak=false)", () => {
			var board_obj;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "0invalidfen0",
				isHidden : true
			});
			
			expect(Ic.getBoard(board_name).fen).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
			expect(board_obj).not.toBeNull();
		});
		
		test("initing from a PGN (complete) (default fen=true) (validOrBreak=true)", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]

1. Nf3 Nc6 2. a4`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn,
				validOrBreak : true
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("r1bqkbnr/pppppppp/2n5/8/P7/5N2/1PPPPPPP/RNBQKB1R b KQkq a3 0 2");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
		});
		
		test("initing from a PGN (complete) (default fen=true) (validOrBreak=false)", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]

1. Nf3 Nc6 2. a4`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("r1bqkbnr/pppppppp/2n5/8/P7/5N2/1PPPPPPP/RNBQKB1R b KQkq a3 0 2");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
		});
		
		test("initing from a PGN (partial) (default fen=true) (validOrBreak=true)", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]

1. Nf3 Xc6 2. a4`;
			
			Ic.setSilentMode(true);
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn,
				validOrBreak : true
			});
			
			Ic.setSilentMode(false);
			
			expect(board_obj).toBeNull();
		});
		
		test("initing from a PGN (partial) (default fen=true) (validOrBreak=false)", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]

1. Nf3 Xc6 2. a4`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
		});
		
		test("initing from a PGN (complete) (default fen=false) (validOrBreak=true)", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]
[SetUp "1"]
[FEN "rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3"]

3...Nc6 4. Nf3 Rb8`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn,
				validOrBreak : true
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("1rbqkbn1/ppppppp1/2n4r/P6p/8/2N2N2/1PPPPPPP/R1BQKB1R w KQ - 5 5");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3");
		});
		
		test("initing from a PGN (complete) (default fen=false) (validOrBreak=false)", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]
[SetUp "1"]
[FEN "rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3"]

3...Nc6 4. Nf3 Rb8`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("1rbqkbn1/ppppppp1/2n4r/P6p/8/2N2N2/1PPPPPPP/R1BQKB1R w KQ - 5 5");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3");
		});
		
		test("initing from a PGN (partial) (default fen=false) (validOrBreak=true)", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]
[SetUp "1"]
[FEN "rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3"]

3...Nc6 4. Xf3 Rb8`;
			
			Ic.setSilentMode(true);
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn,
				validOrBreak : true
			});
			
			Ic.setSilentMode(false);
			
			expect(board_obj).toBeNull();
		});
		
		test("initing from a PGN (partial) (default fen=false) (validOrBreak=false)", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]
[SetUp "1"]
[FEN "rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3"]

3...Nc6 4. Xf3 Rb8`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("r1bqkbn1/ppppppp1/2n4r/P6p/8/2N5/1PPPPPPP/R1BQKBNR w KQq - 3 4");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3");
		});
		
		test("initing from a PGN, using the fen property instead of a pgn tag", () => {
			var board_obj, game_pgn;
			
			game_pgn=`3...Nc6 4. Nf3 Rb8`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3",
				pgn : game_pgn
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("1rbqkbn1/ppppppp1/2n4r/P6p/8/2N2N2/1PPPPPPP/R1BQKB1R w KQ - 5 5");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3");
		});
		
		test("initing from a PGN, the fen property should take precedence over a pgn tag", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]
[SetUp "1"]
[FEN "rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3"]

3...Nc6 4. Nf3 Rb8`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "rnbqkbn1/ppppppp1/7r/7p/P7/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3",
				pgn : game_pgn
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("1rbqkbn1/ppppppp1/2n4r/7p/P7/2N2N2/1PPPPPPP/R1BQKB1R w KQ - 5 5");
			expect(board_obj.fen).not.toBe("1rbqkbn1/ppppppp1/2n4r/P6p/8/2N2N2/1PPPPPPP/R1BQKB1R w KQ - 5 5");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbn1/ppppppp1/7r/7p/P7/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3");
			expect(board_obj.fen).not.toBe("rnbqkbn1/ppppppp1/7r/P6p/8/2N5/1PPPPPPP/R1BQKBNR b KQq - 2 3");
		});
		
		test("initing from a sloppy PGN", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]
[SetUp "1"]
[FEN "rnbqkbnr/pp2pppp/2p5/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3"]

3... cxd5 00400. c4 {	Later in "quote" i'm: 3 exd5 cxd5
is another player x before anyone had heard of x! 	} 4...Ng8f6 5. N1c3 Nbc6 6. Ng1f3 Bg4 7. cxd5
Nxd5+- 8.Bb5 Qa5-+ 9. Qb3 {!} 9. ... Bxf3 10. gxf3 Nxc3 11. Bxc6+ {? It
was Alekhine that improved with 11 bxc3 e6 12 d5! } 11 ... bxc6 12. Qb7 {?} Nd5+
13. Bd2 Qb6 {!} 14. Qxa8+ Kd7 15. 0 - 0 {If 15 a4 Nc7 16 a5 Qxb2
17 Qxa7 Qxa1+ } 15 . ...Nc7 16. Ba5 Nxa8 17. Bxb6 Nxb6 18. Rfc1
e6 19. Rc2 Be7 20. Rac1 Bg5 21. Rd1 Rb8 22. Rc5 Nd5 23. Ra5
Rb7 24. Rd3 Bd8 25. Rb3   Rxb3   Rxa7+	 Nc7  -+  axb3 Bf6
28. Rb7   {	If  28  Ra4 Nb5! }  28 ...Bxd4 29. Rb8 Bxb2 30. h3 f5
31. Kf1 Nd5 32. Kg2 +-- Be5 33. Ra8++ Nf4-- 34 . Kh2-+++ Nd3+--- 35 .Kg1--++ Ne1 ++--
366666 ..... Ra7+!? Bc7 o -  1`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn,
				validOrBreak : true
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("8/R1bk2pp/2p1p3/5p2/8/1P3P1P/5P2/4n1K1 w - - 12 37");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbnr/pp2pppp/2p5/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3");
		});
		
		test("initing from a PGN with (%) Escape mechanism", () => {
			var board_obj, game_pgn;
			
			game_pgn=`[Event "test"]
% [SetUp "1"]
% [FEN "rnbqkbnr/2pppppp/p7/Pp6/8/8/RPPPPPPP/1NBQKBNR w Kkq - 0 4"]

1. a4`;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				pgn : game_pgn,
				validOrBreak : true
			});
			
			expect(board_obj).not.toBeNull();
			expect(board_obj.fen).toBe("rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1");
			board_obj.navFirst();
			expect(board_obj.fen).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
		});
	});
	
	describe("Ic.fenApply()", () => {
		test("default value", () => {
			Ic.setSilentMode(true);
			
			expect(Ic.fenApply("0invalidfen0", "legalMoves", ["a2"]).sort()).toEqual([].sort());
			
			expect(Ic.fenApply("0invalidfen0", "legalSanMoves", ["a2"]).sort()).toEqual([].sort());
			
			expect(Ic.fenApply("0invalidfen0", "isLegalMove", ["a2-a3"])).toBe(false);
			
			Ic.setSilentMode(false);
			
			expect(Ic.fenApply("0invalidfen0", "isLegalFen")).toBe(false);
			
			Ic.setSilentMode(true);
			
			expect(Ic.fenApply("0invalidfen0", "getSquare", ["a2"])).toBeNull();
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "0invalidfn0")).toBeNull();
			
			Ic.setSilentMode(false);
		});
		
		describe("isLegalFen", () => {//this belong here (it's not a board method)
			test("default value", () => {
				var i, len, default_val;
				
				default_val=false;
				
				for(i=0, len=bad_shared_fen.length; i<len; i++){//0<len
					expect(Ic.fenApply(bad_shared_fen[i], "isLegalFen")).toBe(default_val);
				}
			});
			
			test("normal inputs", () => {
				expect(Ic.fenApply("8/8/8/8/8/1k6/8/1K1r4 w - - 0 1", "isLegalFen")).toBe(true);
			});
		});
	});
	
	test("Ic.fenGet()", () => {
		Ic.setSilentMode(true);
		
		expect(Ic.fenGet("0invalidfen0", "isCheck")).toBeNull();
		
		expect(Ic.fenGet("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "")).toBeNull();
		
		expect(Ic.fenGet("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "fen 0invalidprop0")).toBeNull();
		
		Ic.setSilentMode(false);
		
		expect(Ic.fenGet("k7/8/KR6/8/8/8/8/8 b - - 0 1", ["isStalemate", "inDraw"])).toEqual({inDraw:true, isStalemate:true});
		
		expect(Ic.fenGet("k7/8/KR6/8/8/8/8/8 b - - 0 1", "isStalemate inDraw")).toEqual({isStalemate:true, inDraw:true});
	});
});
