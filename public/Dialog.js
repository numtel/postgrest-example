'use strict';
class Dialog extends Component {
  constructor(options) {
    super();
    this.options = options || {};
    this.initRender();
  }
  render() {
    this.element.className = 'dialog';

    const fields = Object.keys(this.options.fields || {}).map(fieldName => {
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
        ${this.options.message ? this.html`<p>$${this.options.message}</p>` : ''}
        ${fields.length ? this.html`
          ${fields.join('')}
          <button type="submit" class="submit">Submit</button>
          <button type="button" class="close">Cancel</button>
        ` : this.html`
          <button type="button" class="close">Ok</button>
        `}
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

    this.element.querySelector('button.close')
      .addEventListener('click', () => {
        typeof this.options.onClose === 'function' && this.options.onClose();
      }, false);
  }
}
