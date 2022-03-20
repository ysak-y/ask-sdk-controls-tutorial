import 'jest';
import {
    ControlHandler,
    TestInput,
    testTurn,
    SkillInvoker,
} from 'ask-sdk-controls';
import { BackgroundColorControlManager } from '../src';

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
