const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//cleanSan
//isMove

describe("Ic utility methods", () => {
	test("Ic.utilityMisc.consoleLog()", () => {
		Ic.setSilentMode(true);
		expect(Ic.utilityMisc.consoleLog("this doesn't print because the silent mode")).toBe(false);
		Ic.setSilentMode(false);
		
		//expect(Ic.utilityMisc.consoleLog("this gets printed when not commented out")).toBe(true);
	});
	
	test("Ic.utilityMisc.isObject()", () => {
		expect(Ic.utilityMisc.isObject({})).toBe(true);
		expect(Ic.utilityMisc.isObject({hello:"world"})).toBe(true);
		expect(Ic.utilityMisc.isObject(Ic.fenGet("8/3k4/3p4/8/2P5/2KP4/8/8 w - - 0 1", "squares").squares["c3"])).toBe(true);
		expect(Ic.utilityMisc.isObject({bos : "this technically is a square"})).toBe(true);
		expect(Ic.utilityMisc.isObject(Ic.initBoard())).toBe(true);
		expect(Ic.utilityMisc.isObject({boardName : "this technically is a board"})).toBe(true);
		expect(Ic.utilityMisc.isObject([])).toBe(false);
		expect(Ic.utilityMisc.isObject(["hello", "world", "!"])).toBe(false);
		expect(Ic.utilityMisc.isObject(null)).toBe(false);
	});
	
	test("Ic.utilityMisc.isArray()", () => {
		expect(Ic.utilityMisc.isArray({})).toBe(false);
		expect(Ic.utilityMisc.isArray({hello:"world"})).toBe(false);
		expect(Ic.utilityMisc.isArray(Ic.fenGet("8/3k4/3p4/8/2P5/2KP4/8/8 w - - 0 1", "squares").squares["c3"])).toBe(false);
		expect(Ic.utilityMisc.isArray({bos : "this technically is a square"})).toBe(false);
		expect(Ic.utilityMisc.isArray(Ic.initBoard())).toBe(false);
		expect(Ic.utilityMisc.isArray({boardName : "this technically is a board"})).toBe(false);
		expect(Ic.utilityMisc.isArray([])).toBe(true);
		expect(Ic.utilityMisc.isArray(["hello", "world", "!"])).toBe(true);
		expect(Ic.utilityMisc.isArray(null)).toBe(false);
	});
	
	test("Ic.utilityMisc.isSquare()", () => {
		expect(Ic.utilityMisc.isSquare({})).toBe(false);
		expect(Ic.utilityMisc.isSquare({hello : "world"})).toBe(false);
		expect(Ic.utilityMisc.isSquare(Ic.fenGet("8/3k4/3p4/8/2P5/2KP4/8/8 w - - 0 1", "squares").squares["c3"])).toBe(true);
		expect(Ic.utilityMisc.isSquare({bos : "this technically is a square"})).toBe(true);
		expect(Ic.utilityMisc.isSquare(Ic.initBoard())).toBe(false);
		expect(Ic.utilityMisc.isSquare({boardName : "this technically is a board"})).toBe(false);
		expect(Ic.utilityMisc.isSquare([])).toBe(false);
		expect(Ic.utilityMisc.isSquare(["hello", "world", "!"])).toBe(false);
		expect(Ic.utilityMisc.isSquare(null)).toBe(false);
	});
	
	test("Ic.utilityMisc.isBoard()", () => {
		expect(Ic.utilityMisc.isBoard({})).toBe(false);
		expect(Ic.utilityMisc.isBoard({hello : "world"})).toBe(false);
		expect(Ic.utilityMisc.isBoard(Ic.fenGet("8/3k4/3p4/8/2P5/2KP4/8/8 w - - 0 1", "squares").squares["c3"])).toBe(false);
		expect(Ic.utilityMisc.isBoard({bos : "this technically is a square"})).toBe(false);
		expect(Ic.utilityMisc.isBoard(Ic.initBoard())).toBe(true);
		expect(Ic.utilityMisc.isBoard({boardName : "this technically is a board"})).toBe(true);
		expect(Ic.utilityMisc.isBoard([])).toBe(false);
		expect(Ic.utilityMisc.isBoard(["hello", "world", "!"])).toBe(false);
		expect(Ic.utilityMisc.isBoard(null)).toBe(false);
	});
	
	test("Ic.utilityMisc.trimSpaces()", () => {
		expect(Ic.utilityMisc.trimSpaces("  abc")).toBe("abc");
		expect(Ic.utilityMisc.trimSpaces("abc  ")).toBe("abc");
		expect(Ic.utilityMisc.trimSpaces("a  b  c")).toBe("a b c");
		expect(Ic.utilityMisc.trimSpaces("  a  b c ")).toBe("a b c");
		expect(Ic.utilityMisc.trimSpaces(" ")).toBe("");
		expect(Ic.utilityMisc.trimSpaces("     ")).toBe("");
		expect(Ic.utilityMisc.trimSpaces("")).toBe("");
		expect(Ic.utilityMisc.trimSpaces("x"*9)).toBe("NaN");
		expect(Ic.utilityMisc.trimSpaces()).toBe("undefined");
		expect(Ic.utilityMisc.trimSpaces([, 2, " ", null, "", "  ", Infinity, "  a  b  ", ("x"*9)])).toBe(",2, ,,, ,Infinity, a b ,NaN");
	});
	
	test("Ic.utilityMisc.formatName()", () => {
		expect(Ic.utilityMisc.formatName(" a  Bc ")).toBe("a_Bc");
		expect(Ic.utilityMisc.formatName(" ")).toBe("");
		expect(Ic.utilityMisc.formatName("")).toBe("");
		expect(Ic.utilityMisc.formatName("ñ")).toBe("_");
		expect(Ic.utilityMisc.formatName("ññ")).toBe("_");
		expect(Ic.utilityMisc.formatName("ña")).toBe("_a");
		expect(Ic.utilityMisc.formatName("añ")).toBe("a_");
		expect(Ic.utilityMisc.formatName("_ñañ_")).toBe("_a_");
		expect(Ic.utilityMisc.formatName("ñ_ñañ_ñ")).toBe("_a_");
		expect(Ic.utilityMisc.formatName("a_ñ_a")).toBe("a_a");
	});
	
	test("Ic.utilityMisc.strContains()", () => {
		var str_base;
		
		str_base="abc de -5 6NaNf";
		
		expect(Ic.utilityMisc.strContains("", "a")).toBe(false);
		expect(Ic.utilityMisc.strContains(str_base, "x")).toBe(false);
		expect(Ic.utilityMisc.strContains(str_base, "cd")).toBe(false);
		expect(Ic.utilityMisc.strContains(str_base, "A")).toBe(false);
		expect(Ic.utilityMisc.strContains(str_base, -6)).toBe(false);
		
		expect(Ic.utilityMisc.strContains("", "")).toBe(true);
		expect(Ic.utilityMisc.strContains(str_base, "")).toBe(true);
		expect(Ic.utilityMisc.strContains(str_base, str_base)).toBe(true);
		expect(Ic.utilityMisc.strContains(str_base, "a")).toBe(true);
		expect(Ic.utilityMisc.strContains(str_base, "f")).toBe(true);
		expect(Ic.utilityMisc.strContains(str_base, "c d")).toBe(true);
		expect(Ic.utilityMisc.strContains(str_base, " ")).toBe(true);
		expect(Ic.utilityMisc.strContains(str_base, 5)).toBe(true);
		expect(Ic.utilityMisc.strContains(str_base, -5)).toBe(true);
		expect(Ic.utilityMisc.strContains(str_base, ("x"*9))).toBe(true);
	});
	
	test("Ic.utilityMisc.occurrences()", () => {
		var str_base;
		
		str_base=" ababABA  BABabab ";
		
		expect(Ic.utilityMisc.occurrences(str_base, "")).toBe(0);
		expect(Ic.utilityMisc.occurrences(str_base, " ")).toBe(4);
		expect(Ic.utilityMisc.occurrences(str_base, str_base)).toBe(1);
		expect(Ic.utilityMisc.occurrences("", "a")).toBe(0);
		expect(Ic.utilityMisc.occurrences("", "")).toBe(0);
		expect(Ic.utilityMisc.occurrences(str_base, "x")).toBe(0);
		expect(Ic.utilityMisc.occurrences(str_base, "a")).toBe(4);
		expect(Ic.utilityMisc.occurrences(str_base, "ba")).toBe(2);
		expect(Ic.utilityMisc.occurrences(str_base, "ab")).toBe(4);
		expect(Ic.utilityMisc.occurrences(str_base, "bab")).toBe(2);
		expect(Ic.utilityMisc.occurrences("aAa", "A")).toBe(1);
		expect(Ic.utilityMisc.occurrences("oóo", "ó")).toBe(1);
		expect(Ic.utilityMisc.occurrences("1", 1)).toBe(0);
		expect(Ic.utilityMisc.occurrences(1, "1")).toBe(0);
		expect(Ic.utilityMisc.occurrences(1, 1)).toBe(0);
		expect(Ic.utilityMisc.occurrences(" abc Ddd  eEfFgGhHiIII  jk ", "e|D|k|i|x")).toBe(4);
	});
	
	test("Ic.utilityMisc.toInt()", () => {
		expect(Ic.utilityMisc.toInt(1.1)).toBe(1);
		expect(Ic.utilityMisc.toInt(-1.1)).toBe(-1);
		expect(Ic.utilityMisc.toInt(2, -3, 3)).toBe(2);
		expect(Ic.utilityMisc.toInt(-4, -3, 3)).toBe(-3);
		expect(Ic.utilityMisc.toInt(4, -3, 3)).toBe(3);
		expect(Ic.utilityMisc.toInt(1, 3, -3)).toBe(-3);
		expect(Ic.utilityMisc.toInt(-8, 3, -3)).toBe(-3);
		expect(Ic.utilityMisc.toInt(8, 3, -3)).toBe(-3);
		expect(Ic.utilityMisc.toInt(-5.1, -7, 0)).toBe(-5);
		expect(Ic.utilityMisc.toInt(-9, -7, 0)).toBe(-7);
		expect(Ic.utilityMisc.toInt(9, -7, 0)).toBe(0);
		expect(Ic.utilityMisc.toInt(5.1, 0, 7)).toBe(5);
		expect(Ic.utilityMisc.toInt(-9, 0, 7)).toBe(0);
		expect(Ic.utilityMisc.toInt(9, 0, 7)).toBe(7);
		expect(Ic.utilityMisc.toInt("4.1")).toBe(4);
		expect(Ic.utilityMisc.toInt("-4.1")).toBe(-4);
		expect(Ic.utilityMisc.toInt("x")).toBe(0);
		expect(1/Ic.utilityMisc.toInt(-0)).toBe(Infinity);
		expect(1/Ic.utilityMisc.toInt(0)).toBe(Infinity);
		expect(Ic.utilityMisc.toInt(3, undefined, -5)).toBe(-5);
		expect(Ic.utilityMisc.toInt(-8, undefined, -5)).toBe(-8);
		expect(Ic.utilityMisc.toInt(3, -5, undefined)).toBe(3);
		expect(Ic.utilityMisc.toInt(-8, -5, undefined)).toBe(-5);
		expect(Ic.utilityMisc.toInt(0, "x", 0)).toBe(0);
		expect(Ic.utilityMisc.toInt(-5, "x", 5)).toBe(-5);
		expect(Ic.utilityMisc.toInt(0, 0, "x")).toBe(0);
		expect(Ic.utilityMisc.toInt(5, -5, "x")).toBe(5);
		expect(1/Ic.utilityMisc.toInt(-5, -0, 5)).toBe(Infinity);
		expect(1/Ic.utilityMisc.toInt(5, -5, -0)).toBe(Infinity);
		expect(Ic.utilityMisc.toInt()).toBe(0);
		expect(Ic.utilityMisc.toInt("")).toBe(0);
		expect(Ic.utilityMisc.toInt(false)).toBe(0);
		expect(Ic.utilityMisc.toInt(true)).toBe(1);
	});
	
	describe("Ic.utilityMisc.isIntOrStrInt()", () => {
		expect(Ic.utilityMisc.isIntOrStrInt(0)).toBe(true);
		expect(Ic.utilityMisc.isIntOrStrInt("0")).toBe(true);
		expect(Ic.utilityMisc.isIntOrStrInt(-0)).toBe(true);
		expect(Ic.utilityMisc.isIntOrStrInt("4")).toBe(true);
		expect(Ic.utilityMisc.isIntOrStrInt(-4)).toBe(true);
		expect(Ic.utilityMisc.isIntOrStrInt("-4")).toBe(true);
		expect(Ic.utilityMisc.isIntOrStrInt(4.0)).toBe(true);//4.0===4
		expect(Ic.utilityMisc.isIntOrStrInt(-4.0)).toBe(true);//-4.0===-4
		expect(Ic.utilityMisc.isIntOrStrInt(-Infinity)).toBe(true);
		expect(Ic.utilityMisc.isIntOrStrInt("-Infinity")).toBe(true);
		expect(Ic.utilityMisc.isIntOrStrInt(Infinity)).toBe(true);
		expect(Ic.utilityMisc.isIntOrStrInt("Infinity")).toBe(true);
		
		expect(Ic.utilityMisc.isIntOrStrInt("")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("x")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("x"*9)).toBe(false);//NaN
		expect(Ic.utilityMisc.isIntOrStrInt()).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt(undefined)).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("undefined")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt(true)).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt(false)).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("true")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("false")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("-0")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt(4.1)).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("4.1")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt(-4.1)).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("-4.1")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("4.0")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("-4.0")).toBe(false);
		expect(Ic.utilityMisc.isIntOrStrInt("04")).toBe(false);
	});
	
	describe("Ic.utilityMisc.isNonEmptyStr()", () => {
		expect(Ic.utilityMisc.isNonEmptyStr("a")).toBe(true);
		expect(Ic.utilityMisc.isNonEmptyStr("  ")).toBe(true);
		expect(Ic.utilityMisc.isNonEmptyStr(" ")).toBe(true);
		
		expect(Ic.utilityMisc.isNonEmptyStr("")).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr()).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr(undefined)).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr(true)).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr(false)).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr("x"*9)).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr(0)).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr(4)).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr(-Infinity)).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr(Infinity)).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr([])).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr(["a"])).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr({})).toBe(false);
		expect(Ic.utilityMisc.isNonEmptyStr({a : "a"})).toBe(false);
	});
	
	describe("Ic.utilityMisc.isNonBlankStr()", () => {
		expect(Ic.utilityMisc.isNonBlankStr("a")).toBe(true);
		
		expect(Ic.utilityMisc.isNonBlankStr("  ")).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr(" ")).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr("")).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr()).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr(undefined)).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr(true)).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr(false)).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr("x"*9)).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr(0)).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr(4)).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr(-Infinity)).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr(Infinity)).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr([])).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr(["a"])).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr({})).toBe(false);
		expect(Ic.utilityMisc.isNonBlankStr({a : "a"})).toBe(false);
	});
	
	describe("Ic.utilityMisc.hashCode()", () => {
		test("default value", () => {
			var i, len, arr, default_val;
			
			default_val=0;
			
			arr=["", false, true, , null, ("x"*9), {}, [], [1], [1, 1, 1], 0, 1, 8, -0, -1, -8, Infinity, -Infinity, [3, 8], [8, 3], [8, 8], [3, -1], [-1, 3], [-1, -1]];
			
			for(i=0, len=arr.length; i<len; i++){//0<len
				expect(Ic.utilityMisc.hashCode(arr[i])).toBe(default_val);
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.utilityMisc.hashCode("Aa")).toBe(2112);
			expect(Ic.utilityMisc.hashCode("Aa")).toBe(Ic.utilityMisc.hashCode("BB"));
			expect(Ic.utilityMisc.hashCode(" ")).toBe(32);
		});
	});
	
	test("Ic.utilityMisc.castlingChars()", () => {
		expect(Ic.utilityMisc.castlingChars()).toBe("");
		expect(Ic.utilityMisc.castlingChars(-9)).toBe("");
		expect(Ic.utilityMisc.castlingChars("-1")).toBe("");
		expect(Ic.utilityMisc.castlingChars(false)).toBe("");
		
		expect(Ic.utilityMisc.castlingChars(0)).toBe("");
		expect(Ic.utilityMisc.castlingChars(1)).toBe("k");
		expect(Ic.utilityMisc.castlingChars(2)).toBe("q");
		expect(Ic.utilityMisc.castlingChars(3)).toBe("kq");
		
		expect(Ic.utilityMisc.castlingChars(9)).toBe("kq");
		expect(Ic.utilityMisc.castlingChars("1")).toBe("k");
		expect(Ic.utilityMisc.castlingChars(true)).toBe("k");
	});
	
	describe("Ic.utilityMisc.unreferenceP()", () => {
		test("default value", () => {
			var i, len, arr, default_val;
			
			default_val={};
			
			arr=["", false, true, , null, ("x"*9), {}, [], [1], [1, 1, 1], 0, 1, 8, -0, -1, -8, Infinity, -Infinity, [3, 8], [8, 3], [8, 8], [3, -1], [-1, 3], [-1, -1]];
			
			for(i=0, len=arr.length; i<len; i++){//0<len
				Ic.setSilentMode(true);
				expect(Ic.utilityMisc.unreferenceP(arr[i])).toEqual(default_val);
				Ic.setSilentMode(false);
			}
		});
		
		test("normal inputs", () => {
			expect(Ic.utilityMisc.unreferenceP({}, [["henlo", "frend"]])).toEqual({henlo : "frend"});
			expect(Ic.utilityMisc.unreferenceP({henlo : "worlmnd"}, [["henlo", "frend"]])).toEqual({henlo : "frend"});
			expect(Ic.utilityMisc.unreferenceP({a : "x"}, [["a", "y"], ["a", "z"]])).toEqual({a : "z"});
			
			Ic.setSilentMode(true);
			expect(Ic.utilityMisc.unreferenceP({henlo : "worlmnd", other : true, unchanged : 3}, [["henlo", "frend"], ["three", "get", "skipped"], ["other", false]])).toEqual({henlo : "frend", other : false, unchanged : 3});
			Ic.setSilentMode(false);
		});
	});
	
	describe("Ic.utilityMisc.cloneBoardObjs()", () => {
		var board_name, other_board_name, board_obj, board_other;
		
		board_name="board_clone_board_objs";
		other_board_name="board_clone_board_objs_other";
		
		board_obj=Ic.initBoard({
			boardName : board_name,
			fen : "r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 2 2"
		});
		
		board_other=Ic.initBoard({
			boardName : other_board_name,
			fen : "r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 2 2"
		});
		
		board_obj.playMove("c3-e4");
		
		board_other.playMove("g2-g3");
		board_other.playMove("h7-h6");
		board_other.playMove("f1-g2");
		board_other.playMove("h6-h5");
		board_other.playMove("g2-e4");
		
		Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
		
		expect(board_other.moveList[1].san).toBe("Ne4");
		expect(!!board_other.moveList[2]).toBe(false);
		expect(board_other.getSquare("e4").val).toBe(2);
		
		Ic.utilityMisc.cloneBoardObjs(board_other, board_other);
		
		expect(board_other.isEqualBoard(board_obj)).toBe(true);
		
		board_other.playMove("g7-g5");
		board_other.playMove("e4-g5");
		board_other.playMove("e7-e5");
		board_other.playMove("e2-e4");
		board_other.playMove("d8-g5");
		board_other.playMove("d2-d3");
		board_other.playMove("g5-c1");
		
		expect(board_other.w.materialDiff).toEqual([1]);
		expect(board_other.b.materialDiff).toEqual([-2, -3]);
		
		Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
		
		//if we go back to push them one by one and forget to start with a [],
		//then shorter arrays won't overwrite larger arrays properly
		expect(board_other.w.materialDiff).toEqual([]);
		expect(board_other.b.materialDiff).toEqual([]);
		
		board_obj.w.materialDiff.push(5);
		board_obj.b.materialDiff.push(-5);
		
		//missing materialDiff.slice(0) binds the two references
		expect(board_other.w.materialDiff).toEqual([]);
		expect(board_other.b.materialDiff).toEqual([]);
		expect(board_other.w.materialDiff).not.toEqual([5]);
		expect(board_other.b.materialDiff).not.toEqual([-5]);
		
		board_obj.w.materialDiff.pop();
		board_obj.b.materialDiff.pop();
	});
	
	describe("Ic.utilityMisc.basicFenTest()", () => {
		describe("Error type: 0", () => {
			var len, error_msg;
			
			error_msg="Error [0]";
			len=error_msg.length;
			
			test("falsy after trim", () => {
				expect(Ic.utilityMisc.basicFenTest("").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest(" ").substring(0, len)).toBe(error_msg);
			});
		});
		
		describe("Error type: 1", () => {
			var len, error_msg;
			
			error_msg="Error [1]";
			len=error_msg.length;
			
			test("color need to be w or b", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR W KQkq - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR B KQkq - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq - 0 1").substring(0, len)).toBe(error_msg);
			});
			
			test("castling", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqkq - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQKQ - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w QKqk - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - 0 1").substring(0, len)).toBe(error_msg);
			});
			
			test("wrong piece char", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/xppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ - 0 1").substring(0, len)).toBe(error_msg);
			});
			
			test("pawns on promotion rank", () => {
				expect(Ic.utilityMisc.basicFenTest("P7/8/7K/8/8/7k/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest("p7/8/7K/8/8/7k/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest("8/8/7K/8/8/7k/8/P7 b - - 0 1").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest("8/8/7K/8/8/7k/8/p7 b - - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("P7/8/7K/8/8/7k/8/p7 b - - 0 1").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest("p7/8/7K/8/8/7k/8/P7 b - - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("P7/8/7K/8/8/7k/8/P7 b - - 0 1").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest("p7/8/7K/8/8/7k/8/p7 b - - 0 1").substring(0, len)).toBe(error_msg);
			});
			
			test("bad enpassant square", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d2 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d4 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d7 0 2").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d5 0 2").substring(0, len)).toBe(error_msg);
			});
			
			test("one white space missing", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNRw KQkq - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR wKQkq - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq- 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -0 1").substring(0, len)).toBe(error_msg);
			});
		});
		
		describe("Error type: 2", () => {
			var len, error_msg;
			
			error_msg="Error [2]";
			len=error_msg.length;
			
			test("full move at 0", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0").substring(0, len)).toBe(error_msg);
			});
			
			test("half move with 0X", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 01 1").substring(0, len)).toBe(error_msg);
			});
			
			test("full move with 0X", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 2 02").substring(0, len)).toBe(error_msg);
			});
			
			test("half move non numeric", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - a 1").substring(0, len)).toBe(error_msg);
			});
			
			test("full move non numeric", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 1 a").substring(0, len)).toBe(error_msg);
			});
		});
		
		describe("Error type: 3", () => {
			var len, error_msg;
			
			error_msg="Error [3]";
			len=error_msg.length;
			
			test("consecutive numbers", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/44/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("8/8/1K51/8/8/7k/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("8/8/K32P1/8/8/7k/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("8/8/61K/8/8/7k/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
			});
		});
		
		describe("Error type: 4", () => {
			var len, error_msg;
			
			error_msg="Error [4]";
			len=error_msg.length;
			
			test("not exactly 8 columns", () => {
				expect(Ic.utilityMisc.basicFenTest("rnbqkbn1/ppppppppr/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("rnbqkbn1/3r3/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("R7R/8/K7/8/8/7k/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("8/8/K8/8/8/7k/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("8/8/8K/8/8/7k/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
			});
		});
		
		describe("Error type: 5", () => {
			var len, error_msg;
			
			error_msg="Error [5]";
			len=error_msg.length;
			
			test("missing wk", () => {
				expect(Ic.utilityMisc.basicFenTest("8/8/8/8/8/8/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
				
				expect(Ic.utilityMisc.basicFenTest("k7/8/8/8/8/8/8/8 w - - 0 1").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest("8/7k/8/8/8/8/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
			});
			
			test("more than one wk", () => {
				expect(Ic.utilityMisc.basicFenTest("K6K/8/8/8/8/8/8/k7 w - - 0 1").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest("8/K6K/8/8/8/7k/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
			});
		});
		
		describe("Error type: 6", () => {
			var len, error_msg;
			
			error_msg="Error [6]";
			len=error_msg.length;
			
			test("missing bk", () => {
				expect(Ic.utilityMisc.basicFenTest("K7/8/8/8/8/8/8/8 w - - 0 1").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest("8/7K/8/8/8/8/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
			});
			
			test("more than one bk", () => {
				expect(Ic.utilityMisc.basicFenTest("k6k/8/8/8/8/8/8/K7 w - - 0 1").substring(0, len)).toBe(error_msg);
				expect(Ic.utilityMisc.basicFenTest("8/k6k/8/8/8/7K/8/8 b - - 0 1").substring(0, len)).toBe(error_msg);
			});
		});
	});
	
	describe("Ic.utilityMisc.perft()", () => {
		var current_fen;
		
		current_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 0, 1)).toBe(1);
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 1, 1)).toBe(20);
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 2, 1)).toBe(400);
		//depth=3 ... toBe(8902) ... [v5.4.1 = passed]
		//depth=4 ... toBe(197281) ... [v5.4.1 = passed]
		//depth=5 ... toBe(4865609) ... [untested]
		
		current_fen="r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 0, 1)).toBe(1);
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 1, 1)).toBe(48);
		//depth=2 ... toBe(2039) ... [v5.4.1 = passed]
		//depth=3 ... toBe(97862) ... [v5.4.1 = passed]
		//depth=4 ... toBe(4085603) ... [untested]
		
		current_fen="8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1";
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 0, 1)).toBe(1);
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 1, 1)).toBe(14);
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 2, 1)).toBe(191);
		//depth=3 ... toBe(2812) ... [v5.4.1 = passed]
		//depth=4 ... toBe(43238) ... [v5.4.1 = passed]
		//depth=5 ... toBe(674624) ... [untested]
		
		current_fen="r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 0, 1)).toBe(1);
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 1, 1)).toBe(46);
		//depth=2 ... toBe(2079) ... [v5.4.1 = passed]
		//depth=3 ... toBe(89890) ... [v5.4.1 = passed]
		//depth=4 ... toBe(3894594) ... [untested]
		
		current_fen="rnbqk1nr/p1pp1ppp/1p6/2b1p1B1/8/1QPP4/PP2PPPP/RN2KBNR b KQkq - 2 4";
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 0, 1)).toBe(1);
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 1, 1)).toBe(31);
		expect(Ic.utilityMisc.perft(Ic.initBoard({fen : current_fen}), 2, 1)).toBe(1116);
		//depth=3 ... toBe(33828) ... [v5.4.1 = passed]
		//depth=4 ... toBe(1184142) ... [untested]
	});
});
