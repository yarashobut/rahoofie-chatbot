from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from keys import api_key


client = OpenAI()
app = Flask(__name__)
CORS(app)
client.api_key = api_key 

@app.route('/message', methods=['POST'])
def get_message():
    data = request.json
    chat_history = data['chatHistory']  # Receive the chat history as a list
    
    response = client.chat.completions.create(
                model="ftjob-Xscbap64dK0BBiY0zRvM8nzk",
                messages=chat_history,
                temperature=0.7,
                max_tokens=2000,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
        )
# Use the formatted conversation to get a response from GPT model
    response = response.choices[0].message.content
    print(response)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)