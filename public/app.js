
const debug = promise => promise
  .then(result=>console.log(result))
  .catch(reason=>console.error(reason));

// debug(app.server.signup('you@example.com','super_secret'))
// debug(app.server.validateEmail('you@example.com','from the events log'))
// debug(app.server.login('you@example.com','super_secret'))
// debug(app.server.createPost('hello, world!','oldest trick in the book'))
// debug(app.server.getPosts())
// debug(app.server.updatePost(1, 'worm', 'not always'))
// debug(app.server.deletePost(1))

class BlogApp {
  constructor(url) {
    this.element = document.createElement('div');
    this.server = new ApiServer(url);

    this.render();
  }
  render() {
    return Promise.all([
      this.server.getPosts()
    ]).then(results => {
      const [posts] = results;
      this.element.innerHTML = html`
        <ul>${posts.map(post => html`
          <li>
            <div class="title">$${post.title}</div>
            <div class="author">$${post.author}</div>
            <div class="created_at">$${post.created_at}</div>
            <div class="body">$${post.body}</div>
          </li>`)}
        </ul>
      `;
    });
  }
}

const app = new BlogApp('http://localhost:3000');
document.body.appendChild(app.element);
