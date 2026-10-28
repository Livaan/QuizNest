// ==========================================
// QuizNest: Online Quiz Application
// HTML + CSS + JavaScript + localStorage
// ==========================================

console.log("QuizNest JavaScript is running!");

// Default quiz questions
const defaultQuestions = [
    {
        id: 1,
        question: "Which language is used to structure a web page?",
        options: ["Python", "HTML", "Java", "SQL"],
        answer: "HTML"
    },
    {
        id: 2,
        question: "Which CSS property changes text color?",
        options: ["font-style", "background", "color", "text-size"],
        answer: "color"
    },
    {
        id: 3,
        question: "Which language makes a web page interactive?",
        options: ["HTML", "CSS", "JavaScript", "SQL"],
        answer: "JavaScript"
    }
];

// Load saved questions or use default questions
let questions;

try {
    const savedQuestions = localStorage.getItem("quizNestQuestions");
    questions = savedQuestions
        ? JSON.parse(savedQuestions)
        : defaultQuestions;

    if (!Array.isArray(questions)) {
        questions = defaultQuestions;
    }
} catch (error) {
    console.error("Could not load saved questions:", error);
    questions = defaultQuestions;
}

// Quiz variables
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// Get HTML elements
const homePage = document.getElementById("homePage");
const quizPage = document.getElementById("quizPage");
const resultPage = document.getElementById("resultPage");
const adminPage = document.getElementById("adminPage");

const startQuizBtn = document.getElementById("startQuizBtn");
const adminBtn = document.getElementById("adminBtn");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");

const scoreText = document.getElementById("finalScore");
const resultMessage = document.getElementById("resultMessage");
const retryBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("questionInput");

const option1Input = document.getElementById("optionA");
const option2Input = document.getElementById("optionB");
const option3Input = document.getElementById("optionC");
const option4Input = document.getElementById("optionD");

const answerInput = document.getElementById("correctAnswer");
const questionList = document.getElementById("adminQuestionList");
const adminHomeBtn = document.getElementById("backHomeBtn");

// Check that important HTML elements exist
if (
    !homePage ||
    !quizPage ||
    !resultPage ||
    !adminPage ||
    !startQuizBtn ||
    !adminBtn
) {
    console.error(
        "QuizNest could not find one or more HTML elements. Check your HTML element IDs."
    );
} else {
    // Connect buttons to functions
    startQuizBtn.addEventListener("click", startQuiz);
    adminBtn.addEventListener("click", openAdmin);

    if (nextBtn) {
        nextBtn.addEventListener("click", nextQuestion);
    }

    if (retryBtn) {
        retryBtn.addEventListener("click", startQuiz);
    }

    if (homeBtn) {
        homeBtn.addEventListener("click", goHome);
    }

    if (adminHomeBtn) {
        adminHomeBtn.addEventListener("click", goHome);
    }

    if (questionForm) {
        questionForm.addEventListener("submit", addQuestion);
    }

    // Show the home page when the application opens
    showPage(homePage);
}

// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(page) {
    const pages = [homePage, quizPage, resultPage, adminPage];

    pages.forEach(function (item) {
        if (item) {
            item.classList.add("hidden");
        }
    });

    if (page) {
        page.classList.remove("hidden");
    }
}

function goHome() {
    showPage(homePage);
}

// ==========================================
// START QUIZ
// ==========================================

function startQuiz() {
    if (!Array.isArray(questions) || questions.length === 0) {
        alert("No quiz questions available. Please add questions first.");
        return;
    }

    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;

    showPage(quizPage);
    displayQuestion();
}

// ==========================================
// DISPLAY QUESTION
// ==========================================

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    questionNumber.textContent =
        "Question " +
        (currentQuestionIndex + 1) +
        " of " +
        questions.length;

    questionText.textContent = currentQuestion.question;

    optionsContainer.innerHTML = "";
    selectedAnswer = null;

    currentQuestion.options.forEach(function (option) {
        const optionButton = document.createElement("button");

        optionButton.type = "button";
        optionButton.className = "option-btn";
        optionButton.textContent = option;

        optionButton.addEventListener("click", function () {
            selectAnswer(option, optionButton);
        });

        optionsContainer.appendChild(optionButton);
    });

    nextBtn.disabled = true;
    nextBtn.textContent =
        currentQuestionIndex === questions.length - 1
            ? "Finish Quiz"
            : "Next Question";
}

// ==========================================
// SELECT ANSWER
// ==========================================

function selectAnswer(answer, clickedButton) {
    selectedAnswer = answer;

    const optionButtons =
        optionsContainer.querySelectorAll(".option-btn");

    optionButtons.forEach(function (button) {
        button.classList.remove("selected");
        button.disabled = true;
    });

    clickedButton.classList.add("selected");

    nextBtn.disabled = false;
}

// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {
    if (selectedAnswer === null) {
        alert("Please select an answer first.");
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.answer) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

// ==========================================
// SHOW QUIZ RESULTS
// ==========================================

function showResults() {
    showPage(resultPage);

    const percentage = Math.round(
        (score / questions.length) * 100
    );

    scoreText.textContent =
        "Your Score: " +
        score +
        " / " +
        questions.length;

    if (percentage === 100) {
        resultMessage.textContent =
            "Excellent! You answered every question correctly!";
    } else if (percentage >= 60) {
        resultMessage.textContent =
            "Good job! Keep practising to improve your score.";
    } else {
        resultMessage.textContent =
            "Keep learning! Try the quiz again to improve your score.";
    }
}

// ==========================================
// ADMIN PANEL
// ==========================================

function openAdmin() {
    showPage(adminPage);
    renderQuestionList();
}

// ==========================================
// SAVE QUESTIONS
// ==========================================

function saveQuestions() {
    try {
        localStorage.setItem(
            "quizNestQuestions",
            JSON.stringify(questions)
        );
    } catch (error) {
        console.error("Could not save questions:", error);
        alert("Your questions could not be saved in this browser.");
    }
}

// ==========================================
// ADD NEW QUESTION
// ==========================================

function addQuestion(event) {
    event.preventDefault();

    const question = questionInput.value.trim();

    const options = [
        option1Input.value.trim(),
        option2Input.value.trim(),
        option3Input.value.trim(),
        option4Input.value.trim()
    ];

    const answerIndex = Number(answerInput.value);
    const answer = options[answerIndex];

    // Validate question
    if (!question) {
        alert("Please enter a question.");
        return;
    }

    // Validate options
    if (options.some(function (option) {
        return option === "";
    })) {
        alert("Please fill in all four options.");
        return;
    }

    // Prevent duplicate options
    if (new Set(options).size !== options.length) {
        alert("Please enter four different options.");
        return;
    }

    // Validate correct answer
    if (!options.includes(answer)) {
        alert("The correct answer must match one of the options exactly.");
        return;
    }

    // Create new question
    const newQuestion = {
        id: Date.now(),
        question: question,
        options: options,
        answer: answer
    };

    questions.push(newQuestion);

    saveQuestions();

    questionForm.reset();
    renderQuestionList();

    alert("Question added successfully!");
}

// ==========================================
// DISPLAY QUESTIONS IN ADMIN PANEL
// ==========================================

function renderQuestionList() {
    if (!questionList) {
        return;
    }

    questionList.innerHTML = "";

    if (questions.length === 0) {
        questionList.textContent = "No questions added yet.";
        return;
    }

    questions.forEach(function (question) {
        const questionCard = document.createElement("div");
        questionCard.className = "question-card";

        const questionTitle = document.createElement("h3");
        questionTitle.textContent = question.question;

        const optionsText = document.createElement("p");
        optionsText.textContent =
            "Options: " + question.options.join(", ");

        const answerText = document.createElement("p");
        answerText.textContent =
            "Correct Answer: " + question.answer;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function () {
            editQuestion(question.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteQuestion(question.id);
        });

        questionCard.appendChild(questionTitle);
        questionCard.appendChild(optionsText);
        questionCard.appendChild(answerText);
        questionCard.appendChild(editButton);
        questionCard.appendChild(deleteButton);

        questionList.appendChild(questionCard);
    });
}

// ==========================================
// EDIT QUESTION
// ==========================================

function editQuestion(id) {
    const questionToEdit = questions.find(function (question) {
        return question.id === id;
    });

    if (!questionToEdit) {
        alert("Question not found.");
        return;
    }

    const updatedQuestion = prompt(
        "Edit question:",
        questionToEdit.question
    );

    if (updatedQuestion === null) {
        return;
    }

    if (updatedQuestion.trim() === "") {
        alert("The question cannot be empty.");
        return;
    }

    const updatedOptions = [];

    for (let i = 0; i < 4; i++) {
        const updatedOption = prompt(
            "Edit option " + (i + 1) + ":",
            questionToEdit.options[i]
        );

        if (updatedOption === null) {
            return;
        }

        if (updatedOption.trim() === "") {
            alert("Options cannot be empty.");
            return;
        }

        updatedOptions.push(updatedOption.trim());
    }

    if (new Set(updatedOptions).size !== updatedOptions.length) {
        alert("All four options must be different.");
        return;
    }

    const updatedAnswer = prompt(
        "Enter the correct answer:",
        questionToEdit.answer
    );

    if (updatedAnswer === null) {
        return;
    }

    if (!updatedOptions.includes(updatedAnswer.trim())) {
        alert("The correct answer must match one of the updated options.");
        return;
    }

    questionToEdit.question = updatedQuestion.trim();
    questionToEdit.options = updatedOptions;
    questionToEdit.answer = updatedAnswer.trim();

    saveQuestions();
    renderQuestionList();

    alert("Question updated successfully!");
}

// ==========================================
// DELETE QUESTION
// ==========================================

function deleteQuestion(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this question?"
    );

    if (!confirmed) {
        return;
    }

    questions = questions.filter(function (question) {
        return question.id !== id;
    });

    saveQuestions();
    renderQuestionList();

    alert("Question deleted successfully!");
}