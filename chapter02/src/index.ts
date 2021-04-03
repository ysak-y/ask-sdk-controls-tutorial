import { SkillBuilders } from 'ask-sdk-core';
import {
    ContainerControl,
    ContentAct,
    ControlHandler,
    ControlInput,
    ControlManager,
    ControlResponseBuilder,
    ControlResultBuilder,
    InputUtil,
    LiteralContentAct,
} from 'ask-sdk-controls';

const simpleTextWithDelayDocument = (text) => {
    return {
        type: 'APL',
        version: '1.6',
        mainTemplate: {
            items: [
                {
                    type: 'Container',
                    width: '100vw',
                    height: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                    items: [
                        {
                            type: 'Text',
                            text,
                            fontSize: '10vw',
                            display: 'none',
                            onMount: [
                                {
                                    type: 'SetValue',
                                    property: 'display',
                                    value: 'normal',
                                    delay: 2000,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    };
};

class PlayLookThisWayAct extends ContentAct {
    render(input: ControlInput, responseBuilder: ControlResponseBuilder) {
        responseBuilder.addPromptFragment('Look ths way');

        const direction = ['Right', 'Left', 'Up', 'Down'];
        responseBuilder.addAPLRenderDocumentDirective(
            'PlayRockPaperScissorsTemplate',
            simpleTextWithDelayDocument(
                direction[Math.ceil(Math.random() * direction.length)],
            ),
        );
    }
}

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

export class GameControlManager extends ControlManager {
    createControlTree() {
        return new RootControl({ id: 'RootControl' });
    }
}

export const handler = SkillBuilders.custom()
    .addRequestHandlers(new ControlHandler(new GameControlManager()))
    .lambda();
