const {Ic}=require("../isepic-chess");

Ic.setSilentMode(false);

//---to do:
//
//moveResult
//canDraw
//comment (autogen comments?)

describe("Move properties", () => {
	test("Promotion - white to move", () => {
		var shared_fen;
		
		shared_fen="kr6/7P/8/8/8/8/8/K7 w - - 0 1";
		
		expect(Ic.fenApply(shared_fen, "playMove", ["h8=N"], {skipFenValidation: true}).promotion).toBe("n");
		expect(Ic.fenApply(shared_fen, "playMove", ["h8=B"], {skipFenValidation: true}).promotion).toBe("b");
		expect(Ic.fenApply(shared_fen, "playMove", ["h8=R"], {skipFenValidation: true}).promotion).toBe("r");
		expect(Ic.fenApply(shared_fen, "playMove", ["h8=Q"], {skipFenValidation: true}).promotion).toBe("q");
	});
	
	test("Promotion - black to move", () => {
		var shared_fen;
		
		shared_fen="7k/8/8/8/8/8/p7/6RK b - - 0 1";
		
		expect(Ic.fenApply(shared_fen, "playMove", ["a1=N"], {skipFenValidation: true}).promotion).toBe("n");
		expect(Ic.fenApply(shared_fen, "playMove", ["a1=B"], {skipFenValidation: true}).promotion).toBe("b");
		expect(Ic.fenApply(shared_fen, "playMove", ["a1=R"], {skipFenValidation: true}).promotion).toBe("r");
		expect(Ic.fenApply(shared_fen, "playMove", ["a1=Q"], {skipFenValidation: true}).promotion).toBe("q");
	});
	
	test("Castling - white to move", () => {
		var shared_fen;
		
		shared_fen="r3k2r/1pp1bp1p/3p1n1q/p2Ppb2/1n4p1/1BN1PN2/PPPBQPPP/R3K2R w KQkq - 2 14";
		
		expect(Ic.fenApply(shared_fen, "playMove", ["O-O-O"], {skipFenValidation: true})).toEqual({
			colorMoved: "w",
			colorToPlay: "b",
			fen: "r3k2r/1pp1bp1p/3p1n1q/p2Ppb2/1n4p1/1BN1PN2/PPPBQPPP/2KR3R b kq - 3 14",
			san: "O-O-O",
			uci: "e1c1",
			fromBos: "e1",
			toBos: "c1",
			enPassantBos: "",
			piece: "k",
			captured: "",
			promotion: "",
			comment: "",
			moveResult: "",
			canDraw: false,
			isEnPassantCapture: false
		});
		
		expect(Ic.fenApply(shared_fen, "playMove", ["O-O"], {skipFenValidation: true})).toEqual({
			colorMoved: "w",
			colorToPlay: "b",
			fen: "r3k2r/1pp1bp1p/3p1n1q/p2Ppb2/1n4p1/1BN1PN2/PPPBQPPP/R4RK1 b kq - 3 14",
			san: "O-O",
			uci: "e1g1",
			fromBos: "e1",
			toBos: "g1",
			enPassantBos: "",
			piece: "k",
			captured: "",
			promotion: "",
			comment: "",
			moveResult: "",
			canDraw: false,
			isEnPassantCapture: false
		});
	});
	
	test("Castling - black to move", () => {
		var shared_fen;
		
		shared_fen="r3k2r/1pp1bp1p/3p1n1q/p2Ppb2/Nn4p1/1B2PN2/PPPBQPPP/R3K2R b KQkq - 3 14";
		
		expect(Ic.fenApply(shared_fen, "playMove", ["O-O-O"], {skipFenValidation: true})).toEqual({
			colorMoved: "b",
			colorToPlay: "w",
			fen: "2kr3r/1pp1bp1p/3p1n1q/p2Ppb2/Nn4p1/1B2PN2/PPPBQPPP/R3K2R w KQ - 4 15",
			san: "O-O-O",
			uci: "e8c8",
			fromBos: "e8",
			toBos: "c8",
			enPassantBos: "",
			piece: "k",
			captured: "",
			promotion: "",
			comment: "",
			moveResult: "",
			canDraw: false,
			isEnPassantCapture: false
		});
		
		expect(Ic.fenApply(shared_fen, "playMove", ["O-O"], {skipFenValidation: true})).toEqual({
			colorMoved: "b",
			colorToPlay: "w",
			fen: "r4rk1/1pp1bp1p/3p1n1q/p2Ppb2/Nn4p1/1B2PN2/PPPBQPPP/R3K2R w KQ - 4 15",
			san: "O-O",
			uci: "e8g8",
			fromBos: "e8",
			toBos: "g8",
			enPassantBos: "",
			piece: "k",
			captured: "",
			promotion: "",
			comment: "",
			moveResult: "",
			canDraw: false,
			isEnPassantCapture: false
		});
	});
	
	test("En passant", () => {
		var fen;
		
		fen="rnbqkbnr/ppp1pppp/8/4P3/3p4/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3";
		expect(Ic.fenApply(fen, "playMove", ["c2-c4"], {skipFenValidation: true})).toEqual({
			colorMoved: "w",
			colorToPlay: "b",
			fen: "rnbqkbnr/ppp1pppp/8/4P3/2Pp4/8/PP1P1PPP/RNBQKBNR b KQkq c3 0 3",
			san: "c4",
			uci: "c2c4",
			fromBos: "c2",
			toBos: "c4",
			enPassantBos: "c3",
			piece: "p",
			captured: "",
			promotion: "",
			comment: "",
			moveResult: "",
			canDraw: false,
			isEnPassantCapture: false
		});
		
		fen="rnbqkbnr/ppp1pppp/8/4P3/2Pp4/8/PP1P1PPP/RNBQKBNR b KQkq c3 0 3";
		expect(Ic.fenApply(fen, "playMove", ["d4-c3"], {skipFenValidation: true})).toEqual({
			colorMoved: "b",
			colorToPlay: "w",
			fen: "rnbqkbnr/ppp1pppp/8/4P3/8/2p5/PP1P1PPP/RNBQKBNR w KQkq - 0 4",
			san: "dxc3",
			uci: "d4c3",
			fromBos: "d4",
			toBos: "c3",
			enPassantBos: "",
			piece: "p",
			captured: "p",
			promotion: "",
			comment: "",
			moveResult: "",
			canDraw: false,
			isEnPassantCapture: true
		});
		
		fen="rnbqkbnr/ppp1pppp/8/4P3/3p4/8/PPPP1PPP/RNBQKBNR b KQkq - 0 3";
		expect(Ic.fenApply(fen, "playMove", ["f7-f5"], {skipFenValidation: true})).toEqual({
			colorMoved: "b",
			colorToPlay: "w",
			fen: "rnbqkbnr/ppp1p1pp/8/4Pp2/3p4/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 4",
			san: "f5",
			uci: "f7f5",
			fromBos: "f7",
			toBos: "f5",
			enPassantBos: "f6",
			piece: "p",
			captured: "",
			promotion: "",
			comment: "",
			moveResult: "",
			canDraw: false,
			isEnPassantCapture: false
		});
		
		fen="rnbqkbnr/ppp1p1pp/8/4Pp2/3p4/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 4";
		expect(Ic.fenApply(fen, "playMove", ["e5-f6"], {skipFenValidation: true})).toEqual({
			colorMoved: "w",
			colorToPlay: "b",
			fen: "rnbqkbnr/ppp1p1pp/5P2/8/3p4/8/PPPP1PPP/RNBQKBNR b KQkq - 0 4",
			san: "exf6",
			uci: "e5f6",
			fromBos: "e5",
			toBos: "f6",
			enPassantBos: "",
			piece: "p",
			captured: "p",
			promotion: "",
			comment: "",
			moveResult: "",
			canDraw: false,
			isEnPassantCapture: true
		});
	});
	
	describe("Captures", () => {
		test("Pawn - white to move", () => {
			var shared_fen;
			
			shared_fen="1k6/8/8/Pp1nb1q1/2P2P1r/6P1/8/1K6 w - b6 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["a5-b6"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["c4-b5"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["c4-d5"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-e5"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["g3-h4"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-g5"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("Pawn - black to move", () => {
			var shared_fen;
			
			shared_fen="6k1/8/1p6/R1p2p2/1Q1BN1Pp/8/8/6K1 b - g3 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["h4-g3"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["f5-g4"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["f5-e4"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-d4"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["b6-a5"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-b4"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("Knight - white to move", () => {
			var shared_fen;
			
			shared_fen="k7/8/3bq1p1/Pp1rn3/2N2N2/8/8/K7 w - b6 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["c4-b6"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-g6"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["c4-e5"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["c4-d6"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-d5"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-e6"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("Knight - black to move", () => {
			var shared_fen;
			
			shared_fen="7k/8/8/2n2n2/3NR1Pp/1P1QB3/8/7K b - g3 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["f5-g3"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-b3"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["f5-d4"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["f5-e3"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-e4"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-d3"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("Bishop - white to move", () => {
			var shared_fen;
			
			shared_fen="k7/8/8/Pp2nb1q/3B2B1/4pr2/8/K7 w - b6 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["d4-b6"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["d4-e3"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["d4-e5"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["g4-f5"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["g4-f3"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["g4-h5"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("Bishop - black to move", () => {
			var shared_fen;
			
			shared_fen="7k/8/2RP4/1b2b3/Q1BN2Pp/8/8/7K b - g3 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["e5-g3"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["e5-d6"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["e5-d4"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["b5-c4"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["b5-c6"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["b5-a4"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("Rook - white to move", () => {
			var shared_fen;
			
			shared_fen="k7/2r2n2/2RpbR2/Ppq5/8/8/8/K7 w - b6 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["c6-b6"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["c6-d6"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["f6-f7"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["f6-e6"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["c6-c7"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["c6-c5"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("Rook - black to move", () => {
			var shared_fen;
			
			shared_fen="7k/8/8/8/5QPp/2rBPr2/2N2R2/7K b - g3 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["f3-g3"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["f3-e3"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["c3-c2"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["c3-d3"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["f3-f2"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["f3-f4"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("Queen - white to move", () => {
			var shared_fen;
			
			shared_fen="k7/8/3q4/PpQb4/2rn4/8/8/K7 w - b6 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-b6"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-b5"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-d4"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-d5"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-c4"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-d6"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("Queen - black to move", () => {
			var shared_fen;
			
			shared_fen="7k/8/8/4NR2/4BqPp/4Q3/8/7K b - g3 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-g3"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-g4"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-e5"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-e4"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-f5"], {skipFenValidation: true}).captured).toBe("r");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-e3"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("King - white to move", () => {
			var shared_fen;
			
			shared_fen="2k5/8/2Nr4/PpK5/1n6/8/8/8 w - b6 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-b6"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-b5"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-b4"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-d6"], {skipFenValidation: true}).captured).toBe("r");
			
			shared_fen="2k5/8/2N5/2Kb4/1q6/8/8/8 w - - 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-d5"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["c5-b4"], {skipFenValidation: true}).captured).toBe("q");
		});
		
		test("King - black to move", () => {
			var shared_fen;
			
			shared_fen="8/8/8/6N1/5kPp/4Rn2/8/5K2 b - g3 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-g3"], {skipFenValidation: true}).captured).toBe("");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-g4"], {skipFenValidation: true}).captured).toBe("p");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-g5"], {skipFenValidation: true}).captured).toBe("n");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-e3"], {skipFenValidation: true}).captured).toBe("r");
			
			shared_fen="8/8/8/6Q1/4Bk2/5n2/8/5K2 b - - 0 1";
			
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-e4"], {skipFenValidation: true}).captured).toBe("b");
			expect(Ic.fenApply(shared_fen, "playMove", ["f4-g5"], {skipFenValidation: true}).captured).toBe("q");
		});
	});
});
