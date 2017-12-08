'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
var fetchurl = require('node-fetch');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();


//Get all Images Details
module.exports.list = (event, context, callback) => {
       dynamoDb.scan({"TableName": process.env.IMAGES_TABLE}).promise()
      .then(res => callback(null,res))
      .catch(err => callback(err));
};


//Insert Image to The Bucket
module.exports.upload = (event, context, callback) => {
  const params = JSON.parse(event.body);
  const fname = params.fname;
  const description = params.desc;
  const iurl = params.iurl;

  var sParams = {
    Bucket: 'imagecollectionbucket',
    Key:  params.fname,    
    ContentType: params.type,
    ACL: 'public-read',
  };

  var imageURL = "https://s3.amazonaws.com/imagecollectionbucket/"+fname;

  var uploadURL = s3.getSignedUrl('putObject', sParams);

  // Insert to DynamoDB


var item = {
     "id":uuid.v1(),
     "filename":  fname,
     "description": description,
     "imageURL": imageURL,
};
 var param = {
     TableName: process.env.IMAGES_TABLE, 
     Item: item
 };
 dynamoDb.putItem(param,function(err,data){
     if (err) console.log(err);
     else console.log(data);
 });  
  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ uploadURL: uploadURL }),
  })

}

