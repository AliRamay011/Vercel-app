module.exports = {
  apps: [
    {
      name: "Backend",
      script: "server.js",
      env: {
        NODE_ENV: "development",
        PORT: 5000, // ADD THIS LINE
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000, // ADD THIS LINE
      },
    },
  ],
};
