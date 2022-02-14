import * as AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME || "demo";

exports.handler = async (event: { pathParameters: { userid: string } }) => {
  let userid = event.pathParameters?.userid;
  let data = await dynamodb
    .get({
      TableName: tableName,
      Key: {
        userid: userid,
      },
    })
    .promise();
  if (data.Item) {
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } else {
    throw new Error("User not found");
  }
};
