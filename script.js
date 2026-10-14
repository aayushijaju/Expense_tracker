const STORAGE_KEY = "simpleExpenseTrackerExpenses";

const form = document.getElementById("expenseForm");
const nameInput = document.getElementById("expenseName");
const amountInput = document.getElementById("expenseAmount");
const categoryInput = document.getElementById("expenseCategory");
const dateInput = document.getElementById("expenseDate");
const categoryFilter = document.getElementById("categoryFilter");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const expenseCount = document.getElementById("expenseCount");
const emptyState = document.getElementById("emptyState");
const formMessage = document.getElementById("formMessage");
const clearAllButton = document.getElementById("clearAllButton");

let expenses = loadExpenses();

// Start with today's date selected.
dateInput.value = new Date().toISOString().slice(0, 10);

function loadExpenses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function renderExpenses() {
  const selectedCategory = categoryFilter.value;
  const visibleExpenses = selectedCategory === "All"
    ? expenses
    : expenses.filter(expense => expense.category === selectedCategory);

  expenseList.replaceChildren();

  visibleExpenses
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach(expense => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = expense.name;

      const categoryCell = document.createElement("td");
      const pill = document.createElement("span");
      pill.className = "category-pill";
      pill.textContent = expense.category;
      categoryCell.appendChild(pill);

      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(expense.date);

      const amountCell = document.createElement("td");
      amountCell.textContent = formatMoney(expense.amount);

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete ${expense.name}`);
      deleteButton.addEventListener("click", () => deleteExpense(expense.id));
      actionCell.appendChild(deleteButton);

      row.append(nameCell, categoryCell, dateCell, amountCell, actionCell);
      expenseList.appendChild(row);
    });

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalAmount.textContent = formatMoney(total);
  expenseCount.textContent = `${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"}`;
  emptyState.hidden = visibleExpenses.length > 0;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  if (!name || !Number.isFinite(amount) || amount <= 0 || !date) {
    formMessage.textContent = "Please enter a name, a positive amount, and a date.";
    return;
  }

  expenses.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    amount,
    category: categoryInput.value,
    date
  });

  saveExpenses();
  renderExpenses();
  form.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
  formMessage.textContent = "Expense added successfully!";
  nameInput.focus();
});

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  saveExpenses();
  renderExpenses();
}

categoryFilter.addEventListener("change", renderExpenses);

clearAllButton.addEventListener("click", () => {
  if (expenses.length === 0) return;
  if (confirm("Delete all expenses? This cannot be undone.")) {
    expenses = [];
    saveExpenses();
    renderExpenses();
    formMessage.textContent = "All expenses cleared.";
  }
});

renderExpenses();
