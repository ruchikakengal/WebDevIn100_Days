// compiler.js - Main logic for the OptiCompiler

function compileCode() {
  const sourceCode = document.getElementById("codeInput").value.trim();

  document.getElementById("tokensOutput").innerText = "";
  document.getElementById("astOutput").innerText = "";
  document.getElementById("optimizedOutput").innerText = "";
  document.getElementById("machineCodeOutput").innerText = "";
  document.getElementById("compilerOutput").innerText = "";

  try {
    // Stage 1: Tokenize the input code 
    const tokens = tokenize(sourceCode);
    document.getElementById("tokensOutput").innerText = JSON.stringify(tokens, null, 2);

    // Stage 2: Parse the tokens into an AST
    const ast = parse(tokens);
    document.getElementById("astOutput").innerText = JSON.stringify(ast, null, 2);

    // Stage 3: Optimize the AST
    const optimizationResult = optimize(ast);
    document.getElementById("optimizedOutput").innerText = optimizationResult.optimizedCode;

    // Stage 4: Generate machine code
    const machineCode = generateMachineCode(optimizationResult.optimizedCode);
    document.getElementById("machineCodeOutput").innerText = machineCode;

    // Report successful compilation
    document.getElementById("compilerOutput").innerText = "Compilation Successful!";

  } catch (error) {
    // Report compilation errors
    document.getElementById("compilerOutput").innerText = "Compilation Error:\n" + error.message;
  }
}