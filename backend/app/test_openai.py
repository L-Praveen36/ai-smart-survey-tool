import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  # loads .env file variables

def test_openai():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY is not set in .env")
        return

    client = OpenAI(api_key=api_key)

    # Basic test with GPT-3.5 Turbo model
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello in a friendly way."}
        ],
        max_tokens=50
    )

    print("Response from OpenAI:")
    print(response.choices[0].message.content.strip())

if __name__ == "__main__":
    test_openai()
