import {
    ContentAct,
    ControlInput,
    ControlResponseBuilder,
    OutputModality,
} from 'ask-sdk-controls';

export const simpleColorFrameDocument = {
    type: 'APL',
    version: '1.9',
    mainTemplate: {
        items: [
            {
                id: 'BackgroundColorFrame',
                type: 'Frame',
                width: '100vw',
                height: '100vh',
                bind: [
                    {
                        name: 'colorName',
                        value: 'white',
                    },
                ],
                backgroundColor: '${colorName}',
                items: [
                    {
                        type: 'Container',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        items: [
                            {
                                type: 'Text',
                                text: '${colorName}',
                                fontSize: '10vw',
                            },
                            {
                                type: 'TouchWrapper',
                                commands: [
                                    {
                                        type: 'SendEvent',
                                        arguments: ['RootControl'],
                                    },
                                ],
                                items: [
                                    {
                                        type: 'Text',
                                        text: 'Change Color',
                                        fontSize: '10vw',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

export class LaunchAct extends ContentAct {
    render(input: ControlInput, responseBuilder: ControlResponseBuilder): void {
        responseBuilder.addPromptFragment(
            "Welcome to the color generator, I'll generate the color randomly. Please say 'generate new color' if you want to generate new one",
        );
        responseBuilder.addAPLRenderDocumentDirective(
            'BackgroundColorToken',
            simpleColorFrameDocument,
        );
    }
}

export class ChangeColorAct extends ContentAct {
    render(input: ControlInput, responseBuilder: ControlResponseBuilder): void {
        if (input.suggestedResponseStyle.modality === OutputModality.VOICE) {
            responseBuilder.addPromptFragment('Okay, this is the new color');
        }

        const colors = ['black', 'white', 'red', 'blue', 'green'];

        responseBuilder.addAPLExecuteCommandsDirective('BackgroundColorToken', [
            {
                type: 'SetValue',
                componentId: 'BackgroundColorFrame',
                property: 'colorName',
                value: colors[getRandomInt(colors.length)],
            },
        ]);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
