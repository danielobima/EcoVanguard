const makePayment = async (e) => {
  e.preventDefault();
  const amount = parseInt(document.getElementById("amount").value);
  const address = document.getElementById("address").value;

  const submitButton = document.getElementById("submitButton");
  submitButton.disabled = true;
  submitButton.innerHTML = "Making Payment...";
  const makePaymentResponse = document.getElementById("makePaymentResponse");
  makePaymentResponse.style.display = "none";
  try {
    // console.log("placeOrder", amount);

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
    const account = (
      await window.ethereum.request({ method: "eth_requestAccounts" })
    )[0];
    console.log("account", account);
    const web3 = new Web3(window.ethereum);

    const contractAddress = "0x0606944D33bd847F7aB3d42071091f5C46c61Ed6";
    const abi = await (await fetch("./abi/polycoin.json")).json();

    const myContract = new web3.eth.Contract(abi, contractAddress);
    myContract.handleRevert = true;

    const response = await myContract.methods
      .transfer(address, amount * 10 ** 18)
      .send({
        from: account,
      });

    console.log("contract response", response);
    makePaymentResponse.innerHTML = "Transfered successfully";
  } catch (error) {
    console.log(error);
    makePaymentResponse.innerHTML = "Failed to transfer";
  }
  makePaymentResponse.style.display = "block";

  submitButton.disabled = false;
  submitButton.innerHTML = "Submit";
};

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("paymentForm");
  form.onsubmit = makePayment;
});

const acceptOrder = (id) => {
  console.log("acceptOrder", id);
  document.getElementById(id).remove();
};
