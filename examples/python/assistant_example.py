from openai import OpenAI
import time

# Initialize the client
client = OpenAI()

# Create an assistant
assistant = client.assistants.create(
    name="Math Tutor",
    instructions="You are a helpful math tutor. Write and run Python code to solve math problems.",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}]
)

# Create a thread
thread = client.threads.create()

# Add a message to the thread
message = client.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Can you help me solve this calculus problem? Find the derivative of f(x) = x^3 + 2x^2 - 4x + 1"
)

# Create a run
run = client.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id
)

# Poll for the run to complete
while True:
    run = client.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
    if run.status == "completed":
        break
    time.sleep(1)  # Wait 1 second before polling again

# Get the assistant's response
messages = client.threads.messages.list(thread_id=thread.id)
for msg in messages:
    if msg.role == "assistant":
        print(f"Assistant: {msg.content[0].text.value}")
    else:
        print(f"User: {msg.content[0].text.value}")
