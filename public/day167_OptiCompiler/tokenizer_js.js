// tokenizer.js - Lexical analysis for the OptiCompiler

function tokenize(code) {
  const tokens = [];
  const tokenPatterns = [
    { type: 'KEYWORD', regex: /^(if|else|while|print)\b/ },
    { type: 'IDENTIFIER', regex: /^[a-zA-Z_][a-zA-Z0-9_]*/ },
    { type: 'NUMBER', regex: /^\d+(\.\d+)?\b/ },
    { type: 'OPERATOR', regex: /^(==|!=|<=|>=|\+|\-|\*|\/|=|<|>)/ },
    { type: 'PUNCTUATION', regex: /^([;\{\}\(\)])/ },
    { type: 'WHITESPACE', regex: /^\s+/ },
  ];

  let position = 0;
  while (position < code.length) {
    let match = null;
    for (const pattern of tokenPatterns) {
      const regexMatch = code.substring(position).match(pattern.regex);
      if (regexMatch && regexMatch.index === 0) {
        match = { type: pattern.type, value: regexMatch[0] };
        break;
      }
    }

    if (match) {
      if (match.type !== 'WHITESPACE') {
        tokens.push(match);
      }
      position += match.value.length;
    } else {
      console.error(`Unexpected character at position ${position}: ${code[position]}`);
      throw new Error(`Unexpected character at position ${position}: ${code[position]}`);
    }
  }
  return tokens;
}