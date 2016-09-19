'use strict';
class BlogPost extends ComponentWithModal {
  constructor(data, parent) {
    super();
    this.data = data;
    this.parent = parent;
    this.initRender();
  }
  render(context) {
    this.element.className = 'post';

    this.element.innerHTML = this.html`
      <li>
        <div class="title">$${this.data.title}</div>
        <div class="author">$${this.data.author}</div>
        <div class="created_at">$${this.data.created_at}</div>
        <div class="body">$${this.data.body}</div>
        <div class="menu"></div>
      </li>
    `;

    this.renderButtonMenu('.menu', [
      {
        title: 'Edit',
        dialog: {
          title: 'Update Post',
          fields: {
            title: { label: 'Title', value: this.data.title },
            body: { label: 'Body', type: 'textarea', value: this.data.body }
          }
        },
        onClick: result => {
          Object.assign(this.data, result);
          return this.parent.server.updatePost(this.data.id, result.title, result.body)
        }
      },
      {
        title: 'Delete',
        dialog: {
          title: `Delete Post "${this.data.title}"`,
          fields: {
            confirm: { label: 'Confirm delete?', type: 'hidden' }
          }
        },
        onClick: result => {
          return this.parent.server.deletePost(this.data.id)
            .then(() => {
              this.parent.renderContext.posts = this.parent.server.getPosts();
              this.parent.initRender();
            });
        }
      }
    ]);
    this.renderModal();
  }
}
