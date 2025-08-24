
#  OptiCompiler: AOT Compiler with Static Optimization

**Live Demo**: [OptiCompiler on Render](https://opticompiler.onrender.com/)

OptiCompiler is a fully client-side AOT (Ahead-of-Time) compiler built using JavaScript. It performs lexical analysis, parsing, abstract syntax tree (AST) generation, static code optimization, and simulated machine code generation—all in the browser with a sleek, responsive UI.

---

## Features

* **5-Stage Compilation Pipeline**
  Tokenization → Parsing → AST Generation → Optimization → Machine Code

* **Static Optimization Techniques**
  Implements **constant folding**, **dead code elimination**, and **expression caching** for efficient output.

* **Real-Time Feedback**
  Instantly displays tokens, AST, optimized code, and machine code as you compile.

* **Clean UI/UX**
  Built with HTML, CSS, and JavaScript for an intuitive, responsive interface.

---

## 🛠️ Technologies Used

* **JavaScript (Vanilla)** – core logic for compiler stages
* **HTML/CSS** – for responsive and user-friendly UI
* **Render** – for hosting the live demo

---

## 📂 Project Structure

```
├── index.html             # Main UI layout
├── compiler_js.js         # Main compilation logic (pipeline controller)
├── tokenizer_js.js        # Lexical analyzer (tokenizer)
├── parser_js.js           # Syntax analyzer (parser to AST)
├── optimizer_js.js        # Static code optimizer
├── machine_code_js.js     # Simulated machine code generator
```

---

## 📌 How to Run Locally

1. Clone the repository:

   ```bash
   [git clone https://github.com/22sakshiagarwal/OPTICOMPILER.git]
   cd opticompiler
   ```

2. Open `index.html` in any modern web browser (Chrome/Firefox).

3. Enter sample code in the text area and click **Compile & Optimize**.

---

## 💡 Sample Code to Try

```c
x = 10 + 5;
y = x * 2;
print(y);
if (x > 10) {
  print(x);
}
```

---

## 🏆 Achievements

* **Built from scratch** using vanilla JavaScript, no frameworks.
* **Fully client-side**: no server-side computation or backend required.
* **Educational Tool**: Great for learning basic compiler principles interactively. 

---

## 📃 License

This project is licensed under the MIT License.

---


