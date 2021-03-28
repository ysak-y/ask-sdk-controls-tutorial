# Chapter01

## Run your first skill by using ask-sdk-controls

Let's run your first skill by using ask-sdk-controls.

At first, open `src/index.ts`. This is the whole skill code of Chapter01.

```typescript

import { SkillBuilders } from 'ask-sdk-core';
import {
    ContainerControl,
    ContentAct,
    ControlHandler,
    ControlInput,
    ControlManager,
    ControlResponseBuilder,
    ControlResultBuilder,
} from 'ask-sdk-controls';

class HelloWorldAct extends ContentAct {
    render(input: ControlInput, responseBuilder: ControlResponseBuilder) {
        responseBuilder.addPromptFragment('Hello World');
    }
}

class RootControl extends ContainerControl {
    async canHandle(input: ControlInput) {
        return true;
    }

    async handle(input: ControlInput, resultBuilder: ControlResultBuilder) {
        resultBuilder.addAct(new HelloWorldAct(this));
    }
}

export class HelloWorldControlManager extends ControlManager {
    createControlTree() {
        return new RootControl({ id: 'RootControl' });
    }
}

export const handler = SkillBuilders.custom()
    .addRequestHandlers(new ControlHandler(new HelloWorldControlManager()))
    .lambda();

```

`HelloWorldControlManager` class is the ControlManager which creates control tree.
 
In this code, this class deals `RootControl` class which just responds just adding `HelloWorldAct` to all kinds of request as root control.

And then, you need to generate instance of `ControlHandler` class with `HelloWorldManager` and set it as request handler. Then, `ControlHandler` handles control tree and returns response when receive the request.

To understand detail of it, you need to learn about `Control` and `Act` at first.

## Control

`Control` has similar concepts with `Intent Handler` in [alexa-skills-kit-sdk-for-nodejs](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs).

It's confirmed whether can respond or not by using `canHandle` function, and be called `handle` function for execution.

Actually, `RootControl` class which very brief control is similar with `Intent Handler`.

But `Control` is not `Intent Handler`. There are some different feature from `Intent Handler`. Because of these, `Control` can orchestrate some logics than `Intent Handler` and contain other `Control` as it's child.

But in Chapter01, you don't need to learn about it. you just need to know `canHandle` and `handle`.

In this code, `RootControl` always returns `true` in it's `canHandle` method, so it's `handle` method is always called for every request.

## Act

`Act` is the class for describing presentation logic.
It receives `ControlInput` and `ControlResponseBuilder` as it's arguments of `render` method.
`ControlResponseBuilder` has methods to build response. `ControlInput` has some properties about context of request (ex: `HandlerInput` of `alexa-skills-kit-sdk-for-nodejs`). `Act` builds response by using these.

In chapter01, `HelloWorldAct` just adds `Hello World` as it's response speech. You can add reprompt, card, APL if you want in this method.

## Let's deploy and run it.

To deploy to AWS Lamdba, please following instruction as below.

1. Run `yarn` to install modules

```sh
$ yarn
```

2. Transpile `.ts` to `.js`. code would be generated under `dist` directory.

```sh
$ yarn run build
```

3. Copy `node_modules` to `dist` directory

```sh
$ cp -r node_modules dist/node_modules
```

4. Generate zip file

```sh
$ cd dist/ && zip -r bundle.zip * && cd ../
```

5. Deploy to AWS Lambda by using SAM

```sh
$ sam deploy --guided
```

So then, you would deploy code to AWS Lambda. You can test it by setting this Lambda function to endpoint of the skill.

## Test

Let's execute `yarn run test` command at first. You would see results of unit tests.
You can see it in `tests/index.test.ts`.

You can test your by generating instance of `SkillTester` class with `ControlHandler` you want to test.

To test, call `testTurn` with your expection of input and output.
