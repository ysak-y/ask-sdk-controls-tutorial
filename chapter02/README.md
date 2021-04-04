# Chapter02

## Handle different kind of intents. Handle multiple acts with visual response

In this chapter, let's create skill which recognize multiple user intents and respond with multiple acts.

Let's see `src/index.ts`. In this chapter, `GameControlManager` is the ControlManager. It sets `RootControl` as root of control tree.

## Handle different kind of intents

`RootControl` is as below. Different from chapter01, its `canHandle` and `handle` methods are a bit complex. But same rule there. `handle` will be called if `canHandle` returns true.

```typescript
class RootControl extends ContainerControl {
    handleFunc: (
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) => Promise<void>;

    async canHandle(input: ControlInput) {
        if (InputUtil.isIntent(input, 'PlayLookThisWayIntent')) {
            this.handleFunc = this.handlePlayLookThisWayIntent;
            return true;
        } else if (InputUtil.isIntent(input, 'PlayRockPaperScissorsIntent')) {
            this.handleFunc = this.handlePlayRockPaperScissorsIntent;
            return true;
        } else if (InputUtil.isLaunchRequest(input)) {
            this.handleFunc = this.handleLaunchRequest;
            return true;
        }

        return false;
    }

    private async handleLaunchRequest(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        resultBuilder.addAct(
            new LiteralContentAct(this, {
                promptFragment: 'Hello',
            }),
        );
    }

    private async handlePlayLookThisWayIntent(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        resultBuilder.addAct(new PlayLookThisWayAct(this));
    }

    private async handlePlayRockPaperScissorsIntent(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        resultBuilder.addAct(new PlayRockPaperScissorsAct(this));
    }

    async handle(input: ControlInput, resultBuilder: ControlResultBuilder) {
        if (!InputUtil.isLaunchRequest(input)) {
            resultBuilder.addAct(
                new LiteralContentAct(this, {
                    promptFragment: "Okay, so let's start it...",
                }),
            );
        }

        await this.handleFunc(input, resultBuilder);
    }
}
```

As mentioned in chapter01, `Control` is not `Intent Handler`. `Control` sometimes includes some intent handlers. In this chapter, `RootControl` can respond to `PlayLookThisWayIntent`, `PlayRockPaperScissorsIntent` and `LaunchRequest` in different ways for each.

For example, if request is `PlayLookThisWayIntent`, `RootControl` sets `handlePlayLookThisWayIntent` method to `handleFunc` property. And then, it will be called in `handle` method. if request is `PlayRockPaperScissorsIntent`, `handlePlayRockPaperScissorsIntent` will be called.

In this way, you can respond to different kind of intents.

## Handle multiple acts

As the name `addPromptFragment` implies, you can add prompts in pieces.

Let's see `test/index.test.ts` and you can see code as below.

```typescript
    ...
    await tester.testTurn(
        "U: Let's play rock paper scissors",
        TestInput.of('PlayRockPaperScissorsIntent'),
        "A: Okay, so let's start it... Rock, paper, scissors, one two three",
    );
    ...
```

Alexa responds to `Okay, so let's start it... Rock, paper, scissors, one two three` to `PlayRockPaperScissorsIntent` intent. Let's see the flow to build this prompt.

As described as above, `handlePlayRockPaperScissorsIntent` will be called if request is `PlayRockPaperScissorsIntent` intent. In this method, `PlayRockPaperScissorsAct` act is added to resultBuidler.

```typescript
    ...
    private async handlePlayRockPaperScissorsIntent(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        resultBuilder.addAct(new PlayRockPaperScissorsAct(this));
    }
    ...
```

`PlayRockPaperScissorsAct` is as below. It adds `Rock, paper, scissors, one two three` message as prompt fragment. and adds return value of `simpleTextWithDelayDocument` as APL Document.

[APL (Amazon Presentaion Language)](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/understand-apl.html) is the language to build visual experience for Alexa Skill Kit. In this APL document, just show the hand randomly after a bit delay.

```typescript
class PlayRockPaperScissorsAct extends ContentAct {
    render(input: ControlInput, responseBuilder: ControlResponseBuilder) {
        responseBuilder.addPromptFragment(
            'Rock, paper, scissors, one two three',
        );

        const hands = ['Rock', 'Paper', 'Scissors'];
        responseBuilder.addAPLRenderDocumentDirective(
            'PlayRockPaperScissorsTemplate',
            simpleTextWithDelayDocument(
                hands[Math.ceil(Math.random() * hands.length)],
            ),
        );
    }
}
```

In this act, only `Rock, paper, scissors, one two three` is added as prompt. So when `Okay, so let's start it...` added?

You can see it in `handle` method.

``` typescript
    async handle(input: ControlInput, resultBuilder: ControlResultBuilder) {
        if (!InputUtil.isLaunchRequest(input)) {
            resultBuilder.addAct(
                new LiteralContentAct(this, {
                    promptFragment: "Okay, so let's start it...",
                }),
            );
        }

        await this.handleFunc(input, resultBuilder);
    }
```

In `handle` method, `Okay, so let's start it...` is added by using `LiteralContent`. `LiteralContentAct` is the kind of system act defined by framework. You can use it when you want to just add simple texts to response.

In other words, If request is `PlayRockPaperScissorsIntent`, `LiteralContentAct` is added in `handle` method at first. And then `handlePlayRockPaperScissorsIntent` in `this.handleFunc` is called and `PlayRockPaperScissorsAct` is added.

Finally, these acts are concatenated.
By using it, you can implement building response logic to flexibly and DRY.

## Let's deploy and run it.

See [chapter01](https://github.com/ysak-y/ask-sdk-controls-tutorial/tree/main/chapter01#lets-deploy-and-run-it).

And I prepared the recognition model to `interactionModel.json`. You can build interaction model by using it.
