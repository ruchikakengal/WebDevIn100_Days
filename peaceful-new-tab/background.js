// Background script for Chrome extension
// Handles content script injection and pets management

let petsEnabled = true;

// Initialize on extension startup
chrome.runtime.onStartup.addListener(async () => {
    console.log("Extension started");
    await loadSettings();
});

chrome.runtime.onInstalled.addListener(async () => {
    console.log("Extension installed/updated");
    await loadSettings();
    await injectPetsIntoAllTabs();
});

// Load settings from storage
async function loadSettings() {
    try {
        const result = await chrome.storage.local.get(['petsEnabled']);
        petsEnabled = result.petsEnabled !== false; // Default to true
        console.log("Pets enabled:", petsEnabled);
    } catch (error) {
        console.error("Error loading settings:", error);
    }
}

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.action) {
        case 'togglePets':
            petsEnabled = message.enabled;
            console.log("Pets toggled:", petsEnabled);
            
            if (petsEnabled) {
                await injectPetsIntoAllTabs();
            } else {
                await removePetsFromAllTabs();
            }
            break;
            
        case 'getPetsStatus':
            sendResponse({ enabled: petsEnabled });
            break;
            
        default:
            console.log("Unknown message action:", message.action);
    }
});

// Inject pets into all existing tabs
async function injectPetsIntoAllTabs() {
    if (!petsEnabled) return;
    
    try {
        const tabs = await chrome.tabs.query({});
        
        for (const tab of tabs) {
            // Skip chrome:// and extension pages
            if (tab.url.startsWith('chrome://') || 
                tab.url.startsWith('chrome-extension://') ||
                tab.url.startsWith('moz-extension://') ||
                tab.url.startsWith('edge://')) {
                continue;
            }
            
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: injectPetsScript
                });
                console.log("Pets injected into tab:", tab.url);
            } catch (error) {
                console.log("Could not inject into tab:", tab.url, error.message);
            }
        }
    } catch (error) {
        console.error("Error injecting pets into all tabs:", error);
    }
}

// Remove pets from all tabs
async function removePetsFromAllTabs() {
    try {
        const tabs = await chrome.tabs.query({});
        
        for (const tab of tabs) {
            // Skip chrome:// and extension pages
            if (tab.url.startsWith('chrome://') || 
                tab.url.startsWith('chrome-extension://') ||
                tab.url.startsWith('moz-extension://') ||
                tab.url.startsWith('edge://')) {
                continue;
            }
            
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: removePetsScript
                });
                console.log("Pets removed from tab:", tab.url);
            } catch (error) {
                console.log("Could not remove pets from tab:", tab.url, error.message);
            }
        }
    } catch (error) {
        console.error("Error removing pets from all tabs:", error);
    }
}

// Function to inject pets (executed in content script context)
function injectPetsScript() {
    // Remove existing pets first
    const existing = document.getElementById('chrome-pets-extension-container');
    if (existing) {
        existing.remove();
    }
    
    // Create pets container
    const petsContainer = document.createElement('div');
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
    
    // Create pets
    cutePets.forEach((petEmoji, index) => {
        const pet = document.createElement('div');
        pet.className = 'chrome-extension-pet';
        pet.textContent = petEmoji;
        pet.style.cssText = `
            position: absolute !important;
            bottom: 5px !important;
            left: ${index * 25 + 5}% !important;
            font-size: 2rem !important;
            cursor: pointer !important;
            pointer-events: auto !important;
            transition: all 0.3s ease !important;
            animation: petFloat 3s ease-in-out infinite !important;
            animation-delay: ${index * -0.5}s !important;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) !important;
            user-select: none !important;
        `;
        
        // Add hover effect
        pet.addEventListener('mouseenter', () => {
            pet.style.transform = 'scale(1.3) translateY(-10px)';
        });
        
        pet.addEventListener('mouseleave', () => {
            pet.style.transform = '';
        });
        
        // Add click effect
        pet.addEventListener('click', () => {
            pet.style.animation = 'petBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            setTimeout(() => {
                pet.style.animation = 'petFloat 3s ease-in-out infinite';
                pet.style.animationDelay = `${index * -0.5}s`;
            }, 600);
        });
        
        petsContainer.appendChild(pet);
    });
    
    // Add CSS animations
    if (!document.getElementById('chrome-pets-styles')) {
        const style = document.createElement('style');
        style.id = 'chrome-pets-styles';
        style.textContent = `
            @keyframes petFloat {
                0%, 100% { transform: translateY(0px) rotate(-1deg); }
                25% { transform: translateY(-8px) rotate(1deg); }
                50% { transform: translateY(-4px) rotate(-0.5deg); }
                75% { transform: translateY(-12px) rotate(0.5deg); }
            }
            
            @keyframes petBounce {
                0% { transform: scale(1.3) translateY(-10px); }
                50% { transform: scale(1.5) translateY(-25px) rotate(15deg); }
                100% { transform: scale(1.3) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(petsContainer);
}

// Function to remove pets (executed in content script context)
function removePetsScript() {
    const existing = document.getElementById('chrome-pets-extension-container');
    if (existing) {
        existing.remove();
    }
    
    const styles = document.getElementById('chrome-pets-styles');
    if (styles) {
        styles.remove();
    }
}

// Listen for tab updates to inject pets into new pages
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && petsEnabled && tab.url) {
        // Skip chrome:// and extension pages
        if (tab.url.startsWith('chrome://') || 
            tab.url.startsWith('chrome-extension://') ||
            tab.url.startsWith('moz-extension://') ||
            tab.url.startsWith('edge://')) {
            return;
        }
        
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: injectPetsScript
            });
            console.log("Pets injected into updated tab:", tab.url);
        } catch (error) {
            console.log("Could not inject into updated tab:", tab.url, error.message);
        }
    }
});