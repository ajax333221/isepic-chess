/** Copyright (c) 2012 Ajax Isepic (ajax333221) Licensed MIT */

/*jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:true, curly:true, es3:true, latedef:nofunc, bitwise:false, sub:true */

(function(win, $){
	var IsepicChess=(function(){
		var _next_board_id=0;
		var _boards=Object.create(null);
		
		var _EMPTY_SQR=0;
		var _PAWN=1;
		var _KNIGHT=2;
		var _BISHOP=3;
		var _ROOK=4;
		var _QUEEN=5;
		var _KING=6;
		var _WHITE_SIGN=1;
		var _BLACK_SIGN=-1;
		var _DEFAULT_FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		
		//---------------- utilities
		
		function _strContains(str, str_to_find){
			return (str.indexOf(str_to_find)!==-1);
		}
		
		function _occurrences(str, str_rgxp){
			var rtn;
			
			rtn=0;
			
			if(typeof str==="string" && typeof str_rgxp==="string" && str_rgxp!==""){
				rtn=(str.match(RegExp(str_rgxp, "g")) || []).length;
			}
			
			return rtn;
		}
		
		function _castlingChars(val){
			return ["", "k", "q", "kq"][val];
		}
		
		function _pieceChar(val){
			return ["*", "p", "n", "b", "r", "q", "k"][Math.abs(val)];
		}
		
		function _getBoardTabsHTML(current_board){
			var i, len, board, board_name, board_list, rtn;
			
			board_list=getBoardNames();
			rtn="<strong>Board list:</strong> ";
			
			for(i=0, len=board_list.length; i<len; i++){
				rtn+=(i ? " | " : "");
				
				board_name=board_list[i];
				board=selectBoard(board_name);
				
				if(board!==null){
					if(board.IsHidden){
						rtn+="<em class='redColor'>"+board_name+"</em>";
					}else if(board_name===current_board){
						rtn+="<em>"+board_name+"</em>";
					}else{
						rtn+="<a class='changeboard' data-target='"+board_name+"' href='#'>"+board_name+"</a>";
					}
				}else{
					console.log("Warning[_getBoardTabsHTML]: \""+board_name+"\" is not defined");
				}
			}
			
			return rtn;
		}
		
		function _getTableHTML(is_rotated){
			var i, j, rank_char, file_char, rtn;
			
			file_char="<td class='label'></td><td class='label'>"+(is_rotated ? "hgfedcba" : "abcdefgh").split("").join("</td><td class='label'>")+"</td>";
			rtn="<table class='"+("tableb"+(is_rotated ? " rotated" : ""))+"' cellpadding='0' cellspacing='0'>";
			rtn+="<tr>"+file_char+"<td class='"+("label dot "+(is_rotated ? "w" : "b")+"side")+"'>◘</td></tr>";
			
			for(i=0; i<8; i++){//0...7
				rank_char=(is_rotated ? (i+1) : (8-i));
				rtn+="<tr><td class='label'>"+rank_char+"</td>";
				
				for(j=0; j<8; j++){//0...7
					rtn+="<td class='"+(((i+j)%2 ? "b" : "w")+"s")+"' id='"+toBos(is_rotated ? [(7-i), (7-j)] : [i, j])+"'></td>";
				}
				
				rtn+="<td class='label'>"+rank_char+"</td></tr>";
			}
			
			rtn+="<tr>"+file_char+"<td class='"+("label dot "+(is_rotated ? "b" : "w")+"side")+"'>◘</td></tr>";
			rtn+="</table>";
			
			return rtn;
		}
		
		function _basicFenTest(fen){
			var i, j, len, temp, optional_clocks, last_is_num, current_is_num, fen_board_arr, piece_char, total_pieces, fen_board, total_files_in_current_rank, error_msg;
			
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
					total_pieces=new Array(6);
					
					for(j=0; j<6; j++){//0...5
						piece_char=_pieceChar(j+1);
						total_pieces[j]=_occurrences(fen_board, (i ? piece_char.toUpperCase() : piece_char));
					}
					
					if(total_pieces[5]!==1){
						error_msg="Error [5] board without exactly one "+(i ? "white" : "black")+" king";
					}else if(total_pieces[0]>8){
						error_msg="Error [6] more than 8 "+(i ? "white" : "black")+" pawns";
					}else if((Math.max(total_pieces[1]-2, 0)+Math.max(total_pieces[2]-2, 0)+Math.max(total_pieces[3]-2, 0)+Math.max(total_pieces[4]-1, 0))>(8-total_pieces[0])){
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
			
			return that[toBos(qos)];
		}
		
		function _countChecks(king_qos, early_break){
			var i, j, that, as_knight, rtn_total_checks;
			
			that=this;
			rtn_total_checks=0;
			
			outer:
			for(i=0; i<2; i++){//0...1
				as_knight=!!i;
				
				for(j=1; j<9; j++){//1...8
					if(that.isAttacked(king_qos, j, as_knight)){
						rtn_total_checks++;
						
						if(early_break){
							break outer;
						}
					}
				}
			}
			
			return rtn_total_checks;
		}
		
		function _toggleActiveColor(){
			var temp, that;
			
			that=this;
			temp=that.Active.isBlack;
			
			that.Active.isBlack=!temp;
			that.NonActive.isBlack=temp;
			that.Active.sign=(temp ? _WHITE_SIGN : _BLACK_SIGN);
			that.NonActive.sign=(temp ? _BLACK_SIGN : _WHITE_SIGN);
			
			/*NO hace King Pos refresh, eso lo hace refreshKingPosChecksAndFen()*/
		}
		
		function _toggleIsRotated(){
			var that;
			
			that=this;
			that.IsRotated=!that.IsRotated;
		}
		
		function _setPromoteTo(abs_val){
			var that;
			
			that=this;
			that.PromoteTo=abs_val;
		}
		
		function _setCurrentMove(val, is_goto){
			var len, that, temp, rtn_moved;
			
			that=this;
			rtn_moved=false;
			len=that.MoveList.length;
			
			if(len>1){
				temp=Math.min(Math.max((is_goto ? val : (val+that.CurrentMove)), 0), (len-1));
				
				if(temp!==that.CurrentMove){
					rtn_moved=true;
					
					that.CurrentMove=temp;
					that.readFen(that.MoveList[temp].Fen);
				}
			}
			
			return rtn_moved;
		}
		
		function _giveSquareMovement(){
			var that;
			
			that=this;
			that.FromSquare="";
			
			$(".ws, .bs").unbind("click").click(function(){
				var i, len, temp, need_highlight, legal_moves;
				
				if(!that.IsHidden){
					need_highlight=true;
					
					if(that.FromSquare){
						$(".highlight").removeClass("highlight");
						$(".currpiece").removeClass("currpiece");
						need_highlight=false;
						
						temp=that.FromSquare;
						that.FromSquare="";
						
						if(that.moveCaller(temp, this.id)){
							that.refreshBoard();
						}else{
							that.giveSquareMovement();
							
							if(!sameSqr(temp, this.id)){
								need_highlight=true;
							}
						}
					}
					
					if(need_highlight){
						legal_moves=legalMoves(that.Fen, this.id);
						len=legal_moves.length;
						
						if(len){
							that.FromSquare=this.id;
							$(this).addClass("currpiece");
							
							for(i=0; i<len; i++){//0<len
								$("#"+toBos(legal_moves[i])).addClass("highlight");
							}
						}
					}
					
					$("#xobjinfo").html(that.getObjInfoHTML());
				}
			});
		}
		
		function _resetPieceClasses(){
			var i, j, that, temp, new_class, current_pos;
			
			that=this;
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					current_pos=(that.IsRotated ? [(7-i), (7-j)] : [i, j]);
					temp=that.getValue(current_pos);
					
					new_class=(((i+j)%2 ? "b" : "w")+"s"+(temp ? ((temp<0 ? " b" : " w")+_pieceChar(temp)) : ""));
					$("#"+toBos(current_pos)).attr("class", new_class);
				}
			}
		}
		
		function _getMoveListHTML(){
			var i, len, that, move_list, black_starts, rtn;
			
			that=this;
			move_list=that.MoveList;
			black_starts=_strContains(move_list[0].Fen, " b ");
			
			rtn="";
			
			for(i=1, len=move_list.length; i<len; i++){//1<len
				rtn+=(i!==1 ? " " : "")+((black_starts*1)!==(i%2) ? ("<span class='xpgn_number'>"+(that.InitialFullMove+Math.floor((i+black_starts-1)/2))+".</span>") : "")+"<span id='"+("xpgn"+i)+"' class='"+("xpgn_"+(i!==that.CurrentMove ? "goto" : "active"))+"'>"+move_list[i].PGNmove+"</span>";
			}
			
			if(black_starts && rtn!==""){
				rtn="<span class='xpgn_number'>"+that.InitialFullMove+"...</span>"+rtn;
			}
			
			return rtn;
		}
		
		function _getObjInfoHTML(){
			var that, rtn;
			
			that=this;
			
			rtn="<strong>board_name:</strong> "+that.BoardName;
			rtn+="<br><strong>board_is_rotated:</strong> "+that.IsRotated;
			rtn+="<br><strong>en_passant:</strong> "+(that.EnPassantBos ? that.EnPassantBos : "-");
			rtn+="<br><strong>active_color:</strong> "+(that.Active.isBlack ? "black" : "white");
			rtn+="<br><strong>active_king_checks:</strong> "+that.Active.checks;
			rtn+="<br><strong>active_king_pos:</strong> "+toBos(that.Active.kingPos);
			rtn+="<br><strong>non_active_king_pos:</strong> "+toBos(that.NonActive.kingPos);
			rtn+="<br><strong>white_castling:</strong> "+(_castlingChars(that.WCastling).toUpperCase() || "-");
			rtn+="<br><strong>black_castling:</strong> "+(_castlingChars(that.BCastling) || "-");
			rtn+="<br><strong>half_moves:</strong> "+that.HalfMove;
			rtn+="<br><strong>full_moves:</strong> "+that.FullMove;
			rtn+="<br><strong>current_move:</strong> "+that.CurrentMove;
			rtn+="<br><strong>initial_fullmove:</strong> "+that.InitialFullMove;
			rtn+="<br><strong>promote_to:</strong> "+(that.Active.isBlack ? _pieceChar(that.PromoteTo) : _pieceChar(that.PromoteTo).toUpperCase());
			rtn+="<br><strong>from_square:</strong> "+(that.FromSquare ? that.FromSquare : "-");
			
			return rtn;
		}
		
		function _refreshBoard(){
			var that, is_new_html;
			
			that=this;
			
			if(!that.IsHidden){
				is_new_html=!$("#xchessboard").length;
				
				if(is_new_html){
					$("body").append("<div id='xchessboard'><h3 class='inlineb'>Isepic-Chess.js » Demo <a href='https://github.com/ajax333221/Isepic-Chess'>View on GitHub</a></h3><div id='xboard'></div><div id='xcontrols'><input id='xfen' value='' type='text'><br><input id='xnav_first' value='|<' type='button'> <input id='xnav_previous' value='<' type='button'> <input id='xnav_next' value='>' type='button'> <input id='xnav_last' value='>|' type='button'><input id='xrotate' value='rotate' type='button'><select id='xpromote'><option value='5' selected='selected'>queen</option><option value='4'>rook</option><option value='3'>bishop</option><option value='2'>knight</option></select><hr><p id='xtabs'></p><p id='xmovelist'></p></div><div id='xinfoholder'><a id='xdebug_toggle' href='#'>Debug ▲</a><p id='xobjinfo' style='display:none'></p></div></div>");
					
					$("#xfen").click(function(){
						$(this).select();
					});
					
					$("#xdebug_toggle").click(function(){
						$(this).text("Debug "+($("#xobjinfo").is(":visible") ? "▲" : "▼"));
						$("#xobjinfo").toggle();
						return false;
					});
				}
				
				if(is_new_html || $("#xboard .tableb").hasClass("rotated")!==that.IsRotated){
					$("#xboard").html(_getTableHTML(that.IsRotated));
				}
				
				$("#xtabs").html(_getBoardTabsHTML(that.BoardName));
				
				$(".changeboard").unbind("click").click(function(){
					var board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board_name=$(this).attr("data-target");
						board=selectBoard(board_name);
						
						if(board===null){
							no_errors=false;
							console.log("Error[.changeboard]: \""+board_name+"\" is not defined");
						}
					//}
					
					if(no_errors){
						board.refreshBoard();
					}
					
					return false;
				});
				
				/*enves de siempre unbind(), solo hacerlo si el board es diferente (cuidado no doble al mismo tampoco)*/
				/*nota, cada refresh se hace el unbind y bind a los de ID, muy mal eso*/
				
				$("#xnav_first").unbind("click").click(function(){
					if(that.setCurrentMove(0, true)){
						that.refreshBoard();
					}
				});
				
				$("#xnav_previous").unbind("click").click(function(){
					if(that.setCurrentMove(-1, false)){
						that.refreshBoard();
					}
				});
				
				$("#xnav_next").unbind("click").click(function(){
					if(that.setCurrentMove(1, false)){
						that.refreshBoard();
					}
				});
				
				$("#xnav_last").unbind("click").click(function(){
					if(that.setCurrentMove(10000, true)){
						that.refreshBoard();
					}
				});
				
				$("#xrotate").unbind("click").click(function(){
					that.toggleIsRotated();
					that.refreshBoard();
				});
				
				$("#xpromote").unbind("change").change(function(){
					that.setPromoteTo($(this).val()*1);
					$("#xobjinfo").html(that.getObjInfoHTML());
				});
				
				that.resetPieceClasses();
				
				$(".wside, .bside").removeClass("w_color b_color");
				$("."+(that.Active.isBlack ? "b" : "w")+"side").addClass((that.Active.isBlack ? "b" : "w")+"_color");
				
				$("#xmovelist").html(that.getMoveListHTML() || "...");
				
				$(".xpgn_goto").unbind("click").click(function(){
					if(that.setCurrentMove((this.id.substring(4)*1), true)){
						that.refreshBoard();
					}
				});
				
				$("#xfen").val(that.Fen);
				
				if(that.CurrentMove!==0){
					$("#"+that.MoveList[that.CurrentMove].FromBos).addClass("lastmove");
					$("#"+that.MoveList[that.CurrentMove].ToBos).addClass("lastmove");
				}
				
				that.giveSquareMovement();
				
				$("#xobjinfo").html(that.getObjInfoHTML());
			}
		}
		
		function _firstTimeDefaults(is_hidden, rotate_board){
			var that;
			
			that=this;
			
			that.InitialFullMove=that.FullMove;
			that.MoveList=[{Fen : that.Fen, PGNmove : "", FromBos : "", ToBos : ""}];
			that.CurrentMove=0;
			that.PromoteTo=_QUEEN;
			that.IsRotated=!!rotate_board;
			that.IsHidden=!!is_hidden;
		}
		
		function _parseValuesFromFen(fenb){
			var i, j, len, that, temp, current_file, skip_files, piece_char;
			
			that=this;
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					that[toBos([i, j])]=_EMPTY_SQR;
				}
			}
			
			fenb=fenb.split("/");
			
			for(i=0; i<8; i++){//0...7
				current_file=0;
				
				for(j=0, len=fenb[i].length; j<len; j++){//0<len
					temp=fenb[i].charAt(j);
					skip_files=(temp*1);
					
					if(!skip_files){
						piece_char=temp.toLowerCase();
						that[toBos([i, current_file])]="*pnbrqk".indexOf(piece_char)*(temp===piece_char ? _BLACK_SIGN : _WHITE_SIGN);
					}
					
					current_file+=(skip_files || 1);
				}
			}
		}
		
		function _readFen(fen){
			var that, temp, fen_parts;
			
			that=this;
			fen_parts=fen.split(" ");
			
			that.parseValuesFromFen(fen_parts[0]);
			
			temp=(fen_parts[1]==="b");
			that.Active.isBlack=temp;
			that.NonActive.isBlack=!temp;
			that.Active.sign=(temp ? _BLACK_SIGN : _WHITE_SIGN);
			that.NonActive.sign=(temp ? _WHITE_SIGN : _BLACK_SIGN);
			
			that.WCastling=(_strContains(fen_parts[2], "K") ? 1 : 0)+(_strContains(fen_parts[2], "Q") ? 2 : 0);
			that.BCastling=(_strContains(fen_parts[2], "k") ? 1 : 0)+(_strContains(fen_parts[2], "q") ? 2 : 0);
			
			that.EnPassantBos=fen_parts[3].replace("-", "");
			
			that.HalfMove=((fen_parts[4]*1) || 0);
			that.FullMove=((fen_parts[5]*1) || 1);
			
			that.refreshKingPosChecksAndFen();
		}
		
		function _refreshKingPosChecksAndFen(){
			var i, j, that, piece_char, current_pos, current_val, empty_consecutive_squares, new_fen_board, current_is_black;
			
			that=this;
			new_fen_board="";
			
			for(i=0; i<8; i++){//0...7
				empty_consecutive_squares=0;
				
				for(j=0; j<8; j++){//0...7
					current_pos=[i, j];
					current_val=that.getValue(current_pos);
					
					if(current_val){
						current_is_black=(current_val<0);
						
						//if((current_val*(current_is_black ? _BLACK_SIGN : _WHITE_SIGN))===_KING){
						if((current_is_black ? -current_val : current_val)===_KING){
							if(that.Active.isBlack===current_is_black){
								that.Active.kingPos=current_pos;
							}else{
								that.NonActive.kingPos=current_pos;
							}
						}
						
						piece_char=_pieceChar(current_val);
						new_fen_board+=(empty_consecutive_squares || "")+(current_is_black ? piece_char : piece_char.toUpperCase());
						
						empty_consecutive_squares=-1;
					}
					
					empty_consecutive_squares++;
				}
				
				new_fen_board+=(empty_consecutive_squares || "")+(i!==7 ? "/" : "");
			}
			
			that.Active.checks=that.countChecks(that.Active.kingPos, false);
			
			that.Fen=(new_fen_board+" "+(that.Active.isBlack ? "b" : "w")+" "+((_castlingChars(that.WCastling).toUpperCase()+""+_castlingChars(that.BCastling)) || "-")+" "+(that.EnPassantBos || "-")+" "+that.HalfMove+" "+that.FullMove);
		}
		
		function _refinedFenTest(){
			var i, j, k, that, temp, temp2, current_sign, keep_going, current_castling_availity, current_king_rank, en_passant_rank, en_passant_file, fen_board, total_pawns_in_current_file, min_captured, min_captured_holder, error_msg;
			
			error_msg="";
			
			//if(!error_msg){
				that=this;
				
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
				that.toggleActiveColor();
				
				if(that.countChecks(that.NonActive.kingPos, true)){
					error_msg="Error [2] non-active king in check";
				}
				
				that.toggleActiveColor();
			}
			
			if(!error_msg){
				if(that.EnPassantBos){
					temp=that.NonActive.sign;//(that.Active.isBlack ? _WHITE_SIGN : _BLACK_SIGN)
					
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
						temp2="";
						
						for(k=0; k<8; k++){//0...7
							temp2+="#"+(that.getValue([k, j]) || "");
						}
						
						total_pawns_in_current_file=_occurrences(temp2, (i ? "#-1" : "#1"));
						
						if(total_pawns_in_current_file>1){
							min_captured+=min_captured_holder[total_pawns_in_current_file-2];
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
					current_castling_availity=(i ? that.WCastling : that.BCastling);
					
					if(current_castling_availity){
						current_sign=(i ? _WHITE_SIGN : _BLACK_SIGN);
						current_king_rank=(i ? 7 : 0);
						
						if(that.getValue([current_king_rank, 4])!==(current_sign*_KING)){
							error_msg="Error [5] "+(i ? "white" : "black")+" castling ability without king in original position";
						}else if(current_castling_availity!==2 && that.getValue([current_king_rank, 7])!==(current_sign*_ROOK)){
							error_msg="Error [6] "+(i ? "white" : "black")+" short castling ability with missing H-file rook";
						}else if(current_castling_availity!==1 && that.getValue([current_king_rank, 0])!==(current_sign*_ROOK)){
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
		
		function _candidateMoves(initial_qos, piece_direction, as_knight, total_squares, allow_capture){
			var that;
			
			that=this;
			
			return that.testCollision(1, initial_qos, piece_direction, as_knight, total_squares, allow_capture, null);
		}
		
		function _isAttacked(initial_qos, piece_direction, as_knight){
			var that;
			
			that=this;
			
			return that.testCollision(2, initial_qos, piece_direction, as_knight, null, null, null);
		}
		
		function _disambiguationPos(initial_qos, piece_direction, as_knight, ally_abs_val){
			var that;
			
			that=this;
			
			return that.testCollision(3, initial_qos, piece_direction, as_knight, null, null, ally_abs_val);
		}
		
		function _testCollision(op, initial_qos, piece_direction, as_knight, total_squares, allow_capture, ally_abs_val){
			var i, that, current_pos, current_val, current_imp_val, rank_change, file_change, rtn;
			
			that=this;
			
			rank_change=(as_knight ? [-2, -1, 1, 2, 2, 1, -1, -2] : [-1, -1, 0, 1, 1, 1, 0, -1])[piece_direction-1];
			file_change=(as_knight ? [1, 2, 2, 1, -1, -2, -2, -1] : [0, 1, 1, 1, 0, -1, -1, -1])[piece_direction-1];
			total_squares=(as_knight ? 1 : (total_squares || 7));/*NO use math max 7, even if 999 the loop breaks on outside board*/
			
			rtn=(op===2 ? false : []);
			
			for(i=0; i<total_squares; i++){//0<total_squares
				current_pos=[(getRankPos(initial_qos)+(rank_change*(i+1))), (getFilePos(initial_qos)+(file_change*(i+1)))];
				
				if(!isInsideBoard(current_pos)){
					break;
				}
				
				current_val=that.getValue(current_pos);
				
				if(current_val){
					current_imp_val=(current_val*that.NonActive.sign);//(current_val*(that.Active.isBlack ? _WHITE_SIGN : _BLACK_SIGN)) -> (that.Active.isBlack ? current_val : -current_val)
					
					if(current_imp_val>0){
						if(op===1){
							if(allow_capture && current_imp_val!==_KING){
								rtn.push(current_pos);
							}
						}else if(op===2){
							if(as_knight){
								if(current_imp_val===_KNIGHT){
									rtn=true;
								}
							}else if(current_imp_val===_KING){
								if(!i){
									rtn=true;
								}
							}else if(current_imp_val===_QUEEN){
								rtn=true;
							}else if(piece_direction%2){
								if(current_imp_val==_ROOK){
									rtn=true;
								}
							}else if(current_imp_val===_BISHOP){
								rtn=true;
							}else if(!i && current_imp_val===_PAWN){
								if(current_val===_PAWN){//white pawn
									if(piece_direction===4 || piece_direction===6){
										rtn=true;
									}
								}else{//black pawn
									/*NO merge in a single else if, the minimizer will do this*/
									if(piece_direction===2 || piece_direction===8){
										rtn=true;
									}
								}
							}
						}
					}else if(op===3){
						if(ally_abs_val===-current_imp_val){
							rtn=current_pos;
						}
					}
					
					break;
				}
				
				if(op===1){
					rtn.push(current_pos);/*NO move this up (por lo del break)*/
				}
			}
			
			return rtn;
		}
		
		function _moveCaller(initial_qos, final_qos){
			var that, rtn_can_move;
			
			that=this;
			rtn_can_move=isLegalMove(that.Fen, initial_qos, final_qos);
			
			if(rtn_can_move){
				that.makeMove(initial_qos, final_qos);
			}
			
			return rtn_can_move;
		}
		
		function _makeMove(initial_qos, final_qos){
			var that, active_color, active_sign, active_color_king_rank, pawn_moved, promoted_val, piece_val, piece_abs_val, active_color_rook, new_en_passant_bos, new_active_castling_availity, new_non_active_castling_availity, king_castled, non_en_passant_capture, to_promotion_rank, pgn_move;
			
			that=this;
			
			active_color=that.Active.isBlack;
			active_sign=that.Active.sign;
			active_color_rook=(active_sign*_ROOK);
			
			pawn_moved=false;
			new_en_passant_bos="";
			promoted_val=0;
			king_castled=0;
			non_en_passant_capture=that.getValue(final_qos);
			
			new_active_castling_availity=(active_color ? that.BCastling : that.WCastling);
			new_non_active_castling_availity=(active_color ? that.WCastling : that.BCastling);
			
			to_promotion_rank=(getRankPos(final_qos)===(active_color ? 7 : 0));/*NO hacer (7-active_color_king_rank)*/
			active_color_king_rank=(active_color ? 0 : 7);
			
			piece_val=that.getValue(initial_qos);
			piece_abs_val=(piece_val*active_sign);//same as Math.abs(piece_val)
			
			if(piece_abs_val===_KING){
				if(new_active_castling_availity){/*NO useless if(Math.abs(getFilePos(initial_qos)-getFilePos(final_qos))>1)*/
					new_active_castling_availity=0;
					
					if(getFilePos(final_qos)===6){//short
						king_castled=1;
						
						that[toBos([active_color_king_rank, 5])]=active_color_rook;
						that[toBos([active_color_king_rank, 7])]=_EMPTY_SQR;
					}else if(getFilePos(final_qos)===2){//long
						king_castled=2;
						
						that[toBos([active_color_king_rank, 3])]=active_color_rook;
						that[toBos([active_color_king_rank, 0])]=_EMPTY_SQR;
					}
				}
			}else if(piece_abs_val===_PAWN){
				pawn_moved=true;
				
				if(Math.abs(getRankPos(initial_qos)-getRankPos(final_qos))>1){//new enpass
					new_en_passant_bos=(getFileBos(final_qos)+""+(active_color ? 6 : 3));
				}else if(sameSqr(final_qos, that.EnPassantBos)){//pawn x enpass
					that[(getFileBos(final_qos)+""+(active_color ? 4 : 5))]=_EMPTY_SQR;
				}else if(to_promotion_rank){//promotion
					promoted_val=(that.PromoteTo*active_sign);
				}
			}
			
			pgn_move=that.getNotation(initial_qos, final_qos, piece_abs_val, promoted_val, king_castled, non_en_passant_capture);/*NO move below*/
			
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
			
			that.EnPassantBos=new_en_passant_bos;/*NO move this up*/
			
			that[toBos(final_qos)]=(promoted_val || piece_val);
			that[toBos(initial_qos)]=_EMPTY_SQR;
			
			that.toggleActiveColor();
			
			that.refreshKingPosChecksAndFen();
			
			that.CurrentMove++;
			
			if(that.CurrentMove!==that.MoveList.length){
				that.MoveList=that.MoveList.slice(0, that.CurrentMove);/*mejor start variation*/
			}
			
			that.MoveList.push({Fen : that.Fen, PGNmove : (pgn_move+(that.Active.checks ? "+" : "")), FromBos : toBos(initial_qos), ToBos : toBos(final_qos)});/*# with checkmate*/
		}
		
		function _getNotation(initial_qos, final_qos, piece_abs_val, promoted_val, king_castled, non_en_passant_capture){
			var i, j, len, that, temp, temp2, temp3, initial_file_char, ambiguity, as_knight, rtn;
			
			that=this;
			
			rtn="";
			initial_file_char=getFileBos(initial_qos);
			
			if(king_castled){//castling king
				rtn+=(king_castled!==1 ? "O-O-O" : "O-O");
			}else if(piece_abs_val===_PAWN){
				if(initial_file_char!==getFileBos(final_qos)){
					rtn+=(initial_file_char+"x");
				}
				
				rtn+=toBos(final_qos);
				
				if(promoted_val){
					rtn+="="+_pieceChar(promoted_val).toUpperCase();
				}
			}else{//knight, bishop, rook, queen, non-castling king
				rtn+=_pieceChar(piece_abs_val).toUpperCase();
				
				if(piece_abs_val!==_KING){//knight, bishop, rook, queen
					temp2=[];
					as_knight=(piece_abs_val===_KNIGHT);
					
					for(i=0; i<2; i++){//0...1
						for(j=(piece_abs_val-3-i ? 8 : 0)+i; --j>0; ){//(x!==4): 8,6,4,2 (x!==3): 7,5,3,1 (else): 8,6,4,2,7,5,3,1
							if((temp=that.disambiguationPos(final_qos, j--, as_knight, piece_abs_val)).length){temp2.push(temp);}
						}
					}
					
					len=temp2.length;
					if(len>1){
						temp3="";
						
						for(i=0; i<len; i++){//0<len
							if(!sameSqr(temp2[i], initial_qos) && isLegalMove(that.Fen, temp2[i], final_qos)){
								temp3+=toBos(temp2[i]);
							}
						}
						
						if(temp3){
							ambiguity=(_strContains(temp3, initial_file_char)+(_strContains(temp3, getRankBos(initial_qos))*2));
							
							if(ambiguity!==1){//0,2,3
								rtn+=initial_file_char;
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
		}
		
		//---------------- ic
		
		function boardExists(board_name){
			return (typeof _boards[board_name]!=="undefined");
		}
		
		function selectBoard(board_name){
			var no_errors, rtn;
			
			no_errors=true;
			
			//if(no_errors){
				rtn=null;
				
				if(!boardExists(board_name)){
					no_errors=false;
					console.log("Error[selectBoard]: \""+board_name+"\" is not defined");
				}
			//}
			
			if(no_errors){
				rtn=_boards[board_name];
			}
			
			return rtn;
		}
		
		function toBos(qos){
			return ((typeof qos)==="string" ? qos.toLowerCase() : ("abcdefgh".charAt(getFilePos(qos))+""+(8-getRankPos(qos))));
		}
		
		function toPos(qos){
			return ((typeof qos)==="string" ? [(8-(getRankBos(qos)*1)), "abcdefgh".indexOf(getFileBos(qos))] : qos);
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
			return ((toBos(toPos(qos))===toBos(qos)) && (getRankPos(qos)<=7 && getRankPos(qos)>=0) && (getFilePos(qos)<=7 && getFilePos(qos)>=0));
		}
		
		function sameSqr(qos1, qos2){
			return (toBos(qos1)===toBos(qos2));
		}
		
		function removeBoard(board_name){
			var no_errors;
			
			no_errors=true;
			
			//if(no_errors){
				if(!boardExists(board_name)){
					no_errors=false;
					console.log("Error[removeBoard]: \""+board_name+"\" is not defined");
				}
			//}
			
			if(no_errors){
				delete _boards[board_name];
			}
			
			return no_errors;
		}
		
		function legalMoves(fen, piece_qos){
			var i, j, len, len2, temp, temp2, temp3, board, active_color, non_active_sign, current_adjacent_file, piece_val, imp_val, current_pos, current_diagonal_pawn_pos, pre_validated_arr_pos, can_castle_current_side, active_color_king_rank, is_king, as_knight, en_passant_capturable_bos, piece_rank, active_castling_availity, board_created, no_errors, rtn;
			
			no_errors=true;
			
			//if(no_errors){
				rtn=false;
				board_created=false;
				
				if(!isInsideBoard(piece_qos)){
					no_errors=false;
				}
			//}
			
			if(no_errors){
				board=initBoard({
					name : "board_legalMoves",
					fen : fen,
					isHidden : true,
					invalidFenStop : true
				});
				
				if(board===null){
					no_errors=false;
				}else{
					board_created=true;
				}
			}
			
			if(no_errors){
				active_color=board.Active.isBlack;
				non_active_sign=board.NonActive.sign;
				
				piece_val=board.getValue(piece_qos);
				imp_val=(piece_val*-non_active_sign);
				
				if(imp_val<=0){
					no_errors=false;
				}
			}
			
			if(no_errors){
				rtn=[];
				pre_validated_arr_pos=[];
				
				en_passant_capturable_bos="";
				
				is_king=(imp_val===_KING);
				active_color_king_rank=(active_color ? 0 : 7);
				
				if(is_king){//king
					for(i=1; i<9; i++){//1...8
						if((temp=board.candidateMoves(piece_qos, i, false, 1, true)).length){pre_validated_arr_pos.push(temp);}
					}
					
					active_castling_availity=(active_color ? board.BCastling : board.WCastling);
					
					if(active_castling_availity && !board.Active.checks){
						for(i=0; i<2; i++){//0...1
							if(active_castling_availity!==(i ? 1 : 2)){
								if(board.candidateMoves(piece_qos, (i ? 7 : 3), false, (i ? 3 : 2), false).length===(i ? 3 : 2)){
									can_castle_current_side=true;
									
									for(j=0; j<2; j++){//0...1
										if(board.countChecks([active_color_king_rank, (j+(i ? 2 : 5))], true)){//5...6 or 2...3
											can_castle_current_side=false;
											break;
										}
									}
									
									if(can_castle_current_side){
										pre_validated_arr_pos.push([[active_color_king_rank, (i ? 2 : 6)]]);
									}
								}
							}
						}
					}
				}else if(imp_val===_PAWN){
					piece_rank=getRankPos(piece_qos);
					
					if((temp=board.candidateMoves(piece_qos, (active_color ? 5 : 1), false, (piece_rank===(active_color_king_rank+non_active_sign) ? 2 : 1), false)).length){pre_validated_arr_pos.push(temp);}
					
					for(i=0; i<2; i++){//0...1
						current_adjacent_file=(getFilePos(piece_qos)+(i ? 1 : -1));
						current_diagonal_pawn_pos=[(piece_rank+non_active_sign), current_adjacent_file];
						
						if(isInsideBoard(current_diagonal_pawn_pos)){
							temp2=(board.getValue(current_diagonal_pawn_pos)*non_active_sign);
							
							/*NO use (x && ...), we have negative numbers too*/
							if(temp2>0 && temp2!==_KING){
								pre_validated_arr_pos.push([current_diagonal_pawn_pos]);
							}else if(sameSqr(current_diagonal_pawn_pos, board.EnPassantBos)){
								en_passant_capturable_bos=toBos([piece_rank, current_adjacent_file]);
								pre_validated_arr_pos.push([current_diagonal_pawn_pos]);
							}
						}
					}
				}else{//knight, bishop, rook, queen
					as_knight=(imp_val===_KNIGHT);
					
					for(i=0; i<2; i++){//0...1
						for(j=(imp_val-3-i ? 8 : 0)+i; --j>0; ){//(x!==4): 8,6,4,2 (x!==3): 7,5,3,1 (else): 8,6,4,2,7,5,3,1
							if((temp=board.candidateMoves(piece_qos, j--, as_knight, null, true)).length){pre_validated_arr_pos.push(temp);}
						}
					}
				}
				
				for(i=0, len=pre_validated_arr_pos.length; i<len; i++){//0<len
					for(j=0, len2=pre_validated_arr_pos[i].length; j<len2; j++){//0<len2
						current_pos=pre_validated_arr_pos[i][j];
						
						temp=board[toBos(current_pos)];
						temp2=board[toBos(piece_qos)];
						temp3=board[en_passant_capturable_bos];
						
						board[toBos(current_pos)]=piece_val;
						board[toBos(piece_qos)]=_EMPTY_SQR;
						
						if(en_passant_capturable_bos && sameSqr(current_pos, board.EnPassantBos)){
							board[en_passant_capturable_bos]=_EMPTY_SQR;
						}
						
						if(!board.countChecks((is_king ? current_pos : board.Active.kingPos), true)){
							rtn.push(current_pos);
						}
						
						board[toBos(current_pos)]=temp;
						board[toBos(piece_qos)]=temp2;
						board[en_passant_capturable_bos]=temp3;
					}
				}
			}
			
			if(board_created){
				removeBoard(board.BoardName);
			}
			
			return rtn;
		}
		
		function isLegalMove(fen, initial_qos, final_qos){
			var moves, rtn;
			
			rtn=false;
			
			if(isInsideBoard(final_qos)){
				moves=legalMoves(fen, initial_qos);
				
				if(moves){
					rtn=_strContains(moves.join("/"), toPos(final_qos).join());
				}
			}
			
			return rtn;
		}
		
		function initBoard(p){//{name, fen, isRotated, isHidden, invalidFenStop}
			var i, j, target, board_name, pre_fen, fen_was_valid, postfen_was_valid, new_board, no_errors;
			
			no_errors=true;
			
			//if(no_errors){
				pre_fen=(""+p.fen).replace(/^\s+|\s+$/g, "").replace(/\s\s+/g, " ");
				
				p.invalidFenStop=(p.invalidFenStop===true);
				p.name=(((typeof p.name)==="string" && p.name.length) ? p.name : ("board_"+new Date().getTime()));
				p.isRotated=(p.isRotated===true);
				p.isHidden=(p.isHidden===true);
				board_name=p.name;
				
				fen_was_valid=((typeof p.fen)==="string" && !_basicFenTest(pre_fen));
				
				if(p.invalidFenStop && !fen_was_valid){
					no_errors=false;
					console.log("Error[initBoard]: \""+board_name+"\" bad FEN");
				}
			//}
			
			if(no_errors){
				if(!boardExists(board_name)){
					_boards[board_name]={
						id : _next_board_id++,
						BoardName : board_name,
						getValue : _getValue,
						countChecks : _countChecks,
						toggleActiveColor : _toggleActiveColor,
						toggleIsRotated : _toggleIsRotated,
						setPromoteTo : _setPromoteTo,
						setCurrentMove : _setCurrentMove,
						giveSquareMovement : _giveSquareMovement,
						resetPieceClasses : _resetPieceClasses,
						getMoveListHTML : _getMoveListHTML,
						getObjInfoHTML : _getObjInfoHTML,
						refreshBoard : _refreshBoard,
						firstTimeDefaults : _firstTimeDefaults,
						parseValuesFromFen : _parseValuesFromFen,
						readFen : _readFen,
						refreshKingPosChecksAndFen : _refreshKingPosChecksAndFen,
						refinedFenTest : _refinedFenTest,
						candidateMoves : _candidateMoves,
						isAttacked : _isAttacked,
						disambiguationPos : _disambiguationPos,
						testCollision : _testCollision,
						moveCaller : _moveCaller,
						makeMove : _makeMove,
						getNotation : _getNotation
					};
				}
				
				target=_boards[board_name];
				
				target.Active={
					isBlack : null,
					sign : null,
					kingPos : null,
					checks : null
				};
				
				target.NonActive={
					isBlack : null,
					sign : null,
					kingPos : null
					//checks
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
				target.PromoteTo=null;
				target.FromSquare=null;
				target.IsHidden=null;
				
				for(i=0; i<8; i++){//0...7
					for(j=0; j<8; j++){//0...7
						target[toBos([i, j])]=null;
					}
				}
				
				new_board=selectBoard(board_name);
				
				if(new_board===null){
					no_errors=false;
					console.log("Error[initBoard]: \""+board_name+"\" board creation failure");
				}
			}
			
			if(no_errors){
				new_board.readFen(fen_was_valid ? pre_fen : _DEFAULT_FEN);
				new_board.firstTimeDefaults(p.isHidden, p.isRotated);
				
				postfen_was_valid=!new_board.refinedFenTest();
				
				if(p.invalidFenStop && !postfen_was_valid){
					no_errors=false;
					console.log("Error[initBoard]: \""+board_name+"\" bad postFEN");
					
					removeBoard(board_name);
				}
			}
			
			if(no_errors){
				if(!postfen_was_valid){
					new_board.readFen(_DEFAULT_FEN);
					new_board.firstTimeDefaults(p.isHidden, p.isRotated);
				}
				
				new_board.refreshBoard();
			}
			
			return selectBoard(board_name);
		}
		
		function cloneBoard(to_board_name, from_board_name){
			var i, j, mutable_keys, no_errors;
			
			no_errors=true;
			
			//if(no_errors){
				if(!boardExists(from_board_name)){
					no_errors=false;
					console.log("Error[cloneBoard]: \""+from_board_name+"\" is not defined");
				}
			//}
			
			if(no_errors){
				if(!boardExists(to_board_name)){
					no_errors=false;
					console.log("Error[cloneBoard]: \""+to_board_name+"\" is not defined");
				}
			}
			
			if(no_errors){
				mutable_keys=["Active", "NonActive", "Fen", "WCastling", "BCastling", "EnPassantBos", "HalfMove", "FullMove", "InitialFullMove", "MoveList", "CurrentMove", "IsRotated", "PromoteTo", "FromSquare", "IsHidden"];
				
				for(i=0; i<8; i++){//0...7
					for(j=0; j<8; j++){//0...7
						mutable_keys.push(toBos([i, j]));
					}
				}
				
				$.each(mutable_keys, function(i, key){
					if(typeof _boards[from_board_name][key]==="object"){
						$.extend(true, _boards[to_board_name][key], _boards[from_board_name][key]);
					}else{
						_boards[to_board_name][key]=_boards[from_board_name][key];
					}
				});
				
				/*algun refreshBoard(); pero problemas con hidden*/
			}
			
			return no_errors;
		}
		
		function isLegalFen(fen){
			var board;
			
			board=initBoard({
				name : "board_legalFen",
				fen : fen,
				isHidden : true,
				invalidFenStop : true
			});
			
			return (board!==null);
		}
		
		function getBoardCount(){
			return Object.keys(_boards).length;
		}
		
		function getBoardNames(){
			var rtn;
			
			rtn=[];
			
			$.each(_boards, function(i, board){
				rtn.push(i);
			});
			
			return rtn;
		}
		
		return {
			boardExists : boardExists,
			selectBoard : selectBoard,
			toBos : toBos,
			toPos : toPos,
			getRankPos : getRankPos,
			getFilePos : getFilePos,
			getRankBos : getRankBos,
			getFileBos : getFileBos,
			isInsideBoard : isInsideBoard,
			sameSqr : sameSqr,
			removeBoard : removeBoard,
			legalMoves : legalMoves,
			isLegalMove : isLegalMove,
			initBoard : initBoard,
			cloneBoard : cloneBoard,
			isLegalFen : isLegalFen,
			getBoardCount : getBoardCount,
			getBoardNames : getBoardNames
		};
	})();
	
	if(!win.IsepicChess){
		win.IsepicChess=IsepicChess;
	}
})(window, jQuery);
