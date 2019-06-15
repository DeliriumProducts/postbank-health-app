const functions = require('firebase-functions');

exports.outputContext = functions.https.onCall((data,context) => {
 response.send(`Hello from Firebase! Your token is ${JSON.stringify(context)}`);
});
