function fnIcTrimSpaces(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces("  abc")!=="abc"){
			error_msg="Error [0] left space";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces("abc  ")!=="abc"){
			error_msg="Error [1] right space";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces("a  b  c")!=="a b c"){
			error_msg="Error [2] duplicated to single";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces("  a  b c ")!=="a b c"){
			error_msg="Error [3] left + right + duplicated";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces(" ")!==""){
			error_msg="Error [4] space to empty";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces("     ")!==""){
			error_msg="Error [5] multiple spaces to empty";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces("")!==""){
			error_msg="Error [6] empty to empty";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces("x"*9)!=="NaN"){
			error_msg="Error [7] NaN";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces([, 2, " ", null, "", "  ", Infinity, "  a  b  ", ("x"*9)])!==",2, ,,, ,Infinity, a b ,NaN"){
			error_msg="Error [8] array with non strings";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.trimSpaces()!=="undefined"){
			error_msg="Error [9] no parameter";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "<strong>[Function] </strong> IC.utilityMisc.TrimSpaces()",
		result : (error_msg || "Ok"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcFormatName(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.utilityMisc.formatName(" a  Bc ")!=="a_Bc"){
			error_msg="Error [0] left + right + duplicated";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.formatName("0ñ2(4) á")!=="0_2_4___"){
			error_msg="Error [1] non alphanumeric";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.formatName(" ")!==""){
			error_msg="Error [2] single space";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.formatName("")!==""){
			error_msg="Error [3] empty space";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.formatName("ñ")!=="_"){
			error_msg="Error [4] single non alphanumeric";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "<strong>[Function] </strong> IC.utilityMisc.formatName()",
		result : (error_msg || "Ok"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcStrContains(){
	var str_base, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		str_base="abc de -5 6NaNf";
		
		if(IsepicChess.utilityMisc.strContains("", "")!==true){
			error_msg="Error [0] empty in empty";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains("", "a")!==false){
			error_msg="Error [1] something in empty";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, "")!==true){
			error_msg="Error [2] empty in something";
		}
	}
	
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, "a")!==true){
			error_msg="Error [3] at the start";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, "f")!==true){
			error_msg="Error [4] at the end";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, "c d")!==true){
			error_msg="Error [5] string with space";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, " ")!==true){
			error_msg="Error [6] single space";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, str_base)!==true){
			error_msg="Error [7] the complete string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, "x")!==false){
			error_msg="Error [8] not found char";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, "cd")!==false){
			error_msg="Error [9] separated by space";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, "A")!==false){
			error_msg="Error [10] uppercase";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, 5)!==true){
			error_msg="Error [11] number type";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, -5)!==true){
			error_msg="Error [12] negative number";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, -6)!==false){
			error_msg="Error [13] not found negative number";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.strContains(str_base, ("x"*9))!==true){
			error_msg="Error [14] NaN";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "<strong>[Function] </strong> IC.utilityMisc.strContains()",
		result : (error_msg || "Ok"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcOccurrences(){
	var str_base, start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		str_base=" ababABA  BABabab ";
		
		if(IsepicChess.utilityMisc.occurrences(str_base, " ")!==4){
			error_msg="Error [0] single space";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(str_base, str_base)!==1){
			error_msg="Error [1] the complete string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(str_base, "")!==0){
			error_msg="Error [2] empty in something";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences("", "a")!==0){
			error_msg="Error [3] something in empty";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(str_base, "x")!==0){
			error_msg="Error [4] not found char";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(str_base, "a")!==4){
			error_msg="Error [5] a";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(str_base, "ba")!==2){
			error_msg="Error [6] ba";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(str_base, "ab")!==4){
			error_msg="Error [7] ab";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(str_base, "bab")!==2){
			error_msg="Error [8] bab";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences("aAa", "A")!==1){
			error_msg="Error [9] uppercase";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences("oóo", "ó")!==1){
			error_msg="Error [10] aeiou";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences("1", 1)!==0){
			error_msg="Error [11] non string right";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(1, "1")!==0){
			error_msg="Error [12] non string left";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(1, 1)!==0){
			error_msg="Error [13] non string both";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.occurrences(" abc Ddd  eEfFgGhHiIII  jk ", "e|D|k|i|x")!==4){
			error_msg="Error [14] regexp OR";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "<strong>[Function] </strong> IC.utilityMisc.occurrences()",
		result : (error_msg || "Ok"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcToInt(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(1.1)!==1){
			error_msg="Error [0] floor positive";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(-1.1)!==-1){
			error_msg="Error [1] ceil negative";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(2, -3, 3)!==2){
			error_msg="Error [2] inside val";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(-4, -3, 3)!==-3){
			error_msg="Error [3] lower val than min = min";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(4, -3, 3)!==3){
			error_msg="Error [4] upper val than max = max";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(1, 3, -3)!==-3){
			error_msg="Error [5] pseudo-inside val, swapped limits = max";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(-8, 3, -3)!==-3){
			error_msg="Error [6] lower val, swapped limits = max";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(8, 3, -3)!==-3){
			error_msg="Error [7] upper val, swapped limits = max";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(-5.1, -7, 0)!==-5){
			error_msg="Error [8] inside val, ceil negative, negative to zero";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(-9, -7, 0)!==-7){
			error_msg="Error [9] lower val than min = min, negative to zero";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(9, -7, 0)!==0){
			error_msg="Error [10] upper val than max = max, negative to zero";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(5.1, 0, 7)!==5){
			error_msg="Error [11] inside val, floor positive, zero to positive";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(-9, 0, 7)!==0){
			error_msg="Error [12] lower val than min = min, zero to positive";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(9, 0, 7)!==7){
			error_msg="Error [13] upper val than max = max, zero to positive";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt("4.1")!==4){
			error_msg="Error [14] string floor positive";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt("-4.1")!==-4){
			error_msg="Error [15] string ceil negative";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt("x")!==0){
			error_msg="Error [16] NaN string to zero";
		}
	}
	
	if(!error_msg){
		if((1/IsepicChess.utilityMisc.toInt(-0))!==Infinity){
			error_msg="Error [17] infinity 1/-0";
		}
	}
	
	if(!error_msg){
		if((1/IsepicChess.utilityMisc.toInt(0))!==Infinity){
			error_msg="Error [18] infinity 1/0";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(3, undefined, -5)!==-5){
			error_msg="Error [19] no min, upper val than max = max";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(-8, undefined, -5)!==-8){
			error_msg="Error [20] no min, lower val than max = val";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(3, -5, undefined)!==3){
			error_msg="Error [21] no max, upper val than min = val";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt(-8, -5, undefined)!==-5){
			error_msg="Error [22] no max, lower val than min = min";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.toInt()!==0){
			error_msg="Error [23] no parameter";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "<strong>[Function] </strong> IC.utilityMisc.toInt()",
		result : (error_msg || "Ok"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}

function fnIcHashCode(){
	var start_time, end_time, error_msg;
	
	error_msg="";
	start_time=new Date().getTime();
	
	//if(!error_msg){
		if(IsepicChess.utilityMisc.hashCode("Aa")!==2112){
			error_msg="Error [0] known evaluation";
		}
	//}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.hashCode("Aa")!==IsepicChess.utilityMisc.hashCode("BB")){
			error_msg="Error [1] known hash collision";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.hashCode("")!==0){
			error_msg="Error [2] empty string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.hashCode(" ")===0){
			error_msg="Error [3] whitespace";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.hashCode()!==0){
			error_msg="Error [4] non-strings default to empty string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.hashCode(9)!==0){
			error_msg="Error [5] non-strings default to empty string";
		}
	}
	
	if(!error_msg){
		if(IsepicChess.utilityMisc.hashCode(true)!==0){
			error_msg="Error [6] non-strings default to empty string";
		}
	}
	
	end_time=new Date().getTime();
	
	return {
		testName : "<strong>[Function] </strong> IC.utilityMisc.hashCode()",
		result : (error_msg || "Ok"),
		elapsedTime : ((end_time-start_time)+" ms"),
		passed : !error_msg
	};
}
