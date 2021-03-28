import { SkillBuilders } from 'ask-sdk-core';
import {
    ContainerControl,
    ContentAct,
    ControlHandler,
    ControlInput,
    ControlManager,
    ControlResponseBuilder,
    ControlResultBuilder,
} from 'ask-sdk-controls';

class HelloWorldAct extends ContentAct {
    render(input: ControlInput, responseBuilder: ControlResponseBuilder) {
        responseBuilder.addPromptFragment('Hello World');
    }
}

class RootControl extends ContainerControl {
    async canHandle(input: ControlInput) {
        return true;
    }

    async handle(input: ControlInput, resultBuilder: ControlResultBuilder) {
        resultBuilder.addAct(new HelloWorldAct(this));
    }
}

export class HelloWorldControlManager extends ControlManager {
    createControlTree() {
        return new RootControl({ id: 'RootControl' });
    }
}

export const handler = SkillBuilders.custom()
    .addRequestHandlers(new ControlHandler(new HelloWorldControlManager()))
    .lambda();
