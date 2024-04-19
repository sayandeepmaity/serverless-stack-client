const config = {
  s3: {
    REGION: "US East (N. Virginia) us-east-1",
    BUCKET: "notes-api-prod-serverlessdeploymentbucket-bzzecg2v5vih",
  },
  apiGateway: {
    REGION: "US East (N. Virginia) us-east-1",
    URL: "https://kytxc4jao2.execute-api.us-east-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "US East (N. Virginia) us-east-1",
    USER_POOL_ID: "us-east-1_SYu1M8YLq",
    APP_CLIENT_ID: "7j1b1f1vrsck50pbpv5pfkf86h",
    IDENTITY_POOL_ID: "us-east-1:8b993d69-8249-4053-b699-681d82eef895",
  },
};
export default config;