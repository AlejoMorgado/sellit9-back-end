const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "CharactersTable";

exports.handler = async (event) => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error("Error retrieving data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to retrieve data from DynamoDB.",
        error: error.message,
      }),
    };
  }
};
