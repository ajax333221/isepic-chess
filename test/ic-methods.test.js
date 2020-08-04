const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

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
	
	//used in: Ic.toVal(), Ic.toAbsVal(), Ic.toBal(), Ic.toAbsBal(), Ic.toClassName(), Ic.getSign()
	bad_shared_values=["", " ", false, true, , null, ("x"*9), {}, [], [1], [1, 1, 1], "err", 0, -0, "*", "5", "-5", "xx", "XQ", "BX", "BQxyz"];
	
	//used in: Ic.toBos(), Ic.toPos(), Ic.getRankPos(), Ic.getFilePos(), Ic.getRankBos(), Ic.getFileBos(), Ic.isInsideBoard()
	bad_shared_positions=["", " ", false, true, , null, ("x"*9), {}, [], [1], [1, 1, 1], "z1", "z9", "a9", "ABCxyz", 0, 1, 8, Infinity, -Infinity, [3, 8], [8, 3], [8, 8], [3, -1], [-1, 3], [-1, -1]];
	
	describe("Ic.toVal", () => {
		var board_name;
		
		board_name="board_to_val";
		
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
	
	describe("Ic.getSign", () => {
		var board_name;
		
		board_name="board_get_sign";
		
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
		});
		
		test("square input", () => {
			Ic.initBoard({
				boardName : board_name,
				fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.getSign(Ic.selectBoard(board_name).Squares["c8"])).toBe(-1);
		});
	});
	
	describe("Ic.toBos", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_positions.length; i<len; i++){//0<len
				expect(Ic.toBos(bad_shared_positions[i])).toBeNull();
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
	
	describe("Ic.toPos", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_positions.length; i<len; i++){//0<len
				expect(Ic.toPos(bad_shared_positions[i])).toBeNull();
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
	
	describe("Ic.getRankPos", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_positions.length; i<len; i++){//0<len
				expect(Ic.getRankPos(bad_shared_positions[i])).toBeNull();
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
	
	describe("Ic.getFilePos", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_positions.length; i<len; i++){//0<len
				expect(Ic.getFilePos(bad_shared_positions[i])).toBeNull();
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
	
	describe("Ic.getRankBos", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_positions.length; i<len; i++){//0<len
				expect(Ic.getRankBos(bad_shared_positions[i])).toBeNull();
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
	
	describe("Ic.getFileBos", () => {
		test("default value", () => {
			var i, len;
			
			for(i=0, len=bad_shared_positions.length; i<len; i++){//0<len
				expect(Ic.getFileBos(bad_shared_positions[i])).toBeNull();
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
	
	describe("Ic.isInsideBoard", () => {
		test("default value", () => {
			var i, len, default_val;
			
			default_val=false;
			
			for(i=0, len=bad_shared_positions.length; i<len; i++){//0<len
				expect(Ic.isInsideBoard(bad_shared_positions[i])).toBe(default_val);
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
	
	describe("Ic.sameSquare", () => {
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
			var temp;
			
			temp=Ic.initBoard({
				boardName : board_name,
				fen : "8/1r5k/8/8/8/1R5K/8/8 w - - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			expect(Ic.selectBoard(board_name).Fen).toBe("8/1r5k/8/8/8/1R5K/8/8 w - - 0 1");
			expect(temp===Ic.selectBoard(board_name)).toBe(true);
		});
		
		test("original board is not overwritten by invalid fen and null is returned (invalidFenStop=true)", () => {
			var temp;
			
			Ic.setSilentMode(true);
			
			temp=Ic.initBoard({
				boardName : board_name,
				fen : "0invalidfen0",
				isHidden : true,
				invalidFenStop : true
			});
			
			Ic.setSilentMode(false);
			
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
	
	describe("Ic.fenApply", () => {
		describe("legalMoves", () => {
			Ic.setSilentMode(true);
			expect(Ic.mapToBos(Ic.fenApply("0invalidfen0", "legalMoves", ["a2"])).sort()).toEqual([].sort());
			Ic.setSilentMode(false);
			
			expect(Ic.mapToBos(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2"])).sort()).toEqual(["a2", "d2", "b2"].sort());
			
			expect(Ic.mapToBos(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2"])).sort()).toEqual([].sort());
			
			expect(Ic.mapToBos(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"])])).sort()).toEqual(["a3", "a4"].sort());
		});
		
		describe("isLegalMove", () => {
			Ic.setSilentMode(true);
			expect(Ic.fenApply("0invalidfen0", "isLegalMove", ["a2", "a3"])).toBe(false);
			Ic.setSilentMode(false);
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["c2", "a2"])).toBe(true);
			
			expect(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["a2", "c2"])).toBe(false);
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalMove", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"]), Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a4"])])).toBe(true);
		});
		
		describe("isLegalFen", () => {
			Ic.setSilentMode(true);
			
			expect(Ic.fenApply("0invalidfen0", "isLegalFen")).toBe(false);
			
			expect(Ic.fenApply("8/8/8/8/8/1k6/8/1K1r4 w - - 0 1", "isLegalFen")).toBe(true);
			
			expect(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/1P6/1PPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalFen")).toBe(false);
			
			Ic.setSilentMode(false);
		});
		
		describe("getSquare", () => {
			Ic.setSilentMode(true);
			expect(Ic.fenApply("0invalidfen0", "getSquare", ["a2"])).toBeNull();
			Ic.setSilentMode(false);
			
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
	
	describe("Ic.mapToBos", () => {
		expect(Ic.mapToBos([[0, 7], [2, 2]]).sort()).toEqual(["c6", "h8"].sort());
		
		expect(Ic.mapToBos([[1, 1], "a2"]).sort()).toEqual(["a2", "b7"].sort());
		
		expect(Ic.mapToBos([[4, 3], "d4", Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["d4"])]).sort()).toEqual(["d4", "d4", "d4"].sort());
		
		expect(Ic.mapToBos("err").sort()).toEqual([].sort());
	});
});
