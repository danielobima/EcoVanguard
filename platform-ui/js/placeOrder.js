const placeOrder = async (e) => {
  e.preventDefault();
  const amount = parseInt(document.getElementById("amountInKG").value);

  const placeOrderButton = document.getElementById("placeOrderButton");
  placeOrderButton.disabled = true;
  placeOrderButton.innerHTML = "Placing Order...";
  const placeOrderResponse = document.getElementById("placeOrderResponse");
  placeOrderResponse.style.display = "none";
  try {
    console.log("placeOrder", amount);

    const account = (
      await window.ethereum.request({ method: "eth_requestAccounts" })
    )[0];
    console.log("account", account);
    const web3 = new Web3(window.ethereum);

    const contractAddress = "0xdF2B2cD4720Cea6A719Cd5B6aC7fe21e520C8FBd";
    const abi = await (await fetch("./abi/orders.json")).json();

    const myContract = new web3.eth.Contract(abi, contractAddress);
    myContract.handleRevert = true;

    const response = await myContract.methods.CreateOrder(1).send({
      from: account,
    });

    console.log("contract response", response);
    placeOrderResponse.innerHTML = "Order placed successfully";
  } catch (error) {
    console.log(error);
    placeOrderResponse.innerHTML = "Failed to place order";
  }
  placeOrderResponse.style.display = "block";

  placeOrderButton.disabled = false;
  placeOrderButton.innerHTML = "Submit";
};

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("placeOrderForm");
  form.onsubmit = placeOrder;
});
