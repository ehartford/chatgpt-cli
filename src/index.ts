
import readline from 'readline/promises'
import { stdin, stdout } from 'process'

interface Message {
  role: 'user' | 'system' | 'assistant'
  content: string
}

interface Completions {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: ({
    message: Message;
    finish_reason: string;
    index: number;
  })[];
}

(async () => {
  const messages: Message[] = []
  const rl = readline.createInterface(stdin, stdout)
  try {
    messages.push({
      role: 'system',
      content: await rl.question("What type of chatbot would you like to create? ")
    });

    while (true) {
      messages.push({
        role: 'user',
        content: await rl.question("prompt? (exit) ")
      });
      if (!messages[messages.length - 1].content || messages[messages.length - 1].content === 'exit') break;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_APIKEY}`
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages
        })
      })

      const completions = await res.json() as Completions

      messages.push(completions.choices[0].message)
      console.log(completions.choices[0].message.content)
    }
  } catch (err) {
    console.log(`Error: `, err)
  } finally {
    rl.close()
    process.exit(0)
  }
})();