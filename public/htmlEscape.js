// From http://www.2ality.com/2015/01/template-strings-html.html
// Use html`$${<expression>}` to escape HTML
function html(literals, ...substs) {
  return literals.raw.reduce((acc, lit, i) => {
    let subst = substs[i-1];
    if (Array.isArray(subst)) {
        subst = subst.join('');
    }
    if (acc.endsWith('$')) {
        subst = htmlEscape(subst);
        acc = acc.slice(0, -1);
    }
    return acc + subst + lit;
  });
}

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;') // first!
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/`/g, '&#96;');
}
