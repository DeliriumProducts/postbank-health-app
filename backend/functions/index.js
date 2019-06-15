const functions = require('firebase-functions');

exports.outputContext = functions.https.onCall((data, context) => {
  return context;
});
