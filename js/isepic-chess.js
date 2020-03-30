/** Copyright (c) 2012 Ajax Isepic (ajax333221) Licensed MIT */

/*jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:true, curly:true, es3:true, latedef:nofunc, bitwise:false, sub:true */

(function(win, $){
	var Ic=(function(){
		var _VERSION="2.5.1";
		var _NEXT_BOARD_ID=0;
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
		var _MUTABLE_KEYS=["Active", "NonActive", "Fen", "WCastling", "BCastling", "EnPassantBos", "HalfMove", "FullMove", "InitialFullMove", "MoveList", "CurrentMove", "IsRotated", "IsCheck", "IsCheckmate", "IsStalemate", "MaterialDiff", "PromoteTo", "FromSquare", "IsHidden", "Squares"];
		
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
			to_board.MoveList=[];
			to_board.MaterialDiff={w:[], b:[]};
			
			$.each(_MUTABLE_KEYS, function(i, key){
				if((typeof from_board[key])==="object" && from_board[key]!==null){
					$.extend(true, to_board[key], from_board[key]);
				}else{
					to_board[key]=from_board[key];
				}
			});
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
		
		function _getValue(qos){
			var that;
			
			that=this;
			
			return that.Squares[toBos(qos)];
		}
		
		function _setValue(qos, qal){
			var that;
			
			that=this;
			
			that.Squares[toBos(qos)]=toVal(qal);
		}
		
		function _materialDifference(){
			var i, j, len, that, current_diff, fen_board, rtn;
			
			that=this;
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
		
		function _calculateChecks(king_qos, early_break){
			var i, j, that, as_knight, rtn_total_checks;
			
			that=this;
			
			function _isAttacked(initial_qos, piece_direction, as_knight){
				return that.testCollision(2, initial_qos, piece_direction, as_knight, null, null, null).isAttacked;
			}
			
			rtn_total_checks=0;
			king_qos=(king_qos || that.Active.kingPos);
			
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
					that.setValue([i, j], _EMPTY_SQR);
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
						that.setValue([i, current_file], toVal(current_char));
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
			
			that.refreshKingPosChecksAndFen();
		}
		
		function _refreshKingPosChecksAndFen(){
			var i, j, that, current_pos, current_val, empty_consecutive_squares, new_fen_board, no_legal_moves;
			
			that=this;
			new_fen_board="";
			
			for(i=0; i<8; i++){//0...7
				empty_consecutive_squares=0;
				
				for(j=0; j<8; j++){//0...7
					current_pos=[i, j];
					current_val=that.getValue(current_pos);
					
					if(current_val){
						if(toAbsVal(current_val)===_KING){
							if(that.Active.isBlack===(current_val<0)){
								that.Active.kingPos=current_pos;
							}else{
								that.NonActive.kingPos=current_pos;
							}
						}
						
						new_fen_board+=(empty_consecutive_squares || "")+toBal(current_val);
						empty_consecutive_squares=-1;
					}
					
					empty_consecutive_squares++;
				}
				
				new_fen_board+=(empty_consecutive_squares || "")+(i!==7 ? "/" : "");
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
			
			that.MaterialDiff=that.materialDifference();
		}
		
		function _refinedFenTest(){
			var i, j, k, that, temp, current_sign, current_castling_availity, current_king_rank, en_passant_rank, en_passant_file, fen_board, total_pawns_in_current_file, min_captured, min_captured_holder, error_msg;
			
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
				
				if(that.calculateChecks(that.NonActive.kingPos, true)){
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
					
					en_passant_rank=getRankPos(that.EnPassantBos);
					en_passant_file=getFilePos(that.EnPassantBos);
					
					if(that.HalfMove || that.getValue(that.EnPassantBos) || en_passant_rank!==(that.Active.isBlack ? 5 : 2) || that.getValue([(en_passant_rank+temp), en_passant_file]) || that.getValue([(en_passant_rank-temp), en_passant_file])!==temp){
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
							total_pawns_in_current_file+=that.getValue([k, j])===(1*getSign(!i));
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
						
						if(that.getValue([current_king_rank, 4])!==(_KING*current_sign)){
							error_msg="Error [5] "+(i ? "white" : "black")+" castling ability without king in original position";
						}else if(current_castling_availity!==2 && that.getValue([current_king_rank, 7])!==(_ROOK*current_sign)){
							error_msg="Error [6] "+(i ? "white" : "black")+" short castling ability with missing H-file rook";
						}else if(current_castling_availity!==1 && that.getValue([current_king_rank, 0])!==(_ROOK*current_sign)){
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
			var i, that, current_pos, current_val, current_abs_val, rank_change, file_change, rtn;
			
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
			
			current_pos=[getRankPos(initial_qos), getFilePos(initial_qos)];
			
			for(i=0; i<total_squares; i++){//0<total_squares
				current_pos=[(current_pos[0]+rank_change), (current_pos[1]+file_change)];
				
				if(!isInsideBoard(current_pos)){
					break;
				}
				
				current_val=that.getValue(current_pos);
				
				if(current_val){
					current_abs_val=toAbsVal(current_val);
					
					if(getSign(current_val)===that.NonActive.sign){//is enemy piece
						if(op===1){
							if(allow_capture && current_abs_val!==_KING){
								rtn.candidateMoves.push(current_pos);
							}
						}else if(op===2){
							if(as_knight){
								if(current_abs_val===_KNIGHT){
									rtn.isAttacked=true;
								}
							}else if(current_abs_val===_KING){
								if(!i){
									rtn.isAttacked=true;
								}
							}else if(current_abs_val===_QUEEN){
								rtn.isAttacked=true;
							}else if(piece_direction%2){
								if(current_abs_val==_ROOK){
									rtn.isAttacked=true;
								}
							}else if(current_abs_val===_BISHOP){
								rtn.isAttacked=true;
							}else if(!i && current_abs_val===_PAWN){
								if(current_val===_PAWN){
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
							if(toAbsVal(ally_qal)===current_abs_val){
								rtn.disambiguationPos=current_pos;
							}
						}
					}
					
					break;
				}
				
				if(op===1){
					rtn.candidateMoves.push(current_pos);//if capturing, this is unreachable because the break
				}
			}
			
			return rtn;
		}
		
		function _legalMoves(piece_qos){
			var i, j, len, len2, that, temp, temp2, temp3, active_color, non_active_sign, current_adjacent_file, piece_val, piece_abs_val, current_pos, current_diagonal_pawn_pos, pre_validated_arr_pos, active_color_king_rank, is_king, as_knight, en_passant_capturable_bos, piece_rank, active_castling_availity, piece_directions, no_errors, rtn;
			
			that=this;
			
			function _candidateMoves(initial_qos, piece_direction, as_knight, total_squares, allow_capture){
				return that.testCollision(1, initial_qos, piece_direction, as_knight, total_squares, allow_capture, null).candidateMoves;
			}
			
			rtn=[];
			no_errors=true;
			
			//if(no_errors){
				if(!isInsideBoard(piece_qos)){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				active_color=that.Active.isBlack;
				non_active_sign=that.NonActive.sign;
				
				piece_val=that.getValue(piece_qos);
				
				if(!piece_val || getSign(piece_val)===non_active_sign){//is empty square or enemy piece
					no_errors=false;
				}
			}
			
			if(no_errors){//is inside board + is ally piece
				pre_validated_arr_pos=[];
				
				en_passant_capturable_bos="";
				piece_abs_val=toAbsVal(piece_val);
				
				is_king=(piece_abs_val===_KING);
				active_color_king_rank=(active_color ? 0 : 7);
				
				if(is_king){//king
					for(i=1; i<9; i++){//1...8
						if((temp=_candidateMoves(piece_qos, i, false, 1, true)).length){pre_validated_arr_pos.push(temp);}
					}
					
					active_castling_availity=(active_color ? that.BCastling : that.WCastling);
					
					if(active_castling_availity && !that.IsCheck){
						for(i=0; i<2; i++){//0...1
							if(active_castling_availity!==(i ? 1 : 2)){
								if(_candidateMoves(piece_qos, (i ? 7 : 3), false, (i ? 3 : 2), false).length===(i ? 3 : 2)){
									if(!that.calculateChecks([active_color_king_rank, (i ? 3 : 5)], true)){
										pre_validated_arr_pos.push([[active_color_king_rank, (i ? 2 : 6)]]);
									}
								}
							}
						}
					}
				}else if(piece_abs_val===_PAWN){
					piece_rank=getRankPos(piece_qos);
					
					if((temp=_candidateMoves(piece_qos, (active_color ? 5 : 1), false, (piece_rank===(active_color_king_rank+non_active_sign) ? 2 : 1), false)).length){pre_validated_arr_pos.push(temp);}
					
					for(i=0; i<2; i++){//0...1
						current_adjacent_file=(getFilePos(piece_qos)+(i ? 1 : -1));
						current_diagonal_pawn_pos=[(piece_rank+non_active_sign), current_adjacent_file];
						
						if(isInsideBoard(current_diagonal_pawn_pos)){
							temp2=that.getValue(current_diagonal_pawn_pos);
							
							if(temp2 && getSign(temp2)===non_active_sign && toAbsVal(temp2)!==_KING){
								pre_validated_arr_pos.push([current_diagonal_pawn_pos]);
							}else if(sameSquare(current_diagonal_pawn_pos, that.EnPassantBos)){
								en_passant_capturable_bos=toBos([piece_rank, current_adjacent_file]);
								pre_validated_arr_pos.push([current_diagonal_pawn_pos]);
							}
						}
					}
				}else{//knight, bishop, rook, queen
					piece_directions=[];
					if(piece_abs_val!==_BISHOP){piece_directions.push(1, 3, 5, 7);}
					if(piece_abs_val!==_ROOK){piece_directions.push(2, 4, 6, 8);}
					
					as_knight=(piece_abs_val===_KNIGHT);
					
					for(i=0, len=piece_directions.length; i<len; i++){//0...1
						if((temp=_candidateMoves(piece_qos, piece_directions[i], as_knight, null, true)).length){pre_validated_arr_pos.push(temp);}
					}
				}
				
				for(i=0, len=pre_validated_arr_pos.length; i<len; i++){//0<len
					for(j=0, len2=pre_validated_arr_pos[i].length; j<len2; j++){//0<len2
						current_pos=pre_validated_arr_pos[i][j];
						
						temp=that.getValue(current_pos);
						temp2=that.getValue(piece_qos);
						
						that.setValue(current_pos, piece_val);
						that.setValue(piece_qos, _EMPTY_SQR);
						
						if(en_passant_capturable_bos){
							temp3=that.getValue(en_passant_capturable_bos);
							
							if(sameSquare(current_pos, that.EnPassantBos)){
								that.setValue(en_passant_capturable_bos, _EMPTY_SQR);
							}
						}
						
						if(!that.calculateChecks((is_king ? current_pos : null), true)){
							rtn.push(current_pos);
						}
						
						that.setValue(current_pos, temp);
						that.setValue(piece_qos, temp2);
						
						if(en_passant_capturable_bos){
							that.setValue(en_passant_capturable_bos, temp3);
						}
					}
				}
			}
			
			return rtn;
		}
		
		function _isLegalMove(initial_qos, final_qos){
			var that, moves, rtn;
			
			that=this;
			
			rtn=false;
			
			if(isInsideBoard(final_qos)){
				moves=that.legalMoves(initial_qos);
				
				if(moves.length){
					rtn=_strContains(moves.join("/"), toPos(final_qos).join());
				}
			}
			
			return rtn;
		}
		
		function _ascii(is_rotated){
			var i, j, that, temp, bottom_label, rtn;
			
			that=this;
			rtn="   +------------------------+\n";
			bottom_label="";
			
			for(i=0; i<8; i++){//0...7
				temp=(is_rotated ? (7-i) : i);
				bottom_label+="  "+getFileBos([0, temp]);
				rtn+=" "+getRankBos([temp, 0])+" |";
				
				for(j=0; j<8; j++){//0...7
					rtn+=" "+toBal(that.getValue(is_rotated ? [(7-i), (7-j)] : [i, j])).replace("*", ".")+" ";
				}
				
				rtn+="|\n";
			}
			
			rtn+="   +------------------------+\n";
			rtn+="   "+bottom_label+"\n";
			
			return rtn;
		}
		
		function _boardHash(){
			var that, temp;
			
			that=this;
			temp="";
			
			$.each(_MUTABLE_KEYS, function(i, key){
				temp+=JSON.stringify(that[key]);
			});
			
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
				/*algun IcUi.refreshBoard(0); pero problemas con hidden*/
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
				/*algun IcUi.refreshBoard(0); pero problemas con hidden*/
			}
			
			return no_errors;
		}
		
		function _moveCaller(initial_qos, final_qos){
			var that, temp, active_color, active_sign, active_color_king_rank, pawn_moved, promoted_val, piece_val, piece_abs_val, active_color_rook, new_en_passant_bos, new_active_castling_availity, new_non_active_castling_availity, king_castled, non_en_passant_capture, to_promotion_rank, pgn_move, pgn_end, rtn_can_move;
			
			that=this;
			
			function _disambiguationPos(initial_qos, piece_direction, as_knight, ally_qal){
				return that.testCollision(3, initial_qos, piece_direction, as_knight, null, null, ally_qal).disambiguationPos;
			}
			
			rtn_can_move=that.isLegalMove(initial_qos, final_qos);
			
			if(rtn_can_move){
				active_color=that.Active.isBlack;
				active_sign=that.Active.sign;
				active_color_rook=(_ROOK*active_sign);
				
				pawn_moved=false;
				new_en_passant_bos="";
				promoted_val=0;
				king_castled=0;
				non_en_passant_capture=that.getValue(final_qos);
				
				new_active_castling_availity=(active_color ? that.BCastling : that.WCastling);
				new_non_active_castling_availity=(active_color ? that.WCastling : that.BCastling);
				
				to_promotion_rank=(getRankPos(final_qos)===(active_color ? 7 : 0));
				active_color_king_rank=(active_color ? 0 : 7);
				
				piece_val=that.getValue(initial_qos);
				piece_abs_val=toAbsVal(piece_val);
				
				if(piece_abs_val===_KING){
					if(new_active_castling_availity){
						new_active_castling_availity=0;
						
						if(getFilePos(final_qos)===6){//short
							king_castled=1;
							
							that.setValue([active_color_king_rank, 5], active_color_rook);
							that.setValue([active_color_king_rank, 7], _EMPTY_SQR);
						}else if(getFilePos(final_qos)===2){//long
							king_castled=2;
							
							that.setValue([active_color_king_rank, 3], active_color_rook);
							that.setValue([active_color_king_rank, 0], _EMPTY_SQR);
						}
					}
				}else if(piece_abs_val===_PAWN){
					pawn_moved=true;
					
					if(Math.abs(getRankPos(initial_qos)-getRankPos(final_qos))>1){//new enpassant
						new_en_passant_bos=(getFileBos(final_qos)+""+(active_color ? 6 : 3));
					}else if(sameSquare(final_qos, that.EnPassantBos)){//enpassant capture
						that.setValue(((getFileBos(final_qos)+""+(active_color ? 4 : 5))), _EMPTY_SQR);
					}else if(to_promotion_rank){//promotion
						promoted_val=(that.PromoteTo*active_sign);
					}
				}
				
				//aun sin mover la pieza actual (pero ya lo de enpassant capture y lo de la torre al enrocar)
				pgn_move=(function(){
					var i, len, temp, temp2, temp3, initial_file_bos, ambiguity, piece_directions, as_knight, rtn;
					
					rtn="";
					initial_file_bos=getFileBos(initial_qos);
					
					if(king_castled){//castling king
						rtn+=(king_castled!==1 ? "O-O-O" : "O-O");
					}else if(piece_abs_val===_PAWN){
						if(initial_file_bos!==getFileBos(final_qos)){
							rtn+=(initial_file_bos+"x");
						}
						
						rtn+=toBos(final_qos);
						
						if(promoted_val){
							rtn+="="+toAbsBal(promoted_val);
						}
					}else{//knight, bishop, rook, queen, non-castling king
						rtn+=toAbsBal(piece_val);
						
						if(piece_abs_val!==_KING){//knight, bishop, rook, queen
							temp2=[];
							
							piece_directions=[];
							if(piece_abs_val!==_BISHOP){piece_directions.push(1, 3, 5, 7);}
							if(piece_abs_val!==_ROOK){piece_directions.push(2, 4, 6, 8);}
							
							as_knight=(piece_abs_val===_KNIGHT);
							
							for(i=0, len=piece_directions.length; i<len; i++){//0...1
								if(temp=_disambiguationPos(final_qos, piece_directions[i], as_knight, piece_abs_val)){temp2.push(temp);}
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
									ambiguity=(_strContains(temp3, initial_file_bos)+(_strContains(temp3, getRankBos(initial_qos))*2));
									
									if(ambiguity!==1){//0,2,3
										rtn+=initial_file_bos;
									}
									
									if(ambiguity && ambiguity!==2){//1,3
										rtn+=getRankBos(initial_qos);
									}
								}
							}
						}
						
						if(non_en_passant_capture){
							rtn+="x";
						}
						
						rtn+=toBos(final_qos);
					}
					
					return rtn;
				})();
				
				that.HalfMove++;
				if(pawn_moved || non_en_passant_capture){
					that.HalfMove=0;
				}
				
				if(active_color){
					that.FullMove++;
				}
				
				//test for rook move (original square)
				if(new_active_castling_availity && piece_abs_val===_ROOK && getRankPos(initial_qos)===active_color_king_rank){
					if(getFilePos(initial_qos)===7 && new_active_castling_availity!==2){//short
						new_active_castling_availity--;
					}else if(getFilePos(initial_qos)===0 && new_active_castling_availity!==1){//long
						new_active_castling_availity-=2;
					}
				}
				
				//test for rook capture (original square)
				if(new_non_active_castling_availity && non_en_passant_capture===-active_color_rook && to_promotion_rank){
					if(getFilePos(final_qos)===7 && new_non_active_castling_availity!==2){//short
						new_non_active_castling_availity--;
					}else if(getFilePos(final_qos)===0 && new_non_active_castling_availity!==1){//long
						new_non_active_castling_availity-=2;
					}
				}
				
				that.WCastling=(active_color ? new_non_active_castling_availity : new_active_castling_availity);
				that.BCastling=(active_color ? new_active_castling_availity : new_non_active_castling_availity);
				
				that.EnPassantBos=new_en_passant_bos;
				
				that.setValue(final_qos, (promoted_val || piece_val));
				that.setValue(initial_qos, _EMPTY_SQR);
				
				temp=that.Active.isBlack;
				that.Active.isBlack=!temp;
				that.NonActive.isBlack=temp;
				that.Active.sign=getSign(!temp);
				that.NonActive.sign=getSign(temp);
				
				that.refreshKingPosChecksAndFen();
				
				that.CurrentMove++;
				
				if(that.CurrentMove!==that.MoveList.length){
					that.MoveList=that.MoveList.slice(0, that.CurrentMove);/*start variation instead of overwrite*/
				}
				
				pgn_end="";
				
				if(that.IsCheck){
					if(that.IsCheckmate){
						pgn_move+="#";
						pgn_end=(active_color ? "0-1" : "1-0");
					}else{
						pgn_move+="+";
					}
				}else{
					if(that.IsStalemate){
						pgn_end="1/2-1/2";
					}
				}
				
				that.MoveList.push({Fen : that.Fen, PGNmove : pgn_move, PGNend : pgn_end, FromBos : toBos(initial_qos), ToBos : toBos(final_qos), InitialVal : piece_val, FinalVal : (promoted_val || piece_val), KingCastled : king_castled});
			}
			
			return rtn_can_move;
		}
		
		//---------------- ic
		
		function setSilentMode(val){
			_SILENT_MODE=!!val;
		}
		
		function boardExists(woard){
			var temp, rtn;
			
			temp=_SILENT_MODE;
			Ic.setSilentMode(true);
			rtn=selectBoard(woard)!==null;
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
				if(woard_type==="string" && (typeof _BOARDS[woard])==="undefined"){
					no_errors=false;
					_consoleLog("Error[selectBoard]: board \""+woard+"\" not found");
				}
			}
			
			if(no_errors){
				rtn=(woard_type==="object" ? woard : _BOARDS[woard]);
			}
			
			return rtn;
		}
		
		function toVal(qal){
			var rtn, temp;
			
			if((typeof qal)==="string"){
				qal=(qal.replace(/[^pnbrqk]/gi, "") || "*");
				temp=qal.toLowerCase();
				
				if(qal.length===1){
					rtn=("*pnbrqk".indexOf(temp)*getSign(qal===temp));//sometimes is -0 but no worries
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
			var rtn, val, abs_val;
			
			val=toVal(qal);
			abs_val=toAbsVal(qal);
			
			rtn=["*", "p", "n", "b", "r", "q", "k"][abs_val];//asterisk character is dangerous: _occurrences() might use RegExp("*", "g") if not cautious
			
			return (val===abs_val ? rtn.toUpperCase() : rtn);
		}
		
		function toAbsBal(qal){
			return toBal(toAbsVal(qal));
		}
		
		function toPieceClass(qal){
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
		
		function initBoard(p){//{name, fen, isRotated, isHidden, promoteTo, invalidFenStop}
			var i, j, target, board_name, pre_fen, fen_was_valid, postfen_was_valid, new_board, no_errors, rtn;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				pre_fen=_trimSpaces(p.fen);
				
				p.invalidFenStop=(p.invalidFenStop===true);
				p.name=(((typeof p.name)==="string" && _trimSpaces(p.name).length) ? _formatName(p.name) : ("board_"+new Date().getTime()));
				p.isRotated=(p.isRotated===true);
				p.isHidden=(p.isHidden===true);
				p.promoteTo=toVal(p.promoteTo);
				board_name=p.name;
				
				fen_was_valid=((typeof p.fen)==="string" && !_basicFenTest(pre_fen));
				
				if(p.invalidFenStop && !fen_was_valid){
					no_errors=false;
					_consoleLog("Error[initBoard]: \""+board_name+"\" bad FEN");
				}
			//}
			
			if(no_errors){
				if(!boardExists(board_name)){
					_BOARDS[board_name]={
						id : _NEXT_BOARD_ID++,
						BoardName : board_name,
						getValue : _getValue,
						setValue : _setValue,
						materialDifference : _materialDifference,
						calculateChecks : _calculateChecks,
						toggleIsRotated : _toggleIsRotated,
						setPromoteTo : _setPromoteTo,
						setCurrentMove : _setCurrentMove,
						readFen : _readFen,
						refreshKingPosChecksAndFen : _refreshKingPosChecksAndFen,
						refinedFenTest : _refinedFenTest,
						testCollision : _testCollision,
						isLegalMove : _isLegalMove,
						legalMoves : _legalMoves,
						ascii : _ascii,
						boardHash : _boardHash,
						isEqualBoard : _isEqualBoard,
						cloneBoardFrom : _cloneBoardFrom,
						cloneBoardTo : _cloneBoardTo,
						moveCaller : _moveCaller
					};
				}
				
				target=_BOARDS[board_name];
				
				target.Active={
					isBlack : null,
					sign : null,
					kingPos : null,
					checks : null
				};
				
				target.NonActive={
					isBlack : null,
					sign : null,
					kingPos : null,
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
				target.FromSquare=null;
				target.IsHidden=null;
				target.Squares=Object.create(null);
				
				for(i=0; i<8; i++){//0...7
					for(j=0; j<8; j++){//0...7
						target.setValue([i, j], null);
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
				
				/*if(win.IcUi && win.IcUi.refreshBoard){win.IcUi.refreshBoard.apply(new_board, [0]);}*/
			}
			
			return rtn;
		}
		
		function fenApply(fen, fn_name, args){
			var board, board_created, rtn;
			
			rtn=null;
			
			board=initBoard({
				name : "board_fenApply",
				fen : fen,
				isHidden : true,
				invalidFenStop : true
			});
			
			board_created=board!==null;
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
				case "getValue" :
					rtn=(board_created ? _getValue.apply(board, args) : 0);
					break;
				case "materialDifference" :
					rtn=(board_created ? _materialDifference.apply(board, args) : {w:[], b:[]});
					break;
				default :
					_consoleLog("Error[fenApply]: can't apply function \""+fn_name+"\" to fen");
			}
			
			if(board_created){
				removeBoard(board);
			}
			
			return rtn;
		}
		
		function getBoardCount(){
			return Object.keys(_BOARDS).length;
		}
		
		function getBoardNames(){
			var rtn;
			
			rtn=[];
			
			$.each(_BOARDS, function(i, board){
				rtn.push(i);
			});
			
			return rtn;
		}
		
		function mapToBos(arr){
			return ($.isArray(arr) ? arr.map(x => toBos(x)) : []);
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
			toPieceClass : toPieceClass,
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
			getBoardCount : getBoardCount,
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
})(window, jQuery);
