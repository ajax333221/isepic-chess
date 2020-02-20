//---to do:
//Mover fenApply() -> isCheckmate() y isStalemate() a otro lado por b.IsXyz
//
//initBoard
//getBoardCount
//getBoardNames
//boardExists
//selectBoard
//removeBoard
//isEqualBoard
//cloneBoard

function fnIcToVal(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.toVal("b")!==-3){
			error_msg="Error [0] b !== -3";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.toVal("K")!==6){
			error_msg="Error [1] K !== 6";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toVal("*")!==0){
			error_msg="Error [2] * !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toVal(-5)!==-5){
			error_msg="Error [3] -5 !== -5";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toVal("err")!==0){
			error_msg="Error [4] err !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toVal(99)!==6){
			error_msg="Error [5] 99 !== 6";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toVal(-99)!==-6){
			error_msg="Error [6] -99 !== -6";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toVal(-0)!==0){
			error_msg="Error [7] -0 !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toVal("5")!==0){
			error_msg="Error [8] 5 !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toVal("-5")!==0){
			error_msg="Error [9] -5 !== 0";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.toVal()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToAbsVal(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.toAbsVal("b")!==3){
			error_msg="Error [0] b !== 3";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.toAbsVal("K")!==6){
			error_msg="Error [1] K !== 6";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsVal("*")!==0){
			error_msg="Error [2] * !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsVal(-5)!==5){
			error_msg="Error [3] -5 !== 5";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsVal("err")!==0){
			error_msg="Error [4] err !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsVal(99)!==6){
			error_msg="Error [5] 99 !== 6";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsVal(-99)!==6){
			error_msg="Error [6] -99 !== 6";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsVal(-0)!==0){
			error_msg="Error [7] -0 !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsVal("5")!==0){
			error_msg="Error [8] 5 !== 0";
		}
	}

	if(!error_msg){
		if(IsepicChess.toAbsVal("-5")!==0){
			error_msg="Error [9] -5 !== 0";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.toAbsVal()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToBal(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.toBal(-3)!=="b"){
			error_msg="Error [0] -3 !== b";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.toBal(6)!=="K"){
			error_msg="Error [1] 6 !== K";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBal(0)!=="*"){
			error_msg="Error [2] 0 !== *";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBal("q")!=="q"){
			error_msg="Error [3] q !== q";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBal("err")!=="*"){
			error_msg="Error [4] err !== *";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBal(99)!=="K"){
			error_msg="Error [5] 99 !== K";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBal(-99)!=="k"){
			error_msg="Error [6] -99 !== k";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBal(-0)!=="*"){
			error_msg="Error [7] -0 !== *";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBal("5")!=="*"){
			error_msg="Error [8] 5 !== *";
		}
	}

	if(!error_msg){
		if(IsepicChess.toBal("-5")!=="*"){
			error_msg="Error [9] -5 !== *";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.toBal()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToAbsBal(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.toAbsBal(-3)!=="B"){
			error_msg="Error [0] -3 !== B";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.toAbsBal(6)!=="K"){
			error_msg="Error [1] 6 !== K";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsBal(0)!=="*"){
			error_msg="Error [2] 0 !== *";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsBal("q")!=="Q"){
			error_msg="Error [3] q !== Q";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsBal("err")!=="*"){
			error_msg="Error [4] err !== *";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsBal(99)!=="K"){
			error_msg="Error [5] 99 !== K";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsBal(-99)!=="K"){
			error_msg="Error [6] -99 !== K";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsBal(-0)!=="*"){
			error_msg="Error [7] -0 !== *";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toAbsBal("5")!=="*"){
			error_msg="Error [8] 5 !== *";
		}
	}

	if(!error_msg){
		if(IsepicChess.toAbsBal("-5")!=="*"){
			error_msg="Error [9] -5 !== *";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.toAbsBal()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToPieceClass(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.toPieceClass("b")!=="bb"){
			error_msg="Error [0] b !== bb";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.toPieceClass("K")!=="wk"){
			error_msg="Error [1] K !== wk";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPieceClass("*")!==""){
			error_msg="Error [2] * !== empty_string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPieceClass(-5)!=="bq"){
			error_msg="Error [3] -5 !== bq";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPieceClass("err")!==""){
			error_msg="Error [4] err !== empty_string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPieceClass(99)!=="wk"){
			error_msg="Error [5] 99 !== wk";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPieceClass(-99)!=="bk"){
			error_msg="Error [6] -99 !== bk";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPieceClass(-0)!==""){
			error_msg="Error [7] -0 !== empty_string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPieceClass("5")!==""){
			error_msg="Error [8] 5 !== empty_string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPieceClass("-5")!==""){
			error_msg="Error [9] -5 !== empty_string";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.toPieceClass()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToBos(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.toBos([7, 0])!=="a1"){
			error_msg="Error [0] [7, 0] !== a1";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.toBos([0, 0])!=="a8"){
			error_msg="Error [1] [0, 0] !== a8";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBos([7, 7])!=="h1"){
			error_msg="Error [2] [7, 7] !== h1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBos([0, 7])!=="h8"){
			error_msg="Error [3] [0, 7] !== h8";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toBos("B2")!=="b2"){
			error_msg="Error [4] B2 !== b2";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.toBos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToPos(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.toPos("a1").join()!=="7,0"){
			error_msg="Error [0] a1 !== [7, 0]";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.toPos("a8").join()!=="0,0"){
			error_msg="Error [1] a8 !== [0, 0]";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPos("h1").join()!=="7,7"){
			error_msg="Error [2] h1 !== [7, 7]";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPos("h8").join()!=="0,7"){
			error_msg="Error [3] h8 !== [0, 7]";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPos([6, 1]).join()!=="6,1"){
			error_msg="Error [4] [6, 1] !== [6, 1]";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.toPos("A1").join()!=="7,0"){
			error_msg="Error [5] failed to qos.toLowerCase() in toBos()";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.toPos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetSign(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.getSign("q")!==-1){
			error_msg="Error [0] q !== -1";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.getSign("Q")!==1){
			error_msg="Error [1] Q !== 1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign(true)!==-1){
			error_msg="Error [2] true !== -1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign(false)!==1){
			error_msg="Error [3] false !== 1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign("err")!==-1){
			error_msg="Error [4] err !== -1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign("")!==-1){
			error_msg="Error [5] empty_string !== -1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign(" ")!==-1){
			error_msg="Error [6] white_space !== -1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign("z")!==-1){
			error_msg="Error [7] z !== -1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign("Z")!==-1){
			error_msg="Error [8] Z !== -1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign(null)!==-1){
			error_msg="Error [9] null !== -1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign("5")!==-1){
			error_msg="Error [10] 5 !== -1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getSign("-5")!==-1){
			error_msg="Error [11] -5 !== -1";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.getSign()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetRankPos(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.getRankPos("a1")!==7){
			error_msg="Error [0] a1 !== 7";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.getRankPos("a8")!==0){
			error_msg="Error [1] a8 !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankPos("h1")!==7){
			error_msg="Error [2] h1 !== 7";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankPos("h8")!==0){
			error_msg="Error [3] h8 !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankPos([3, 6])!==3){
			error_msg="Error [4] [3, 6] !== 3";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankPos([6, 3])!==6){
			error_msg="Error [5] [6, 3] !== 6";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankPos([true, 0])!==true){
			error_msg="Error [6] [true, 0] !== true";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.getRankPos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetFilePos(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.getFilePos("a1")!==0){
			error_msg="Error [0] a1 !== 0";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.getFilePos("a8")!==0){
			error_msg="Error [1] a8 !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFilePos("h1")!==7){
			error_msg="Error [2] h1 !== 7";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFilePos("h8")!==7){
			error_msg="Error [3] h8 !== 7";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFilePos([3, 6])!==6){
			error_msg="Error [4] [3, 6] !== 6";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFilePos([6, 3])!==3){
			error_msg="Error [5] [6, 3] !== 3";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFilePos([0, true])!==true){
			error_msg="Error [6] [0, true] !== true";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.getFilePos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetRankBos(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.getRankBos("a1")!=="1"){
			error_msg="Error [0] a1 !== 1";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.getRankBos("a8")!=="8"){
			error_msg="Error [1] a8 !== 8";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankBos("h1")!=="1"){
			error_msg="Error [2] h1 !== 1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankBos("h8")!=="8"){
			error_msg="Error [3] h8 !== 8";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankBos([3, 6])!=="5"){
			error_msg="Error [4] [3, 6] !== 5";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankBos([6, 3])!=="2"){
			error_msg="Error [5] [6, 3] !== 2";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getRankBos("ABCxyz")!=="b"){
			error_msg="Error [6] ABCxyz !== b";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.getRankBos()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcGetFileBos(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.getFileBos("a1")!=="a"){
			error_msg="Error [0] a1 !== a";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.getFileBos("a8")!=="a"){
			error_msg="Error [1] a8 !== a";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFileBos("h1")!=="h"){
			error_msg="Error [2] h1 !== h";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFileBos("h8")!=="h"){
			error_msg="Error [3] h8 !== h";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFileBos([3, 6])!=="g"){
			error_msg="Error [4] [3, 6] !== g";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFileBos([6, 3])!=="d"){
			error_msg="Error [5] [6, 3] !== d";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.getFileBos("ABCxyz")!=="a"){
			error_msg="Error [6] ABCxyz !== a";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.getFileBos()",
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
		if(IsepicChess.isInsideBoard("a1")!==true){
			error_msg="Error [0] a1 !== true";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.isInsideBoard("a9")!==false){
			error_msg="Error [1] a9 !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.isInsideBoard("i3")!==false){
			error_msg="Error [2] i3 !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.isInsideBoard([7, 7])!==true){
			error_msg="Error [3] [7, 7] !== true";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.isInsideBoard([8, 8])!==false){
			error_msg="Error [4] [8, 8] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.isInsideBoard([0, 9])!==false){
			error_msg="Error [5] [0, 9] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.isInsideBoard([9, 0])!==false){
			error_msg="Error [6] [9, 0] !== false";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.isInsideBoard()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcSameSquare(){
	var w, x, y, z, arr, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.sameSquare("d2", [6, 3])!==true){
			error_msg="Error [0] d2, [6, 3] !== true";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.sameSquare("a1", "A1")!==true){
			error_msg="Error [1] a1, A1 !== true";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.sameSquare("zz", [0, 0])!==false){
			error_msg="Error [2] zz, [0, 0] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.sameSquare("z2", [6, 0])!==false){
			error_msg="Error [3] z2, [6, 0] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.sameSquare("a8", [-99, 0])!==true){
			error_msg="Error [4] a8, [-99, 0] !== true";/*mmm*/
		}
	}
	
	if(!error_msg){
		if(IsepicChess.sameSquare("b1", [99, 1])!==true){
			error_msg="Error [5] b1, [99, 0] !== true";/*mmm*/
		}
	}
	
	if(!error_msg){
		if(IsepicChess.sameSquare("h1", [99, 99])!==true){
			error_msg="Error [6] h1, [-2, 0] !== true";/*mmm*/
		}
	}
	
	if(!error_msg){
		if(IsepicChess.sameSquare("h8", [0, 99])!==true){
			error_msg="Error [7] h8, [0, 99] !== true";/*mmm*/
		}
	}
	
	if(!error_msg){
		arr=[0, 7, -1, -2, 8, 9];
		
		outer:
		for(w=0; w<6; w++){
			for(x=0; x<6; x++){
				for(y=0; y<6; y++){
					for(z=0; z<6; z++){
						if(IsepicChess.sameSquare([arr[w], arr[x]], [arr[y], arr[z]])!==(arr[w]===arr[y] && arr[x]===arr[z])){
							error_msg="Error [8] ["+arr[w]+", "+arr[x]+"], ["+arr[y]+", "+arr[z]+"] !== "+(arr[w]===arr[y] && arr[x]===arr[z]);
							break outer;
						}
					}
				}
			}
		}
	}
	
	if(!error_msg){
		arr=["a", "h", "x", "y", "1", "7", "0", "8"];
		
		outer:
		for(w=0; w<8; w++){
			for(x=0; x<8; x++){
				for(y=0; y<8; y++){
					for(z=0; z<8; z++){
						if(IsepicChess.sameSquare((arr[w]+""+arr[x]), (arr[y]+""+arr[z]))!==((arr[w]+""+arr[x])===(arr[y]+""+arr[z]))){
							error_msg="Error [9] "+arr[w]+""+arr[x]+", "+arr[y]+""+arr[z]+" !== "+((arr[w]+""+arr[x])===(arr[y]+""+arr[z]));
							break outer;
						}
					}
				}
			}
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.sameSquare()",
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
		if(IsepicChess.fenApply("8/k7/r7/8/8/2b5/8/K7 w - - 0 1", "countChecks")!==2){
			error_msg="Error [0] apply(countChecks) [8/k7/r7/8/8/2b5/8/K7 w - - 0 1] !== 2";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.fenApply("8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1", "countChecks")!==0){
			error_msg="Error [1] apply(countChecks) [8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1] !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("r3k2r/8/8/8/8/3b4/8/R3K2R w KQkq - 0 1", "countChecks", ["f1"])!==1){
			error_msg="Error [2] apply(countChecks) [r3k2r/8/8/8/8/3b4/8/R3K2R w KQkq - 0 1, f1] !== 1";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("0invalidfen0", "countChecks")!==0){
			error_msg="Error [3] apply(countChecks) [0invalidfen0] !== 0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("8/k7/r7/8/8/2b5/8/K7 w - - 0 1", "isCheck")!==true){
			error_msg="Error [4] apply(isCheck) [8/k7/r7/8/8/2b5/8/K7 w - - 0 1] !== true";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1", "isCheck")!==false){
			error_msg="Error [5] apply(isCheck) [8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("r3k2r/8/8/8/8/3b4/8/R3K2R w KQkq - 0 1", "isCheck", ["f1"])!==true){
			error_msg="Error [6] apply(isCheck) [r3k2r/8/8/8/8/3b4/8/R3K2R w KQkq - 0 1, f1] !== true";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("0invalidfen0", "isCheck")!==false){
			error_msg="Error [7] apply(isCheck) [0invalidfen0] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.mapToBos(IsepicChess.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["c2"])).join()!=="d2,b2,a2"){
			error_msg="Error [8] apply(legalMoves) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, c2] !== d2,b2,a2";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.mapToBos(IsepicChess.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2"])).join()!==""){
			error_msg="Error [9] apply(legalMoves) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, a2] !== empty_string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.mapToBos(IsepicChess.fenApply("0invalidfen0", "legalMoves", ["a1"])).join()!==""){
			error_msg="Error [10] apply(legalMoves) [0invalidfen0] !== empty_string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["c2", "a2"])!==true){
			error_msg="Error [11] apply(isLegalMove) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, c2, a2] !== true";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["a2", "c2"])!==false){
			error_msg="Error [12] apply(isLegalMove) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, a2, c2] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("0invalidfen0", "isLegalMove", ["a1", "a2"])!==false){
			error_msg="Error [13] apply(isLegalMove) [0invalidfen0, a1, a2] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("8/8/8/8/8/1k6/8/1K1r4 w - - 0 1", "isLegalFen")!==true){
			error_msg="Error [14] apply(isLegalFen) [8/8/8/8/8/1k6/8/1K1r4 w - - 0 1] !== true";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("0invalidfen0", "isLegalFen")!==false){
			error_msg="Error [15] apply(isLegalFen) [0invalidfen0] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("rnbqkbnr/pppppppp/8/8/8/1P6/1PPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalFen")!==false){
			error_msg="Error [16] apply(isLegalFen) [rnbqkbnr/pppppppp/8/8/8/1P6/1PPPPPPP/RNBQKBNR w KQkq - 0 1] !== false";
		}
	}
	
	/*if(!error_msg){
		if(IsepicChess.fenApply("8/8/8/4b3/8/1k6/1B6/K1r5 w - - 0 1", "isCheckmate")!==true){
			error_msg="Error [17] apply(isCheckmate) [8/8/8/4b3/8/1k6/1B6/K1r5 w - - 0 1] !== true";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("8/8/8/8/8/1k6/1B6/K1r5 w - - 0 1", "isCheckmate")!==false){
			error_msg="Error [18] apply(isCheckmate) [8/8/8/8/8/1k6/1B6/K1r5 w - - 0 1] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("0invalidfen0", "isCheckmate")!==false){
			error_msg="Error [19] apply(isCheckmate) [0invalidfen0] !== false";
		}
	}*/
	
	/*if(!error_msg){
		if(IsepicChess.fenApply("8/8/8/8/8/1k6/1r6/K7 w - - 0 1", "isStalemate")!==true){
			error_msg="Error [20] apply(isStalemate) [8/8/8/8/8/1k6/1r6/K7 w - - 0 1] !== true";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("8/8/8/4B3/8/1k6/1r6/K7 w - - 0 1", "isStalemate")!==false){
			error_msg="Error [21] apply(isStalemate) [8/8/8/4B3/8/1k6/1r6/K7 w - - 0 1] !== false";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("0invalidfen0", "isStalemate")!==false){
			error_msg="Error [22] apply(isStalemate) [0invalidfen0] !== false";
		}
	}*/
	
	if(!error_msg){
		if(IsepicChess.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getValue", ["e8"])!==-6){
			error_msg="Error [23] apply(getValue) [fen_e8] !== -6";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getValue", [[2, 5]])!==4){
			error_msg="Error [24] apply(getValue) [fen_f6] !== 4";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.fenApply("0invalidfen0", "getValue", ["d6"])!==0){
			error_msg="Error [25] apply(getValue) [fen_d6] !== 0";
		}
	}
	
	if(!error_msg){
		if(JSON.stringify(IsepicChess.fenApply("k7/1r6/8/p6R/Pp6/8/1RR5/K7 b - - 0 1", "materialDifference"))!==JSON.stringify({w:[4, 4], b:[-1]})){
			error_msg="Error [26] apply(materialDifference) [fen] !== {w:[4, 4], b:[-1]}";
		}
	}
	
	if(!error_msg){
		if(JSON.stringify(IsepicChess.fenApply("8/1rr5/nn4k1/2p1P3/2PP4/B5K1/Q1R5/8 w - - 0 1", "materialDifference"))!==JSON.stringify({w:[1, 1, 3, 5], b:[-2, -2, -4]})){
			error_msg="Error [27] apply(materialDifference) [fen] !== {w:[1, 1, 3, 5], b:[-2, -2, -4]}";
		}
	}
	
	if(!error_msg){
		if(JSON.stringify(IsepicChess.fenApply("8/kr3pn1/qp4p1/p4b1p/P4B1P/QP4P1/KR3PN1/8 w - - 0 1", "materialDifference"))!==JSON.stringify({w:[], b:[]})){
			error_msg="Error [28] apply(materialDifference) [fen] !== {w:[], b:[]}";
		}
	}
	
	if(!error_msg){
		if(JSON.stringify(IsepicChess.fenApply("0invalidfen0", "materialDifference"))!==JSON.stringify({w:[], b:[]})){
			error_msg="Error [29] apply(materialDifference) [0invalidfen0] !== {w:[], b:[]}";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.fenApply()",
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
		if(IsepicChess.mapToBos([[0, 7], [2, 2]]).join()!=="h8,c6"){
			error_msg="Error [0] [[0, 7], [2, 2]] !== h8,c6";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.mapToBos([[1, 1], "a2"]).join()!=="b7,a2"){
			error_msg="Error [1] [[1, 1], a2] !== b7,a2";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.mapToBos("err").join()!==""){
			error_msg="Error [2] [err] !== empty_array";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "IC.mapToBos()",
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
		testName : "IC.AAAAA()",
		fromFile : "test-ic-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}*/
