import 'jest';
import { SkillTester, ControlHandler, TestInput } from 'ask-sdk-controls';
import { CountControlManager } from '../src';

describe('index', () => {
    test('Increase the number', async () => {
        const tester = new SkillTester(
            new ControlHandler(new CountControlManager()),
        );

        await tester.testTurn(
            'U: Increase the number',
            TestInput.of('IncrementIntent'),
            'A: Okay, now count is 1',
        );
    });

    test('Decrease the number', async () => {
        const tester = new SkillTester(
            new ControlHandler(new CountControlManager()),
        );

        await tester.testTurn(
            'U: Decrease the number',
            TestInput.of('DecrementIntent'),
            'A: Okay, now count is -1',
        );
    });

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
});
