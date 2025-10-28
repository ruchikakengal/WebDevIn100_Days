
# Create the CSS file for styling
css_content = """* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;
}

header {
    text-align: center;
    color: white;
    margin-bottom: 40px;
    animation: fadeInDown 0.8s ease;
}

header h1 {
    font-size: 3rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
}

.search-section {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    margin-bottom: 30px;
    animation: fadeInUp 0.8s ease;
}

#search-form {
    display: flex;
    gap: 10px;
}

#search-input {
    flex: 1;
    padding: 15px 20px;
    font-size: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    transition: all 0.3s ease;
}

#search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

#search-btn {
    padding: 15px 40px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

#search-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

#search-btn:active {
    transform: translateY(0);
}

.results-section {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    animation: fadeInUp 0.8s ease;
}

.result-info {
    margin-bottom: 20px;
}

#result-text {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 15px;
    font-weight: 500;
}

.navigation-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
}

.nav-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.nav-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.nav-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}

#image-counter {
    font-weight: bold;
    color: #667eea;
    font-size: 1rem;
}

.image-container {
    margin: 20px 0;
    text-align: center;
}

#result-image {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    transition: transform 0.3s ease;
}

#result-image:hover {
    transform: scale(1.02);
}

.image-details {
    margin-top: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

#photographer-name {
    font-size: 1rem;
    color: #555;
    margin-bottom: 10px;
}

#image-link {
    display: inline-block;
    padding: 8px 20px;
    color: white;
    background: #667eea;
    text-decoration: none;
    border-radius: 6px;
    transition: background 0.3s ease;
}

#image-link:hover {
    background: #764ba2;
}

#show-more-btn {
    width: 100%;
    padding: 15px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;
}

#show-more-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.loading {
    text-align: center;
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading p {
    color: #667eea;
    font-size: 1.1rem;
    font-weight: 500;
}

.error-message {
    background: #ff4444;
    color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    font-size: 1rem;
    box-shadow: 0 5px 15px rgba(255, 68, 68, 0.3);
}

.hidden {
    display: none;
}

footer {
    text-align: center;
    color: white;
    margin-top: 40px;
    padding: 20px;
}

footer p {
    margin: 5px 0;
    opacity: 0.9;
}

footer a {
    color: white;
    text-decoration: underline;
}

.api-note {
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 10px;
    border-radius: 8px;
    margin-top: 10px;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    header h1 {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1rem;
    }

    #search-form {
        flex-direction: column;
    }

    .search-section {
        padding: 20px;
    }

    .results-section {
        padding: 20px;
    }

    .navigation-buttons {
        flex-direction: column;
        gap: 10px;
    }

    .nav-btn {
        width: 100%;
    }
}"""

# Save CSS file
with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print("✓ style.css created successfully")
