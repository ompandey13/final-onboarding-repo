import * as AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME || "demo";

exports.handler = async (event: { pathParameters: { userid: string } }) => {
  let userid = event.pathParameters?.userid;

  await dynamodb
    .delete({
      TableName: tableName,
      Key: {
        userid: userid,
      },
    })
    .promise();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "User deleted Successfully",
    }),
  };
};
