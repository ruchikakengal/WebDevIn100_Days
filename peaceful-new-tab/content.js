// Content script for pet injection
// This runs on all web pages

(function() {
    'use strict';
    
    // Prevent multiple injections
    if (window.chromePetsInjected) {
        return;
    }
    window.chromePetsInjected = true;
    
    let petsContainer = null;
    let petsEnabled = true;
    
    // Check if pets should be enabled
    async function checkPetsStatus() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getPetsStatus' });
            petsEnabled = response.enabled;
            
            if (petsEnabled && !petsContainer) {
                createPets();
            } else if (!petsEnabled && petsContainer) {
                removePets();
            }
        } catch (error) {
            console.log("Could not check pets status:", error);
            // Default to enabled if can't communicate with background
            if (!petsContainer) {
                createPets();
            }
        }
    }
    
    // Create pets on the page
    function createPets() {
        // Don't create pets on certain pages
        if (window.location.href.includes('chrome://') || 
            window.location.href.includes('chrome-extension://') ||
            window.location.href.includes('moz-extension://') ||
            window.location.href.includes('edge://')) {
            return;
        }
        
        // Remove existing pets first
        removePets();
        
        // Create container
        petsContainer = document.createElement('div');
        petsContainer.id = 'chrome-pets-extension-container';
        petsContainer.style.cssText = `
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 60px !important;
            pointer-events: none !important;
            z-index: 2147483647 !important;
            font-family: system-ui, -apple-system, sans-serif !important;
        `;
        
        // Cute pet characters
        const cutePets = ["🐶", "🐱", "🐰", "🦊"];
        const numberOfPets = Math.min(4, cutePets.length); // Max 4 pets for regular websites
        
        // Create pets
        for (let i = 0; i < numberOfPets; i++) {
            const pet = document.createElement('div');
            pet.className = 'chrome-extension-pet walking-pet';
            pet.textContent = cutePets[i];
            pet.style.cssText = `
                position: absolute !important;
                bottom: 5px !important;
                left: ${i * 25 + 10}% !important;
                font-size: 2rem !important;
                cursor: pointer !important;
                pointer-events: auto !important;
                transition: all 0.3s ease !important;
                animation: petFloat 3s ease-in-out infinite !important;
                animation-delay: ${i * -0.5}s !important;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) !important;
                user-select: none !important;
            `;
            
            // Add hover and click effects
            pet.addEventListener('mouseenter', () => {
                pet.style.transform = 'scale(1.3) translateY(-10px)';
                pet.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))';
            });
            
            pet.addEventListener('mouseleave', () => {
                pet.style.transform = '';
                pet.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
            });
            
            pet.addEventListener('click', () => {
                pet.style.animation = 'petBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                setTimeout(() => {
                    pet.style.animation = 'petFloat 3s ease-in-out infinite';
                    pet.style.animationDelay = `${i * -0.5}s`;
                }, 600);
            });
            
            petsContainer.appendChild(pet);
        }
        
        // Add CSS animations if not already present
        if (!document.getElementById('chrome-pets-styles')) {
            const style = document.createElement('style');
            style.id = 'chrome-pets-styles';
            style.textContent = `
                @keyframes petFloat {
                    0%, 100% { 
                        transform: translateY(0px) rotate(-1deg); 
                    }
                    25% { 
                        transform: translateY(-8px) rotate(1deg); 
                    }
                    50% { 
                        transform: translateY(-4px) rotate(-0.5deg); 
                    }
                    75% { 
                        transform: translateY(-12px) rotate(0.5deg); 
                    }
                }
                
                @keyframes petBounce {
                    0% { 
                        transform: scale(1.3) translateY(-10px); 
                    }
                    50% { 
                        transform: scale(1.5) translateY(-25px) rotate(15deg); 
                    }
                    100% { 
                        transform: scale(1.3) translateY(-10px); 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(petsContainer);
        console.log("Chrome pets created successfully");
    }
    
    // Remove pets from page
    function removePets() {
        if (petsContainer) {
            petsContainer.remove();
            petsContainer = null;
        }
        
        const existingContainer = document.getElementById('chrome-pets-extension-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        const styles = document.getElementById('chrome-pets-styles');
        if (styles) {
            styles.remove();
        }
    }
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.action) {
            case 'createPets':
                createPets();
                sendResponse({ success: true });
                break;
                
            case 'removePets':
                removePets();
                sendResponse({ success: true });
                break;
                
            default:
                console.log("Unknown content script message:", message.action);
        }
    });
    
    // Initialize pets when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkPetsStatus);
    } else {
        checkPetsStatus();
    }
    
    // Re-check pets status when page becomes visible (for single-page apps)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(checkPetsStatus, 1000);
        }
    });
})();