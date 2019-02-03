const _ = require('lodash');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const constants = require('./utils/constants');

const authenticate = (admin, request, response) => {
  let responseBody;
  try {
    const query = request.query;
    const id = query.id;
    const signature = query.signature;
    const splittedSignature = _.split(signature, '.', 2);
    let encodedSignature = splittedSignature[0];
    const responsePayload = splittedSignature[1];
    const decodedResponsePayload = JSON.parse(
      CryptoJS.enc.Base64.parse(responsePayload).toString(CryptoJS.enc.Utf8),
    );
    const responsePayloadTimestamp = decodedResponsePayload['issued_at'];
    const wordArray = CryptoJS.HmacSHA256(
      responsePayload,
      constants.APP_SECRET,
    );

    let hashedResponsePayload = wordArray.toString(CryptoJS.enc.Base64);
    // Remove padding equal characters
    hashedResponsePayload = hashedResponsePayload.replace(/=+$/g, '');
    // Replace characters according to base64url specifications
    hashedResponsePayload = hashedResponsePayload.replace(/\+/g, '-');
    hashedResponsePayload = hashedResponsePayload.replace(/\//g, '_');

    console.log(
      `${hashedResponsePayload} == ${encodedSignature} : ${_.includes(
        hashedResponsePayload,
        encodedSignature,
      )}`,
    );
    console.log(
      `timestamp diff : ${moment().unix() - responsePayloadTimestamp}`,
    );

    admin
      .auth()
      .createCustomToken(id)
      .then(customToken => {
        responseBody = {
          token: customToken,
        };
        // Send token back to client
        response.status(200).send(responseBody);
      })
      .catch(error => {
        throw error;
      });
  } catch (error) {
    console.log(error);
    response.status(200).send(
      (responseBody = {
        error: {
          message: 'Internal server error.',
        },
      }),
    );
  }
};

module.exports = authenticate;
