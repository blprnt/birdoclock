module.exports = {
  apps: [
    {
      name: "birdoclock",
      script: "server.js",
      env: {
        PORT: 3001,
        NODE_ENV: "production",
      },
      restart_delay: 1000,
      max_restarts: 10,
    },
  ],
};
