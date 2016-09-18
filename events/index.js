var PS = require('pg-pubsub');

if(process.argv.length !== 3) {
  console.log("USAGE: DB_URL");
  process.exit(2);
}
var url  = process.argv[2],
    ps   = new PS(url);

// password reset request events
ps.addChannel('reset', console.log);
// email validation required event
ps.addChannel('validate', console.log);

// modify me to send emails
