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
}

class ModalClosed extends Error {}
