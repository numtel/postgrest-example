'use strict';
class Dialog extends Component {
  constructor(options) {
    super();
    this.options = options;
    this.initRender();
  }
  render() {
    this.element.className = 'dialog';

    const fields = Object.keys(this.options.fields).map(fieldName => {
      const field = this.options.fields[fieldName];
      return this.html`
        <label>
          <span>$${field.label || fieldName}</span>
          <input
            name="$${fieldName}"
            type="$${field.type || 'text'}"
            />
        </label>
      `;
    });

    this.element.innerHTML = this.html`
      <form>
        <span class="title">$${this.options.title}</span>
        ${fields.join('')}
        <button type="submit" class="submit">Submit</button>
        <button type="button" class="cancel">Cancel</button>
      </form>
    `;

    this.element.querySelector('form')
      .addEventListener('submit', event => {
        event.preventDefault();
        const fields = Object.keys(this.options.fields).reduce((obj, fieldName) => {
          const fieldInput = this.element.querySelector(`input[name=${fieldName}]`);
          obj[fieldName] = fieldInput.value;
          return obj;
        }, {});
        typeof this.options.onSubmit === 'function' && this.options.onSubmit(fields);
      }, false);

    this.element.querySelector('button.cancel')
      .addEventListener('click', () => {
        typeof this.options.onCancel === 'function' && this.options.onCancel();
      }, false);
  }
}
