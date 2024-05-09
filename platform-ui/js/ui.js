window.onload = function() {
    //Write the values dynamically
    dynamicWrite("fulfillment", 25, "%");
    dynamicWrite("orders", 200, " ");
    dynamicWrite("materials", 24, "T");
    dynamicWrite("tokens",5.348, "PC");
    dynamicWrite("customer-yield",80,"%");
    dynamicWrite("average-weight", 5, "T");
}

function toggle(className)
{
    var table = document.getElementsByClassName(className)[0];
    if (table.style.display === "none" || table.style.display === "") {
        table.style.display = "block";
    } else {
        table.style.display = "none";
    }
    toggleBackdrop();
}

function dynamicWrite(className, targetValue, unit) {
    var element = document.getElementsByClassName(className)[0];
    var textHome = element.querySelector(".card-text");
    var currentValue = 0;

    var intervalId = setInterval(function() {
        if (currentValue <= targetValue) {
            textHome.innerHTML = currentValue + unit;
            currentValue++;
        } else {
            clearInterval(intervalId);
        }
    }, 50);
}
function toggleBackdrop()
{
    var backdrop = document.getElementsByClassName("backdrop")[0];
    if (backdrop.style.display === "none" || backdrop.style.display === "") {
        backdrop.style.display = "block";
    } else {
        backdrop.style.display = "none";
    }
}