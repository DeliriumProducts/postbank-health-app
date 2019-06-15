const functions = require('firebase-functions');

exports.outputContext = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    return { context: context.auth };
  });
