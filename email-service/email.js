const aws = require('aws-sdk');
const ses = new aws.SES();
const EMAIL = process.env.EMAIL;
const DOMAIN = process.env.DOMAIN;

const sendResponse = (payload) => {
  const {message} = payload;
  return {
    statusCode: payload.statusCode || 200,
    headers: {
      'Access-Control-Allow-Origin': DOMAIN,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({message})
  }
}

const getParams = ({userEmail, userName}) => {
  return {
    Source: EMAIL,
    Destination: { ToAddresses: [EMAIL] },
    ReplyToAddresses: [userEmail],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Email: ${userEmail}\nName: ${userName}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New user'
      }
    }
  }
}

module.exports.send = async (event) => {
  try {
    const data = JSON.parse(event.Records[0].Sns.Message);
    const params = getParams(data);
    await ses.sendEmail(params).promise();
    return sendResponse({message: 'The request has succeeded'});
  } catch (error) {
    return sendResponse(error);
  }
}