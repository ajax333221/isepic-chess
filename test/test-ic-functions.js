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
	var start_time, end_time, error_msg;
	
	error_msg="";
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
		if(Ic.toVal("XP")!==1){
			error_msg="Error [12] XP !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("BX")!==3){
			error_msg="Error [13] BX !== 3";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal("BP")!==-1){
			error_msg="Error [14] BP !== -1";
		}
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
	var start_time, end_time, error_msg;
	
	error_msg="";
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
		if(Ic.toAbsVal("XP")!==1){
			error_msg="Error [12] XP !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("BX")!==3){
			error_msg="Error [13] BX !== 3";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsVal("BP")!==1){
			error_msg="Error [14] BP !== 1";
		}
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
	var start_time, end_time, error_msg;
	
	error_msg="";
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
		if(Ic.toBal("XP")!=="P"){
			error_msg="Error [12] XP !== P";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("BX")!=="B"){
			error_msg="Error [13] BX !== B";
		}
	}
	
	if(!error_msg){
		if(Ic.toBal("BP")!=="p"){
			error_msg="Error [14] BP !== p";
		}
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
	var start_time, end_time, error_msg;
	
	error_msg="";
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
		if(Ic.toAbsBal("XP")!=="P"){
			error_msg="Error [12] XP !== P";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("BX")!=="B"){
			error_msg="Error [13] BX !== B";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("BP")!=="P"){
			error_msg="Error [14] BP !== P";
		}
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

function fnIcToPieceClass(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.toPieceClass("b")!=="bb"){
			error_msg="Error [0] b !== bb";
		}
	//}
	
	if(!error_msg){
		if(Ic.toPieceClass("K")!=="wk"){
			error_msg="Error [1] K !== wk";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass("*")!==""){
			error_msg="Error [2] * !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass(-5)!=="bq"){
			error_msg="Error [3] -5 !== bq";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass("bq")!=="bq"){
			error_msg="Error [4] bq !== bq";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass("err")!==""){
			error_msg="Error [5] err !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass(99)!=="wk"){
			error_msg="Error [6] 99 !== wk";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass(-99)!=="bk"){
			error_msg="Error [7] -99 !== bk";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass(-0)!==""){
			error_msg="Error [8] -0 !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass("5")!==""){
			error_msg="Error [9] 5 !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass("-5")!==""){
			error_msg="Error [10] -5 !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass("xx")!==""){
			error_msg="Error [11] xx !== empty_string";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass("XP")!=="wp"){
			error_msg="Error [12] XP !== wp";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass("BX")!=="wb"){
			error_msg="Error [13] BX !== wb";
		}
	}
	
	if(!error_msg){
		if(Ic.toPieceClass("BP")!=="bp"){
			error_msg="Error [14] BP !== bp";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.toPieceClass()",
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
		if(Ic.toBos("B2")!=="b2"){
			error_msg="Error [4] B2 !== b2";
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
	var start_time, end_time, error_msg;
	
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
			error_msg="Error [5] failed to qos.toLowerCase() in toBos()";
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
	var start_time, end_time, error_msg;
	
	error_msg="";
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
		if(Ic.getSign("XP")!==1){
			error_msg="Error [10] XP !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("BX")!==1){
			error_msg="Error [11] BX !== 1";
		}
	}
	
	if(!error_msg){
		if(Ic.getSign("BP")!==-1){
			error_msg="Error [12] BP !== -1";
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
	var start_time, end_time, error_msg;
	
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
		if(Ic.getRankPos([true, 0])!==true){
			error_msg="Error [6] [true, 0] !== true";
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
	var start_time, end_time, error_msg;
	
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
		if(Ic.getFilePos([0, true])!==true){
			error_msg="Error [6] [0, true] !== true";
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
	var start_time, end_time, error_msg;
	
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
		if(Ic.getRankBos("ABCxyz")!=="b"){
			error_msg="Error [6] ABCxyz !== b";
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
	var start_time, end_time, error_msg;
	
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
		if(Ic.getFileBos("ABCxyz")!=="a"){
			error_msg="Error [6] ABCxyz !== a";
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
	var w, x, y, z, arr, start_time, end_time, error_msg;
	
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
		if(Ic.sameSquare("a8", [-99, 0])!==true){
			error_msg="Error [4] a8, [-99, 0] !== true";/*mmm*/
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("b1", [99, 1])!==true){
			error_msg="Error [5] b1, [99, 0] !== true";/*mmm*/
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("h1", [99, 99])!==true){
			error_msg="Error [6] h1, [-2, 0] !== true";/*mmm*/
		}
	}
	
	if(!error_msg){
		if(Ic.sameSquare("h8", [0, 99])!==true){
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
						if(Ic.sameSquare([arr[w], arr[x]], [arr[y], arr[z]])!==(arr[w]===arr[y] && arr[x]===arr[z])){
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
						if(Ic.sameSquare((arr[w]+""+arr[x]), (arr[y]+""+arr[z]))!==((arr[w]+""+arr[x])===(arr[y]+""+arr[z]))){
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
			error_msg="Error [8] apply(legalMoves) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, c2] !== d2,b2,a2";
		}
	//}
	
	if(!error_msg){
		if(Ic.mapToBos(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "legalMoves", ["a2"])).join()!==""){
			error_msg="Error [9] apply(legalMoves) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, a2] !== empty_string";
		}
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.mapToBos(Ic.fenApply("0invalidfen0", "legalMoves", ["a1"])).join()!==""){
			error_msg="Error [10] apply(legalMoves) [0invalidfen0] !== empty_string";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		if(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["c2", "a2"])!==true){
			error_msg="Error [11] apply(isLegalMove) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, c2, a2] !== true";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1", "isLegalMove", ["a2", "c2"])!==false){
			error_msg="Error [12] apply(isLegalMove) [8/8/8/4k3/8/8/r1R1K3/8 w - - 0 1, a2, c2] !== false";
		}
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("0invalidfen0", "isLegalMove", ["a1", "a2"])!==false){
			error_msg="Error [13] apply(isLegalMove) [0invalidfen0, a1, a2] !== false";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("8/8/8/8/8/1k6/8/1K1r4 w - - 0 1", "isLegalFen")!==true){
			error_msg="Error [14] apply(isLegalFen) [8/8/8/8/8/1k6/8/1K1r4 w - - 0 1] !== true";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("0invalidfen0", "isLegalFen")!==false){
			error_msg="Error [15] apply(isLegalFen) [0invalidfen0] !== false";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("rnbqkbnr/pppppppp/8/8/8/1P6/1PPPPPPP/RNBQKBNR w KQkq - 0 1", "isLegalFen")!==false){
			error_msg="Error [16] apply(isLegalFen) [rnbqkbnr/pppppppp/8/8/8/1P6/1PPPPPPP/RNBQKBNR w KQkq - 0 1] !== false";
		}
		
		Ic.setSilentMode(false);
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquareVal", ["e8"])!==-6){
			error_msg="Error [23] apply(getSquareVal) [fen_e8] !== -6";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("4k3/8/3K1R2/8/8/8/8/8 b - - 0 1", "getSquareVal", [[2, 5]])!==4){
			error_msg="Error [24] apply(getSquareVal) [fen_f6] !== 4";
		}
	}
	
	if(!error_msg){
		Ic.setSilentMode(true);
		
		if(Ic.fenApply("0invalidfen0", "getSquareVal", ["d6"])!==0){
			error_msg="Error [25] apply(getSquareVal) [fen_d6] !== 0";
		}
		
		Ic.setSilentMode(false);
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
		if(Ic.mapToBos("err").join()!==""){
			error_msg="Error [2] [err] !== empty_array";
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
