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
      <div class="menu"></div>
      <ul class="posts"></ul>
    `;

    const postList = this.element.querySelector('ul.posts');
    context.posts.forEach(post => {
      const blogPost = new BlogPost(post, this);
      postList.appendChild(blogPost.element);
    });

    const buttons = [
      {
        dialog: {
          title: 'Create Post',
          fields: {
            title: { label: 'Title' },
            body: { label: 'Body', type: 'textarea' }
          }
        },
        onClick: result => this.server.createPost(result.title, result.body)
          .then(() => this.renderContext.posts = this.server.getPosts())
      }
    ];

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
            email: { label: 'Email' },
            token: { label: 'Token' }
          }
        },
        onClick: result => this.server.validateEmail(result.email, result.token)
      });
    }

    this.renderButtonMenu('.menu', buttons);
    this.renderModal();
  }
}

