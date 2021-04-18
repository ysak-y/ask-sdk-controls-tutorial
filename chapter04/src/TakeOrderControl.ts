import {
    ContainerControl,
    ContainerControlState,
    ControlInput,
    ControlResultBuilder,
    falseIfGuardFailed,
    InputUtil,
    LiteralContentAct,
    LiteralInitiativeAct,
    okIf,
    SimplifiedIntent,
} from 'ask-sdk-controls';

class DrinkOrderState extends ContainerControlState {
    constructor() {
        super();
        this.value = {
            name: null,
            confirmed: false,
        };
    }
}

export class TakeOrderControl extends ContainerControl {
    handleFunc: (
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) => Promise<void>;

    constructor(props) {
        super(props);
        this.state = new DrinkOrderState();
    }

    async canHandle(input: ControlInput) {
        try {
            okIf(!this.state.value.name || !this.state.value.confirmed);
            if (InputUtil.isIntent(input, 'OrderDrinkIntent')) {
                this.handleFunc = this.handleOrderDrinkIntent;
                return true;
            } else if (this.isApproveConfirmationRequest(input)) {
                this.handleFunc = this.handleApproveConfirmationRequest;
                return true;
            } else if (this.isDenyConfirmationRequest(input)) {
                this.handleFunc = this.handleDenyConfirmationRequest;
                return true;
            }
        } catch (e) {
            return falseIfGuardFailed(e);
        }
    }

    private isApproveConfirmationRequest(input: ControlInput) {
        return (
            InputUtil.isBareYes(input) &&
            this.state.value.name &&
            !this.state.value.confirmed
        );
    }

    private isDenyConfirmationRequest(input: ControlInput) {
        return (
            InputUtil.isBareNo(input) &&
            this.state.value.name &&
            !this.state.value.confirmed
        );
    }

    private async handleApproveConfirmationRequest(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        this.state.value.cofirmed = true;
        resultBuilder.addAct(
            new LiteralContentAct(this, {
                promptFragment: 'Okay, I got it.',
            }),
        );
        resultBuilder.endSession();
    }

    private async handleDenyConfirmationRequest(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        this.state.value.name = null;
        resultBuilder.addAct(
            new LiteralContentAct(this, {
                promptFragment: 'Okay, I got it. Delete your order.',
            }),
        );
    }

    private async handleOrderDrinkIntent(
        input,
        resultBuilder: ControlResultBuilder,
    ) {
        const intent = SimplifiedIntent.fromIntent(input.request.intent);
        this.state.value.name = intent.slotResolutions.Drink.slotValue;
        resultBuilder.addAct(
            new LiteralContentAct(this, {
                promptFragment: `Okay, so that's ${this.state.value.name}.`,
            }),
        );
    }

    async handle(input: ControlInput, resultBuilder: ControlResultBuilder) {
        await this.handleFunc(input, resultBuilder);
    }

    async canTakeInitiative(input: ControlInput) {
        return !this.state.value.name || !this.state.value.confirmed;
    }

    async takeInitiative(
        input: ControlInput,
        resultBuilder: ControlResultBuilder,
    ) {
        if (!this.state.value.name) {
            resultBuilder.addAct(
                new LiteralInitiativeAct(this, {
                    promptFragment: 'What drink do you want?',
                }),
            );
        } else if (this.state.value.name && !this.state.value.confirmed) {
            resultBuilder.addAct(
                new LiteralInitiativeAct(this, {
                    promptFragment: 'Is that right?',
                }),
            );
        }
    }
}
