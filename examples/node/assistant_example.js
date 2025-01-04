import OpenAI from 'openai';

// Initialize the client
const client = new OpenAI();

async function runAssistantExample() {
    try {
        // Create an assistant
        const assistant = await client.assistants.create({
            name: "Math Tutor",
            instructions: "You are a helpful math tutor. Write and run Python code to solve math problems.",
            model: "gpt-4o",
            tools: [{ type: "code_interpreter" }]
        });

        // Create a thread
        const thread = await client.threads.create();

        // Add a message to the thread
        await client.threads.messages.create(
            thread.id,
            {
                role: "user",
                content: "Can you help me solve this calculus problem? Find the derivative of f(x) = x^3 + 2x^2 - 4x + 1"
            }
        );

        // Create a run
        const run = await client.threads.runs.create(
            thread.id,
            {
                assistant_id: assistant.id
            }
        );

        // Poll for the run to complete
        let runStatus = await client.threads.runs.retrieve(
            thread.id,
            run.id
        );

        while (runStatus.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            runStatus = await client.threads.runs.retrieve(
                thread.id,
                run.id
            );
        }

        // Get the assistant's response
        const messages = await client.threads.messages.list(thread.id);
        
        messages.data.forEach(msg => {
            const prefix = msg.role === 'assistant' ? 'Assistant: ' : 'User: ';
            console.log(`${prefix}${msg.content[0].text.value}`);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

runAssistantExample();