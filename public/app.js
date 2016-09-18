const app = new ApiServer('http://localhost:3000');

const debug = promise => promise
  .then(result=>console.log(result))
  .catch(reason=>console.error(reason));

// debug(app.signup('you@example.com','super_secret'))
// debug(app.validateEmail('you@example.com','from the events log'))
// debug(app.login('you@example.com','super_secret'))
