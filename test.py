import requests
import json
import openai
import os
import sys
from dotenv import load_dotenv

load_dotenv() # load variables from the .env file
api_key = os.getenv("API_KEY")

key = "Bearer "+ api_key

# Make API call and get response
response = requests.post(
    "https://api.openai.com/v1/engines/text-davinci-002/completions",
    headers={
        "Content-Type": "application/json",
        "Authorization": key,
    },
    json={
        "prompt": "give an easy coding problem in python where you start the problem section with \"Problem :\" and the solution section with \"Solution :\" and the output section with \"Output :\" without an explanation",
        "max_tokens": 1000,
        "temperature": 0.5,
    },
)

# Extract code snippet from response
json_data = json.loads(response.text)
#print(json_data)
#code_snippet = json_data["choices"][0]["text"]

# Print the code snippet
#print(code_snippet)
print(json_data["choices"][0]["text"])