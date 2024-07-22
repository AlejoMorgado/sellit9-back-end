const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let body;

  try {
    body = JSON.parse(event.body);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Invalid JSON", error: error.message }),
    };
  }

  const { characterId, name, gender, species, status, image } = body;

  const params = {
    TableName: "CharactersTable",
    Item: {
      characterId,
      name,
      gender,
      species,
      status,
      ...(image && { image }),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Character registered successfully" }),
    };
  } catch (error) {
    console.error("Error registering character:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Error registering character",
        error: error.message,
      }),
    };
  }
};
