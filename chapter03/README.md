# Chapter03

## Use `State` to store data for keeping context

In this chapter, you can learn about `State` basis.

Let's see `src/index.ts`. And you can find `CountState` class as below.

## Define `State` and configure use in `Control`

```typescript
class CountState extends ContainerControlState {
    constructor() {
        super();
        this.value = 0;
    }
}
```

The basis of `State` is very simple. It is the class just having `value` property with `any` types.
Maybe as you know, `State` has more features and roles. But in this chapter, we just use `State` as value store to keep context during the skill session.

To use `State` in `Control`, we need to set its instance in `constructor` of `Control` class.

```typescript
    constructor(props) {
        super(props);
        this.state = new CountState();
    }
```

And then, you can use `State` to store value. In this sample code, `State` value is increased when `handleIncrementIntent` is executed. And decreased when `handleDecrementIntent` is executed.


```typescript
    private async handleIncrementIntent(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        this.state.value += 1;
        resultBuilder.addAct(new CountResultAct(this, this.state.value));
    }

    private async handleDecrementIntent(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        this.state.value -= 1;
        resultBuilder.addAct(new CountResultAct(this, this.state.value));
    }
```

## Check the details by test code

Let's see `test/index.test.ts`. You can see details behaviour of this sample code.
`Control` keeps state value with multiple turns as below.

```typescript
    test('Increase and decrease the number', async () => {
        const tester = new SkillTester(
            new ControlHandler(new CountControlManager()),
        );

        await tester.testTurn(
            'U: Increase the number',
            TestInput.of('IncrementIntent'),
            'A: Okay, now count is 1',
        );

        await tester.testTurn(
            'U: Increase the number',
            TestInput.of('IncrementIntent'),
            'A: Okay, now count is 2',
        );

        await tester.testTurn(
            'U: Decrease the number',
            TestInput.of('DecrementIntent'),
            'A: Okay, now count is 1',
        );
    });
```


## Let's deploy and run it.

See [chapter01](https://github.com/ysak-y/ask-sdk-controls-tutorial/tree/main/chapter01#lets-deploy-and-run-it).

And I prepared the recognition model to `interactionModel.json`. You can build interaction model by using it.
