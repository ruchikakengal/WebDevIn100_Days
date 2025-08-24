// optimizer.js - Code optimization for the OptiCompiler

function optimize(ast) {
  let optimizedCode = "";
  const symbolTable = {};
  const usedVariables = new Set();
  const expressionCache = new Map(); // Cache for expressions to maintain consistency

  // Helper function to create a consistent string representation of an expression for caching
  function getExpressionKey(node) {
    if (typeof node === 'number') {
      return node.toString();
    } else if (node.type === 'identifier') {
      return node.value;
    } else if (node.type === 'binary_operation') {
      const left = getExpressionKey(node.left);
      const right = getExpressionKey(node.right);
      return `(${left}${node.operator}${right})`;
    }
    return JSON.stringify(node);
  }

  // Full evaluation of all expressions and variable tracking
  function fullEvaluate(node) {
    // If we've seen this exact expression before, return the cached value
    const exprKey = getExpressionKey(node);
    if (expressionCache.has(exprKey)) {
      return expressionCache.get(exprKey);
    }
    
    let result;
    
    if (node.type === 'number_literal') {
      result = node.value;
    } else if (node.type === 'identifier') {
      usedVariables.add(node.value);
      result = symbolTable[node.value] !== undefined ? 
              fullEvaluate(symbolTable[node.value]) : node;
    } else if (node.type === 'binary_operation') {
      const left = fullEvaluate(node.left);
      const right = fullEvaluate(node.right);

      if (typeof left === 'number' && typeof right === 'number') {
        switch (node.operator) {
          case '+': result = left + right; break;
          case '-': result = left - right; break;
          case '*': result = left * right; break;
          case '/': result = Math.floor(left / right); break; // Integer division
          case '==': result = left === right ? 1 : 0; break;
          case '!=': result = left !== right ? 1 : 0; break;
          case '<': result = left < right ? 1 : 0; break;
          case '>': result = left > right ? 1 : 0; break;
          case '<=': result = left <= right ? 1 : 0; break;
          case '>=': result = left >= right ? 1 : 0; break;
          default: result = { type: 'binary_operation', operator: node.operator, left, right };
        }
      } else {
        result = { type: 'binary_operation', operator: node.operator, left, right };
      }
    } else {
      result = node;
    }
    
    // Cache the result for this expression
    expressionCache.set(exprKey, result);
    return result;
  }

  // First pass: Analyze usage and evaluate expressions
  function analyzeUsage(node) {
    if (node.type === 'assignment') {
      const value = fullEvaluate(node.expression);
      symbolTable[node.identifier] = value;
    } else if (node.type === 'print') {
      fullEvaluate(node.expression);
    } else if (node.type === 'if') {
      const condition = fullEvaluate(node.condition);
      
      // If condition is a constant, we only need to examine the relevant branch
      if (typeof condition === 'number') {
        if (condition) {
          node.thenBlock.forEach(analyzeUsage);
        }
      } else {
        // For non-constant conditions, analyze both branches
        node.thenBlock.forEach(analyzeUsage);
      }
    }
  }

  // Helper to format expressions consistently
  function formatExpression(expr) {
    if (typeof expr === 'number') {
      return expr;
    } else if (expr.type === 'identifier') {
      // Try to replace identifier with its actual value if available
      const value = symbolTable[expr.value];
      if (typeof value === 'number') {
        return value;
      }
      return expr.value;
    } else if (expr.type === 'binary_operation') {
      // Try to evaluate the entire expression if possible
      const exprKey = getExpressionKey(expr);
      if (expressionCache.has(exprKey)) {
        const cachedValue = expressionCache.get(exprKey);
        if (typeof cachedValue === 'number') {
          return cachedValue;
        }
      }
      
      // Format sub-expressions
      const left = formatExpression(expr.left);
      const right = formatExpression(expr.right);
      
      // Check if both operands are numbers and can be computed now
      if (typeof left === 'number' && typeof right === 'number') {
        switch (expr.operator) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return Math.floor(left / right);
          default: return `${left} ${expr.operator} ${right}`;
        }
      }
      
      return `${left} ${expr.operator} ${right}`;
    }
    return "";
  }

  // Second pass: Generate optimized code
  function generateOptimizedCode(node) {
    if (node.type === 'assignment') {
      const value = fullEvaluate(node.expression);
      
      // Only include assignment if the variable is used elsewhere
      if (usedVariables.has(node.identifier)) {
        if (typeof value === 'number') {
          optimizedCode += `${node.identifier} = ${value};\n`;
        } else {
          const exprCode = formatExpression(value);
          optimizedCode += `${node.identifier} = ${exprCode};\n`;
        }
      }
      // Skip unused variable assignments
    } else if (node.type === 'print') {
      const value = fullEvaluate(node.expression);
      if (typeof value === 'number') {
        optimizedCode += `print(${value});\n`;
      } else if (value.type === 'identifier') {
        // Look up identifier's actual value if possible
        const idValue = symbolTable[value.value];
        if (typeof idValue === 'number') {
          optimizedCode += `print(${idValue});\n`;
        } else {
          optimizedCode += `print(${value.value});\n`;
        }
      } else {
        const exprCode = formatExpression(value);
        optimizedCode += `print(${exprCode});\n`;
      }
    } else if (node.type === 'if') {
      const condition = fullEvaluate(node.condition);
      
      // If condition evaluates to a constant, we can decide at compile time
      if (typeof condition === 'number') {
        if (condition) {
          // Include the 'then' block only if condition is true
          node.thenBlock.forEach(generateOptimizedCode);
        }
        // Skip block if condition is false
      } else {
        // For non-constant conditions, include conditional and both branches
        const condCode = formatExpression(condition);
        optimizedCode += `if (${condCode}) {\n`;
        node.thenBlock.forEach(generateOptimizedCode);
        optimizedCode += `}\n`;
      }
    }
  }

  // Find all used variables and fully evaluate expressions
  ast.forEach(analyzeUsage);

  // Generate optimized code
  ast.forEach(generateOptimizedCode);

  return {
    optimizedCode,
    symbolTable,
    usedVariables: Array.from(usedVariables)
  };
}