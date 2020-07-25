//---to do:
//
//initBoard
//getBoardNames
//setSilentMode
//boardExists (+ que deje igual silent mode)
//selectBoard
//removeBoard (si se le pasaba undefined crasheaba, pero se arreglo)
//isEqualBoard
//cloneBoard
//fenGet (pero solo invalid board, properties, etc)

function fnIcToVal(){
	var board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_toVal";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.toVal("b")!==-3){
			error_msg="Error [0] b !== -3";
		}
	//}
	
	if(!error_msg){
		if(Ic.toVal("K")!==6){
			error_msg="Error [1] K !== 6";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("*")!==0){
			error_msg="Error [2] * !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal(-5)!==-5){
			error_msg="Error [3] -5 !== -5";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("bq")!==-5){
			error_msg="Error [4] bq !== -5";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("err")!==0){
			error_msg="Error [5] err !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal(99)!==6){
			error_msg="Error [6] 99 !== 6";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal(-99)!==-6){
			error_msg="Error [7] -99 !== -6";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal(-0)!==0){
			error_msg="Error [8] -0 !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("5")!==0){
			error_msg="Error [9] 5 !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("-5")!==0){
			error_msg="Error [10] -5 !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("xx")!==0){
			error_msg="Error [11] xx !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("XQ")!==0){
			error_msg="Error [12] XQ !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("BX")!==0){
			error_msg="Error [13] BX !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("BQ")!==-5){
			error_msg="Error [14] BQ !== -5";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [15] failed to initBoard("+board_name+")";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal(board.Squares["c8"])!==-6){
			error_msg="Error [16] square(c8) !== -6";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.toVal()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToAbsVal(){
	var board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_toAbsVal";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.toAbsVal("b")!==3){
			error_msg="Error [0] b !== 3";
		}
	//}
	
	if(!error_msg){
		if(Ic.toAbsVal("K")!==6){
			error_msg="Error [1] K !== 6";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("*")!==0){
			error_msg="Error [2] * !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal(-5)!==5){
			error_msg="Error [3] -5 !== 5";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("bq")!==5){
			error_msg="Error [4] bq !== 5";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("err")!==0){
			error_msg="Error [5] err !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal(99)!==6){
			error_msg="Error [6] 99 !== 6";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal(-99)!==6){
			error_msg="Error [7] -99 !== 6";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal(-0)!==0){
			error_msg="Error [8] -0 !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("5")!==0){
			error_msg="Error [9] 5 !== 0";
		}
	}

	if(!error_msg){
		if(Ic.toAbsVal("-5")!==0){
			error_msg="Error [10] -5 !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("xx")!==0){
			error_msg="Error [11] xx !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("XQ")!==0){
			error_msg="Error [12] XQ !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("BX")!==0){
			error_msg="Error [13] BX !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("BQ")!==5){
			error_msg="Error [14] BQ !== 5";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [15] failed to initBoard("+board_name+")";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal(board.Squares["c8"])!==6){
			error_msg="Error [16] square(c8) !== 6";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.toAbsVal()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToBal(){
	var board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_toBal";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.toBal(-3)!=="b"){
			error_msg="Error [0] -3 !== b";
		}
	//}
	
	if(!error_msg){
		if(Ic.toBal(6)!=="K"){
			error_msg="Error [1] 6 !== K";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal(0)!=="*"){
			error_msg="Error [2] 0 !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("q")!=="q"){
			error_msg="Error [3] q !== q";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("bq")!=="q"){
			error_msg="Error [4] bq !== q";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("err")!=="*"){
			error_msg="Error [5] err !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal(99)!=="K"){
			error_msg="Error [6] 99 !== K";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal(-99)!=="k"){
			error_msg="Error [7] -99 !== k";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal(-0)!=="*"){
			error_msg="Error [8] -0 !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("5")!=="*"){
			error_msg="Error [9] 5 !== *";
		}
	}

	if(!error_msg){
		if(Ic.toBal("-5")!=="*"){
			error_msg="Error [10] -5 !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("xx")!=="*"){
			error_msg="Error [11] xx !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("XQ")!=="*"){
			error_msg="Error [12] XQ !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("BX")!=="*"){
			error_msg="Error [13] BX !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("BQ")!=="q"){
			error_msg="Error [14] BQ !== q";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [15] failed to initBoard("+board_name+")";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal(board.Squares["c8"])!=="k"){
			error_msg="Error [16] square(c8) !== k";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.toBal()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToAbsBal(){
	var board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_toAbsBal";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.toAbsBal(-3)!=="B"){
			error_msg="Error [0] -3 !== B";
		}
	//}
	
	if(!error_msg){
		if(Ic.toAbsBal(6)!=="K"){
			error_msg="Error [1] 6 !== K";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal(0)!=="*"){
			error_msg="Error [2] 0 !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("q")!=="Q"){
			error_msg="Error [3] q !== Q";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("bq")!=="Q"){
			error_msg="Error [4] bq !== Q";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("err")!=="*"){
			error_msg="Error [5] err !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal(99)!=="K"){
			error_msg="Error [6] 99 !== K";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal(-99)!=="K"){
			error_msg="Error [7] -99 !== K";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal(-0)!=="*"){
			error_msg="Error [8] -0 !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("5")!=="*"){
			error_msg="Error [9] 5 !== *";
		}
	}

	if(!error_msg){
		if(Ic.toAbsBal("-5")!=="*"){
			error_msg="Error [10] -5 !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("xx")!=="*"){
			error_msg="Error [11] xx !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("XQ")!=="*"){
			error_msg="Error [12] XQ !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("BX")!=="*"){
			error_msg="Error [13] BX !== *";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("BQ")!=="Q"){
			error_msg="Error [14] BQ !== Q";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [15] failed to initBoard("+board_name+")";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal(board.Squares["c8"])!=="K"){
			error_msg="Error [16] square(c8) !== K";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.toAbsBal()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToClassName(){
	var board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_toClassName";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.toClassName("b")!=="bb"){
			error_msg="Error [0] b !== bb";
		}
	//}
	
	if(!error_msg){
		if(Ic.toClassName("K")!=="wk"){
			error_msg="Error [1] K !== wk";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName("*")!==""){
			error_msg="Error [2] * !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName(-5)!=="bq"){
			error_msg="Error [3] -5 !== bq";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName("bq")!=="bq"){
			error_msg="Error [4] bq !== bq";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName("err")!==""){
			error_msg="Error [5] err !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName(99)!=="wk"){
			error_msg="Error [6] 99 !== wk";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName(-99)!=="bk"){
			error_msg="Error [7] -99 !== bk";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName(-0)!==""){
			error_msg="Error [8] -0 !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName("5")!==""){
			error_msg="Error [9] 5 !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName("-5")!==""){
			error_msg="Error [10] -5 !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName("xx")!==""){
			error_msg="Error [11] xx !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName("XQ")!==""){
			error_msg="Error [12] XQ !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName("BX")!==""){
			error_msg="Error [13] BX !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName("BQ")!=="bq"){
			error_msg="Error [14] BQ !== bq";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [15] failed to initBoard("+board_name+")";
		}
	}
	
	if(!error_msg){
		if(Ic.toClassName(board.Squares["c8"])!=="bk"){
			error_msg="Error [16] square(c8) !== bk";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.toClassName()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToBos(){
	var i, len, arr, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.toBos([7, 0])!=="a1"){
			error_msg="Error [0] [7, 0] !== a1";
		}
	//}
	
	if(!error_msg){
		if(Ic.toBos([0, 0])!=="a8"){
			error_msg="Error [1] [0, 0] !== a8";
		}
	}
	
	if(!error_msg){
		if(Ic.toBos([7, 7])!=="h1"){
			error_msg="Error [2] [7, 7] !== h1";
		}
	}
	
	if(!error_msg){
		if(Ic.toBos([0, 7])!=="h8"){
			error_msg="Error [3] [0, 7] !== h8";
		}
	}
	
	if(!error_msg){
		if(Ic.toBos("b2")!=="b2"){
			error_msg="Error [4] b2 !== b2";
		}
	}
	
	if(!error_msg){
		if(Ic.toBos("B2")!=="b2"){
			error_msg="Error [5] B2 !== b2";
		}
	}
	
	if(!error_msg){
		if(Ic.toBos([true, false])!=="a7"){
			error_msg="Error [6] [true, false] !== a7";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.toBos([false, true])!=="b8"){
			error_msg="Error [7] [false, true] !== b8";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.toBos(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]))!=="e7"){
			error_msg="Error [8] square(e7) !== e7";
		}
	}
	
	if(!error_msg){
		arr=["", false, true, , 0, 1, 8, null, ("x"*9), Infinity, -Infinity, {}, [], [1], [1, 1, 1], "z1", "z9", "a9", "ABCxyz"];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			if(Ic.toBos(arr[i])!==null){
				error_msg="Error [9] arr["+i+"] !== null";
				break;
			}
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.toBos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToPos(){
	var i, len, arr, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.toPos("a1").join()!=="7,0"){
			error_msg="Error [0] a1 !== [7, 0]";
		}
	//}
	
	if(!error_msg){
		if(Ic.toPos("a8").join()!=="0,0"){
			error_msg="Error [1] a8 !== [0, 0]";
		}
	}
	
	if(!error_msg){
		if(Ic.toPos("h1").join()!=="7,7"){
			error_msg="Error [2] h1 !== [7, 7]";
		}
	}
	
	if(!error_msg){
		if(Ic.toPos("h8").join()!=="0,7"){
			error_msg="Error [3] h8 !== [0, 7]";
		}
	}
	
	if(!error_msg){
		if(Ic.toPos([6, 1]).join()!=="6,1"){
			error_msg="Error [4] [6, 1] !== [6, 1]";
		}
	}
	
	if(!error_msg){
		if(Ic.toPos("A1").join()!=="7,0"){
			error_msg="Error [5] A1 !== [7, 0]";
		}
	}
	
	if(!error_msg){
		if(Ic.toPos([true, false]).join()!=="1,0"){
			error_msg="Error [6] [true, false] !== [1, 0]";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.toPos([false, true]).join()!=="0,1"){
			error_msg="Error [7] [false, true] !== [0, 1]";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.toPos(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"])).join()!=="1,4"){
			error_msg="Error [8] square(e7) !== [1, 4]";
		}
	}
	
	if(!error_msg){
		arr=["", false, true, , 0, 1, 8, null, ("x"*9), Infinity, -Infinity, {}, [], [1], [1, 1, 1], "z1", "z9", "a9", "ABCxyz"];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			if(Ic.toPos(arr[i])!==null){
				error_msg="Error [9] arr["+i+"] !== null";
				break;
			}
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.toPos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetSign(){
	var board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_getSign";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.getSign("q")!==-1){
			error_msg="Error [0] q !== -1";
		}
	//}
	
	if(!error_msg){
		if(Ic.getSign("Q")!==1){
			error_msg="Error [1] Q !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign(-5)!==-1){
			error_msg="Error [2] -5 !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign(5)!==1){
			error_msg="Error [3] 5 !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign(true)!==-1){
			error_msg="Error [4] true !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign(false)!==1){
			error_msg="Error [5] false !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("bq")!==-1){
			error_msg="Error [6] bq !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("wq")!==1){
			error_msg="Error [7] wq !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("err")!==-1){
			error_msg="Error [8] err !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("xx")!==-1){
			error_msg="Error [9] xx !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("XQ")!==-1){
			error_msg="Error [10] XQ !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("BX")!==-1){
			error_msg="Error [11] BX !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("BQ")!==-1){
			error_msg="Error [12] BQ !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("")!==-1){
			error_msg="Error [13] empty_string !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign(" ")!==-1){
			error_msg="Error [14] white_space !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("z")!==-1){
			error_msg="Error [15] z !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("Z")!==-1){
			error_msg="Error [16] Z !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign(null)!==-1){
			error_msg="Error [17] null !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("5")!==-1){
			error_msg="Error [18] 5 !== -1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("-5")!==-1){
			error_msg="Error [19] -5 !== -1";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "2k5/8/8/p3R2p/P2r3P/8/8/5K2 w - - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [20] failed to initBoard("+board_name+")";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign(board.Squares["e5"])!==1){
			error_msg="Error [21] square(e5) !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign(board.Squares["d4"])!==-1){
			error_msg="Error [22] square(d4) !== -1";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.getSign()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetRankPos(){
	var i, len, arr, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.getRankPos("a1")!==7){
			error_msg="Error [0] a1 !== 7";
		}
	//}
	
	if(!error_msg){
		if(Ic.getRankPos("a8")!==0){
			error_msg="Error [1] a8 !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankPos("h1")!==7){
			error_msg="Error [2] h1 !== 7";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankPos("h8")!==0){
			error_msg="Error [3] h8 !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankPos([3, 6])!==3){
			error_msg="Error [4] [3, 6] !== 3";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankPos([6, 3])!==6){
			error_msg="Error [5] [6, 3] !== 6";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankPos([true, false])!==1){
			error_msg="Error [6] [true, false] !== 1";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.getRankPos([false, true])!==0){
			error_msg="Error [7] [false, true] !== 0";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.getRankPos(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]))!==1){
			error_msg="Error [8] square(e7) !== 1";
		}
	}
	
	if(!error_msg){
		arr=["", false, true, , 0, 1, 8, null, ("x"*9), Infinity, -Infinity, {}, [], [1], [1, 1, 1], "z1", "z9", "a9", "ABCxyz"];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			if(Ic.getRankPos(arr[i])!==null){
				error_msg="Error [9] arr["+i+"] !== null";
				break;
			}
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.getRankPos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetFilePos(){
	var i, len, arr, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.getFilePos("a1")!==0){
			error_msg="Error [0] a1 !== 0";
		}
	//}
	
	if(!error_msg){
		if(Ic.getFilePos("a8")!==0){
			error_msg="Error [1] a8 !== 0";
		}
	}
	
	if(!error_msg){
		if(Ic.getFilePos("h1")!==7){
			error_msg="Error [2] h1 !== 7";
		}
	}
	
	if(!error_msg){
		if(Ic.getFilePos("h8")!==7){
			error_msg="Error [3] h8 !== 7";
		}
	}
	
	if(!error_msg){
		if(Ic.getFilePos([3, 6])!==6){
			error_msg="Error [4] [3, 6] !== 6";
		}
	}
	
	if(!error_msg){
		if(Ic.getFilePos([6, 3])!==3){
			error_msg="Error [5] [6, 3] !== 3";
		}
	}
	
	if(!error_msg){
		if(Ic.getFilePos([true, false])!==0){
			error_msg="Error [6] [true, false] !== 0";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.getFilePos([false, true])!==1){
			error_msg="Error [7] [false, true] !== 1";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.getFilePos(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]))!==4){
			error_msg="Error [8] square(e7) !== 4";
		}
	}
	
	if(!error_msg){
		arr=["", false, true, , 0, 1, 8, null, ("x"*9), Infinity, -Infinity, {}, [], [1], [1, 1, 1], "z1", "z9", "a9", "ABCxyz"];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			if(Ic.getFilePos(arr[i])!==null){
				error_msg="Error [9] arr["+i+"] !== null";
				break;
			}
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.getFilePos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetRankBos(){
	var i, len, arr, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.getRankBos("a1")!=="1"){
			error_msg="Error [0] a1 !== 1";
		}
	//}
	
	if(!error_msg){
		if(Ic.getRankBos("a8")!=="8"){
			error_msg="Error [1] a8 !== 8";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankBos("h1")!=="1"){
			error_msg="Error [2] h1 !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankBos("h8")!=="8"){
			error_msg="Error [3] h8 !== 8";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankBos([3, 6])!=="5"){
			error_msg="Error [4] [3, 6] !== 5";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankBos([6, 3])!=="2"){
			error_msg="Error [5] [6, 3] !== 2";
		}
	}
	
	if(!error_msg){
		if(Ic.getRankBos([true, false])!=="7"){
			error_msg="Error [6] [true, false] !== 7";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.getRankBos([false, true])!=="8"){
			error_msg="Error [7] [false, true] !== 8";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.getRankBos(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]))!=="7"){
			error_msg="Error [8] square(e7) !== 7";
		}
	}
	
	if(!error_msg){
		arr=["", false, true, , 0, 1, 8, null, ("x"*9), Infinity, -Infinity, {}, [], [1], [1, 1, 1], "z1", "z9", "a9", "ABCxyz"];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			if(Ic.getRankBos(arr[i])!==null){
				error_msg="Error [9] arr["+i+"] !== null";
				break;
			}
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.getRankBos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetFileBos(){
	var i, len, arr, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.getFileBos("a1")!=="a"){
			error_msg="Error [0] a1 !== a";
		}
	//}
	
	if(!error_msg){
		if(Ic.getFileBos("a8")!=="a"){
			error_msg="Error [1] a8 !== a";
		}
	}
	
	if(!error_msg){
		if(Ic.getFileBos("h1")!=="h"){
			error_msg="Error [2] h1 !== h";
		}
	}
	
	if(!error_msg){
		if(Ic.getFileBos("h8")!=="h"){
			error_msg="Error [3] h8 !== h";
		}
	}
	
	if(!error_msg){
		if(Ic.getFileBos([3, 6])!=="g"){
			error_msg="Error [4] [3, 6] !== g";
		}
	}
	
	if(!error_msg){
		if(Ic.getFileBos([6, 3])!=="d"){
			error_msg="Error [5] [6, 3] !== d";
		}
	}
	
	if(!error_msg){
		if(Ic.getFileBos([true, false])!=="a"){
			error_msg="Error [6] [true, false] !== a";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.getFileBos([false, true])!=="b"){
			error_msg="Error [7] [false, true] !== b";//mm ok
		}
	}
	
	if(!error_msg){
		if(Ic.getFileBos(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["e7"]))!=="e"){
			error_msg="Error [8] square(e7) !== e";
		}
	}
	
	if(!error_msg){
		arr=["", false, true, , 0, 1, 8, null, ("x"*9), Infinity, -Infinity, {}, [], [1], [1, 1, 1], "z1", "z9", "a9", "ABCxyz"];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			if(Ic.getFileBos(arr[i])!==null){
				error_msg="Error [9] arr["+i+"] !== null";
				break;
			}
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.getFileBos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcIsInsideBoard(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.isInsideBoard("a1")!==true){
			error_msg="Error [0] a1 !== true";
		}
	//}
	
	if(!error_msg){
		if(Ic.isInsideBoard("a9")!==false){
			error_msg="Error [1] a9 !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.isInsideBoard("i3")!==false){
			error_msg="Error [2] i3 !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.isInsideBoard([7, 7])!==true){
			error_msg="Error [3] [7, 7] !== true";
		}
	}
	
	if(!error_msg){
		if(Ic.isInsideBoard([8, 8])!==false){
			error_msg="Error [4] [8, 8] !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.isInsideBoard([0, 9])!==false){
			error_msg="Error [5] [0, 9] !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.isInsideBoard([9, 0])!==false){
			error_msg="Error [6] [9, 0] !== false";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.isInsideBoard()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcSameSquare(){
	var i, w, x, y, z, len, arr, arr2, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.sameSquare("d2", [6, 3])!==true){
			error_msg="Error [0] d2, [6, 3] !== true";
		}
	//}
	
	if(!error_msg){
		if(Ic.sameSquare("a1", "A1")!==true){
			error_msg="Error [1] a1, A1 !== true";
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("zz", [0, 0])!==false){
			error_msg="Error [2] zz, [0, 0] !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("z2", [6, 0])!==false){
			error_msg="Error [3] z2, [6, 0] !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("a8", [-99, 0])!==false){
			error_msg="Error [4] a8, [-99, 0] !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("b1", [99, 1])!==false){
			error_msg="Error [5] b1, [99, 1] !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("h1", [99, 99])!==false){
			error_msg="Error [6] h1, [99, 99] !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("h8", [0, 99])!==false){
			error_msg="Error [7] h8, [0, 99] !== false";
		}
	}
	
	if(!error_msg){
		arr=[0, 1, 2, 3, 4, 5, 6, 7];
		
		outer:
		for(w=0; w<8; w++){
			for(x=0; x<8; x++){
				for(y=0; y<8; y++){
					for(z=0; z<8; z++){
						if(Ic.sameSquare([arr[w], arr[x]], [arr[y], arr[z]])!==(arr[w]===arr[y] && arr[x]===arr[z])){
							error_msg="Error [8] pos, pos ("+arr[w]+", "+arr[x]+" ,"+arr[y]+", "+arr[z]+")";
							break outer;
						}
						
						if(Ic.sameSquare(Ic.toBos([arr[w], arr[x]]), [arr[y], arr[z]])!==(arr[w]===arr[y] && arr[x]===arr[z])){
							error_msg="Error [8] bos, pos ("+arr[w]+", "+arr[x]+" ,"+arr[y]+", "+arr[z]+")";
							break outer;
						}
						
						if(Ic.sameSquare([arr[w], arr[x]], Ic.toBos([arr[y], arr[z]]))!==(arr[w]===arr[y] && arr[x]===arr[z])){
							error_msg="Error [8] pos, bos ("+arr[w]+", "+arr[x]+" ,"+arr[y]+", "+arr[z]+")";
							break outer;
						}
						
						if(Ic.sameSquare(Ic.toBos([arr[w], arr[x]]), Ic.toBos([arr[y], arr[z]]))!==(arr[w]===arr[y] && arr[x]===arr[z])){
							error_msg="Error [8] bos, bos ("+arr[w]+", "+arr[x]+" ,"+arr[y]+", "+arr[z]+")";
							break outer;
						}
					}
				}
			}
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("z9", "z9")!==false){
			error_msg="Error [9] z9, z9 !== false";
		}
	}
	
	if(!error_msg){
		arr=[[true, true], [true, false], [false, true], [false, false]];
		arr2=[[1, 1], [1, 0], [0, 1], [0, 0]];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			if(Ic.sameSquare(arr[i], arr2[i])!==true){
				error_msg="Error [10] arr["+i+"] and arr2["+i+"] !== true";//mm ok
				break;
			}
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare(null, null)!==false){
			error_msg="Error [11] null, null !== false";
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["c3"]), "c3")!==true){
			error_msg="Error [12] square(c3), c3 !== true";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.sameSquare()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcFenApply(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.mapToBos(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2"])).join()!=="d2,b2,a2"){
			error_msg="Error [0] apply(legalMoves) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, c2] !== d2,b2,a2";
		}
	//}
	
	if(!error_msg){
		if(Ic.mapToBos(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2"])).join()!==""){
			error_msg="Error [1] apply(legalMoves) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, a2] !== empty_string";
		}
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.mapToBos(Ic.fenApply("0invalidfen0", "legalMoves", ["a2"])).join()!==""){
			error_msg="Error [2] apply(legalMoves) [0invalidfen0] !== empty_string";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		if(Ic.mapToBos(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "legalMoves", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"])])).join()!=="a3,a4"){
			error_msg="Error [3] apply(legalMoves) [default_fen, square(a2)] !== a3,a4";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["c2", "a2"])!==true){
			error_msg="Error [4] apply(isLegalMove) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, c2, a2] !== true";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["a2", "c2"])!==false){
			error_msg="Error [5] apply(isLegalMove) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, a2, c2] !== false";
		}
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("0invalidfen0", "isLegalMove", ["a2", "a3"])!==false){
			error_msg="Error [6] apply(isLegalMove) [0invalidfen0, a2, a3] !== false";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		if(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalMove", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a2"]), Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["a4"])])!==true){
			error_msg="Error [7] apply(isLegalMove) [default_fen, square(a2), square(a4)] !== true";
		}
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("8/8/8/8/8/1k6/8/1K1r4 w - - 0 1", "isLegalFen")!==true){
			error_msg="Error [8] apply(isLegalFen) [8/8/8/8/8/1k6/8/1K1r4 w - - 0 1] !== true";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("0invalidfen0", "isLegalFen")!==false){
			error_msg="Error [9] apply(isLegalFen) [0invalidfen0] !== false";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/1P6/1PPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalFen")!==false){
			error_msg="Error [10] apply(isLegalFen) [rnbqkbnr/pppppppp/8/8/8/1P6/1PPPPPPP/RNBQKBNR w KQkq - 0 1] !== false";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["e8"]).val!==-6){
			error_msg="Error [11] apply(getSquare).val [fen, e8] !== -6";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", [[2, 5]]).val!==4){
			error_msg="Error [12] apply(getSquare).val [fen, [2, 5]] !== 4";
		}
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("0invalidfen0", "getSquare", ["a2"])!==null){
			error_msg="Error [13] apply(getSquare) [0invalidfen0, a2] !== null";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["d7", {rankShift : 1, fileShift : 2}]).isRook!==true){
			error_msg="Error [14] apply(getSquare).isRook [fen, d7 r+1 f+2] !== true";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", [[3, 3], {rankShift : -1}]).val!==6){
			error_msg="Error [15] apply(getSquare).val [fen, [3, 3] r-1] !== 6";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", [Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["f8"]), {fileShift : -1}]).val!==-6){
			error_msg="Error [16] apply(getSquare).val [fen, square(f8) f-1] !== -6";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["e8", {rankShift : -1}])!==null){
			error_msg="Error [17] apply(getSquare) [fen, e8 r-1] !== null";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["e1", {rankShift : 1}])!==null){
			error_msg="Error [18] apply(getSquare) [fen, e1 r+1] !== null";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["a4", {fileShift : -1}])!==null){
			error_msg="Error [19] apply(getSquare) [fen, a4 f-1] !== null";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquare", ["h4", {fileShift : 1}])!==null){
			error_msg="Error [20] apply(getSquare) [fen, h4 f+1] !== null";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.fenApply()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcMapToBos(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.mapToBos([[0, 7], [2, 2]]).join()!=="h8,c6"){
			error_msg="Error [0] [[0, 7], [2, 2]] !== h8,c6";
		}
	//}
	
	if(!error_msg){
		if(Ic.mapToBos([[1, 1], "a2"]).join()!=="b7,a2"){
			error_msg="Error [1] [[1, 1], a2] !== b7,a2";
		}
	}
	
	if(!error_msg){
		if(Ic.mapToBos([[4, 3], "d4", Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "getSquare", ["d4"])]).join()!=="d4,d4,d4"){
			error_msg="Error [2] [[4, 3], d4, square(d4)] !== d4,d4,d4";
		}
	}
	
	if(!error_msg){
		if(Ic.mapToBos("err").join()!==""){
			error_msg="Error [3] [err] !== empty_array";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.mapToBos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

/*function fnIcAAAAA(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.AAAAA()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}*/
