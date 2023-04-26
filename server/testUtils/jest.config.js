module.exports = {
  rootDir: "../",
  preset: "ts-jest",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  setupFiles: ["./testUtils/setup.ts"],
};
