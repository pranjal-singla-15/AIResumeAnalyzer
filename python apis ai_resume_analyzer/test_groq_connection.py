"""
Standalone script to verify the Groq API key and model are working.

Usage:
    python test_groq_connection.py
"""

import os
import sys

from dotenv import load_dotenv
from groq import Groq, APIStatusError, APIConnectionError

MODEL = "openai/gpt-oss-120b"


def main():
    load_dotenv()

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("FAILED: GROQ_API_KEY is not set (check your .env file)")
        sys.exit(1)

    print(f"Using model: {MODEL}")
    print(f"API key loaded: {api_key[:4]}...{api_key[-4:]}")

    client = Groq(api_key=api_key)

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "user", "content": "Reply with exactly: pong"}
            ],
            temperature=0,
        )
        content = response.choices[0].message.content
        print("SUCCESS: Groq API responded.")
        print(f"Response: {content!r}")
    except APIStatusError as e:
        print(f"FAILED: Groq API returned an error status.")
        print(f"Status code: {e.status_code}")
        print(f"Message: {e.message}")
        sys.exit(1)
    except APIConnectionError as e:
        print(f"FAILED: Could not connect to Groq API.")
        print(f"Details: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"FAILED: Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
