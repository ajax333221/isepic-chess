var GIT_README_DOCS_URL="https://github.com/ajax333221/isepic-chess";
var GIT_DOCS_URL=GIT_README_DOCS_URL+"/blob/master/docs/";

var URL_BOARD_PROPS=["board properties", "board-properties.md#board-properties"];
var URL_BOARD_METHODS=["board methods", "board-methods.md#board-methods"];

var URL_SQUARE_PROPS=["square properties", "square-properties.md#square-properties"];

var URL_MOVE_PROPS=["move properties", "move-properties.md#move-properties"];

var PIN_BOARD={
	name : "Board",
	urls : [URL_BOARD_PROPS, URL_BOARD_METHODS]
};

var PIN_SQUARE={
	name : "Square",
	urls : [URL_SQUARE_PROPS]
};

var PIN_MOVE={
	name : "Move",
	urls : [URL_MOVE_PROPS]
};

//=====================================================

var p_board_ch1={
	name : "boardName",
	type : "String",
	isBold : true
};

var p_board_ch2={
	name : "board",
	type : "Object",
	isBold : true
};

var p_board={
	name : "board",
	children : [p_board_ch1, p_board_ch2]
};

//---

var p_qal_ch1={
	name : "squareBal",
	type : "String",
	isBold : true
};

var p_qal_ch2={
	name : "squareAbsBal",
	type : "String",
	isBold : true
};

var p_qal_ch3={
	name : "squareVal",
	type : "Number",
	isBold : true
};

var p_qal_ch4={
	name : "squareAbsVal",
	type : "Number",
	isBold : true
};

var p_qal_ch5={
	name : "squareClassName",
	type : "String",
	isBold : true
};

var p_qal_ch6={
	name : "square",
	type : "Object",
	isBold : true
};

var p_qal={
	name : "qal",
	children : [p_qal_ch1, p_qal_ch2, p_qal_ch3, p_qal_ch4, p_qal_ch5, p_qal_ch6]
};

//---

var p_qos_ch1={
	name : "squareBos",
	type : "String",
	isBold : true
};

var p_qos_ch2={
	name : "squarePos",
	type : "Array",
	isBold : true
};

var p_qos_ch3={
	name : "square",
	type : "Object",
	isBold : true
};

var p_qos={
	name : "qos",
	children : [p_qos_ch1, p_qos_ch2, p_qos_ch3]
};

//---

var p_mov_ch1={
	name : "moveSan",
	type : "String",
	isBold : true
};

var p_mov_ch2={
	name : "moveUci",
	type : "String",
	isBold : true
};

var p_mov_ch3={
	name : "moveJoined",
	type : "String",
	isBold : true
};

var p_mov_ch4={
	name : "moveFen",
	type : "String",
	isBold : true
};

var p_mov_ch5={
	name : "moveFromTo",
	type : "Array",
	isBold : true
};

var p_mov_ch6={
	name : "move",
	type : "Object",
	isBold : true
};

var p_mov={
	name : "mov",
	children : [p_mov_ch1, p_mov_ch2, p_mov_ch3, p_mov_ch4, p_mov_ch5, p_mov_ch6]
};

//=====================================================

function isObj(obj){
	return ((typeof obj)==="object" && obj!==null && !isArr(obj));
}

function isArr(arr){
	return (Object.prototype.toString.call(arr)==="[object Array]");
}

function urlLink(arr){
	var rtn;
	
	rtn="";
	
	if(isArr(arr) && arr.length===2){
		rtn="["+arr[0]+"]("+GIT_DOCS_URL+arr[1]+")";
	}
	
	return rtn;
}

function urlHrefLink(arr){
	var rtn;
	
	rtn="";
	
	if(isArr(arr) && arr.length===2){
		rtn="<a href=\""+GIT_README_DOCS_URL+""+arr[1]+"\">"+arr[0]+"</a>";
	}
	
	return rtn;
}

function overwriteAndUnreference(obj, arr){
	var i, len, temp;
	
	temp={...obj};
	
	for(i=0, len=arr.length; i<len; i++){//0<len
		temp[arr[i][0]]=arr[i][1];
	}
	
	return temp;
}

function docoGenMethodList(obj){
	var i, len, curr_table, rtn;
	
	rtn=[];
	curr_table=Object.keys(obj);
	
	for(i=0, len=curr_table.length; i<len; i++){//0<len
		rtn.push(obj[curr_table[i]].name);
	}
	
	return rtn;
}

function docoGenMethodTable(obj){
	var i, j, len, len2, temp, temp2, temp3, curr_table, res, rtn;
	
	rtn=[];
	curr_table=Object.keys(obj);
	
	for(i=0, len=curr_table.length; i<len; i++){//0<len
		temp=obj[curr_table[i]];
		
		if(temp.description){
			res="**"+curr_table[i]+"**(";
			if(temp.params && temp.params.children && temp.params.children.length){
				temp2=Object.keys(temp.params.children);
				len2=temp2.length;
				
				if(len2){
					temp3=[];
					
					for(j=0; j<len2; j++){//0<len2
						if(temp.params.children[temp2[j]].name){
							temp3.push(temp.params.children[temp2[j]].name);
						}
					}
					
					res+="<br>*"+temp3.join("*,<br>*")+"*<br>";
				}
			}
			res+=")";
			
			res+=" | ";
			
			temp.paramOptions=(isObj(temp.paramOptions) ? temp.paramOptions : {});
			
			res+=getHtmlParam(temp.params, temp.paramOptions);
			
			res+=" | ";
			
			temp.returnValOptions=(isObj(temp.returnValOptions) ? temp.returnValOptions : {});
			
			if(temp.errors){
				temp.returnValOptions.errorTriangle=true;
			}
			
			res+=getHtmlReturnVal(temp.returnVal, temp.returnValOptions);
			
			res+=" | ";
			
			res+=(temp.refreshUi===true ? "Yes" : "No");
			
			res+=" | ";
			
			res+=temp.description.join("<br><br>");
			
			if(temp.examples && temp.examples.length){
				res+="<hr>Example"+(temp.examples.length!==1 ? "s" : "")+":";
				res+="<ul><li>`"+temp.examples.join("`</li><li>`")+"`</li></ul>";
			}
			
			if(temp.links){
				res+="<hr>:pushpin:"+temp.links.name+" documentation link"+(temp.links.urls.length!==1 ? "s" : "")+":";
				
				res+="<ul>";
				
				for(j=0, len2=temp.links.urls.length; j<len2; j++){//0<len2
					res+="<li>"+urlLink(temp.links.urls[j])+".</li>";
				}
				
				res+="</ul>";
			}
			
			if(temp.errors){
				res+="<hr>:small_red_triangle_down:Error emits a `console.log(...)` when:";
				
				res+="<ul>";
				
				for(j=0, len2=temp.errors.length; j<len2; j++){//0<len2
					res+="<li>"+temp.errors[j]+"</li>";
				}
				
				res+="</ul>";
			}
			
			rtn.push(res);
		}
	}
	
	return rtn;
}

function recursiveFormat(obj, options, has_op_params, has_op_keys){
	var i, len, rtn, temp, temp2;
	
	rtn="";
	
	if((typeof obj.name)!=="string" && (typeof obj.type)==="string"){
		obj.name=obj.type;
		
		delete obj.type;
	}
	
	if((typeof obj.name)!=="string"){
		obj.name="";
	}
	
	if(options && (typeof options.removeKey)==="string"){
		if(obj.name===options.removeKey){
			return {html:"", hasOpParams:false, hasOpKeys:false};
		}
	}
	
	if((typeof obj.icon)==="string"){
		rtn+=":"+obj.icon+":";
		
		if(obj.icon==="eight_pointed_black_star"){
			has_op_params=true;
		}
		
		if(obj.icon==="eight_spoked_asterisk"){
			has_op_keys=true;
		}
	}
	
	if(obj.isCode){
		rtn+="`";
	}else if(obj.isBold){
		rtn+="**";
	}
	
	rtn+=obj.name;
	
	if(obj.isCode){
		rtn+="`";
	}else if(obj.isBold){
		rtn+="**";
	}
	
	if((typeof obj.type)==="string"){
		rtn+=" ("+obj.type+")";
	}
	
	if((typeof obj.codeAfter)==="string"){
		rtn+=(rtn ? ": " : "")+"`"+obj.codeAfter+"`";
	}else if(obj.children && obj.children.length){
		temp="";
		
		for(i=0, len=obj.children.length; i<len; i++){//0<len
			temp2=recursiveFormat(obj.children[i], options, has_op_params, has_op_keys);
			
			if(temp2.html!==""){
				temp+="<li>"+temp2.html+"</li>";
				
				if(temp2.hasOpParams){
					has_op_params=true;
				}
				
				if(temp2.hasOpKeys){
					has_op_keys=true;
				}
			}
		}
		
		if(temp){
			rtn+=(rtn ? ":" : "")+"<ul>"+temp+"</ul>";
		}
	}
	
	return {html:rtn, hasOpParams:has_op_params, hasOpKeys:has_op_keys};
}

function getHtmlParam(obj, p){
	var call_res, rtn;
	
	rtn="-";
	
	call_res=recursiveFormat(obj, p);
	
	if(call_res.html!==""){
		rtn=call_res.html;
		
		if(call_res.hasOpParams || call_res.hasOpKeys){
			rtn+="<hr>";
			
			if(call_res.hasOpParams){
				rtn+=":eight_pointed_black_star:Optional Parameter";
			}
			
			if(call_res.hasOpParams && call_res.hasOpKeys){
				rtn+="<br>";
			}
			
			if(call_res.hasOpKeys){
				rtn+=":eight_spoked_asterisk:Optional Object key";
			}
		}
	}
	
	return rtn;
}

function getHtmlReturnVal(obj, p){
	var call_res, rtn;
	
	rtn="-";
	
	if(isArr(obj) && obj.length===2){
		rtn="Success:";
		
		call_res=recursiveFormat(obj[0], p);
		
		if(call_res.html!==""){
			rtn+=call_res.html;
		}else{
			rtn+="<ul><li>-</li></ul>";
		}
		
		rtn+="<hr>";
		
		if(p && p.errorTriangle){
			rtn+=":small_red_triangle_down:";
		}
		
		rtn+="Error:";
		
		call_res=recursiveFormat(obj[1], p);
		
		if(call_res.html!==""){
			rtn+=call_res.html;
		}else{
			rtn+="<ul><li>-</li></ul>";
		}
	}else if(isObj(obj)){
		call_res=recursiveFormat(obj, p);
		
		if(call_res.html!==""){
			if(call_res.html.slice(0, 8)==="<ul><li>" && call_res.html.slice(-10)==="</li></ul>"){
				call_res.html=call_res.html.slice(8, -10);
			}
			
			rtn=call_res.html;
		}
	}
	
	return rtn;
}
