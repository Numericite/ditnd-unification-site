from deepeval import assert_test
from deepeval.test_case import LLMTestCase, LLMTestCaseParams
from deepeval.metrics import GEval
import requests
import os
from dotenv import load_dotenv

load_dotenv()

ALBERT_API_URL = os.getenv("ALBERT_API_URL")
ALBERT_API_KEY = os.getenv("ALBERT_API_KEY")


def test_correctness():
    input, expected_output, actual_output = albert_prompt_test()

    print(input, expected_output, actual_output)

    correctness_metric = GEval(
        name="Correctness",
        criteria="Determine if the 'actual output' is correct based on the 'expected output'.",
        evaluation_params=[
            LLMTestCaseParams.ACTUAL_OUTPUT,
            LLMTestCaseParams.EXPECTED_OUTPUT,
        ],
        threshold=0.5,
    )

    test_case = LLMTestCase(
        input=input, actual_output=actual_output, expected_output=expected_output
    )

    assert_test(test_case, [correctness_metric])


def albert_prompt_test():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(script_dir, "../../src/utils/prompts/chatbot-system.md")
    with open(prompt_path, "r") as f:
        system_prompt = f.read()

    base_payload = {
        "model": "albert-small",
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
        ],
        "temperature": 0.1,
        "response_format": {"type": "json_object"},
        "max_completion_tokens": 500,
    }

    input = {"role": "user", "content": "Je veux aider mon élève dyslexique"}
    payload = base_payload.copy()
    payload["messages"].append(input)

    response = requests.post(
        f"{ALBERT_API_URL}/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {ALBERT_API_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
    )

    if response.status_code != 200:
        raise Exception(
            f"Request failed with status code {response.status_code}: {response.text}"
        )

    actual_output = response.json()["choices"][0]["message"]["content"]

    test_expected_output = {
        "content": "Bonjour, j'ai compris que vous étes parent/proche. Quels sont les aspects ou vous avez besoin d'aide pour votre élève dyslexique ?",
        "choices": ["xxx", "yyy", "zzz"],
        "user_choices": "parent/proche",
    }

    return input["content"], test_expected_output["content"], str(actual_output)
