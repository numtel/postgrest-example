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

    this.element.innerHTML = this.html`
      <button class="login">Login</button>
      <ul>${context.posts.map(post => this.html`
        <li>
          <div class="title">$${post.title}</div>
          <div class="author">$${post.author}</div>
          <div class="created_at">$${post.created_at}</div>
          <div class="body">$${post.body}</div>
        </li>`)}
      </ul>
    `;

    this.element.querySelector('button.login')
      .addEventListener('click', () => this.login());

    this.renderModal();
  }
  login() {
    this.promptModal({
      title: 'Login',
      fields: {
        email: {
          label: 'Email'
        },
        pass: {
          label: 'Password',
          type: 'password'
        }
      }
    })
    .then(result => {
      console.log(result);
    }).catch(() => {});
  }
}

