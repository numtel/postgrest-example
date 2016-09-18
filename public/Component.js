'use strict';
class Component {
  constructor() {
    this.element = document.createElement('div');

    // Asynchronous (Promise) values to wait for on render
    this.renderContext = {};
  }
  initRender() {
    const ctxKeys = Object.keys(this.renderContext);
    return Promise.all(ctxKeys.map(key => this.renderContext[key]))
      .then(results => {
        return results.reduce((obj, value, index) => {
          obj[ctxKeys[index]] = value;
          return obj;
        }, {});
      })
      .then(this.render.bind(this));
  }
  render(context) {
    this.element.innerHTML = this.html``;
  }

  // From http://www.2ality.com/2015/01/template-strings-html.html
  // Use html`$${<expression>}` to escape HTML
  html(literals, ...substs) {
    return literals.raw.reduce((acc, lit, i) => {
      let subst = substs[i-1];
      if (Array.isArray(subst)) {
          subst = subst.join('');
      }
      if (acc.endsWith('$')) {
          subst = this.htmlEscape(subst);
          acc = acc.slice(0, -1);
      }
      return acc + subst + lit;
    });
  }

  htmlEscape(str) {
    return str.replace(/&/g, '&amp;') // first!
              .replace(/>/g, '&gt;')
              .replace(/</g, '&lt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;')
              .replace(/`/g, '&#96;');
  }
}
