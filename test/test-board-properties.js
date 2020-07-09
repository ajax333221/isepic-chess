//---to do:
//
//...

function fnBoardActive(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.fenGet("8/k7/r7/8/8/2b5/8/K7 w - - 0 1", "Active").Active.checks!==2){
			error_msg="Error [0] get(Active.checks) [8/k7/r7/8/8/2b5/8/K7 w - - 0 1] !== 2";
		}
	//}
	
	if(!error_msg){
		if(Ic.fenGet("8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1", "Active").Active.checks!==0){
			error_msg="Error [1] get(Active.checks) [8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1] !== 0";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.Active",
		fromFile : "test-board-properties.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnBoardMaterialDiff(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(JSON.stringify(Ic.fenGet("k7/1r6/8/p6R/Pp6/8/1RR5/K7 b - - 0 1", "MaterialDiff").MaterialDiff)!==JSON.stringify({w:[4, 4], b:[-1]})){
			error_msg="Error [0] get(MaterialDiff) [fen] !== {w:[4, 4], b:[-1]}";
		}
	//}
	
	if(!error_msg){
		if(JSON.stringify(Ic.fenGet("8/1rr5/nn4k1/2p1P3/2PP4/B5K1/Q1R5/8 w - - 0 1", "MaterialDiff").MaterialDiff)!==JSON.stringify({w:[1, 1, 3, 5], b:[-2, -2, -4]})){
			error_msg="Error [1] get(MaterialDiff) [fen] !== {w:[1, 1, 3, 5], b:[-2, -2, -4]}";
		}
	}
	
	if(!error_msg){
		if(JSON.stringify(Ic.fenGet("8/kr3pn1/qp4p1/p4b1p/P4B1P/QP4P1/KR3PN1/8 w - - 0 1", "MaterialDiff").MaterialDiff)!==JSON.stringify({w:[], b:[]})){
			error_msg="Error [2] get(MaterialDiff) [fen] !== {w:[], b:[]}";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.MaterialDiff",
		fromFile : "test-board-properties.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnBoardIsCheck(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.fenGet("8/k7/r7/8/8/2b5/8/K7 w - - 0 1", "IsCheck").IsCheck!==true){
			error_msg="Error [0] get(IsCheck) [8/k7/r7/8/8/2b5/8/K7 w - - 0 1] !== true";
		}
	//}
	
	if(!error_msg){
		if(Ic.fenGet("8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1", "IsCheck").IsCheck!==false){
			error_msg="Error [1] get(IsCheck) [8/kB4p1/8/2N2P2/8/8/8/K7 b - - 0 1] !== false";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.IsCheck",
		fromFile : "test-board-properties.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnBoardIsCheckmate(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.fenGet("8/8/8/4b3/8/1k6/1B6/K1r5 w - - 0 1", "IsCheckmate").IsCheckmate!==true){
			error_msg="Error [0] get(IsCheckmate) [8/8/8/4b3/8/1k6/1B6/K1r5 w - - 0 1] !== true";
		}
	//}
	
	if(!error_msg){
		if(Ic.fenGet("8/8/8/8/8/1k6/1B6/K1r5 w - - 0 1", "IsCheckmate").IsCheckmate!==false){
			error_msg="Error [1] get(IsCheckmate) [8/8/8/8/8/1k6/1B6/K1r5 w - - 0 1] !== false";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.IsCheckmate",
		fromFile : "test-board-properties.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnBoardIsStalemate(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.fenGet("8/8/8/8/8/1k6/1r6/K7 w - - 0 1", "IsStalemate").IsStalemate!==true){
			error_msg="Error [0] get(IsStalemate) [8/8/8/8/8/1k6/1r6/K7 w - - 0 1] !== true";
		}
	//}
	
	if(!error_msg){
		if(Ic.fenGet("8/8/8/4B3/8/1k6/1r6/K7 w - - 0 1", "IsStalemate").IsStalemate!==false){
			error_msg="Error [1] get(IsStalemate) [8/8/8/4B3/8/1k6/1r6/K7 w - - 0 1] !== false";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.IsStalemate",
		fromFile : "test-board-properties.js",
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
		testName : "board.PPPPP",
		fromFile : "test-board-properties.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}*/
