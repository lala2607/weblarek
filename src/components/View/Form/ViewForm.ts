import { Component } from '../../base/Component.ts';
import { IEvents } from '../../base/Events.ts';

export abstract class ViewForm extends Component<any> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._submit = this.container.querySelector('button[type="submit"]')!;
        this._errors = this.container.querySelector('.form__errors')!;

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.onSubmit();
        });
    }

    protected abstract onSubmit(): void;

    set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }
}