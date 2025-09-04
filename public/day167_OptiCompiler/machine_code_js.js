// machineCodeGenerator.js - Generate simulated machine code for the OptiCompiler

function generateMachineCode(optimizedCode) {
  const lines = optimizedCode.split('\n').filter(line => line.trim() !== "");
  let machineCode = "";
  let registerCount = 1;
  const symbolTable = {};

  for (const line of lines) {
    if (line.startsWith('print')) {
      const value = line.substring(6, line.length - 2); // Extract value inside print()
      
      // If value is a number, use it directly
      if (!isNaN(value)) {
        machineCode += `LOAD R0, ${value}\n`;
        machineCode += `PRINT R0\n`;
      } else {
        // Value is a variable, get its register
        const register = symbolTable[value] || `R0`;
        machineCode += `PRINT ${register}\n`;
      }
    } else if (line.includes('=')) {
      const [variable, expression] = line.split('=').map(part => part.trim());
      
      // Remove semicolon if present
      const cleanExpression = expression.replace(';', '');
      
      // Check if expression is a number
      if (!isNaN(cleanExpression)) {
        machineCode += `LOAD R${registerCount}, ${cleanExpression}\n`;
        symbolTable[variable] = `R${registerCount}`;
        registerCount++;
      } 
      // Handle binary operations
      else if (cleanExpression.includes('+') || cleanExpression.includes('-') || 
              cleanExpression.includes('*') || cleanExpression.includes('/')) {
        
        const parts = cleanExpression.split(/([+\-*/])/);
        const left = parts[0].trim();
        const operator = parts[1].trim();
        const right = parts[2].trim();
        
        const leftRegister = !isNaN(left) ? left : (symbolTable[left] || `R0`);
        const rightRegister = !isNaN(right) ? right : (symbolTable[right] || `R0`);
        
        if (!isNaN(left)) {
          machineCode += `LOAD R${registerCount}, ${left}\n`;
          registerCount++;
        }
        
        if (!isNaN(right)) {
          machineCode += `LOAD R${registerCount}, ${right}\n`;
          registerCount++;
        }
        
        let opcode;
        switch(operator) {
          case '+': opcode = 'ADD'; break;
          case '-': opcode = 'SUB'; break;
          case '*': opcode = 'MUL'; break;
          case '/': opcode = 'DIV'; break;
        }
        
        machineCode += `${opcode} R${registerCount}, ${leftRegister}, ${rightRegister}\n`;
        symbolTable[variable] = `R${registerCount}`;
        registerCount++;
      } 
      // Simple variable assignment
      else {
        const sourceRegister = symbolTable[cleanExpression] || `R0`;
        machineCode += `MOV R${registerCount}, ${sourceRegister}\n`;
        symbolTable[variable] = `R${registerCount}`;
        registerCount++;
      }
    } else if (line.startsWith('if')) {
      // Extract condition from if (condition) format
      const conditionMatch = line.match(/if\s*\((.*?)\)\s*\{/);
      if (conditionMatch) {
        const condition = conditionMatch[1].trim();
        machineCode += `// Condition: ${condition}\n`;
        machineCode += `CMP ${condition}\n`;
        machineCode += `JZ end_if_${registerCount}\n`; // Jump if zero (condition is false)
        machineCode += `// If block starts\n`;
        // End label will be placed after the block
        machineCode += `end_if_${registerCount}:\n`;
        registerCount++;
      }
    }
  }

  return machineCode;
}