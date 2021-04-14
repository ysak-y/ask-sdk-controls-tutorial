import 'jest';
import { SkillTester, ControlHandler, TestInput } from 'ask-sdk-controls';
import { CoffeeShopControlManager } from '../src';

describe('index', () => {
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

    test('Recites order and confirm', async () => {
        const tester = new SkillTester(
            new ControlHandler(new CoffeeShopControlManager()),
        );

        await tester.testTurn(
            'U: Americano please',
            TestInput.intent('OrderDrinkIntent', { Drink: 'americano' }),
            "A: Okay, so that's americano. Is that right?",
        );
    });

    test('Asks what to drink again if user denies to confirm', async () => {
        const tester = new SkillTester(
            new ControlHandler(new CoffeeShopControlManager()),
        );

        await tester.testTurn(
            'U: Americano please',
            TestInput.intent('OrderDrinkIntent', { Drink: 'americano' }),
            "A: Okay, so that's americano. Is that right?",
        );

        await tester.testTurn(
            'U: No',
            TestInput.of('AMAZON.NoIntent'),
            'A: Okay, I got it. Delete your order. What drink do you want?',
        );
    });

    test('Takes drink order', async () => {
        const tester = new SkillTester(
            new ControlHandler(new CoffeeShopControlManager()),
        );

        await tester.testTurn(
            'U: Americano please',
            TestInput.intent('OrderDrinkIntent', { Drink: 'americano' }),
            "A: Okay, so that's americano. Is that right?",
        );

        await tester.testTurn(
            'U: Yes',
            TestInput.of('AMAZON.YesIntent'),
            'A: Okay, I got it.',
        );
    });

    test('Asks again with sorry message if user says unexpected word', async () => {
        const tester = new SkillTester(
            new ControlHandler(new CoffeeShopControlManager()),
        );

        await tester.testTurn(
            '',
            TestInput.launchRequest(),
            'A: Welcome! This is the voice coffee shop. What drink do you want?',
        );

        await tester.testTurn(
            'U: Two tickets please',
            TestInput.of('AMAZON.FallbackIntent'),
            "A: Sorry, I can't hear you. What drink do you want?",
        );
    });
});
