//---to do:
//
//mover cosas de aqui a sus correspondientes test

function testDisambiguation(){
	var board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_testDis";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "6k1/8/8/2B1B3/8/2BKB2r/8/8 w - - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [0] failed to initBoard("+board_name+")";
		}
	//}
	
	if(!error_msg){
		board.moveCaller("c3", "d4");
		board.moveCaller("h3", "g3");
		board.moveCaller("d4", "c3");
		board.moveCaller("g3", "h3");
		board.moveCaller("e5", "d4");
		board.moveCaller("h3", "f3");
		board.moveCaller("d4", "e5");
		board.moveCaller("f3", "g3");
		board.moveCaller("c5", "d4");
		
		if((board.MoveList[1].PGNmove+board.MoveList[5].PGNmove+board.MoveList[9].PGNmove)!=="B3d4Bed4Bc5d4"){
			error_msg="Error [1] "+(board.MoveList[1].PGNmove+board.MoveList[5].PGNmove+board.MoveList[9].PGNmove)+" !== B3d4Bed4Bc5d4";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "testDisambiguation()",
		fromFile : "test-other.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function testBasicFunctionality(){
	var board, board_name, board_copy, board_copy_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_testBas";
	board_copy_name="board_testBas_copy";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			isRotated : true,
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [0] failed to initBoard("+board_name+")";
		}
	//}
	
	if(!error_msg){
		board.moveCaller("e2", "e4");
		board.moveCaller("f7", "f5");
		board.moveCaller("d1", "h5");
		
		if(board.Active.checks!==1){
			error_msg="Error [1] checks";
		}
	}
	
	if(!error_msg){
		if(board.legalMoves("g7").join("")!=="2,6"){
			error_msg="Error [2] remove check via pawn blocking";
		}
	}
	
	if(!error_msg){
		if(JSON.stringify(board.MoveList)!=="[{\"Fen\":\"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\",\"PGNmove\":\"\",\"PGNend\":\"\",\"FromBos\":\"\",\"ToBos\":\"\",\"InitialVal\":0,\"FinalVal\":0,\"KingCastled\":0},{\"Fen\":\"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1\",\"PGNmove\":\"e4\",\"PGNend\":\"\",\"FromBos\":\"e2\",\"ToBos\":\"e4\",\"InitialVal\":1,\"FinalVal\":1,\"KingCastled\":0},{\"Fen\":\"rnbqkbnr/ppppp1pp/8/5p2/4P3/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 2\",\"PGNmove\":\"f5\",\"PGNend\":\"\",\"FromBos\":\"f7\",\"ToBos\":\"f5\",\"InitialVal\":-1,\"FinalVal\":-1,\"KingCastled\":0},{\"Fen\":\"rnbqkbnr/ppppp1pp/8/5p1Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2\",\"PGNmove\":\"Qh5+\",\"PGNend\":\"\",\"FromBos\":\"d1\",\"ToBos\":\"h5\",\"InitialVal\":5,\"FinalVal\":5,\"KingCastled\":0}]"){
			error_msg=JSON.stringify(board.MoveList);
		}
	}
	
	if(!error_msg){
		board.moveCaller("g7", "g6");
		board.moveCaller("h5", "g6");
		
		if(board.legalMoves("h7").join("")!=="2,6"){
			error_msg="Error [4] remove check via pawn capture";
		}
	}
	
	if(!error_msg){
		board.moveCaller("h7", "g6");
		board.moveCaller("f1", "b5");
		board.moveCaller("h8", "h2");
		board.moveCaller("b5", "d7");
		
		if((board.legalMoves("b8").join("")+board.legalMoves("c8").join("")+board.legalMoves("d8").join("")+board.legalMoves("e8").join(""))!=="1,31,31,31,51,3"){
			error_msg="Error [5] remove check via (knight, bishop, queen, king) capture and via (king) moving out of check";
		}
	}
	
	if(!error_msg){
		board.moveCaller("e8", "f7");
		board.moveCaller("e4", "f5");
		board.moveCaller("h2", "h6");
		board.moveCaller("g1", "f3");
		board.moveCaller("a7", "a5");
		board.moveCaller("f5", "g6");
		board.moveCaller("f7", "f6");
		board.moveCaller("g6", "g7");
		board.moveCaller("a8", "a6");
		board.moveCaller("d7", "e8");
		board.moveCaller("f6", "f5");
		board.moveCaller("e8", "f7");
		board.moveCaller("h6", "c6");
		
		board.setPromoteTo(4);
		
		board.moveCaller("g7", "f8");
		
		if(board.MoveList[board.MoveList.length-1].PGNmove!=="gxf8=R"){
			error_msg="Error [6] underpromote to rook";
		}
	}
	
	if(!error_msg){
		board.moveCaller("a5", "a4");
		board.moveCaller("f7", "g6");
		
		if(board.Active.checks!==2){
			error_msg="Error [7] two active checks via discovered check";
		}
	}
	
	if(!error_msg){
		board.moveCaller("f5", "g6");
		board.moveCaller("e1", "g1");
		
		if(board.legalMoves("a4").join("")!=="5,0"){
			error_msg="Error [8] prevent pawn capture moving forward";
		}
	}
	
	if(!error_msg){
		if(board.legalMoves("e4").join("")!==""){
			error_msg="Error [9] wrong legal moves for empty square";
		}
	}
	
	if(!error_msg){
		board.moveCaller("a6", "b6");
		
		if(board.MoveList[board.MoveList.length-1].PGNmove!=="Rab6"){
			error_msg="Error [10] pgn disambiguation";
		}
	}
	
	if(!error_msg){
		if(board.legalMoves("b2").join("")!=="5,14,1"){
			error_msg="Error [11] pawn can move two squares";
		}
	}
	
	if(!error_msg){
		board.moveCaller("b2", "b4");
		
		if(board.legalMoves("a4").join("")!=="5,05,1"){
			error_msg="Error [12] pawn can capture enpassant or move";
		}
	}
	
	if(!error_msg){
		board.moveCaller("c6", "f6");
		
		if(board.legalMoves("f8").join("")!=="0,61,52,50,40,3"){
			error_msg="Error [13] rook movement with capture";
		}
	}
	
	if(!error_msg){
		if(board.legalMoves("b1").join("")!=="5,25,0"){
			error_msg="Error [14] knight movement, prevent capture ally";
		}
	}
	
	if(!error_msg){
		board.moveCaller("a2", "a3");
		
		if(board.legalMoves("a4").join("")!==""){
			error_msg="Error [15] prevent pawn capture moving forward(again) and no enpassant";
		}
	}
	
	if(!error_msg){
		board.moveCaller("b6", "a6");
		
		if(board.MoveList[board.MoveList.length-1].PGNmove!=="Ra6"){
			error_msg="Error [16] no pgn disambiguation needed";
		}
	}
	
	if(!error_msg){
		if(board.legalMoves("b4").join("")!=="3,1"){
			error_msg="Error [17] pawn can only move one square forward";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "r3k2r/pppq1ppp/2npb3/2b1N3/2B1n3/2NPB3/PPPQ1PPP/R3K2R w KQkq - 4 9",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [18] failed to initBoard("+board_name+")";
		}
	}
	
	if(!error_msg){
		board_copy=Ic.initBoard({
			boardName : board_copy_name
		});
		
		if(Ic.boardExists(board_copy)!==true){
			error_msg="Error [19] failed to initBoard("+board_copy_name+")";
		}
	}
	
	if(!error_msg){
		Ic.cloneBoard(board_copy, board);
		
		if(!Ic.boardExists(board_copy)){
			error_msg="Error [20] failed to cloneBoard()";
		}
	}
	
	if(!error_msg){
		if((board_copy.WCastling+" "+board_copy.BCastling)!=="3 3"){
			error_msg="Error [21] incorrect castling values for KQkq";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("h1", "g1");
		
		if((board_copy.WCastling+" "+board_copy.BCastling)!=="2 3"){
			error_msg="Error [22] incorrect castling values for Qkq";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("h8", "g8");
		
		if((board_copy.WCastling+" "+board_copy.BCastling)!=="2 2"){
			error_msg="Error [23] incorrect castling values for Qq";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("a1", "b1");
		
		if((board_copy.WCastling+" "+board_copy.BCastling)!=="0 2"){
			error_msg="Error [24] incorrect castling values for q";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("a8", "b8");
		
		if((board_copy.WCastling+" "+board_copy.BCastling)!=="0 0"){
			error_msg="Error [25] incorrect castling values for no castling rights";
		}
	}
	
	if(!error_msg){
		Ic.cloneBoard(board_copy, board);
		
		board_copy.moveCaller("e1", "e2");
		
		if((board_copy.WCastling+" "+board_copy.BCastling)!=="0 3"){
			error_msg="Error [26] incorrect castling values for no castling rights via white king move";
		}
	}
	
	if(!error_msg){
		Ic.cloneBoard(board_copy, board);
		
		board_copy.moveCaller("a1", "d1");
		board_copy.moveCaller("e8", "e7");
		
		if((board_copy.WCastling+" "+board_copy.BCastling)!=="1 0"){
			error_msg="Error [27] incorrect castling values for no castling rights via black king move";
		}
	}
	
	if(!error_msg){
		Ic.cloneBoard(board_copy, board);
		
		board_copy.moveCaller("e5", "d7");
		board_copy.moveCaller("e4", "g3");
		board_copy.moveCaller("d7", "b6");
		board_copy.moveCaller("g3", "h1");
		board_copy.moveCaller("b6", "a8");
		board_copy.moveCaller("h1", "g3");
		board_copy.moveCaller("a8", "b6");
		
		if((board_copy.WCastling+" "+board_copy.BCastling)!=="2 1"){
			error_msg="Error [28] castling values remained after rook capture";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "r3k2r/4p3/3B1P2/2NpN1N1/1Pn1n1n1/3b1p2/4P3/R3K2R w KQkq - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		Ic.cloneBoard(board_copy, board);
		
		if(Ic.mapToBos(board_copy.legalMoves(board_copy.Active.kingBos)).join()!=="f1,d1,g1,c1"){
			error_msg="Error [29] incorrect white castling moves";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("b4", "b5");
		
		if(Ic.mapToBos(board_copy.legalMoves(board_copy.Active.kingBos)).join()!=="f8,d8,g8,c8"){
			error_msg="Error [30] incorrect black castling moves";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("c4", "d2");
		
		if(Ic.mapToBos(board_copy.legalMoves(board_copy.Active.kingBos)).join()!=="d1,c1"){
			error_msg="Error [31] long castle incorrectly prevented by attack on b square";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("d6", "e7");
		
		if(Ic.mapToBos(board_copy.legalMoves(board_copy.Active.kingBos)).join()!==""){
			error_msg="Error [32] castle not being prevented via first square";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("d2", "b1");
		
		if(Ic.mapToBos(board_copy.legalMoves(board_copy.Active.kingBos)).join()!=="f1,d1,g1"){
			error_msg="Error [33] allowing to long castle with b1 occupied";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("g5", "h3");
		board_copy.moveCaller("b1", "d2");
		board_copy.moveCaller("h3", "g5");
		board_copy.moveCaller("d2", "f1");
		
		if(Ic.mapToBos(board_copy.legalMoves(board_copy.Active.kingBos)).join()!=="f1,d1,c1"){
			error_msg="Error [34] allowing to short castle with f1 occupied";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("g5", "h3");
		board_copy.moveCaller("f1", "d2");
		board_copy.moveCaller("h3", "g5");
		board_copy.moveCaller("g4", "e3");
		
		if(Ic.mapToBos(board_copy.legalMoves(board_copy.Active.kingBos)).join()!==""){
			error_msg="Error [35] allowing to long castle with d1 attacked";
		}
	}
	
	if(!error_msg){
		Ic.cloneBoard(board_copy, board);
		
		board_copy.moveCaller("f6", "f7");
		
		if(Ic.mapToBos(board_copy.legalMoves(board_copy.Active.kingBos)).join()!=="f8,d8"){
			error_msg="Error [36] allowing to castle with black king at check";
		}
	}
	
	if(!error_msg){
		Ic.cloneBoard(board_copy, board);
		
		board_copy.moveCaller("b4", "b5");
		board_copy.moveCaller("c4", "a3");
		board_copy.moveCaller("b5", "b6");
		board_copy.moveCaller("a3", "c2");
		
		if(Ic.mapToBos(board_copy.legalMoves(board_copy.Active.kingBos)).join()!=="f1,d1"){
			error_msg="Error [37] whie king trying to castle being at check";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "8/1k1PPPPP/8/8/8/8/1K1ppppp/5R2 w - - 0 1",
			isHidden : true,
			promoteTo : 4,
			invalidFenStop : true
		});
		
		Ic.cloneBoard(board_copy, board);
		board_copy.setPromoteTo("B");
		
		board.moveCaller("h7", "h8");
		
		if(board.getSquare("h8").val!==4){
			error_msg="Error [38] incorrect promotion to wr";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("h7", "h8");
		
		if(board_copy.getSquare("h8").val!==3){
			error_msg="Error [39] failed to setPromoteTo()";
		}
	}
	
	if(!error_msg){
		board_copy.moveCaller("e2", "f1");
		
		if(board_copy.getSquare("f1").val!==-3){
			error_msg="Error [40] wrong promotion color";
		}
	}
	
	if(!error_msg){
		if(Ic.fenApply("8/8/1k6/8/2pP4/8/8/6BK b - d3 0 1", "isLegalMove", ["c4", "d3"])){
			error_msg="Error [41] taking enpassant results in self check";
		}
	}
	
	if(!error_msg){
		if(!Ic.fenApply("8/8/8/3k4/3pP3/8/8/7K b - e3 0 1", "isLegalMove", ["d4", "e3"])){
			error_msg="Error [42] missing option to remove check via enpassant";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "8/8/7k/6pP/5BKR/8/8/8 w - g6 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		board.moveCaller("h5", "g6");
		
		if(board.Active.checks!==2){
			error_msg="Error [43] wrong double check to enpassant capture";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("")!==Ic.toBal("").toUpperCase()){
			error_msg="Error [47] toAbsBal() !== toBal().toUpperCase()";
		}
	}
	
	if(!error_msg){
		if(Ic.toAbsBal("r")!==Ic.toBal("r").toUpperCase()){
			error_msg="Error [48] toAbsBal() !== toBal().toUpperCase()";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "k7/8/K7/Q7/8/8/8/8 w - - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		Ic.cloneBoard(board_copy, board);
		
		board_copy.moveCaller("a5", "d8");
		
		if(board_copy.MoveList[1].PGNmove!=="Qd8#"){
			error_msg="Error [49] wrong PGNmove for white checkmate Qd8#";
		}
	}
	
	if(!error_msg){
		if(board_copy.MoveList[1].PGNend!=="1-0"){
			error_msg="Error [50] wrong PGNend for white win 1-0";
		}
	}
	
	if(!error_msg){
		Ic.cloneBoard(board_copy, board);
		
		board_copy.moveCaller("a5", "c7");
		
		if(board_copy.MoveList[1].PGNmove!=="Qc7"){
			error_msg="Error [51] wrong PGNmove for white stalemate";
		}
	}
	
	if(!error_msg){
		if(board_copy.MoveList[1].PGNend!=="1/2-1/2"){
			error_msg="Error [52] wrong PGNend for white stalemate 1/2-1/2";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "8/8/8/8/7q/7k/8/7K b - - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		Ic.cloneBoard(board_copy, board);
		
		board_copy.moveCaller("h4", "e1");
		
		if(board_copy.MoveList[1].PGNmove!=="Qe1#"){
			error_msg="Error [53] wrong PGNmove for black checkmate Qe1#";
		}
	}
	
	if(!error_msg){
		if(board_copy.MoveList[1].PGNend!=="0-1"){
			error_msg="Error [54] wrong PGNend for black win 0-1";
		}
	}
	
	if(!error_msg){
		Ic.cloneBoard(board_copy, board);
		
		board_copy.moveCaller("h4", "f2");
		
		if(board_copy.MoveList[1].PGNmove!=="Qf2"){
			error_msg="Error [55] wrong PGNmove for black stalemate";
		}
	}
	
	if(!error_msg){
		if(board_copy.MoveList[1].PGNend!=="1/2-1/2"){
			error_msg="Error [56] wrong PGNend for black stalemate 1/2-1/2";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	if(Ic.boardExists(board_copy)){
		Ic.removeBoard(board_copy);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "testBasicFunctionality()",
		fromFile : "test-other.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function testFenPositions(){
	var i, len, invalid_positions, start_time, end_time, error_msg;
	
	error_msg="";
	
	invalid_positions=["",
	"hi",
	"8/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1",
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KkQq - 0 1",
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ - 0 1",
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kqky - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e4 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e9 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq x5 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNRw KQkq - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR wKQkq - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq- 0 1",
	"8/8/8/8/8/8/8/8 b - - 0 1",
	"8/7k/8/8/8/8/8/8 b - - 0 1",
	"8/7K/8/8/8/8/8/8 b - - 0 1",
	"8/K6K/8/8/8/7k/8/8 b - - 0 1",
	"8/k6k/8/8/8/7K/8/8 b - - 0 1",
	"P7/8/7K/8/8/7k/8/8 b - - 0 1",
	"p7/8/7K/8/8/7k/8/8 b - - 0 1",
	"8/8/7K/8/8/7k/8/p7 b - - 0 1",
	"8/8/7K/8/8/7k/8/P7 b - - 0 1",
	"p7/8/7K/8/8/7k/8/P7 b - - 0 1",
	"P7/8/7K/8/8/7k/8/p7 b - - 0 1",
	"8/8/61K/8/8/7k/8/8 b - - 0 1",
	"8/8/K32P1/8/8/7k/8/8 b - - 0 1",
	"8/8/1K51/8/8/7k/8/8 b - - 0 1",
	"8/8/8K/8/8/7k/8/8 b - - 0 1",
	"8/8/K8/8/8/7k/8/8 b - - 0 1",
	"R7R/8/K7/8/8/7k/8/8 b - - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/1P6/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/1p6/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/pppppppp/8/8/8/R7/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/pppppppp/8/8/8/r7/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/7B/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/7b/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPNPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPnPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/1ppppppp/p7/8/7Q/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1",
	"rnbqkbnr/1ppppppp/p7/8/7q/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1",
	"4k3/2pppppp/8/8/8/B7/BBBPPPPP/1B2KRRR w - - 0 1",
	"4k3/2pppppp/8/8/8/B7/BBBPPPPP/1B2KRQQ w - - 0 1",
	"rnbqkbnr/pppp1ppp/8/4p3/8/PP6/1NPRPPBR/RNBQKBNR w KQkq - 0 1",
	"8/8/4R3/2K5/3N2B1/8/4k3/8 b - - 0 1",
	"8/7q/8/1k1p4/4K3/6n1/8/8 w - - 0 1",
	"8/7q/5n2/1k1p4/4K3/6n1/8/4r3 w - - 0 1",
	"8/8/8/1K6/5k2/6P1/8/8 w - - 0 1",
	"8/8/8/1K6/1r3k2/8/8/8 b - - 0 1",
	"8/8/8/1K6/1r3k2/6P1/8/8 b - - 0 1",
	"8/8/8/1K6/1r3k2/6P1/8/8 w - - 0 1",
	"8/8/4N3/1K6/5k2/8/8/8 w - - 0 1",
	"8/8/4K3/4k3/8/8/8/8 w - - 0 1",
	"8/8/2K5/8/6P1/2k5/8/8 w - g3 0 1",
	"8/8/2K5/6p1/6P1/2k5/8/8 b - g6 0 1",
	"8/8/2K5/8/8/2k5/8/8 w - g6 0 1",
	"8/8/2K3N1/6p1/8/2k5/8/8 w - g6 0 1",
	"8/8/2K3N1/6p1/6P1/2k3n1/8/8 b - g3 0 1",
	"8/8/2K5/8/6p1/2k5/8/8 w - g3 0 1",
	"8/8/2K5/8/6p1/2k5/8/8 b - g3 0 1",
	"8/8/2K5/6P1/8/2k5/8/8 w - g6 0 1",
	"8/8/2K5/6P1/8/2k5/8/8 b - g6 0 1",
	"8/7P/2k4P/7P/7P/2K4P/7P/8 w - - 0 1",
	"8/P7/P1k5/P7/P7/P1K5/P7/8 w - - 0 1",
	"3knbnr/2pppppp/8/P7/P7/P3K3/P7/8 w - - 0 1",
	"8/7p/2k4p/7p/7p/7p/PPPPPP2/K7 w - - 0 1",
	"rnbq1rk1/ppppppbp/5np1/8/8/4P3/PPPPP1PP/4K3 w - - 0 1",
	"rnbq1rk1/1pppppbp/5np1/8/4P3/4P3/PPP1P1PP/4K3 w - - 0 1",
	"rnbq1rk1/3pppbp/5np1/4P3/4P3/4P3/PP2P1PP/4K3 w - - 0 1",
	"4K3/8/8/8/8/4k3/8/8 w KQ - 0 1",
	"8/4K3/8/8/8/8/8/4k3 w kq - 0 1",
	"8/8/2k5/8/8/8/8/4K2R w Q - 0 1",
	"8/8/2k5/8/8/8/8/r3K3 w K - 0 1",
	"8/8/2k5/8/8/8/8/4K3 w K - 0 1",
	"8/8/2k5/8/8/8/8/4K3 w Q - 0 1",
	"8/8/2k5/8/8/8/8/4K3 w KQ - 0 1",
	"4K3/8/2k5/8/8/8/8/R6R w KQ - 0 1",
	"r6r/8/8/8/2K5/8/8/4k3 w kq - 0 1",
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 0",
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 1 1",
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 00 1",
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 5 3",
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -0 1",
	"rnbqkb1r/pppppppp/8/8/3N1n2/8/PPPPPPPP/RNBQKB1R b KQkq - 8 4",
	"rnbqkb1r/pppppppp/8/5N2/5n2/8/PPPPPPPP/RNBQKB1R w KQkq - 7 4"];
	
	start_time=new Date().getTime();
	
	for(i=0, len=invalid_positions.length; i<len; i++){//0<len
		Ic.setSilentMode(true);
		
		if(Ic.fenApply(invalid_positions[i], "isLegalFen")){
			error_msg="Error ["+i+"] \""+invalid_positions[i]+"\" wasn't caught";
			break;
		}
		
		Ic.setSilentMode(false);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "testFenPositions()",
		fromFile : "test-other.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function testSpecificCases(){
	var i, len, arr, temp, temp2, board, board_name, start_time, end_time, error_msg;
	
	error_msg="";
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
		temp=Ic.toPos(board.Squares["a2"].pos);
		
		if((temp===Ic.toPos(board.Squares["a2"].pos).sort())!==false){
			error_msg="Error [1] Ic.toPos() returns a reference";
		}
	}
	
	if(!error_msg){
		temp=board.getSquare("b2", {isUnreferenced : false});
		temp2=board.getSquare("b2", {isUnreferenced : true});
		
		board.moveCaller("b2", "b3");
		board.moveCaller("h7", "h6");
		board.moveCaller("c1", "b2");
		
		if((temp.isBishop+","+temp2.isPawn)!=="true,true"){
			error_msg="Error [2] b.getSquare() isUnreferenced not working";
		}
	}
	
	if(!error_msg){
		if(Ic.mapToBos(Ic.fenApply("r1b1kbnr/ppp3pp/3q4/P2nPp2/3p4/7K/1PP2PP1/RNBQ1BNR w kq f6 0 10", "legalMoves", ["e5"])).length!==2){
			error_msg="Error [3] enpassant capture applied to other non enpassant moves";
		}
	}
	
	if(!error_msg){
		if(Ic.toVal([5])!==0){
			error_msg="Error [4] array in Ic.toVal() should default to 0";
		}
	}
	
	if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			isHidden : true,
			invalidFenStop : true
		});
		
		if(Ic.boardExists(board)!==true){
			error_msg="Error [5] failed to initBoard("+board_name+")";
		}
	}
	
	if(!error_msg){
		arr=[["b1", "c3"], ["b8", "c6"], ["c3", "b1"], ["c6", "b8"], ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"], ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"], ["b1", "c3"], ["b8", "a6"], ["c3", "d5"], ["a6", "b8"], ["d5", "c3"], ["g8", "f6"], ["c3", "b1"], ["h8", "g8"], ["g1", "f3"], ["g8", "h8"], ["f3", "g1"], ["f6", "g8"], ["g1", "f3"], ["g8", "f6"], ["f3", "d4"], ["f6", "d5"], ["d4", "b5"], ["d5", "b4"], ["b5", "a3"], ["b4", "a6"], ["b1", "c3"], ["b8", "c6"], ["a3", "b1"], ["a6", "b8"], ["c3", "e4"], ["c6", "e5"], ["e4", "g5"], ["e5", "g4"], ["g5", "f3"], ["g4", "f6"]];
		
		temp="";
		temp2="";
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			board.moveCaller(arr[i][0], arr[i][1]);
			temp+=(board.IsThreefold*1);
			temp2+=(board.IsFiftyMove*1);
		}
		
		for(i=0; i<15; i++){//0...14
			board.moveCaller("h1", "g1");
			temp+=(board.IsThreefold*1);
			temp2+=(board.IsFiftyMove*1);
			
			board.moveCaller("h8", "g8");
			temp+=(board.IsThreefold*1);
			temp2+=(board.IsFiftyMove*1);
			
			board.moveCaller("g1", "h1");
			temp+=(board.IsThreefold*1);
			temp2+=(board.IsFiftyMove*1);
			
			board.moveCaller("g8", "h8");
			temp+=(board.IsThreefold*1);
			temp2+=(board.IsFiftyMove*1);
		}
		
		if((temp+" x "+temp2)!=="000000010001000010100000000000000000000001000000001111111111111111111111111111111111111111111111111111 x 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111"){
			error_msg="Error [6] draw by threefold repetition or fifty-move rule";
		}
	}
	
	if(Ic.boardExists(board)){
		Ic.removeBoard(board);
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "testSpecificCases()",
		fromFile : "test-other.js",
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
		testName : "testAAAAA()",
		fromFile : "test-other.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}*/
