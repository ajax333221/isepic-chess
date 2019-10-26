/** Copyright (c) 2012 Ajax Isepic (ajax333221) Licensed MIT */

/*jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:true, curly:true, es3:true, latedef:nofunc, bitwise:false, sub:true */

(function(win, $){
	var IsepicChess=(function(){
		var _NEXT_BOARD_ID=0;
		var _BOARDS=Object.create(null);
		
		var _EMPTY_SQR=0;
		var _PAWN=1;
		var _KNIGHT=2;
		var _BISHOP=3;
		var _ROOK=4;
		var _QUEEN=5;
		var _KING=6;
		var _DEFAULT_FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		var _MUTABLE_KEYS=["Active", "NonActive", "Fen", "WCastling", "BCastling", "EnPassantBos", "HalfMove", "FullMove", "InitialFullMove", "MoveList", "CurrentMove", "IsRotated", "PromoteTo", "FromSquare", "IsHidden", "Squares"];
		
		//---------------- utilities
		
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
			
			min_val=(((min_val || min_val===0) ? min_val : -Infinity) || 0);
			max_val=(((max_val || max_val===0) ? max_val : Infinity) || 0);
			
			return Math.min(Math.max(num, min_val), max_val);
		}
		
		function _hashCode(val){
			var i, len, hash;
			
			hash=0;
			val=((typeof val)==="string" ? val : "");
			
			for(i=0, len=val.length; i<len; i++){
				hash=((hash<<5)-hash)+val.charCodeAt(i);
				hash|=0;//to 32bit integer
			}
			
			return hash;
		}
		
		function _castlingChars(num){
			return ["", "k", "q", "kq"][_toInt(num, 0, 3)];
		}
		
		function _cloneBoardObjs(to_board, from_board){
			to_board["MoveList"]=[];
			
			$.each(_MUTABLE_KEYS, function(i, key){
				if((typeof from_board[key])==="object" && from_board[key]!==null){
					$.extend(true, to_board[key], from_board[key]);
				}else{
					to_board[key]=from_board[key];
				}
			});
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
			var i, j, rank_bos, label_td, rtn;
			
			label_td="<td class='label'></td><td class='label'>"+(is_rotated ? "hgfedcba" : "abcdefgh").split("").join("</td><td class='label'>")+"</td>";
			rtn="<table class='"+("tableb"+(is_rotated ? " rotated" : ""))+"' cellpadding='0' cellspacing='0'>";
			rtn+="<tr>"+label_td+"<td class='"+("label dot "+(is_rotated ? "w" : "b")+"side")+"'>◘</td></tr>";
			
			for(i=0; i<8; i++){//0...7
				rank_bos=(is_rotated ? (i+1) : (8-i));
				rtn+="<tr><td class='label'>"+rank_bos+"</td>";
				
				for(j=0; j<8; j++){//0...7
					rtn+="<td class='"+(((i+j)%2 ? "b" : "w")+"s")+"' id='"+toBos(is_rotated ? [(7-i), (7-j)] : [i, j])+"'></td>";
				}
				
				rtn+="<td class='label'>"+rank_bos+"</td></tr>";
			}
			
			rtn+="<tr>"+label_td+"<td class='"+("label dot "+(is_rotated ? "b" : "w")+"side")+"'>◘</td></tr>";
			rtn+="</table>";
			
			return rtn;
		}
		
		function _basicFenTest(fen){
			var i, j, len, temp, optional_clocks, last_is_num, current_is_num, current_bal, fen_board_arr, total_pieces, fen_board, total_files_in_current_rank, error_msg;
			
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
						current_bal=toBal((j+1)*getSign(!i));
						total_pieces[j]=_occurrences(fen_board, current_bal);
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
			
			return that.Squares[toBos(qos)];
		}
		
		function _setValue(qos, qal){
			var that;
			
			that=this;
			
			that.Squares[toBos(qos)]=toVal(qal);
		}
		
		function _countChecks(king_qos){
			var that;
			
			that=this;
			
			return that.calculateChecks(king_qos, false);
		}
		
		function _isCheck(king_qos){
			var that;
			
			that=this;
			
			return !!that.calculateChecks(king_qos, true);
		}
		
		function _calculateChecks(king_qos, early_break){
			var i, j, that, as_knight, rtn_total_checks;
			
			that=this;
			rtn_total_checks=0;
			king_qos=(king_qos || that.Active.kingPos);
			
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
			that.Active.sign=getSign(!temp);
			that.NonActive.sign=getSign(temp);
			
			/*NO hace King Pos refresh, eso lo hace refreshKingPosChecksAndFen()*/
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
							
							if(!sameSquare(temp, this.id)){
								need_highlight=true;
							}
						}
					}
					
					if(need_highlight){
						legal_moves=that.legalMoves(this.id);
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
			var i, j, that, new_class, piece_class, current_pos;
			
			that=this;
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					current_pos=(that.IsRotated ? [(7-i), (7-j)] : [i, j]);
					piece_class=toPieceClass(that.getValue(current_pos));
					
					new_class=(((i+j)%2 ? "b" : "w")+"s"+(piece_class ? (" "+piece_class) : ""));
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
				rtn+=(i!==1 ? " " : "")+((black_starts*1)!==(i%2) ? ("<span class='xpgn_number'>"+(that.InitialFullMove+Math.floor((i+black_starts-1)/2))+".</span>") : "")+"<span id='"+("xpgn"+i)+"' class='"+("xpgn_"+(i!==that.CurrentMove ? "goto" : "active"))+"'>"+move_list[i].PGNmove+"</span>"+(move_list[i].PGNend ? (" <span class='xpgn_result'>"+move_list[i].PGNend+"</span>") : "");
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
			rtn+="<br><strong>promote_to:</strong> "+toBal(that.PromoteTo*getSign(that.Active.isBlack));
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
				$("#xpromote").val(that.PromoteTo);
				
				if(that.CurrentMove!==0){
					$("#"+that.MoveList[that.CurrentMove].FromBos).addClass("lastmove");
					$("#"+that.MoveList[that.CurrentMove].ToBos).addClass("lastmove");
				}
				
				that.giveSquareMovement();
				
				$("#xobjinfo").html(that.getObjInfoHTML());
			}
		}
		
		function _firstTimeDefaults(is_hidden, rotate_board, promote_qal){
			var that;
			
			that=this;
			
			that.InitialFullMove=that.FullMove;
			that.MoveList=[{Fen : that.Fen, PGNmove : "", PGNend : "", FromBos : "", ToBos : ""}];
			that.CurrentMove=0;
			that.setPromoteTo(promote_qal);
			that.IsRotated=!!rotate_board;
			that.IsHidden=!!is_hidden;
		}
		
		function _parseValuesFromFen(fen_board){
			var i, j, len, that, current_file, current_char, fen_board_arr, skip_files;
			
			that=this;
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					that.setValue([i, j], _EMPTY_SQR);
				}
			}
			
			fen_board_arr=fen_board.split("/");
			
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
		}
		
		function _readFen(fen){
			var that, temp, fen_parts;
			
			that=this;
			fen_parts=fen.split(" ");
			
			that.parseValuesFromFen(fen_parts[0]);
			
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
			var i, j, that, current_pos, current_val, empty_consecutive_squares, new_fen_board;
			
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
			
			that.Active.checks=that.countChecks();
			
			that.Fen=(new_fen_board+" "+(that.Active.isBlack ? "b" : "w")+" "+((_castlingChars(that.WCastling).toUpperCase()+""+_castlingChars(that.BCastling)) || "-")+" "+(that.EnPassantBos || "-")+" "+that.HalfMove+" "+that.FullMove);
		}
		
		function _refinedFenTest(){
			var i, j, k, that, temp, temp2, current_sign, current_castling_availity, current_king_rank, en_passant_rank, en_passant_file, fen_board, total_pawns_in_current_file, min_captured, min_captured_holder, error_msg;
			
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
				
				if(that.isCheck(that.NonActive.kingPos)){
					error_msg="Error [2] non-active king in check";
				}
				
				that.toggleActiveColor();
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
						current_sign=getSign(!i);
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
		
		function _disambiguationPos(initial_qos, piece_direction, as_knight, ally_qal){
			var that;
			
			that=this;
			
			return that.testCollision(3, initial_qos, piece_direction, as_knight, null, null, ally_qal);
		}
		
		function _testCollision(op, initial_qos, piece_direction, as_knight, total_squares, allow_capture, ally_qal){
			var i, that, current_pos, current_val, current_abs_val, rank_change, file_change, rtn;
			
			that=this;
			
			piece_direction=_toInt(piece_direction, 1, 8);
			rank_change=(as_knight ? [-2, -1, 1, 2, 2, 1, -1, -2] : [-1, -1, 0, 1, 1, 1, 0, -1])[piece_direction-1];
			file_change=(as_knight ? [1, 2, 2, 1, -1, -2, -2, -1] : [0, 1, 1, 1, 0, -1, -1, -1])[piece_direction-1];
			total_squares=_toInt(as_knight ? 1 : (total_squares || 7));
			
			rtn=(op===2 ? false : []);
			
			for(i=0; i<total_squares; i++){//0<total_squares
				current_pos=[(getRankPos(initial_qos)+(rank_change*(i+1))), (getFilePos(initial_qos)+(file_change*(i+1)))];
				
				if(!isInsideBoard(current_pos)){
					break;
				}
				
				current_val=that.getValue(current_pos);
				
				if(current_val){
					current_abs_val=toAbsVal(current_val);
					
					if(getSign(current_val)===that.NonActive.sign){//is enemy piece
						if(op===1){
							if(allow_capture && current_abs_val!==_KING){
								rtn.push(current_pos);
							}
						}else if(op===2){
							if(as_knight){
								if(current_abs_val===_KNIGHT){
									rtn=true;
								}
							}else if(current_abs_val===_KING){
								if(!i){
									rtn=true;
								}
							}else if(current_abs_val===_QUEEN){
								rtn=true;
							}else if(piece_direction%2){
								if(current_abs_val==_ROOK){
									rtn=true;
								}
							}else if(current_abs_val===_BISHOP){
								rtn=true;
							}else if(!i && current_abs_val===_PAWN){
								if(current_val===_PAWN){
									if(piece_direction===4 || piece_direction===6){
										rtn=true;
									}
								}else{
									if(piece_direction===2 || piece_direction===8){
										rtn=true;
									}
								}
							}
						}
					}else{//is ally piece
						if(op===3){
							if(toAbsVal(ally_qal)===current_abs_val){
								rtn=current_pos;
							}
						}
					}
					
					break;
				}
				
				if(op===1){
					rtn.push(current_pos);//if capturing, this is unreachable because the break (no duplication occurs)
				}
			}
			
			return rtn;
		}
		
		function _legalMoves(piece_qos){
			var i, j, len, len2, that, temp, temp2, temp3, active_color, non_active_sign, current_adjacent_file, piece_val, piece_abs_val, current_pos, current_diagonal_pawn_pos, pre_validated_arr_pos, can_castle_current_side, active_color_king_rank, is_king, as_knight, en_passant_capturable_bos, piece_rank, active_castling_availity, no_errors, rtn;
			
			that=this;
			
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
						if((temp=that.candidateMoves(piece_qos, i, false, 1, true)).length){pre_validated_arr_pos.push(temp);}
					}
					
					active_castling_availity=(active_color ? that.BCastling : that.WCastling);
					
					if(active_castling_availity && !that.Active.checks){
						for(i=0; i<2; i++){//0...1
							if(active_castling_availity!==(i ? 1 : 2)){
								if(that.candidateMoves(piece_qos, (i ? 7 : 3), false, (i ? 3 : 2), false).length===(i ? 3 : 2)){
									can_castle_current_side=true;
									
									for(j=0; j<2; j++){//0...1
										if(that.isCheck([active_color_king_rank, (j+(i ? 2 : 5))])){//5...6 or 2...3
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
				}else if(piece_abs_val===_PAWN){
					piece_rank=getRankPos(piece_qos);
					
					if((temp=that.candidateMoves(piece_qos, (active_color ? 5 : 1), false, (piece_rank===(active_color_king_rank+non_active_sign) ? 2 : 1), false)).length){pre_validated_arr_pos.push(temp);}
					
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
					as_knight=(piece_abs_val===_KNIGHT);
					
					for(i=0; i<2; i++){//0...1
						for(j=(piece_abs_val-3-i ? 8 : 0)+i; --j>0; ){//(x!==4): 8,6,4,2 (x!==3): 7,5,3,1 (else): 8,6,4,2,7,5,3,1
							if((temp=that.candidateMoves(piece_qos, j--, as_knight, null, true)).length){pre_validated_arr_pos.push(temp);}
						}
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
						
						if(!that.isCheck(is_king ? current_pos : "")){
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
		
		function _boardHash(){
			var that, temp;
			
			that=this;
			temp="";
			
			$.each(_MUTABLE_KEYS, function(i, key){
				temp+=JSON.stringify(that[key]);
			});
			
			return _hashCode(temp);
		}
		
		function _isEqualBoard(to_board_name){
			var that, to_board, no_errors, rtn;
			
			that=this;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				to_board=selectBoard(to_board_name);
				
				if(to_board===null){
					no_errors=false;
					console.log("Error[_isEqualBoard]: \""+to_board_name+"\" is not defined");
				}
			//}
			
			if(no_errors){
				rtn=(that.BoardName===to_board_name || that.boardHash()===to_board.boardHash());
			}
			
			return rtn;
		}
		
		function _cloneBoardFrom(from_board_name){
			var that, from_board, no_errors;
			
			that=this;
			
			no_errors=true;
			
			//if(no_errors){
				from_board=selectBoard(from_board_name);
				
				if(from_board===null){
					no_errors=false;
					console.log("Error[_cloneBoardFrom]: \""+from_board_name+"\" is not defined");
				}
			//}
			
			if(no_errors){
				_cloneBoardObjs(that, from_board);
				/*algun refreshBoard(); pero problemas con hidden*/
			}
			
			return no_errors;
		}
		
		function _cloneBoardTo(to_board_name){
			var that, to_board, no_errors;
			
			that=this;
			
			no_errors=true;
			
			//if(no_errors){
				to_board=selectBoard(to_board_name);
				
				if(to_board===null){
					no_errors=false;
					console.log("Error[_cloneBoardTo]: \""+to_board_name+"\" is not defined");
				}
			//}
			
			if(no_errors){
				_cloneBoardObjs(to_board, that);
				/*algun refreshBoard(); pero problemas con hidden*/
			}
			
			return no_errors;
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
			var that, active_color, active_sign, active_color_king_rank, pawn_moved, promoted_val, piece_val, piece_abs_val, active_color_rook, new_en_passant_bos, new_active_castling_availity, new_non_active_castling_availity, king_castled, non_en_passant_capture, to_promotion_rank, pgn_move, pgn_end;
			
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
			
			pgn_move=that.getNotation(initial_qos, final_qos, piece_val, promoted_val, king_castled, non_en_passant_capture);
			
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
			
			that.toggleActiveColor();
			
			that.refreshKingPosChecksAndFen();
			
			that.CurrentMove++;
			
			if(that.CurrentMove!==that.MoveList.length){
				that.MoveList=that.MoveList.slice(0, that.CurrentMove);/*start variation instead of overwrite*/
			}
			
			pgn_end="";
			
			if(that.Active.checks){
				if(that.isCheckmate()){
					pgn_move+="#";
					pgn_end=(active_color ? "0-1" : "1-0");
				}else{
					pgn_move+="+";
				}
			}else{
				if(that.isStalemate()){
					pgn_end="1/2-1/2";
				}
			}
			
			that.MoveList.push({Fen : that.Fen, PGNmove : pgn_move, PGNend : pgn_end, FromBos : toBos(initial_qos), ToBos : toBos(final_qos)});
		}
		
		function _noLegalMoves(){
			var i, j, that, rtn;
			
			that=this;
			
			rtn=true;
			
			outer:
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					if(that.legalMoves([i, j]).length){
						rtn=false;
						break outer;
					}
				}
			}
			
			return rtn;
		}
		
		function _isCheckmate(){
			var that;
			
			that=this;
			
			return !!(that.Active.checks && that.noLegalMoves());
		}
		
		function _isStalemate(){
			var that;
			
			that=this;
			
			return !!(!that.Active.checks && that.noLegalMoves());
		}
		
		function _getNotation(initial_qos, final_qos, piece_qal, promoted_qal, king_castled, non_en_passant_capture){
			var i, j, len, that, temp, temp2, temp3, piece_abs_val, initial_file_bos, ambiguity, as_knight, rtn;
			
			that=this;
			
			rtn="";
			piece_abs_val=toAbsVal(piece_qal);
			initial_file_bos=getFileBos(initial_qos);
			
			if(king_castled){//castling king
				rtn+=(king_castled!==1 ? "O-O-O" : "O-O");
			}else if(piece_abs_val===_PAWN){
				if(initial_file_bos!==getFileBos(final_qos)){
					rtn+=(initial_file_bos+"x");
				}
				
				rtn+=toBos(final_qos);
				
				if(promoted_qal){
					rtn+="="+toAbsBal(promoted_qal);
				}
			}else{//knight, bishop, rook, queen, non-castling king
				rtn+=toAbsBal(piece_qal);
				
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
							if(!sameSquare(temp2[i], initial_qos) && isLegalMove(that.Fen, temp2[i], final_qos)){
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
		}
		
		//---------------- ic
		
		function boardExists(board_name){
			return ((typeof _BOARDS[board_name])!=="undefined");
		}
		
		function selectBoard(board_name){
			var no_errors, rtn;
			
			rtn=null;
			no_errors=true;
			
			//if(no_errors){
				if(!boardExists(board_name)){
					no_errors=false;
					console.log("Error[selectBoard]: \""+board_name+"\" is not defined");
				}
			//}
			
			if(no_errors){
				rtn=_BOARDS[board_name];
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
			
			rtn=["*", "p", "n", "b", "r", "q", "k"][abs_val];
			
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
			return ((typeof qos)==="string" ? qos.toLowerCase() : ("abcdefgh".charAt(getFilePos(qos))+""+(8-getRankPos(qos))));
		}
		
		function toPos(qos){
			return ((typeof qos)==="string" ? [(8-(getRankBos(qos)*1)), "abcdefgh".indexOf(getFileBos(qos))] : qos);
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
				delete _BOARDS[board_name];
			}
			
			return no_errors;
		}
		
		function countChecks(fen, king_qos){
			var board, board_created, no_errors, rtn;
			
			rtn=0;
			board_created=false;
			no_errors=true;
			
			//if(no_errors){
				board=initBoard({
					name : "board_countChecks",
					fen : fen,
					isHidden : true,
					invalidFenStop : true
				});
				
				if(board===null){
					no_errors=false;
				}else{
					board_created=true;
				}
			//}
			
			if(no_errors){
				rtn=board.countChecks(king_qos);
			}
			
			if(board_created){
				removeBoard(board.BoardName);
			}
			
			return rtn;
		}
		
		function isCheck(fen, king_qos){
			var board, board_created, no_errors, rtn;
			
			rtn=0;
			board_created=false;
			no_errors=true;
			
			//if(no_errors){
				board=initBoard({
					name : "board_isCheck",
					fen : fen,
					isHidden : true,
					invalidFenStop : true
				});
				
				if(board===null){
					no_errors=false;
				}else{
					board_created=true;
				}
			//}
			
			if(no_errors){
				rtn=board.isCheck(king_qos);
			}
			
			if(board_created){
				removeBoard(board.BoardName);
			}
			
			return rtn;
		}
		
		function legalMoves(fen, piece_qos){
			var board, board_created, no_errors, rtn;
			
			rtn=[];
			board_created=false;
			no_errors=true;
			
			//if(no_errors){
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
			//}
			
			if(no_errors){
				rtn=board.legalMoves(piece_qos);
			}
			
			if(board_created){
				removeBoard(board.BoardName);
			}
			
			return rtn;
		}
		
		function isLegalMove(fen, initial_qos, final_qos){
			var board, board_created, no_errors, rtn;
			
			rtn=false;
			board_created=false;
			no_errors=true;
			
			//if(no_errors){
				board=initBoard({
					name : "board_isLegalMove",
					fen : fen,
					isHidden : true,
					invalidFenStop : true
				});
				
				if(board===null){
					no_errors=false;
				}else{
					board_created=true;
				}
			//}
			
			if(no_errors){
				rtn=board.isLegalMove(initial_qos, final_qos);
			}
			
			if(board_created){
				removeBoard(board.BoardName);
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
					console.log("Error[initBoard]: \""+board_name+"\" bad FEN");
				}
			//}
			
			if(no_errors){
				if(!boardExists(board_name)){
					_BOARDS[board_name]={
						id : _NEXT_BOARD_ID++,
						BoardName : board_name,
						getValue : _getValue,
						setValue : _setValue,
						isCheck : _isCheck,
						countChecks : _countChecks,
						calculateChecks : _calculateChecks,
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
						isLegalMove : _isLegalMove,
						legalMoves : _legalMoves,
						boardHash : _boardHash,
						isEqualBoard : _isEqualBoard,
						cloneBoardFrom : _cloneBoardFrom,
						cloneBoardTo : _cloneBoardTo,
						moveCaller : _moveCaller,
						makeMove : _makeMove,
						noLegalMoves : _noLegalMoves,
						isCheckmate : _isCheckmate,
						isStalemate : _isStalemate,
						getNotation : _getNotation
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
				target.Squares={};
				
				for(i=0; i<8; i++){//0...7
					for(j=0; j<8; j++){//0...7
						target.setValue([i, j], null);
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
				new_board.firstTimeDefaults(p.isHidden, p.isRotated, p.promoteTo);
				
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
					new_board.firstTimeDefaults(p.isHidden, p.isRotated, p.promoteTo);
				}
				
				rtn=new_board;
				new_board.refreshBoard();
			}
			
			return rtn;
		}
		
		function isEqualBoard(left_board_name, right_board_name){
			var left_board, no_errors, rtn;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				left_board=selectBoard(left_board_name);
				
				if(left_board===null){
					no_errors=false;
					console.log("Error[isEqualBoard]: \""+left_board_name+"\" is not defined");
				}
			//}
			
			if(no_errors){
				rtn=left_board.isEqualBoard(right_board_name);
			}
			
			return rtn;
		}
		
		function cloneBoard(to_board_name, from_board_name){
			var to_board, no_errors, rtn;
			
			rtn=false;
			no_errors=true;
			
			//if(no_errors){
				to_board=selectBoard(to_board_name);
				
				if(to_board===null){
					no_errors=false;
					console.log("Error[cloneBoard]: \""+to_board_name+"\" is not defined");
				}
			//}
			
			if(no_errors){
				rtn=to_board.cloneBoardFrom(from_board_name);
			}
			
			return rtn;
		}
		
		function isLegalFen(fen){
			var board, rtn;
			
			rtn=false;
			
			board=initBoard({
				name : "board_isLegalFen",
				fen : fen,
				isHidden : true,
				invalidFenStop : true
			});
			
			if(board!==null){
				removeBoard(board.BoardName);
				rtn=true;
			}
			
			return rtn;
		}
		
		function isCheckmate(fen){
			var board, board_created, no_errors, rtn;
			
			rtn=false;
			board_created=false;
			no_errors=true;
			
			//if(no_errors){
				board=initBoard({
					name : "board_isCheckmate",
					fen : fen,
					isHidden : true,
					invalidFenStop : true
				});
				
				if(board===null){
					no_errors=false;
				}else{
					board_created=true;
				}
			//}
			
			if(no_errors){
				rtn=board.isCheckmate();
			}
			
			if(board_created){
				removeBoard(board.BoardName);
			}
			
			return rtn;
		}
		
		function isStalemate(fen){
			var board, board_created, no_errors, rtn;
			
			rtn=false;
			board_created=false;
			no_errors=true;
			
			//if(no_errors){
				board=initBoard({
					name : "board_isStalemate",
					fen : fen,
					isHidden : true,
					invalidFenStop : true
				});
				
				if(board===null){
					no_errors=false;
				}else{
					board_created=true;
				}
			//}
			
			if(no_errors){
				rtn=board.isStalemate();
			}
			
			if(board_created){
				removeBoard(board.BoardName);
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
			countChecks : countChecks,
			isCheck : isCheck,
			legalMoves : legalMoves,
			isLegalMove : isLegalMove,
			initBoard : initBoard,
			isEqualBoard : isEqualBoard,
			cloneBoard : cloneBoard,
			isLegalFen : isLegalFen,
			isCheckmate : isCheckmate,
			isStalemate : isStalemate,
			getBoardCount : getBoardCount,
			getBoardNames : getBoardNames,
			mapToBos : mapToBos,
			utilityMisc : {
				trimSpaces : _trimSpaces,
				formatName : _formatName,
				strContains : _strContains,
				occurrences : _occurrences,
				toInt : _toInt,
				hashCode : _hashCode,
				castlingChars : _castlingChars,
				cloneBoardObjs : _cloneBoardObjs,
				getBoardTabsHTML : _getBoardTabsHTML,
				getTableHTML : _getTableHTML,
				basicFenTest : _basicFenTest
			}
		};
	})();
	
	if(!win.IsepicChess){
		win.IsepicChess=IsepicChess;
	}
})(window, jQuery);
