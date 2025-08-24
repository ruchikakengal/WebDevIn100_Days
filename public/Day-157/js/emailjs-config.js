// EmailJS configuration and email notification service
class EmailJSConfig {
    constructor() {
        // EmailJS configuration - these should be set via environment variables or config
        this.publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // Replace with actual public key
        this.serviceId = 'YOUR_SERVICE_ID'; // Replace with actual service ID
        this.templateId = 'YOUR_TEMPLATE_ID'; // Replace with actual template ID
        
        this.initialized = false;
        this.rateLimitDelay = 60000; // 1 minute between emails
        this.lastEmailSent = 0;
    }

    async init() {
        try {
            // Initialize EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.publicKey);
                this.initialized = true;
                console.log('EmailJS initialized successfully');
            } else {
                console.warn('EmailJS library not loaded');
                this.initialized = false;
            }
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
            this.initialized = false;
        }
    }

    async sendNotification(capsule) {
        if (!this.initialized) {
            console.warn('EmailJS not initialized');
            return false;
        }

        if (!capsule.emailNotification || !capsule.email) {
            return false;
        }

        // Check rate limiting
        const now = Date.now();
        if (now - this.lastEmailSent < this.rateLimitDelay) {
            console.warn('Email rate limit exceeded');
            return false;
        }

        try {
            const templateParams = {
                to_email: capsule.email,
                capsule_message: this.truncateMessage(capsule.message),
                unlock_date: new Date(capsule.unlockDateTime).toLocaleString(),
                created_date: new Date(capsule.createdAt).toLocaleString(),
                capsule_id: capsule.id
            };

            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );

            this.lastEmailSent = now;
            console.log('Email notification sent successfully:', response);
            
            // Show success toast
            if (window.timeCapApp) {
                window.timeCapApp.showToast('Email notification sent!', 'success');
            }
            
            return true;
        } catch (error) {
            console.error('Failed to send email notification:', error);
            
            // Show error toast
            if (window.timeCapApp) {
                window.timeCapApp.showToast('Failed to send email notification', 'error');
            }
            
            return false;
        }
    }

    truncateMessage(message, maxLength = 200) {
        if (message.length <= maxLength) {
            return message;
        }
        return message.substring(0, maxLength) + '...';
    }

    async sendTestEmail(email) {
        if (!this.initialized) {
            throw new Error('EmailJS not initialized');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email address');
        }

        try {
            const templateParams = {
                to_email: email,
                capsule_message: 'This is a test email from your Digital Time Capsule!',
                unlock_date: new Date().toLocaleString(),
                created_date: new Date().toLocaleString(),
                capsule_id: 'test-capsule'
            };

            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );

            console.log('Test email sent successfully:', response);
            return true;
        } catch (error) {
            console.error('Failed to send test email:', error);
            throw error;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Email template management
    getDefaultTemplate() {
        return {
            subject: '🕰️ Your Time Capsule is Ready to Open!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #4a9eff, #0066cc); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🕰️ Digital Time Capsule</h1>
                        <p style="color: #e6f3ff; margin: 10px 0 0 0;">Your message from the past is ready!</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0;">Time Capsule Unlocked! 🎉</h2>
                        
                        <p style="color: #666; line-height: 1.6;">
                            The time capsule you created has finally unlocked! Here's a preview of your message:
                        </p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #4a9eff; margin: 20px 0; border-radius: 5px;">
                            <p style="margin: 0; color: #333; font-style: italic;">
                                "{{capsule_message}}"
                            </p>
                        </div>
                        
                        <div style="background: #e9f7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; color: #0066cc; font-size: 14px;">
                                <strong>Created:</strong> {{created_date}}<br>
                                <strong>Unlocked:</strong> {{unlock_date}}<br>
                                <strong>Capsule ID:</strong> {{capsule_id}}
                            </p>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Visit your Digital Time Capsule website to read the complete message and see any attached images.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="#" style="background: linear-gradient(135deg, #4a9eff, #0066cc); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                                Open Your Time Capsule
                            </a>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                            This email was sent automatically when your time capsule unlocked.<br>
                            Digital Time Capsule - Preserving memories for the future.
                        </p>
                    </div>
                </div>
            `
        };
    }

    // Configuration methods
    updateConfig(config) {
        if (config.publicKey) this.publicKey = config.publicKey;
        if (config.serviceId) this.serviceId = config.serviceId;
        if (config.templateId) this.templateId = config.templateId;
        
        // Re-initialize with new config
        this.init();
    }

    getConfig() {
        return {
            publicKey: this.publicKey ? this.publicKey.substring(0, 10) + '...' : 'Not set',
            serviceId: this.serviceId || 'Not set',
            templateId: this.templateId || 'Not set',
            initialized: this.initialized
        };
    }

    // Batch notification sending
    async sendBatchNotifications(capsules) {
        if (!this.initialized) {
            console.warn('EmailJS not initialized');
            return { success: 0, failed: 0 };
        }

        let successCount = 0;
        let failedCount = 0;

        for (const capsule of capsules) {
            if (capsule.emailNotification && capsule.email) {
                const success = await this.sendNotification(capsule);
                if (success) {
                    successCount++;
                } else {
                    failedCount++;
                }
                
                // Add delay between emails to avoid rate limiting
                if (capsules.indexOf(capsule) < capsules.length - 1) {
                    await this.delay(2000); // 2 second delay
                }
            }
        }

        return { success: successCount, failed: failedCount };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Email validation and formatting
    formatEmailContent(capsule) {
        const unlockDate = new Date(capsule.unlockDateTime);
        const createdDate = new Date(capsule.createdAt);
        
        return {
            subject: `🕰️ Time Capsule Unlocked - ${unlockDate.toLocaleDateString()}`,
            preview: this.truncateMessage(capsule.message, 100),
            unlockDateFormatted: unlockDate.toLocaleString(),
            createdDateFormatted: createdDate.toLocaleString(),
            timeWaited: this.calculateTimeDifference(createdDate, unlockDate)
        };
    }

    calculateTimeDifference(startDate, endDate) {
        const diffMs = endDate - startDate;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
            return `${days} day${days !== 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''}`;
        } else {
            return `${hours} hour${hours !== 1 ? 's' : ''}`;
        }
    }
}

