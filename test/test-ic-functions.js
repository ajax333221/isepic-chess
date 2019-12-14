//toVal
//toAbsVal
//toBal
//toAbsBal
//toPieceClass
//toBos
//toPos
//getSign
//getRankPos
//getFilePos
//getRankBos
//getFileBos
//isInsideBoard
//sameSquare
//mapToBos
//---
//initBoard
//---
//getBoardCount
//getBoardNames
//boardExists
//selectBoard
//removeBoard
//isEqualBoard
//cloneBoard
//---
//countChecks [init, remove]
//isCheck [init, remove]
//legalMoves [init, remove]
//isLegalMove [init, remove]
//isLegalFen [init, remove]
//isCheckmate [init, remove]
//isStalemate [init, remove]

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
		result : (error_msg || "Ok"),
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
		result : (error_msg || "Ok"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}
