const authController = require("./auth.controller");
const manualController = require("./manual.controller");
const accountController = require("./account.controller");

module.exports = {
  ...authController,
  ...manualController,
  ...accountController,
};
