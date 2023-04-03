import openai
import json
import os
from dotenv import load_dotenv

load_dotenv() # load variables from the .env file
#api_key = os.getenv("API_KEY")
api_key = "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"
openai.api_key = api_key
response = openai.Completion.create(
  engine="davinci",
  prompt="Generate some basic python code",
  max_tokens=100
)

response_dict = json.loads(response.choices[0].text)
code_block = response_dict['text']

print(code_block)
