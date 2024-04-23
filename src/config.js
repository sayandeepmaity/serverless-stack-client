const config = {
  MAX_ATTACHMENT_SIZE: 5000000, // 5MB
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-api-prod-serverlessdeploymentbucket-bzzecg2v5vih",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://kytxc4jao2.execute-api.us-east-1.amazonaws.com/prod/",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_SzYYjoopX",
    APP_CLIENT_ID: "76fefkq6rhkj7na7o6ieclj9uc",
    IDENTITY_POOL_ID: "us-east-1:8b993d69-8249-4053-b699-681d82eef895",
  },
};

export default config;
