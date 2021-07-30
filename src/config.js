const config = {
  s3: {
    REGION: "us-east-2",
    BUCKET: "postitstore-app-upload",
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://v4u1hbaxw1.execute-api.us-east-2.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_YGWkoUcXw",
    APP_CLIENT_ID: "2s6qbuob3gbhrfbkoc6onc6b4k",
    IDENTITY_POOL_ID: "us-east-2:9d4e0267-1328-4790-8f80-ed0e4aa67953",
  }
};

export default config;
