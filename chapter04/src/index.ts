import { SkillBuilders } from 'ask-sdk-core';
import {
    ContainerControl,
    ControlHandler,
    ControlInput,
    ControlManager,
    ControlResultBuilder,
    InputUtil,
    LiteralContentAct,
} from 'ask-sdk-controls';
import { TakeOrderControl } from './TakeOrderControl';

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

export class CoffeeShopControlManager extends ControlManager {
    createControlTree() {
        return new RootControl({ id: 'RootControl' });
    }
}

export const handler = SkillBuilders.custom()
    .addRequestHandlers(new ControlHandler(new CoffeeShopControlManager()))
    .lambda();
