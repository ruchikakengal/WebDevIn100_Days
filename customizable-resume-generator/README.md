# Customizable Resume Generator 📝

A dynamic and responsive web application that allows users to generate personalized resumes by filling in their information. Users can preview, switch themes, and download the resume as a PDF.

---

## 🚀 Features

- Responsive UI layout
- Input form to collect user data
- Live resume preview
- Theme switcher (e.g., light/dark/classic)
- Export resume to PDF (using html2pdf.js)

---

## 🛠️ Tech Stack

- React.js
- HTML5, CSS3
- JavaScript
- html2pdf.js (for PDF download)

---

## 📁 Folder Structure

customizable-resume-generator/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/               # Images, icons, fonts, etc.
│   ├── components/
│   │   ├── Form.jsx              # Form for user input
│   │   ├── ResumePreview.jsx    # Live resume preview
│   │   ├── ThemeSwitcher.jsx    # Light/dark theme switch
│   │   └── DownloadButton.jsx   # Trigger PDF download
│   ├── styles/
│   │   ├── App.css
│   │   └── Resume.css
│   ├── utils/
│   │   └── generatePDF.js       # Utility to convert to PDF
│   ├── App.js
│   └── index.js
├── .gitignore
├── README.md
├── package.json
├── vite.config.js              # or webpack.config.js if applicable


---

## 💡 Future Enhancements

- Drag & drop resume section ordering
- Save/load resume data to cloud
- Export to DOCX format
- Optional login system for saved resumes

---

## 🚧 How to Use

1. Clone the repository:
git clone https://github.com/<your-username>/customizable-resume-generator.git
cd customizable-resume-generator

2. Install dependencies:
npm install

3. Start the development server:
npm start

---

## 👩‍💻 Author

Made with ❤️ by **Adyasha Das**  
GitHub: https://github.com/Adyasha-Das-0405
