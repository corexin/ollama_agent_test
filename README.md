# ollama local agent demo in typescript

## Step to run

- clone the project
- have local ollama server running
- install qwen2.5:3b-instruct model
- run: npm install
- run: npm run start

## Description

- agent.ts contains main loop and logic
- llm.ts contains local ollama client code
- tools.ts contains a list of method as local tools
- /log contains code related to logging
- /prompt contains code related to prompt generation
