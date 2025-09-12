const themeToggleButton = document.getElementById("theme-toggle");
themeToggleButton.addEventListener("click", () => {
  const body = document.body;
  const isDarkTheme = body.dataset.theme === "dark";
  body.dataset.theme = isDarkTheme ? "light" : "dark";
  themeToggleButton.textContent = isDarkTheme ? "☀️" : "🌙";
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("three-canvas"),
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00c4b4,
  wireframe: true,
});
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, wireframeMaterial);
scene.add(torusKnotMesh);

camera.position.z = 5;

function animateBackground() {
  requestAnimationFrame(animateBackground);
  torusKnotMesh.rotation.x += 0.01;
  torusKnotMesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animateBackground();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

document.addEventListener("DOMContentLoaded", () => {
  const { jsPDF } = window.jspdf;
  const itemsTableBody = document.querySelector("#item-table tbody");
  const addItemButton = document.getElementById("add-item");
  const subtotalDisplay = document.getElementById("subtotal");
  const taxRateInput = document.getElementById("tax-rate");
  const taxDisplay = document.getElementById("tax");
  const discountRateInput = document.getElementById("discount-rate");
  const discountDisplay = document.getElementById("discount");
  const grandTotalDisplay = document.getElementById("grand-total");
  const exportPreviewButton = document.getElementById("export-preview");
  const downloadPdfButton = document.getElementById("download-pdf");

  const invoiceNumberInput = document.getElementById("invoice-number");
  const invoiceDateInput = document.getElementById("invoice-date");
  const customerNameInput = document.getElementById("customer-name");
  const customerAddressInput = document.getElementById("customer-address");

  const errorMessages = {
    "invoice-number": document.getElementById("invoice-number-error"),
    "invoice-date": document.getElementById("invoice-date-error"),
    "customer-name": document.getElementById("customer-name-error"),
    "tax-rate": document.getElementById("tax-rate-error"),
    "discount-rate": document.getElementById("discount-rate-error"),
  };

  let invoiceItems = [];

  function validateFormInputs() {
    let isValid = true;

    if (!invoiceNumberInput.value.trim()) {
      errorMessages["invoice-number"].style.display = "block";
      isValid = false;
    } else {
      errorMessages["invoice-number"].style.display = "none";
    }

    if (!invoiceDateInput.value) {
      errorMessages["invoice-date"].style.display = "block";
      isValid = false;
    } else {
      errorMessages["invoice-date"].style.display = "none";
    }

    if (!customerNameInput.value.trim()) {
      errorMessages["customer-name"].style.display = "block";
      isValid = false;
    } else {
      errorMessages["customer-name"].style.display = "none";
    }

    if (taxRateInput.value < 0) {
      errorMessages["tax-rate"].style.display = "block";
      isValid = false;
    } else {
      errorMessages["tax-rate"].style.display = "none";
    }

    if (discountRateInput.value < 0) {
      errorMessages["discount-rate"].style.display = "block";
      isValid = false;
    } else {
      errorMessages["discount-rate"].style.display = "none";
    }

    return isValid;
  }

  function addInvoiceItem(description = "", quantity = 1, unitPrice = 0) {
    const itemRow = document.createElement("tr");
    itemRow.classList.add("new-item");
    itemRow.innerHTML = `
                    <td><input type="text" class="item-description" placeholder="Item description" value="${description}" required></td>
                    <td><input type="number" class="item-quantity" min="1" value="${quantity}" required></td>
                    <td><input type="number" class="item-unit-price" min="0" step="0.01" value="${unitPrice.toFixed(
                      2
                    )}" required></td>
                    <td><span class="item-total">0.00</span></td>
                    <td><button class="remove-item">Remove</button></td>
                `;
    itemsTableBody.appendChild(itemRow);
    invoiceItems.push(itemRow);
    attachItemEventListeners(itemRow);
    updateInvoiceTotals();
  }

  function removeInvoiceItem(row) {
    itemsTableBody.removeChild(row);
    invoiceItems = invoiceItems.filter((item) => item !== row);
    updateInvoiceTotals();
  }

  function calculateItemTotal(row) {
    const quantity = parseFloat(row.querySelector(".item-quantity").value) || 0;
    const unitPrice =
      parseFloat(row.querySelector(".item-unit-price").value) || 0;
    const total = Number((quantity * unitPrice).toFixed(2));
    row.querySelector(".item-total").textContent = total.toFixed(2);
    return total;
  }

  function updateInvoiceTotals() {
    let subtotal = 0;
    invoiceItems.forEach((row) => {
      subtotal += calculateItemTotal(row);
    });
    subtotalDisplay.textContent = subtotal.toFixed(2);

    const taxRate = parseFloat(taxRateInput.value) || 0;
    const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));
    taxDisplay.textContent = taxAmount.toFixed(2);

    const discountRate = parseFloat(discountRateInput.value) || 0;
    const discountAmount = Number(((subtotal * discountRate) / 100).toFixed(2));
    discountDisplay.textContent = discountAmount.toFixed(2);

    const grandTotal = Number(
      (subtotal + taxAmount - discountAmount).toFixed(2)
    );
    grandTotalDisplay.textContent = grandTotal.toFixed(2);
  }

  function attachItemEventListeners(row) {
    const inputs = row.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (
          input.classList.contains("item-description") &&
          !input.value.trim()
        ) {
          input.setCustomValidity("Description is required");
          input.reportValidity();
        } else if (
          input.classList.contains("item-quantity") &&
          input.value < 1
        ) {
          input.setCustomValidity("Quantity must be at least 1");
          input.reportValidity();
        } else if (
          input.classList.contains("item-unit-price") &&
          input.value < 0
        ) {
          input.setCustomValidity("Unit price cannot be negative");
          input.reportValidity();
        } else {
          input.setCustomValidity("");
        }
        updateInvoiceTotals();
      });
    });
    const removeButton = row.querySelector(".remove-item");
    removeButton.addEventListener("click", () => removeInvoiceItem(row));
  }

  taxRateInput.addEventListener("input", () => {
    errorMessages["tax-rate"].style.display =
      taxRateInput.value < 0 ? "block" : "none";
    updateInvoiceTotals();
  });

  discountRateInput.addEventListener("input", () => {
    errorMessages["discount-rate"].style.display =
      discountRateInput.value < 0 ? "block" : "none";
    updateInvoiceTotals();
  });

  invoiceNumberInput.addEventListener("input", () => {
    errorMessages["invoice-number"].style.display =
      !invoiceNumberInput.value.trim() ? "block" : "none";
  });

  invoiceDateInput.addEventListener("input", () => {
    errorMessages["invoice-date"].style.display = !invoiceDateInput.value
      ? "block"
      : "none";
  });

  customerNameInput.addEventListener("input", () => {
    errorMessages["customer-name"].style.display =
      !customerNameInput.value.trim() ? "block" : "none";
  });

  addItemButton.addEventListener("click", () => addInvoiceItem());

  exportPreviewButton.addEventListener("click", () => {
    if (!validateFormInputs()) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    let itemRows = "";
    invoiceItems.forEach((row) => {
      const description = row.querySelector(".item-description").value;
      const quantity = row.querySelector(".item-quantity").value;
      const unitPrice = row.querySelector(".item-unit-price").value;
      const total = row.querySelector(".item-total").textContent;
      itemRows += `<tr><td>${description}</td><td>${quantity}</td><td>$${unitPrice}</td><td>$${total}</td></tr>`;
    });

    const previewWindow = window.open("", "_blank");
    previewWindow.document.write(`
                    <html>
                    <head>
                        <title>Invoice Preview</title>
                        <style>
                            body {
                                font-family: 'Helvetica', 'Poppins', sans-serif;
                                padding: 40px;
                                background: #f5f7fa;
                                margin: 0;
                            }
                            .invoice {
                                max-width: 800px;
                                margin: 0 auto;
                                background: #fff;
                                padding: 40px;
                                border-radius: 15px;
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                background: #00C4B4;
                                padding: 20px;
                                border-radius: 10px 10px 0 0;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                color: #fff;
                            }
                            h1 {
                                font-family: 'Helvetica', sans-serif;
                                margin: 0;
                                font-size: 28px;
                                font-weight: bold;
                            }
                            .header-sub {
                                font-size: 12px;
                                margin-top: 5px;
                            }
                            .discount-tag {
                                background: #FF6F61;
                                padding: 8px 15px;
                                border-radius: 20px;
                                font-weight: 600;
                                font-size: 12px;
                            }
                            .invoice-details {
                                margin: 20px 0;
                                line-height: 1.6;
                                font-size: 12px;
                            }
                            h2 {
                                font-family: 'Helvetica', sans-serif;
                                color: #00C4B4;
                                font-size: 16px;
                                font-weight: bold;
                                margin: 20px 0 10px;
                                border-bottom: 2px solid #00C4B4;
                                padding-bottom: 5px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 20px 0;
                                font-size: 12px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 12px;
                                text-align: left;
                            }
                            th {
                                background: #00C4B4;
                                color: #fff;
                                font-weight: 600;
                            }
                            .totals {
                                margin-top: 20px;
                                padding-top: 20px;
                                border-top: 2px solid #00C4B4;
                                line-height: 1.6;
                                font-size: 12px;
                            }
                            .totals p {
                                margin: 8px 0;
                            }
                            .grand-total {
                                color: #00C4B4;
                                font-family: 'Helvetica', sans-serif;
                                font-weight: 700;
                            }
                            footer {
                                margin-top: 30px;
                                text-align: center;
                                background: #00C4B4;
                                color: #fff;
                                padding: 10px;
                                border-radius: 0 0 10px 10px;
                                font-size: 10px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="invoice">
                            <div class="header">
                                <div>
                                    <h1>INVOICE</h1>
                                    <div class="header-sub">Invoice Builder</div>
                                </div>
                                <span class="discount-tag">Discount: $${
                                  discountDisplay.textContent
                                }</span>
                            </div>
                            <div class="invoice-details">
                                <p><strong>Invoice Number:</strong> ${
                                  invoiceNumberInput.value
                                }</p>
                                <p><strong>Invoice Date:</strong> ${
                                  invoiceDateInput.value
                                }</p>
                            </div>
                            <h2>Customer Information</h2>
                            <p><strong>Name:</strong> ${
                              customerNameInput.value
                            }</p>
                            <p><strong>Address:</strong> ${
                              customerAddressInput.value || "N/A"
                            }</p>
                            <h2>Items</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemRows}
                                </tbody>
                            </table>
                            <div class="totals">
                                <p><strong>Subtotal:</strong> $${
                                  subtotalDisplay.textContent
                                }</p>
                                <p><strong>Tax:</strong> $${
                                  taxDisplay.textContent
                                }</p>
                                <p><strong>Discount:</strong> $${
                                  discountDisplay.textContent
                                }</p>
                                <p><strong class="grand-total">Grand Total:</strong> $${
                                  grandTotalDisplay.textContent
                                }</p>
                            </div>
                            <footer>
                                <p>Terms and Conditions: Payment due within 30 days.</p>
                                <p>Generated by Invoice Builder</p>
                            </footer>
                        </div>
                    </body>
                    </html>
                `);
    previewWindow.document.close();
  });

  downloadPdfButton.addEventListener("click", () => {
    if (!validateFormInputs()) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    const pdfDocument = new jsPDF();

    // Header
    pdfDocument.setFillColor(0, 196, 180); // Teal
    pdfDocument.rect(0, 0, 210, 40, "F");
    pdfDocument.setFont("helvetica", "bold");
    pdfDocument.setFontSize(28);
    pdfDocument.setTextColor(255, 255, 255);
    pdfDocument.text("INVOICE", 20, 25);
    pdfDocument.setFontSize(12);
    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.text("Invoice Builder", 20, 35);

    // Discount Tag
    const discountAmount = parseFloat(discountDisplay.textContent);
    if (discountAmount > 0) {
      pdfDocument.setFillColor(255, 111, 97); // Coral
      pdfDocument.roundedRect(150, 15, 40, 15, 5, 5, "F");
      pdfDocument.setTextColor(255, 255, 255);
      pdfDocument.setFontSize(10);
      pdfDocument.setFont("helvetica", "bold");
      pdfDocument.text(`Discount: $${discountAmount}`, 155, 25);
    }

    // Invoice Details
    pdfDocument.setFontSize(12);
    pdfDocument.setTextColor(0, 0, 0);
    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.setDrawColor(0, 196, 180);
    pdfDocument.line(20, 50, 190, 50);
    pdfDocument.text(`Invoice Number: ${invoiceNumberInput.value}`, 20, 60);
    pdfDocument.text(`Invoice Date: ${invoiceDateInput.value}`, 20, 70);

    // Customer Information
    pdfDocument.setFont("helvetica", "bold");
    pdfDocument.setTextColor(0, 196, 180);
    pdfDocument.text("Customer Information", 20, 85);
    pdfDocument.setDrawColor(0, 196, 180);
    pdfDocument.line(20, 90, 190, 90);
    pdfDocument.setTextColor(0, 0, 0);
    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.text(`Name: ${customerNameInput.value}`, 20, 100);
    pdfDocument.text(
      `Address: ${customerAddressInput.value || "N/A"}`,
      20,
      110
    );

    // Items Table
    let verticalPosition = 130;
    pdfDocument.setFont("helvetica", "bold");
    pdfDocument.setTextColor(0, 196, 180);
    pdfDocument.text("Items", 20, verticalPosition);
    verticalPosition += 5;
    pdfDocument.setDrawColor(0, 196, 180);
    pdfDocument.line(20, verticalPosition, 190, verticalPosition);
    verticalPosition += 10;

    // Table Headers
    pdfDocument.setFillColor(0, 196, 180); // Teal
    pdfDocument.rect(20, verticalPosition - 5, 170, 10, "F");
    pdfDocument.setFontSize(10);
    pdfDocument.setTextColor(255, 255, 255);
    pdfDocument.setFont("helvetica", "bold");
    pdfDocument.text("Description", 22, verticalPosition);
    pdfDocument.text("Qty", 100, verticalPosition);
    pdfDocument.text("Price", 120, verticalPosition);
    pdfDocument.text("Total", 160, verticalPosition);
    verticalPosition += 5;
    pdfDocument.setDrawColor(0, 0, 0);
    pdfDocument.line(20, verticalPosition, 190, verticalPosition);
    verticalPosition += 5;

    // Table Rows
    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.setTextColor(0, 0, 0);
    invoiceItems.forEach((row) => {
      const description = row.querySelector(".item-description").value;
      const quantity = row.querySelector(".item-quantity").value;
      const unitPrice = row.querySelector(".item-unit-price").value;
      const total = row.querySelector(".item-total").textContent;
      pdfDocument.text(description, 22, verticalPosition);
      pdfDocument.text(quantity, 100, verticalPosition);
      pdfDocument.text(`$${unitPrice}`, 120, verticalPosition);
      pdfDocument.text(`$${total}`, 160, verticalPosition);
      verticalPosition += 10;
      pdfDocument.line(20, verticalPosition - 5, 190, verticalPosition - 5);
    });

    verticalPosition += 10;

    // Totals
    pdfDocument.setFont("helvetica", "bold");
    pdfDocument.setTextColor(0, 196, 180);
    pdfDocument.text("Summary", 20, verticalPosition);
    pdfDocument.setDrawColor(0, 196, 180);
    pdfDocument.line(20, verticalPosition + 5, 190, verticalPosition + 5);
    verticalPosition += 15;
    pdfDocument.setTextColor(0, 0, 0);
    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.setFontSize(12);
    pdfDocument.text(
      `Subtotal: $${subtotalDisplay.textContent}`,
      20,
      verticalPosition
    );
    verticalPosition += 10;
    pdfDocument.text(`Tax: $${taxDisplay.textContent}`, 20, verticalPosition);
    verticalPosition += 10;
    pdfDocument.text(
      `Discount: $${discountDisplay.textContent}`,
      20,
      verticalPosition
    );
    verticalPosition += 10;
    pdfDocument.setFont("helvetica", "bold");
    pdfDocument.setTextColor(0, 196, 180);
    pdfDocument.text(
      `Grand Total: $${grandTotalDisplay.textContent}`,
      20,
      verticalPosition
    );

    // Footer
    pdfDocument.setFillColor(0, 196, 180);
    pdfDocument.rect(0, 270, 210, 30, "F");
    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.setTextColor(255, 255, 255);
    pdfDocument.setFontSize(10);
    pdfDocument.text(
      "Terms and Conditions: Payment due within 30 days.",
      20,
      280
    );
    pdfDocument.text("Generated by Invoice Builder", 150, 280);

    pdfDocument.save("invoice.pdf");
  });

  addInvoiceItem();
});