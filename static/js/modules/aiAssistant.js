class AIAssistant {
    constructor() {
        this.chatPanel = document.getElementById('ai-chat-panel');
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-message');
        this.aiChatIcon = document.getElementById('ai-chat-icon');
        this.closeChat = document.getElementById('close-chat');
        this.maximizeChat = document.getElementById('maximize-chat');

        this.initEventListeners();
    }

    initEventListeners() {
        if (this.aiChatIcon) this.aiChatIcon.addEventListener('click', () => this.toggleChatPanel());
        if (this.closeChat) this.closeChat.addEventListener('click', () => this.toggleChatPanel());
        if (this.maximizeChat) this.maximizeChat.addEventListener('click', () => this.maximizeChatPanel());
        if (this.sendButton) this.sendButton.addEventListener('click', () => this.sendChatMessage());
        if (this.userInput) {
            this.userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }
    }

    toggleChatPanel() {
        if (this.chatPanel) {
            this.chatPanel.classList.toggle('open');
        }
    }

    maximizeChatPanel() {
        if (this.chatPanel) {
            this.chatPanel.classList.toggle('maximized');
        }
    }

    sendChatMessage() {
        const message = this.userInput.value.trim();
        if (message) {
            this.appendChatMessage('User', message);
            this.userInput.value = '';
            
            const chartContext = this.getChartContext();
            
            fetch('/api/ai_chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message, chartContext })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.response) {
                    this.appendChatMessage('AI', data.response);
                } else if (data.error) {
                    this.appendChatMessage('AI', 'Error: ' + data.error);
                } else {
                    this.appendChatMessage('AI', 'Error: Unable to get a response.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.appendChatMessage('AI', 'Error: Unable to get a response. Please try again later.');
            });
        }
    }

    appendChatMessage(sender, message) {
        if (this.chatMessages) {
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message ${sender.toLowerCase()}-message`;
            messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
            this.chatMessages.appendChild(messageElement);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    getChartContext() {
        return {
            symbol: window.currentSymbol,
            timeframe: window.currentTimeframe,
            price: window.chartFunctions ? window.chartFunctions.getLastPrice() : null,
            indicators: window.chartFunctions ? window.chartFunctions.getActiveIndicators() : []
        };
    }
}

export function initAIAssistant() {
    const aiAssistant = new AIAssistant();
    window.aiAssistant = aiAssistant;  // Make it globally accessible if needed
}
