/** Copyright (c) 2021 Ajax Isepic (ajax333221) Licensed MIT */

/* jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:false, curly:true, latedef:nofunc, bitwise:false, sub:true, eqeqeq:true, esversion:6 */

(function(windw, expts, defin){
	var Ic=(function(_WIN){
		var _VERSION="5.2.0";
		
		var _SILENT_MODE=true;
		var _BOARDS={};
		
		var _EMPTY_SQR=0;
		var _PAWN=1;
		var _KNIGHT=2;
		var _BISHOP=3;
		var _ROOK=4;
		var _QUEEN=5;
		var _KING=6;
		
		var _DIRECTION_TOP=1;
		var _DIRECTION_TOP_RIGHT=2;
		var _DIRECTION_RIGHT=3;
		var _DIRECTION_BOTTOM_RIGHT=4;
		var _DIRECTION_BOTTOM=5;
		var _DIRECTION_BOTTOM_LEFT=6;
		var _DIRECTION_LEFT=7;
		var _DIRECTION_TOP_LEFT=8;
		
		var _SHORT_CASTLE=1;
		var _LONG_CASTLE=2;
		
		var _DEFAULT_FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		
		var _MUTABLE_KEYS=["w", "b", "activeColor", "nonActiveColor", "fen", "enPassantBos", "halfMove", "fullMove", "moveList", "currentMove", "isRotated", "checks", "isCheck", "isCheckmate", "isStalemate", "isThreefold", "isInsufficientMaterial", "isFiftyMove", "inDraw", "promoteTo", "manualResult", "selectedBos", "isHidden", "isUnlabeled", "squares"];
		
		//---------------- helpers
		
		function _promoteValHelper(qal){
			return _toInt((toAbsVal(qal) || _QUEEN), _KNIGHT, _QUEEN);
		}
		
		function _pgnResultHelper(str){
			var rtn;
			
			rtn="";
			
			str=(""+str).replace(/\s/g, "").replace(/o/gi, "0").replace(/½/g, "1/2");
			
			if(str==="*" || str==="1-0" || str==="0-1" || str==="1/2-1/2"){
				rtn=str;
			}
			
			return rtn;
		}
		
		function _strToValHelper(str){
			var temp, pc_exec, rtn;
			
			rtn=0;
			str=_trimSpaces(str);
			pc_exec=/^([wb])([pnbrqk])$/.exec(str.toLowerCase());
			
			if(!str){
				rtn=str;
			}else if(pc_exec){
				rtn=("*pnbrqk".indexOf(pc_exec[2])*getSign(pc_exec[1]==="b"));
			}else if(/^[pnbrqk]$/i.test(str)){
				temp=str.toLowerCase();
				rtn=(("pnbrqk".indexOf(temp)+1)*getSign(str===temp));
			}else if(_isIntOrStrInt(str)){
				rtn=str;
			}
			
			return _toInt(rtn, -_KING, _KING);//_toInt() removes sign on negative zero
		}
		
		function _strToBosHelper(str){
			var rtn;
			
			rtn=null;
			str=_trimSpaces(str);
			
			if(str && /^[a-h][1-8]$/i.test(str)){
				rtn=str.toLowerCase();
			}
			
			return rtn;
		}
		
		function _arrToPosHelper(arr){
			var rank_pos, file_pos, rtn;
			
			rtn=null;
			
			if(_isArray(arr) && arr.length===2){
				rank_pos=_toInt(arr[0]);
				file_pos=_toInt(arr[1]);
				
				if((rank_pos<=7 && rank_pos>=0) && (file_pos<=7 && file_pos>=0)){
					rtn=[rank_pos, file_pos];
				}
			}
			
			return rtn;
		}
		
		function _parserHelper(str){
			var p, temp, rgxp, mtch, meta_tags, move_list, game_result, last_index, rtn;
			
			rtn=null;
			
			meta_tags={};
			last_index=-1;
			rgxp=/\[\s*\w+\s+\"[^\"]*\"\s*\]/g;
			
			while(mtch=rgxp.exec(str)){
				last_index=rgxp.lastIndex;
				
				temp=mtch[0].slice(1, -1).split("\"");
				meta_tags[_trimSpaces(temp[0])]=_trimSpaces(temp[1]);
			}
			
			if(last_index===-1){
				last_index=0;
			}
			
			p=(" "+_cleanSan(str.slice(last_index)));
			
			move_list=[];
			last_index=-1;
			rgxp=/\s\d*\s*\.*\s*\.*\s*([^\s]+)/g;
			
			while(mtch=rgxp.exec(p)){
				last_index=rgxp.lastIndex;
				
				temp=mtch[0];
				move_list.push(mtch[1]);
			}
			
			if(last_index!==-1){
				game_result="*";
				
				temp=_pgnResultHelper(temp);
				
				if(temp){
					move_list.pop();
					
					game_result=temp;
				}
				
				if(meta_tags.Result){
					temp=_pgnResultHelper(meta_tags.Result);
					
					if(temp){
						meta_tags.Result=temp;
						
						game_result=temp;
					}
				}
				
				rtn=[meta_tags, move_list, game_result];
			}
			
			return rtn;
		}
		
		function _playMoveApplyHelper(fen, args){
			var board, board_created, keep_going, rtn;
			
			rtn=null;
			board_created=false;
			keep_going=true;
			
			//if(keep_going){
				board=initBoard({
					boardName : "board_playMoveApplyHelper",
					fen : fen,
					isHidden : true,
					validOrBreak : true
				});
				
				if(board===null){
					keep_going=false;
				}
			//}
			
			if(keep_going){
				board_created=true;
				
				rtn=_playMove.apply(board, args);
			}
			
			if(board_created){
				removeBoard(board);
			}
			
			return rtn;
		}
		
		//p = {delimiter}
		function _joinedWrapmoveHelper(mov, p){
			var temp, no_errors, rtn;
			
			rtn=null;
			p=(_isObject(p) ? p : {});
			no_errors=true;
			
			//if(no_errors){
				p.delimiter=(((typeof p.delimiter)==="string" && p.delimiter) ? p.delimiter : "-");
				p.delimiter=p.delimiter.charAt(0);
				
				if((typeof mov)!=="string"){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				mov=_trimSpaces(mov);
				
				if(mov.length!==5 || mov.charAt(2)!==p.delimiter){
					no_errors=false;
				}
			}
			
			if(no_errors){
				temp=_fromToWrapmoveHelper(mov.split(p.delimiter));
				
				if(temp===null){
					no_errors=false;
				}
			}
			
			if(no_errors){
				rtn=temp;
			}
			
			return rtn;
		}
		
		function _fromToWrapmoveHelper(mov){
			var no_errors, rtn;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				if(!_isArray(mov) || mov.length!==2){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				if(!isInsideBoard(mov[0]) || !isInsideBoard(mov[1])){
					no_errors=false;
				}
			}
			
			if(no_errors){
				rtn=mov;
			}
			
			return rtn;
		}
		
		function _moveWrapmoveHelper(mov){
			var calculated_promote, no_errors, rtn;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				if(!_isMove(mov)){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				calculated_promote=(mov.InitialVal!==mov.FinalVal ? mov.FinalVal : 0);
				
				rtn=[[mov.FromBos, mov.ToBos], calculated_promote];
			}
			
			return rtn;
		}
		
		//---------------- utilities
		
		function _consoleLog(msg){
			var rtn;
			
			rtn=false;
			
			if(!_SILENT_MODE){
				rtn=true;
				console.log(msg);
			}
			
			return rtn;
		}
		
		function _isObject(obj){
			return ((typeof obj)==="object" && obj!==null && !_isArray(obj));
		}
		
		function _isArray(arr){
			return (Object.prototype.toString.call(arr)==="[object Array]");
		}
		
		function _isSquare(obj){
			return (_isObject(obj) && (typeof obj.bos)==="string");
		}
		
		function _isBoard(obj){
			return (_isObject(obj) && (typeof obj.boardName)==="string");
		}
		
		function _isMove(obj){
			return (_isObject(obj) && (typeof obj.FromBos)==="string" && (typeof obj.ToBos)==="string");
		}
		
		function _trimSpaces(str){
			return (""+str).replace(/^\s+|\s+$/g, "").replace(/\s\s+/g, " ");
		}
		
		function _formatName(str){
			return _trimSpaces(str).replace(/[^a-z0-9]/gi, "_");
		}
		
		function _strContains(str, str_to_find){
			return ((""+str).indexOf(str_to_find)!==-1);
		}
		
		function _occurrences(str, str_rgxp){
			var rtn;
			
			rtn=0;
			
			if((typeof str)==="string" && (typeof str_rgxp)==="string" && str_rgxp){
				rtn=(str.match(RegExp(str_rgxp, "g")) || []).length;
			}
			
			return rtn;
		}
		
		function _toInt(num, min_val, max_val){
			num=(num*1 || 0);
			num=(num<0 ? Math.ceil(num) : Math.floor(num));
			
			min_val*=1;
			max_val*=1;
			
			/*NO remove default 0, (-0 || 0) = 0*/
			min_val=((Number.isNaN(min_val) ? -Infinity : min_val) || 0);
			max_val=((Number.isNaN(max_val) ? Infinity : max_val) || 0);
			
			return Math.min(Math.max(num, min_val), max_val);
		}
		
		function _isIntOrStrInt(num){
			return ((""+_toInt(num))===(""+num));
		}
		
		function _hashCode(val){
			var i, len, hash;
			
			hash=0;
			val=((typeof val)==="string" ? val : "");
			
			for(i=0, len=val.length; i<len; i++){//0<len
				hash=((hash<<5)-hash)+val.charCodeAt(i);
				hash|=0;//to 32bit integer
			}
			
			return hash;
		}
		
		function _castlingChars(num){
			return ["", "k", "q", "kq"][_toInt(num, 0, 3)];
		}
		
		function _cleanSan(rtn){
			rtn=((typeof rtn)==="string" ? rtn : "");
			
			rtn=rtn.replace(/(\t)|(\r?\n)|(\r\n?)/g, " ");
			
			while(rtn!==(rtn=rtn.replace(/\{[^{}]*\}/g, "")));
			while(rtn!==(rtn=rtn.replace(/\([^()]*\)/g, "")));
			
			rtn=rtn.replace(/\-{2,}/g, "").replace(/(\-)*\+(\-)*/g, "+");
			rtn=rtn.replace(/[^a-h0-8nrqkxo /½=-]/gi, "");//no planned support for P and e.p.
			rtn=rtn.replace(/\s*\-\s*/g, "-");
			rtn=rtn.replace(/0-0-0/g, "O-O-O").replace(/0-0/g, "O-O");
			rtn=rtn.replace(/o-o-o/g, "O-O-O").replace(/o-o/g, "O-O");
			
			return _trimSpaces(rtn);
		}
		
		function _cloneBoardObjs(to_board, from_board){
			var i, j, k, len, len2, len3, current_key, current_sub_from, sub_keys, sub_sub_keys, to_prop, from_prop;
			
			if(to_board!==from_board){
				to_board.moveList=[];
				
				for(i=0, len=_MUTABLE_KEYS.length; i<len; i++){//0<len
					current_key=_MUTABLE_KEYS[i];
					to_prop=to_board[current_key];
					from_prop=from_board[current_key];
					
					//primitive data type
					if(!_isObject(from_prop) && !_isArray(from_prop)){
						to_board[current_key]=from_board[current_key];//can't use to_prop, it's not a reference here
						
						continue;
					}
					
					if(current_key==="w" || current_key==="b"){
						//object or array data type
						to_prop.materialDiff=from_prop.materialDiff.slice(0);
						
						//primitive data type
						to_prop.kingBos=from_prop.kingBos;
						to_prop.castling=from_prop.castling;
						
						continue;
					}
					
					sub_keys=Object.keys(from_prop);
					
					for(j=0, len2=sub_keys.length; j<len2; j++){//0<len2
						current_sub_from=from_prop[sub_keys[j]];
						
						//primitive data type
						if(!_isObject(current_sub_from) && !_isArray(current_sub_from)){
							_consoleLog("Error[_cloneBoardObjs]: unexpected primitive data type");
							
							continue;
						}
						
						if(current_key==="squares"){
							//["squares"] object of (64), object of (6 static + 13 mutables = 19) Note: pos is array
							
							//object or array data type
							//(none)
							
							//primitive data type
							to_prop[sub_keys[j]].bal=current_sub_from.bal;
							to_prop[sub_keys[j]].absBal=current_sub_from.absBal;
							to_prop[sub_keys[j]].val=current_sub_from.val;
							to_prop[sub_keys[j]].absVal=current_sub_from.absVal;
							to_prop[sub_keys[j]].className=current_sub_from.className;
							to_prop[sub_keys[j]].sign=current_sub_from.sign;
							to_prop[sub_keys[j]].isEmptySquare=current_sub_from.isEmptySquare;
							to_prop[sub_keys[j]].isPawn=current_sub_from.isPawn;
							to_prop[sub_keys[j]].isKnight=current_sub_from.isKnight;
							to_prop[sub_keys[j]].isBishop=current_sub_from.isBishop;
							to_prop[sub_keys[j]].isRook=current_sub_from.isRook;
							to_prop[sub_keys[j]].isQueen=current_sub_from.isQueen;
							to_prop[sub_keys[j]].isKing=current_sub_from.isKing;
							
							continue;
						}
						
						sub_sub_keys=Object.keys(current_sub_from);
						
						if(current_key==="moveList"){
							to_prop[sub_keys[j]]={};
							
							/*NO put a "continue" in here*/
						}
						
						for(k=0, len3=sub_sub_keys.length; k<len3; k++){//0<len3
							//object or array data type
							if(_isObject(current_sub_from[sub_sub_keys[k]]) || _isArray(current_sub_from[sub_sub_keys[k]])){
								_consoleLog("Error[_cloneBoardObjs]: unexpected type in key \""+sub_sub_keys[k]+"\"");
								
								continue;
							}
							
							//primitive data type
							to_prop[sub_keys[j]][sub_sub_keys[k]]=current_sub_from[sub_sub_keys[k]];
						}
					}
				}
			}
		}
		
		function _basicFenTest(fen){
			var i, j, len, temp, optional_clocks, last_is_num, current_is_num, fen_board, fen_board_arr, total_files_in_current_rank, error_msg;
			
			error_msg="";
			
			//if(!error_msg){
				fen=_trimSpaces(fen);
				
				if(!fen){
					error_msg="Error [0] falsy value after trim";
				}
			//}
			
			if(!error_msg){
				optional_clocks=fen.replace(/^([rnbqkRNBQK1-8]+\/)([rnbqkpRNBQKP1-8]+\/){6}([rnbqkRNBQK1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])($|\s)/, "");
				
				if(fen.length===optional_clocks.length){
					error_msg="Error [1] invalid fen structure";
				}
			}
			
			if(!error_msg){
				if(optional_clocks.length){
					if(!(/^(0|[1-9][0-9]*)\s([1-9][0-9]*)$/.test(optional_clocks))){
						error_msg="Error [2] invalid half/full move";
					}
				}
			}
			
			if(!error_msg){
				fen_board=fen.split(" ")[0];
				fen_board_arr=fen_board.split("/");
				
				outer:
				for(i=0; i<8; i++){//0...7
					total_files_in_current_rank=0;
					last_is_num=false;
					
					for(j=0, len=fen_board_arr[i].length; j<len; j++){//0<len
						temp=(fen_board_arr[i].charAt(j)*1);
						current_is_num=!!temp;
						
						if(last_is_num && current_is_num){
							error_msg="Error [3] two consecutive numeric values";
							break outer;
						}
						
						last_is_num=current_is_num;
						total_files_in_current_rank+=(temp || 1);
					}
					
					if(total_files_in_current_rank!==8){
						error_msg="Error [4] rank without exactly 8 columns";
						break;
					}
				}
			}
			
			if(!error_msg){
				if(_occurrences(fen_board, "K")!==1){
					error_msg="Error [5] board without exactly one white king";
				}
			}
			
			if(!error_msg){
				if(_occurrences(fen_board, "k")!==1){
					error_msg="Error [6] board without exactly one black king";
				}
			}
			
			return error_msg;
		}
		
		//---------------- board
		
		//p = {rankShift, fileShift, isUnreferenced}
		function _getSquare(qos, p){
			var that, temp_pos, pre_validated_pos, rtn;
			
			that=this;
			
			function _squareHelper(my_square, is_unreferenced){//uses: that
				var temp, rtn_square;
				
				rtn_square=my_square;
				
				if(is_unreferenced){
					temp={};
					
					temp.pos=toPos(my_square.pos);//unreference
					temp.bos=my_square.bos;
					temp.rankPos=getRankPos(my_square.pos);
					temp.filePos=getFilePos(my_square.pos);
					temp.rankBos=getRankBos(my_square.pos);
					temp.fileBos=getFileBos(my_square.pos);
					
					temp.bal=my_square.bal;
					temp.absBal=my_square.absBal;
					temp.val=my_square.val;
					temp.absVal=my_square.absVal;
					temp.className=my_square.className;
					temp.sign=my_square.sign;
					temp.isEmptySquare=my_square.isEmptySquare;
					temp.isPawn=my_square.isPawn;
					temp.isKnight=my_square.isKnight;
					temp.isBishop=my_square.isBishop;
					temp.isRook=my_square.isRook;
					temp.isQueen=my_square.isQueen;
					temp.isKing=my_square.isKing;
					
					rtn_square=temp;
				}
				
				return rtn_square;
			}
			
			rtn=null;
			p=(_isObject(p) ? p : {});
			temp_pos=toPos(qos);
			
			if(temp_pos!==null){
				pre_validated_pos=[(temp_pos[0]+_toInt(p.rankShift)), (temp_pos[1]+_toInt(p.fileShift))];
				
				if(isInsideBoard(pre_validated_pos)){
					rtn=_squareHelper(that.squares[toBos(pre_validated_pos)], p.isUnreferenced);
				}
			}
			
			return rtn;
		}
		
		function _setSquare(qos, new_qal, p){
			var that, target_square, new_val, new_abs_val, rtn_set;
			
			that=this;
			
			rtn_set=false;
			target_square=that.getSquare(qos, p);
			
			if(target_square!==null){
				rtn_set=true;
				
				new_val=toVal(new_qal);
				new_abs_val=toAbsVal(new_val);
				
				target_square.bal=toBal(new_val);
				target_square.absBal=toAbsBal(new_val);
				target_square.val=new_val;
				target_square.absVal=new_abs_val;
				target_square.className=toClassName(new_val);
				target_square.sign=getSign(new_val);
				target_square.isEmptySquare=(new_abs_val===_EMPTY_SQR);
				target_square.isPawn=(new_abs_val===_PAWN);
				target_square.isKnight=(new_abs_val===_KNIGHT);
				target_square.isBishop=(new_abs_val===_BISHOP);
				target_square.isRook=(new_abs_val===_ROOK);
				target_square.isQueen=(new_abs_val===_QUEEN);
				target_square.isKing=(new_abs_val===_KING);
			}
			
			return rtn_set;
		}
		
		function _countAttacks(target_qos, early_break){
			var i, j, that, as_knight, active_side, rtn_total_checks;
			
			that=this;
			
			function _isAttacked(qos, piece_direction, as_knight){//uses: that
				return that.testCollision(2, qos, piece_direction, as_knight, null, null, null).isAttacked;
			}
			
			rtn_total_checks=0;
			
			active_side=that[that.activeColor];
			target_qos=(target_qos || active_side.kingBos);
			
			outer:
			for(i=0; i<2; i++){//0...1
				as_knight=!!i;
				
				for(j=1; j<9; j++){//1...8
					if(_isAttacked(target_qos, j, as_knight)){
						rtn_total_checks++;
						
						if(early_break){
							break outer;
						}
					}
				}
			}
			
			return rtn_total_checks;
		}
		
		function _toggleActiveNonActive(new_active){
			var that, temp, rtn_changed;
			
			that=this;
			
			rtn_changed=false;
			temp=((typeof new_active)==="boolean" ? new_active : !that[that.activeColor].isBlack);
			
			if((temp ? "b" : "w")!==that.activeColor || (!temp ? "b" : "w")!==that.nonActiveColor){
				rtn_changed=true;
				
				that.activeColor=(temp ? "b" : "w");
				that.nonActiveColor=(!temp ? "b" : "w");
			}
			
			return rtn_changed;
		}
		
		function _toggleIsRotated(new_is_rotated){
			var that, temp, rtn_changed;
			
			that=this;
			
			rtn_changed=false;
			temp=((typeof new_is_rotated)==="boolean" ? new_is_rotated : !that.isRotated);
			
			if(temp!==that.isRotated){
				rtn_changed=true;
				
				that.isRotated=temp;
				
				that.refreshBoard(0);//autorefresh
			}
			
			return rtn_changed;
		}
		
		function _setPromoteTo(qal){
			var that, temp, rtn_changed;
			
			that=this;
			
			rtn_changed=false;
			temp=_promoteValHelper(qal);
			
			if(temp!==that.promoteTo){
				rtn_changed=true;
				
				that.promoteTo=temp;
				
				that.refreshBoard(0);//autorefresh
			}
			
			return rtn_changed;
		}
		
		function _setManualResult(str){
			var that, temp, rtn_changed;
			
			that=this;
			
			rtn_changed=false;
			temp=(_pgnResultHelper(str) || "*");
			
			if(temp!==that.manualResult){
				rtn_changed=true;
				
				that.manualResult=temp;
				
				that.refreshBoard(0);//autorefresh
			}
			
			return rtn_changed;
		}
		
		function _setCurrentMove(num, is_goto){
			var len, that, temp, diff, keep_going, rtn_changed;
			
			that=this;
			
			rtn_changed=false;
			keep_going=true;
			
			//if(keep_going){
				len=that.moveList.length;
				
				if(len<2){
					keep_going=false;
				}
			//}
			
			if(keep_going){
				if((typeof is_goto)!=="boolean"){
					num=_toInt(num, 0, (len-1));
					diff=(num-that.currentMove);
					is_goto=(Math.abs(diff)!==1);
					
					num=(is_goto ? num : diff);
				}
				
				num=_toInt(num);
				
				temp=_toInt((is_goto ? num : (num+that.currentMove)), 0, (len-1));
				
				if(temp===that.currentMove){
					keep_going=false;
				}
			}
			
			if(keep_going){
				rtn_changed=true;
				
				that.currentMove=temp;
				that.readValidatedFen(that.moveList[temp].Fen);
				
				that.refreshBoard(is_goto ? 0 : num);//autorefresh
			}
			
			return rtn_changed;
		}
		
		function _navFirst(){
			var that;
			
			that=this;
			
			return that.setCurrentMove(0);//autorefresh (sometimes)
		}
		
		function _navPrevious(){
			var that;
			
			that=this;
			
			return that.setCurrentMove(that.currentMove-1);//autorefresh (sometimes)
		}
		
		function _navNext(){
			var that;
			
			that=this;
			
			return that.setCurrentMove(that.currentMove+1);//autorefresh (sometimes)
		}
		
		function _navLast(){
			var that;
			
			that=this;
			
			return that.setCurrentMove(that.moveList.length-1);//autorefresh (sometimes)
		}
		
		function _navLinkMove(move_index){
			var that;
			
			that=this;
			
			return that.setCurrentMove(move_index);//autorefresh (sometimes)
		}
		
		function _readValidatedFen(fen){
			var i, j, len, that, fen_parts, current_file, current_char, fen_board_arr, skip_files;
			
			that=this;
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					that.setSquare([i, j], _EMPTY_SQR);
				}
			}
			
			fen=_trimSpaces(fen);
			
			fen_parts=fen.split(" ");
			fen_board_arr=fen_parts[0].split("/");
			
			for(i=0; i<8; i++){//0...7
				current_file=0;
				
				for(j=0, len=fen_board_arr[i].length; j<len; j++){//0<len
					current_char=fen_board_arr[i].charAt(j);
					skip_files=(current_char*1);
					
					if(!skip_files){
						that.setSquare([i, current_file], current_char);
					}
					
					current_file+=(skip_files || 1);
				}
			}
			
			that.w.castling=(_strContains(fen_parts[2], "K") ? _SHORT_CASTLE : 0)+(_strContains(fen_parts[2], "Q") ? _LONG_CASTLE : 0);
			that.b.castling=(_strContains(fen_parts[2], "k") ? _SHORT_CASTLE : 0)+(_strContains(fen_parts[2], "q") ? _LONG_CASTLE : 0);
			
			that.enPassantBos=fen_parts[3].replace("-", "");
			
			that.toggleActiveNonActive(fen_parts[1]==="b");
			
			that.halfMove=((fen_parts[4]*1) || 0);
			that.fullMove=((fen_parts[5]*1) || 1);
			
			that.updateFenAndMisc();
		}
		
		function _updateFenAndMisc(){
			var i, j, len, that, temp, current_square, current_diff, total_pieces, consecutive_empty_squares, new_fen_board, clockless_fen, times_found, is_stale, bishop_count, at_least_one_light, at_least_one_dark, current_side;
			
			that=this;
			
			new_fen_board="";
			
			for(i=0; i<8; i++){//0...7
				consecutive_empty_squares=0;
				
				for(j=0; j<8; j++){//0...7
					current_square=that.getSquare([i, j]);
					
					if(!current_square.isEmptySquare){
						if(current_square.isKing){
							current_side=(current_square.sign===that[that.activeColor].sign ? that[that.activeColor] : that[that.nonActiveColor]);
							
							current_side.kingBos=current_square.bos;
						}
						
						new_fen_board+=(consecutive_empty_squares || "")+current_square.bal;
						consecutive_empty_squares=-1;
					}
					
					consecutive_empty_squares++;
				}
				
				new_fen_board+=(consecutive_empty_squares || "")+(i!==7 ? "/" : "");
			}
			
			that.checks=that.countAttacks(null);
			
			is_stale=true;
			
			outer:
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					if(that.legalMoves([i, j]).length){
						is_stale=false;
						break outer;
					}
				}
			}
			
			that.isCheck=!!that.checks;
			that.isCheckmate=(that.isCheck && is_stale);
			that.isStalemate=(!that.isCheck && is_stale);
			
			clockless_fen=(new_fen_board+" "+that.activeColor+" "+((_castlingChars(that.w.castling).toUpperCase()+""+_castlingChars(that.b.castling)) || "-")+" "+(that.enPassantBos || "-"));
			
			that.fen=(clockless_fen+" "+that.halfMove+" "+that.fullMove);
			
			that.isThreefold=false;
			
			if(that.currentMove>7 && that.halfMove>7){
				times_found=1;
				
				for(i=(that.currentMove-1); i>=0; i--){//(len-1)...0
					temp=that.moveList[i].Fen.split(" ");
					
					if(temp.slice(0, 4).join(" ")===clockless_fen){
						times_found++;
						
						if(times_found>2){
							that.isThreefold=true;
							break;
						}
					}
					
					if(temp[4]==="0"){
						break;
					}
				}
			}
			
			total_pieces=countPieces(clockless_fen);
			that.isInsufficientMaterial=false;
			
			if(!(total_pieces.w.p+total_pieces.b.p+total_pieces.w.r+total_pieces.b.r+total_pieces.w.q+total_pieces.b.q)){
				if(total_pieces.w.n+total_pieces.b.n){
					that.isInsufficientMaterial=((total_pieces.w.n+total_pieces.b.n+total_pieces.w.b+total_pieces.b.b)===1);//k vs kn
				}else if(total_pieces.w.b+total_pieces.b.b){
					bishop_count=that.countLightDarkBishops();
					
					at_least_one_light=!!(bishop_count.w.lightSquaredBishops+bishop_count.b.lightSquaredBishops);
					at_least_one_dark=!!(bishop_count.w.darkSquaredBishops+bishop_count.b.darkSquaredBishops);
					
					that.isInsufficientMaterial=(at_least_one_light!==at_least_one_dark);//k(b*x) vs k(b*x)
				}else{//k vs k
					that.isInsufficientMaterial=true;
				}
			}
			
			that.isFiftyMove=(that.halfMove>=100);
			
			that.inDraw=(!that.isCheckmate && (that.isStalemate || that.isThreefold || that.isInsufficientMaterial || that.isFiftyMove));
			
			that.w.materialDiff=[];
			that.b.materialDiff=[];
			
			for(i=1; i<7; i++){//1...6
				current_diff=(total_pieces.w[toBal(-i)]-total_pieces.b[toBal(-i)]);
				
				for(j=0, len=Math.abs(current_diff); j<len; j++){//0<len
					if(current_diff>0){
						that.w.materialDiff.push(i);
					}else{
						that.b.materialDiff.push(-i);
					}
				}
			}
		}
		
		function _refinedFenTest(){
			var i, j, k, that, temp, en_passant_square, behind_ep_val, infront_ep_is_empty, bishop_count, total_pieces, fen_board, total_pawns_in_current_file, min_captured, active_side, non_active_side, current_side, current_other_side, current_bishop_count, current_promoted_count, error_msg;
			
			that=this;
			
			error_msg="";
			
			//if(!error_msg){
				active_side=that[that.activeColor];
				non_active_side=that[that.nonActiveColor];
				
				if((that.halfMove-active_side.isBlack+1)>=(that.fullMove*2)){
					error_msg="Error [0] exceeding half moves ratio";
				}
			//}
			
			if(!error_msg){
				if(that.checks>2){
					error_msg="Error [1] king is checked more times than possible";
				}
			}
			
			if(!error_msg){
				that.toggleActiveNonActive();
				
				if(that.countAttacks(null, true)){
					error_msg="Error [2] non-active king in check";
				}
				
				that.toggleActiveNonActive();
			}
			
			if(!error_msg){
				if(that.enPassantBos){
					en_passant_square=that.getSquare(that.enPassantBos);
					
					infront_ep_is_empty=that.getSquare(en_passant_square, {
						rankShift : active_side.singlePawnRankShift
					}).isEmptySquare;
					
					behind_ep_val=that.getSquare(en_passant_square, {
						rankShift : non_active_side.singlePawnRankShift
					}).val;
					
					if(that.halfMove || !en_passant_square.isEmptySquare || en_passant_square.rankPos!==(active_side.isBlack ? 5 : 2) || !infront_ep_is_empty || behind_ep_val!==non_active_side.pawn){
						error_msg="Error [3] bad en-passant";
					}
				}
			}
			
			if(!error_msg){
				total_pieces=countPieces(that.fen);
				bishop_count=that.countLightDarkBishops();
				
				for(i=0; i<2; i++){//0...1
					current_side=(i ? total_pieces.b : total_pieces.w);
					current_other_side=(i ? total_pieces.w : total_pieces.b);
					
					current_bishop_count=(i ? bishop_count.b : bishop_count.w);
					
					//if(current_side.k!==1){...} done in _basicFenTest
					
					if(current_side.p>8){
						error_msg="Error ["+(i+4)+"] more than 8 pawns";
						break;
					}
					
					current_promoted_count=(Math.max((current_side.n-2), 0)+Math.max((current_bishop_count.lightSquaredBishops-1), 0)+Math.max((current_bishop_count.darkSquaredBishops-1), 0)+Math.max((current_side.r-2), 0)+Math.max((current_side.q-1), 0));
					
					temp=(current_other_side.p+current_other_side.n+current_other_side.b+current_other_side.r+current_other_side.q+current_other_side.k);
					
					if(temp===16 && current_promoted_count){
						error_msg="Error ["+(i+6)+"] promoted pieces without capturing any piece";
						break;
					}
					
					if(current_promoted_count>(8-current_side.p)){
						error_msg="Error ["+(i+8)+"] promoted pieces exceed the number of missing pawns";
						break;
					}
				}
			}
			
			if(!error_msg){
				fen_board=that.fen.split(" ")[0];
				
				for(i=0; i<2; i++){//0...1
					current_side=(i ? that.b : that.w);
					min_captured=0;
					
					for(j=0; j<8; j++){//0...7
						total_pawns_in_current_file=0;
						
						for(k=0; k<8; k++){//0...7
							total_pawns_in_current_file+=(that.getSquare([k, j]).val===current_side.pawn);
						}
						
						if(total_pawns_in_current_file>1){
							temp=((j===0 || j===7) ? [1, 3, 6, 10, 99] : [1, 2, 4, 6, 9]);
							
							min_captured+=temp[total_pawns_in_current_file-2];
						}
					}
					
					if(min_captured>(15-_occurrences(fen_board, (i ? "P|N|B|R|Q" : "p|n|b|r|q")))){
						error_msg="Error [10] not enough captured pieces to support the total doubled pawns";
						break;
					}
				}
			}
			
			if(!error_msg){
				for(i=0; i<2; i++){//0...1
					current_side=(i ? that.b : that.w);
					
					if(current_side.castling){
						temp=(i ? "8" : "1");
						
						if(that.getSquare("e"+temp).val!==current_side.king){
							error_msg="Error [11] "+(i ? "black" : "white")+" castling rights without king in original square";
						}else if(current_side.castling!==_LONG_CASTLE && that.getSquare("h"+temp).val!==current_side.rook){
							error_msg="Error [12] "+(i ? "black" : "white")+" short castling rights with missing H-file rook";
						}else if(current_side.castling!==_SHORT_CASTLE && that.getSquare("a"+temp).val!==current_side.rook){
							error_msg="Error [13] "+(i ? "black" : "white")+" long castling rights with missing A-file rook";
						}
						
						if(error_msg){
							break;
						}
					}
				}
			}
			
			return error_msg;
		}
		
		function _testCollision(op, initial_qos, piece_direction, as_knight, total_squares, allow_capture, ally_qal){
			var i, that, current_square, rank_change, file_change, active_side, is_ally_piece, rtn;
			
			that=this;
			
			rtn={
				candidateMoves : [],
				isAttacked : false,
				disambiguationPos : null
			};
			
			active_side=that[that.activeColor];
			
			piece_direction=_toInt(piece_direction, 1, 8);
			rank_change=(as_knight ? [-2, -1, 1, 2, 2, 1, -1, -2] : [-1, -1, 0, 1, 1, 1, 0, -1])[piece_direction-1];
			file_change=(as_knight ? [1, 2, 2, 1, -1, -2, -2, -1] : [0, 1, 1, 1, 0, -1, -1, -1])[piece_direction-1];
			
			total_squares=_toInt(as_knight ? 1 : (total_squares || 7));
			
			for(i=0; i<total_squares; i++){//0<total_squares
				current_square=that.getSquare(initial_qos, {
					rankShift : (rank_change*(i+1)),
					fileShift : (file_change*(i+1))
				});
				
				if(current_square===null){
					break;
				}
				
				if(current_square.isEmptySquare){
					if(op===1){
						rtn.candidateMoves.push(current_square.pos);
					}
					
					continue;
				}
				
				is_ally_piece=(current_square.sign===active_side.sign);
				
				if(op===1 && !is_ally_piece){
					if(allow_capture && !current_square.isKing){
						rtn.candidateMoves.push(current_square.pos);
					}
				}
				
				if(op===2 && !is_ally_piece){
					if(as_knight){
						if(current_square.isKnight){
							rtn.isAttacked=true;
						}
					}else if(current_square.isKing){
						if(!i){
							rtn.isAttacked=true;
						}
					}else if(current_square.isQueen){
						rtn.isAttacked=true;
					}else if(piece_direction%2){
						if(current_square.isRook){
							rtn.isAttacked=true;
						}
					}else if(current_square.isBishop){
						rtn.isAttacked=true;
					}else if(!i && current_square.isPawn){
						if(current_square.sign>0){
							if(piece_direction===_DIRECTION_BOTTOM_RIGHT || piece_direction===_DIRECTION_BOTTOM_LEFT){
								rtn.isAttacked=true;
							}
						}else{
							if(piece_direction===_DIRECTION_TOP_RIGHT || piece_direction===_DIRECTION_TOP_LEFT){
								rtn.isAttacked=true;
							}
						}
					}
				}
				
				if(op===3 && is_ally_piece){
					if(current_square.absVal===toAbsVal(ally_qal)){
						rtn.disambiguationPos=current_square.pos;
					}
				}
				
				break;
			}
			
			return rtn;
		}
		
		//p = {returnType (!= san), squareType, delimiter}
		function _legalMovesHelper(target_qos, p){
			var i, j, len, len2, that, temp, current_cached_square, target_cached_square, current_diagonal_square, pre_validated_arr_pos, en_passant_capturable_cached_square, piece_directions, active_side, non_active_side, no_errors, rtn;
			
			that=this;
			
			function _candidateMoves(qos, piece_direction, as_knight, total_squares, allow_capture){//uses: that
				return that.testCollision(1, qos, piece_direction, as_knight, total_squares, allow_capture, null).candidateMoves;
			}
			
			rtn=[];
			p=(_isObject(p) ? p : {});
			no_errors=true;
			
			//if(no_errors){
				p.returnType=((typeof p.returnType)==="string" ? p.returnType : "toSquare");
				
				p.squareType=((typeof p.squareType)==="string" ? p.squareType : "bos");
				
				p.delimiter=((typeof p.delimiter)==="string" ? p.delimiter : "-");
				p.delimiter=p.delimiter.charAt(0);
				
				target_cached_square=that.getSquare(target_qos, {
					isUnreferenced : true
				});
				
				if(target_cached_square===null){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				active_side=that[that.activeColor];
				non_active_side=that[that.nonActiveColor];
				
				if(target_cached_square.isEmptySquare || target_cached_square.sign===non_active_side.sign){
					no_errors=false;
				}
			}
			
			if(no_errors){//is inside board + is ally piece
				pre_validated_arr_pos=[];
				en_passant_capturable_cached_square=null;
				
				if(target_cached_square.isKing){
					for(i=1; i<9; i++){//1...8
						temp=_candidateMoves(target_cached_square, i, false, 1, true);
						
						if(temp.length){
							pre_validated_arr_pos.push(temp);
						}
					}
					
					if(active_side.castling && !that.isCheck){
						for(i=0; i<2; i++){//0...1
							if(active_side.castling===(i ? _SHORT_CASTLE : _LONG_CASTLE)){
								continue;
							}
							
							if(_candidateMoves(target_cached_square, (i ? _DIRECTION_LEFT : _DIRECTION_RIGHT), false, (i ? 3 : 2), false).length!==(i ? 3 : 2)){
								continue;
							}
							
							if(that.countAttacks(that.getSquare(target_cached_square, {fileShift : (i ? -1 : 1)}), true)){
								continue;
							}
							
							temp=that.getSquare(target_cached_square, {
								fileShift : (i ? -2 : 2)
							});
							
							pre_validated_arr_pos.push([temp]);
						}
					}
				}else if(target_cached_square.isPawn){
					temp=_candidateMoves(target_cached_square, (active_side.isBlack ? _DIRECTION_BOTTOM : _DIRECTION_TOP), false, (target_cached_square.rankPos===active_side.secondRankPos ? 2 : 1), false);
					
					if(temp.length){
						pre_validated_arr_pos.push(temp);
					}
					
					for(i=0; i<2; i++){//0...1
						current_diagonal_square=that.getSquare(target_cached_square, {
							rankShift : active_side.singlePawnRankShift,
							fileShift : (i ? -1 : 1)
						});
						
						if(current_diagonal_square===null){
							continue;
						}
						
						temp=sameSquare(current_diagonal_square, that.enPassantBos);
						
						if(temp || (current_diagonal_square.sign!==active_side.sign && !current_diagonal_square.isEmptySquare && !current_diagonal_square.isKing)){
							pre_validated_arr_pos.push([current_diagonal_square]);
						}
						
						if(temp){
							en_passant_capturable_cached_square=that.getSquare(current_diagonal_square, {
								rankShift : non_active_side.singlePawnRankShift,
								isUnreferenced : true
							});
						}
					}
				}else{//knight, bishop, rook, queen
					piece_directions=[];
					if(!target_cached_square.isBishop){piece_directions.push(1, 3, 5, 7);}
					if(!target_cached_square.isRook){piece_directions.push(2, 4, 6, 8);}
					
					for(i=0, len=piece_directions.length; i<len; i++){//0<len
						temp=_candidateMoves(target_cached_square, piece_directions[i], target_cached_square.isKnight, null, true);
						
						if(temp.length){
							pre_validated_arr_pos.push(temp);
						}
					}
				}
				
				for(i=0, len=pre_validated_arr_pos.length; i<len; i++){//0<len
					for(j=0, len2=pre_validated_arr_pos[i].length; j<len2; j++){//0<len2
						current_cached_square=that.getSquare(pre_validated_arr_pos[i][j], {
							isUnreferenced : true
						});
						
						that.setSquare(current_cached_square, target_cached_square.val);
						that.setSquare(target_cached_square, _EMPTY_SQR);
						
						if(en_passant_capturable_cached_square!==null){
							if(sameSquare(current_cached_square, that.enPassantBos)){
								that.setSquare(en_passant_capturable_cached_square, _EMPTY_SQR);
							}
						}
						
						if(!that.countAttacks((target_cached_square.isKing ? current_cached_square : null), true)){
							if(p.returnType==="joined"){
								rtn.push(target_cached_square.bos+p.delimiter+current_cached_square.bos);
							}else if(p.returnType==="fromToSquares"){
								if(p.squareType==="square"){
									rtn.push([that.getSquare(target_cached_square, {isUnreferenced : true}), that.getSquare(current_cached_square, {isUnreferenced : true})]);
								}else if(p.squareType==="pos"){
									rtn.push([toPos(target_cached_square), toPos(current_cached_square)]);
								}else{//type "bos"
									rtn.push([target_cached_square.bos, current_cached_square.bos]);
								}
							}else{//type "toSquare"
								if(p.squareType==="square"){
									rtn.push(that.getSquare(current_cached_square, {isUnreferenced : true}));
								}else if(p.squareType==="pos"){
									rtn.push(toPos(current_cached_square));
								}else{//type "bos"
									rtn.push(current_cached_square.bos);
								}
							}
						}
						
						that.setSquare(current_cached_square, current_cached_square.val);
						that.setSquare(target_cached_square, target_cached_square.val);
						
						if(en_passant_capturable_cached_square!==null){
							that.setSquare(en_passant_capturable_cached_square, en_passant_capturable_cached_square.val);
						}
					}
				}
			}
			
			return rtn;
		}
		
		//p = {returnType, squareType, delimiter}
		function _legalMoves(target_qos, p){
			var that, convert_to_san;
			
			that=this;
			
			p=(_isObject(p) ? p : {});
			
			convert_to_san=((typeof p.returnType)==="string" && p.returnType==="san");
			
			return (convert_to_san ? that.legalSanMoves(target_qos) : that.legalMovesHelper(target_qos, p));
		}
		
		function _legalSanMoves(target_qos){
			var i, len, that, temp, legal_moves, legal_san_moves, no_errors, rtn;
			
			that=this;
			
			rtn=[];
			no_errors=true;
			
			//if(no_errors){
				legal_moves=that.legalMoves(target_qos, {returnType : "fromToSquares"});
				
				if(!legal_moves.length){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				legal_san_moves=[];
				
				for(i=0, len=legal_moves.length; i<len; i++){//0<len
					temp=that.playMove(legal_moves[i], {isMockMove : true});
					
					if(temp===null){
						break;
					}
					
					legal_san_moves.push(temp.San);
				}
				
				if(legal_san_moves.length!==legal_moves.length){
					no_errors=false;
				}
			}
			
			if(no_errors){
				rtn=legal_san_moves;
			}
			
			return rtn;
		}
		
		//p = {delimiter}
		function _isLegalMove(mov, p){
			var that, temp, moves, no_errors, rtn;
			
			that=this;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				temp=that.getWrappedMove(mov, p);
				
				if(temp===null){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				moves=that.legalMoves(temp[0][0]);
				
				if(!moves.length){
					no_errors=false;
				}
			}
			
			if(no_errors){
				rtn=_strContains(moves.join(), toBos(temp[0][1]));
			}
			
			return rtn;
		}
		
		function _pgnExport(){/*2020 p options: remove comments, max line len, tag white-list*/
			var i, len, that, header, ordered_tags, result_tag_ow, move_list, black_starts, initial_fen, initial_full_move, text_game, rtn;
			
			that=this;
			
			rtn="";
			
			header=(_isObject(header) ? header : {});/*2020 header de _parserHelper()*/
			
			move_list=that.moveList;
			
			initial_fen=move_list[0].Fen;
			
			black_starts=_strContains(initial_fen, " b ");
			
			initial_full_move=(that.fullMove-Math.floor((that.currentMove+black_starts-1)/2)+(black_starts===!(that.currentMove%2))-1);
			
			result_tag_ow="*";
			
			text_game="";
			
			for(i=0, len=move_list.length; i<len; i++){//0<len
				if(i){
					text_game+=(i!==1 ? " " : "");
					
					text_game+=(black_starts===!(i%2) ? ((initial_full_move+Math.floor((i+black_starts-1)/2))+". ") : "");
					
					text_game+=move_list[i].San;
					
					if(move_list[i].Comment){
						text_game+=" "+move_list[i].Comment;
					}
				}
				
				if(move_list[i].MoveResult){
					result_tag_ow=move_list[i].MoveResult;
				}
			}
			
			if(result_tag_ow==="*"){
				if(move_list[move_list.length-1].CanDraw){
					result_tag_ow="1/2-1/2";
				}
			}
			
			if(that.manualResult!=="*"){
				result_tag_ow=that.manualResult;
			}
			
			if(text_game){
				if(black_starts){
					text_game=initial_full_move+"..."+text_game;
				}
				
				text_game+=" "+result_tag_ow;
			}else{
				text_game+=result_tag_ow;
			}
			
			text_game=(text_game || "*");
			
			ordered_tags=[["Event", (header.Event || "Chess game")], ["Site", (header.Site || "?")], ["Date", (header.Date || "????.??.??")], ["Round", (header.Round || "?")], ["White", (header.White || "?")], ["Black", (header.Black || "?")], ["Result", result_tag_ow]];
			
			if(initial_fen!==_DEFAULT_FEN){
				ordered_tags.push(["SetUp", "1"]);
				ordered_tags.push(["FEN", initial_fen]);
			}
			
			for(i=0, len=ordered_tags.length; i<len; i++){//0<len
				rtn+="["+ordered_tags[i][0]+" \""+ordered_tags[i][1]+"\"]\n";
			}
			
			//tener cuidado para que las 7 + setup + fen salgan en orden y sin duplicar
			
			rtn+="\n"+text_game;
			
			return rtn;
		}
		
		function _ascii(is_rotated){
			var i, j, that, bottom_label, current_square, rtn;
			
			that=this;
			
			is_rotated=((typeof is_rotated)==="boolean" ? is_rotated : that.isRotated);
			
			rtn="   +------------------------+\n";
			bottom_label="";
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					current_square=that.getSquare(is_rotated ? [(7-i), (7-j)] : [i, j]);
					
					rtn+=(j ? "" : (" "+current_square.rankBos+" |"));
					rtn+=" "+current_square.bal.replace("*", ".")+" ";
					rtn+=(j===7 ? "|\n" : "");
					
					bottom_label+=(i===j ? ("  "+current_square.fileBos) : "");
				}
			}
			
			rtn+="   +------------------------+\n";
			rtn+="   "+bottom_label+"\n";
			
			return rtn;
		}
		
		function _boardHash(){
			var i, len, that, temp;
			
			that=this;
			
			temp="";
			
			for(i=0, len=_MUTABLE_KEYS.length; i<len; i++){//0<len
				if(_MUTABLE_KEYS[i]==="selectedBos"){
					continue;
				}
				
				temp+=JSON.stringify(that[_MUTABLE_KEYS[i]]);
			}
			
			return _hashCode(temp);
		}
		
		function _isEqualBoard(to_woard){
			var that, to_board, no_errors, rtn;
			
			that=this;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				to_board=getBoard(to_woard);
				
				if(to_board===null){
					no_errors=false;
					_consoleLog("Error[_isEqualBoard]: to_woard doesn't exist");
				}
			//}
			
			if(no_errors){
				rtn=(that===to_board || that.boardHash()===to_board.boardHash());
			}
			
			return rtn;
		}
		
		function _cloneBoardFrom(from_woard){
			var that, from_board, no_errors, rtn;
			
			that=this;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				from_board=getBoard(from_woard);
				
				if(from_board===null){
					no_errors=false;
					_consoleLog("Error[_cloneBoardFrom]: from_woard doesn't exist");
				}
			//}
			
			if(no_errors){
				if(that===from_board){
					no_errors=false;
					_consoleLog("Error[_cloneBoardFrom]: trying to self clone");
				}
			}
			
			if(no_errors){
				rtn=true;
				
				_cloneBoardObjs(that, from_board);
				
				that.refreshBoard(0);//autorefresh
			}
			
			return rtn;
		}
		
		function _cloneBoardTo(to_woard){
			var that, to_board, no_errors, rtn;
			
			that=this;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				to_board=getBoard(to_woard);
				
				if(to_board===null){
					no_errors=false;
					_consoleLog("Error[_cloneBoardTo]: to_woard doesn't exist");
				}
			//}
			
			if(no_errors){
				if(that===to_board){
					no_errors=false;
					_consoleLog("Error[_cloneBoardTo]: trying to self clone");
				}
			}
			
			if(no_errors){
				rtn=true;
				
				_cloneBoardObjs(to_board, that);
				
				to_board.refreshBoard(0);//autorefresh
			}
			
			return rtn;
		}
		
		function _countLightDarkBishops(){
			var i, j, that, current_square, current_side, rtn;
			
			that=this;
			
			rtn={w:{lightSquaredBishops:0, darkSquaredBishops:0}, b:{lightSquaredBishops:0, darkSquaredBishops:0}};
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					current_square=that.getSquare([i, j]);
					
					if(current_square.isBishop){
						current_side=(current_square.sign>0 ? rtn.w : rtn.b);
						
						if((i+j)%2){
							current_side.darkSquaredBishops++;
						}else{
							current_side.lightSquaredBishops++;
						}
					}
				}
			}
			
			return rtn;
		}
		
		function _sanWrapmoveHelper(mov){
			var i, j, k, m, len, len2, that, temp, current_square, validated_move, parsed_promote, parsed_piece_val, parse_exec, pgn_obj, no_errors, rtn;
			
			that=this;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				validated_move=null;
				parsed_promote="";
				
				if((typeof mov)!=="string"){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				parsed_piece_val=0;
				
				mov=_cleanSan(mov);
				parse_exec=/^[NBRQK]/.exec(mov);
				
				if(parse_exec){//knight, bishop, rook, queen, non-castling king
					parsed_piece_val=toVal(parse_exec[0]);
				}else if(mov==="O-O" || mov==="O-O-O"){//castling king
					parsed_piece_val=6;
				}else if(/^[a-h]/.exec(mov)){//pawn move
					parsed_piece_val=1;
					
					parse_exec=/([^=]+)=([NBRQ]).*$/.exec(mov);
					
					if(parse_exec){
						mov=parse_exec[1];
						parsed_promote=parse_exec[2];
					}
				}
				
				if(!parsed_piece_val){
					no_errors=false;
				}
			}
			
			if(no_errors){
				outer:
				for(i=0; i<8; i++){//0...7
					for(j=0; j<8; j++){//0...7
						current_square=that.getSquare([i, j]);
						
						if(parsed_piece_val!==current_square.absVal){
							continue;
						}
						
						temp=that.legalMoves(current_square, {returnType : "fromToSquares"});
						
						for(k=0, len=temp.length; k<len; k++){//0<len
							pgn_obj=that.draftMove(temp[k]);/*NO pass unnecessary promoteTo*/
							
							if(!pgn_obj.canMove){
								continue;
							}
							
							for(m=0, len2=pgn_obj.withOverdisambiguated.length; m<len2; m++){//0<len2
								if(mov!==pgn_obj.withOverdisambiguated[m]){
									continue;
								}
								
								validated_move=temp[k];
								break outer;
							}
						}
					}
				}
				
				if(validated_move===null){
					no_errors=false;
				}
			}
			
			if(no_errors){
				rtn=[validated_move, parsed_promote];
			}
			
			return rtn;
		}
		
		//p = {delimiter}
		function _getWrappedMove(mov, p){
			var that, temp, bubbling_promoted_to, rtn;
			
			that=this;
			
			rtn=null;
			
			//if(rtn===null){
				bubbling_promoted_to=0;
				
				rtn=_joinedWrapmoveHelper(mov, p);
			//}
			
			if(rtn===null){
				rtn=_fromToWrapmoveHelper(mov);
			}
			
			if(rtn===null){
				temp=_moveWrapmoveHelper(mov);
				
				if(temp){
					bubbling_promoted_to=toAbsVal(temp[1]);
					
					rtn=temp[0];
				}
			}
			
			if(rtn===null){
				temp=that.sanWrapmoveHelper(mov);//place last for better performance
				
				if(temp){
					bubbling_promoted_to=toAbsVal(temp[1]);
					
					rtn=temp[0];
				}
			}
			
			if(rtn){
				temp=(bubbling_promoted_to || toAbsVal(that.promoteTo) || _QUEEN);
				
				rtn=[[toBos(rtn[0]), toBos(rtn[1])], _promoteValHelper(temp)];
			}
			
			return rtn;
		}
		
		//p = {promoteTo, delimiter}
		function _draftMove(mov, p){
			var i, len, that, temp, temp2, temp3, initial_cached_square, final_cached_square, new_en_passant_bos, pawn_moved, promoted_val, bubbling_promoted_to, king_castled, partial_san, with_overdisambiguated, extra_file_bos, extra_rank_bos, piece_directions, active_side, non_active_side, needs_extra, no_errors, rtn;
			
			that=this;
			
			function _disambiguationPos(qos, piece_direction, as_knight, ally_qal){//uses: that
				return that.testCollision(3, qos, piece_direction, as_knight, null, null, ally_qal).disambiguationPos;
			}
			
			rtn={};
			no_errors=true;
			p=(_isObject(p) ? p : {});
			
			//if(no_errors){
				rtn.canMove=false;
				
				temp=that.getWrappedMove(mov, p);
				
				if(temp===null){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				bubbling_promoted_to=(toAbsVal(p.promoteTo) || temp[1]);
				
				initial_cached_square=that.getSquare(temp[0][0], {
					isUnreferenced : true
				});
				
				final_cached_square=that.getSquare(temp[0][1], {
					isUnreferenced : true
				});
				
				rtn.initialCachedSquare=initial_cached_square;
				rtn.finalCachedSquare=final_cached_square;
				
				if(!that.isLegalMove(temp[0])){
					no_errors=false;
				}
			}
			
			if(no_errors){
				rtn.canMove=true;
				
				active_side=that[that.activeColor];
				non_active_side=that[that.nonActiveColor];
				
				pawn_moved=false;
				new_en_passant_bos="";
				promoted_val=0;
				king_castled=0;
				
				if(initial_cached_square.isKing){
					if(active_side.castling){
						rtn.activeSideCastlingZero=true;
						
						if(final_cached_square.filePos===6){//short
							king_castled=_SHORT_CASTLE;
							
							rtn.putRookAtFileShift=-1;
							rtn.removeRookAtFileShift=1;
						}else if(final_cached_square.filePos===2){//long
							king_castled=_LONG_CASTLE;
							
							rtn.putRookAtFileShift=1;
							rtn.removeRookAtFileShift=-2;
						}
					}
				}else if(initial_cached_square.isPawn){
					pawn_moved=true;
					
					if(Math.abs(initial_cached_square.rankPos-final_cached_square.rankPos)>1){//new enpassant
						new_en_passant_bos=that.getSquare(final_cached_square, {
							rankShift : non_active_side.singlePawnRankShift
						}).bos;
					}else if(sameSquare(final_cached_square, that.enPassantBos)){//enpassant capture
						rtn.enPassantCaptureAtRankShift=non_active_side.singlePawnRankShift;
					}else if(final_cached_square.rankPos===active_side.lastRankPos){//promotion
						promoted_val=(bubbling_promoted_to*active_side.sign);
					}
				}
				
				partial_san="";
				with_overdisambiguated=[];
				
				if(king_castled){//castling king
					partial_san+=(king_castled===_LONG_CASTLE ? "O-O-O" : "O-O");
					with_overdisambiguated.push(partial_san);
				}else if(pawn_moved){//pawn move
					if(initial_cached_square.fileBos!==final_cached_square.fileBos){
						partial_san+=(initial_cached_square.fileBos+"x");
					}
					
					partial_san+=final_cached_square.bos;
					with_overdisambiguated.push(partial_san);
					
					if(promoted_val){
						partial_san+="="+toAbsBal(promoted_val);
					}
				}else{//knight, bishop, rook, queen, non-castling king
					extra_file_bos="";
					extra_rank_bos="";
					needs_extra=false;
					
					if(!initial_cached_square.isKing){//knight, bishop, rook, queen
						temp2=[];
						
						piece_directions=[];
						if(!initial_cached_square.isBishop){piece_directions.push(1, 3, 5, 7);}
						if(!initial_cached_square.isRook){piece_directions.push(2, 4, 6, 8);}
						
						for(i=0, len=piece_directions.length; i<len; i++){//0<len
							temp=_disambiguationPos(final_cached_square, piece_directions[i], initial_cached_square.isKnight, initial_cached_square.absVal);
							
							if(temp){
								temp2.push(temp);
							}
						}
						
						len=temp2.length;
						if(len>1){
							temp3="";
							
							for(i=0; i<len; i++){//0<len
								//it's safe to calc legal moves here since we are not dealing with a pawn or king
								if(!sameSquare(temp2[i], initial_cached_square) && that.isLegalMove([temp2[i], final_cached_square])){
									temp3+=toBos(temp2[i]);
								}
							}
							
							if(temp3){
								needs_extra=true;
								
								temp=(_strContains(temp3, initial_cached_square.fileBos)+(_strContains(temp3, initial_cached_square.rankBos)*2));
								
								if(temp && temp!==1){//2,3
									extra_file_bos=initial_cached_square.fileBos;
								}
								
								if(temp && temp!==2){//1,3
									extra_rank_bos=initial_cached_square.rankBos;
								}
							}
						}
					}
					
					temp="";
					
					if(!final_cached_square.isEmptySquare){
						temp+="x";
					}
					
					temp+=final_cached_square.bos;
					temp2=(!!extra_file_bos+!!extra_rank_bos);
					
					if(needs_extra){
						if(!temp2){
							partial_san+=initial_cached_square.absBal+initial_cached_square.fileBos+temp;
						}else{
							partial_san+=initial_cached_square.absBal+extra_file_bos+extra_rank_bos+temp;
							with_overdisambiguated.push(partial_san);
						}
					}else{
						partial_san+=initial_cached_square.absBal+temp;
						with_overdisambiguated.push(partial_san);
					}
					
					if(!temp2){//0
						with_overdisambiguated.push(initial_cached_square.absBal+initial_cached_square.fileBos+temp);
						with_overdisambiguated.push(initial_cached_square.absBal+initial_cached_square.rankBos+temp);
					}
					
					if(temp2!==2){//0,1
						with_overdisambiguated.push(initial_cached_square.absBal+initial_cached_square.fileBos+initial_cached_square.rankBos+temp);
					}
				}
				
				rtn.pawnMoved=pawn_moved;
				rtn.newEnPassantBos=new_en_passant_bos;
				rtn.promotedVal=promoted_val;
				rtn.partialSan=partial_san;
				rtn.withOverdisambiguated=with_overdisambiguated;
			}
			
			return rtn;
		}
		
		//p = {isMockMove, promoteTo, delimiter}
		function _playMove(mov, p){
			var i, that, temp, temp2, initial_cached_square, final_cached_square, pgn_obj, complete_san, move_res, active_side, non_active_side, current_side, autogen_comment, keep_going, rtn_move_obj;
			
			that=this;
			
			rtn_move_obj=null;
			p=(_isObject(p) ? p : {});
			keep_going=true;
			
			//if(keep_going){
				p.isMockMove=(p.isMockMove===true);
				
				if(p.isMockMove){
					p.isMockMove=false;
					
					rtn_move_obj=fenApply(that.fen, "playMove", [mov, p]);
					
					keep_going=false;
				}
			//}
			
			if(keep_going){
				pgn_obj=that.draftMove(mov, p);
				
				if(!pgn_obj.canMove){
					keep_going=false;
				}
			}
			
			if(keep_going){
				active_side=that[that.activeColor];
				non_active_side=that[that.nonActiveColor];
				
				initial_cached_square=pgn_obj.initialCachedSquare;
				final_cached_square=pgn_obj.finalCachedSquare;
				
				if(pgn_obj.activeSideCastlingZero){
					active_side.castling=0;
				}
				
				if(pgn_obj.putRookAtFileShift){
					that.setSquare(final_cached_square, active_side.rook, {
						fileShift : pgn_obj.putRookAtFileShift
					});
				}
				
				if(pgn_obj.removeRookAtFileShift){
					that.setSquare(final_cached_square, _EMPTY_SQR, {
						fileShift : pgn_obj.removeRookAtFileShift
					});
				}
				
				if(pgn_obj.enPassantCaptureAtRankShift){
					that.setSquare(final_cached_square, _EMPTY_SQR, {
						rankShift : pgn_obj.enPassantCaptureAtRankShift
					});
				}
				
				for(i=0; i<2; i++){//0...1
					current_side=(i ? active_side : non_active_side);
					temp=(i ? initial_cached_square : final_cached_square);
					
					if(current_side.castling && temp.isRook){
						temp2=(current_side.isBlack ? "8" : "1");
						
						if(current_side.castling!==_LONG_CASTLE && sameSquare(temp, that.getSquare("h"+temp2))){
							current_side.castling-=_SHORT_CASTLE;
						}else if(current_side.castling!==_SHORT_CASTLE && sameSquare(temp, that.getSquare("a"+temp2))){
							current_side.castling-=_LONG_CASTLE;
						}
					}
				}
				
				that.enPassantBos=pgn_obj.newEnPassantBos;
				
				that.setSquare(final_cached_square, (pgn_obj.promotedVal || initial_cached_square.val));
				that.setSquare(initial_cached_square, _EMPTY_SQR);
				
				that.toggleActiveNonActive();
				
				that.halfMove++;
				if(pgn_obj.pawnMoved || final_cached_square.val){
					that.halfMove=0;
				}
				
				if(active_side.isBlack){//active_side is toggled
					that.fullMove++;
				}
				
				that.currentMove++;/*NO move below updateFenAndMisc()*/
				that.updateFenAndMisc();
				
				complete_san=pgn_obj.partialSan;
				move_res="";
				
				if(that.isCheck){
					if(that.isCheckmate){
						complete_san+="#";
						move_res=(non_active_side.isBlack ? "1-0" : "0-1");//non_active_side is toggled
					}else{
						complete_san+="+";
					}
				}else{
					if(that.isStalemate){
						move_res="1/2-1/2";
					}
				}
				
				autogen_comment="";
				
				if(that.inDraw){
					if(that.isStalemate){
						autogen_comment="{Stalemate}";
					}else if(that.isThreefold){
						autogen_comment="{3-fold repetition}";
					}else if(that.isInsufficientMaterial){
						autogen_comment="{Insufficient material}";
					}else if(that.isFiftyMove){//no need to !b.isCheckmate since b.inDraw=true
						autogen_comment="{50 moves rule}";
					}
				}
				
				rtn_move_obj={Fen : that.fen, San : complete_san, Comment : autogen_comment, MoveResult : move_res, CanDraw : that.inDraw, FromBos : initial_cached_square.bos, ToBos : final_cached_square.bos, InitialVal : initial_cached_square.val, FinalVal : (pgn_obj.promotedVal || initial_cached_square.val)};
				
				if(that.currentMove!==that.moveList.length){
					that.moveList=that.moveList.slice(0, that.currentMove);
				}
				
				that.moveList.push({Fen : that.fen, San : complete_san, Comment : autogen_comment, MoveResult : move_res, CanDraw : that.inDraw, FromBos : initial_cached_square.bos, ToBos : final_cached_square.bos, InitialVal : initial_cached_square.val, FinalVal : (pgn_obj.promotedVal || initial_cached_square.val)});/*NO push  referenced rtn_move_obj*/
				
				that.refreshBoard(1);//autorefresh
			}
			
			return rtn_move_obj;
		}
		
		//---------------- board (using IcUi)
		
		function _refreshBoard(animate_move){
			var that;
			
			that=this;
			
			if(_WIN && _WIN.IcUi && _WIN.IcUi.refreshBoard){
				_WIN.IcUi.refreshBoard.apply(that, [animate_move]);
			}
		}
		
		//---------------- ic
		
		function setSilentMode(val){
			_SILENT_MODE=!!val;
		}
		
		function getBoard(woard){
			var is_valid, no_errors, rtn;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				if(!woard){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				is_valid=((typeof woard)==="string" || _isBoard(woard));
				
				if(!is_valid){
					no_errors=false;
				}
			}
			
			if(no_errors){
				if((typeof woard)==="string"){
					woard=_formatName(woard);
					
					if((typeof _BOARDS[woard])==="undefined"){
						no_errors=false;
					}
				}
			}
			
			if(no_errors){
				rtn=(_isBoard(woard) ? woard : _BOARDS[woard]);
			}
			
			return rtn;
		}
		
		function toVal(qal){
			var rtn;
			
			rtn=0;
			
			if((typeof qal)==="string"){
				rtn=_strToValHelper(qal);
			}else if((typeof qal)==="number"){
				rtn=_toInt(qal, -_KING, _KING);
			}else if(_isSquare(qal)){
				rtn=_toInt(qal.val, -_KING, _KING);
			}
			
			return rtn;
		}
		
		function toAbsVal(qal){
			return Math.abs(toVal(qal));
		}
		
		function toBal(qal){
			var temp, val, abs_val;
			
			val=toVal(qal);
			abs_val=toAbsVal(qal);
			
			temp=["*", "p", "n", "b", "r", "q", "k"][abs_val];//deprecate asterisk character as _occurrences() might use RegExp("*", "g") if not cautious
			
			return (val===abs_val ? temp.toUpperCase() : temp);
		}
		
		function toAbsBal(qal){
			return toBal(toAbsVal(qal));
		}
		
		function toClassName(qal){
			var piece_bal, piece_lc_bal;
			
			piece_bal=toBal(qal);
			piece_lc_bal=piece_bal.toLowerCase();
			
			return (piece_bal!=="*" ? ((piece_bal===piece_lc_bal ? "b" : "w")+piece_lc_bal) : "");
		}
		
		function toBos(qos){
			var rtn;
			
			rtn=null;
			
			if(_isArray(qos)){
				qos=_arrToPosHelper(qos);
				
				if(qos!==null){
					rtn=("abcdefgh".charAt(qos[1])+""+(8-qos[0]));
				}
			}else if((typeof qos)==="string"){
				rtn=_strToBosHelper(qos);
			}else if(_isSquare(qos)){
				rtn=_strToBosHelper(qos.bos);
			}
			
			return rtn;
		}
		
		function toPos(qos){
			var rtn;
			
			rtn=null;
			
			if((typeof qos)==="string"){
				qos=_strToBosHelper(qos);
				
				if(qos!==null){
					rtn=[(8-_toInt(qos.charAt(1), 1, 8)), _toInt("abcdefgh".indexOf(qos.charAt(0)), 0, 7)];
				}
			}else if(_isArray(qos)){
				rtn=_arrToPosHelper(qos);
			}else if(_isSquare(qos)){
				rtn=_arrToPosHelper(qos.pos);
			}
			
			return rtn;
		}
		
		function getSign(zal){
			return (((typeof zal)==="boolean" ? !zal : (toVal(zal)>0)) ? 1 : -1);
		}
		
		function getRankPos(qos){
			var pos, rtn;
			
			rtn=null;
			pos=toPos(qos);
			
			if(pos!==null){
				rtn=pos[0];
			}
			
			return rtn;
		}
		
		function getFilePos(qos){
			var pos, rtn;
			
			rtn=null;
			pos=toPos(qos);
			
			if(pos!==null){
				rtn=pos[1];
			}
			
			return rtn;
		}
		
		function getRankBos(qos){
			var bos, rtn;
			
			rtn=null;
			bos=toBos(qos);
			
			if(bos!==null){
				rtn=bos.charAt(1);
			}
			
			return rtn;
		}
		
		function getFileBos(qos){
			var bos, rtn;
			
			rtn=null;
			bos=toBos(qos);
			
			if(bos!==null){
				rtn=bos.charAt(0);
			}
			
			return rtn;
		}
		
		function isInsideBoard(qos){
			return (toPos(qos)!==null);
		}
		
		function sameSquare(qos1, qos2){
			var rtn;
			
			rtn=false;
			qos1=toBos(qos1);
			qos2=toBos(qos2);
			
			if(qos1!==null && qos2!==null){
				rtn=(qos1===qos2);
			}
			
			return rtn;
		}
		
		function countPieces(fen){
			var i, j, fen_board, current_side, rtn;
			
			rtn={w:{p:0, n:0, b:0, r:0, q:0, k:0}, b:{p:0, n:0, b:0, r:0, q:0, k:0}};
			
			if((typeof fen)==="string"){
				fen_board=_trimSpaces(fen).split(" ")[0];
				
				for(i=1; i<7; i++){//1...6
					for(j=0; j<2; j++){//0...1
						current_side=(j ? rtn.w : rtn.b);
						
						current_side[toBal(-i)]=_occurrences(fen_board, toBal(i*getSign(!j)));
					}
				}
			}
			
			return rtn;
		}
		
		function removeBoard(woard){
			var del_board, del_board_name_cache, rtn;
			
			rtn=false;
			
			del_board=getBoard(woard);
			
			if(del_board!==null){//if exists
				rtn=true;
				
				del_board_name_cache=del_board.boardName;
				
				del_board=null;
				_BOARDS[del_board_name_cache]=null;
				
				delete _BOARDS[del_board_name_cache];
				
				/*2020 ui problem: autorefresh when removing loaded board. EDIT: can't easily select a non-hidden board*/
			}
			
			return rtn;
		}
		
		function isEqualBoard(left_woard, right_woard){
			var left_board, no_errors, rtn;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				left_board=getBoard(left_woard);
				
				if(left_board===null){
					no_errors=false;
					_consoleLog("Error[isEqualBoard]: left_woard doesn't exist");
				}
			//}
			
			if(no_errors){
				rtn=left_board.isEqualBoard(right_woard);
			}
			
			return rtn;
		}
		
		function cloneBoard(to_woard, from_woard){
			var to_board, no_errors, rtn;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				to_board=getBoard(to_woard);
				
				if(to_board===null){
					no_errors=false;
					_consoleLog("Error[cloneBoard]: to_woard doesn't exist");
				}
			//}
			
			if(no_errors){
				rtn=to_board.cloneBoardFrom(from_woard);//autorefresh (sometimes)
			}
			
			return rtn;
		}
		
		//p = {boardName, fen, pgn, moveIndex, isRotated, isHidden, isUnlabeled, promoteTo, manualResult, validOrBreak}
		function initBoard(p){
			var i, j, len, temp, board_created, target, board_name, current_pos, current_bos, fen_was_valid, postfen_was_valid, new_board, everything_parsed, no_errors, rtn;
			
			rtn=null;
			p=(_isObject(p) ? p : {});
			board_created=false;
			no_errors=true;
			
			//if(no_errors){
				p.boardName=(((typeof p.boardName)==="string" && _trimSpaces(p.boardName)) ? _formatName(p.boardName) : ("board_"+new Date().getTime()));
				board_name=p.boardName;
				
				p.isRotated=(p.isRotated===true);
				p.isHidden=(p.isHidden===true);
				p.isUnlabeled=(p.isUnlabeled===true);
				p.validOrBreak=(p.validOrBreak===true);
				
				p.pgn=(((typeof p.pgn)==="string" && _trimSpaces(p.pgn)) ? _parserHelper(p.pgn) : null);
				
				if(p.pgn){
					p.fen=(p.fen || p.pgn[0].FEN);
				}
				
				p.fen=(p.fen || _DEFAULT_FEN);
				
				fen_was_valid=!_basicFenTest(p.fen);
				
				if(p.validOrBreak && !fen_was_valid){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" bad FEN");
				}
			//}
			
			if(no_errors){
				target=getBoard(board_name);
				
				if(target===null){
					_BOARDS[board_name]={
						boardName : board_name,
						getSquare : _getSquare,
						setSquare : _setSquare,
						countAttacks : _countAttacks,
						toggleActiveNonActive : _toggleActiveNonActive,
						toggleIsRotated : _toggleIsRotated,
						setPromoteTo : _setPromoteTo,
						setManualResult : _setManualResult,
						setCurrentMove : _setCurrentMove,
						readValidatedFen : _readValidatedFen,
						updateFenAndMisc : _updateFenAndMisc,
						refinedFenTest : _refinedFenTest,
						testCollision : _testCollision,
						isLegalMove : _isLegalMove,
						legalMovesHelper : _legalMovesHelper,
						legalMoves : _legalMoves,
						legalSanMoves : _legalSanMoves,
						pgnExport : _pgnExport,
						ascii : _ascii,
						boardHash : _boardHash,
						isEqualBoard : _isEqualBoard,
						cloneBoardFrom : _cloneBoardFrom,
						cloneBoardTo : _cloneBoardTo,
						countLightDarkBishops : _countLightDarkBishops,
						sanWrapmoveHelper : _sanWrapmoveHelper,
						getWrappedMove : _getWrappedMove,
						draftMove : _draftMove,
						playMove : _playMove,
						navFirst : _navFirst,
						navPrevious : _navPrevious,
						navNext : _navNext,
						navLast : _navLast,
						navLinkMove : _navLinkMove,
						refreshBoard : _refreshBoard
					};
					
					target=getBoard(board_name);
				}
				
				target.w={
					//static
					isBlack : false,
					sign : 1,
					firstRankPos : 7,
					secondRankPos : 6,
					lastRankPos : 0,
					singlePawnRankShift : -1,
					pawn : _PAWN,
					knight : _KNIGHT,
					bishop : _BISHOP,
					rook : _ROOK,
					queen : _QUEEN,
					king : _KING,
					
					//mutable
					kingBos : null,
					castling : null,
					materialDiff : null
				};
				
				target.b={
					//static
					isBlack : true,
					sign : -1,
					firstRankPos : 0,
					secondRankPos : 1,
					lastRankPos : 7,
					singlePawnRankShift : 1,
					pawn : -_PAWN,
					knight : -_KNIGHT,
					bishop : -_BISHOP,
					rook : -_ROOK,
					queen : -_QUEEN,
					king : -_KING,
					
					//mutable
					kingBos : null,
					castling : null,
					materialDiff : null
				};
				
				target.activeColor=null;
				target.nonActiveColor=null;
				target.fen=null;
				target.enPassantBos=null;
				target.halfMove=null;
				target.fullMove=null;
				target.moveList=null;
				target.currentMove=null;
				target.isRotated=null;
				target.checks=null;
				target.isCheck=null;
				target.isCheckmate=null;
				target.isStalemate=null;
				target.isThreefold=null;
				target.isInsufficientMaterial=null;
				target.isFiftyMove=null;
				target.inDraw=null;
				target.promoteTo=null;
				target.manualResult=null;
				target.selectedBos=null;
				target.isHidden=null;
				target.isUnlabeled=null;
				target.squares={};
				
				for(i=0; i<8; i++){//0...7
					for(j=0; j<8; j++){//0...7
						current_pos=[i, j];
						current_bos=toBos(current_pos);
						
						target.squares[current_bos]={};
						temp=target.squares[current_bos];
						
						//static
						temp.pos=current_pos;
						temp.bos=current_bos;
						temp.rankPos=getRankPos(current_pos);
						temp.filePos=getFilePos(current_pos);
						temp.rankBos=getRankBos(current_pos);
						temp.fileBos=getFileBos(current_pos);
						
						//mutable
						temp.bal=null;
						temp.absBal=null;
						temp.val=null;
						temp.absVal=null;
						temp.className=null;
						temp.sign=null;
						temp.isEmptySquare=null;
						temp.isPawn=null;
						temp.isKnight=null;
						temp.isBishop=null;
						temp.isRook=null;
						temp.isQueen=null;
						temp.isKing=null;
					}
				}
				
				new_board=getBoard(board_name);
				
				if(new_board===null){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" board selection failure");
				}
			}
			
			if(no_errors){
				board_created=true;
				
				new_board.isHidden=true;
				new_board.selectedBos="";
				
				temp=(fen_was_valid ? p.fen : _DEFAULT_FEN);/*NO refactor to a function*/
				new_board.currentMove=0;
				new_board.readValidatedFen(temp);
				
				temp="";
				
				if(new_board.isCheckmate){
					temp=(new_board[new_board.activeColor].isBlack ? "1-0" : "0-1");
				}else if(new_board.isStalemate){
					temp="1/2-1/2";
				}
				
				new_board.moveList=[{Fen : new_board.fen, San : "", Comment : "", MoveResult : temp, CanDraw : new_board.inDraw, FromBos : "", ToBos : "", InitialVal : 0, FinalVal : 0}];
				
				postfen_was_valid=!new_board.refinedFenTest();
				
				if(p.validOrBreak && !postfen_was_valid){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" bad postFEN");
				}
			}
			
			if(no_errors){
				if(!postfen_was_valid){
					temp=_DEFAULT_FEN;/*NO refactor to a function*/
					new_board.currentMove=0;
					new_board.readValidatedFen(temp);
					
					temp="";
					
					if(new_board.isCheckmate){
						temp=(new_board[new_board.activeColor].isBlack ? "1-0" : "0-1");
					}else if(new_board.isStalemate){
						temp="1/2-1/2";
					}
					
					new_board.moveList=[{Fen : new_board.fen, San : "", Comment : "", MoveResult : temp, CanDraw : new_board.inDraw, FromBos : "", ToBos : "", InitialVal : 0, FinalVal : 0}];
				}
				
				if(p.pgn){
					everything_parsed=true;
					
					for(i=0, len=p.pgn[1].length; i<len; i++){//0<len
						if(new_board.playMove(p.pgn[1][i])===null){
							everything_parsed=false;
							break;
						}
					}
					
					if(p.validOrBreak && !everything_parsed){
						no_errors=false;
						_consoleLog("Error[initBoard]: \""+board_name+"\" bad PGN");
					}else{
						if(p.pgn[2]!=="*"){
							p.manualResult=(_pgnResultHelper(p.manualResult) || p.pgn[2]);
						}
					}
				}
			}
			
			if(no_errors){
				rtn=new_board;
				
				p.moveIndex=(_isIntOrStrInt(p.moveIndex) ? p.moveIndex : (new_board.moveList.length-1));
				new_board.setCurrentMove(p.moveIndex, true);
				
				new_board.isRotated=p.isRotated;
				new_board.isUnlabeled=p.isUnlabeled;
				new_board.setPromoteTo(p.promoteTo);
				new_board.setManualResult(p.manualResult);
				
				new_board.isHidden=p.isHidden;
				
				new_board.refreshBoard(0);//autorefresh
			}
			
			if(board_created && !no_errors){
				removeBoard(new_board);
			}
			
			return rtn;
		}
		
		function fenApply(fen, fn_name, args){
			var temp, board, board_created, keep_going, rtn;
			
			rtn=null;
			board_created=false;
			keep_going=true;
			
			//if(keep_going){
				fn_name=_formatName(fn_name);
				
				if(fn_name==="playMove"){
					temp=(_isObject(args[1]) ? args[1] : {});
					
					rtn=_playMoveApplyHelper(fen, [args[0], {isMockMove : false, promoteTo : temp.promoteTo, delimiter : temp.delimiter}]);
					
					keep_going=false;
				}
			//}
			
			if(keep_going){
				board=initBoard({
					boardName : "board_fenApply",
					fen : fen,
					isHidden : true,
					validOrBreak : true
				});
				
				board_created=(board!==null);
				
				switch(fn_name){
					case "legalMoves" :
						rtn=(board_created ? _legalMoves.apply(board, args) : []);
						break;
					case "legalSanMoves" :
						rtn=(board_created ? _legalSanMoves.apply(board, args) : []);
						break;
					case "isLegalMove" :
						rtn=(board_created ? _isLegalMove.apply(board, args) : false);
						break;
					case "isLegalFen" :
						rtn=board_created;
						break;
					case "getSquare" :
						temp=(_isObject(args[1]) ? args[1] : {});
						
						rtn=(board_created ? _getSquare.apply(board, [args[0], {rankShift : temp.rankShift, fileShift : temp.fileShift, isUnreferenced : true}]) : null);
						break;
					default :
						_consoleLog("Error[fenApply]: invalid function name \""+fn_name+"\"");
				}
			}
			
			if(board_created){
				removeBoard(board);
			}
			
			return rtn;
		}
		
		function fenGet(fen, props){
			var i, j, len, len2, board, board_created, board_keys, current_key, invalid_key, no_errors, rtn_pre, rtn;
			
			rtn=null;
			board_created=false;
			no_errors=true;
			
			//if(no_errors){
				board=initBoard({
					boardName : "board_fenGet",
					fen : fen,
					isHidden : true,
					validOrBreak : true
				});
				
				if(board===null){
					no_errors=false;
					_consoleLog("Error[fenGet]: invalid FEN");
				}
			//}
			
			if(no_errors){
				board_created=true;
				
				board_keys=[];
				
				if(_isArray(props)){
					board_keys=props;
				}else if((typeof props)==="string" && _trimSpaces(props)){
					board_keys=_trimSpaces(props).split(" ");
				}
				
				rtn_pre={};
				
				for(i=0, len=board_keys.length; i<len; i++){//0<len
					current_key=_formatName(board_keys[i]);
					
					if(current_key && (typeof rtn_pre[current_key])==="undefined"){
						invalid_key=true;
						
						for(j=0, len2=_MUTABLE_KEYS.length; j<len2; j++){//0<len2
							if(current_key===_MUTABLE_KEYS[j]){
								invalid_key=false;
								rtn_pre[current_key]=board[current_key];
								
								break;
							}
						}
						
						if(invalid_key){
							no_errors=false;
							_consoleLog("Error[fenGet]: invalid property name \""+current_key+"\"");
							
							break;
						}
					}
				}
			}
			
			if(no_errors){
				if(!Object.keys(rtn_pre).length){
					no_errors=false;
					_consoleLog("Error[fenGet]: empty property list");
				}
			}
			
			if(no_errors){
				rtn=rtn_pre;
			}
			
			if(board_created){
				removeBoard(board);
			}
			
			return rtn;
		}
		
		function getBoardNames(){
			return Object.keys(_BOARDS);
		}
		
		return {
			version : _VERSION,
			setSilentMode : setSilentMode,
			getBoard : getBoard,
			toVal : toVal,
			toAbsVal : toAbsVal,
			toBal : toBal,
			toAbsBal : toAbsBal,
			toClassName : toClassName,
			toBos : toBos,
			toPos : toPos,
			getSign : getSign,
			getRankPos : getRankPos,
			getFilePos : getFilePos,
			getRankBos : getRankBos,
			getFileBos : getFileBos,
			isInsideBoard : isInsideBoard,
			sameSquare : sameSquare,
			countPieces : countPieces,
			removeBoard : removeBoard,
			isEqualBoard : isEqualBoard,
			cloneBoard : cloneBoard,
			initBoard : initBoard,
			fenApply : fenApply,
			fenGet : fenGet,
			getBoardNames : getBoardNames,
			utilityMisc : {
				consoleLog : _consoleLog,
				isObject : _isObject,
				isArray : _isArray,
				isSquare : _isSquare,
				isBoard : _isBoard,
				isMove : _isMove,
				trimSpaces : _trimSpaces,
				formatName : _formatName,
				strContains : _strContains,
				occurrences : _occurrences,
				toInt : _toInt,
				isIntOrStrInt : _isIntOrStrInt,
				hashCode : _hashCode,
				castlingChars : _castlingChars,
				cleanSan : _cleanSan,
				cloneBoardObjs : _cloneBoardObjs,
				basicFenTest : _basicFenTest
			}
		};
	})(windw);
	
	//Browser
	if(windw!==null){
		if(!windw.Ic){
			windw.Ic=Ic;
		}
	}
	
	//Node.js or any CommonJS
	if(expts!==null){
		if(!expts.Ic){
			expts.Ic=Ic;
		}
	}
	
	//RequireJS environment
	if((typeof defin)==="function" && defin.amd){
		defin(function(){
			return Ic;
		});
	}
})(((typeof window)!=="undefined" ? window : null), ((typeof exports)!=="undefined" ? exports : null), ((typeof define)!=="undefined" ? define : null));
