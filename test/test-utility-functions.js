//---to do:
//
//se ocupara en clone? (en uso) to_board.MaterialDiff={w:[], b:[]};
//se ocupara el slice? (en uso) to_prop[sub_keys[j]].pos=from_prop[sub_keys[j]].pos.slice(0);
//se ocupara en clone? (no existe) to_prop[sub_keys[j]]=Object.create(null);
//
//[N/A?] _consoleLog()

function fnIcUtilityTrimSpaces(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.utilityMisc.trimSpaces("  abc")!=="abc"){
			error_msg="Error [0] left space";
		}
	//}
	
	if(!error_msg){
		if(Ic.utilityMisc.trimSpaces("abc  ")!=="abc"){
			error_msg="Error [1] right space";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.trimSpaces("a  b  c")!=="a b c"){
			error_msg="Error [2] duplicated to single";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.trimSpaces("  a  b c ")!=="a b c"){
			error_msg="Error [3] left + right + duplicated";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.trimSpaces(" ")!==""){
			error_msg="Error [4] space to empty";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.trimSpaces("     ")!==""){
			error_msg="Error [5] multiple spaces to empty";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.trimSpaces("")!==""){
			error_msg="Error [6] empty to empty";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.trimSpaces("x"*9)!=="NaN"){
			error_msg="Error [7] NaN";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.trimSpaces([, 2, " ", null, "", "  ", Infinity, "  a  b  ", ("x"*9)])!==",2, ,,, ,Infinity, a b ,NaN"){
			error_msg="Error [8] array with non strings";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.trimSpaces()!=="undefined"){
			error_msg="Error [9] no parameter";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.utilityMisc.trimSpaces()",
		fromFile : "test-utility-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcUtilityFormatName(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.utilityMisc.formatName(" a  Bc ")!=="a_Bc"){
			error_msg="Error [0] left + right + duplicated";
		}
	//}
	
	if(!error_msg){
		if(Ic.utilityMisc.formatName("0ñ2(4) á")!=="0_2_4___"){
			error_msg="Error [1] non alphanumeric";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.formatName(" ")!==""){
			error_msg="Error [2] single space";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.formatName("")!==""){
			error_msg="Error [3] empty space";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.formatName("ñ")!=="_"){
			error_msg="Error [4] single non alphanumeric";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.utilityMisc.formatName()",
		fromFile : "test-utility-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcUtilityStrContains(){
	var str_base, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		str_base="abc de -5 6NaNf";
		
		if(Ic.utilityMisc.strContains("", "")!==true){
			error_msg="Error [0] empty in empty";
		}
	//}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains("", "a")!==false){
			error_msg="Error [1] something in empty";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, "")!==true){
			error_msg="Error [2] empty in something";
		}
	}
	
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, "a")!==true){
			error_msg="Error [3] at the start";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, "f")!==true){
			error_msg="Error [4] at the end";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, "c d")!==true){
			error_msg="Error [5] string with space";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, " ")!==true){
			error_msg="Error [6] single space";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, str_base)!==true){
			error_msg="Error [7] the complete string";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, "x")!==false){
			error_msg="Error [8] not found char";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, "cd")!==false){
			error_msg="Error [9] separated by space";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, "A")!==false){
			error_msg="Error [10] uppercase";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, 5)!==true){
			error_msg="Error [11] number type";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, -5)!==true){
			error_msg="Error [12] negative number";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, -6)!==false){
			error_msg="Error [13] not found negative number";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.strContains(str_base, ("x"*9))!==true){
			error_msg="Error [14] NaN";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.utilityMisc.strContains()",
		fromFile : "test-utility-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcUtilityOccurrences(){
	var str_base, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		str_base=" ababABA  BABabab ";
		
		if(Ic.utilityMisc.occurrences(str_base, " ")!==4){
			error_msg="Error [0] single space";
		}
	//}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(str_base, str_base)!==1){
			error_msg="Error [1] the complete string";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(str_base, "")!==0){
			error_msg="Error [2] empty in something";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences("", "a")!==0){
			error_msg="Error [3] something in empty";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(str_base, "x")!==0){
			error_msg="Error [4] not found char";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(str_base, "a")!==4){
			error_msg="Error [5] a";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(str_base, "ba")!==2){
			error_msg="Error [6] ba";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(str_base, "ab")!==4){
			error_msg="Error [7] ab";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(str_base, "bab")!==2){
			error_msg="Error [8] bab";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences("aAa", "A")!==1){
			error_msg="Error [9] uppercase";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences("oóo", "ó")!==1){
			error_msg="Error [10] aeiou";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences("1", 1)!==0){
			error_msg="Error [11] non string right";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(1, "1")!==0){
			error_msg="Error [12] non string left";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(1, 1)!==0){
			error_msg="Error [13] non string both";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.occurrences(" abc Ddd  eEfFgGhHiIII  jk ", "e|D|k|i|x")!==4){
			error_msg="Error [14] regexp OR";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.utilityMisc.occurrences()",
		fromFile : "test-utility-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcUtilityToInt(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.utilityMisc.toInt(1.1)!==1){
			error_msg="Error [0] floor positive";
		}
	//}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(-1.1)!==-1){
			error_msg="Error [1] ceil negative";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(2, -3, 3)!==2){
			error_msg="Error [2] inside val";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(-4, -3, 3)!==-3){
			error_msg="Error [3] lower val than min = min";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(4, -3, 3)!==3){
			error_msg="Error [4] upper val than max = max";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(1, 3, -3)!==-3){
			error_msg="Error [5] pseudo-inside val, swapped limits = max";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(-8, 3, -3)!==-3){
			error_msg="Error [6] lower val, swapped limits = max";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(8, 3, -3)!==-3){
			error_msg="Error [7] upper val, swapped limits = max";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(-5.1, -7, 0)!==-5){
			error_msg="Error [8] inside val, ceil negative, negative to zero";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(-9, -7, 0)!==-7){
			error_msg="Error [9] lower val than min = min, negative to zero";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(9, -7, 0)!==0){
			error_msg="Error [10] upper val than max = max, negative to zero";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(5.1, 0, 7)!==5){
			error_msg="Error [11] inside val, floor positive, zero to positive";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(-9, 0, 7)!==0){
			error_msg="Error [12] lower val than min = min, zero to positive";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(9, 0, 7)!==7){
			error_msg="Error [13] upper val than max = max, zero to positive";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt("4.1")!==4){
			error_msg="Error [14] string floor positive";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt("-4.1")!==-4){
			error_msg="Error [15] string ceil negative";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt("x")!==0){
			error_msg="Error [16] NaN string to zero";
		}
	}
	
	if(!error_msg){
		if((1/Ic.utilityMisc.toInt(-0))!==Infinity){
			error_msg="Error [17] infinity 1/-0";
		}
	}
	
	if(!error_msg){
		if((1/Ic.utilityMisc.toInt(0))!==Infinity){
			error_msg="Error [18] infinity 1/0";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(3, undefined, -5)!==-5){
			error_msg="Error [19] no min, upper val than max = max";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(-8, undefined, -5)!==-8){
			error_msg="Error [20] no min, lower val than max = val";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(3, -5, undefined)!==3){
			error_msg="Error [21] no max, upper val than min = val";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(-8, -5, undefined)!==-5){
			error_msg="Error [22] no max, lower val than min = min";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(0, "x", 0)!==0){
			error_msg="Error [23] string min converted to NaN";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(-5, "x", 5)!==-5){
			error_msg="Error [24] incorrectly string min to 0";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(0, 0, "x")!==0){
			error_msg="Error [25] string max converted to NaN";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(5, -5, "x")!==5){
			error_msg="Error [26] incorrectly string max to 0";
		}
	}
	
	if(!error_msg){
		if((1/Ic.utilityMisc.toInt(-5, -0, 5))!==Infinity){
			error_msg="Error [27] -0 min not changed to 0";
		}
	}
	
	if(!error_msg){
		if((1/Ic.utilityMisc.toInt(5, -5, -0))!==Infinity){
			error_msg="Error [28] -0 max not changed to 0";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt()!==0){
			error_msg="Error [29] no parameter";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt("")!==0){
			error_msg="Error [30] empty space";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(false)!==0){
			error_msg="Error [31] false to 0";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.toInt(true)!==1){
			error_msg="Error [32] true to 1";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.utilityMisc.toInt()",
		fromFile : "test-utility-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcUtilityHashCode(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.utilityMisc.hashCode("Aa")!==2112){
			error_msg="Error [0] known evaluation";
		}
	//}
	
	if(!error_msg){
		if(Ic.utilityMisc.hashCode("Aa")!==Ic.utilityMisc.hashCode("BB")){
			error_msg="Error [1] known hash collision";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.hashCode("")!==0){
			error_msg="Error [2] empty string";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.hashCode(" ")===0){
			error_msg="Error [3] whitespace";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.hashCode()!==0){
			error_msg="Error [4] non-strings default to empty string";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.hashCode(9)!==0){
			error_msg="Error [5] non-strings default to empty string";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.hashCode(true)!==0){
			error_msg="Error [6] non-strings default to empty string";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.utilityMisc.hashCode()",
		fromFile : "test-utility-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcUtilityCastlingChars(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.utilityMisc.castlingChars(0)!==""){
			error_msg="Error [0] 0 is empty_string";
		}
	//}
	
	if(!error_msg){
		if(Ic.utilityMisc.castlingChars(1)!=="k"){
			error_msg="Error [1] 1 is k";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.castlingChars(2)!=="q"){
			error_msg="Error [2] 2 is q";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.castlingChars(3)!=="kq"){
			error_msg="Error [3] 3 is kq";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.castlingChars(9)!=="kq"){
			error_msg="Error [4] max stops at index 3 (kq)";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.castlingChars(-1)!==""){
			error_msg="Error [5] min starts at index 0 (empty_string)";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.castlingChars("1")!=="k"){
			error_msg="Error [6] string numbers to int";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.castlingChars(true)!=="k"){
			error_msg="Error [7] true = index 1 (k)";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.castlingChars()!==""){
			error_msg="Error [8] no parameter = index 0 (empty_string)";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.utilityMisc.castlingChars()",
		fromFile : "test-utility-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcUtilityCloneBoardObjs(){
	var board, board_name, board_copy, board_copy_name, start_time, end_time, error_msg;
	
	error_msg="";
	board_name="board_utilCloneBoardObjs";
	board_copy_name="board_utilCloneBoardObjs_copy";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		board=Ic.initBoard({
			boardName : board_name,
			fen : "r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 2 2"
		});
		
		if(board===null){
			error_msg="Error [0] failed to initBoard("+board_name+")";
		}
	//}
	
	if(!error_msg){
		board_copy=Ic.initBoard({
			boardName : board_copy_name
		});
		
		if(board_copy===null){
			error_msg="Error [1] failed to initBoard("+board_copy_name+")";
		}
	}
	
	if(!error_msg){
		board.moveCaller("c3", "e4");
		
		board_copy.moveCaller("g2", "g3");
		board_copy.moveCaller("h7", "h6");
		board_copy.moveCaller("f1", "g2");
		board_copy.moveCaller("h6", "h5");
		board_copy.moveCaller("g2", "e4");
		
		Ic.utilityMisc.cloneBoardObjs(board_copy, board);
		
		if(board_copy.MoveList[1].PGNmove+!!board_copy.MoveList[2]+board_copy.Squares["e4"].val!=="Ne4false2"){
			error_msg="Error [2] incorrect copied values";
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
		testName : "Ic.utilityMisc.cloneBoardObjs()",
		fromFile : "test-utility-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcUtilityBasicFenTest(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("").substring(0, 9)!=="Error [0]"){
			error_msg="Error [0] empty string";
		}
	//}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1").substring(0, 9)!=="Error [1]"){
			error_msg="Error [1] color need to be w or b";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqkq - 0 1").substring(0, 9)!=="Error [1]"){
			error_msg="Error [2] kqkq";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ - 0 1").substring(0, 9)!=="Error [1]"){
			error_msg="Error [3] kqKQ";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/xppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ - 0 1").substring(0, 9)!=="Error [1]"){
			error_msg="Error [4] wrong piece char";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("pnbqkbnr/1ppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ - 0 1").substring(0, 9)!=="Error [1]"){
			error_msg="Error [5] pawn on 8th rank";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/1PPPPPPP/PNBQKBNR w kqKQ - 0 1").substring(0, 9)!=="Error [1]"){
			error_msg="Error [6] pawn on 1st rank";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - a2 0 1").substring(0, 9)!=="Error [1]"){
			error_msg="Error [7] bad enpassant square not caught";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0").substring(0, 9)!=="Error [2]"){
			error_msg="Error [8] full move at 0";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 01 1").substring(0, 9)!=="Error [2]"){
			error_msg="Error [9] half move with 0X";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 2 02").substring(0, 9)!=="Error [2]"){
			error_msg="Error [10] full move with 0X";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - a 1").substring(0, 9)!=="Error [2]"){
			error_msg="Error [11] half move non numeric";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 1 a").substring(0, 9)!=="Error [2]"){
			error_msg="Error [12] full move non numeric";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/44/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").substring(0, 9)!=="Error [3]"){
			error_msg="Error [13] consecutive numbers";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbn1/ppppppppr/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").substring(0, 9)!=="Error [4]"){
			error_msg="Error [14] not exactly 8 columns (9)";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbn1/3r3/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").substring(0, 9)!=="Error [4]"){
			error_msg="Error [15] not exactly 8 columns (7)";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("k7/8/8/8/8/8/8/8 w KQkq - 0 1").substring(0, 9)!=="Error [5]"){
			error_msg="Error [16] missing wk";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("K7/8/8/8/8/8/8/8 w KQkq - 0 1").substring(0, 9)!=="Error [5]"){
			error_msg="Error [17] missing bk";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("k6k/8/8/8/8/8/8/K7 w KQkq - 0 1").substring(0, 9)!=="Error [5]"){
			error_msg="Error [18] more than one bk";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("K6K/8/8/8/8/8/8/k7 w KQkq - 0 1").substring(0, 9)!=="Error [5]"){
			error_msg="Error [19] more than one wk";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/p7/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").substring(0, 9)!=="Error [6]"){
			error_msg="Error [20] more than 8 bp";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/P7/PPPPPPPP/RNBQKBNR w KQkq - 0 1").substring(0, 9)!=="Error [6]"){
			error_msg="Error [21] more than 8 wp";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rrbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").substring(0, 9)!=="Error [7]"){
			error_msg="Error [22] more promoted pieces than possible (b)";
		}
	}
	
	if(!error_msg){
		if(Ic.utilityMisc.basicFenTest("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBRR w KQkq - 0 1").substring(0, 9)!=="Error [7]"){
			error_msg="Error [23] more promoted pieces than possible (w)";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "Ic.utilityMisc.basicFenTest()",
		fromFile : "test-utility-functions.js",
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
		testName : "Ic.utilityMisc.AAAAA()",
		fromFile : "test-utility-functions.js",
		result : (error_msg || "✓"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}*/
