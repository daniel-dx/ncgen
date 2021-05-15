module.exports = {
  transform: {
    "\\.m?jsx?$": "jest-esm-transformer",
  },
  setupFilesAfterEnv: ['./jest.setup.js']
};
