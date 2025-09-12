import os
import logging
import re
import math
from typing import Optional, List, Dict
from collections import Counter

logger = logging.getLogger(__name__)

class AIModels:
    """Handle AI model loading and inference for summarization and Q&A."""
    
    def __init__(self):
        """Initialize AI models."""
        self.summarizer_available = True
        self.qa_available = True
        logger.info("Using lightweight text processing algorithms")
        
        # Stop words for text processing
        self.stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
            'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 
            'below', 'between', 'among', 'throughout', 'alongside', 'this', 'that', 'these', 'those',
            'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my',
            'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'is',
            'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
            'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall'
        }
    
    def _calculate_sentence_scores(self, sentences: List[str], word_freq: Dict[str, int]) -> List[float]:
        """Calculate scores for sentences based on word frequencies."""
        sentence_scores = []
        
        for sentence in sentences:
            words = self._clean_and_tokenize(sentence.lower())
            if len(words) == 0:
                sentence_scores.append(0)
                continue
                
            score = sum(word_freq.get(word, 0) for word in words if word not in self.stop_words)
            # Normalize by sentence length
            sentence_scores.append(score / len(words))
            
        return sentence_scores
    
    def _clean_and_tokenize(self, text: str) -> List[str]:
        """Clean and tokenize text."""
        # Remove special characters and normalize
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return [word.strip() for word in text.split() if word.strip()]
    
    def summarize_text(self, text: str, length: str = "medium") -> Optional[str]:
        """
        Generate a summary of the input text using extractive summarization.
        
        Args:
            text: Input text to summarize
            length: Summary length - 'short', 'medium', or 'long'
            
        Returns:
            Generated summary or None if generation fails
        """
        try:
            # Determine number of sentences based on length
            if length == "short":
                target_sentences = 2
            elif length == "long":
                target_sentences = 6
            else:  # medium
                target_sentences = 4
            
            # Split text into sentences
            sentences = re.split(r'[.!?]+', text)
            sentences = [s.strip() for s in sentences if s.strip() and len(s.strip()) > 10]
            
            if len(sentences) <= target_sentences:
                return " ".join(sentences) + "."
            
            # Calculate word frequencies
            words = self._clean_and_tokenize(text.lower())
            word_freq = Counter(word for word in words if word not in self.stop_words)
            
            # Calculate sentence scores
            sentence_scores = self._calculate_sentence_scores(sentences, word_freq)
            
            # Get top sentences
            ranked_sentences = sorted(enumerate(sentence_scores), key=lambda x: x[1], reverse=True)
            top_sentence_indices = sorted([idx for idx, score in ranked_sentences[:target_sentences]])
            
            # Construct summary
            summary_sentences = [sentences[i] for i in top_sentence_indices]
            summary = ". ".join(summary_sentences) + "."
            
            return summary
            
        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            return None
    
    def answer_question(self, question: str, context: str) -> Optional[str]:
        """
        Answer a question based on the provided context using keyword matching.
        
        Args:
            question: Question to answer
            context: Context text to search for answers
            
        Returns:
            Answer or None if generation fails
        """
        try:
            # Extract keywords from question
            question_words = self._clean_and_tokenize(question.lower())
            question_keywords = [word for word in question_words if word not in self.stop_words and len(word) > 2]
            
            if not question_keywords:
                return "I couldn't understand your question. Please try rephrasing it."
            
            # Split context into sentences
            sentences = re.split(r'[.!?]+', context)
            sentences = [s.strip() for s in sentences if s.strip() and len(s.strip()) > 10]
            
            # Score sentences based on keyword matches
            sentence_scores = []
            for sentence in sentences:
                sentence_words = self._clean_and_tokenize(sentence.lower())
                
                # Count keyword matches
                matches = sum(1 for keyword in question_keywords if keyword in sentence_words)
                
                # Bonus for exact phrase matches
                sentence_lower = sentence.lower()
                phrase_matches = sum(1 for keyword in question_keywords if keyword in sentence_lower)
                
                # Calculate score
                score = matches + (phrase_matches * 0.5)
                sentence_scores.append((sentence, score))
            
            # Sort by score and get the best match
            sentence_scores.sort(key=lambda x: x[1], reverse=True)
            
            if sentence_scores and sentence_scores[0][1] > 0:
                best_sentence = sentence_scores[0][0]
                
                # Try to extract a more specific answer from the sentence
                # Look for patterns based on question type
                answer = self._extract_specific_answer(question, best_sentence, question_keywords)
                return answer if answer else best_sentence + "."
            else:
                return "I couldn't find an answer to your question in the document. Try asking about topics that are mentioned in the text."
            
        except Exception as e:
            logger.error(f"Error answering question: {str(e)}")
            return None
    
    def _extract_specific_answer(self, question: str, sentence: str, keywords: List[str]) -> Optional[str]:
        """Extract a specific answer from a sentence based on question type."""
        question_lower = question.lower()
        sentence_lower = sentence.lower()
        
        # What questions - look for definitions or explanations
        if question_lower.startswith(('what', 'what is', 'what are')):
            # Look for patterns like "X is Y" or "X are Y"
            for keyword in keywords:
                pattern = rf'{keyword}\s+(?:is|are|was|were)\s+([^.!?]*)'
                match = re.search(pattern, sentence_lower)
                if match:
                    return match.group(1).strip()
        
        # When questions - look for dates or time references
        elif question_lower.startswith(('when', 'what time', 'what date')):
            # Look for date patterns
            date_patterns = [
                r'\b\d{4}\b',  # Years
                r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b',
                r'\b\d{1,2}/\d{1,2}/\d{2,4}\b',
                r'\b(?:yesterday|today|tomorrow|last\s+\w+|next\s+\w+)\b'
            ]
            for pattern in date_patterns:
                match = re.search(pattern, sentence, re.IGNORECASE)
                if match:
                    return match.group(0)
        
        # Where questions - look for locations
        elif question_lower.startswith(('where', 'in which', 'at which')):
            # Look for location indicators
            location_patterns = [
                r'\bin\s+([A-Z][a-zA-Z\s]*(?:City|State|Country|University|College|Hospital|School))\b',
                r'\bat\s+([A-Z][a-zA-Z\s]*(?:University|College|Hospital|School|Center))\b',
                r'\bin\s+([A-Z][a-zA-Z\s]*)\b'
            ]
            for pattern in location_patterns:
                match = re.search(pattern, sentence)
                if match:
                    return match.group(1).strip()
        
        # Who questions - look for people or organizations
        elif question_lower.startswith(('who', 'which person', 'which people')):
            # Look for name patterns (capitalized words)
            name_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b'
            matches = re.findall(name_pattern, sentence)
            if matches:
                return ", ".join(matches[:3])  # Return up to 3 names
        
        # How many/much questions - look for numbers
        elif any(phrase in question_lower for phrase in ['how many', 'how much', 'how long']):
            number_patterns = [
                r'\b\d+(?:,\d{3})*(?:\.\d+)?\s*(?:percent|%|million|billion|thousand|hundred)?\b',
                r'\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion)\b'
            ]
            for pattern in number_patterns:
                match = re.search(pattern, sentence, re.IGNORECASE)
                if match:
                    return match.group(0)
        
        return None
    
    def is_available(self) -> dict:
        """
        Check which models are available.
        
        Returns:
            Dictionary indicating model availability
        """
        return {
            'summarizer': self.summarizer_available,
            'qa': self.qa_available
        }
