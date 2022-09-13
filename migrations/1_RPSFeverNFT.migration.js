let RPSFeverNFT = artifacts.require("RPSFeverNFT");

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(RPSFeverNFT, "RPSFeverNFT", "RPSFeverNFT", "RPSFeverNFT");
};
