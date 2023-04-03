import openai
import os
from dotenv import load_dotenv

load_dotenv() # load variables from the .env file
api_key = os.getenv("API_KEY")

def api():
    # Set up the OpenAI API key
    openai.api_key = api_key

    # Set the prompt
    prompt = "write me a UCQ about python with 4 possible answers in wich one is correct without explanation and indicate the correct answer with a line that begins with \"Correct Answer : \" and the answers need to start with A) B) C) D)"

    # Generate the text
    response = openai.Completion.create(
    engine="text-davinci-002",
    prompt=prompt,
    temperature=0.5,
    max_tokens=1000,
    n=1,
    stop=None,
    frequency_penalty=0,
    presence_penalty=0
    )

    body = response.choices[0].text
    msg = body.split('\n')
    answer = msg[-1]
    remaining_lines = msg[:-1]
    question = '\n'.join(remaining_lines)
    print(question)
    print(answer)


api()
