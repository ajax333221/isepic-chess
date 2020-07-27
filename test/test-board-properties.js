//---to do:
//
//ver si algo ya se hizo en test other
//
//Active.isBlack
//Active.sign
//Active.kingBos
//NonActive.isBlack
//NonActive.sign
//NonActive.kingBos
//NonActive.checks (que sea 0)
//Fen
//WCastling
//BCastling
//EnPassantBos
//HalfMove
//FullMove
//InitialFullMove (siempre igual que full move)
//MoveList (va ser default)
//CurrentMove (va ser default)
//IsRotated (va ser default)
//PromoteTo (va ser default)
//SelectedBos (va ser default)
//IsHidden (va ser default)
//Squares

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

function fnBoardIsThreefold(){
	var i, len, arr, temp, board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_IsThreefold";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [0] failed to initBoard("+board_name+")";
		}
	//}
	
	if(!error_msg){
		arr=[["b1", "c3"], ["b8", "c6"], ["c3", "b1"], ["c6", "b8"], ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"], ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"], ["b1", "c3"], ["b8", "a6"], ["c3", "d5"], ["a6", "b8"], ["d5", "c3"], ["g8", "f6"], ["c3", "b1"], ["h8", "g8"], ["g1", "f3"], ["g8", "h8"], ["f3", "g1"], ["f6", "g8"], ["g1", "f3"], ["g8", "f6"], ["f3", "d4"], ["f6", "d5"], ["d4", "b5"], ["d5", "b4"], ["b5", "a3"], ["b4", "a6"], ["b1", "c3"], ["b8", "c6"], ["a3", "b1"], ["a6", "b8"], ["c3", "e4"], ["c6", "e5"], ["e4", "g5"], ["e5", "g4"], ["g5", "f3"], ["g4", "f6"]];
		
		temp="";
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			board.moveCaller(arr[i][0], arr[i][1]);
			temp+=(board.IsThreefold*1);
		}
		
		for(i=0; i<15; i++){//0...14
			board.moveCaller("h1", "g1");
			temp+=(board.IsThreefold*1);
			
			board.moveCaller("h8", "g8");
			temp+=(board.IsThreefold*1);
			
			board.moveCaller("g1", "h1");
			temp+=(board.IsThreefold*1);
			
			board.moveCaller("g8", "h8");
			temp+=(board.IsThreefold*1);
		}
		
		if(temp!=="000000010001000010100000000000000000000001000000001111111111111111111111111111111111111111111111111111"){
			error_msg="Error [1] draw by threefold repetition";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.IsThreefold",
		fromFile : "test-board-properties.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnBoardIsFiftyMove(){
	var i, len, arr, temp, board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_IsFiftyMove";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [0] failed to initBoard("+board_name+")";
		}
	//}
	
	if(!error_msg){
		arr=[["b1", "c3"], ["b8", "c6"], ["c3", "b1"], ["c6", "b8"], ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"], ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"], ["b1", "c3"], ["b8", "a6"], ["c3", "d5"], ["a6", "b8"], ["d5", "c3"], ["g8", "f6"], ["c3", "b1"], ["h8", "g8"], ["g1", "f3"], ["g8", "h8"], ["f3", "g1"], ["f6", "g8"], ["g1", "f3"], ["g8", "f6"], ["f3", "d4"], ["f6", "d5"], ["d4", "b5"], ["d5", "b4"], ["b5", "a3"], ["b4", "a6"], ["b1", "c3"], ["b8", "c6"], ["a3", "b1"], ["a6", "b8"], ["c3", "e4"], ["c6", "e5"], ["e4", "g5"], ["e5", "g4"], ["g5", "f3"], ["g4", "f6"]];
		
		temp="";
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			board.moveCaller(arr[i][0], arr[i][1]);
			temp+=(board.IsFiftyMove*1);
		}
		
		for(i=0; i<15; i++){//0...14
			board.moveCaller("h1", "g1");
			temp+=(board.IsFiftyMove*1);
			
			board.moveCaller("h8", "g8");
			temp+=(board.IsFiftyMove*1);
			
			board.moveCaller("g1", "h1");
			temp+=(board.IsFiftyMove*1);
			
			board.moveCaller("g8", "h8");
			temp+=(board.IsFiftyMove*1);
		}
		
		if(temp!=="000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111"){
			error_msg="Error [1] draw by fifty-move rule";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.IsFiftyMove",
		fromFile : "test-board-properties.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnBoardIsInsufficientMaterial(){
	var i, len, arr, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		arr=["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "K6k/8/8/8/8/8/8/3BB3 w - - 0 1", "K6k/8/8/8/8/8/8/3BB3 b - - 0 1", "K6k/8/8/8/8/8/8/3bb3 w - - 0 1", "K6k/8/8/8/8/8/8/3bb3 b - - 0 1", "K6k/8/8/8/8/8/2bBb3/8 w - - 0 1", "K6k/8/8/8/8/8/2bBb3/8 b - - 0 1", "K6k/8/8/8/8/8/2BbB3/8 w - - 0 1", "K6k/8/8/8/8/8/2BbB3/8 b - - 0 1", "K6k/8/8/8/8/3Nb3/8/8 w - - 0 1", "K6k/8/8/8/8/3Nn3/8/8 w - - 0 1", "K6k/8/8/8/8/3NB3/8/8 w - - 0 1", "K6k/8/8/8/8/3NN3/8/8 w - - 0 1", "K6k/8/8/8/4P3/8/8/8 w - - 0 1", "K6k/8/8/8/4p3/8/8/8 w - - 0 1", "K6k/8/8/8/4R3/8/8/8 w - - 0 1", "K6k/8/8/8/4r3/8/8/8 w - - 0 1", "K6k/8/8/8/8/8/8/4Q3 w - - 0 1", "K6k/8/8/8/8/8/8/4q3 w - - 0 1"];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			if(Ic.fenGet(arr[i], "IsInsufficientMaterial").IsInsufficientMaterial!==false){
				error_msg="Error [0] get(IsInsufficientMaterial) arr["+i+"] !== false";
			}
		}
	//}
	
	if(!error_msg){
		arr=["K6k/8/8/8/8/8/8/8 w - - 0 1", "K6k/8/8/8/8/3N4/8/8 w - - 0 1", "K6k/8/8/8/8/3N4/8/8 b - - 0 1", "K6k/8/8/8/8/3n4/8/8 w - - 0 1", "K6k/8/8/8/8/3n4/8/8 b - - 0 1", "K6k/8/8/8/8/3B4/8/8 w - - 0 1", "K6k/8/8/8/8/3B4/8/8 b - - 0 1", "K6k/8/8/8/8/3b4/8/8 w - - 0 1", "K6k/8/8/8/8/3b4/8/8 b - - 0 1", "K6k/8/8/8/8/3B4/2B5/1B6 w - - 0 1", "K6k/8/8/8/8/3B4/2B5/1B6 b - - 0 1", "K6k/8/8/8/8/3b4/2b5/1b6 w - - 0 1", "K6k/8/8/8/8/3b4/2b5/1b6 b - - 0 1", "K6k/8/8/8/8/3b4/2b1B3/1b1B4 w - - 0 1", "K6k/8/8/8/8/3b4/2b1B3/1b1B4 b - - 0 1", "K6k/8/8/8/8/4B3/3B4/2B5 w - - 0 1", "K6k/8/8/8/8/4B3/3B4/2B5 b - - 0 1", "K6k/8/8/8/8/4b3/3b4/2b5 w - - 0 1", "K6k/8/8/8/8/4b3/3b4/2b5 b - - 0 1", "K6k/8/8/8/8/4b3/3b1B2/2b1B3 w - - 0 1", "K6k/8/8/8/8/4b3/3b1B2/2b1B3 b - - 0 1"];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			if(Ic.fenGet(arr[i], "IsInsufficientMaterial").IsInsufficientMaterial!==true){
				error_msg="Error [1] get(IsInsufficientMaterial) arr["+i+"] !== true";
			}
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "board.IsInsufficientMaterial",
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
