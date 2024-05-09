window.onload = function () {
  //Write the values dynamically
  dynamicWrite("fulfillment", 25, "%");
  dynamicWrite("orders", 200, " ");
  dynamicWrite("materials", 24, "T");
  dynamicWrite("tokens", 5.348, "PC");
  dynamicWrite("customer-yield", 80, "%");
  dynamicWrite("average-weight", 5, "T");
};

function toggle(className) {
  var table = document.getElementsByClassName(className)[0];
  if (table.style.display === "none" || table.style.display === "") {
    table.style.display = "block";
  } else {
    table.style.display = "none";
  }
  toggleBackdrop();

  if (className === "paymentsModal") {
    toggleQrCode();
  }
}

function dynamicWrite(className, targetValue, unit) {
  var element = document.getElementsByClassName(className)[0];
  var textHome = element.querySelector(".card-text");
  var currentValue = 0;

  var intervalId = setInterval(function () {
    if (currentValue <= targetValue) {
      textHome.innerHTML = currentValue + unit;
      currentValue++;
    } else {
      clearInterval(intervalId);
    }
  }, 50);
}
function toggleBackdrop() {
  var backdrop = document.getElementsByClassName("backdrop")[0];
  if (backdrop.style.display === "none" || backdrop.style.display === "") {
    backdrop.style.display = "block";
  } else {
    backdrop.style.display = "none";
  }
}

function toggleQrCode() {
  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }

  let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
  );
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}
