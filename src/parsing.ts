import fs from 'fs'
import readline from 'readline'
import _ from 'lodash'

(async () => {

  interface Question { id: string, difficulty: string, title: string, slug: string, content: string, answer?: string }
  interface Answer { id: string, question: string, answer: string }

  const questions: { [key: string]: Question } = {};

  const questions_file = readline.createInterface({
    input: fs.createReadStream('lc_questions.jsonl'),
    crlfDelay: Infinity,
  });

  for await (const line of questions_file) {
    const question = JSON.parse(line) as Question;
    questions[question.id] = question;
  }

  const answers_file = readline.createInterface({
    input: fs.createReadStream('leetcode-solutions.jsonl'),
    crlfDelay: Infinity,
  });

  for await (const line of answers_file) {
    let answer;
    try {
      answer = JSON.parse(line) as Answer;
    } catch (err) {
      console.log(err, line);
      process.exit(1);
    }
    if (questions[answer.id]) {
      questions[answer.id].answer = answer.answer;
    } else {
      questions[answer.id] = {
        id: answer.id,
        difficulty: '',
        title: '',
        slug: '',
        content: answer.question,
        answer: answer.answer
      }
    }
  }

  _(questions).values().orderBy(q => parseInt(q.id)).forEach(q => {
    console.log(JSON.stringify(q));
  });

})();