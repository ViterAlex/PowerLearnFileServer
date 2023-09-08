module.exports = {
  apps: [
    {
      name: "PowerLearnFileServer",
      script: "./app.js",
      watch: true,
      env: {
        "NODE_ENV": "prod",
        "PORT": 3001,
        "ROOT_DIR": "/home/ubuntu/www/files"
      },
      ignore_watch: ["node_modules",
        "client/img",
        "\\.git",
        "*.log",
        "Model/completedTests.db",
        "completed.xml"
      ]
    }
  ]
};
