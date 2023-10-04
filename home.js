function depositMoney() {
   document.getElementsByClassName("button")[1].addEventListener("click", function() {
    document.querySelector(".deposit-money").style.display = "flex";
   });
}

function close() {
    document.querySelector(".close").addEventListener("click", function() {
     document.querySelector(".deposit-money").style.display = "none";
     let money = document.getElementById("money-input");
     money.placeholder = "         $1 - $999,999,999"
    });
}

function updateCash() {
    let depositButton = document.getElementById("deposit-button");
    depositButton.addEventListener("click", function() {
        let money = document.getElementById("money-input");
        cash = money.value;

        if (cash[0] == '0') {
            money.value = "";
            money.placeholder = "                 Try again";
        }
        else if (cash >= 1 && cash <= 999999999) {
            document.getElementById("cash-home").textContent = "Cash: $" + cash + "💰";
            document.querySelector(".deposit-money").style.display = "none";
            money.value = "";
            money.placeholder = "         $1 - $999,999,999";
            autoAdjustMargin();
        } else {
            money.value = "";
            money.placeholder = "                 Try again";
        }
    });
}

function autoAdjustMargin() {
    const element = document.querySelector('.cash-container');
    const width = element.offsetWidth;
    element.style.setProperty('--width', `${width}px`);
}

if (window.location.pathname === '/home.html') {
    autoAdjustMargin();
    depositMoney();
    close();
    updateCash();
}




