import os
from openai import OpenAI
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class AIClient:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.system_prompt = (
            "You are an AI assistant specializing in forex trading analysis and strategy.\n"
            "Provide concise, informative responses to trading-related queries.\n"
            "Offer insights on market trends, technical analysis, and risk management,\n"
            "but avoid giving specific financial advice. Always remind users to do their own research\n"
            "and consult with licensed financial advisors for personalized advice.\n"
            "When provided with chart context, use this information to give more accurate and relevant responses.\n"
            "Consider the current symbol, timeframe, price, and active indicators when formulating your answers.\n"
            "You can perform complex analysis and calculations based on the provided data."
        )

    def generate_response(self, prompt, chart_context=None):
        try:
            messages = [
                {"role": "system", "content": self.system_prompt}
            ]
            if chart_context:
                context_message = self.format_chart_context(chart_context)
                messages.append({"role": "user", "content": context_message})
            messages.append({"role": "user", "content": prompt})

            response = self.client.chat.completions.create(
                model="gpt-4o-mini-2024-07-18",  # or "o1-mini-2024-09-12" for o1-mini
                messages=messages,
                max_tokens=500,
                n=1,
                stop=None,
                temperature=0.7,
            )
            message = response.choices[0].message.content.strip()
            logger.info(f"AI response generated successfully")
            return message
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            raise Exception(f"Error generating AI response: {str(e)}")

    def format_chart_context(self, chart_context):
        context_message = "Chart Context:\n"
        context_message += f"Symbol: {chart_context.get('symbol', 'N/A')}\n"
        context_message += f"Timeframe: {chart_context.get('timeframe', 'N/A')}\n"
        context_message += f"Current Price: {chart_context.get('price', 'N/A')}\n"
        
        indicators = chart_context.get('indicators', [])
        if indicators:
            context_message += "Active Indicators:\n"
            for indicator in indicators:
                context_message += f"- {indicator['type']}: {indicator['params']}\n"
        else:
            context_message += "No active indicators\n"
        
        return context_message
