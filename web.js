const form = document.getElementById("transaction-form");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const list = document.getElementById("transaction-list");
const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const clearBtn = document.getElementById("clear-history");
const pieChartCanvas = document.getElementById("pieChart");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let pieChart;

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateSummary() {
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  balanceDisplay.textContent = income + expense;
  incomeDisplay.textContent = income;
  expenseDisplay.textContent = Math.abs(expense);

  updatePieChart(income, Math.abs(expense));
}


function renderTransactions() {
  list.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
  <div>
    <strong>${t.description}</strong>: ₹${t.amount}<br>
    <small>${t.timestamp}</small>
  </div>
  <button onclick="deleteTransaction(${index})">❌</button>
`;

    list.appendChild(li);
  });
  updateSummary();
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateLocalStorage();
  renderTransactions();
}

function updatePieChart(income, expense) {
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(pieChartCanvas, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#28a745", "#dc3545"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());

  if (!description || isNaN(amount)) return;

  const timestamp = new Date().toLocaleString();
  transactions.push({ description, amount, timestamp });

  updateLocalStorage();
  renderTransactions();
  descInput.value = "";
  amountInput.value = "";
});

clearBtn.addEventListener("click", () => {
  if (confirm("Clear all transaction history?")) {
    localStorage.removeItem("transactions");
    transactions = [];
    renderTransactions();
  }
});

renderTransactions();