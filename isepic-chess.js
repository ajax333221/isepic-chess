/** Copyright (c) 2012 Ajax Isepic (ajax333221) Licensed MIT *//*jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:true, curly:true, es3:true, latedef:nofunc, bitwise:false, sub:true */var EMPTY_SQR=0;var PAWN=1;var KNIGHT=2;var BISHOP=3;var ROOK=4;var QUEEN=5;var KING=6;var WHITE_SIGN=1;var BLACK_SIGN=-1;var DEFAULT_FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";var _RefreshKingPosChecksAndFen=function(){	var i, j, that, piece_char, current_pos, current_val, empty_consecutive_squares, new_fen_board, current_is_black;		that=this;	new_fen_board="";		for(i=0; i<8; i++){//0...7		empty_consecutive_squares=0;				for(j=0; j<8; j++){//0...7			current_pos=[i, j];			current_val=that.getValue(current_pos);						if(current_val){				current_is_black=(current_val<0);								//if((current_val*(current_is_black ? BLACK_SIGN : WHITE_SIGN))==KING){				if((current_is_black ? -current_val : current_val)==KING){					if(that.Active.isBlack==current_is_black){						that.Active.kingPos=current_pos;					}else{						that.NonActive.kingPos=current_pos;					}				}								piece_char=pieceChar(current_val);				new_fen_board+=(empty_consecutive_squares || "")+(current_is_black ? piece_char : piece_char.toUpperCase());								empty_consecutive_squares=-1;			}						empty_consecutive_squares++;		}				new_fen_board+=(empty_consecutive_squares || "")+(i!=7 ? "/" : "");	}		that.Active.checks=that.countChecks(that.Active.kingPos, false);		that.Fen=(new_fen_board+" "+(that.Active.isBlack ? "b" : "w")+" "+((castlingChars(that.WCastling).toUpperCase()+""+castlingChars(that.BCastling)) || "-")+" "+(that.EnPassantBos || "-")+" "+that.HalfMove+" "+that.FullMove);};var _ReadFen=function(fen){	var that, temp, fen_parts;		that=this;	fen_parts=fen.split(" ");		that.parseValuesFromFEN(fen_parts[0]);		temp=(fen_parts[1]=="b");	that.Active.isBlack=temp;	that.NonActive.isBlack=!temp;	that.Active.sign=(temp ? BLACK_SIGN : WHITE_SIGN);	that.NonActive.sign=(temp ? WHITE_SIGN : BLACK_SIGN);		that.WCastling=(strContains(fen_parts[2], "K") ? 1 : 0)+(strContains(fen_parts[2], "Q") ? 2 : 0);	that.BCastling=(strContains(fen_parts[2], "k") ? 1 : 0)+(strContains(fen_parts[2], "q") ? 2 : 0);		that.EnPassantBos=fen_parts[3].replace("-", "");		that.HalfMove=(fen_parts[4]*1) || 0;	that.FullMove=(fen_parts[5]*1) || 1;		that.refreshKingPosChecksAndFen();};var _ParseValuesFromFEN=function(fenb){	var i, j, len, that, temp, current_file, skip_files, piece_char;		that=this;		for(i=0; i<8; i++){		for(j=0; j<8; j++){			that[posToBos([i, j])]=EMPTY_SQR;		}	}		fenb=fenb.split("/");		for(i=0; i<8; i++){//0...7		current_file=0;				for(j=0, len=fenb[i].length; j<len; j++){//0<len			temp=fenb[i].charAt(j);			skip_files=(temp*1);						if(!skip_files){				piece_char=temp.toLowerCase();				that[toBos([i, current_file])]="*pnbrqk".indexOf(piece_char)*(temp==piece_char ? BLACK_SIGN : WHITE_SIGN);			}						current_file+=(skip_files || 1);		}	}};var _FirstTimeDefaults=function(is_hidden, rotate_board){	var that;		that=this;		that.InitialFullMove=that.FullMove;	that.MoveList=[{Fen : that.Fen, PGNmove : "", FromBos : "", ToBos : ""}];	that.CurrentMove=0;	that.PromoteTo=QUEEN;	that.IsRotated=!!rotate_board;	that.IsHidden=!!is_hidden;};var _RefreshHTML=function(rewrite_board){	var that;		that=this;		if(!that.IsHidden){		if(!$("#xchessboard").length){/*BUG: al iniciar mas de un board, se quedan las funciones bindeadas con otros objetos*/			that.appendChessBoardHTML();		}else if(rewrite_board){			$("#xboard").html(getTbodyHTML(that.IsRotated));		}				that.resetPieceClasses();				$("#xmovelist").html(that.getMoveListHTML());		$(".xpgn_goto").click(function(){that.setCurrentMove((this.id.substring(4)*1), true);});				$("#xfen").val(that.Fen);				if(that.CurrentMove!=0){			$("#"+that.MoveList[that.CurrentMove].FromBos).addClass("lastmove");			$("#"+that.MoveList[that.CurrentMove].ToBos).addClass("lastmove");		}				that.giveSquareMovement();				$("#xobjinfo").html(that.getObjInfoHTML());	}};var _GetObjInfoHTML=function(){	var that, rtn;		that=this;		rtn="<strong>board_name:</strong> "+that.BoardName;	rtn+="<br><strong>board_is_rotated:</strong> "+that.IsRotated;	rtn+="<br><strong>en_passant:</strong> "+(that.EnPassantBos ? that.EnPassantBos : "-");	rtn+="<br><strong>active_color:</strong> "+(that.Active.isBlack ? "black" : "white");	rtn+="<br><strong>active_king_checks:</strong> "+that.Active.checks;	rtn+="<br><strong>active_king_pos:</strong> "+posToBos(that.Active.kingPos);	rtn+="<br><strong>non_active_king_pos:</strong> "+posToBos(that.NonActive.kingPos);	rtn+="<br><strong>white_castling:</strong> "+(castlingChars(that.WCastling).toUpperCase() || "-");	rtn+="<br><strong>black_castling:</strong> "+(castlingChars(that.BCastling) || "-");	rtn+="<br><strong>half_moves:</strong> "+that.HalfMove;	rtn+="<br><strong>full_moves:</strong> "+that.FullMove;	rtn+="<br><strong>current_move:</strong> "+that.CurrentMove;	rtn+="<br><strong>initial_fullmove:</strong> "+that.InitialFullMove;	rtn+="<br><strong>promote_to:</strong> "+(that.Active.isBlack ? pieceChar(that.PromoteTo) : pieceChar(that.PromoteTo).toUpperCase());	rtn+="<br><strong>from_square:</strong> "+(that.FromSquare ? that.FromSquare : "-");		return rtn;};var _GetMoveListHTML=function(){	var i, len, that, move_list, black_starts, rtn;		that=this;	move_list=that.MoveList;	black_starts=strContains(move_list[0].Fen, " b ");		rtn="";		for(i=1, len=move_list.length; i<len; i++){//1<len		rtn+=(i!=1 ? " " : "")+(black_starts!=(i%2) ? ("<span class='xpgn_number'>"+(that.InitialFullMove+Math.floor((i+black_starts-1)/2))+".</span>") : "")+"<span id='xpgn"+i+"' class='xpgn_"+(i!=that.CurrentMove ? "goto" : "active")+"'>"+move_list[i].PGNmove+"</span>";	}		if(black_starts && rtn!=""){		rtn="<span class='xpgn_number'>"+that.InitialFullMove+"...</span>"+rtn;	}		return rtn;};var _ResetPieceClasses=function(){	var i, j, that, temp, newClass, current_bos;		that=this;		for(i=0; i<8; i++){//0...7		for(j=0; j<8; j++){//0...7			current_bos=posToBos(that.IsRotated ? [(7-i), (7-j)] : [i, j]);			temp=that.getValue(current_bos);			newClass=(((i+j)%2 ? "b" : "w")+"s"+(temp ? ((temp<0 ? " b" : " w")+pieceChar(temp)) : ""));						$("#"+current_bos).attr("class", newClass);		}	}};var _AppendChessBoardHTML=function(){	var that;		that=this;		$("body").append("<div id='xchessboard'><table id='xboard' cellpadding='0' cellspacing='0'>"+getTbodyHTML(that.IsRotated)+"</table><div id='xcontrols'><input id='xfen' value='' type='text'><br><input id='xgoto0' value='|<' type='button'> <input id='xgoto1' value='<' type='button'> <input id='xgoto2' value='>' type='button'> <input id='xgoto3' value='>|' type='button'> | <input id='xrotate' value='rotate' type='button'> | <select id='xpromote'><option value='5' selected='selected'>queen</option><option value='4'>rook</option><option value='3'>bishop</option><option value='2'>knight</option></select><hr><p id='xmovelist'></p></div><p id='xobjinfo'></p></div>");		$("#xfen").click(function(){$(this).select();});	$("#xgoto0").click(function(){that.setCurrentMove(0, true);});	$("#xgoto1").click(function(){that.setCurrentMove(-1, false);});	$("#xgoto2").click(function(){that.setCurrentMove(1, false);});	$("#xgoto3").click(function(){that.setCurrentMove(10000, true);});		$("#xrotate").click(function(){		that.toggleIsRotated();		that.refreshHTML(true);	});		$("#xpromote").change(function(){		that.setPromoteTo(($(this).val()*1));		$("#xobjinfo").html(that.getObjInfoHTML());	});};var _GiveSquareMovement=function(){	var that;		that=this;	that.FromSquare="";		$(".ws, .bs").click(function(){		var i, len, temp, legal_moves;				if(!that.IsHidden){			if(that.FromSquare){				$(".ws, .bs").unbind("click");				$(".highlight").removeClass("highlight");								temp=that.FromSquare;				that.FromSquare="";								if(!that.moveCaller(bosToPos(temp), bosToPos(this.id))){					that.giveSquareMovement();				}			}else{				legal_moves=that.legalMoves(bosToPos(this.id));				len=legal_moves.length;								if(len){					that.FromSquare=this.id;					$(this).addClass("highlight");										for(i=0; i<len; i++){//0<len						$("#"+posToBos(legal_moves[i])).addClass("highlight");					}				}			}						$("#xobjinfo").html(that.getObjInfoHTML());		}	});};var _SetCurrentMove=function(val, is_goto){	var len, that, temp;		that=this;	len=that.MoveList.length;		if(len>1){		temp=Math.min(Math.max((is_goto ? val : val+that.CurrentMove), 0), (len-1));				if(temp!=that.CurrentMove){			that.CurrentMove=temp;						that.readFen(that.MoveList[temp].Fen);			that.refreshHTML(false);		}	}};var _SetPromoteTo=function(abs_val){	var that;		that=this;	that.PromoteTo=abs_val;};var _ToggleIsRotated=function(){	var that;		that=this;	that.IsRotated=!that.IsRotated;};var _IsLegalMove=function(initial_pos, final_pos){	var that;		that=this;	return (insideBoard(initial_pos) && insideBoard(final_pos) && strContains(that.legalMoves(initial_pos).join(""), final_pos.join()));};var _CountChecks=function(king_pos, early_break){	var i, j, that, as_knight, rtn_total_checks;		that=this;	rtn_total_checks=0;		outer:	for(i=0; i<2; i++){//0...1		as_knight=!!i;				for(j=1; j<9; j++){//1...8			if(that.isAttacked(king_pos, j, as_knight)){				rtn_total_checks++;								if(early_break){					break outer;				}			}		}	}		return rtn_total_checks;};var _ToggleActiveColor=function(){	var temp, that;		that=this;	temp=that.Active.isBlack;		that.Active.isBlack=!temp;	that.NonActive.isBlack=temp;	that.Active.sign=(temp ? WHITE_SIGN : BLACK_SIGN);	that.NonActive.sign=(temp ? BLACK_SIGN : WHITE_SIGN);};var _GetValue=function(qos){	var that;		that=this;	return that[toBos(qos)];};var _PostFenValidation=function(){	var i, j, k, that, temp, temp2, current_sign, keep_going, en_passant_pos, current_castling_availity, current_king_rank, en_passant_rank, en_passant_file, fen_board, total_pawns_in_current_file, min_captured, min_captured_holder, rtn_is_legal;		that=this;	rtn_is_legal=false;		if((that.HalfMove-that.Active.isBlack+1)<(that.FullMove*2)){		if(that.Active.checks<3){			that.toggleActiveColor();			keep_going=!that.countChecks(that.NonActive.kingPos, true);			that.toggleActiveColor();						if(keep_going){				if(that.EnPassantBos){					temp=that.NonActive.sign;//(that.Active.isBlack ? WHITE_SIGN : BLACK_SIGN)					en_passant_pos=bosToPos(that.EnPassantBos);										en_passant_rank=en_passant_pos[0];					en_passant_file=en_passant_pos[1];										/*negar todo permite salvar?*/					keep_going=(!that.HalfMove && !that.getValue(en_passant_pos) && en_passant_rank==(that.Active.isBlack ? 5 : 2) && !that.getValue([(en_passant_rank+temp), en_passant_file]) && that.getValue([(en_passant_rank-temp), en_passant_file])==temp);				}								if(keep_going){					fen_board=that.Fen.split(" ")[0];										for(i=0; i<2; i++){//0...1						min_captured=0;												for(j=0; j<8; j++){//0...7							min_captured_holder=(j==0 || j==7) ? [1, 3, 6, 10, 99] : [1, 2, 4, 6, 9];							temp2="";														for(k=0; k<8; k++){//0...7								temp2+="#"+(that.getValue([k, j]) || "");							}														total_pawns_in_current_file=(countChars(temp2, (i ? "#-1" : "#1"))/(i ? 3 : 2));														if(total_pawns_in_current_file>1){								min_captured+=min_captured_holder[total_pawns_in_current_file-2];							}						}												if(min_captured>(15-countChars(fen_board, (i ? "P|N|B|R|Q" : "p|n|b|r|q")))){							keep_going=false;							break;						}					}										if(keep_going){						for(i=0; i<2; i++){//0...1							current_castling_availity=(i ? that.WCastling : that.BCastling);														if(current_castling_availity){								current_sign=(i ? WHITE_SIGN : BLACK_SIGN);								current_king_rank=(i ? 7 : 0);																if(that.getValue([current_king_rank, 4])!=(current_sign*KING)){									keep_going=false;								}else if(current_castling_availity!=2 && that.getValue([current_king_rank, 7])!=(current_sign*ROOK)){									keep_going=false;								}else if(current_castling_availity!=1 && that.getValue([current_king_rank, 0])!=(current_sign*ROOK)){									keep_going=false;								}							}														if(!keep_going){								break;							}						}												rtn_is_legal=keep_going;					}				}			}		}	}		return rtn_is_legal;};var _CandidateMoves=function(initial_pos, piece_direction, as_knight, total_squares, allow_capture){	var that;		that=this;	return that.testCollision(1, initial_pos, piece_direction, as_knight, total_squares, allow_capture);};var _IsAttacked=function(initial_pos, piece_direction, as_knight){	var that;		that=this;	return that.testCollision(2, initial_pos, piece_direction, as_knight, null, null);};var _DisambiguationPos=function(initial_pos, piece_direction, as_knight, ally_abs_val){	var that;		that=this;	return that.testCollision(3, initial_pos, piece_direction, as_knight, null, ally_abs_val);};var _TestCollision=function(op, initial_pos, piece_direction, as_knight, total_squares, dependz){	var i, that, current_rank, current_file, current_pos, current_val, current_imp_val, rank_movement, file_movement, rtn;		that=this;		rank_movement=(as_knight ? [-2, -1, 1, 2, 2, 1, -1, -2] : [-1, -1, 0, 1, 1, 1, 0, -1]);	file_movement=(as_knight ? [1, 2, 2, 1, -1, -2, -2, -1] : [0, 1, 1, 1, 0, -1, -1, -1]);	total_squares=(as_knight ? 1 : (total_squares || 7));/*NO use math max 7, even if 999 the loop breaks on outside board*/		current_rank=initial_pos[0];	current_file=initial_pos[1];		rtn=(op==2 ? false : []);		for(i=0; i<total_squares; i++){//0<total_squares		current_rank+=rank_movement[piece_direction-1];		current_file+=file_movement[piece_direction-1];		current_pos=[current_rank, current_file];				if(!insideBoard(current_pos)){			break;		}				current_val=that.getValue(current_pos);				if(current_val){			current_imp_val=current_val*that.NonActive.sign;//(current_val*(that.Active.isBlack ? WHITE_SIGN : BLACK_SIGN)) -> (that.Active.isBlack ? current_val : -current_val)						if(current_imp_val>0){				if(op==1){					if(dependz && current_imp_val!=KING){						rtn.push(current_pos);					}				}else if(op==2){					if(as_knight){						if(current_imp_val==KNIGHT){							rtn=true;						}					}else if(current_imp_val==KING){						if(!i){							rtn=true;						}					}else if(current_imp_val==QUEEN){						rtn=true;					}else if(piece_direction%2){						if(current_imp_val==ROOK){							rtn=true;						}					}else if(current_imp_val==BISHOP){						rtn=true;					}else if(!i && current_imp_val==PAWN){						if(current_val==PAWN){//white pawn							if(piece_direction==4 || piece_direction==6){								rtn=true;							}						}else{//black pawn							/*NO merge in a single else if, the minimizer will do this*/							if(piece_direction==2 || piece_direction==8){								rtn=true;							}						}					}				}			}else if(op==3){				if(dependz==-current_imp_val){					rtn=current_pos;				}			}						break;		}				if(op==1){			rtn.push(current_pos);/*NO move this up (por lo del break)*/		}	}		return rtn;};var _LegalMoves=function(piece_pos){	var i, j, len, len2, that, temp, temp2, temp3, temp_board, active_color, non_active_sign, current_adjacent_file, piece_val, imp_val, current_pos, current_diagonal_pawn_pos, pre_validated_arr_pos, can_castle_current_side, active_color_king_rank, is_king, as_knight, en_passant_capturable_bos, piece_rank, active_castling_availity, rtn_validated_arr_pos;		that=this;	rtn_validated_arr_pos=[];		if(insideBoard(piece_pos)){		temp_board=new cloneBoard(that);		temp_board.IsHidden=true;				active_color=temp_board.Active.isBlack;		non_active_sign=temp_board.NonActive.sign;				piece_val=temp_board.getValue(piece_pos);		imp_val=(piece_val*-non_active_sign);				if(imp_val>0){			pre_validated_arr_pos=[];						en_passant_capturable_bos="";						is_king=(imp_val==KING);			active_color_king_rank=(active_color ? 0 : 7);						if(is_king){//king				for(i=1; i<9; i++){//1...8					if((temp=temp_board.candidateMoves(piece_pos, i, false, 1, true)).length){pre_validated_arr_pos.push(temp);}				}								active_castling_availity=(active_color ? temp_board.BCastling : temp_board.WCastling);								if(active_castling_availity && !temp_board.Active.checks){					for(i=0; i<2; i++){//0...1						if(active_castling_availity!=(i ? 1 : 2)){							if(temp_board.candidateMoves(piece_pos, (i ? 7 : 3), false, (i ? 3 : 2), false).length==(i ? 3 : 2)){								can_castle_current_side=true;																for(j=0; j<2; j++){//0...1									if(temp_board.countChecks([active_color_king_rank, (j+(i ? 2 : 5))], true)){//5...6 or 2...3										can_castle_current_side=false;										break;									}								}																if(can_castle_current_side){									pre_validated_arr_pos.push([[active_color_king_rank, (i ? 2 : 6)]]);								}							}						}					}				}			}else if(imp_val==PAWN){				piece_rank=piece_pos[0];								if((temp=temp_board.candidateMoves(piece_pos, (active_color ? 5 : 1), false, (piece_rank==(active_color_king_rank+non_active_sign) ? 2 : 1), false)).length){pre_validated_arr_pos.push(temp);}								for(i=0; i<2; i++){//0...1					current_adjacent_file=(piece_pos[1]+(i ? 1 : -1));					current_diagonal_pawn_pos=[(piece_rank+non_active_sign), current_adjacent_file];										if(insideBoard(current_diagonal_pawn_pos)){						temp2=(temp_board.getValue(current_diagonal_pawn_pos)*non_active_sign);												/*NO use (x && ...), we have negative numbers too*/						if(temp2>0 && temp2!=KING){							pre_validated_arr_pos.push([current_diagonal_pawn_pos]);						}else if(sameSqr(current_diagonal_pawn_pos, temp_board.EnPassantBos)){							en_passant_capturable_bos=posToBos([piece_rank, current_adjacent_file]);							pre_validated_arr_pos.push([current_diagonal_pawn_pos]);						}					}				}			}else{//knight, bishop, rook, queen				as_knight=(imp_val==KNIGHT);								for(i=0; i<2; i++){//0...1					for(j=(imp_val-3-i ? 8 : 0)+i; --j>0; ){//(x!=4): 8,6,4,2 (x!=3): 7,5,3,1 (else): 8,6,4,2,7,5,3,1						if((temp=temp_board.candidateMoves(piece_pos, j--, as_knight, null, true)).length){pre_validated_arr_pos.push(temp);}					}				}			}						for(i=0, len=pre_validated_arr_pos.length; i<len; i++){//0<len				for(j=0, len2=pre_validated_arr_pos[i].length; j<len2; j++){//0<len2					current_pos=pre_validated_arr_pos[i][j];										temp=temp_board[toBos(current_pos)];					temp2=temp_board[toBos(piece_pos)];					temp3=temp_board[en_passant_capturable_bos];										temp_board[toBos(current_pos)]=piece_val;					temp_board[toBos(piece_pos)]=EMPTY_SQR;										if(en_passant_capturable_bos && sameSqr(current_pos, temp_board.EnPassantBos)){						temp_board[en_passant_capturable_bos]=EMPTY_SQR;					}										if(!temp_board.countChecks((is_king ? current_pos : temp_board.Active.kingPos), true)){						rtn_validated_arr_pos.push(current_pos);					}										temp_board[toBos(current_pos)]=temp;					temp_board[toBos(piece_pos)]=temp2;					temp_board[en_passant_capturable_bos]=temp3;				}			}		}	}		return rtn_validated_arr_pos;};var _MoveCaller=function(initial_pos, final_pos){	var that, rtn_can_move;		that=this;	rtn_can_move=that.isLegalMove(initial_pos, final_pos);		if(rtn_can_move){		that.makeMove(initial_pos, final_pos);		that.refreshHTML(false);	}		return rtn_can_move;};var _MakeMove=function(initial_pos, final_pos){	var that, active_color, active_sign, active_color_king_rank, pawn_moved, promoted_val, piece_val, piece_abs_val, initial_bos, final_bos, active_color_rook, new_en_passant_bos, new_active_castling_availity, new_non_active_castling_availity, king_castled, non_en_passant_capture, to_promotion_rank, pgn_move;		that=this;		initial_bos=posToBos(initial_pos);	final_bos=posToBos(final_pos);		active_color=that.Active.isBlack;	active_sign=that.Active.sign;	active_color_rook=(active_sign*ROOK);		pawn_moved=false;	new_en_passant_bos="";	promoted_val=0;	king_castled=0;	non_en_passant_capture=that.getValue(final_pos);		new_active_castling_availity=(active_color ? that.BCastling : that.WCastling);	new_non_active_castling_availity=(active_color ? that.WCastling : that.BCastling);		to_promotion_rank=(final_pos[0]==(active_color ? 7 : 0));/*NO hacer (7-active_color_king_rank)*/	active_color_king_rank=(active_color ? 0 : 7);		piece_val=that.getValue(initial_pos);	piece_abs_val=(piece_val*active_sign);//same as Math.abs(piece_val)		if(piece_abs_val==KING){		if(new_active_castling_availity){/*NO useless if(Math.abs(initial_pos[1]-final_pos[1])>1)*/			new_active_castling_availity=0;						if(final_pos[1]==6){//short				king_castled=1;								that[toBos([active_color_king_rank, 5])]=active_color_rook;				that[toBos([active_color_king_rank, 7])]=EMPTY_SQR;			}else if(final_pos[1]==2){//long				king_castled=2;								that[toBos([active_color_king_rank, 3])]=active_color_rook;				that[toBos([active_color_king_rank, 0])]=EMPTY_SQR;			}		}	}else if(piece_abs_val==PAWN){		pawn_moved=true;				if(Math.abs(initial_pos[0]-final_pos[0])>1){//new enpass			new_en_passant_bos=(final_bos.charAt(0)+""+(active_color ? 6 : 3));		}else if(sameSqr(final_bos, that.EnPassantBos)){//pawn x enpass			that[toBos(final_bos.charAt(0)+""+(active_color ? 4 : 5))]=EMPTY_SQR;		}else if(to_promotion_rank){//promotion			promoted_val=(that.PromoteTo*active_sign);		}	}		pgn_move=that.getNotation(initial_bos, final_bos, piece_abs_val, promoted_val, king_castled, non_en_passant_capture);/*NO move below*/		that.HalfMove++;	if(pawn_moved || non_en_passant_capture){		that.HalfMove=0;	}		if(active_color){		that.FullMove++;	}		//test for rook move (original square)	if(new_active_castling_availity && piece_abs_val==ROOK && initial_pos[0]==active_color_king_rank){		if(initial_pos[1]==7 && new_active_castling_availity!=2){//short			new_active_castling_availity--;		}else if(initial_pos[1]==0 && new_active_castling_availity!=1){//long			new_active_castling_availity-=2;		}	}		//test for rook capture (original square)	if(new_non_active_castling_availity && non_en_passant_capture==-active_color_rook && to_promotion_rank){		if(final_pos[1]==7 && new_non_active_castling_availity!=2){//short			new_non_active_castling_availity--;		}else if(final_pos[1]==0 && new_non_active_castling_availity!=1){//long			new_non_active_castling_availity-=2;		}	}		that.WCastling=(active_color ? new_non_active_castling_availity : new_active_castling_availity);	that.BCastling=(active_color ? new_active_castling_availity : new_non_active_castling_availity);		that.EnPassantBos=new_en_passant_bos;/*NO move this up*/		that[toBos(final_pos)]=(promoted_val || piece_val);	that[toBos(initial_pos)]=EMPTY_SQR;		that.toggleActiveColor();		that.refreshKingPosChecksAndFen();		that.CurrentMove++;		if(that.CurrentMove!=that.MoveList.length){		that.MoveList=that.MoveList.slice(0, that.CurrentMove);/*or start a variation?*/	}		that.MoveList.push({Fen : that.Fen, PGNmove : (pgn_move+(that.Active.checks ? "+" : "")), FromBos : initial_bos, ToBos : final_bos});/*# with checkmate*/};var _GetNotation=function(initial_bos, final_bos, piece_abs_val, promoted_val, king_castled, non_en_passant_capture){	var i, j, len, that, temp, temp2, temp3, initial_file_char, final_pos, ambiguity, as_knight, rtn;		that=this;		rtn="";	initial_file_char=initial_bos.charAt(0);		if(king_castled){//castling king		rtn+=(king_castled!=1 ? "O-O-O" : "O-O");	}else if(piece_abs_val==PAWN){		if(initial_file_char!=final_bos.charAt(0)){			rtn+=(initial_file_char+"x");		}				rtn+=final_bos;				if(promoted_val){			rtn+=("="+pieceChar(promoted_val).toUpperCase());		}	}else{//knight, bishop, rook, queen, non-castling king		rtn+=pieceChar(piece_abs_val).toUpperCase();				if(piece_abs_val!=KING){//knight, bishop, rook, queen			temp2=[];			final_pos=bosToPos(final_bos);			as_knight=(piece_abs_val==KNIGHT);						for(i=0; i<2; i++){//0...1				for(j=(piece_abs_val-3-i ? 8 : 0)+i; --j>0; ){//(x!=4): 8,6,4,2 (x!=3): 7,5,3,1 (else): 8,6,4,2,7,5,3,1					if((temp=that.disambiguationPos(final_pos, j--, as_knight, piece_abs_val)).length){temp2.push(temp);}				}			}						len=temp2.length;			if(len>1){				temp3="";								for(i=0; i<len; i++){//0<len					if(!sameSqr(temp2[i], initial_bos) && that.isLegalMove(temp2[i], final_pos)){						temp3+=posToBos(temp2[i]);					}				}								if(temp3){					ambiguity=(strContains(temp3, initial_file_char)+(strContains(temp3, initial_bos.charAt(1))*2));										if(ambiguity!=1){//0,2,3						rtn+=initial_file_char;					}										if(ambiguity && ambiguity!=2){//1,3						rtn+=initial_bos.charAt(1);					}				}			}		}				if(non_en_passant_capture){			rtn+="x";		}				rtn+=final_bos;	}		return rtn;};/* aaaaaaaaaaaaaaaaaaaaaaaa function deleteBoard(obj){window[obj.BoardName]=null;} *///------------------------------------------------------function strContains(str, str_to_find){	return (str.indexOf(str_to_find)!=-1);}function countChars(str, char_list_to_count){	return (str.length-(str.replace(RegExp(char_list_to_count, "g"), "")).length);}function bosToPos(bos){	return [(8-(bos.charAt(1)*1)), "abcdefgh".indexOf(bos.charAt(0))];}function posToBos(pos){	return ("abcdefgh".charAt(pos[1])+""+(8-pos[0]));}function toBos(qos){	return ((typeof qos)==="string" ? qos : posToBos(qos));}function insideBoard(pos){	return ((pos[0]<=7 && pos[0]>=0) && (pos[1]<=7 && pos[1]>=0));}function sameSqr(qos1, qos2){	return (toBos(qos1)===toBos(qos2));}function castlingChars(val){	return ["", "k", "q", "kq"][val];}function pieceChar(val){	return ["*", "p", "n", "b", "r", "q", "k"][Math.abs(val)];}function getTbodyHTML(is_rotated){	var i, j, rtn;		rtn="<tbody>";		for(i=0; i<8; i++){//0...7		rtn+="<tr>";				for(j=0; j<8; j++){//0...7			rtn+="<td class='"+((i+j)%2 ? "b" : "w")+"s' id='"+posToBos(is_rotated ? [(7-i), (7-j)] : [i, j])+"'></td>";		}				rtn+="</tr>";	}		rtn+="</tbody>";		return rtn;}function preFenValidation(fen){	var i, j, len, temp, optional_clocks, last_is_num, current_is_num, fen_board_arr, piece_char, total_pieces, fen_board, total_files_in_current_row, keep_going, rtn_is_legal;		rtn_is_legal=false;		if(fen){		optional_clocks=fen.replace(/^([rnbqkRNBQK1-8]+\/)([rnbqkpRNBQKP1-8]+\/){6}([rnbqkRNBQK1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])($|\s)/, "");		keep_going=(fen.length!=optional_clocks.length);				if(keep_going){			if(optional_clocks.length){				keep_going=(/^(0|[1-9][0-9]*)\s([1-9][0-9]*)$/.test(optional_clocks));			}						if(keep_going){				fen_board=fen.split(" ")[0];				fen_board_arr=fen_board.split("/");								outer:				for(i=0; i<8; i++){//0...7					total_files_in_current_row=0;					last_is_num=false;										for(j=0, len=fen_board_arr[i].length; j<len; j++){//0<len						temp=(fen_board_arr[i].charAt(j)*1);						current_is_num=!!temp;												if(last_is_num && current_is_num){							keep_going=false;							break outer;						}												last_is_num=current_is_num;												total_files_in_current_row+=(temp || 1);					}										if(total_files_in_current_row!=8){						keep_going=false;						break;					}				}								if(keep_going){					for(i=0; i<2; i++){//0...1						total_pieces=new Array(6);												for(j=0; j<6; j++){//0...5							piece_char=pieceChar(j+1);							total_pieces[j]=countChars(fen_board, (i ? piece_char.toUpperCase() : piece_char));						}												if((total_pieces[5]!=1) || (total_pieces[0]>8) || ((Math.max(total_pieces[1]-2, 0)+Math.max(total_pieces[2]-2, 0)+Math.max(total_pieces[3]-2, 0)+Math.max(total_pieces[4]-1, 0))>(8-total_pieces[0]))){							keep_going=false;							break;						}					}										rtn_is_legal=keep_going;				}			}		}	}		return rtn_is_legal;}function initBoard(board_name, fen, rotate_board, is_hidden){	var new_board;		new_board=window[board_name]=new nullBoard(board_name);		fen=((typeof fen)==="string" ? fen.replace(/^\s+|\s+$/g, "").replace(/\s\s+/g, " ") : "");		if(!preFenValidation(fen)){		fen=DEFAULT_FEN;	}		new_board.readFen(fen);	new_board.firstTimeDefaults(is_hidden, rotate_board);		if(!new_board.postFenValidation()){		new_board.readFen(DEFAULT_FEN);		new_board.firstTimeDefaults(is_hidden, rotate_board);	}		new_board.refreshHTML(true);		return new_board;}function nullBoard(board_name){	var i, j, that;		that=this;	that.BoardName=board_name;		that.getValue=_GetValue;	that.countChecks=_CountChecks;	that.toggleActiveColor=_ToggleActiveColor;	that.isLegalMove=_IsLegalMove;	that.toggleIsRotated=_ToggleIsRotated;	that.setPromoteTo=_SetPromoteTo;	that.setCurrentMove=_SetCurrentMove;	that.giveSquareMovement=_GiveSquareMovement;	that.appendChessBoardHTML=_AppendChessBoardHTML;	that.resetPieceClasses=_ResetPieceClasses;	that.getMoveListHTML=_GetMoveListHTML;	that.getObjInfoHTML=_GetObjInfoHTML;	that.refreshHTML=_RefreshHTML;	that.firstTimeDefaults=_FirstTimeDefaults;	that.parseValuesFromFEN=_ParseValuesFromFEN;	that.readFen=_ReadFen;	that.refreshKingPosChecksAndFen=_RefreshKingPosChecksAndFen;	that.postFenValidation=_PostFenValidation;	that.candidateMoves=_CandidateMoves;	that.isAttacked=_IsAttacked;	that.disambiguationPos=_DisambiguationPos;	that.testCollision=_TestCollision;	that.legalMoves=_LegalMoves;	that.moveCaller=_MoveCaller;	that.makeMove=_MakeMove;	that.getNotation=_GetNotation;		that.Active={		isBlack : null,		sign : null,		kingPos : null,		checks : null	};		that.NonActive={		isBlack : null,		sign : null,		kingPos : null		//checks	};		that.Fen=null;	that.WCastling=null;	that.BCastling=null;	that.EnPassantBos=null;	that.HalfMove=null;	that.FullMove=null;	that.InitialFullMove=null;	that.MoveList=null;	that.CurrentMove=null;	that.IsRotated=null;	that.PromoteTo=null;	that.FromSquare=null;	that.IsHidden=null;		for(i=0; i<8; i++){		for(j=0; j<8; j++){			that[posToBos([i, j])]=null;		}	}}function cloneBoard(baseObj){	var i, j, that, temp;		that=this;	that.BoardName=(baseObj.BoardName+"_copy");		that.getValue=baseObj.getValue;	that.countChecks=baseObj.countChecks;	that.toggleActiveColor=baseObj.toggleActiveColor;	that.isLegalMove=baseObj.isLegalMove;	that.toggleIsRotated=baseObj.toggleIsRotated;	that.setPromoteTo=baseObj.setPromoteTo;	that.setCurrentMove=baseObj.setCurrentMove;	that.giveSquareMovement=baseObj.giveSquareMovement;	that.appendChessBoardHTML=baseObj.appendChessBoardHTML;	that.resetPieceClasses=baseObj.resetPieceClasses;	that.getMoveListHTML=baseObj.getMoveListHTML;	that.getObjInfoHTML=baseObj.getObjInfoHTML;	that.refreshHTML=baseObj.refreshHTML;	that.firstTimeDefaults=baseObj.firstTimeDefaults;	that.parseValuesFromFEN=baseObj.parseValuesFromFEN;	that.readFen=baseObj.readFen;	that.refreshKingPosChecksAndFen=baseObj.refreshKingPosChecksAndFen;	that.postFenValidation=baseObj.postFenValidation;	that.candidateMoves=baseObj.candidateMoves;	that.isAttacked=baseObj.isAttacked;	that.disambiguationPos=baseObj.disambiguationPos;	that.testCollision=baseObj.testCollision;	that.legalMoves=baseObj.legalMoves;	that.moveCaller=baseObj.moveCaller;	that.makeMove=baseObj.makeMove;	that.getNotation=baseObj.getNotation;		that.Active=JSON.parse(JSON.stringify(baseObj.Active));	that.NonActive=JSON.parse(JSON.stringify(baseObj.NonActive));	that.Fen=baseObj.Fen;	that.WCastling=baseObj.WCastling;	that.BCastling=baseObj.BCastling;	that.EnPassantBos=baseObj.EnPassantBos;	that.HalfMove=baseObj.HalfMove;	that.FullMove=baseObj.FullMove;	that.InitialFullMove=baseObj.InitialFullMove;	that.MoveList=JSON.parse(JSON.stringify(baseObj.MoveList));	that.CurrentMove=baseObj.CurrentMove;	that.IsRotated=baseObj.IsRotated;	that.PromoteTo=baseObj.PromoteTo;	that.FromSquare=baseObj.FromSquare;	that.IsHidden=baseObj.IsHidden;		for(i=0; i<8; i++){		for(j=0; j<8; j++){			temp=posToBos([i, j]);						that[temp]=baseObj[temp];		}	}}