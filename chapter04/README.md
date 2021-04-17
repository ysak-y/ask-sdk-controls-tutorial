# Chapter04

## Use `Initiative Phase` with multiple controls

In this chapter, you learn about `Initiative Phase` and basis of child controls.

Sometimes your skill would ask some questions to user for completing user requirement.  And these are expected to proper for user's response.

But if your skill needs to gather some information from user like travel reservation skill, it's difficult to handle user's response and make proper question by only using `handle` function. Your skill need to recite property for user's response and make proper question. Basically these logics are complicate.

To solve it, we can introduce `Initiative Phase`.Technically, this is very similar to `Handle Phase`. ask-sdk-controls framework executes `canHandle` and add response fragments to response builder by executing `handle`. After, executes `canTakeInitiative` and add response fragments to response builder by executing `takeInitiative`. Finally all fragments are combined.

To understand it's detail. Let's see  `RootControl` of `index.ts`.

```typescript
class RootControl extends ContainerControl {
    handleFunc: (
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) => Promise<void>;

    constructor(props) {
        super(props);
        this.addChild(new TakeOrderControl({ id: 'TakeOrderControl' }));
    }

    async canHandle(input: ControlInput) {
        if (InputUtil.isLaunchRequest(input)) {
            this.handleFunc = this.handleLaunchRequest;
        } else if (await this.canHandleByChild(input)) {
            this.handleFunc = this.handleByChild;
        } else {
            this.handleFunc = this.handleUnhandledRequest;
        }

        return true;
    }

    private async handleLaunchRequest(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        resultBuilder.addAct(
            new LiteralContentAct(this, {
                promptFragment: 'Welcome! This is the voice coffee shop.',
            }),
        );
    }

    private async handleUnhandledRequest(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        resultBuilder.addAct(
            new LiteralContentAct(this, {
                promptFragment: "Sorry, I can't hear you.",
            }),
        );
    }

    async handle(input: ControlInput, resultBuilder: ControlResultBuilder) {
        await this.handleFunc(input, resultBuilder);
    }
}
```

There are some codes you may see for the first time.
At first, you need to check `addChild` and `TakeOrderControl`. In this chapter, there are some controls exist.
