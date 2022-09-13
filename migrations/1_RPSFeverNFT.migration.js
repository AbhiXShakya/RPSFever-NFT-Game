let RPSFeverNFT = artifacts.require("RPSFeverNFT");

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(RPSFeverNFT, "RPS Fever NFT", "RPSFNFT", "ipfs://id/");
};
