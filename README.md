# ask-sdk-controls-tutotiral

Unofficial tutorials for [ask-sdk-controls](https://github.com/alexa/ask-sdk-controls).

## Requirements

- Node.js
  - 10.x or higher (I use 14.x)
- AWS Account
  - Maybe you can run sample codes on [Alexa-Hosted skill](https://developer.amazon.com/en-US/docs/alexa/hosted-skills/build-a-skill-end-to-end-using-an-alexa-hosted-skill.html) but I expect using AWS Lambda for execution and AWS SAM for deployment.
- Highly recommend to learn [Alexa Skill Kit](https://developer.amazon.com/ja-JP/alexa/alexa-skills-kit) and [alexa-skills-kit-sdk-for-nodejs](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) at first if you haven't learn it.
- AWS SAM CLI
    - To deploy code to AWS Lambda, I use `sam deploy` command in chapter.

## Chapter

  - [Chapter01](./chapter01)
    - Run your first skill with ask-sdk-controls
  - [Chapter02](./chapter02)
    - Handle different kind of intents. Handle multiple acts with visual response
  - [Chapter03](./chapter03)
    - Use `State` to store data for keeping context
  - [Chapter04](./chapter04)
    - Use `Initiative Phase` with multiple controls
  - [Chapter05](./chapter05)
    - Optimize response more contextual
