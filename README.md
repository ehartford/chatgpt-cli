# chatgpt-cli

ChatGPT-CLI is a command-line interface (CLI) application written in Node.js, which uses Yarn package manager for package management. The application uses the OpenAI [ChatGPT](https://api.openai.com/v1/chat/completions) API to generate responses to user input.

## Installation

1. Clone the repository

   ```
   git clone https://github.com/ehartford/chatgpt-cli.git
   ```

2. Install the dependencies

   ```
   yarn install
   ```

## Usage

1. Sign up for the OpenAI [API](https://platform.openai.com/account/api-keys) and get your API key.

2. Create a `.env` file in the root directory of the project and add the following:

   ```
   OPENAI_API_KEY=<your api key>
   ```

3. Run the application

   ```
   yarn start
   ```

4. Type in a description of what kind of bot you would like ChatGPT to be, and then enter your message and hit enter to receive a response from the ChatGPT model.  The chat history is sent with each request, so the history will get longer and longer and eventually timeout.

```
What type of chatbot would you like to create? friendly bot
prompt? (exit) Tell me something inspirational to cheer me up.
"Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle." - Christian D. Larson. Remember that you have the strength and capability to overcome any hurdles that may come your way. Keep believing in yourself and your abilities, and you will achieve great things.
prompt? (exit) What is the source of that quote?
The quote "Believe in yourself and all that you are" is attributed to Christian D. Larson, who was an American New Thought leader and author of several books on health, spirituality, and leadership. The full quote is "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle."
prompt? (exit)
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as appropriate.

## License

[Apache 2.0](https://raw.githubusercontent.com/ehartford/chatgpt-cli/main/LICENSE)