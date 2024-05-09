const forwarderOrigin = "https://google.com";

const initialize = () => {
  const connectButton = document.getElementById("connectWallet");
  const { ethereum } = window;

  const onboardMetaMaskClient = async () => {
    if (!isMetamaskInstalled()) {
      // prompt the user to install it
      console.log("MetaMask is not installed :(");
      connectButton.value = "Click here to install metamask";
      connectButton.onclick = installMetaMask;
    } else {
      console.log("MetaMask is installed Hurray!!!!!");
      connectButton.onclick = connectMetaMask;
    }
  };

  const connectMetaMask = async () => {
    connectButton.disabled = true;
    try {
      if (window.ethereum) {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x14A34" }],
          });
        } catch (error) {
          console.log("faile.d to switch chain", error);
          if (error.code === 4902) {
            try {
              await ethereum // Or window.ethereum if you don't support EIP-6963.
                .request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x14A34",
                      chainName: "Base Sepolia",
                      rpcUrls: ["	https://sepolia.base.org"] /* ... */,
                      nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18,
                      },
                    },
                  ],
                });
            } catch (addError) {
              // Handle "add" error.
              console.log("Failed to add chain", addError);
            }
          }
        }
        const web3 = new Web3(window.ethereum);
        // Request the user to connect accounts (Metamask will prompt)
        await window.ethereum.request({ method: "eth_requestAccounts" });

        await window.ethereum.enable();

        // Get the connected accounts
        const accounts = await web3.eth.getAccounts();

        // Display the connected account
        console.log("accounts >> ", accounts);
        connectButton.value = "Connected";
        console.log("accounts: ", accounts);
        connectButton.disabled = false;

        // const contractAddress = "0x0606944D33bd847F7aB3d42071091f5C46c61Ed6";
        // const abi = await (await fetch("./abi/polycoin.json")).json();

        // const myContract = new web3.eth.Contract(abi, contractAddress);
        // myContract.handleRevert = true;

        // console.log("myContract", myContract);

        // const response = await myContract.methods
        //   .transferFrom(
        //     "0x71591254e98f19A3768a57aFca0A502BBA2206F4",
        //     "0xa0c65C074FB8e650c8466BC47E08D51Ac6302DDe",
        //     1 * 10 ** 18
        //   )
        //   .send({
        //     from: "0xa0c65C074FB8e650c8466BC47E08D51Ac6302DDe",
        //   });

        // web3.eth
        //   .getBlockNumber()
        //   .then((result) => {
        //     console.log("Current block number: " + result);
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });
      } else {
        // Alert the user to download Metamask
        // alert("Please download Metamask");
      }
    } catch (err) {
      console.error("error occured calling the contract: ", err);
    }
  };

  const isMetamaskInstalled = () => {
    return ethereum && ethereum.isMetaMask;
  };

  const installMetaMask = () => {
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    connectButton.value = "Installation in progress";
    connectButton.disabled = true;
    onboarding.startOnboarding();
  };

  onboardMetaMaskClient();
};

window.addEventListener("DOMContentLoaded", initialize);
