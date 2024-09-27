# AI-Agent-Chat Branch

## Overview

The AI-Agent-Chat branch implements an AI-powered chat assistant for the Myriad Labs trading platform. This feature provides users with an interactive AI assistant capable of answering trading-related questions and providing insights based on the current chart context.

## Functionality

1. **Chat Interface**: A collapsible chat panel accessible via a floating chat icon.
2. **AI Responses**: Integration with OpenAI's GPT model to generate intelligent responses.
3. **Context-Aware**: The AI assistant takes into account the current chart context (symbol, timeframe, price, active indicators) when formulating responses.
4. **User Interaction**: Users can type messages and receive AI-generated responses.

## Key Components

### Frontend

- **Chat Panel**: Located in the bottom-right corner of the interface.
- **Toggle Button**: Allows users to open/close the chat panel.
- **Maximize Button**: Expands the chat panel for better readability.
- **Input Field**: Where users type their messages.
- **Send Button**: Submits the user's message to the AI.
- **Message Display**: Shows the conversation history between the user and the AI.

### Backend

- **AI Client**: Handles communication with the OpenAI API.
- **API Route**: Processes chat requests and returns AI responses.

## Files to Focus On

When working on the AI-Agent-Chat feature, concentrate on these files to avoid interfering with other functionalities:

1. `src/ai/ai_client.py`: Contains the AIClient class for interacting with the OpenAI API.
2. `src/routes/api_routes.py`: Includes the `/ai_chat` route for processing chat requests.
3. `static/js/modules/aiAssistant.js`: Manages the frontend chat functionality.
4. `static/css/ai-chat.css`: Styles specific to the AI chat interface.
5. `templates/index.html`: Contains the HTML structure for the chat panel (only modify the AI chat-related sections).

## Implementation Details

### AI Client (`src/ai/ai_client.py`)

- Uses the OpenAI API to generate responses.
- Incorporates a system prompt to guide the AI's behavior.
- Handles context information from the chart to provide more relevant answers.

### API Route (`src/routes/api_routes.py`)

- Processes POST requests to `/api/ai_chat`.
- Passes user messages and chart context to the AI client.
- Returns AI-generated responses to the frontend.

### Frontend Module (`static/js/modules/aiAssistant.js`)

- Manages the chat UI (opening, closing, maximizing).
- Handles sending user messages to the backend.
- Displays AI responses in the chat panel.
- Retrieves current chart context to send with each message.

## Future Improvements

To enhance the AI Agent Chat feature, consider the following areas for improvement:

1. Implement message history persistence.
2. Add support for more complex chart analysis.
3. Integrate with a financial news API for up-to-date market information.
4. Implement user feedback mechanism for AI responses.
5. Add support for voice input/output.
6. Enhance the AI's ability to explain technical indicators and trading strategies.

When working on these improvements, ensure to maintain the modular structure and avoid modifying files unrelated to the AI chat functionality.
