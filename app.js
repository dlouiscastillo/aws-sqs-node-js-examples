// Require objects.
var express  = require('express');
var app      = express();
var aws      = require('aws-sdk');
var queueUrl = "https://sqs.us-east-1.amazonaws.com/523469370318/MyFirstQueue";
    
// Load your AWS credentials and try to instantiate the object.
aws.config.loadFromPath(__dirname + '/config.json');

// Instantiate SQS.
var sqs = new aws.SQS();

// Creating a queue.
app.get('/create', function (req, res) {
    var params = {
        QueueName: "MyFirstQueue"
    };
    
    sqs.createQueue(params, function(err, data) {
        if (err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});

// Listing our queues.
app.get('/list', function (req, res) {
    sqs.listQueues(function(err, data) {
        if (err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});

// Sending a message.
// NOTE: Here we need to populate the queue url you want to send to.
// That variable is indicated at the top of app.js.
app.get('/send', function (req, res) {
    var params = {
        MessageBody: 'Hello world!',
        QueueUrl: queueUrl,
        DelaySeconds: 0
    };

    sqs.sendMessage(params, function(err, data) {
        if (err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});

// Receive a message.
// NOTE: This is a great long polling example. You would want to perform
// this action on some sort of job server so that you can process these
// records. In this example I'm just showing you how to make the call.
// It will then put the message "in flight" and I won't be able to 
// reach that message again until that visibility timeout is done.
app.get('/receive', function (req, res) {
    var params = {
        QueueUrl: queueUrl,
        VisibilityTimeout: 600 // 10 min wait time for anyone else to process.
    };
    
    sqs.receiveMessage(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});

// Deleting a message.
app.get('/delete', function (req, res) {
    var params = {
        QueueUrl: queueUrl,
        ReceiptHandle: 'AQEBGIsBV1hnrMVpicyCZrP2i+JCnUCSW/PKAzj9QQDmWo4UVj+wqmE1bRIFuYRfsXIyiuo1q6nh6EbCpqeD5y5rKD9Sqdm6v4SKEuyBP/sRhzodV2lTLmtbTArClaSPn+lN4ra8dNerOJO+jnHbuyiKAFqp5lK2Iqbb8kcW0N2TA8ggZmSr7t/LMdEoKbLNmKJbVvZDAuQwqDTvZBxBb4E2PdtQL9G5IHEzthxKWm2q0Ywe8zrUsIG9H5aDfFLSq68QZEMQvbS4i072IlX/bOuKUIIFLQuM5osRZaWTU/9jaaw+zuBl6lOzEX0kGhVE8uoVkeNVGdFecBkx5kDGn3SQHw=='
    };
    
    sqs.deleteMessage(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});

// Purging the entire queue.
app.get('/purge', function (req, res) {
    var params = {
        QueueUrl: queueUrl
    };
    
    sqs.purgeQueue(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});

// Start server.
var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('AWS SQS example app listening at http://%s:%s', host, port);
});
