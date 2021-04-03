import 'jest';
import { SkillTester, ControlHandler, TestInput } from 'ask-sdk-controls';
import { GameControlManager } from '../src';

describe('index', () => {
    test('It starts rock-paper-scissors game', async () => {
        const tester = new SkillTester(
            new ControlHandler(new GameControlManager()),
        );

        await tester.testTurn(
            "U: Let's play rock paper scissors",
            TestInput.of('PlayRockPaperScissorsIntent'),
            "A: Okay, so let's start it... Rock, paper, scissors, one two three",
        );
    });

    test('It starts look this way game', async () => {
        const tester = new SkillTester(
            new ControlHandler(new GameControlManager()),
        );

        await tester.testTurn(
            "U: Let's play rock paper scissors",
            TestInput.of('PlayLookThisWayIntent'),
            "A: Okay, so let's start it... Look ths way",
        );
    });
});
