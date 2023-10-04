var deck = []; // Array for the deck of 52 playing cards
var firstCard; // The dealer's face down card
var canHit = true;
var state = "Blackjack";

var dealerScore = 0;
var yourScore = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

let cash = parseInt(localStorage.getItem("cash"));
let profit = 0;
let bet = 0;

function setCash() {
    document.getElementById("cash").textContent = "Cash: $" + cash +  "💰";
}


function buildDeck() {
    let value = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let suits = ["D", "C", "H", "S"];
    deck = [];

    for (let i = 0; i < value.length; ++i) {
        for (let j = 0; j < suits.length; ++j) {
            deck.push(value[i] + "-" + suits[j]);
        }
    }
}

function shuffleDeck() {
    let randomNum;
    for (let i = 0; i < deck.length; ++i) {
        randomNum = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[randomNum];
        deck[randomNum] = temp; 
    }
}

function startGame() {
    setCash();
    firstCard = deck.pop();
    if (firstCard[0] == 'A') {
        dealerAceCount += 1;
    }
    dealerScore = findValue(firstCard);

    for (;dealerScore < 17;) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        if (card[0] == 'A') {
            dealerAceCount += 1;
        }
        let value = findValue(card);
        cardImg.src = "./cards/" + card + ".png";
        cardImg.classList.add("cards");
        cardImg.classList.add("revealed");
        document.getElementById("dealer-cards").append(cardImg);
        dealerScore += value;

        if (dealerScore > 21 && dealerAceCount > 0) {
            dealerScore -= 10;
            dealerAceCount -= 1;
        }
    }

    for (let i = 0; i < 2; ++i) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        if (card[0] == 'A') {
            yourAceCount += 1;
        }
        let value = findValue(card);
        cardImg.src = "./cards/" + card + ".png";
        cardImg.classList.add("cards");
        cardImg.classList.add("revealed");
        document.getElementById("your-cards").append(cardImg);
        yourScore += value;
    }

    let h = document.getElementById("hit");
    let s = document.getElementById("stay");

    h.addEventListener("click", hit);
    s.addEventListener("click", stay);

}

function hit() {
    if (!canHit) {
        return;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    if (card[0] == 'A') {
        yourAceCount += 1;
    }
    let value = findValue(card);
    cardImg.src = "./cards/" + card + ".png";
    cardImg.classList.add("cards");
    cardImg.classList.add("revealed");
    document.getElementById("your-cards").append(cardImg);
    yourScore += value;

    if (yourScore > 21 && yourAceCount > 0) {
        yourScore -= 10;
        yourAceCount -= 1;
    }
    if (yourScore > 21) {
        canHit = false;
    }
}

function stay() {
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + firstCard + ".png";

    let message = "";

    if (yourScore > 21) {
        message = "Dealer Wins!"
        cash -= +bet;
        profit -= +bet;
        setCash();
    } else if (dealerScore > 21) {
        message = "You Win!"
        cash += +bet;
        profit += +bet;
        setCash();
    } else if (yourScore > dealerScore) {
        message = "You Win!"
        cash += +bet;
        profit += +bet;
        setCash();
    } else if (dealerScore > yourScore) {
        message = "Dealer Wins!"
        cash -= +bet;
        profit -= +bet;
        setCash();
    } else if (dealerScore == yourScore) {
        message = "Tie!"
    }

    state = message;

    document.getElementById("title").textContent = message;
    document.getElementsByClassName("identity")[0].textContent = "Dealer: " + dealerScore;
    document.getElementsByClassName("identity")[1].textContent = "You: " + yourScore;

    // Change Hit and Stay buttons to Next Round and Cash Out
    let h = document.getElementById("hit");
    let s = document.getElementById("stay");
    
    if (h && s) {
        h.removeEventListener("click", hit);
        s.removeEventListener("click", stay);
        
        document.getElementById("hit").id = "next-round"
        document.getElementById("stay").id = "cash-out"

        document.getElementById("next-round").textContent = "Next Round"
        document.getElementById("cash-out").textContent = "Cash Out"
    }

    let nextRound = document.getElementById("next-round");
    let cashOut = document.getElementById("cash-out");

    nextRound.addEventListener("click", resetGame);
    cashOut.addEventListener("click", function() {
        console.log(profit);
    });


}

function findValue(card) {
    if (isNaN(card[0])) {
        if (card[0] == 'A') {
            return 11;
        }
        return 10;
    }
    if (card[0] == '1') {
        return 10;
    }
    return Number(card[0]);
}

function resetGame() {
    deck = []; 
    canHit = true;
    state = "Blackjack"
    dealerScore = 0;
    yourScore = 0;
    dealerAceCount = 0;
    yourAceCount = 0;

    let nextRound = document.getElementById("next-round");
    nextRound.removeEventListener("click", resetGame);
    
    document.getElementById("hidden").src = "./cards/BACK.png";
    const resetCards = document.querySelectorAll('.revealed');
    resetCards.forEach(cards => {
        cards.remove();
    });

    document.getElementById("title").textContent = "Blackjack";
    document.getElementsByClassName("identity")[0].textContent = "Dealer";
    document.getElementsByClassName("identity")[1].textContent = "You"

    document.getElementById("next-round").id = "hit";
    document.getElementById("cash-out").id = "stay";

    document.getElementById("hit").textContent = "Hit"
    document.getElementById("stay").textContent = "Stay"
    
    buildDeck();
    shuffleDeck();
    startGame();
}

function changeTitle() {
    document.getElementById("title").addEventListener("mouseover", function() {
        this.innerHTML = "Home";
      });
    document.getElementById("title").addEventListener("mouseout", function() {
    this.innerHTML = state;
    });
}

// Change Bet Functions
// --------------------------------------------------------------------------------------------------------------------------


function betMoney() {
   document.querySelector("#bet-btn").addEventListener("click", function() {
    document.querySelector(".change-bet").style.display = "flex";
   });
}

function close() {
    document.querySelector(".close").addEventListener("click", function() {
     document.querySelector(".change-bet").style.display = "none";
     let money = document.getElementById("money-input");
     money.placeholder = "         $1 - $999,999,999";
    });
}

function updateCash() {
    let betButton = document.getElementById("bet-button");
    betButton.addEventListener("click", function() {
        let money = document.getElementById("money-input");
        bet = money.value;

        if (bet[0] == '0') {
            money.value = "";
            money.placeholder = "                 Try again";
        } else if (bet >= 1 && bet <= 999999999) {
            document.getElementById("bet-amount").textContent = "Bet: $" + bet;
            document.querySelector(".change-bet").style.display = "none";
            money.value = "";
            money.placeholder = "         $1 - $999,999,999";
        } else {
            money.value = "";
            money.placeholder = "                 Try again";
        }
    });
}

// Home 
// --------------------------------------------------------------------------------------------------------------------------

function depositMoney() {
    document.getElementsByClassName("button")[1].addEventListener("click", function() {
     document.querySelector(".deposit-money").style.display = "flex";
    });
 }
 
 function closeHome() {
     document.querySelector(".close").addEventListener("click", function() {
      document.querySelector(".deposit-money").style.display = "none";
      let money = document.getElementById("money-input");
      money.placeholder = "         $1 - $999,999,999"
     });
 }
 
 function updateCashHome() {
     let depositButton = document.getElementById("deposit-button");
     depositButton.addEventListener("click", function() {
         let money = document.getElementById("money-input");
         cash = money.value;
         localStorage.setItem("cash", money.value);
 
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

 function setCashHome() {
    document.getElementById("cash-home").textContent = "Cash: $" + cash +  "💰";
}


 if (window.location.pathname === '/home.html') {
    setCashHome();
    autoAdjustMargin();
    depositMoney();
    closeHome();
    updateCashHome();
} else if (window.location.pathname === '/index.html') {
    buildDeck();
    shuffleDeck();
    startGame();
    changeTitle();
    betMoney();
    close();
    updateCash();
}


