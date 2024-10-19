class AIAssistant {
    constructor() {
        this.chatPanel = document.getElementById('ai-chat-panel');
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-message');
        this.aiChatIcon = document.getElementById('ai-chat-icon');
        this.closeChat = document.getElementById('close-chat');
        this.maximizeChat = document.getElementById('maximize-chat');
        this.messageHistory = [];

        this.initEventListeners();
        this.loadMessageHistory();
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
            this.saveMessageHistory(sender, message);
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

    saveMessageHistory(sender, message) {
        this.messageHistory.push({ sender, message });
        localStorage.setItem('messageHistory', JSON.stringify(this.messageHistory));
    }

    loadMessageHistory() {
        const savedHistory = localStorage.getItem('messageHistory');
        if (savedHistory) {
            this.messageHistory = JSON.parse(savedHistory);
            this.messageHistory.forEach(msg => {
                this.appendChatMessage(msg.sender, msg.message);
            });
        }
    }

    fetchFinancialNews() {
        fetch('/api/financial_news')
            .then(response => response.json())
            .then(data => {
                if (data.articles) {
                    data.articles.forEach(article => {
                        this.appendChatMessage('News', `${article.title} - ${article.description}`);
                    });
                } else {
                    this.appendChatMessage('AI', 'Error: Unable to fetch financial news.');
                }
            })
            .catch(error => {
                console.error('Error fetching financial news:', error);
                this.appendChatMessage('AI', 'Error: Unable to fetch financial news. Please try again later.');
            });
    }

    startVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            this.appendChatMessage('AI', 'Voice recognition is not supported in this browser.');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            this.appendChatMessage('AI', 'Voice recognition started. Please speak...');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.appendChatMessage('User', transcript);
            this.sendChatMessage(transcript);
        };

        recognition.onerror = (event) => {
            this.appendChatMessage('AI', 'Error occurred in voice recognition: ' + event.error);
        };

        recognition.onend = () => {
            this.appendChatMessage('AI', 'Voice recognition ended.');
        };

        recognition.start();
    }

    explainTechnicalIndicator(indicator) {
        const explanations = {
            'MACD': 'MACD (Moving Average Convergence Divergence) is a trend-following momentum indicator that shows the relationship between two moving averages of a security’s price.',
            'RSI': 'RSI (Relative Strength Index) is a momentum oscillator that measures the speed and change of price movements. It oscillates between 0 and 100.',
            'Bollinger Bands': 'Bollinger Bands are a type of price envelope developed by John Bollinger. They are envelopes plotted at a standard deviation level above and below a simple moving average of the price.'
        };

        const explanation = explanations[indicator] || 'Sorry, I do not have an explanation for this indicator.';
        this.appendChatMessage('AI', explanation);
    }

    collectUserFeedback(feedback) {
        fetch('/api/ai_feedback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ feedback })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                this.appendChatMessage('AI', 'Thank you for your feedback!');
            } else {
                this.appendChatMessage('AI', 'Error: Unable to submit feedback.');
            }
        })
        .catch(error => {
            console.error('Error submitting feedback:', error);
            this.appendChatMessage('AI', 'Error: Unable to submit feedback. Please try again later.');
        });
    }
}

export function initAIAssistant() {
    const aiAssistant = new AIAssistant();
    window.aiAssistant = aiAssistant;  // Make it globally accessible if needed
}
