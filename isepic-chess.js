/** Copyright (c) 2020 Ajax Isepic (ajax333221) Licensed MIT */

/*jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:false, curly:true, latedef:nofunc, bitwise:false, sub:true, eqeqeq:true, esversion:6 */

(function(windw, expts, defin){
	var Ic=(function(_WIN){
		var _VERSION="3.10.6";
		
		var _SILENT_MODE=true;
		var _BOARDS=Object.create(null);
		
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
		
		var _MUTABLE_KEYS=["w", "b", "activeColor", "nonActiveColor", "fen", "enPassantBos", "halfMove", "fullMove", "moveList", "currentMove", "isRotated", "checks", "isCheck", "isCheckmate", "isStalemate", "isThreefold", "isFiftyMove", "isInsufficientMaterial", "inDraw", "materialDiff", "promoteTo", "selectedBos", "isHidden", "squares"];
		
		//---------------- helpers
		
		function _promoteValHelper(qal){
			return _toInt((toAbsVal(qal) || _QUEEN), 2, 5);
		}
		
		function _strToValHelper(str){
			var temp, pc_exec, rtn;
			
			rtn=0;
			str=_trimSpaces(str);
			pc_exec=/^([wb])([pnbrqk])$/.exec(str.toLowerCase());
			
			if(!str){
				rtn=str;
			}else if(!!pc_exec){
				rtn=("*pnbrqk".indexOf(pc_exec[2])*getSign(pc_exec[1]==="b"));
			}else if(RegExp(/^([pnbrqk])$/, "gi").test(str)){
				temp=str.toLowerCase();
				rtn=(("pnbrqk".indexOf(temp)+1)*getSign(str===temp));
			}else if((""+_toInt(str))===str){
				rtn=str;
			}
			
			return _toInt(rtn, -6, 6);//_toInt() removes sign on negative zero
		}
		
		function _strToBosHelper(str){
			var rtn;
			
			rtn=null;
			str=_trimSpaces(str);
			
			if(str && RegExp(/^([a-h][1-8])$/, "gi").test(str)){
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
		
		function _trimSpaces(str){
			return (""+str).replace(/^\s+|\s+$/g, "").replace(/\s\s+/g, " ");
		}
		
		function _formatName(str){
			return _trimSpaces(str).replace(/[^a-z0-9]/gi, "_");
		}
		
		function _strContains(str, str_to_find){
			return (str.indexOf(str_to_find)!==-1);
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
		
		function _cloneBoardObjs(to_board, from_board){
			var i, j, k, len, len2, len3, current_key, current_sub_from, sub_keys, sub_sub_keys, to_prop, from_prop;
			
			if(to_board!==from_board){
				to_board.moveList=[];
				
				for(i=0, len=_MUTABLE_KEYS.length; i<len; i++){//0<len
					current_key=_MUTABLE_KEYS[i];
					to_prop=to_board[current_key];
					from_prop=from_board[current_key];
					
					//["squares"], ["materialDiff"], ["moveList"], ["w", "b"]
					if(_isObject(from_prop) || _isArray(from_prop)){
						sub_keys=Object.keys(from_prop);
						
						for(j=0, len2=sub_keys.length; j<len2; j++){//0<len2
							current_sub_from=from_prop[sub_keys[j]];
							
							//["squares"] object of (64), object of (6 static + 13 mutables = 19) Note: pos is array
							//["materialDiff"] object of (2), arrays of (N)
							//["moveList"] array of (N), object of (8)
							if(_isObject(current_sub_from) || _isArray(current_sub_from)){
								if(current_key==="squares"){
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
								}else{
									sub_sub_keys=Object.keys(current_sub_from);
									
									if(current_key==="materialDiff"){
										to_prop[sub_keys[j]]=[];
									}else if(current_key==="moveList"){
										to_prop[sub_keys[j]]={};
									}
									
									for(k=0, len3=sub_sub_keys.length; k<len3; k++){//0<len3
										if(_isObject(current_sub_from[sub_sub_keys[k]]) || _isArray(current_sub_from[sub_sub_keys[k]])){
											_consoleLog("Error[_cloneBoardObjs]: unexpected type in key \""+sub_sub_keys[k]+"\"");
										}else{//[...] primitive data type
											to_prop[sub_keys[j]][sub_sub_keys[k]]=current_sub_from[sub_sub_keys[k]];
										}
									}
								}
							}else{//["w", "b"] primitive data type
								to_prop[sub_keys[j]]=current_sub_from;
							}
						}
					}else{//[...] primitive data type
						to_board[current_key]=from_board[current_key];//can't use to_prop, it's not a reference here
					}
				}
			}
		}
		
		function _basicFenTest(fen){
			var i, j, len, temp, optional_clocks, last_is_num, current_is_num, fen_board_arr, total_pieces, total_files_in_current_rank, current_side, error_msg;
			
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
				fen_board_arr=fen.split(" ")[0].split("/");
				
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
				total_pieces=countPieces(fen);
				
				for(i=0; i<2; i++){//0...1
					current_side=(i ? total_pieces.b : total_pieces.w);
					
					if(current_side.k!==1){
						error_msg="Error ["+(i+5)+"] board without exactly one king";
						break;
					}
					
					if(current_side.p>8){
						error_msg="Error ["+(i+7)+"] more than 8 pawns";
						break;
					}
					
					if((Math.max((current_side.n-2), 0)+Math.max((current_side.b-2), 0)+Math.max((current_side.r-2), 0)+Math.max((current_side.q-1), 0))>(8-current_side.p)){
						error_msg="Error ["+(i+9)+"] promoted pieces exceed the number of missing pawns";
						break;
					}
				}
			}
			
			return error_msg;
		}
		
		//---------------- board
		
		function _getSquare(qos, p){
			var that, temp_pos, pre_validated_pos, rtn;
			
			that=this;
			
			function _squareHelper(my_square, is_unreferenced){//uses: that
				var temp, rtn_square;
				
				rtn_square=my_square;
				
				if(is_unreferenced){
					temp=Object.create(null);
					
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
		
		function _countAttacks(king_qos, early_break){
			var i, j, that, as_knight, active_side, rtn_total_checks;
			
			that=this;
			
			function _isAttacked(qos, piece_direction, as_knight){//uses: that
				return that.testCollision(2, qos, piece_direction, as_knight, null, null, null).isAttacked;
			}
			
			rtn_total_checks=0;
			
			active_side=that[that.activeColor];
			king_qos=(king_qos || active_side.kingBos);
			
			outer:
			for(i=0; i<2; i++){//0...1
				as_knight=!!i;
				
				for(j=1; j<9; j++){//1...8
					if(_isAttacked(king_qos, j, as_knight)){
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
			var that;
			
			that=this;
			
			new_active=((typeof new_active)==="boolean" ? new_active : !that[that.activeColor].isBlack);
			
			that.activeColor=(new_active ? "b" : "w");
			that.nonActiveColor=(!new_active ? "b" : "w");
		}
		
		function _toggleIsRotated(new_is_rotated){
			var that;
			
			that=this;
			
			new_is_rotated=((typeof new_is_rotated)==="boolean" ? new_is_rotated : !that.isRotated);
			
			that.isRotated=new_is_rotated;
			
			that.refreshBoard(0);//autorefresh
		}
		
		function _setPromoteTo(qal){
			var that;
			
			that=this;
			
			that.promoteTo=_promoteValHelper(qal);
			
			that.refreshBoard(0);//autorefresh
		}
		
		function _setCurrentMove(num, is_goto){
			var len, that, temp, rtn_moved;
			
			that=this;
			
			rtn_moved=false;
			len=that.moveList.length;
			
			if(len>1){
				temp=_toInt((is_goto ? num : (num+that.currentMove)), 0, (len-1));
				
				if(temp!==that.currentMove){
					rtn_moved=true;
					
					that.currentMove=temp;
					that.readFen(that.moveList[temp].Fen);
				}
			}
			
			that.refreshBoard((rtn_moved && !is_goto) ? num : 0);//autorefresh
			
			return rtn_moved;
		}
		
		function _readFen(fen){
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
			var i, j, len, that, current_square, current_diff, total_pieces, consecutive_empty_squares, new_fen_board, clockless_fen, times_found, no_legal_moves, bishop_count, at_least_one_light, at_least_one_dark, current_side;
			
			that=this;
			
			new_fen_board="";
			bishop_count={w:{lightSquaredBishops:0, darkSquaredBishops:0}, b:{lightSquaredBishops:0, darkSquaredBishops:0}};
			
			for(i=0; i<8; i++){//0...7
				consecutive_empty_squares=0;
				
				for(j=0; j<8; j++){//0...7
					current_square=that.getSquare([i, j]);
					
					if(!current_square.isEmptySquare){
						if(current_square.isKing){
							current_side=(current_square.sign===that[that.activeColor].sign ? that[that.activeColor] : that[that.nonActiveColor]);
							
							current_side.kingBos=current_square.bos;
						}else if(current_square.isBishop){
							current_side=(current_square.sign>0 ? bishop_count.w : bishop_count.b);
							
							if((i+j)%2){
								current_side.darkSquaredBishops++;
							}else{
								current_side.lightSquaredBishops++;
							}
						}
						
						new_fen_board+=(consecutive_empty_squares || "")+current_square.bal;
						consecutive_empty_squares=-1;
					}
					
					consecutive_empty_squares++;
				}
				
				new_fen_board+=(consecutive_empty_squares || "")+(i!==7 ? "/" : "");
			}
			
			that.checks=that.countAttacks(null);
			
			no_legal_moves=true;
			
			outer:
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					if(that.legalMoves([i, j]).length){
						no_legal_moves=false;
						break outer;
					}
				}
			}
			
			that.isCheck=!!that.checks;
			that.isCheckmate=(that.isCheck && no_legal_moves);
			that.isStalemate=(!that.isCheck && no_legal_moves);
			
			clockless_fen=(new_fen_board+" "+that.activeColor+" "+((_castlingChars(that.w.castling).toUpperCase()+""+_castlingChars(that.b.castling)) || "-")+" "+(that.enPassantBos || "-"));
			
			that.fen=(clockless_fen+" "+that.halfMove+" "+that.fullMove);
			
			that.isThreefold=false;
			
			if(that.currentMove>7){
				times_found=1;
				
				for(i=(that.currentMove-1); i>=0; i--){//(len-1)...0
					if(that.moveList[i].Fen.split(" ").slice(0, 4).join(" ")===clockless_fen){
						times_found++;
						
						if(times_found>2){
							that.isThreefold=true;
							break;
						}
					}
				}
			}
			
			that.isFiftyMove=(that.halfMove>=100);
			
			total_pieces=countPieces(clockless_fen);
			that.isInsufficientMaterial=false;
			
			if(!(total_pieces.w.p+total_pieces.b.p+total_pieces.w.r+total_pieces.b.r+total_pieces.w.q+total_pieces.b.q)){
				if(total_pieces.w.n+total_pieces.b.n){
					that.isInsufficientMaterial=((total_pieces.w.n+total_pieces.b.n+total_pieces.w.b+total_pieces.b.b)===1);//k vs kn
				}else if(total_pieces.w.b+total_pieces.b.b){
					at_least_one_light=!!(bishop_count.w.lightSquaredBishops+bishop_count.b.lightSquaredBishops);
					at_least_one_dark=!!(bishop_count.w.darkSquaredBishops+bishop_count.b.darkSquaredBishops);
					
					that.isInsufficientMaterial=(at_least_one_light!==at_least_one_dark);//k(b*x) vs k(b*x)
				}else{//k vs k
					that.isInsufficientMaterial=true;
				}
			}
			
			that.inDraw=(that.isStalemate || that.isThreefold || that.isFiftyMove || that.isInsufficientMaterial);
			
			that.materialDiff={w:[], b:[]};
			
			for(i=1; i<7; i++){//1...6
				current_diff=(total_pieces.w[toBal(-i)]-total_pieces.b[toBal(-i)]);
				
				for(j=0, len=Math.abs(current_diff); j<len; j++){//0<len
					if(current_diff>0){
						that.materialDiff.w.push(i);
					}else{
						that.materialDiff.b.push(-i);
					}
				}
			}
		}
		
		function _refinedFenTest(){
			var i, j, k, that, temp, en_passant_square, behind_ep_val, infront_ep_is_empty, fen_board, total_pawns_in_current_file, min_captured, active_side, non_active_side, current_side, error_msg;
			
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
						error_msg="Error [4] not enough captured pieces to support the total doubled pawns";
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
							error_msg="Error [5] "+(i ? "black" : "white")+" castling rights without king in original position";
						}else if(current_side.castling!==_LONG_CASTLE && that.getSquare("h"+temp).val!==current_side.rook){
							error_msg="Error [6] "+(i ? "black" : "white")+" short castling rights with missing H-file rook";
						}else if(current_side.castling!==_SHORT_CASTLE && that.getSquare("a"+temp).val!==current_side.rook){
							error_msg="Error [7] "+(i ? "black" : "white")+" long castling rights with missing A-file rook";
						}
					}
					
					if(error_msg){
						break;
					}
				}
			}
			
			return error_msg;
		}
		
		function _testCollision(op, initial_qos, piece_direction, as_knight, total_squares, allow_capture, ally_qal){
			var i, that, current_square, rank_change, file_change, active_side, rtn;
			
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
				
				if(!current_square.isEmptySquare){
					if(current_square.sign===active_side.sign){//is ally piece
						if(op===3){
							if(current_square.absVal===toAbsVal(ally_qal)){
								rtn.disambiguationPos=current_square.pos;
							}
						}
					}else{//is enemy piece
						if(op===1){
							if(allow_capture && !current_square.isKing){
								rtn.candidateMoves.push(current_square.pos);
							}
						}else if(op===2){
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
					}
					
					break;
				}
				
				if(op===1){
					rtn.candidateMoves.push(current_square.pos);//if capturing, this is unreachable because the break
				}
			}
			
			return rtn;
		}
		
		function _legalMoves(target_qos){
			var i, j, len, len2, that, temp, current_cached_square, target_cached_square, current_diagonal_square, pre_validated_arr_pos, en_passant_capturable_cached_square, piece_directions, no_errors, active_side, non_active_side, rtn;
			
			that=this;
			
			function _candidateMoves(qos, piece_direction, as_knight, total_squares, allow_capture){//uses: that
				return that.testCollision(1, qos, piece_direction, as_knight, total_squares, allow_capture, null).candidateMoves;
			}
			
			rtn=[];
			no_errors=true;
			
			//if(no_errors){
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
							if(active_side.castling!==(i ? _SHORT_CASTLE : _LONG_CASTLE)){
								if(_candidateMoves(target_cached_square, (i ? _DIRECTION_LEFT : _DIRECTION_RIGHT), false, (i ? 3 : 2), false).length===(i ? 3 : 2)){
									if(!that.countAttacks(that.getSquare(target_cached_square, {fileShift : (i ? -1 : 1)}), true)){
										temp=that.getSquare(target_cached_square, {
											fileShift : (i ? -2 : 2)
										});
										
										pre_validated_arr_pos.push([temp]);
									}
								}
							}
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
						
						if(current_diagonal_square!==null){
							if(current_diagonal_square.sign!==active_side.sign && !current_diagonal_square.isEmptySquare && !current_diagonal_square.isKing){
								pre_validated_arr_pos.push([current_diagonal_square]);
							}else if(sameSquare(current_diagonal_square, that.enPassantBos)){
								en_passant_capturable_cached_square=that.getSquare(current_diagonal_square, {
									rankShift : non_active_side.singlePawnRankShift,
									isUnreferenced : true
								});
								
								pre_validated_arr_pos.push([current_diagonal_square]);
							}
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
							rtn.push(current_cached_square.pos);
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
		
		function _isLegalMove(initial_qos, final_qos){
			var that, moves, final_square, rtn;
			
			that=this;
			
			rtn=false;
			final_square=that.getSquare(final_qos);
			
			if(final_square!==null){
				moves=that.legalMoves(initial_qos);
				
				if(moves.length){
					rtn=_strContains(moves.join("/"), final_square.pos.join());
				}
			}
			
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
				to_board=selectBoard(to_woard);
				
				if(!boardExists(to_board)){
					no_errors=false;
					_consoleLog("Error[_isEqualBoard]: could not select to_board");
				}
			//}
			
			if(no_errors){
				rtn=(that===to_board || that.boardHash()===to_board.boardHash());
			}
			
			return rtn;
		}
		
		function _cloneBoardFrom(from_woard){
			var that, from_board, no_errors;
			
			that=this;
			
			no_errors=true;
			
			//if(no_errors){
				from_board=selectBoard(from_woard);
				
				if(!boardExists(from_board)){
					no_errors=false;
					_consoleLog("Error[_cloneBoardFrom]: could not select from_board");
				}
			//}
			
			if(no_errors){
				if(that===from_board){
					no_errors=false;
					_consoleLog("Error[_cloneBoardFrom]: trying to self clone");
				}
			}
			
			if(no_errors){
				_cloneBoardObjs(that, from_board);
				
				//that.refreshBoard(); autorefresh
			}
			
			return no_errors;
		}
		
		function _cloneBoardTo(to_woard){
			var that, to_board, no_errors;
			
			that=this;
			
			no_errors=true;
			
			//if(no_errors){
				to_board=selectBoard(to_woard);
				
				if(!boardExists(to_board)){
					no_errors=false;
					_consoleLog("Error[_cloneBoardTo]: could not select to_board");
				}
			//}
			
			if(no_errors){
				if(that===to_board){
					no_errors=false;
					_consoleLog("Error[_cloneBoardTo]: trying to self clone");
				}
			}
			
			if(no_errors){
				_cloneBoardObjs(to_board, that);
				
				//to_board.refreshBoard(); autorefresh
			}
			
			return no_errors;
		}
		
		function _moveCaller(initial_qos, final_qos){
			var i, len, that, temp, temp2, temp3, initial_cached_square, final_cached_square, new_en_passant_square, pawn_moved, promoted_val, king_castled, pgn_move, pgn_end, piece_directions, active_side, non_active_side, current_side, rtn_can_move;
			
			that=this;
			
			function _disambiguationPos(qos, piece_direction, as_knight, ally_qal){//uses: that
				return that.testCollision(3, qos, piece_direction, as_knight, null, null, ally_qal).disambiguationPos;
			}
			
			initial_cached_square=that.getSquare(initial_qos, {
				isUnreferenced : true
			});
			
			final_cached_square=that.getSquare(final_qos, {
				isUnreferenced : true
			});
			
			rtn_can_move=that.isLegalMove(initial_cached_square, final_cached_square);
			
			if(rtn_can_move){
				active_side=that[that.activeColor];
				non_active_side=that[that.nonActiveColor];
				
				pawn_moved=false;
				new_en_passant_square=null;
				promoted_val=0;
				king_castled=0;
				
				if(initial_cached_square.isKing){
					if(active_side.castling){
						active_side.castling=0;
						
						/*2020 hacer sameSquare(bos) con 8 1*/
						if(final_cached_square.filePos===6){//short
							king_castled=_SHORT_CASTLE;
							
							that.setSquare(final_cached_square, active_side.rook, {
								fileShift : -1
							});
							
							that.setSquare(final_cached_square, _EMPTY_SQR, {
								fileShift : 1
							});
						}else if(final_cached_square.filePos===2){//long
							king_castled=_LONG_CASTLE;
							
							that.setSquare(final_cached_square, active_side.rook, {
								fileShift : 1
							});
							
							that.setSquare(final_cached_square, _EMPTY_SQR, {
								fileShift : -2
							});
						}
					}
				}else if(initial_cached_square.isPawn){
					pawn_moved=true;
					
					if(Math.abs(initial_cached_square.rankPos-final_cached_square.rankPos)>1){//new enpassant
						new_en_passant_square=that.getSquare(final_cached_square, {
							rankShift : non_active_side.singlePawnRankShift
						});
					}else if(sameSquare(final_cached_square, that.enPassantBos)){//enpassant capture
						that.setSquare(final_cached_square, _EMPTY_SQR, {
							rankShift : non_active_side.singlePawnRankShift
						});
					}else if(final_cached_square.rankPos===active_side.lastRankPos){//promotion
						promoted_val=(that.promoteTo*active_side.sign);
					}
				}
				
				//aun sin mover la pieza actual (pero ya lo de enpassant capture, torre al enrocar y castling 0)
				pgn_move="";
				
				if(king_castled){//castling king
					pgn_move+=(king_castled===_LONG_CASTLE ? "O-O-O" : "O-O");
				}else if(pawn_moved){
					if(initial_cached_square.fileBos!==final_cached_square.fileBos){
						pgn_move+=(initial_cached_square.fileBos+"x");
					}
					
					pgn_move+=final_cached_square.bos;
					
					if(promoted_val){
						pgn_move+="="+toAbsBal(promoted_val);
					}
				}else{//knight, bishop, rook, queen, non-castling king
					pgn_move+=initial_cached_square.absBal;
					
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
								//no puede haber ajustes de king o pawn, sin problemas en legal moves
								if(!sameSquare(temp2[i], initial_cached_square) && that.isLegalMove(temp2[i], final_cached_square)){
									temp3+=toBos(temp2[i]);
								}
							}
							
							if(temp3){
								temp=(_strContains(temp3, initial_cached_square.fileBos)+(_strContains(temp3, initial_cached_square.rankBos)*2));
								
								if(temp!==1){//0,2,3
									pgn_move+=initial_cached_square.fileBos;
								}
								
								if(temp && temp!==2){//1,3
									pgn_move+=initial_cached_square.rankBos;
								}
							}
						}
					}
					
					if(!final_cached_square.isEmptySquare){
						pgn_move+="x";
					}
					
					pgn_move+=final_cached_square.bos;
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
				
				that.enPassantBos=(new_en_passant_square!==null ? new_en_passant_square.bos : "");
				
				that.setSquare(final_cached_square, (promoted_val || initial_cached_square.val));
				that.setSquare(initial_cached_square, _EMPTY_SQR);
				
				that.toggleActiveNonActive();
				
				that.halfMove++;
				if(pawn_moved || final_cached_square.val){
					that.halfMove=0;
				}
				
				if(active_side.isBlack){//active_side is toggled
					that.fullMove++;
				}
				
				that.currentMove++;/*NO move below updateFenAndMisc()*/
				that.updateFenAndMisc();
				
				pgn_end="";
				
				if(that.isCheck){
					if(that.isCheckmate){
						pgn_move+="#";
						pgn_end=(non_active_side.isBlack ? "1-0" : "0-1");//non_active_side is toggled
					}else{
						pgn_move+="+";
					}
				}else{
					if(that.isStalemate){
						pgn_end="1/2-1/2";
					}
				}
				
				if(that.currentMove!==that.moveList.length){
					that.moveList=that.moveList.slice(0, that.currentMove);/*start variation instead of overwrite*/
				}
				
				that.moveList.push({Fen : that.fen, PGNmove : pgn_move, PGNend : pgn_end, FromBos : initial_cached_square.bos, ToBos : final_cached_square.bos, InitialVal : initial_cached_square.val, FinalVal : (promoted_val || initial_cached_square.val), KingCastled : king_castled});
			}
			
			return rtn_can_move;
		}
		
		//---------------- board (using IcUi)
		
		function _navFirst(){
			var that, rtn_moved;
			
			that=this;
			
			rtn_moved=false;
			
			if(_WIN && _WIN.IcUi && _WIN.IcUi.navFirst){
				rtn_moved=_WIN.IcUi.navFirst.apply(that, []);
			}
			
			return rtn_moved;
		}
		
		function _navPrevious(){
			var that, rtn_moved;
			
			that=this;
			
			rtn_moved=false;
			
			if(_WIN && _WIN.IcUi && _WIN.IcUi.navPrevious){
				rtn_moved=_WIN.IcUi.navPrevious.apply(that, []);
			}
			
			return rtn_moved;
		}
		
		function _navNext(){
			var that, rtn_moved;
			
			that=this;
			
			rtn_moved=false;
			
			if(_WIN && _WIN.IcUi && _WIN.IcUi.navNext){
				rtn_moved=_WIN.IcUi.navNext.apply(that, []);
			}
			
			return rtn_moved;
		}
		
		function _navLast(){
			var that, rtn_moved;
			
			that=this;
			
			rtn_moved=false;
			
			if(_WIN && _WIN.IcUi && _WIN.IcUi.navLast){
				rtn_moved=_WIN.IcUi.navLast.apply(that, []);
			}
			
			return rtn_moved;
		}
		
		function _navLinkMove(move_index){
			var that, rtn_moved;
			
			that=this;
			
			rtn_moved=false;
			
			if(_WIN && _WIN.IcUi && _WIN.IcUi.navLinkMove){
				rtn_moved=_WIN.IcUi.navLinkMove.apply(that, [move_index]);
			}
			
			return rtn_moved;
		}
		
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
		
		function boardExists(woard){
			var temp, rtn;
			
			temp=_SILENT_MODE;
			
			setSilentMode(true);
			rtn=(selectBoard(woard)!==null);
			setSilentMode(temp);
			
			return rtn;
		}
		
		function selectBoard(woard){
			var no_errors, is_valid, rtn;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				if(!woard){
					no_errors=false;
					_consoleLog("Error[selectBoard]: falsy variable");
				}
			//}
			
			if(no_errors){
				is_valid=((typeof woard)==="string" || _isBoard(woard));
				
				if(!is_valid){
					no_errors=false;
					_consoleLog("Error[selectBoard]: invalid variable");
				}
			}
			
			if(no_errors){
				if((typeof woard)==="string"){
					woard=_formatName(woard);
					
					if((typeof _BOARDS[woard])==="undefined"){
						no_errors=false;
						_consoleLog("Error[selectBoard]: board \""+woard+"\" not found");
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
			var val, abs_val, rtn;
			
			val=toVal(qal);
			abs_val=toAbsVal(qal);
			
			rtn=["*", "p", "n", "b", "r", "q", "k"][abs_val];//deprecate asterisk character as _occurrences() might use RegExp("*", "g") if not cautious
			
			return (val===abs_val ? rtn.toUpperCase() : rtn);
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
			del_board=selectBoard(woard);
			
			if(boardExists(del_board)){
				rtn=true;
				
				del_board_name_cache=del_board.boardName;
				del_board=null;
				
				_BOARDS[del_board_name_cache]=null;
				delete _BOARDS[del_board_name_cache];
				
				/*2020*/
				//if current board is the one removed, refresh to other, else refresh too (best only html tabs)
				//x.refreshBoard(); autorefresh
			}
			
			return rtn;
		}
		
		function isEqualBoard(left_woard, right_woard){
			var left_board, no_errors, rtn;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				left_board=selectBoard(left_woard);
				
				if(!boardExists(left_board)){
					no_errors=false;
					_consoleLog("Error[isEqualBoard]: could not select left_board");
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
				to_board=selectBoard(to_woard);
				
				if(!boardExists(to_board)){
					no_errors=false;
					_consoleLog("Error[cloneBoard]: could not select to_board");
				}
			//}
			
			if(no_errors){
				rtn=to_board.cloneBoardFrom(from_woard);
			}
			
			return rtn;
		}
		
		function initBoard(p){//{boardName, fen, isRotated, isHidden, promoteTo, invalidFenStop}
			var i, j, target, board_name, current_pos, current_bos, fen_was_valid, postfen_was_valid, new_board, no_errors, rtn;
			
			rtn=null;
			no_errors=true;
			p=(_isObject(p) ? p : {});
			
			//if(no_errors){
				p.boardName=(((typeof p.boardName)==="string" && _trimSpaces(p.boardName).length) ? _formatName(p.boardName) : ("board_"+new Date().getTime()));
				board_name=p.boardName;
				
				p.isRotated=(p.isRotated===true);
				p.isHidden=(p.isHidden===true);
				p.invalidFenStop=(p.invalidFenStop===true);
				
				fen_was_valid=!_basicFenTest(p.fen);
				
				if(p.invalidFenStop && !fen_was_valid){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" bad FEN");
				}
			//}
			
			if(no_errors){
				if(!boardExists(board_name)){
					_BOARDS[board_name]={
						boardName : board_name,
						getSquare : _getSquare,
						setSquare : _setSquare,
						countAttacks : _countAttacks,
						toggleActiveNonActive : _toggleActiveNonActive,
						toggleIsRotated : _toggleIsRotated,
						setPromoteTo : _setPromoteTo,
						setCurrentMove : _setCurrentMove,
						readFen : _readFen,
						updateFenAndMisc : _updateFenAndMisc,
						refinedFenTest : _refinedFenTest,
						testCollision : _testCollision,
						isLegalMove : _isLegalMove,
						legalMoves : _legalMoves,
						ascii : _ascii,
						boardHash : _boardHash,
						isEqualBoard : _isEqualBoard,
						cloneBoardFrom : _cloneBoardFrom,
						cloneBoardTo : _cloneBoardTo,
						moveCaller : _moveCaller,
						navFirst : _navFirst,
						navPrevious : _navPrevious,
						navNext : _navNext,
						navLast : _navLast,
						navLinkMove : _navLinkMove,
						refreshBoard : _refreshBoard
					};
				}
				
				target=_BOARDS[board_name];
				
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
					castling : null
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
					castling : null
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
				target.isFiftyMove=null;
				target.isInsufficientMaterial=null;
				target.inDraw=null;
				target.materialDiff=null;
				target.promoteTo=null;
				target.selectedBos=null;
				target.isHidden=null;
				target.squares=Object.create(null);
				
				for(i=0; i<8; i++){//0...7
					for(j=0; j<8; j++){//0...7
						current_pos=[i, j];
						current_bos=toBos(current_pos);
						
						target.squares[current_bos]=Object.create(null);
						
						//static
						target.squares[current_bos].pos=current_pos;
						target.squares[current_bos].bos=current_bos;
						target.squares[current_bos].rankPos=getRankPos(current_pos);
						target.squares[current_bos].filePos=getFilePos(current_pos);
						target.squares[current_bos].rankBos=getRankBos(current_pos);
						target.squares[current_bos].fileBos=getFileBos(current_pos);
						
						//mutable
						target.squares[current_bos].bal=null;
						target.squares[current_bos].absBal=null;
						target.squares[current_bos].val=null;
						target.squares[current_bos].absVal=null;
						target.squares[current_bos].className=null;
						target.squares[current_bos].sign=null;
						target.squares[current_bos].isEmptySquare=null;
						target.squares[current_bos].isPawn=null;
						target.squares[current_bos].isKnight=null;
						target.squares[current_bos].isBishop=null;
						target.squares[current_bos].isRook=null;
						target.squares[current_bos].isQueen=null;
						target.squares[current_bos].isKing=null;
					}
				}
				
				new_board=selectBoard(board_name);
				
				if(!boardExists(new_board)){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" board selection failure");
				}
			}
			
			if(no_errors){
				new_board.isHidden=p.isHidden;
				
				new_board.currentMove=0;/*NO move below readFen()*/
				new_board.readFen(fen_was_valid ? p.fen : _DEFAULT_FEN);
				
				new_board.moveList=[{Fen : new_board.fen, PGNmove : "", PGNend : "", FromBos : "", ToBos : "", InitialVal : 0, FinalVal : 0, KingCastled : 0}];
				new_board.isRotated=p.isRotated;
				new_board.promoteTo=_promoteValHelper(p.promoteTo);/*NO b.setPromoteTo()*/
				
				postfen_was_valid=!new_board.refinedFenTest();
				
				if(p.invalidFenStop && !postfen_was_valid){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" bad postFEN");
					
					removeBoard(new_board);
				}
			}
			
			if(no_errors){
				if(!postfen_was_valid){
					new_board.isHidden=p.isHidden;
					
					new_board.currentMove=0;/*NO move below readFen()*/
					new_board.readFen(_DEFAULT_FEN);
					
					new_board.moveList=[{Fen : new_board.fen, PGNmove : "", PGNend : "", FromBos : "", ToBos : "", InitialVal : 0, FinalVal : 0, KingCastled : 0}];
					new_board.isRotated=p.isRotated;
					new_board.promoteTo=_promoteValHelper(p.promoteTo);/*NO b.setPromoteTo()*/
				}
				
				rtn=new_board;
				
				//new_board.refreshBoard(); autorefresh
			}
			
			return rtn;
		}
		
		function fenApply(fen, fn_name, args){
			var temp, board, board_created, rtn;
			
			rtn=null;
			
			board=initBoard({
				boardName : "board_fenApply",
				fen : fen,
				isHidden : true,
				invalidFenStop : true
			});
			
			board_created=boardExists(board);
			fn_name=_formatName(fn_name);
			
			switch(fn_name){
				case "legalMoves" :
					rtn=(board_created ? _legalMoves.apply(board, args) : []);
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
			
			if(board_created){
				removeBoard(board);
			}
			
			return rtn;
		}
		
		function fenGet(fen, props){
			var i, j, len, len2, board, board_created, current_key, invalid_key, no_errors, rtn_pre, rtn;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				board=initBoard({
					boardName : "board_fenGet",
					fen : fen,
					isHidden : true,
					invalidFenStop : true
				});
				
				board_created=boardExists(board);
				
				if(!board_created){
					no_errors=false;
					_consoleLog("Error[fenGet]: invalid FEN");
				}
			//}
			
			if(no_errors){
				props=(((typeof props)==="string" && _trimSpaces(props).length) ? props.split(",") : []);
				rtn_pre=Object.create(null);
				
				for(i=0, len=props.length; i<len; i++){//0<len
					current_key=_formatName(props[i]);
					
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
		
		function mapToBos(arr){
			return (_isArray(arr) ? arr.map(x => toBos(x)) : []);
		}
		
		return {
			version : _VERSION,
			setSilentMode : setSilentMode,
			boardExists : boardExists,
			selectBoard : selectBoard,
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
			mapToBos : mapToBos,
			utilityMisc : {
				consoleLog : _consoleLog,
				isObject : _isObject,
				isArray : _isArray,
				isSquare : _isSquare,
				isBoard : _isBoard,
				trimSpaces : _trimSpaces,
				formatName : _formatName,
				strContains : _strContains,
				occurrences : _occurrences,
				toInt : _toInt,
				hashCode : _hashCode,
				castlingChars : _castlingChars,
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
