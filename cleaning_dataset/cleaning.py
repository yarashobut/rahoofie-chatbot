import openai
from openai import OpenAI
from keys import api_key

client = OpenAI(api_key)
import json

# Set your OpenAI API key here

def check_moderation(text):
    response = client.moderations.create(input=text)
    return response.results[0].flagged

def analyze_jsonl_file(file_path):
    with open(file_path, 'r') as file:
        for line_number, line in enumerate(file, start=1):
            data = json.loads(line)
            text = data.get('role', '') + ' ' + data.get('content', '')
            if check_moderation(text):
                print(f"Line {line_number} is flagged for potential policy violation.")
                print(f"Content: {text}")
                print("--------")
        print("youre all good!")

if __name__ == "__main__":
    jsonl_file_path = './conversations.jsonl'
    analyze_jsonl_file(jsonl_file_path)
