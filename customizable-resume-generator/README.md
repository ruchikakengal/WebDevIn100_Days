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

### 📁 Folder Structure

```
customizable-resume-generator/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                # Images, icons, fonts, etc.
│   ├── components/
│   │   ├── Form.jsx           # Form for user input
│   │   ├── ResumePreview.jsx  # Real-time preview of resume
│   │   ├── ThemeSwitcher.jsx  # Switch between light/dark themes
│   │   └── DownloadButton.jsx # Trigger resume PDF download
│   ├── styles/
│   │   ├── App.css
│   │   └── Resume.css
│   ├── utils/
│   │   └── generatePDF.js     # Utility to convert resume to PDF
│   ├── App.js
│   └── index.js
├── .gitignore
├── README.md
├── package.json
├── vite.config.js             # or webpack.config.js if applicable
```

---

## 💡 Future Enhancements

- Drag & drop resume section ordering
- Save/load resume data to cloud
- Export to DOCX format
- Optional login system for saved resumes

---

### 🚀 How to Use

Follow these steps to run the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/customizable-resume-generator.git

# 2. Navigate into the project directory
cd customizable-resume-generator

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Once the development server starts, open your browser and visit:

```
http://localhost:5173
```

You’ll see the customizable resume generator live in action.

---

## 👩‍💻 Author

Made with ❤️ by **Adyasha Das**  
GitHub: https://github.com/Adyasha-Das-0405
