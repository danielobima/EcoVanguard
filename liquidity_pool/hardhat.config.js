require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

let privateKey1 = "a3ffb92ebb4b6fcf9b58b999e110d36b1ee3fe4f7ca805f5e3958873a9400933";
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: "https://sepolia.base.org",
      accounts: [privateKey1]
    }
  },
  etherscan: {
    apiKey: {
      sepolia: "9E9JQKSD6IMV4PVU1UFDGYF5WJ3ZDRZ5B9"
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org/"
        }
      }
    ]
  },
  sourcify: {
    enabled: true,
    // Optional: specify a different Sourcify server
    apiUrl: "https://sourcify.dev/server",
    // Optional: specify a different Sourcify repository
    browserUrl: "https://repo.sourcify.dev",
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}