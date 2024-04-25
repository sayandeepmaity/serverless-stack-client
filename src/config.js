const config = {
  MAX_ATTACHMENT_SIZE: 5000000, // 5MB
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes12345",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://u1j0li58y7.execute-api.us-east-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_SgbF4P0qi",
    APP_CLIENT_ID: "1kfa6o34lbtl4ge4916fr45ld9",
    IDENTITY_POOL_ID: "us-east-1:07d44113-3954-4d6b-af9c-4f19363481d0",
  },
};

export default config;
