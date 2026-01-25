var GIT_README_DOCS_URL = 'https://github.com/ajax333221/isepic-chess';
var GIT_DOCS_URL = GIT_README_DOCS_URL + '/blob/master/docs/';

var URL_BOARD_PROPS = ['board properties', 'board-properties.md#board-properties'];
var URL_BOARD_METHODS = ['board methods', 'board-methods.md#board-methods'];

var URL_SQUARE_PROPS = ['square properties', 'square-properties.md#square-properties'];

var URL_MOVE_PROPS = ['move properties', 'move-properties.md#move-properties'];

var PIN_BOARD = {
  name: 'Board',
  urls: [URL_BOARD_PROPS, URL_BOARD_METHODS],
};

var PIN_SQUARE = {
  name: 'Square',
  urls: [URL_SQUARE_PROPS],
};

var PIN_MOVE = {
  name: 'Move',
  urls: [URL_MOVE_PROPS],
};

//=====================================================

var p_board_ch1 = {
  name: 'boardName',
  type: 'String',
  isBold: true,
};

var p_board_ch2 = {
  name: 'board',
  type: 'Object',
  isBold: true,
};

var p_board = {
  name: 'board',
  children: [p_board_ch1, p_board_ch2],
};

//---

var p_qal_ch1 = {
  name: 'squareBal',
  type: 'String',
  isBold: true,
};

var p_qal_ch2 = {
  name: 'squareAbsBal',
  type: 'String',
  isBold: true,
};

var p_qal_ch3 = {
  name: 'squareVal',
  type: 'Number',
  isBold: true,
};

var p_qal_ch4 = {
  name: 'squareAbsVal',
  type: 'Number',
  isBold: true,
};

var p_qal_ch5 = {
  name: 'squareClassName',
  type: 'String',
  isBold: true,
};

var p_qal_ch6 = {
  name: 'square',
  type: 'Object',
  isBold: true,
};

var p_qal = {
  name: 'qal',
  children: [p_qal_ch1, p_qal_ch2, p_qal_ch3, p_qal_ch4, p_qal_ch5, p_qal_ch6],
};

//---

var p_qos_ch1 = {
  name: 'squareBos',
  type: 'String',
  isBold: true,
};

var p_qos_ch2 = {
  name: 'squarePos',
  type: 'Array',
  isBold: true,
};

var p_qos_ch3 = {
  name: 'square',
  type: 'Object',
  isBold: true,
};

var p_qos = {
  name: 'qos',
  children: [p_qos_ch1, p_qos_ch2, p_qos_ch3],
};

//---

var p_mov_ch1 = {
  name: 'moveSan',
  type: 'String',
  isBold: true,
};

var p_mov_ch2 = {
  name: 'moveUci',
  type: 'String',
  isBold: true,
};

var p_mov_ch3 = {
  name: 'moveJoined',
  type: 'String',
  isBold: true,
};

var p_mov_ch4 = {
  name: 'moveFen',
  type: 'String',
  isBold: true,
};

var p_mov_ch5 = {
  name: 'moveFromTo',
  type: 'Array',
  isBold: true,
};

var p_mov_ch6 = {
  name: 'move',
  type: 'Object',
  isBold: true,
};

var p_mov = {
  name: 'mov',
  children: [p_mov_ch1, p_mov_ch2, p_mov_ch3, p_mov_ch4, p_mov_ch5, p_mov_ch6],
};

//=====================================================

function isObj(obj) {
  return typeof obj === 'object' && obj !== null && !isArr(obj);
}

function isArr(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

function urlLink(arr) {
  var rtn;

  rtn = '';

  if (isArr(arr) && arr.length === 2) {
    rtn = '[' + arr[0] + '](' + GIT_DOCS_URL + arr[1] + ')';
  }

  return rtn;
}

function urlHrefLink(arr) {
  var rtn;

  rtn = '';

  if (isArr(arr) && arr.length === 2) {
    rtn = '<a href="' + GIT_README_DOCS_URL + '' + arr[1] + '">' + arr[0] + '</a>';
  }

  return rtn;
}

function overwriteAndUnreference(obj, arr) {
  var i, len, temp;

  temp = { ...obj };

  for (i = 0, len = arr.length; i < len; i++) {
    //0<len
    temp[arr[i][0]] = arr[i][1];
  }

  return temp;
}

//=====================================================

function docoGenMethodList(obj) {
  var i, len, curr_table, rtn;

  rtn = [];
  curr_table = Object.keys(obj);

  for (i = 0, len = curr_table.length; i < len; i++) {
    //0<len
    rtn.push(obj[curr_table[i]].name);
  }

  return rtn;
}

// Generate signature string like: loadFen(fen, p?)
function getSignature(method) {
  var params = [];
  
  if (method.params && method.params.children && method.params.children.length) {
    for (var i = 0; i < method.params.children.length; i++) {
      var param = method.params.children[i];
      var paramName = param.name || '';
      var isOptional = param.icon === 'eight_pointed_black_star';
      
      if (paramName) {
        params.push(isOptional ? paramName + '?' : paramName);
      }
    }
  }
  
  return method.name + '(' + params.join(', ') + ')';
}

// Format a parameter for display
function formatParam(param, indent) {
  indent = indent || 0;
  var prefix = '  '.repeat(indent);
  var result = '';
  var isOptional = param.icon === 'eight_pointed_black_star' || param.icon === 'eight_spoked_asterisk';
  
  // Parameter name and type
  var line = prefix + '- ';
  
  // Handle case where there's only a type (no name) - used in return values
  if (!param.name && param.type) {
    line += '`' + param.type + '`';
  } else if (param.isBold && param.name) {
    line += '**' + param.name + '**';
    if (param.type) {
      line += ' `(' + param.type + ')`';
    }
  } else if (param.name) {
    line += '`' + param.name + '`';
    if (param.type) {
      line += ' `(' + param.type + ')`';
    }
  }
  
  if (isOptional) {
    line += ' — *optional*';
  }
  
  if (param.codeAfter) {
    line += ' — `' + param.codeAfter + '`';
  }
  
  result += line + '\n';
  
  // Children (nested params or union types)
  if (param.children && param.children.length) {
    for (var i = 0; i < param.children.length; i++) {
      result += formatParam(param.children[i], indent + 1);
    }
  }
  
  return result;
}

// Format parameters section
function formatParams(params) {
  if (!params || !params.children || !params.children.length) {
    return '*None*\n';
  }
  
  var result = '';
  for (var i = 0; i < params.children.length; i++) {
    result += formatParam(params.children[i], 0);
  }
  
  return result;
}

// Format return value
function formatReturn(returnVal) {
  if (!returnVal) {
    return '*None*\n';
  }
  
  var result = '';
  
  if (isArr(returnVal) && returnVal.length === 2) {
    // Success/Error pattern
    result += '**On success:**\n';
    if (returnVal[0].children && returnVal[0].children.length) {
      for (var i = 0; i < returnVal[0].children.length; i++) {
        result += formatParam(returnVal[0].children[i], 0);
      }
    }
    
    result += '\n**On error:**\n';
    if (returnVal[1].children && returnVal[1].children.length) {
      for (var i = 0; i < returnVal[1].children.length; i++) {
        result += formatParam(returnVal[1].children[i], 0);
      }
    }
  } else if (isObj(returnVal)) {
    if (returnVal.children && returnVal.children.length) {
      for (var i = 0; i < returnVal.children.length; i++) {
        result += formatParam(returnVal.children[i], 0);
      }
    } else if (returnVal.name || returnVal.type) {
      result += formatParam(returnVal, 0);
    }
  }
  
  return result || '*None*\n';
}

// Count total nested params to determine complexity
function countNestedParams(params) {
  if (!params || !params.children) return 0;
  var count = params.children.length;
  for (var i = 0; i < params.children.length; i++) {
    if (params.children[i].children) {
      count += countNestedParams(params.children[i]);
    }
  }
  return count;
}

// Generate single method documentation
function docoGenMethod(methodKey, method) {
  var res = '';
  
  // Method header with anchor
  res += '---\n\n';
  res += '### `' + getSignature(method) + '`\n\n';
  
  // UI refresh badge
  if (method.refreshUi === true) {
    res += '> 🔄 **Triggers UI refresh**\n\n';
  }
  
  // Description
  if (method.description && method.description.length) {
    for (var i = 0; i < method.description.length; i++) {
      res += method.description[i] + '\n\n';
    }
  }
  
  // Parameters section (always collapsible)
  var totalParams = countNestedParams(method.params);
  var hasParams = totalParams > 0;
  
  if (hasParams) {
    res += '<details>\n<summary><strong>Parameters</strong></summary>\n\n';
    res += formatParams(method.params);
    res += '\n</details>\n\n';
  } else {
    res += '**Parameters:** None\n\n';
  }
  
  // Returns section
  res += '**Returns:**\n\n';
  res += formatReturn(method.returnVal);
  res += '\n';
  
  // Examples section
  if (method.examples && method.examples.length) {
    res += '**Examples:**\n\n';
    res += '```javascript\n';
    for (var i = 0; i < method.examples.length; i++) {
      res += method.examples[i] + '\n';
    }
    res += '```\n\n';
  }
  
  // Related documentation links
  if (method.links) {
    res += '**See also:** ';
    var links = [];
    for (var i = 0; i < method.links.urls.length; i++) {
      links.push(urlLink(method.links.urls[i]));
    }
    res += links.join(', ') + '\n\n';
  }
  
  // Errors section
  if (method.errors && method.errors.length) {
    res += '> ⚠️ **Errors:**\n';
    for (var i = 0; i < method.errors.length; i++) {
      res += '> - ' + method.errors[i] + '\n';
    }
    res += '\n';
  }
  
  return res;
}

// Generate all methods documentation
function docoGenMethods(obj) {
  var rtn = [];
  var curr_table = Object.keys(obj);
  
  for (var i = 0, len = curr_table.length; i < len; i++) {
    var methodKey = curr_table[i];
    var method = obj[methodKey];
    
    if (method.description) {
      rtn.push(docoGenMethod(methodKey, method));
    }
  }
  
  return rtn;
}

// Generate table of contents
function docoGenToc(obj) {
  var curr_table = Object.keys(obj);
  var result = '';
  
  for (var i = 0, len = curr_table.length; i < len; i++) {
    var method = obj[curr_table[i]];
    if (method.description) {
      // Create anchor link
      var anchor = method.name.toLowerCase();
      result += '- [`' + method.name + '()`](#' + method.name.toLowerCase() + ')\n';
    }
  }
  
  return result;
}

// Quick reference table (simplified)
function docoGenQuickRef(obj) {
  var result = '';
  result += '| Method | Returns | UI? | Brief |\n';
  result += '|--------|---------|-----|-------|\n';
  
  var curr_table = Object.keys(obj);
  
  for (var i = 0, len = curr_table.length; i < len; i++) {
    var method = obj[curr_table[i]];
    if (method.description) {
      var returnType = '-';
      if (method.returnVal) {
        if (isArr(method.returnVal)) {
          returnType = getSimpleType(method.returnVal[0]);
        } else {
          returnType = getSimpleType(method.returnVal);
        }
      }
      
      var brief = method.description[0] || '';
      // Clean up markdown formatting for table display
      brief = brief
        .replace(/\*\*/g, '')           // Remove bold
        .replace(/:pushpin:/g, '')       // Remove emoji shortcodes
        .replace(/:zap:/g, '')
        .replace(/:warning:/g, '')
        .replace(/`[^`]+`/g, function(m) { return m.slice(1, -1); }) // Remove code backticks but keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Convert links to just text
      
      // Truncate
      if (brief.length > 55) {
        brief = brief.substring(0, 55) + '...';
      }
      
      result += '| `' + method.name + '()` | ' + returnType + ' | ' + (method.refreshUi ? '✓' : '-') + ' | ' + brief + ' |\n';
    }
  }
  
  return result;
}

function getSimpleType(returnObj) {
  if (!returnObj) return '-';
  
  if (returnObj.children && returnObj.children.length) {
    var child = returnObj.children[0];
    // Prefer the name if it's bold (meaning it's a meaningful type name like "move", "square")
    if (child.isBold && child.name) {
      return '**' + child.name + '**';
    }
    if (child.type) {
      return '`' + child.type + '`';
    }
    if (child.name) {
      return '`' + child.name + '`';
    }
  }
  
  if (returnObj.type) {
    return '`' + returnObj.type + '`';
  }
  
  if (returnObj.name) {
    return returnObj.isBold ? '**' + returnObj.name + '**' : '`' + returnObj.name + '`';
  }
  
  return '-';
}
