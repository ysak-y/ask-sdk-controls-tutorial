# Chapter04

## Use `Initiative Phase` with multiple controls

In this chapter, you learn about `Initiative Phase` and basis of child controls.

## What is Initiative Phase, and why you need to introduce it

Sometimes your skill would ask some questions to user for completing user requirement.  And these are expected to proper for user's response.

But if your skill needs to gather some information from user like travel reservation skill, it's difficult to handle user's response and make proper question by only using `handle` function. Your skill need to recite property for user's response and make proper question. Basically these logics are complicate.

We can resolve it by introducing `Initiative Phase` to the skill.
Technically, this is very similar to `Handle Phase`. ask-sdk-controls framework executes `canHandle` and add response fragments to response builder by executing `handle`. After, executes `canTakeInitiative` and add response fragments to response builder by executing `takeInitiative`. Finally all fragments are combined.

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
At first, you need to check `addChild` and `TakeOrderControl`. In this chapter, you need to deal multiple controls in the skill.

## Add the control as child control to another control

In chapter01, I mentioned `Control` has similar concepts with `Intent Handler`. But unlike it, `Control` can be nested by another `Control`.

Why do we need to nest these? By doing it, we can separate logics and routings by each situations. For example, if we implement pizza shop skill.

We need to implement the logics and routings for asking user what kind of pizza, toppings. Maybe you want to ask address to deliver. Also you may want to ask user about delivery time.
And even more, maybe you want to add logics for helping user of each situations., you need to add logics for dealing unexpected request from user.

If you implement all of these to `RootControl`, maybe anyone can't understand the logics of it. Anyone can't predicate the behavior if they change somelogics.

In this situation, you can separate logics and routings by situations with child controls.
To add the control as child controls, you need to call `addChild` with instance of child control in `constructor` method. In this chapter, I add only one control as child, but you can add multiple controls as child controls.

```typescript
    constructor(props) {
        super(props);
        this.addChild(new TakeOrderControl({ id: 'TakeOrderControl' }));
    }
```

Then, you can call `handle` method of child control by using `canHandleByChild` and `handleByChild` methods. `canHandleByChild` method call `canHandle` method of each child contorls, and return true if some controls return true, or return false if all child controls return false in its `canHandle` method.
`handleByChild` returns `handle` method of the child control which returns true in its `canHandle` method. If some child controls return true, basically first child control is used. You can modify this rule by overriding `decideHandlingChild` method of `ContainerControl`.

```typescript
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
```

In this example, `handleLaunchRequest` will be executed if `InputUtil.isLaunchRequest(input)` returns true, and then `RootControl` asked its child control whether can handle it or not by calling `canHandleByChild` method. If child control can handle it, `handle` method will be called by calling `handleByChild` otherwise `handleUnhandledRequest` will be executed.

## Use `Initiative Phase` to separate the logic for building next question from it for message

Let's see `TakeOrderControl.ts`. You can see `canTakeInitiative` and `takeInitiative` methods. As I described at first, `Initiative Phase` this is very similar to `Handle Phase` technically. It's called after `handle` method is executed and basically add some acts to response builder. Finally these are merged.

```typescript
    async canTakeInitiative(input: ControlInput) {
        return !this.state.value.name || !this.state.value.confirmed;
    }

    async takeInitiative(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        if (!this.state.value.name) {
            resultBuilder.addAct(
                new LiteralInitiativeAct(this, {
                    promptFragment: 'What drink do you want?',
                }),
            );
        } else if (this.state.value.name && !this.state.value.confirmed) {
            resultBuilder.addAct(
                new LiteralInitiativeAct(this, {
                    promptFragment: 'Is that right?',
                }),
            );
        }
    }
```

`canTakeInitiative` will return true if `name` or `confirmed` in its state don't exist. And add `What drink do you want?` message if `name` doesn't exist,  add `Is that right?` if `name` exists but `confirmed` doesn't exist.
Later, message will be combined behind to anohter one built in `handle` method.

## Test

Now, you will understand about `Initiative Phase` by seeing test suites.

```typescript
    test('Asks what to drink after welcome message', async () => {
        const tester = new SkillTester(
            new ControlHandler(new CoffeeShopControlManager()),
        );

        await tester.testTurn(
            '',
            TestInput.launchRequest(),
            'A: Welcome! This is the voice coffee shop. What drink do you want?',
        );
    });
```

Skill responds to `Welcome! This is the voice coffee shop. What drink do you want?` when launch skill. It's because `Welcome! This is the voice coffee shop.` message is added by calling `isLaunchRequest` method if `RootControl` in `Handle Phase` and `What drink do you want?` is added by `takeInitiative` of `TakeOrderControl` in `Initiative Phase`.

`RootControl` doesn't override `canTakeInitiative` method, it is same as just calling `canTakeInitiativeByChild` method. It's just returns whether any child contorls return true in its `canTakeInitiative` mehtod.
```typescript
    return this.canTakeInitiativeByChild(input);
```

You can check detail of `Initiative Phase` by checking other test suites.

## Let's deploy and run it.

See [chapter01](https://github.com/ysak-y/ask-sdk-controls-tutorial/tree/main/chapter01#lets-deploy-and-run-it).

And I prepared the recognition model to `interactionModel.json`. You can build interaction model by using it.
