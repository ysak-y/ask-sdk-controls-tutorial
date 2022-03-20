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
import { ChangeColorAct, LaunchAct } from './acts/RootControlActs';

class RootControl extends ContainerControl {
    handleFunc: (
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) => Promise<void>;

    async canHandle(input: ControlInput) {
        if (InputUtil.isLaunchRequest(input)) {
            this.handleFunc = this.handleLaunchRequest;
        } else if (this.isChangeColorIntent(input)) {
            this.handleFunc = this.handleGenerateNewColorRequest;
        } else {
            this.handleFunc = this.handleUnhandledRequest;
        }

        return true;
    }

    private async isChangeColorIntent(input) {
        return (
            InputUtil.isIntent(input, 'ChangeColorIntent') ||
            InputUtil.isAPLUserEventWithMatchingControlId(input, 'RootControl')
        );
    }

    private async handleLaunchRequest(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        resultBuilder.addAct(new LaunchAct(this));
    }

    private async handleGenerateNewColorRequest(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        resultBuilder.addAct(new ChangeColorAct(this));
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

export class BackgroundColorControlManager extends ControlManager {
    createControlTree() {
        return new RootControl({ id: 'RootControl' });
    }
}

export const handler = SkillBuilders.custom()
    .addRequestHandlers(new ControlHandler(new BackgroundColorControlManager()))
    .lambda();
