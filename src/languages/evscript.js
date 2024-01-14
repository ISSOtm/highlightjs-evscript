/*
Language: evscript
Requires: rgbasm
Author: Eldred Habert <me@eldred.fr>
Contributors:
Description: A bytecode script definition language for the Game Boy
Website: https://eievui5.github.io/evscript
*/

const IDEN = /\b(?!env\b|use\b|include\b|def\b|alias\b|macro\b|pool\b|const\b|return\b|yield\b|typedef\b|struct\b|ptr\b|if\b|else\b|while\b|do\b|for\b|repeat\b|loop\b)[a-zA-Z_][a-zA-Z0-9_.]*\b/;
const KEYWORDS = {
	$pattern: IDEN,
	keyword: "env use include def alias macro pool const return yield typedef|2 struct ptr if else while do for repeat|2 loop",
	built_in: "yld|5 ret|2",
};

export default function(hljs) {
	const EXPR = [
		hljs.C_BLOCK_COMMENT_MODE,
		hljs.C_LINE_COMMENT_MODE,
		hljs.NUMBER_MODE,
		hljs.QUOTE_STRING_MODE,
		{ match: /[\[\]()]/, scope: "punctuation" },
		{ match: /[!&^|<>*/%+-]|&&|\|\||[=!<>]=|<<|>>/, scope: "operator" },
	];

	function def_scope(name, scope) {
		return {
			begin: [/\bdef\b/, /\s+/, name, /\s*/, /\(/],
			beginScope: { 1:"keyword", 3:scope, 5:"punctuation" },
			end: [/\)/, /;/],
			endScope: { 1: "punctuation", 2: "punctuation" },
			endsWithParent: true,
			keywords: {
				$pattern: IDEN,
				literal: "u8 u16",
				keyword: "return const",
			},
			contains: [
				hljs.C_BLOCK_COMMENT_MODE,
				hljs.C_LINE_COMMENT_MODE,
				{ match: ",", scope: "punctuation" },
				{ match: IDEN, scope: "type" },
			],
		};
	}

	return {
		name: "evscript",
		aliases: "evs",
		disableAutodetect: true,
		contains: [
			hljs.C_LINE_COMMENT_MODE,
			hljs.C_BLOCK_COMMENT_MODE,
			{
				begin: /#asm/,
				beginScope: "meta",
				end: /#end/,
				endScope: "meta",
				relevance: 10,
				subLanguage: "rgbasm",
			},
			{
				beginKeywords: "include",
				end: /;/,
				endScope: "punctuation",
				contains: [hljs.QUOTE_STRING_MODE, hljs.C_BLOCK_COMMENT_MODE, hljs.C_LINE_COMMENT_MODE],
			},
			{
				begin: [/\btypedef\b/, /\s+/, IDEN, /\s*/, /=/],
				beginScope: { 1:"keyword", 3:"title.class", 5:"operator" },
				end: /;/,
				endScope: "punctuation",
				scope: "type",
				keywords: {
					built_in: "u8 u16",
				},
				contains: [hljs.C_BLOCK_COMMENT_MODE, hljs.C_LINE_COMMENT_MODE],
			},
			{
				begin: [/\bstruct\b/, /\s+/, IDEN, /\s*/, /\{/],
				beginScope: { 1:"keyword", 3:"title.class", 5:"punctuation" },
				end: /\}/,
				endScope: "punctuation",
				contains: [
					hljs.C_LINE_COMMENT_MODE,
					hljs.C_BLOCK_COMMENT_MODE,
					{
						begin: [IDEN, /\s*/, /:/],
						beginScope: { 1:"property", 3:"punctuation" },
						end: /,/,
						endScope: "punctuation",
						endsWithParent: true,
						scope: "type",
						keywords: {
							built_in: "u8 u16",
						},
					}
				],
			},
			{
				begin: [/\benv\b/, /\s+/, IDEN, /\s*/, /\{/],
				beginScope: { 1:"keyword", 3:"title.class", 5:"punctuation" },
				end: /\}/,
				endScope: "punctuation",
				contains: [
					hljs.C_LINE_COMMENT_MODE,
					hljs.C_BLOCK_COMMENT_MODE,
					{
						begin: [/\buse\b/, /\s+/, IDEN, /\s*/, /;/],
						beginScope: { 1:"keyword", 3:"title.class.inherited", 5:"punctuation" },
					},
					def_scope(/\byld\b/, "built_in"),
					def_scope(/\bret\b/, "built_in"),
					def_scope(IDEN, "title.function"),
					{
						begin: [/\bpool\b/, /\s*/, /=/],
						beginScope: { 1:"keyword", 3:"operator" },
						end: /;/,
						endScope: "punctuation",
						endsWithParent: true,
						contains: EXPR,
					},
					{
						begin: [/\balias\b/, /\s+/, IDEN, /\s*/, /\(/],
						beginScope: { 1:"keyword", 3:"title.function", 5:"punctuation" },
						end: /\)/,
						endScope: "punctuation",
						keywords: {
							built_in: "u8 u16",
						},
						contains: [
							hljs.C_BLOCK_COMMENT_MODE, hljs.C_LINE_COMMENT_MODE,
							{ match: IDEN, scope: "type" },
							{ match: /,/, scope: "punctuation" },
						],
						starts: {
							begin: [/=/, /\s*/, IDEN, /\s*/, /\(/],
							beginScope: { 1:"operator", 5:"punctuation" },
							end: /;/,
							endScope: "punctuation",
							contains: [
								{ match: /\$\s*[0-9]*/, scope: "meta" },
								{ match: /,/, scope: "punctuation" },
								...EXPR,
							],
						}
					},
					{
						begin: [/\bmacro\b/, /\s+/, IDEN, /\s*/, /\(/],
						beginScope: { 1:"keyword", 3:"title.function", 5:"punctuation" },
						end: [/\)/, /\s*/, /=/, /\s*/, IDEN, /\s*/, /;/],
						endScope: { 1:"punctuation", 3:"operator", 7:"punctuation" },
						keywords: {
							built_in: "u8 u16",
						},
						contains: [
							hljs.C_BLOCK_COMMENT_MODE, hljs.C_LINE_COMMENT_MODE,
							{ match: IDEN, scope: "type" },
							{ match: /,/, scope: "punctuation" },
						],
					}
				],
			},
			{
				begin: [IDEN, /\s+/, IDEN, /\s*/, /\{/],
				beginScope: { 1:"type", 3:"title.class", 5:"punctuation" },
				starts: {
					begin: /\{/,
					beginScope: "punctuation",
					end: /\}/,
					endScope: "punctuation",
					scope: "code",
					keywords: 'if else while do for repeat loop',
					contains: [
						{ match: /;/, scope: "punctuation" },
						{
							begin: [IDEN, /\s*/, /[-+*/%&|^]?=(?!=)|<<=|>>=/],
							beginScope: { 3:"operator" },
							end: /;/,
							endScope: "punctuation",
							contains: EXPR,
						},
						{
							beginKeywords: "return yield",
							end: /;/,
							endScope: "punctuation",
							contains: [hljs.C_BLOCK_COMMENT_MODE],
						},
						{
							begin: [IDEN, /\s+/, IDEN, /\s*/, /=?(?!=)/],
							beginScope: { 1:"type", 3:"variable", 5:"operator" },
							end: /;/,
							endScope: "punctuation",
							contains: EXPR,
						},
						{
							begin: [IDEN, /\s+/, /\bptr\b/, /\s+/, IDEN, /\s*/, /=?(?!=)/],
							beginScope: { 1:"type", 3:"keyword", 5:"variable", 7:"operator" },
							end: /;/,
							endScope: "punctuation",
							contains: EXPR,
						},
						...EXPR,
						"self", // Blocks.
					],
				},
			},
		]
	}
}
