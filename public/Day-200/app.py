import os
import logging
from flask import Flask, render_template, request, jsonify, flash
from werkzeug.utils import secure_filename
from werkzeug.middleware.proxy_fix import ProxyFix
import traceback
from document_processor import DocumentProcessor
from ai_models import AIModels

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure upload settings
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize processors
document_processor = DocumentProcessor()
ai_models = AIModels()

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and return extracted text."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not supported. Please upload PDF, TXT, or DOCX files.'}), 400
        
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract text from the document
        text = document_processor.extract_text(filepath)
        
        if not text or len(text.strip()) < 10:
            return jsonify({'error': 'Could not extract meaningful text from the document'}), 400
        
        # Clean up the uploaded file
        os.remove(filepath)
        
        # Calculate document stats
        word_count = len(text.split())
        char_count = len(text)
        
        return jsonify({
            'success': True,
            'text': text,
            'stats': {
                'word_count': word_count,
                'char_count': char_count,
                'filename': filename
            }
        })
        
    except Exception as e:
        logger.error(f"Error processing file upload: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/summarize', methods=['POST'])
def summarize():
    """Generate a summary of the provided text."""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided for summarization'}), 400
        
        text = data['text']
        summary_length = data.get('length', 'medium')  # short, medium, long
        
        if len(text.strip()) < 50:
            return jsonify({'error': 'Text is too short to summarize meaningfully'}), 400
        
        # Generate summary
        summary = ai_models.summarize_text(text, length=summary_length)
        
        if not summary:
            return jsonify({'error': 'Failed to generate summary'}), 500
        
        # Calculate compression ratio
        original_words = len(text.split())
        summary_words = len(summary.split())
        compression_ratio = round((1 - summary_words / original_words) * 100, 1)
        
        return jsonify({
            'success': True,
            'summary': summary,
            'stats': {
                'original_words': original_words,
                'summary_words': summary_words,
                'compression_ratio': compression_ratio
            }
        })
        
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': f'Error generating summary: {str(e)}'}), 500

@app.route('/ask', methods=['POST'])
def ask_question():
    """Answer a question based on the provided context."""
    try:
        data = request.get_json()
        
        if not data or 'question' not in data or 'context' not in data:
            return jsonify({'error': 'Question and context are required'}), 400
        
        question = data['question'].strip()
        context = data['context']
        
        if not question:
            return jsonify({'error': 'Please provide a question'}), 400
        
        if len(context.strip()) < 10:
            return jsonify({'error': 'Context is too short to answer questions meaningfully'}), 400
        
        # Get answer from AI model
        answer = ai_models.answer_question(question, context)
        
        if not answer:
            return jsonify({'error': 'Could not generate an answer to your question'}), 500
        
        return jsonify({
            'success': True,
            'answer': answer,
            'question': question
        })
        
    except Exception as e:
        logger.error(f"Error answering question: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': f'Error answering question: {str(e)}'}), 500

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error."""
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

@app.errorhandler(500)
def internal_error(e):
    """Handle internal server errors."""
    return jsonify({'error': 'Internal server error. Please try again.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
