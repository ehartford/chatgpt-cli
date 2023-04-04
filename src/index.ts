import { parse } from 'csv-parse'
import fs from 'fs'
import fetch from 'node-fetch-commonjs'

import * as dotenv from 'dotenv'
dotenv.config()

interface Message {
  role: 'user' | 'system' | 'assistant'
  content: string
}

interface Completions {
  id: string
  object: string
  created: number
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  };
  choices: ({
    message: Message
    finish_reason: string
    index: number
  })[];
}

export interface Question {
  "Question ID": string;
  "Question Title": string;
  "Question Slug": string;
  "Question Text": string;
  "Topic Tagged text": string;
  "Difficulty Level": string;
  "Success Rate": number;
  "total submission": number;
  "total accepted": number;
  Likes: number;
  Dislikes: number;
  Hints: string;
  "Similar Questions ID": string;
  "Similar Questions Text": string;
}

const resumeFromLine = parseInt(process.argv[2]) || 0;
const parser = parse({
  delimiter: ',',
  columns: true,
});

const lines: Question[] = [];
const prompt = `Can you please answer the following question in each of C++, Java, Python, and JavaScript?  Please don't write any test code, just the function(s) that solves the problem. The explanation should only be on the algorithm level, not the specific language implementation.  Please answer in the following format:
### C++ ###
<your code here>
### Java ###
<your code here>
### Python ###
<your code here>
### JavaScript ###
<your code here>
### Explanation ###
<your explanation here>
### End ###

Here is the question:\n
`;

async function sendOne() {
  if (lines.length === 0) process.exit(0);
  const line = lines.shift()!;
  const questionId = line["Question ID"];
  const questionText = line["Question Text"];
  if (!questionText.trim()) return;

  const messages: Message[] = [
    {
      role: 'system',
      content: 'helpful bot'
    },
    {
      role: 'user',
      content: prompt + questionText
    }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-4",
      messages
    })
  }).catch(err => {
    console.log(err, { questionId, questionText });
    clearInterval(timer);
    process.exit(1);
  });
  if (res.status !== 200) {
    console.log(res.status, res.body, { questionId, questionText });
  }
  const completions = await res.json() as Completions;
  console.log(JSON.stringify({
    id: line["Question ID"],
    question: line["Question Text"],
    answer: completions.choices[0].message.content
  }));

}

let timer: NodeJS.Timer;
parser.on('readable', function () {
  let line;
  while (line = parser.read()) {
    lines.push(line);
  }
});
parser.on('error', function (err) {
  console.log(err.message);
});
parser.on('finish', function () {
  sendOne();
  timer = setInterval(sendOne, 30000);
});

const readStream = fs.createReadStream('leetcode_questions.csv', { start: resumeFromLine });
readStream.on('open', () => { readStream.pipe(parser); })