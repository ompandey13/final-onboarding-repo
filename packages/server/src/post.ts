import * as AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME || "demo";

exports.handler = async (event: {
  pathParameters: { userid: string };
  body: string;
}) => {
  let userid = event.pathParameters?.userid;
  let { firstName, lastName, email, website } = JSON.parse(event.body);
  let item = {
    userid: userid,
    firstName: firstName,
    lastName: lastName,
    email: email,
    website: website,
  };

  await dynamodb
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Data inserted/updated successfully",
    }),
  };
};
