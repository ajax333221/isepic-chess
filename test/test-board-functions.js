//---to do:
//
//[### ya via fenApply() ###] _getValue
//_setValue
//[### ya via fenApply() ###] _materialDifference
//_calculateChecks
//_toggleActiveColor // + hacer con fen W to move, luego otro fen B to move pero toggle y comparar por fen. . + otro test de toggle x2 = mismo hash
//_toggleIsRotated //test con board hash. + otro test de toggle x2 = mismo hash
//_setPromoteTo
//_setCurrentMove
//_giveSquareMovement
//_resetPieceClasses
//[N/A] _getMoveListHTML
//[N/A] _getObjInfoHTML
//_refreshBoard
//_firstTimeDefaults
//_parseValuesFromFen
//_readFen
//_refreshKingPosChecksAndFen
//_refinedFenTest
//_candidateMoves
//_isAttacked
//_disambiguationPos
//_testCollision
//[### ya via fenApply() ###] _legalMoves
//[### ya via fenApply() ###] _isLegalMove
//_ascii
//_cloneBoardFrom
//_cloneBoardTo
//_moveCaller
//_makeMove
//_getNotation

function fnBoardBoardHash(){
	var board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_boardHash";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		board=Ic.initBoard({
			name : board_name,
			fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(board===null){
			error_msg="Error [0] failed to initBoard("+board_name+")";
		}
	//}
	
	if(!error_msg){
		if(board.boardHash()!==-2050605511){
			error_msg="Error [1] wrong hash for default fen (+ isHidden prop)";
		}
	}
	
	if(!error_msg){
		board.moveCaller("a2", "a4");
		
		if(board.boardHash()!==1622221508){
			error_msg="Error [2] wrong hash for board after a2-a4";
		}
	}
	
	if(Ic.selectBoard(board)!==null){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.boardHash()",
		fromFile : "test-board-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnBoardIsEqualBoard(){
	var board, board_name, board_copy, board_copy_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_isEqualB";
	board_copy_name="board_isEqualB_copy";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		board=Ic.initBoard({
			name : board_name,
			fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(board===null){
			error_msg="Error [0] failed to initBoard("+board_name+")";
		}
	//}
	
	if(!error_msg){
		board_copy=Ic.initBoard({
			name : board_copy_name
		});
		
		if(board_copy===null){
			error_msg="Error [1] failed to initBoard("+board_copy_name+")";
		}
	}
	
	if(!error_msg){
		Ic.cloneBoard(board_copy, board);
		
		if(board.isEqualBoard(board_copy)!==true){
			error_msg="Error [2] two equal boards not showing positive equality (x to x_copy)";
		}
	}
	
	if(!error_msg){
		if(board_copy.isEqualBoard(board)!==true){
			error_msg="Error [3] two equal boards not showing positive equality (x_copy to x)";
		}
	}
	
	if(!error_msg){
		if(board.isEqualBoard(board)!==true){
			error_msg="Error [4] board not showing positive equality to itself (x)";
		}
	}
	
	if(!error_msg){
		if(board_copy.isEqualBoard(board_copy)!==true){
			error_msg="Error [5] board not showing positive equality to itself (x_copy)";
		}
	}
	
	if(!error_msg){
		board.moveCaller("a2", "a4");
		
		if(board.isEqualBoard(board_copy)!==false){
			error_msg="Error [6] different boards returning positive equality (x to x_copy)";
		}
	}
	
	if(!error_msg){
		if(board_copy.isEqualBoard(board)!==false){
			error_msg="Error [7] different boards returning positive equality (x_copy to x)";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("a2", "a4");
		
		if(board.isEqualBoard(board_copy)!==true){
			error_msg="Error [8] two equal boards not showing positive equality (x to x_copy)";
		}
	}
	
	if(!error_msg){
		if(board_copy.isEqualBoard(board)!==true){
			error_msg="Error [9] two equal boards not showing positive equality (x_copy to x)";
		}
	}
	
	if(Ic.selectBoard(board)!==null){
		Ic.removeBoard(board);
	}
	
	if(Ic.selectBoard(board_copy)!==null){
		Ic.removeBoard(board_copy);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.isEqualBoard()",
		fromFile : "test-board-functions.js",
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
		testName : "board.AAAAA()",
		fromFile : "test-board-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}*/
