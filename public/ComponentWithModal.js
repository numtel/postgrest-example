'use strict';
class ComponentWithModal extends Component {
  constructor() {
    super();
    this.modalDialog = null;
  }
  renderModal() {
    this.modalDialog && this.element.appendChild(this.modalDialog.element);
  }
  closeModal() {
    this.modalDialog = null;
    this.initRender();
  }
  promptModal(options) {
    return new Promise((resolve, reject) => {
      if(this.modalDialog) {
        reject(new ModalClosed('EXISTING_MODAL'));
        return;
      }

      this.modalDialog = new Dialog(Object.assign({}, options, {
        onSubmit: data => {
          resolve(data);
          this.closeModal();
        },
        onClose: () => {
          this.closeModal();
          if(options.fields) reject(new ModalClosed());
          else resolve();
        }
      }), this.global);

      this.initRender();
    });
  }
  renderButtonMenu(selector, buttons) {
    this.element.querySelector(selector).innerHTML =
      buttons.map(button => this.html`
        <button class="menu">$${button.title || button.dialog.title}</button>
      `).join('');

    buttons.forEach((button, index) => {
      this.element.querySelector(`${selector} button.menu:nth-child(${index + 1})`)
        .addEventListener('click', () => {
          this.promptModal(button.dialog)
            .then(button.onClick.bind(this))
            .then(() => this.initRender())
            .catch(reason => {
              if(!(reason instanceof ModalClosed)) {
                console.error(reason);
                this.promptModal({
                  title: button.dialog.title + ' Failure',
                  message: 'An error has occurred. Please check your inputs and try again.'
                });
              }
            });
        });
    });
  }
}

class ModalClosed extends Error {}
