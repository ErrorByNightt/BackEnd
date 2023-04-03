import requests
import json

# Make API call and get response
response = requests.post(
    "https://api.openai.com/v1/engines/text-davinci-002/completions",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
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
code_snippet = json_data["choices"][0]["text"]

# Print the code snippet
print(code_snippet)