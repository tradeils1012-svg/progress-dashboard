const goalInput = document.getElementById("goalInput");
const monthlyInput = document.getElementById("monthlyInput");
const currentInput = document.getElementById("currentInput");
const calculateBtn = document.getElementById("calculateBtn");
const progressBar = document.getElementById("progressBar");
const percentText = document.getElementById("percentText");
const resultText = document.getElementById("resultText");
const resetBtn = document.getElementById("resetBtn");

const skillGoalInput = document.getElementById("skillGoalInput");
const skillCurrentInput = document.getElementById("skillCurrentInput");
const skillCalculateBtn = document.getElementById("skillCalculateBtn");
const skillProgressBar = document.getElementById("skillProgressBar");
const skillPercentText = document.getElementById("skillPercentText");
const skillResultText = document.getElementById("skillResultText");

function formatMoney(value) {
  return value.toLocaleString("en-US");
}

function calculateProgress() {
  const goal = Number(goalInput.value);
  const current = Number(currentInput.value);
  const monthly = Number(monthlyInput.value);

  if (goal <= 0 || current < 0 || monthly < 0) {
    resultText.textContent = "Введите корректные числа. Цель должна быть больше нуля.";
    return;
  }

  let percent = (current / goal) * 100;

  if (percent > 100) {
    percent = 100;
  }

  const left = goal - current;

  progressBar.style.width = percent + "%";
  percentText.textContent = percent.toFixed(2) + "%";

  if (left <= 0) {
    resultText.textContent = "Финансовая цель достигнута. Можно ставить новую планку.";
  } else if (monthly > 0) {
    const months = Math.ceil(left / monthly);
    resultText.textContent = `До цели осталось $${formatMoney(left)}. При темпе $${formatMoney(monthly)} в месяц цель будет достигнута примерно за ${months} мес.`;
  } else {
    resultText.textContent = `До цели осталось $${formatMoney(left)}. Укажите ежемесячное пополнение, чтобы рассчитать срок.`;
  }

  localStorage.setItem("moneyGoal", goal);
  localStorage.setItem("moneyCurrent", current);
  localStorage.setItem("moneyMonthly", monthly);
}

function calculateSkillProgress() {
  const goal = Number(skillGoalInput.value);
  const current = Number(skillCurrentInput.value);

  if (goal <= 0 || current < 0) {
    skillResultText.textContent = "Введите корректные числа. Цель должна быть больше нуля.";
    return;
  }

  let percent = (current / goal) * 100;

  if (percent > 100) {
    percent = 100;
  }

  const left = goal - current;

  skillProgressBar.style.width = percent + "%";
  skillPercentText.textContent = percent.toFixed(2) + "%";

  if (left <= 0) {
    skillResultText.textContent = "Цель обучения выполнена. Можно ставить новую планку.";
  } else {
    skillResultText.textContent = `До цели обучения осталось ${left} часов. Каждый час усиливает твой навык.`;
  }

  localStorage.setItem("skillGoal", goal);
  localStorage.setItem("skillCurrent", current);
}

function autoCalculateMoney() {
  if (goalInput.value !== "" && currentInput.value !== "") {
    calculateProgress();
  }
}

function autoCalculateSkill() {
  if (skillGoalInput.value !== "" && skillCurrentInput.value !== "") {
    calculateSkillProgress();
  }
}

function loadSavedData() {
  const savedGoal = localStorage.getItem("moneyGoal");
  const savedCurrent = localStorage.getItem("moneyCurrent");
  const savedMonthly = localStorage.getItem("moneyMonthly");

  if (savedGoal) {
    goalInput.value = savedGoal;
  }

  if (savedCurrent) {
    currentInput.value = savedCurrent;
  }

  if (savedMonthly) {
    monthlyInput.value = savedMonthly;
  }

  if (savedGoal && savedCurrent) {
    calculateProgress();
  }

  const savedSkillGoal = localStorage.getItem("skillGoal");
  const savedSkillCurrent = localStorage.getItem("skillCurrent");

  if (savedSkillGoal) {
    skillGoalInput.value = savedSkillGoal;
  }

  if (savedSkillCurrent) {
    skillCurrentInput.value = savedSkillCurrent;
  }

  if (savedSkillGoal && savedSkillCurrent) {
    calculateSkillProgress();
  }
}

function resetData() {
  localStorage.removeItem("moneyGoal");
  localStorage.removeItem("moneyCurrent");
  localStorage.removeItem("moneyMonthly");
  localStorage.removeItem("skillGoal");
  localStorage.removeItem("skillCurrent");

  goalInput.value = "";
  currentInput.value = "";
  monthlyInput.value = "";
  skillGoalInput.value = "";
  skillCurrentInput.value = "";

  progressBar.style.width = "0%";
  skillProgressBar.style.width = "0%";

  percentText.textContent = "0%";
  skillPercentText.textContent = "0%";

  resultText.textContent = "Данные сброшены. Введите новую финансовую цель.";
  skillResultText.textContent = "Прогресс обучения сброшен. Введите новую цель.";
}

calculateBtn.addEventListener("click", calculateProgress);
skillCalculateBtn.addEventListener("click", calculateSkillProgress);
resetBtn.addEventListener("click", resetData);

goalInput.addEventListener("input", autoCalculateMoney);
currentInput.addEventListener("input", autoCalculateMoney);
monthlyInput.addEventListener("input", autoCalculateMoney);

skillGoalInput.addEventListener("input", autoCalculateSkill);
skillCurrentInput.addEventListener("input", autoCalculateSkill);

loadSavedData();