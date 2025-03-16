var the = {
    beautify_in_progress: false
};
 
// this dummy function alleviates Chrome large string corruption by probably shoveling the corruption bug to some other area
if (/chrome/.test(navigator.userAgent.toLowerCase())) {
    String.prototype.old_charAt = String.prototype.charAt;
    String.prototype.charAt = function (n) { return this.old_charAt(n); }
}
 
function unpacker_filter(source) {
    var trailing_comments = '';
    var comment = '';
    var found = false;
 
    do {
        found = false;
              if (/^\s*\/\*/.test(source)) {
                    found = true;
                    comment = source.substr(0, source.indexOf('*/') + 2);
                    source = source.substr(comment.length).replace(/^\s+/, '');
                    trailing_comments += comment + "\n";
                } else if (/^\s*\/\//.test(source)) {
                    found = true;
                    comment = source.match(/^\s*\/\/.*/)[0];
                    source = source.substr(comment.length).replace(/^\s+/, '');
                    trailing_comments += comment + "\n";
                }
    } while (found);
 
    return trailing_comments + source;
}
 
/* 
{
    "indent_size": 4,
    "indent_char": " ",
    "eol": "\n",
    "indent_level": 0,
    "indent_with_tabs": false,
    "preserve_newlines": true,
    "max_preserve_newlines": 10,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "brace_style": "collapse",
    "keep_array_indentation": false,
    "keep_function_indentation": false,
    "space_before_conditional": true,
    "break_chained_methods": false,
    "eval_code": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "wrap_attributes": "auto",
    "wrap_attributes_indent_size": 4,
    "end_with_newline": false
} 
Beautifier Options:
  -s, --indent-size                 Indentation size [4]
  -c, --indent-char                 Indentation character [" "]
  -t, --indent-with-tabs            Indent with tabs, overrides -s and -c
  -e, --eol                         Character(s) to use as line terminators.
                                    [first newline in file, otherwise "\n]
  -n, --end-with-newline            End output with newline
  --editorconfig                    Use EditorConfig to set up the options
  -l, --indent-level                Initial indentation level [0]
  -p, --preserve-newlines           Preserve line-breaks (--no-preserve-newlines disables)
  -m, --max-preserve-newlines       Number of line-breaks to be preserved in one chunk [10]
  -P, --space-in-paren              Add padding spaces within paren, ie. f( a, b )
  -E, --space-in-empty-paren        Add a single space inside empty paren, ie. f( )
  -j, --jslint-happy                Enable jslint-stricter mode
  -a, --space-after-anon-function   Add a space before an anonymous function's parens, ie. function ()
  -b, --brace-style                 [collapse|expand|end-expand|none][,preserve-inline] [collapse,preserve-inline]
  -u, --unindent-chained-methods    Don't indent chained method calls
  -B, --break-chained-methods       Break chained method calls across subsequent lines
  -k, --keep-array-indentation      Preserve array indentation
  -x, --unescape-strings            Decode printable characters encoded in xNN notation
  -w, --wrap-line-length            Wrap lines at next opportunity after N characters [0]
  -X, --e4x                         Pass E4X xml literals through untouched
  --good-stuff                      Warm the cockles of Crockford's heart
  -C, --comma-first                 Put commas at the beginning of new line instead of end
  -O, --operator-position           Set operator position (before-newline|after-newline|preserve-newline) [before-newline]


CSS Beautifier Options:
  -s, --indent-size                  Indentation size [4]
  -c, --indent-char                  Indentation character [" "]
  -t, --indent-with-tabs             Indent with tabs, overrides -s and -c
  -e, --eol                          Character(s) to use as line terminators. (default newline - "\\n")
  -n, --end-with-newline             End output with newline
  -L, --selector-separator-newline   Add a newline between multiple selectors
  -N, --newline-between-rules        Add a newline between CSS rules

HTML Beautifier Options:
  -s, --indent-size                  Indentation size [4]
  -c, --indent-char                  Indentation character [" "]
  -t, --indent-with-tabs             Indent with tabs, overrides -s and -c
  -e, --eol                          Character(s) to use as line terminators. (default newline - "\\n")
  -n, --end-with-newline             End output with newline
  -p, --preserve-newlines            Preserve existing line-breaks (--no-preserve-newlines disables)
  -m, --max-preserve-newlines        Maximum number of line-breaks to be preserved in one chunk [10]
  -I, --indent-inner-html            Indent <head> and <body> sections. Default is false.
  -b, --brace-style                  [collapse-preserve-inline|collapse|expand|end-expand|none] ["collapse"]
  -S, --indent-scripts               [keep|separate|normal] ["normal"]
  -w, --wrap-line-length             Maximum characters per line (0 disables) [250]
  -A, --wrap-attributes              Wrap attributes to new lines [auto|force|force-aligned|force-expand-multiline] ["auto"]
  -i, --wrap-attributes-indent-size  Indent wrapped attributes to after N characters [indent-size] (ignored if wrap-attributes is "force-aligned")
  -U, --unformatted                  List of tags (defaults to inline) that should not be reformatted
  -T, --content_unformatted          List of tags (defaults to pre) that its content should not be reformatted
  -E, --extra_liners                 List of tags (defaults to [head,body,/html] that should have an extra newline before them.
  --editorconfig                     Use EditorConfig to set up the options

*/


 
function beautify(jsString) {
	try {
		if (the.beautify_in_progress) return;
	 
		the.beautify_in_progress = true;
		var source = jsString;
	 
		var indent_size = $('#tabsize').val();
		var indent_char = indent_size == 1 ? 't' : ' ';
		var preserve_newlines = $('#preserve-newlines').attr('checked');
		var keep_array_indentation = $('#keep-array-indentation').attr('checked');
		var brace_style = $('#brace-style').val();
	 
		if ($('#detect-packers').attr('checked')) {
			source = unpacker_filter(source);
		}
	 
		var comment_mark = '<-' + '-';
		var opts = {
					indent_size: indent_size,
					indent_char: indent_char,
					preserve_newlines:preserve_newlines,
					brace_style: brace_style,
					keep_array_indentation:keep_array_indentation,
					space_after_anon_function:true};
		var cssopts = {
					indent_size: indent_size,
					indent_char: indent_char,
					preserve_newlines:preserve_newlines,
					brace_style: brace_style,
					keep_array_indentation:keep_array_indentation};
		var resp = "";
		if (source && source[0] === '<' && source.substring(0, 4) !== comment_mark) {
			//console.log(source)
			console.log("html")
			resp = html_beautify(source, opts);
	
		} else {
		//} else if (source.match(/^(#|\.)?[^{]+{/)) {
		//} else if ( source.match(/(([ \t\r\n]*)([a-zA-Z-]*)([.#]{1,1})([a-zA-Z-]*)([ \t\r\n]*)+)([{]{1,1})((([ \t\r\n]*)([a-zA-Z-]*)([:]{1,1})((([ \t\r\n]*)([a-zA-Z-0-9#]*))+)[;]{1})*)([ \t\r\n]*)([}]{1,1})([ \t\r\n]*)/) ) {
			console.log("css")
			resp = css_beautify(source, cssopts);
		//} else {
		//	console.log("js")
		//	resp = js_beautify(unpacker_filter(source), opts);
		}
	 
		the.beautify_in_progress = false;
		return resp;
	} catch(e) {
		console.log(e)
		return jsString;
	}
}
