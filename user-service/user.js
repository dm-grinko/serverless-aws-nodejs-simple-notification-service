'use strict';
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const SNS_EMAIL_TOPIC = process.env.SNS_EMAIL_TOPIC;
const sns = new AWS.SNS({
    region: process.env.REGION
});

const sendResponse = (data, callback) => {
    callback(null, {
        statusCode: data.statusCode || 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(data)
    });
};

const sendEmail = (user) => {
    return sns.publish({
        Message: JSON.stringify({
          "default": JSON.stringify(user)
        }),
        MessageStructure: 'json',
        TopicArn: SNS_EMAIL_TOPIC
    }).promise();
};

module.exports.createUser = async (event, context, callback) => {
    const { userEmail, userName } = JSON.parse(event.body) || {};

    if (typeof userName !== 'string' || typeof userEmail !== 'string') {
        return sendResponse({message: 'Missing required params from body', statusCode: 400}, callback);
    }

    await sendEmail({userEmail, userName});
    return sendResponse({message: 'The request has succeeded'}, callback);
};
