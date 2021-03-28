import 'jest';
import { SkillTester, ControlHandler, TestInput } from 'ask-sdk-controls';
import { HelloWorldControlManager } from '../src';

describe('index', () => {
    test('it responds with hello message to all kinds of request', async () => {
        const tester = new SkillTester(
            new ControlHandler(new HelloWorldControlManager()),
        );

        await tester.testTurn('', TestInput.launchRequest(), 'A: Hello World');
        await tester.testTurn(
            'U: hello',
            TestInput.of('HelloWorldIntent'),
            'A: Hello World',
        );
    });
});
