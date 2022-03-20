# Chapter05

## Optimize response more contextual

In this chapter, you learn techniques to build response which is optimized to the context.

## Check suggestedResponseStyle in ControlInput

`suggestedResponseStyle` is the property in `ControlInput` class. It would be `VOICE`, `SCREEN` or `INDETERMINATE`.
Recommend to just showing the screen without voice when `SCREEN`, respond with the voice and show screen optionaly if `VOICE`, `INDETERMINATE` means response type is not yet known.

You can check it in `suggestedResponseStyle` property of the `ControlInput` when build response in the `Act`.
Example is as follows (from `./src/acts/RootControlActs.ts`). Checking `suggestedResponseStyle` and add voice response if `modality` of it is `VOICE`.

```typescript
export class ChangeColorAct extends ContentAct {
    render(input: ControlInput, responseBuilder: ControlResponseBuilder): void {
        if (input.suggestedResponseStyle.modality === OutputModality.VOICE) {
            responseBuilder.addPromptFragment('Okay, this is the new color');
        }

        const colors = ['black', 'white', 'red', 'blue', 'green'];

        responseBuilder.addAPLExecuteCommandsDirective('BackgroundColorToken', [
            {
                type: 'SetValue',
                componentId: 'BackgroundColorFrame',
                property: 'colorName',
                value: colors[getRandomInt(colors.length)],
            },
        ]);
    }
}
```

## Test

As this test case shows, Alexa wouldn't say anything if sends request by touch interaction (from `./tests/index.test.ts`).

```typescript
describe('index', () => {
    test('Change color by voice', async () => {
        const invoker = new SkillInvoker(
            new ControlHandler(new BackgroundColorControlManager()),
        );

        await testTurn(
            invoker,
            '',
            TestInput.launchRequest(),
            "a: Welcome to the color generator, I'll generate the color randomly. Please say 'generate new color' if you want to generate new one",
        );

        await testTurn(
            invoker,
            'u: Change color',
            TestInput.intent('ChangeColorIntent'),
            'a: Okay, this is the new color',
        );
    });

    test('Change color by touch', async () => {
        const invoker = new SkillInvoker(
            new ControlHandler(new BackgroundColorControlManager()),
        );

        await testTurn(
            invoker,
            '',
            TestInput.launchRequest(),
            "a: Welcome to the color generator, I'll generate the color randomly. Please say 'generate new color' if you want to generate new one",
        );

        await testTurn(
            invoker,
            'u: Change color',
            TestInput.simpleUserEvent(['RootControl']),
            'a:',
        );
    });
});
```

## Let's deploy and run it.

See [chapter01](https://github.com/ysak-y/ask-sdk-controls-tutorial/tree/main/chapter01#lets-deploy-and-run-it).

And I prepared the recognition model to `interactionModel.json`. You can build interaction model by using it.
