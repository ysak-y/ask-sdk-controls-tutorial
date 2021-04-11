import { SkillBuilders } from 'ask-sdk-core';
import {
    ContainerControl,
    ContainerControlState,
    ContentAct,
    Control,
    ControlHandler,
    ControlInput,
    ControlManager,
    ControlResponseBuilder,
    ControlResultBuilder,
    InputUtil,
    LiteralContentAct,
} from 'ask-sdk-controls';

const simpleTextDocument = (text) => {
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
                        },
                    ],
                },
            ],
        },
    };
};

class CountResultAct extends ContentAct {
    count: number;

    constructor(control: Control, count: number) {
        super(control);
        this.count = count;
    }

    render(input: ControlInput, responseBuilder: ControlResponseBuilder) {
        responseBuilder.addPromptFragment(`Okay, now count is ${this.count}`);
        responseBuilder.addAPLRenderDocumentDirective(
            'CountResultTemplate',
            simpleTextDocument(this.count),
        );
    }
}

class CountState extends ContainerControlState {
    constructor() {
        super();
        this.value = 0;
    }
}

class RootControl extends ContainerControl {
    handleFunc: (
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) => Promise<void>;

    constructor(props) {
        super(props);
        this.state = new CountState();
    }

    async canHandle(input: ControlInput) {
        if (InputUtil.isIntent(input, 'IncrementIntent')) {
            this.handleFunc = this.handleIncrementIntent;
            return true;
        } else if (InputUtil.isIntent(input, 'DecrementIntent')) {
            this.handleFunc = this.handleDecrementIntent;
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

    async handle(input: ControlInput, resultBuilder: ControlResultBuilder) {
        await this.handleFunc(input, resultBuilder);
    }
}

export class CountControlManager extends ControlManager {
    createControlTree() {
        return new RootControl({ id: 'RootControl' });
    }
}

export const handler = SkillBuilders.custom()
    .addRequestHandlers(new ControlHandler(new CountControlManager()))
    .lambda();
