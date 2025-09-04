// parser.js - Syntax analysis for the OptiCompiler

function parse(tokens) {
  let currentTokenIndex = 0;

  function peek() {
    return tokens[currentTokenIndex];
  } 

  function consume(type, value = null) {
    const token = peek();
    if (!token || token.type !== type || (value !== null && token.value !== value)) {
      throw new Error(`Expected token type '${type}'${value ? ` with value '${value}'` : ''}, but got ${token ? `'${token.type}' with value '${token.value}'` : 'end of input'}`);
    }
    currentTokenIndex++;
    return token;
  }

  function parseExpression() {
    let left = parseTerm();

    while (peek() && peek().type === 'OPERATOR' && (peek().value === '+' || peek().value === '-')) {
      const operator = consume('OPERATOR').value;
      const right = parseTerm();
      left = { type: 'binary_operation', operator, left, right };
    }

    return left;
  }

  function parseCondition() {
    let left = parseExpression();

    while (peek() && peek().type === 'OPERATOR' && (peek().value === '==' || peek().value === '!=' || 
           peek().value === '<' || peek().value === '>' || peek().value === '<=' || peek().value === '>=')) {
      const operator = consume('OPERATOR').value;
      const right = parseExpression();
      left = { type: 'binary_operation', operator, left, right };
    }

    return left;
  }

  function parseTerm() {
    let left = parseFactor();

    while (peek() && peek().type === 'OPERATOR' && (peek().value === '*' || peek().value === '/')) {
      const operator = consume('OPERATOR').value;
      const right = parseFactor();
      left = { type: 'binary_operation', operator, left, right };
    }

    return left;
  }

  function parseFactor() {
    if (peek() && peek().type === 'NUMBER') {
      return { type: 'number_literal', value: parseInt(consume('NUMBER').value) };
    } else if (peek() && peek().type === 'IDENTIFIER') {
      return { type: 'identifier', value: consume('IDENTIFIER').value };
    } else if (peek() && peek().type === 'PUNCTUATION' && peek().value === '(') {
      consume('PUNCTUATION', '(');
      const expression = parseExpression();
      consume('PUNCTUATION', ')');
      return expression;
    }
    throw new Error(`Expected number, identifier or parentheses, but got ${peek() ? peek().type : 'end of input'}`);
  }

  function parseStatement() {
    if (peek() && peek().type === 'IDENTIFIER' && tokens[currentTokenIndex + 1]?.type === 'OPERATOR' && tokens[currentTokenIndex + 1]?.value === '=') {
      const identifier = consume('IDENTIFIER').value;
      consume('OPERATOR', '=');
      const expression = parseExpression();
      consume('PUNCTUATION', ';');
      return { type: 'assignment', identifier, expression };
    } else if (peek() && peek().type === 'KEYWORD' && peek().value === 'print') {
      consume('KEYWORD', 'print');
      consume('PUNCTUATION', '(');
      const expression = parseExpression();
      consume('PUNCTUATION', ')');
      consume('PUNCTUATION', ';');
      return { type: 'print', expression };
    } else if (peek() && peek().type === 'KEYWORD' && peek().value === 'if') {
      consume('KEYWORD', 'if');
      consume('PUNCTUATION', '(');
      const condition = parseCondition(); // Use parseCondition for proper condition parsing
      consume('PUNCTUATION', ')');
      consume('PUNCTUATION', '{');
      const thenBlock = parseBlock();
      consume('PUNCTUATION', '}');
      return { type: 'if', condition, thenBlock };
    }
    throw new Error(`Could not parse statement starting with ${peek() ? peek().type : 'end of input'}`);
  }

  function parseBlock() {
    const statements = [];
    while (peek() && (peek().type !== 'PUNCTUATION' || peek().value !== '}')) {
      statements.push(parseStatement());
    }
    return statements;
  }

  const program = [];
  while (currentTokenIndex < tokens.length && peek()) {
    program.push(parseStatement());
  }
  return program;
}