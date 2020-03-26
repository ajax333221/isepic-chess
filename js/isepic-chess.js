/** Copyright (c) 2012 Ajax Isepic (ajax333221) Licensed MIT */

/*jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:true, curly:true, es3:true, latedef:nofunc, bitwise:false, sub:true */

(function(win, $){
	var Ic=(function(){
		var _VERSION="2.4.4";
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
		
		function _animatePiece(from_bos, to_bos, piece_class, promotion_class){
			var temp, piece_elm, from_square, to_square, old_offset, new_offset;
			
			from_square=$("#ic_id_"+from_bos);
			to_square=$("#ic_id_"+to_bos);
			
			old_offset=from_square.children(".ic_piece_holder").offset();
			new_offset=to_square.children(".ic_piece_holder").offset();
			
			to_square.html("<div class='"+("ic_piece_holder"+piece_class)+"'></div>");
			piece_elm=to_square.children(".ic_piece_holder");
			
			temp=piece_elm.clone().appendTo("#ic_id_board");
			
			piece_elm.hide().attr("class", ("ic_piece_holder"+(promotion_class || piece_class)));
			
			temp.css({
				"position" : "absolute",
				"left" : old_offset.left,
				"top" : old_offset.top,
				"zIndex" : 1000
			}).animate({
				"top" : new_offset.top,
				"left" : new_offset.left
			}, {
				duration : 300,
				always : function(){
					piece_elm.show();
					temp.remove();
				}
			});
		}
		
		function _getBoardTabsHTML(italic_board_name){
			var i, len, current_board, current_board_name, board_list, rtn;
			
			board_list=getBoardNames();
			rtn="<strong>Board list:</strong> ";
			
			for(i=0, len=board_list.length; i<len; i++){//0<len
				rtn+=(i ? " | " : "");
				
				current_board_name=board_list[i];
				current_board=selectBoard(current_board_name);
				
				if(current_board!==null){
					if(current_board.IsHidden){
						rtn+="<em class='ic_disabled'>"+current_board_name+"</em>";
					}else if(current_board_name===italic_board_name){
						rtn+="<em>"+current_board_name+"</em>";
					}else{
						rtn+="<a class='ic_changeboard' data-boardname='"+current_board_name+"' href='#'>"+current_board_name+"</a>";
					}
				}else{
					_consoleLog("Warning[_getBoardTabsHTML]: \""+current_board_name+"\" is not defined");
				}
			}
			
			return rtn;
		}
		
		function _getTableHTML(is_rotated){
			var i, j, rank_bos, current_bos, rtn;
			
			rtn="<table class='"+("ic_tableb"+(is_rotated ? " ic_rotated" : ""))+"' cellpadding='0' cellspacing='0'>";
			rtn+="<tr><td class='ic_label ic_top_border ic_left_border'></td><td class='ic_label ic_top_border'>"+(is_rotated ? "hgfedcba" : "abcdefgh").split("").join("</td><td class='ic_label ic_top_border'>")+"</td><td class='"+("ic_label ic_top_border ic_right_border ic_dot "+(is_rotated ? "ic_wside" : "ic_bside"))+"'>◘</td><td class='ic_captureds' rowspan='10'></td></tr>";
			
			for(i=0; i<8; i++){//0...7
				rank_bos=(is_rotated ? (i+1) : (8-i));
				rtn+="<tr><td class='ic_label ic_left_border'>"+rank_bos+"</td>";
				
				for(j=0; j<8; j++){//0...7
					current_bos=toBos(is_rotated ? [(7-i), (7-j)] : [i, j]);
					rtn+="<td id='"+("ic_id_"+current_bos)+"' class='"+((i+j)%2 ? "ic_bs" : "ic_ws")+"' data-bos='"+current_bos+"'><div class='ic_piece_holder'></div></td>";
				}
				
				rtn+="<td class='ic_label ic_right_border'>"+rank_bos+"</td></tr>";
			}
			
			rtn+="<tr><td class='ic_label ic_bottom_border ic_left_border'></td><td class='ic_label ic_bottom_border'>"+(is_rotated ? "hgfedcba" : "abcdefgh").split("").join("</td><td class='ic_label ic_bottom_border'>")+"</td><td class='"+("ic_label ic_right_border ic_bottom_border ic_dot "+(is_rotated ? "ic_bside" : "ic_wside"))+"'>◘</td></tr>";
			rtn+="</table>";
			
			return rtn;
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
			
			/*NO intercambia Active y NonActive King Pos, eso se ajusta refreshKingPosChecksAndFen()*/
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
			
			$(".ic_ws, .ic_bs").unbind("click").click(function(){
				var i, len, temp, need_highlight, legal_moves, square_bos;
				
				if(!that.IsHidden){
					square_bos=$(this).attr("data-bos");
					need_highlight=true;
					
					if(that.FromSquare){
						$(".ic_highlight").removeClass("ic_highlight");
						$(".ic_currpiece").removeClass("ic_currpiece");
						need_highlight=false;
						
						temp=that.FromSquare;
						that.FromSquare="";
						
						if(that.moveCaller(temp, square_bos)){
							that.refreshBoard(1);
						}else{
							that.giveSquareMovement();
							
							if(!sameSquare(temp, square_bos)){
								need_highlight=true;
							}
						}
					}
					
					if(need_highlight){
						legal_moves=that.legalMoves(square_bos);
						len=legal_moves.length;
						
						if(len){
							that.FromSquare=square_bos;
							$(this).addClass("ic_currpiece");
							
							for(i=0; i<len; i++){//0<len
								$("#ic_id_"+toBos(legal_moves[i])).addClass("ic_highlight");
							}
						}
					}
					
					$("#ic_id_objinfo").html(that.getObjInfoHTML());
				}
			});
		}
		
		function _resetPieceClasses(){
			var i, j, len, that, diff_top, diff_bottom, captured_html, new_class, piece_class, current_pos;
			
			that=this;
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					current_pos=(that.IsRotated ? [(7-i), (7-j)] : [i, j]);
					new_class=((i+j)%2 ? "ic_bs" : "ic_ws");
					
					//si prev next exclude, pasar blank square (ni si quiera poner un piece holder)
					piece_class=toPieceClass(that.getValue(current_pos));
					piece_class=(piece_class ? (" ic_"+piece_class) : "");
					
					$("#ic_id_"+toBos(current_pos)).attr("class", new_class).html("<div class='"+("ic_piece_holder"+piece_class)+"'></div>");
				}
			}
			
			captured_html="";
			diff_top=(that.IsRotated ? that.MaterialDiff.w : that.MaterialDiff.b);
			
			for(i=0, len=diff_top.length; i<len; i++){//0<len
				captured_html+="<img src='"+("./css/images/"+toPieceClass(diff_top[i])+".png")+"' width='20' height='20'>";
			}
			
			captured_html+="<hr>";
			diff_bottom=(that.IsRotated ? that.MaterialDiff.b : that.MaterialDiff.w);
			
			for(i=0, len=diff_bottom.length; i<len; i++){//0<len
				captured_html+="<img src='"+("./css/images/"+toPieceClass(diff_bottom[i])+".png")+"' width='20' height='20'>";
			}
			
			$("#ic_id_board .ic_captureds").html(captured_html);
		}
		
		function _getMoveListHTML(){
			var i, len, that, move_list, black_starts, rtn;
			
			that=this;
			move_list=that.MoveList;
			black_starts=_strContains(move_list[0].Fen, " b ");
			
			rtn="";
			
			for(i=1, len=move_list.length; i<len; i++){//1<len
				rtn+=(i!==1 ? " " : "")+((black_starts*1)!==(i%2) ? ("<span class='ic_pgn_number'>"+(that.InitialFullMove+Math.floor((i+black_starts-1)/2))+".</span>") : "")+"<span class='"+(i!==that.CurrentMove ? "ic_pgn_link" : "ic_pgn_current")+"' data-index='"+i+"'>"+move_list[i].PGNmove+"</span>"+(move_list[i].PGNend ? (" <span class='ic_pgn_result'>"+move_list[i].PGNend+"</span>") : "");
			}
			
			if(black_starts && rtn!==""){
				rtn="<span class='ic_pgn_number'>"+that.InitialFullMove+"...</span>"+rtn;
			}
			
			return rtn;
		}
		
		function _getObjInfoHTML(){
			var i, j, temp, current_row, that, rtn;
			
			that=this;
			
			rtn="<li><strong>Selected board:</strong> <span>"+that.BoardName+"</span></li>";
			rtn+="<li><strong>Is rotated?:</strong> <span>"+that.IsRotated+"</span></li>";
			rtn+="<li><strong>Is check?:</strong> <span>"+that.IsCheck+"</span></li>";
			rtn+="<li><strong>Is checkmate?:</strong> <span>"+that.IsCheckmate+"</span></li>";
			rtn+="<li><strong>Is stalemate?:</strong> <span>"+that.IsStalemate+"</span></li>";
			rtn+="<li><strong>En Passant:</strong> <span>"+(that.EnPassantBos ? that.EnPassantBos : "-")+"</span></li>";
			
			rtn+="<li>";
			rtn+="<strong>Active</strong>";
			rtn+="<ul>";
			rtn+="<li><strong>isBlack?:</strong> <span>"+that.Active.isBlack+"</span></li>";
			rtn+="<li><strong>sign:</strong> <span>("+(that.Active.sign>0 ? "+" : "-")+")</span></li>";
			rtn+="<li><strong>king square:</strong> <span>"+toBos(that.Active.kingPos)+"</span></li>";
			rtn+="<li><strong>checks:</strong> <span>"+that.Active.checks+"</span></li>";
			rtn+="</ul>";
			rtn+="</li>";
			
			rtn+="<li>";
			rtn+="<strong>Non Active</strong>";
			rtn+="<ul>";
			rtn+="<li><strong>isBlack?:</strong> <span>"+that.NonActive.isBlack+"</span></li>";
			rtn+="<li><strong>sign:</strong> <span>("+(that.NonActive.sign>0 ? "+" : "-")+")</span></li>";
			rtn+="<li><strong>king square:</strong> <span>"+toBos(that.NonActive.kingPos)+"</span></li>";
			rtn+="<li><strong>checks:</strong> <span>"+that.NonActive.checks+"</span></li>";
			rtn+="</ul>";
			rtn+="</li>";
			
			rtn+="<li><strong>White castling:</strong> <span>"+(_castlingChars(that.WCastling).toUpperCase() || "-")+"</span></li>";
			rtn+="<li><strong>Black castling:</strong> <span>"+(_castlingChars(that.BCastling) || "-")+"</span></li>";
			rtn+="<li><strong>Half moves:</strong> <span>"+that.HalfMove+"</span></li>";
			rtn+="<li><strong>Full moves:</strong> <span>"+that.FullMove+"</span></li>";
			rtn+="<li><strong>Current move:</strong> <span>"+that.CurrentMove+"</span></li>";
			rtn+="<li><strong>Initial full move:</strong> <span>"+that.InitialFullMove+"</span></li>";
			rtn+="<li><strong>Promote to:</strong> <span>"+toBal(that.PromoteTo*getSign(that.Active.isBlack))+"</span></li>";
			rtn+="<li><strong>Selected square:</strong> <span>"+(that.FromSquare ? that.FromSquare : "-")+"</span></li>";
			rtn+="<li><strong>Material difference:</strong> <span>{w:["+that.MaterialDiff.w.join(", ")+"], b:["+that.MaterialDiff.b.join(", ")+"]}</span></li>";
			
			rtn+="<li>";
			rtn+="<strong>Squares</strong>";
			rtn+="<ul>";
			
			for(i=0; i<8; i++){//0...7
				current_row=[];
				
				for(j=0; j<8; j++){//0...7
					temp=""+that.getValue([i, j]);
					
					if(temp.length===1){
						temp=" "+temp;
					}
					
					current_row.push("<span title='"+(toBos([i, j]).toUpperCase()+" = "+(toPieceClass(that.getValue([i, j])) || "empty"))+"'>"+temp+"</span>");
				}
				
				rtn+="<li><strong>A"+(8-i)+"-H"+(8-i)+":</strong> "+current_row.join(" | ")+"</li>";
			}
			
			rtn+="</ul>";
			rtn+="</li>";
			
			rtn+="<li><strong>FEN:</strong> <span>"+that.Fen+"</span></li>";
			
			return rtn;
		}
		
		function _refreshBoard(animate_move){
			var that, temp, is_reversed, from_bos, to_bos, initial_val, final_val, piece_class, promotion_class, is_new_html;
			
			that=this;
			
			if(!that.IsHidden){
				is_new_html=!$("#ic_id_main").length;
				
				if(is_new_html){
					$("body").append("<div id='ic_id_main'><h3 class='ic_inlineb'>Isepic-Chess.js » Demo <a href='https://github.com/ajax333221/Isepic-Chess'>View on GitHub</a></h3><div id='ic_id_board'></div><div id='ic_id_controls'><input id='ic_id_fen' value='' type='text'><br><input id='ic_id_nav_first' value='|<' type='button'> <input id='ic_id_nav_previous' value='<' type='button'> <input id='ic_id_nav_next' value='>' type='button'> <input id='ic_id_nav_last' value='>|' type='button'><input id='ic_id_rotate' value='rotate' type='button'><select id='ic_id_promote'><option value='5' selected='selected'>queen</option><option value='4'>rook</option><option value='3'>bishop</option><option value='2'>knight</option></select><hr><p id='ic_id_tabs'></p><p id='ic_id_movelist'></p></div><div id='ic_id_infoholder'><a id='ic_id_debug_toggle' href='#'>Debug ▲</a><ul id='ic_id_objinfo' style='display:none'></ul></div></div>");
					
					$("#ic_id_fen").click(function(){
						$(this).select();
					});
					
					$("#ic_id_debug_toggle").click(function(){
						$(this).text("Debug "+($("#ic_id_objinfo").is(":visible") ? "▲" : "▼"));
						$("#ic_id_objinfo").toggle();
						return false;
					});
				}
				
				if(is_new_html || $("#ic_id_board .ic_tableb").hasClass("ic_rotated")!==that.IsRotated){
					$("#ic_id_board").html(_getTableHTML(that.IsRotated));
				}
				
				$(".ic_piece_holder").finish();
				$("#ic_id_tabs").html(_getBoardTabsHTML(that.BoardName));
				
				$(".ic_changeboard").unbind("click").click(function(){
					var board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board_name=$(this).attr("data-boardname");
						board=selectBoard(board_name);
						
						if(board===null){
							no_errors=false;
							_consoleLog("Error[.ic_changeboard]: \""+board_name+"\" is not defined");
						}
					//}
					
					if(no_errors){
						board.refreshBoard(0);
					}
					
					return false;
				});
				
				/*en vez de siempre unbind(), solo hacerlo si el board es diferente (cuidado no doble al mismo tampoco)*/
				/*nota, cada refresh se hace el unbind y bind a los de ID, muy mal eso*/
				
				$("#ic_id_nav_first").unbind("click").click(function(){
					var is_goto;
					
					is_goto=(that.CurrentMove!==1);
					
					if(that.setCurrentMove((is_goto ? 0 : -1), is_goto)){
						that.refreshBoard(is_goto ? 0 : -1);
					}
				});
				
				$("#ic_id_nav_previous").unbind("click").click(function(){
					if(that.setCurrentMove(-1, false)){
						that.refreshBoard(-1);
					}
				});
				
				$("#ic_id_nav_next").unbind("click").click(function(){
					if(that.setCurrentMove(1, false)){
						that.refreshBoard(1);
					}
				});
				
				$("#ic_id_nav_last").unbind("click").click(function(){
					var is_goto;
					
					is_goto=(that.CurrentMove!==(that.MoveList.length-2));
					
					if(that.setCurrentMove((is_goto ? 10000 : 1), is_goto)){
						that.refreshBoard(is_goto ? 0 : 1);
					}
				});
				
				$("#ic_id_rotate").unbind("click").click(function(){
					that.toggleIsRotated();
					that.refreshBoard(0);
				});
				
				$("#ic_id_promote").unbind("change").change(function(){
					that.setPromoteTo($(this).val()*1);
					$("#ic_id_objinfo").html(that.getObjInfoHTML());
				});
				
				that.resetPieceClasses();
				
				if(animate_move){
					is_reversed=(animate_move===-1);
					
					if((that.CurrentMove!==0 || is_reversed) && (that.CurrentMove!==(that.MoveList.length-1) || !is_reversed)){
						temp=that.MoveList[that.CurrentMove+is_reversed];
						
						initial_val=(is_reversed ? temp.FinalVal : temp.InitialVal);
						final_val=(is_reversed ? temp.InitialVal : temp.FinalVal);
						from_bos=(is_reversed ? temp.ToBos : temp.FromBos);
						to_bos=(is_reversed ? temp.FromBos : temp.ToBos);
						
						piece_class=toPieceClass(is_reversed ? final_val : initial_val);
						piece_class=(piece_class ? (" ic_"+piece_class) : "");
						
						promotion_class=toPieceClass((initial_val!==final_val && !is_reversed) ? final_val : 0);
						promotion_class=(promotion_class ? (" ic_"+promotion_class) : "");
						
						_animatePiece(from_bos, to_bos, piece_class, promotion_class);
						
						if(temp.KingCastled){
							from_bos=toBos([getRankPos(temp.ToBos), (temp.KingCastled===1 ? 7 : 0)]);
							to_bos=toBos([getRankPos(temp.ToBos), (temp.KingCastled===1 ? 5 : 3)]);
							
							piece_class=toPieceClass(_ROOK*getSign(getRankPos(temp.ToBos)===0));
							piece_class=(piece_class ? (" ic_"+piece_class) : "");
							
							if(is_reversed){
								_animatePiece(to_bos, from_bos, piece_class);
							}else{
								_animatePiece(from_bos, to_bos, piece_class);
							}
						}
					}
				}
				
				$(".ic_wside, .ic_bside").removeClass("ic_w_color ic_b_color");
				$(that.Active.isBlack ? ".ic_bside" : ".ic_wside").addClass(that.Active.isBlack ? "ic_b_color" : "ic_w_color");
				
				$("#ic_id_movelist").html(that.getMoveListHTML() || "...");
				
				$(".ic_pgn_link").unbind("click").click(function(){
					var data_val, diff, is_goto;
					
					data_val=($(this).attr("data-index")*1);
					diff=(data_val-that.CurrentMove);
					is_goto=(Math.abs(diff)!==1);
					
					if(that.setCurrentMove((is_goto ? data_val : diff), is_goto)){
						that.refreshBoard(is_goto ? 0 : diff);
					}
				});
				
				$("#ic_id_fen").val(that.Fen);
				$("#ic_id_promote").val(that.PromoteTo);
				
				if(that.CurrentMove!==0){
					$("#ic_id_"+that.MoveList[that.CurrentMove].FromBos).addClass("ic_lastmove");
					$("#ic_id_"+that.MoveList[that.CurrentMove].ToBos).addClass("ic_lastmove");
				}
				
				that.giveSquareMovement();
				
				$("#ic_id_objinfo").html(that.getObjInfoHTML());
			}
		}
		
		function _firstTimeDefaults(is_hidden, rotate_board, promote_qal){
			var that;
			
			that=this;
			
			that.InitialFullMove=that.FullMove;
			that.MoveList=[{Fen : that.Fen, PGNmove : "", PGNend : "", FromBos : "", ToBos : "", InitialVal : 0, FinalVal : 0, KingCastled : 0}];
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
				temp=that.NonActive.kingPos;
				
				that.toggleActiveColor();
				
				if(that.calculateChecks(temp, true)){
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
		
		function _candidateMoves(initial_qos, piece_direction, as_knight, total_squares, allow_capture){
			var that;
			
			that=this;
			
			return that.testCollision(1, initial_qos, piece_direction, as_knight, total_squares, allow_capture, null).candidateMoves;
		}
		
		function _isAttacked(initial_qos, piece_direction, as_knight){
			var that;
			
			that=this;
			
			return that.testCollision(2, initial_qos, piece_direction, as_knight, null, null, null).isAttacked;
		}
		
		function _disambiguationPos(initial_qos, piece_direction, as_knight, ally_qal){
			var that;
			
			that=this;
			
			return that.testCollision(3, initial_qos, piece_direction, as_knight, null, null, ally_qal).disambiguationPos;
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
					
					if(active_castling_availity && !that.IsCheck){
						for(i=0; i<2; i++){//0...1
							if(active_castling_availity!==(i ? 1 : 2)){
								if(that.candidateMoves(piece_qos, (i ? 7 : 3), false, (i ? 3 : 2), false).length===(i ? 3 : 2)){
									if(!that.calculateChecks([active_color_king_rank, (i ? 3 : 5)], true)){
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
					piece_directions=[];
					if(piece_abs_val!==_BISHOP){piece_directions.push(1, 3, 5, 7);}
					if(piece_abs_val!==_ROOK){piece_directions.push(2, 4, 6, 8);}
					
					as_knight=(piece_abs_val===_KNIGHT);
					
					for(i=0, len=piece_directions.length; i<len; i++){//0...1
						if((temp=that.candidateMoves(piece_qos, piece_directions[i], as_knight, null, true)).length){pre_validated_arr_pos.push(temp);}
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
				/*algun refreshBoard(0); pero problemas con hidden*/
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
				/*algun refreshBoard(0); pero problemas con hidden*/
			}
			
			return no_errors;
		}
		
		function _moveCaller(initial_qos, final_qos){
			var that, rtn_can_move;
			
			that=this;
			
			rtn_can_move=that.isLegalMove(initial_qos, final_qos);
			
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
			
			//getNotation() aun sin mover la pieza actual (pero ya lo de enpassant capture y lo de la torre al enrocar)
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
		
		function _getNotation(initial_qos, final_qos, piece_qal, promoted_qal, king_castled, non_en_passant_capture){
			var i, len, that, temp, temp2, temp3, piece_abs_val, initial_file_bos, ambiguity, piece_directions, as_knight, rtn;
			
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
					
					piece_directions=[];
					if(piece_abs_val!==_BISHOP){piece_directions.push(1, 3, 5, 7);}
					if(piece_abs_val!==_ROOK){piece_directions.push(2, 4, 6, 8);}
					
					as_knight=(piece_abs_val===_KNIGHT);
					
					for(i=0, len=piece_directions.length; i<len; i++){//0...1
						if(temp=that.disambiguationPos(final_qos, piece_directions[i], as_knight, piece_abs_val)){temp2.push(temp);}
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
						ascii : _ascii,
						boardHash : _boardHash,
						isEqualBoard : _isEqualBoard,
						cloneBoardFrom : _cloneBoardFrom,
						cloneBoardTo : _cloneBoardTo,
						moveCaller : _moveCaller,
						makeMove : _makeMove,
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
				new_board.firstTimeDefaults(p.isHidden, p.isRotated, p.promoteTo);
				
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
					new_board.firstTimeDefaults(p.isHidden, p.isRotated, p.promoteTo);
				}
				
				rtn=new_board;
				new_board.refreshBoard(0);
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
				animatePiece : _animatePiece,
				getBoardTabsHTML : _getBoardTabsHTML,
				getTableHTML : _getTableHTML,
				basicFenTest : _basicFenTest
			}
		};
	})();
	
	if(!win.Ic){
		win.Ic=Ic;
	}
})(window, jQuery);
