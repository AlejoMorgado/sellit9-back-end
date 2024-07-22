const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ message: "Invalid JSON" }),
    };
  }

  const { characterId, name, gender, image, species, status } = body;
  if (!characterId || !name || !gender || !image || !species || !status) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ message: "Missing required fields" }),
    };
  }

  const params = {
    TableName: "CharactersTable",
    Key: { characterId },
    UpdateExpression: `
      set #name = :name,
          #gender = :gender,
          #image = :image,
          #species = :species,
          #status = :status`,
    ExpressionAttributeNames: {
      "#name": "name",
      "#gender": "gender",
      "#image": "image",
      "#species": "species",
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":gender": gender,
      ":image": image,
      ":species": species,
      ":status": status,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "Character updated successfully",
        updatedAttributes: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ message: "Error updating character", error }),
    };
  }
};
