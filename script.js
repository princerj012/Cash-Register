let price = 19.5;
let cid = [
  ['PENNY', 0.5],
  ['NICKEL', 0],
  ['DIME', 0],
  ['QUARTER', 0],
  ['ONE', 0],
  ['FIVE', 0],
  ['TEN', 0],
  ['TWENTY', 0],
  ['ONE HUNDRED', 0],
];

const priceScreen = document.getElementById("price-screen");
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const cashDrawerDisplay = document.getElementById("cash-drawer-display");
const changeDue = document.getElementById("change-due");

const formatResults = (status, change) => {
  changeDue.innerHTML = `<p>Status: ${status}</p>`;
  change.map(
    money => (changeDue.innerHTML += `<p>${money[0]}: $${money[1]}</p>`)
  );
  return;
};

cid.forEach(array => cashDrawerDisplay.innerHTML += `<p>${array[0].slice(0, 1) + array[0].slice(1).toLowerCase()}: $${array[1]}</p>`);

const updateUI = (change) => {
  priceScreen.textContent = `Total: $${price}`
  cashDrawerDisplay.innerHTML = "";
  cashDrawerDisplay.innerHTML += `<p><strong>Change in drawer</strong></p>`

  change.map(
    money => (cashDrawerDisplay.innerHTML += `<p>${money[0]}: $${money[1]}</p>`)
  );

  console.log(change)
}

const noChange = () => {
  if (cashInput.value == price) {
    changeDue.innerHTML = "";
    changeDue.innerHTML += "No change due - customer paid with exact cash";
    return false;
  } else if (cashInput.value <= price) {
    alert("Customer does not have enough money to purchase the item");
    return false;
  } else {
    return true;
  }
}

const checkCashRegister = () => {
  const hasChange = noChange();

  if (!hasChange) return;

  let drawerCash = [
    ['Hundreds', cid[8][1]],
    ['Twenties', cid[7][1]],
    ['Tens', cid[6][1]],
    ['Fives', cid[5][1]],
    ['Ones', cid[4][1]],
    ['Quarters', cid[3][1]],
    ['Dimes', cid[2][1]],
    ['Nickels', cid[1][1]],
    ['Pennies', cid[0][1]],
  ]

  let changeDue = Number(cashInput.value) - price;
  let reversedCid = [...cid].reverse();
  let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  let result = { status: 'OPEN', change: [] };

  for (let i = 0; i < reversedCid.length; i++) {
    let currencyName = reversedCid[i][0];
    let currencyTotal = reversedCid[i][1];
    let currencyValue = denominations[i];
    let currencyAmount = (currencyTotal / currencyValue).toFixed(2);

    if (changeDue >= currencyValue) {
      let amountNeeded = Math.floor(changeDue / currencyValue);
      let amountToGive = Math.min(amountNeeded, currencyAmount);
      let amountGiven = (amountToGive * currencyValue).toFixed(2);

      if (amountGiven > 0) {
        result.change.push([currencyName, parseFloat(amountGiven)]);
        drawerCash[i][1] -= parseFloat(amountGiven);
        changeDue -= amountGiven;
        changeDue = parseFloat(changeDue.toFixed(2));
      }
    }
  }

  if (changeDue > 0) {
    result.status = "INSUFFICIENT_FUNDS";
    result.change = [];
  } else if (changeDue == 0 && drawerCash.reduce((sum, currency) => sum + currency[1], 0) == 0) {
    result.status = "CLOSED";
  }

  formatResults(result.status, result.change);
  updateUI(drawerCash.reverse());
};

const checkResults = () => {
  if (!cash.value) {
    return;
  }
  checkCashRegister();
};

purchaseBtn.addEventListener("click", () => {
  checkResults();
})

const update = () => {
  priceScreen.textContent = `Total: $${price}`
  cashDrawerDisplay.innerHTML = "";
  cashDrawerDisplay.innerHTML += `<p><strong>Change in drawer</strong></p>`
  cid.forEach(array => {
    cashDrawerDisplay.innerHTML += `<p>${array[0].slice(0, 1) + array[0].slice(1).toLowerCase()}: $${array[1]}</p>`
  })
}

update();
