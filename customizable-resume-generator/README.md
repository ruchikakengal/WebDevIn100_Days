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
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   └── (images, icons, fonts, etc.)
│   │
│   ├── components/
│   │   ├── Form.jsx              # Form for user input
│   │   ├── ResumePreview.jsx     # Real-time preview of the resume
│   │   ├── ThemeSwitcher.jsx     # Switch between light/dark themes
│   │   └── DownloadButton.jsx    # Trigger resume PDF download
│   │
│   ├── styles/
│   │   ├── App.css
│   │   └── Resume.css
│   │
│   ├── utils/
│   │   └── generatePDF.js        # Utility to convert resume to PDF
│   │
│   ├── App.js
│   ├── index.js
│   └── README.md
│
├── .gitignore
├── package.json
├── README.md
└── vite.config.js / webpack.config.js (if applicable)

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
