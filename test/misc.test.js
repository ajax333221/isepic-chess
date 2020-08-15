const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

describe("Misc.", () => {
	describe("Regression tests", () => {
		var board_name, other_board_name;
		
		board_name="board_regression_tests";
		other_board_name="board_regression_tests_other";
		
		test("enpassant capture applied to other non enpassant moves", () => {
			expect(Ic.mapToBos(Ic.fenApply("r1b1kbnr/ppp3pp/3q4/P2nPp2/3p4/7K/1PP2PP1/RNBQ1BNR w kq f6 0 10", "legalMoves", ["e5"])).sort()).toEqual(["d6", "e6"].sort());
		});
		
		test("Ic.toPos() returns a reference", () => {
			var temp, board_obj;
			
			board_obj=Ic.initBoard({
				boardName : board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			temp=Ic.toPos(board_obj.Squares["a2"].pos);
			
			expect(temp===Ic.toPos(board_obj.Squares["a2"].pos).sort()).toBe(false);
		});
		
		test("b.getSquare() isUnreferenced not working", () => {
			var temp, temp2, board_obj, board_other;
			
			board_obj=Ic.selectBoard(board_name);
			
			temp=board_obj.getSquare("b2", {isUnreferenced : false});
			temp2=board_obj.getSquare("b2", {isUnreferenced : true});
			
			board_obj.moveCaller("b2", "b3");
			board_obj.moveCaller("h7", "h6");
			board_obj.moveCaller("c1", "b2");
			
			expect(temp.isBishop).toBe(true);
			expect(temp2.isPawn).toBe(true);
			
			board_other=Ic.initBoard({
				boardName : other_board_name,
				fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				isHidden : true,
				invalidFenStop : true
			});
			
			temp=board_other.getSquare("b2", {isUnreferenced : false});
			
			expect(temp.isPawn).toBe(true);
			
			Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
			
			temp2=board_other.getSquare("b2", {isUnreferenced : false});
			
			board_obj.moveCaller("h6", "h5");
			board_obj.moveCaller("b2", "c1");
			
			expect(temp.isBishop).toBe(true);
			expect(temp2.isBishop).toBe(true);
			expect(board_obj.getSquare("b2", {isUnreferenced : false}).isEmptySquare).toBe(true);
			expect(board_obj.getSquare("b2", {isUnreferenced : true}).isEmptySquare).toBe(true);
		});
		
		describe("Ic.utilityMisc.cloneBoardObjs()", () => {
			test("cloning unmutable Squares.x.pos", () => {
				var temp, temp2, board_obj, board_other;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
					isHidden : true,
					invalidFenStop : true
				});
				
				board_other=Ic.initBoard({
					boardName : other_board_name,
					fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
					isHidden : true,
					invalidFenStop : true
				});
				
				temp=board_obj.getSquare("e4", {isUnreferenced : false});
				temp2=board_other.getSquare("e4", {isUnreferenced : false});
				
				expect(temp.pos).toEqual(temp2.pos);
				expect(temp.pos===temp2.pos).toEqual(false);
				
				temp.pos=[0, 0];
				
				expect(board_obj.getSquare("e4", {isUnreferenced : false}).pos).toEqual([0, 0]);
				
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				
				expect(temp2.pos).not.toEqual([0, 0]);
				expect(temp.pos===temp2.pos).toEqual(false);
			});
			
			test("MaterialDiff not applied to new []", () => {
				var board_obj, board_other;
				
				board_obj=Ic.initBoard({
					boardName : board_name,
					fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
					isHidden : true,
					invalidFenStop : true
				});
				
				board_other=Ic.initBoard({
					boardName : other_board_name,
					fen : "8/2kq4/2pn4/7p/1P5P/2PB2P1/2KR4/8 w - - 0 1",
					isHidden : true,
					invalidFenStop : true
				});
				
				expect(board_other.MaterialDiff).toEqual({w:[1, 1, 3, 4], b:[-2, -5]});
				
				Ic.utilityMisc.cloneBoardObjs(board_other, board_obj);
				
				expect(board_other.MaterialDiff).toEqual({w:[], b:[]});
			});
		});
	});
	
	test("Invalid FEN positions that only the refined FEN test catches", () => {
		var i, len, arr;
		
		arr=[
			"8/8/4R3/2K5/3N2B1/8/4k3/8 b - - 0 1",
			"8/7q/8/1k1p4/4K3/6n1/8/8 w - - 0 1",
			"8/7q/5n2/1k1p4/4K3/6n1/8/4r3 w - - 0 1",
			"8/8/8/1K6/5k2/6P1/8/8 w - - 0 1",
			"8/8/8/1K6/1r3k2/8/8/8 b - - 0 1",
			"8/8/8/1K6/1r3k2/6P1/8/8 b - - 0 1",
			"8/8/8/1K6/1r3k2/6P1/8/8 w - - 0 1",
			"8/8/4N3/1K6/5k2/8/8/8 w - - 0 1",
			"8/8/4K3/4k3/8/8/8/8 w - - 0 1",
			"8/8/2K5/8/6P1/2k5/8/8 w - g3 0 1",
			"8/8/2K5/6p1/6P1/2k5/8/8 b - g6 0 1",
			"8/8/2K5/8/8/2k5/8/8 w - g6 0 1",
			"8/8/2K3N1/6p1/8/2k5/8/8 w - g6 0 1",
			"8/8/2K3N1/6p1/6P1/2k3n1/8/8 b - g3 0 1",
			"8/8/2K5/8/6p1/2k5/8/8 w - g3 0 1",
			"8/8/2K5/8/6p1/2k5/8/8 b - g3 0 1",
			"8/8/2K5/6P1/8/2k5/8/8 w - g6 0 1",
			"8/8/2K5/6P1/8/2k5/8/8 b - g6 0 1",
			"8/7P/2k4P/7P/7P/2K4P/7P/8 w - - 0 1",
			"8/P7/P1k5/P7/P7/P1K5/P7/8 w - - 0 1",
			"3knbnr/2pppppp/8/P7/P7/P3K3/P7/8 w - - 0 1",
			"8/7p/2k4p/7p/7p/7p/PPPPPP2/K7 w - - 0 1",
			"rnbq1rk1/ppppppbp/5np1/8/8/4P3/PPPPP1PP/4K3 w - - 0 1",
			"rnbq1rk1/1pppppbp/5np1/8/4P3/4P3/PPP1P1PP/4K3 w - - 0 1",
			"rnbq1rk1/3pppbp/5np1/4P3/4P3/4P3/PP2P1PP/4K3 w - - 0 1",
			"4K3/8/8/8/8/4k3/8/8 w KQ - 0 1",
			"8/4K3/8/8/8/8/8/4k3 w kq - 0 1",
			"8/8/2k5/8/8/8/8/4K2R w Q - 0 1",
			"8/8/2k5/8/8/8/8/r3K3 w K - 0 1",
			"8/8/2k5/8/8/8/8/4K3 w K - 0 1",
			"8/8/2k5/8/8/8/8/4K3 w Q - 0 1",
			"8/8/2k5/8/8/8/8/4K3 w KQ - 0 1",
			"4K3/8/2k5/8/8/8/8/R6R w KQ - 0 1",
			"r6r/8/8/8/2K5/8/8/4k3 w kq - 0 1",
			"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 1 1",
			"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 5 3",
			"rnbqkb1r/pppppppp/8/8/3N1n2/8/PPPPPPPP/RNBQKB1R b KQkq - 8 4",
			"rnbqkb1r/pppppppp/8/5N2/5n2/8/PPPPPPPP/RNBQKB1R w KQkq - 7 4"
		];
		
		for(i=0, len=arr.length; i<len; i++){//0<len
			Ic.setSilentMode(true);
			expect(Ic.fenApply(arr[i], "isLegalFen")).toBe(false);
			Ic.setSilentMode(false);
			
			expect(Ic.utilityMisc.basicFenTest(arr[i])).toBe("");
		}
	});
});
