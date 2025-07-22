# QR Code Generator

A simple, user-friendly QR Code Generator built with HTML, CSS, and JavaScript.

## Features

- Generate QR codes from any text or URL input
- Clean, responsive UI that works on mobile and desktop
- Download generated QR codes as PNG images
- Real-time QR code generation using the QR Server API

## How to Use

1. Enter any text or URL in the input field
2. Click the "Generate QR Code" button
3. The QR code will be displayed below
4. Click the "Download" button to save the QR code as a PNG image

## Technologies Used

- HTML5
- CSS3 with Flexbox for layout
- Vanilla JavaScript
- [QR Server API](https://api.qrserver.com/) for QR code generation
- Font Awesome for icons

## Project Structure

```
QRCodeGenerator/
├── index.html      # Main HTML file
├── style.css       # CSS styles
├── script.js       # JavaScript functionality
└── README.md       # Project documentation
```

## Implementation Details

The application uses the free QR Server API to generate QR codes. When a user enters text and clicks the generate button, the application makes a request to the API with the entered text and displays the resulting QR code image. The user can then download the generated QR code as a PNG file.

## Future Enhancements

- Add options to customize QR code colors
- Add ability to change QR code size
- Add error correction level options
- Add QR code scanning functionality

## Credits

Created by Kushagra for the WebDevIn100_Days project.