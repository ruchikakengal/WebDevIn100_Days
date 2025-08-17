// class ReusableModal {
//     constructor(message = "🥳 Item Added to the Cart") {
//       this.message = message;
//       this.init();
//     }
  
//     init() {
//       // Create modal structure
//       this.modal = document.createElement("div");
//       this.modal.id = "myModal";
//       this.modal.className = "modal";
  
//       const modalContent = document.createElement("div");
//       modalContent.className = "modal-content";
  
//       const closeSpan = document.createElement("span");
//       closeSpan.className = "close";
//       closeSpan.innerHTML = "&times;";
//       closeSpan.onclick = () => this.close();
  
//       const messagePara = document.createElement("p");
//       messagePara.textContent = this.message;
  
//       // Build modal structure
//       modalContent.appendChild(closeSpan);
//       modalContent.appendChild(messagePara);
//       this.modal.appendChild(modalContent);
  
//       // Append modal to the body
//       document.body.appendChild(this.modal);
  
//       // Add styles dynamically
//       this.addStyles();
//     }
  
//     addStyles() {
//       const style = document.createElement("style");
//       style.textContent = `
//         .modal {
//           display: none;
//           position: fixed;
//           z-index: 1;
//           left: 0;
//           top: 0;
//           width: 100%;
//           height: 100%;
//           overflow: auto;
//           background-color: rgba(0, 0, 0, 0.4);
//           padding-top: 60px;
//         }
//         .modal-content {
//           background-color: #cade6f;
//           margin: 5% auto;
//           padding: 20px;
//           border: 1px solid #888;
//           width: 60%;
//           max-width: 300px;
//           position: relative;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           text-align: center;
//           min-height: 50px; /* Ensure the modal has enough height */
//         }
//         .close {
//           color: #aaa;
//           font-size: 20px;
//           font-weight: bold;
//           position: absolute;
//           right: 10px;
//           top: 10px;
//         }
//         .close:hover,
//         .close:focus {
//           color: black;
//           text-decoration: none;
//           cursor: pointer;
//         }
//         .modal-content p {
//           margin: 0; /* Remove default margin for the paragraph */
//           font-size: 18px; /* Adjust font size as needed */
//         }
//       `;
//       document.head.appendChild(style);
//     }
  
//     show(duration = 5000) {
//       this.modal.style.display = "block";
//       if (duration) {
//         setTimeout(() => this.close(), duration);
//       }
//     }
  
//     close() {
//       this.modal.style.display = "none";
//     }
  
//     setMessage(newMessage) {
//       this.modal.querySelector("p").textContent = newMessage;
//     }
//   }
  
//   // Export the class for reuse
//   export default ReusableModal;


// ReusableModal.js
class ReusableModal {
    constructor() {
      this.init();
    }
  
    init() {
      // Create modal structure
      this.modal = document.createElement("div");
      this.modal.id = "myModal";
      this.modal.className = "modal";
  
      const modalContent = document.createElement("div");
      modalContent.className = "modal-content";
  
      this.closeSpan = document.createElement("span");
      this.closeSpan.className = "close";
      this.closeSpan.innerHTML = "&times;";
      this.closeSpan.onclick = () => this.close();
  
      this.messagePara = document.createElement("p");
      this.messagePara.textContent = "🥳 Item Added to the Cart"; // Default message
  
      // Build modal structure
      modalContent.appendChild(this.closeSpan);
      modalContent.appendChild(this.messagePara);
      this.modal.appendChild(modalContent);
  
      // Append modal to the body
      document.body.appendChild(this.modal);
  
      // Add styles dynamically
      this.addStyles();
    }
  
    addStyles() {
      const style = document.createElement("style");
      style.textContent = `
        .modal {
          display: none;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
          padding-top: 60px;
        }
        .modal-content {
          background-color: #cade6f;
          margin: 5% auto;
          padding: 10px;
          border: 1px solid #888;
          width: 60%;
          max-width: 300px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          min-height: 50px; /* Ensure the modal has enough height */
        }
        .close {
          color: #aaa;
          font-size: 20px;
          font-weight: bold;
          position: relative;
          right: 10px;
          top: 0;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
        .modal-content p {
          margin: 0; /* Remove default margin for the paragraph */
          font-size: 18px; /* Adjust font size as needed */
        }
      `;
      document.head.appendChild(style);
    }
  
    show(message = "🥳 Item Added to the Cart", duration = 5000) {
      this.messagePara.textContent = message; // Update the modal message
      this.modal.style.display = "block";
      if (duration) {
        setTimeout(() => this.close(), duration);
      }
    }
  
    close() {
      this.modal.style.display = "none";
    }
  }
  
  // Export the class for reuse
  export default ReusableModal;