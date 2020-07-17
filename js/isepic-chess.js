/** Copyright (c) 2020 Ajax Isepic (ajax333221) Licensed MIT */

/*jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:false, curly:true, latedef:nofunc, bitwise:false, sub:true, eqeqeq:true, esversion:6 */

(function(win){
	var Ic=(function(){
		var _VERSION="2.7.6";
		var _SILENT_MODE=true;
		var _BOARDS=Object.create(null);
		
		var _EMPTY_SQR=0;
		var _PAWN=1;
		var _KNIGHT=2;
		var _BISHOP=3;
		var _ROOK=4;
		var _QUEEN=5;
		var _KING=6;
		var _DEFAULT_FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		var _MUTABLE_KEYS=["Active", "NonActive", "Fen", "WCastling", "BCastling", "EnPassantBos", "HalfMove", "FullMove", "InitialFullMove", "MoveList", "CurrentMove", "IsRotated", "IsCheck", "IsCheckmate", "IsStalemate", "MaterialDiff", "PromoteTo", "SelectedBos", "IsHidden", "Squares"];
		
		//---------------- utilities
		
		function _consoleLog(msg){
			if(!_SILENT_MODE){console.log(msg);}
		}
		
		function _trimSpaces(str){
			return (""+str).replace(/^\s+|\s+$/g, "").replace(/\s\s+/g, " ");
		}
		
		function _formatName(str){
			return _trimSpaces(""+str).replace(/[^a-z0-9]/gi, "_");
		}
		
		function _strContains(str, str_to_find){
			return (str.indexOf(str_to_find)!==-1);
		}
		
		function _occurrences(str, str_rgxp){
			var rtn;
			
			rtn=0;
			
			if((typeof str)==="string" && (typeof str_rgxp)==="string" && str_rgxp!==""){
				rtn=(str.match(RegExp(str_rgxp, "g")) || []).length;
			}
			
			return rtn;
		}
		
		function _toInt(num, min_val, max_val){
			num=(num*1 || 0);
			num=(num<0 ? Math.ceil(num) : Math.floor(num));
			
			min_val*=1;
			max_val*=1;
			
			/*NO remover 0 default, (-0 || 0) = 0*/
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
			var i, j, len, len2, current_key, sub_keys, to_prop, from_prop;
			
			to_board.MoveList=[];
			to_board.MaterialDiff={w:[], b:[]};//ver si ocupa
			
			for(i=0, len=_MUTABLE_KEYS.length; i<len; i++){//0<len
				current_key=_MUTABLE_KEYS[i];
				to_prop=to_board[current_key];
				from_prop=from_board[current_key];
				
				//["Squares"] constant len, objects with hard values
				//["Active", "NonActive"] constant len, hard values only (strings/numbers) inside direct children
				//["MoveList"] variable len, hard values only (strings/numbers) inside direct children
				//["MaterialDiff"] constant len, references (arrays) inside direct children
				if((typeof from_prop)==="object" && from_prop!==null){
					if(current_key==="MaterialDiff"){
						to_prop.w=from_prop.w.slice(0);
						to_prop.b=from_prop.b.slice(0);
					}else{
						sub_keys=Object.keys(from_prop);
						
						for(j=0, len2=sub_keys.length; j<len2; j++){//0<len2
							if(current_key==="Squares"){
								//ver si ocupa un object reset
								
								to_prop[sub_keys[j]].bal=from_prop[sub_keys[j]].bal;
								to_prop[sub_keys[j]].absBal=from_prop[sub_keys[j]].absBal;
								to_prop[sub_keys[j]].val=from_prop[sub_keys[j]].val;
								to_prop[sub_keys[j]].absVal=from_prop[sub_keys[j]].absVal;
								to_prop[sub_keys[j]].className=from_prop[sub_keys[j]].className;
								to_prop[sub_keys[j]].sign=from_prop[sub_keys[j]].sign;
								to_prop[sub_keys[j]].isEmptySquare=from_prop[sub_keys[j]].isEmptySquare;
								to_prop[sub_keys[j]].isPawn=from_prop[sub_keys[j]].isPawn;
								to_prop[sub_keys[j]].isKnight=from_prop[sub_keys[j]].isKnight;
								to_prop[sub_keys[j]].isBishop=from_prop[sub_keys[j]].isBishop;
								to_prop[sub_keys[j]].isRook=from_prop[sub_keys[j]].isRook;
								to_prop[sub_keys[j]].isQueen=from_prop[sub_keys[j]].isQueen;
								to_prop[sub_keys[j]].isKing=from_prop[sub_keys[j]].isKing;
							}else{
								to_prop[sub_keys[j]]=from_prop[sub_keys[j]];
							}
						}
					}
				}else{
					to_board[current_key]=from_board[current_key];//can't use to_prop, it's not a reference here
				}
			}
		}
		
		function _basicFenTest(fen){
			var i, j, len, temp, optional_clocks, last_is_num, current_is_num, fen_board_arr, total_pieces, fen_board, total_files_in_current_rank, error_msg;
			
			error_msg="";
			
			//if(!error_msg){
				if(!fen){
					error_msg="Error [0] empty fen";
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
				for(i=0; i<2; i++){//0...1
					total_pieces={P:0, N:0, B:0, R:0, Q:0, K:0};
					
					for(j=1; j<7; j++){//1...6
						total_pieces[toBal(j)]=_occurrences(fen_board, toBal(j*getSign(!i)));
					}
					
					if(total_pieces.K!==1){
						error_msg="Error [5] board without exactly one "+(i ? "white" : "black")+" king";
					}else if(total_pieces.P>8){
						error_msg="Error [6] more than 8 "+(i ? "white" : "black")+" pawns";
					}else if((Math.max(total_pieces.N-2, 0)+Math.max(total_pieces.B-2, 0)+Math.max(total_pieces.R-2, 0)+Math.max(total_pieces.Q-1, 0))>(8-total_pieces.P)){
						error_msg="Error [7] promoted pieces exceed the number of missing pawns for "+(i ? "white" : "black");
					}
					
					if(error_msg){
						break;
					}
				}
			}
			
			return error_msg;
		}
		
		//---------------- board
		
		function _getSquare(sqr){
			var that, pre_validated_pos, rtn;
			
			that=this;
			
			function _squareHelper(my_square, is_unreferenced){
				var temp, rtn_square;
				
				rtn_square=my_square;
				
				if(is_unreferenced){
					temp=Object.create(null);
					
					temp.pos=toPos(my_square.bos);
					temp.bos=my_square.bos;
					temp.rankPos=getRankPos(my_square.bos);
					temp.filePos=getFilePos(my_square.bos);
					temp.rankBos=getRankBos(my_square.bos);
					temp.fileBos=getFileBos(my_square.bos);
					
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
			
			pre_validated_pos=[(getRankPos(sqr.qos)+_toInt(sqr.rankShift)), (getFilePos(sqr.qos)+_toInt(sqr.fileShift))];
			
			if(isInsideBoard(pre_validated_pos)){
				rtn=_squareHelper(that.Squares[toBos(pre_validated_pos)], sqr.isUnreferenced);
			}
			
			return rtn;
		}
		
		function _setSquare(sqr){
			var that, sqr_bos, sqr_val, sqr_abs_val;
			
			that=this;
			
			sqr_bos=toBos(sqr.qos);
			sqr_val=toVal(sqr.qal);
			sqr_abs_val=toAbsVal(sqr_val);
			
			that.Squares[sqr_bos].bal=toBal(sqr_val);
			that.Squares[sqr_bos].absBal=toAbsBal(sqr_val);
			that.Squares[sqr_bos].val=sqr_val;
			that.Squares[sqr_bos].absVal=sqr_abs_val;
			that.Squares[sqr_bos].className=toClassName(sqr_val);
			that.Squares[sqr_bos].sign=getSign(sqr_val);
			that.Squares[sqr_bos].isEmptySquare=(sqr_abs_val===_EMPTY_SQR);
			that.Squares[sqr_bos].isPawn=(sqr_abs_val===_PAWN);
			that.Squares[sqr_bos].isKnight=(sqr_abs_val===_KNIGHT);
			that.Squares[sqr_bos].isBishop=(sqr_abs_val===_BISHOP);
			that.Squares[sqr_bos].isRook=(sqr_abs_val===_ROOK);
			that.Squares[sqr_bos].isQueen=(sqr_abs_val===_QUEEN);
			that.Squares[sqr_bos].isKing=(sqr_abs_val===_KING);
		}
		
		function _calculateChecks(king_qos, early_break){
			var i, j, that, as_knight, rtn_total_checks;
			
			that=this;
			
			function _isAttacked(initial_qos, piece_direction, as_knight){
				return that.testCollision(2, initial_qos, piece_direction, as_knight, null, null, null).isAttacked;
			}
			
			rtn_total_checks=0;
			king_qos=(king_qos || that.Active.kingBos);
			
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
		
		function _toggleIsRotated(){
			var that;
			
			that=this;
			
			that.IsRotated=!that.IsRotated;
		}
		
		function _setPromoteTo(qal){
			var that;
			
			that=this;
			
			that.PromoteTo=_toInt((toAbsVal(qal) || _QUEEN), 2, 5);
		}
		
		function _setCurrentMove(num, is_goto){
			var len, that, temp, rtn_moved;
			
			that=this;
			
			rtn_moved=false;
			len=that.MoveList.length;
			
			if(len>1){
				temp=_toInt((is_goto ? num : (num+that.CurrentMove)), 0, (len-1));
				
				if(temp!==that.CurrentMove){
					rtn_moved=true;
					
					that.CurrentMove=temp;
					that.readFen(that.MoveList[temp].Fen);
				}
			}
			
			return rtn_moved;
		}
		
		function _readFen(fen){
			var i, j, len, that, temp, fen_parts, current_file, current_char, fen_board_arr, skip_files;
			
			that=this;
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					that.setSquare({
						qos : [i, j],
						qal : _EMPTY_SQR
					});
				}
			}
			
			fen_parts=fen.split(" ");
			fen_board_arr=fen_parts[0].split("/");
			
			for(i=0; i<8; i++){//0...7
				current_file=0;
				
				for(j=0, len=fen_board_arr[i].length; j<len; j++){//0<len
					current_char=fen_board_arr[i].charAt(j);
					skip_files=(current_char*1);
					
					if(!skip_files){
						that.setSquare({
							qos : [i, current_file],
							qal : current_char
						});
					}
					
					current_file+=(skip_files || 1);
				}
			}
			
			temp=(fen_parts[1]==="b");
			that.Active.isBlack=temp;
			that.NonActive.isBlack=!temp;
			that.Active.sign=getSign(temp);
			that.NonActive.sign=getSign(!temp);
			
			that.WCastling=(_strContains(fen_parts[2], "K") ? 1 : 0)+(_strContains(fen_parts[2], "Q") ? 2 : 0);
			that.BCastling=(_strContains(fen_parts[2], "k") ? 1 : 0)+(_strContains(fen_parts[2], "q") ? 2 : 0);
			
			that.EnPassantBos=fen_parts[3].replace("-", "");
			
			that.HalfMove=((fen_parts[4]*1) || 0);
			that.FullMove=((fen_parts[5]*1) || 1);
			
			that.updateKingsChecksFenMatdiff();
		}
		
		function _updateKingsChecksFenMatdiff(){
			var i, j, that, current_square, consecutive_empty_squares, new_fen_board, no_legal_moves;
			
			that=this;
			
			function _materialDifference(){
				var i, j, len, current_diff, fen_board, rtn;
				
				rtn={w:[], b:[]};
				fen_board=that.Fen.split(" ")[0];
				
				for(i=1; i<7; i++){//1...6
					current_diff=_occurrences(fen_board, toBal(i))-_occurrences(fen_board, toBal(-i));
					
					for(j=0, len=Math.abs(current_diff); j<len; j++){//0<len
						if(current_diff>0){
							rtn.w.push(i);
						}else{
							rtn.b.push(-i);
						}
					}
				}
				
				return rtn;
			}
			
			new_fen_board="";
			
			for(i=0; i<8; i++){//0...7
				consecutive_empty_squares=0;
				
				for(j=0; j<8; j++){//0...7
					current_square=that.getSquare({
						qos : [i, j]
					});
					
					if(!current_square.isEmptySquare){
						if(current_square.isKing){
							if(current_square.sign===that.Active.sign){
								that.Active.kingBos=current_square.bos;
							}else{
								that.NonActive.kingBos=current_square.bos;
							}
						}
						
						new_fen_board+=(consecutive_empty_squares || "")+current_square.bal;
						consecutive_empty_squares=-1;
					}
					
					consecutive_empty_squares++;
				}
				
				new_fen_board+=(consecutive_empty_squares || "")+(i!==7 ? "/" : "");
			}
			
			that.Active.checks=that.calculateChecks(null, false);
			that.NonActive.checks=0;
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
			
			that.IsCheck=!!that.Active.checks;
			that.IsCheckmate=(that.IsCheck && no_legal_moves);
			that.IsStalemate=(!that.IsCheck && no_legal_moves);
			
			that.Fen=(new_fen_board+" "+(that.Active.isBlack ? "b" : "w")+" "+((_castlingChars(that.WCastling).toUpperCase()+""+_castlingChars(that.BCastling)) || "-")+" "+(that.EnPassantBos || "-")+" "+that.HalfMove+" "+that.FullMove);
			
			that.MaterialDiff=_materialDifference();
		}
		
		function _refinedFenTest(){
			var i, j, k, that, temp, current_sign, current_castling_availity, current_king_rank, current_val, en_passant_square, behind_ep_is_empty, infront_ep_val, e_val, a_val, h_val, fen_board, total_pawns_in_current_file, min_captured, min_captured_holder, error_msg;
			
			that=this;
			
			error_msg="";
			
			//if(!error_msg){
				if((that.HalfMove-that.Active.isBlack+1)>=(that.FullMove*2)){
					error_msg="Error [0] exceeding half moves ratio";
				}
			//}
			
			if(!error_msg){
				if(that.Active.checks>=3){
					error_msg="Error [1] king is checked more times than possible";
				}
			}
			
			if(!error_msg){
				temp=that.Active.isBlack;
				
				that.Active.isBlack=!temp;
				that.NonActive.isBlack=temp;
				that.Active.sign=getSign(!temp);
				that.NonActive.sign=getSign(temp);
				
				if(that.calculateChecks(that.NonActive.kingBos, true)){
					error_msg="Error [2] non-active king in check";
				}
				
				that.Active.isBlack=temp;
				that.NonActive.isBlack=!temp;
				that.Active.sign=getSign(temp);
				that.NonActive.sign=getSign(!temp);
			}
			
			if(!error_msg){
				if(that.EnPassantBos){
					temp=that.NonActive.sign;
					
					en_passant_square=that.getSquare({
						qos : that.EnPassantBos
					});
					
					behind_ep_is_empty=that.getSquare({
						qos : that.EnPassantBos,
						rankShift : temp
					}).isEmptySquare;
					
					infront_ep_val=that.getSquare({
						qos : that.EnPassantBos,
						rankShift : -temp
					}).val;
					
					if(that.HalfMove || !en_passant_square.isEmptySquare || en_passant_square.rankPos!==(that.Active.isBlack ? 5 : 2) || !behind_ep_is_empty || infront_ep_val!==temp){
						error_msg="Error [3] bad en-passant";
					}
				}
			}
			
			if(!error_msg){
				fen_board=that.Fen.split(" ")[0];
				
				for(i=0; i<2; i++){//0...1
					min_captured=0;
					
					for(j=0; j<8; j++){//0...7
						min_captured_holder=((j===0 || j===7) ? [1, 3, 6, 10, 99] : [1, 2, 4, 6, 9]);
						total_pawns_in_current_file=0;
						
						for(k=0; k<8; k++){//0...7
							current_val=that.getSquare({
								qos : [k, j]
							}).val;
							
							total_pawns_in_current_file+=(current_val===(_PAWN*getSign(!i)));
						}
						
						if(total_pawns_in_current_file>1){
							min_captured+=min_captured_holder[total_pawns_in_current_file-2];
						}
					}
					
					if(min_captured>(15-_occurrences(fen_board, (i ? "p|n|b|r|q" : "P|N|B|R|Q")))){
						error_msg="Error [4] not enough captured pieces to support the total doubled pawns";
						break;
					}
				}
			}
			
			if(!error_msg){
				for(i=0; i<2; i++){//0...1
					current_castling_availity=(i ? that.WCastling : that.BCastling);
					
					if(current_castling_availity){
						current_sign=getSign(!i);
						current_king_rank=(i ? 7 : 0);
						
						e_val=that.getSquare({
							qos : [current_king_rank, 4]
						}).val;
						
						a_val=that.getSquare({
							qos : [current_king_rank, 0]
						}).val;
						
						h_val=that.getSquare({
							qos : [current_king_rank, 7]
						}).val;
						
						if(e_val!==(_KING*current_sign)){
							error_msg="Error [5] "+(i ? "white" : "black")+" castling ability without king in original position";
						}else if(current_castling_availity!==2 && h_val!==(_ROOK*current_sign)){
							error_msg="Error [6] "+(i ? "white" : "black")+" short castling ability with missing H-file rook";
						}else if(current_castling_availity!==1 && a_val!==(_ROOK*current_sign)){
							error_msg="Error [7] "+(i ? "white" : "black")+" long castling ability with missing A-file rook";
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
			var i, that, current_square, rank_change, file_change, rtn;
			
			that=this;
			
			rtn={
				candidateMoves : [],
				isAttacked : false,
				disambiguationPos : null
			};
			
			piece_direction=_toInt(piece_direction, 1, 8);
			rank_change=(as_knight ? [-2, -1, 1, 2, 2, 1, -1, -2] : [-1, -1, 0, 1, 1, 1, 0, -1])[piece_direction-1];
			file_change=(as_knight ? [1, 2, 2, 1, -1, -2, -2, -1] : [0, 1, 1, 1, 0, -1, -1, -1])[piece_direction-1];
			total_squares=_toInt(as_knight ? 1 : (total_squares || 7));
			
			for(i=0; i<total_squares; i++){//0<total_squares
				current_square=that.getSquare({
					qos : initial_qos,
					rankShift : (rank_change*(i+1)),
					fileShift : (file_change*(i+1))
				});
				
				if(current_square===null){
					break;
				}
				
				if(!current_square.isEmptySquare){
					if(current_square.sign===that.NonActive.sign){//is enemy piece
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
									if(piece_direction===4 || piece_direction===6){
										rtn.isAttacked=true;
									}
								}else{
									if(piece_direction===2 || piece_direction===8){
										rtn.isAttacked=true;
									}
								}
							}
						}
					}else{//is ally piece
						if(op===3){
							if(current_square.absVal===toAbsVal(ally_qal)){
								rtn.disambiguationPos=current_square.pos;
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
			var i, j, len, len2, that, temp, current_cached_square, target_cached_square, current_diagonal_square, pre_validated_arr_pos, active_king_original_rank, en_passant_capturable_cached_square, active_castling_availity, piece_directions, no_errors, rtn;
			
			that=this;
			
			function _candidateMoves(piece_direction, as_knight, total_squares, allow_capture){
				return that.testCollision(1, target_qos, piece_direction, as_knight, total_squares, allow_capture, null).candidateMoves;
			}
			
			rtn=[];
			no_errors=true;
			
			//if(no_errors){
				target_cached_square=that.getSquare({
					qos : target_qos,
					isUnreferenced : true
				});
				
				if(target_cached_square===null){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				if(target_cached_square.isEmptySquare || target_cached_square.sign===that.NonActive.sign){
					no_errors=false;
				}
			}
			
			if(no_errors){//is inside board + is ally piece
				pre_validated_arr_pos=[];
				en_passant_capturable_cached_square=null;
				active_king_original_rank=(that.Active.isBlack ? 0 : 7);
				
				if(target_cached_square.isKing){
					for(i=1; i<9; i++){//1...8
						if((temp=_candidateMoves(i, false, 1, true)).length){pre_validated_arr_pos.push(temp);}
					}
					
					active_castling_availity=(that.Active.isBlack ? that.BCastling : that.WCastling);
					
					if(active_castling_availity && !that.IsCheck){
						for(i=0; i<2; i++){//0...1
							if(active_castling_availity!==(i ? 1 : 2)){
								if(_candidateMoves((i ? 7 : 3), false, (i ? 3 : 2), false).length===(i ? 3 : 2)){
									if(!that.calculateChecks([active_king_original_rank, (i ? 3 : 5)], true)){
										pre_validated_arr_pos.push([[active_king_original_rank, (i ? 2 : 6)]]);
									}
								}
							}
						}
					}
				}else if(target_cached_square.isPawn){
					if((temp=_candidateMoves((that.Active.isBlack ? 5 : 1), false, (target_cached_square.rankPos===(active_king_original_rank+that.NonActive.sign) ? 2 : 1), false)).length){pre_validated_arr_pos.push(temp);}
					
					for(i=0; i<2; i++){//0...1
						current_diagonal_square=that.getSquare({
							qos : target_qos,
							rankShift : that.NonActive.sign,
							fileShift : (i ? 1 : -1)
						});
						
						if(current_diagonal_square!==null){
							if(!current_diagonal_square.isEmptySquare && current_diagonal_square.sign===that.NonActive.sign && !current_diagonal_square.isKing){
								pre_validated_arr_pos.push([current_diagonal_square.pos]);
							}else if(sameSquare(current_diagonal_square.bos, that.EnPassantBos)){
								en_passant_capturable_cached_square=that.getSquare({
									qos : current_diagonal_square.pos,
									rankShift : that.Active.sign,
									isUnreferenced : true
								});
								
								pre_validated_arr_pos.push([current_diagonal_square.pos]);
							}
						}
					}
				}else{//knight, bishop, rook, queen
					piece_directions=[];
					if(!target_cached_square.isBishop){piece_directions.push(1, 3, 5, 7);}
					if(!target_cached_square.isRook){piece_directions.push(2, 4, 6, 8);}
					
					for(i=0, len=piece_directions.length; i<len; i++){//0...1
						if((temp=_candidateMoves(piece_directions[i], target_cached_square.isKnight, null, true)).length){pre_validated_arr_pos.push(temp);}
					}
				}
				
				for(i=0, len=pre_validated_arr_pos.length; i<len; i++){//0<len
					for(j=0, len2=pre_validated_arr_pos[i].length; j<len2; j++){//0<len2
						current_cached_square=that.getSquare({
							qos : pre_validated_arr_pos[i][j],
							isUnreferenced : true
						});
						
						that.setSquare({
							qos : current_cached_square.pos,
							qal : target_cached_square.val
						});
						
						that.setSquare({
							qos : target_qos,
							qal : _EMPTY_SQR
						});
						
						if(en_passant_capturable_cached_square!==null){
							if(sameSquare(current_cached_square.bos, that.EnPassantBos)){
								that.setSquare({
									qos : en_passant_capturable_cached_square.pos,
									qal : _EMPTY_SQR
								});
							}
						}
						
						if(!that.calculateChecks((target_cached_square.isKing ? current_cached_square.pos : null), true)){
							rtn.push(current_cached_square.pos);
						}
						
						that.setSquare({
							qos : current_cached_square.pos,
							qal : current_cached_square.val
						});
						
						that.setSquare({
							qos : target_qos,
							qal : target_cached_square.val
						});
						
						if(en_passant_capturable_cached_square!==null){
							that.setSquare({
								qos : en_passant_capturable_cached_square.pos,
								qal : en_passant_capturable_cached_square.val
							});
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
			
			final_square=that.getSquare({
				qos : final_qos
			});
			
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
			
			is_rotated=((typeof is_rotated)==="boolean" ? is_rotated : that.IsRotated);
			
			rtn="   +------------------------+\n";
			bottom_label="";
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					current_square=that.getSquare({
						qos : (is_rotated ? [(7-i), (7-j)] : [i, j])
					});
					
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
				
				if(to_board===null){
					no_errors=false;
					_consoleLog("Error[_isEqualBoard]: could not select to_board");
				}
			//}
			
			if(no_errors){
				rtn=(that.BoardName===to_board.BoardName || that.boardHash()===to_board.boardHash());
			}
			
			return rtn;
		}
		
		function _cloneBoardFrom(from_woard){
			var that, from_board, no_errors;
			
			that=this;
			
			no_errors=true;
			
			//if(no_errors){
				from_board=selectBoard(from_woard);
				
				if(from_board===null){
					no_errors=false;
					_consoleLog("Error[_cloneBoardFrom]: could not select from_board");
				}
			//}
			
			if(no_errors){
				_cloneBoardObjs(that, from_board);
				
				//that.refreshBoard(); not without autorefresh
			}
			
			return no_errors;
		}
		
		function _cloneBoardTo(to_woard){
			var that, to_board, no_errors;
			
			that=this;
			
			no_errors=true;
			
			//if(no_errors){
				to_board=selectBoard(to_woard);
				
				if(to_board===null){
					no_errors=false;
					_consoleLog("Error[_cloneBoardTo]: could not select to_board");
				}
			//}
			
			if(no_errors){
				_cloneBoardObjs(to_board, that);
				
				//to_board.refreshBoard(); not without autorefresh
			}
			
			return no_errors;
		}
		
		function _moveCaller(initial_qos, final_qos){
			var that, temp, initial_cached_square, final_cached_square, active_king_original_rank, pawn_moved, promoted_val, active_color_rook, new_en_passant_bos, new_active_castling_availity, new_non_active_castling_availity, king_castled, to_promotion_rank, pgn_move, pgn_end, rtn_can_move;
			
			that=this;
			
			function _disambiguationPos(piece_direction, as_knight, ally_qal){
				return that.testCollision(3, final_qos, piece_direction, as_knight, null, null, ally_qal).disambiguationPos;
			}
			
			rtn_can_move=that.isLegalMove(initial_qos, final_qos);
			
			if(rtn_can_move){
				initial_cached_square=that.getSquare({
					qos : initial_qos,
					isUnreferenced : true
				});
				
				final_cached_square=that.getSquare({
					qos : final_qos,
					isUnreferenced : true
				});
				
				active_color_rook=(_ROOK*that.Active.sign);
				
				pawn_moved=false;
				new_en_passant_bos="";
				promoted_val=0;
				king_castled=0;
				
				new_active_castling_availity=(that.Active.isBlack ? that.BCastling : that.WCastling);
				new_non_active_castling_availity=(that.Active.isBlack ? that.WCastling : that.BCastling);
				
				to_promotion_rank=(final_cached_square.rankPos===(that.Active.isBlack ? 7 : 0));
				active_king_original_rank=(that.Active.isBlack ? 0 : 7);
				
				if(initial_cached_square.isKing){
					if(new_active_castling_availity){
						new_active_castling_availity=0;
						
						if(final_cached_square.filePos===6){//short
							king_castled=1;
							
							that.setSquare({
								qos : [active_king_original_rank, 5],
								qal : active_color_rook
							});
							
							that.setSquare({
								qos : [active_king_original_rank, 7],
								qal : _EMPTY_SQR
							});
						}else if(final_cached_square.filePos===2){//long
							king_castled=2;
							
							that.setSquare({
								qos : [active_king_original_rank, 3],
								qal : active_color_rook
							});
							
							that.setSquare({
								qos : [active_king_original_rank, 0],
								qal : _EMPTY_SQR
							});
						}
					}
				}else if(initial_cached_square.isPawn){
					pawn_moved=true;
					
					if(Math.abs(initial_cached_square.rankPos-final_cached_square.rankPos)>1){//new enpassant
						new_en_passant_bos=(final_cached_square.fileBos+""+(that.Active.isBlack ? 6 : 3));
					}else if(sameSquare(final_cached_square.bos, that.EnPassantBos)){//enpassant capture
						that.setSquare({
							qos : (final_cached_square.fileBos+""+(that.Active.isBlack ? 4 : 5)),
							qal : _EMPTY_SQR
						});//ver con step, se calcula mas facil? o sin diagonal no tan facil?
					}else if(to_promotion_rank){//promotion
						promoted_val=(that.PromoteTo*that.Active.sign);
					}
				}
				
				//aun sin mover la pieza actual (pero ya lo de enpassant capture y lo de la torre al enrocar)
				pgn_move=(function(){
					var i, len, temp, temp2, temp3, ambiguity, piece_directions, rtn;
					
					rtn="";
					
					if(king_castled){//castling king
						rtn+=(king_castled!==1 ? "O-O-O" : "O-O");
					}else if(initial_cached_square.isPawn){
						if(initial_cached_square.fileBos!==final_cached_square.fileBos){
							rtn+=(initial_cached_square.fileBos+"x");
						}
						
						rtn+=final_cached_square.bos;
						
						if(promoted_val){
							rtn+="="+toAbsBal(promoted_val);
						}
					}else{//knight, bishop, rook, queen, non-castling king
						rtn+=initial_cached_square.absBal;
						
						if(!initial_cached_square.isKing){//knight, bishop, rook, queen
							temp2=[];
							
							piece_directions=[];
							if(!initial_cached_square.isBishop){piece_directions.push(1, 3, 5, 7);}
							if(!initial_cached_square.isRook){piece_directions.push(2, 4, 6, 8);}
							
							for(i=0, len=piece_directions.length; i<len; i++){//0...1
								if(temp=_disambiguationPos(piece_directions[i], initial_cached_square.isKnight, initial_cached_square.absVal)){temp2.push(temp);}
							}
							
							len=temp2.length;
							if(len>1){
								temp3="";
								
								for(i=0; i<len; i++){//0<len
									//imposible que isLegalMove() sea afectado por los ajustes de enroque o captura EP
									if(!sameSquare(temp2[i], initial_qos) && that.isLegalMove(temp2[i], final_qos)){
										temp3+=toBos(temp2[i]);
									}
								}
								
								if(temp3){
									ambiguity=(_strContains(temp3, initial_cached_square.fileBos)+(_strContains(temp3, initial_cached_square.rankBos)*2));
									
									if(ambiguity!==1){//0,2,3
										rtn+=initial_cached_square.fileBos;
									}
									
									if(ambiguity && ambiguity!==2){//1,3
										rtn+=initial_cached_square.rankBos;
									}
								}
							}
						}
						
						if(final_cached_square.val){
							rtn+="x";
						}
						
						rtn+=final_cached_square.bos;
					}
					
					return rtn;
				})();
				
				that.HalfMove++;
				if(pawn_moved || final_cached_square.val){
					that.HalfMove=0;
				}
				
				if(that.Active.isBlack){
					that.FullMove++;
				}
				
				//test for rook move (original square)
				if(new_active_castling_availity && initial_cached_square.isRook && initial_cached_square.rankPos===active_king_original_rank){
					if(initial_cached_square.filePos===7 && new_active_castling_availity!==2){//short
						new_active_castling_availity--;
					}else if(initial_cached_square.filePos===0 && new_active_castling_availity!==1){//long
						new_active_castling_availity-=2;
					}
				}
				
				//test for rook capture (original square)
				if(new_non_active_castling_availity && final_cached_square.val===-active_color_rook && to_promotion_rank){
					if(final_cached_square.filePos===7 && new_non_active_castling_availity!==2){//short
						new_non_active_castling_availity--;
					}else if(final_cached_square.filePos===0 && new_non_active_castling_availity!==1){//long
						new_non_active_castling_availity-=2;
					}
				}
				
				that.WCastling=(that.Active.isBlack ? new_non_active_castling_availity : new_active_castling_availity);
				that.BCastling=(that.Active.isBlack ? new_active_castling_availity : new_non_active_castling_availity);
				
				that.EnPassantBos=new_en_passant_bos;
				
				that.setSquare({
					qos : final_qos,
					qal : (promoted_val || initial_cached_square.val)
				});
				
				that.setSquare({
					qos : initial_qos,
					qal : _EMPTY_SQR
				});
				
				temp=that.Active.isBlack;
				that.Active.isBlack=!temp;
				that.NonActive.isBlack=temp;
				that.Active.sign=getSign(!temp);
				that.NonActive.sign=getSign(temp);
				
				that.updateKingsChecksFenMatdiff();
				
				that.CurrentMove++;
				
				if(that.CurrentMove!==that.MoveList.length){
					that.MoveList=that.MoveList.slice(0, that.CurrentMove);/*start variation instead of overwrite*/
				}
				
				pgn_end="";
				
				if(that.IsCheck){
					if(that.IsCheckmate){
						pgn_move+="#";
						pgn_end=(that.Active.isBlack ? "1-0" : "0-1");
					}else{
						pgn_move+="+";
					}
				}else{
					if(that.IsStalemate){
						pgn_end="1/2-1/2";
					}
				}
				
				that.MoveList.push({Fen : that.Fen, PGNmove : pgn_move, PGNend : pgn_end, FromBos : initial_cached_square.bos, ToBos : final_cached_square.bos, InitialVal : initial_cached_square.val, FinalVal : (promoted_val || initial_cached_square.val), KingCastled : king_castled});
			}
			
			return rtn_can_move;
		}
		
		function _refreshBoard(animate_move){
			var that;
			
			that=this;
			
			if(win.IcUi && win.IcUi.refreshBoard){
				IcUi.refreshBoard.apply(that, [animate_move]);
			}
		}
		
		//---------------- ic
		
		function setSilentMode(val){
			_SILENT_MODE=!!val;
		}
		
		function boardExists(woard){
			var temp, rtn;
			
			temp=_SILENT_MODE;
			
			Ic.setSilentMode(true);
			rtn=(selectBoard(woard)!==null);
			Ic.setSilentMode(temp);
			
			return rtn;
		}
		
		function selectBoard(woard){
			var no_errors, woard_type, rtn;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				woard_type=(typeof woard);
				
				if(woard_type==="undefined"){
					no_errors=false;
					_consoleLog("Error[selectBoard]: undefined variable");
				}
			//}
			
			if(no_errors){
				if(woard_type==="object" && (typeof woard.BoardName)!=="string"){
					no_errors=false;
					_consoleLog("Error[selectBoard]: object without BoardName key");
				}
			}
			
			if(no_errors){
				if(woard_type==="string"){
					woard=_formatName(woard);
					
					if((typeof _BOARDS[woard])==="undefined"){
						no_errors=false;
						_consoleLog("Error[selectBoard]: board \""+woard+"\" not found");
					}
				}
			}
			
			if(no_errors){
				rtn=(woard_type==="object" ? woard : _BOARDS[woard]);
			}
			
			return rtn;
		}
		
		function toVal(qal){
			var temp, pc_exec, piece_char, rtn;
			
			if((typeof qal)==="string"){
				qal=_trimSpaces(qal);
				
				pc_exec=/^([wb])([pnbrqk])$/.exec(qal.toLowerCase());
				
				if(!!pc_exec){
					rtn=("*pnbrqk".indexOf(pc_exec[2])*getSign(pc_exec[1]==="b"));
				}else{
					piece_char=(qal.replace(/[^pnbrqk]/gi, "") || "*");
					
					if(piece_char.length===1){
						temp=piece_char.toLowerCase();
						
						rtn=("*pnbrqk".indexOf(temp)*getSign(piece_char===temp));//negative zero is handled by _toInt()
					}
				}
			}else{
				rtn=qal;
			}
			
			return _toInt(rtn, -6, 6);
		}
		
		function toAbsVal(qal){
			return Math.abs(toVal(qal));
		}
		
		function toBal(qal){
			var val, abs_val, rtn;
			
			val=toVal(qal);
			abs_val=toAbsVal(qal);
			
			rtn=["*", "p", "n", "b", "r", "q", "k"][abs_val];//asterisk character is dangerous: _occurrences() might use RegExp("*", "g") if not cautious
			
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
			return ((typeof qos)==="string" ? qos.toLowerCase() : ("abcdefgh".charAt(_toInt(getFilePos(qos), 0, 7))+""+_toInt((8-getRankPos(qos)), 1, 8)));
		}
		
		function toPos(qos){
			return ((typeof qos)==="string" ? [_toInt((8-getRankBos(qos)), 0, 7), _toInt("abcdefgh".indexOf(getFileBos(qos)), 0, 7)] : qos);
		}
		
		function getSign(zal){
			return (((typeof zal)==="boolean" ? !zal : (toVal(zal)>0)) ? 1 : -1);
		}
		
		function getRankPos(qos){
			return toPos(qos)[0];
		}
		
		function getFilePos(qos){
			return toPos(qos)[1];
		}
		
		function getRankBos(qos){
			return toBos(qos).charAt(1);
		}
		
		function getFileBos(qos){
			return toBos(qos).charAt(0);
		}
		
		function isInsideBoard(qos){
			return (toBos(toPos(qos))===toBos(qos) && (getRankPos(qos)<=7 && getRankPos(qos)>=0) && (getFilePos(qos)<=7 && getFilePos(qos)>=0));
		}
		
		function sameSquare(qos1, qos2){
			var qos1_type, qos2_type;
			
			qos1_type=(typeof qos1);
			qos2_type=(typeof qos2);
			
			if(qos1_type!=="string" && qos2_type!=="string"){
				qos1=toPos(qos1).join();
				qos2=toPos(qos2).join();
			}else{
				qos1=toBos(qos1);
				qos2=toBos(qos2);
			}
			
			return (qos1===qos2);
		}
		
		function removeBoard(woard){
			var del_board, rtn;
			
			rtn=false;
			del_board=selectBoard(woard);
			
			if(del_board!==null){
				delete _BOARDS[del_board.BoardName];
				rtn=true;
			}
			
			return rtn;
		}
		
		function isEqualBoard(left_woard, right_woard){
			var left_board, no_errors, rtn;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				left_board=selectBoard(left_woard);
				
				if(left_board===null){
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
				
				if(to_board===null){
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
			var i, j, target, board_name, current_bos, pre_fen, fen_was_valid, postfen_was_valid, new_board, no_errors, rtn;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				pre_fen=_trimSpaces(p.fen);
				
				p.invalidFenStop=(p.invalidFenStop===true);
				p.boardName=(((typeof p.boardName)==="string" && _trimSpaces(p.boardName).length) ? _formatName(p.boardName) : ("board_"+new Date().getTime()));
				p.isRotated=(p.isRotated===true);
				p.isHidden=(p.isHidden===true);
				p.promoteTo=toVal(p.promoteTo);
				board_name=p.boardName;
				
				fen_was_valid=((typeof p.fen)==="string" && !_basicFenTest(pre_fen));
				
				if(p.invalidFenStop && !fen_was_valid){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" bad FEN");
				}
			//}
			
			if(no_errors){
				if(!boardExists(board_name)){
					_BOARDS[board_name]={
						BoardName : board_name,
						getSquare : _getSquare,
						setSquare : _setSquare,
						calculateChecks : _calculateChecks,
						toggleIsRotated : _toggleIsRotated,
						setPromoteTo : _setPromoteTo,
						setCurrentMove : _setCurrentMove,
						readFen : _readFen,
						updateKingsChecksFenMatdiff : _updateKingsChecksFenMatdiff,
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
						refreshBoard : _refreshBoard
					};
				}
				
				target=_BOARDS[board_name];
				
				target.Active={
					isBlack : null,
					sign : null,
					kingBos : null,
					checks : null
				};
				
				target.NonActive={
					isBlack : null,
					sign : null,
					kingBos : null,
					checks : null
				};
				
				target.Fen=null;
				target.WCastling=null;
				target.BCastling=null;
				target.EnPassantBos=null;
				target.HalfMove=null;
				target.FullMove=null;
				target.InitialFullMove=null;
				target.MoveList=null;
				target.CurrentMove=null;
				target.IsRotated=null;
				target.IsCheck=null;
				target.IsCheckmate=null;
				target.IsStalemate=null;
				target.MaterialDiff=null;
				target.PromoteTo=null;
				target.SelectedBos=null;
				target.IsHidden=null;
				target.Squares=Object.create(null);
				
				for(i=0; i<8; i++){//0...7
					for(j=0; j<8; j++){//0...7
						current_bos=toBos([i, j]);
						
						target.Squares[current_bos]=Object.create(null);
						
						//static
						target.Squares[current_bos].pos=[i, j];
						target.Squares[current_bos].bos=current_bos;
						target.Squares[current_bos].rankPos=getRankPos(current_bos);
						target.Squares[current_bos].filePos=getFilePos(current_bos);
						target.Squares[current_bos].rankBos=getRankBos(current_bos);
						target.Squares[current_bos].fileBos=getFileBos(current_bos);
						//isPromotion square, isWhiteProm, isWenpass, etc
						
						//mutable
						target.Squares[current_bos].bal=null;
						target.Squares[current_bos].absBal=null;
						target.Squares[current_bos].val=null;
						target.Squares[current_bos].absVal=null;
						target.Squares[current_bos].className=null;
						target.Squares[current_bos].sign=null;
						target.Squares[current_bos].isEmptySquare=null;
						target.Squares[current_bos].isPawn=null;
						target.Squares[current_bos].isKnight=null;
						target.Squares[current_bos].isBishop=null;
						target.Squares[current_bos].isRook=null;
						target.Squares[current_bos].isQueen=null;
						target.Squares[current_bos].isKing=null;
					}
				}
				
				new_board=selectBoard(board_name);
				
				if(new_board===null){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" board creation failure");
				}
			}
			
			if(no_errors){
				new_board.readFen(fen_was_valid ? pre_fen : _DEFAULT_FEN);
				
				new_board.InitialFullMove=new_board.FullMove;
				new_board.MoveList=[{Fen : new_board.Fen, PGNmove : "", PGNend : "", FromBos : "", ToBos : "", InitialVal : 0, FinalVal : 0, KingCastled : 0}];
				new_board.CurrentMove=0;
				new_board.setPromoteTo(p.promoteTo);
				new_board.IsRotated=p.isRotated;
				new_board.IsHidden=p.isHidden;
				
				postfen_was_valid=!new_board.refinedFenTest();
				
				if(p.invalidFenStop && !postfen_was_valid){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" bad postFEN");
					
					removeBoard(new_board);
				}
			}
			
			if(no_errors){
				if(!postfen_was_valid){
					new_board.readFen(_DEFAULT_FEN);
					
					new_board.InitialFullMove=new_board.FullMove;
					new_board.MoveList=[{Fen : new_board.Fen, PGNmove : "", PGNend : "", FromBos : "", ToBos : "", InitialVal : 0, FinalVal : 0, KingCastled : 0}];
					new_board.CurrentMove=0;
					new_board.setPromoteTo(p.promoteTo);
					new_board.IsRotated=p.isRotated;
					new_board.IsHidden=p.isHidden;
				}
				
				rtn=new_board;
				
				//new_board.refreshBoard(); not without autorefresh
			}
			
			return rtn;
		}
		
		function fenApply(fen, fn_name, args){
			var board, board_created, rtn;
			
			rtn=null;
			
			board=initBoard({
				boardName : "board_fenApply",
				fen : fen,
				isHidden : true,
				invalidFenStop : true
			});
			
			board_created=(board!==null);
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
					rtn=(board_created ? _getSquare.apply(board, [{qos : args[0], isUnreferenced : true}]) : null);//2020 temporal FIX, luego de que se arregle, forzar isUnreferenced para fenApply
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
				
				board_created=(board!==null);
				
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
			return (Object.prototype.toString.call(arr)==="[object Array]" ? arr.map(x => toBos(x)) : []);
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
	})();
	
	if(!win.Ic){
		win.Ic=Ic;
	}
})(window);
