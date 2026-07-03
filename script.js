const goalInput = document.getElementById("goalInput");
const currentInput = document.getElementById("currentInput");
const monthlyInput = document.getElementById("monthlyInput");
const targetDateInput = document.getElementById("targetDateInput");

const calculateBtn = document.getElementById("calculateBtn");
const progressBar = document.getElementById("progressBar");
const percentText = document.getElementById("percentText");
const deadlineStatusBadge =
  document.getElementById("deadlineStatusBadge");
const resultText = document.getElementById("resultText");

const skillGoalInput = document.getElementById("skillGoalInput");
const skillCurrentInput = document.getElementById("skillCurrentInput");
const skillCalculateBtn = document.getElementById("skillCalculateBtn");
const skillProgressBar = document.getElementById("skillProgressBar");
const skillPercentText = document.getElementById("skillPercentText");
const skillResultText = document.getElementById("skillResultText");

const resetBtn = document.getElementById("resetBtn");


function formatMoney(value) {
  return Math.round(value).toLocaleString("en-US");
}


function calculateProgress() {
  const goal = Number(goalInput.value);
  const current = Number(currentInput.value);
  const monthly = Number(monthlyInput.value);
  const targetDate = targetDateInput.value;

  if (goal <= 0 || current < 0 || monthly < 0) {
    resultText.textContent =
      "Введите корректные значения. Цель должна быть больше нуля.";
    return;
  }

  let percent = (current / goal) * 100;
  percent = Math.min(percent, 100);

  const left = Math.max(0, goal - current);

  progressBar.style.width = percent + "%";
  percentText.textContent = percent.toFixed(2) + "%";

  let message = "";

  if (left === 0) {
    message =
      "Финансовая цель достигнута. Можно ставить новую планку.";
  } else if (monthly > 0) {
    const months = Math.ceil(left / monthly);

    message =
      `До цели осталось $${formatMoney(left)}. ` +
      `При текущем темпе цель будет достигнута примерно за ${months} мес.`;
  } else {
    message =
      `До цели осталось $${formatMoney(left)}. ` +
      `Укажите ежемесячный вклад для расчёта срока.`;
  }


  // Расчёт по выбранному дедлайну
  if (targetDate && left > 0) {
    const today = new Date();
    const deadline = new Date(targetDate + "T00:00:00");

    today.setHours(0, 0, 0, 0);

    if (deadline > today) {
      const difference = deadline - today;

      const daysLeft = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

      const monthsLeft = Math.max(
        1,
        Math.ceil(daysLeft / 30.44)
      );

      const requiredMonthly = Math.ceil(
        left / monthsLeft
      );

      const monthlyDifference = monthly - requiredMonthly;

      let deadlineStatus = "";

      if (monthly <= 0) {
        deadlineStatus =
          " Укажи текущий ежемесячный вклад, чтобы сравнить его с необходимым темпом.";

        deadlineStatusBadge.textContent =
          "Укажи ежемесячный вклад";

        deadlineStatusBadge.className =
          "status-badge status-neutral";

      } else if (monthlyDifference > 0) {
        deadlineStatus =
          ` Ты идёшь быстрее необходимого темпа на $${formatMoney(monthlyDifference)} в месяц.`;

        deadlineStatusBadge.textContent =
          "Опережаешь план";

        deadlineStatusBadge.className =
          "status-badge status-success";

      } else if (monthlyDifference === 0) {
        deadlineStatus =
          " Текущий ежемесячный вклад точно соответствует необходимому темпу.";

        deadlineStatusBadge.textContent =
          "Идёшь точно по плану";

        deadlineStatusBadge.className =
          "status-badge status-warning";

      } else {
        deadlineStatus =
          ` Чтобы не отставать от плана, увеличь ежемесячный вклад примерно на $${formatMoney(Math.abs(monthlyDifference))}.`;

        deadlineStatusBadge.textContent =
          "Отстаёшь от плана";

        deadlineStatusBadge.className =
          "status-badge status-danger";
      }

      message +=
        ` Чтобы успеть к выбранной дате, нужно откладывать примерно ` +
        `$${formatMoney(requiredMonthly)} в месяц.`;

      message += deadlineStatus;

    } else {
      message +=
        " Выберите будущую дату достижения цели.";
    }
  }

  resultText.textContent = message;


  // Сохраняем финансовые данные
  localStorage.setItem("moneyGoal", goal);
  localStorage.setItem("moneyCurrent", current);
  localStorage.setItem("moneyMonthly", monthly);
  localStorage.setItem("moneyTargetDate", targetDate);
}


function calculateSkillProgress() {
  const goal = Number(skillGoalInput.value);
  const current = Number(skillCurrentInput.value);

  if (goal <= 0 || current < 0) {
    skillResultText.textContent =
      "Введите корректные значения. Цель должна быть больше нуля.";
    return;
  }

  let percent = (current / goal) * 100;
  percent = Math.min(percent, 100);

  const left = Math.max(0, goal - current);

  skillProgressBar.style.width = percent + "%";
  skillPercentText.textContent = percent.toFixed(2) + "%";

  if (left === 0) {
    skillResultText.textContent =
      "Цель обучения достигнута. Можно ставить новую планку.";
  } else {
    skillResultText.textContent =
      `До цели обучения осталось ${left} часов.`;
  }


  // Сохраняем данные обучения
  localStorage.setItem("skillGoal", goal);
  localStorage.setItem("skillCurrent", current);
}


function autoCalculateMoney() {
  if (
    goalInput.value !== "" &&
    currentInput.value !== ""
  ) {
    calculateProgress();
  }
}


function autoCalculateSkill() {
  if (
    skillGoalInput.value !== "" &&
    skillCurrentInput.value !== ""
  ) {
    calculateSkillProgress();
  }
}


function loadSavedData() {
  const savedGoal = localStorage.getItem("moneyGoal");
  const savedCurrent = localStorage.getItem("moneyCurrent");
  const savedMonthly = localStorage.getItem("moneyMonthly");
  const savedTargetDate = localStorage.getItem("moneyTargetDate");

  if (savedGoal !== null) {
    goalInput.value = savedGoal;
  }

  if (savedCurrent !== null) {
    currentInput.value = savedCurrent;
  }

  if (savedMonthly !== null) {
    monthlyInput.value = savedMonthly;
  }

  if (savedTargetDate) {
    targetDateInput.value = savedTargetDate;
  }

  if (
    savedGoal !== null &&
    savedCurrent !== null
  ) {
    calculateProgress();
  }


  const savedSkillGoal = localStorage.getItem("skillGoal");
  const savedSkillCurrent = localStorage.getItem("skillCurrent");

  if (savedSkillGoal !== null) {
    skillGoalInput.value = savedSkillGoal;
  }

  if (savedSkillCurrent !== null) {
    skillCurrentInput.value = savedSkillCurrent;
  }

  if (
    savedSkillGoal !== null &&
    savedSkillCurrent !== null
  ) {
    calculateSkillProgress();
  }
}


function resetData() {
  localStorage.removeItem("moneyGoal");
  localStorage.removeItem("moneyCurrent");
  localStorage.removeItem("moneyMonthly");
  localStorage.removeItem("moneyTargetDate");

  localStorage.removeItem("skillGoal");
  localStorage.removeItem("skillCurrent");


  goalInput.value = "";
  currentInput.value = "";
  monthlyInput.value = "";
  targetDateInput.value = "";

  skillGoalInput.value = "";
  skillCurrentInput.value = "";


  progressBar.style.width = "0%";
  skillProgressBar.style.width = "0%";


  percentText.textContent = "0%";
  skillPercentText.textContent = "0%";


  resultText.textContent =
    "Заполни поля для расчёта финансового прогресса.";

  skillResultText.textContent =
    "Заполни цель обучения и текущее количество часов.";
}


// Кнопки
calculateBtn.addEventListener(
  "click",
  calculateProgress
);

skillCalculateBtn.addEventListener(
  "click",
  calculateSkillProgress
);

resetBtn.addEventListener(
  "click",
  resetData
);


// Автоматический пересчёт финансов
goalInput.addEventListener(
  "input",
  autoCalculateMoney
);

currentInput.addEventListener(
  "input",
  autoCalculateMoney
);

monthlyInput.addEventListener(
  "input",
  autoCalculateMoney
);

targetDateInput.addEventListener(
  "input",
  autoCalculateMoney
);


// Автоматический пересчёт обучения
skillGoalInput.addEventListener(
  "input",
  autoCalculateSkill
);

skillCurrentInput.addEventListener(
  "input",
  autoCalculateSkill
);


// Загружаем сохранённые данные
loadSavedData();