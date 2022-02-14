import { classValidator } from "@lambda-middleware/class-validator";
import { composeHandler } from "@lambda-middleware/compose";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import * as AWS from "aws-sdk";
import { IsString } from "class-validator";
AWS.config.update({ region: "us-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME || "demo";

// Define a validator for the body via class-validator
class NameBody {
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    website: string,
    userid: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.website = website;
    this.userid = userid;
  }

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public email: string;

  @IsString()
  public website: string;

  @IsString()
  public userid: string;
}

async function addUser(event: { body: NameBody }) {
  let { firstName, lastName, email, website, userid } = event.body;
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
}

exports.handler = composeHandler(
  errorHandler(),
  classValidator({
    bodyType: NameBody,
    transformer: {},
    validator: { skipMissingProperties: true },
  }),
  addUser
);
