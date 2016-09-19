'use strict';
class BlogApp extends ComponentWithModal {
  constructor(url) {
    super();
    this.server = new ApiServer(url);
    this.renderContext.posts = this.server.getPosts();

    this.initRender();
  }
  render(context) {
    this.element.className = 'blog';

    const buttons = [];
    if(!this.server.authToken) {
      buttons.push({
        dialog: {
          title: 'Login',
          fields: {
            email: { label: 'Email' },
            pass: { label: 'Password', type: 'password' }
          }
        },
        onClick: result => this.server.login(result.email, result.pass)
      });

      buttons.push({
        dialog: {
          title: 'Sign Up',
          fields: {
            email: { label: 'Email' },
            pass: { label: 'Password', type: 'password' }
          }
        },
        onClick: result => this.server.signup(result.email, result.pass)
      });

      buttons.push({
        dialog: {
          title: 'Validate Email',
          message: 'Find your email validation token in the events service log.',
          fields: {
            email: { label: 'Email'},
            token: { label: 'Token'}
          }
        },
        onClick: result => this.server.validateEmail(result.email, result.token)
      });
    }

    this.element.innerHTML = this.html`
      ${buttons.map(button => this.html`
        <button class="menu">$${button.dialog.title}</button>
      `)}
      <ul>${context.posts.map(post => this.html`
        <li>
          <div class="title">$${post.title}</div>
          <div class="author">$${post.author}</div>
          <div class="created_at">$${post.created_at}</div>
          <div class="body">$${post.body}</div>
        </li>`)}
      </ul>
    `;

    buttons.forEach((button, index) => {
      this.element.querySelector(`button.menu:nth-child(${index + 1})`)
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

    this.renderModal();
  }
}

