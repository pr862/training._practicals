import { onAuthChange } from '../auth/auth.js';
import { collection, doc, addDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { setLoadingState, navigateTo, setupAuthHandler, showToastError, showToastSuccess } from '../utils/ui-helpers.js';
const quizTitleInput = document.getElementById('quizTitle');
const quizCategorySelect = document.getElementById('quizCategory');
const quizDescriptionInput = document.getElementById('quizDescription');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const saveQuizBtn = document.getElementById('saveQuizBtn');
const questionsContainer = document.getElementById('questionsContainer');
const noQuestionsMessage = document.getElementById('noQuestionsMessage');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const questionTemplate = document.getElementById('questionTemplate');
const pageContent = document.getElementById('pageContent');
let questionCount = 0;
let currentUser = null;
const handleUserAuth = async (user) => {
    if (user) {
        currentUser = user;
        setLoadingState(pageContent, false);
        addQuestion();
    }
    else {
        navigateTo('login.html');
    }
};
setLoadingState(pageContent, true);
setupAuthHandler(handleUserAuth, onAuthChange);
addQuestionBtn.addEventListener('click', () => {
    addQuestion();
});
function addQuestion() {
    questionCount++;
    noQuestionsMessage.classList.add('hidden');
    const fragment = questionTemplate.content.cloneNode(true);
    const questionItem = fragment.querySelector('.question-item');
    const questionNumber = questionItem.querySelector('.question-number');
    questionNumber.textContent = `Question ${questionCount}`;
    const deleteBtn = questionItem.querySelector('.delete-question');
    deleteBtn.addEventListener('click', () => {
        questionItem.remove();
        questionCount--;
        updateQuestionNumbers();
        if (questionCount === 0) {
            noQuestionsMessage.classList.remove('hidden');
        }
    });
    questionsContainer.appendChild(fragment);
}
function updateQuestionNumbers() {
    const questions = questionsContainer.querySelectorAll('.question-item');
    questions.forEach((question, index) => {
        const questionNumber = question.querySelector('.question-number');
        questionNumber.textContent = `Question ${index + 1}`;
    });
}
saveQuizBtn.addEventListener('click', async () => {
    await saveQuiz();
});
async function saveQuiz() {
    const title = quizTitleInput.value.trim();
    const category = quizCategorySelect.value;
    const description = quizDescriptionInput.value.trim();
    if (!title) {
        showToastError(errorMessage, 'Please enter a quiz title');
        return;
    }
    if (title.length < 3) {
        showToastError(errorMessage, 'Quiz title must be at least 3 characters long');
        return;
    }
    if (!category) {
        showToastError(errorMessage, 'Please select a category');
        return;
    }
    const questionsData = [];
    const questionItems = questionsContainer.querySelectorAll('.question-item');
    if (questionItems.length === 0) {
        showToastError(errorMessage, 'Please add at least one question to your quiz');
        return;
    }
    for (let i = 0; i < questionItems.length; i++) {
        const item = questionItems[i];
        const questionText = item.querySelector('.question-text').value.trim();
        const optionA = item.querySelector('.option-a').value.trim();
        const optionB = item.querySelector('.option-b').value.trim();
        const optionC = item.querySelector('.option-c').value.trim();
        const optionD = item.querySelector('.option-d').value.trim();
        const correctAnswer = item.querySelector('.correct-answer').value;
        if (!questionText) {
            showToastError(errorMessage, `Please enter the text for question ${i + 1}`);
            return;
        }
        if (!optionA) {
            showToastError(errorMessage, `Please enter option A for question ${i + 1}`);
            return;
        }
        if (!optionB) {
            showToastError(errorMessage, `Please enter option B for question ${i + 1}`);
            return;
        }
        if (!optionC) {
            showToastError(errorMessage, `Please enter option C for question ${i + 1}`);
            return;
        }
        if (!optionD) {
            showToastError(errorMessage, `Please enter option D for question ${i + 1}`);
            return;
        }
        const options = [optionA, optionB, optionC, optionD];
        const uniqueOptions = new Set(options);
        if (uniqueOptions.size !== options.length) {
            showToastError(errorMessage, `Question ${i + 1} has duplicate options. All options must be unique.`);
            return;
        }
        questionsData.push({
            question: questionText,
            options: {
                A: optionA,
                B: optionB,
                C: optionC,
                D: optionD
            },
            correctAnswer: correctAnswer
        });
    }
    try {
        const quizDocRef = await addDoc(collection(db, 'quizzes'), {
            title: title,
            description: description,
            category: category,
            createdBy: currentUser.displayName || currentUser.email,
            createdAt: Timestamp.now(),
            questionCount: questionsData.length
        });
        const quizId = quizDocRef.id;
        for (let i = 0; i < questionsData.length; i++) {
            const questionId = `q${i + 1}`;
            await setDoc(doc(db, 'quizzes', quizId, 'questions', questionId), {
                question: questionsData[i].question,
                options: questionsData[i].options,
                correctAnswer: questionsData[i].correctAnswer
            });
        }
        showToastSuccess(successMessage, 'Quiz saved successfully!');
        setTimeout(() => {
            navigateTo('dashboard.html');
        }, 2000);
    }
    catch (error) {
        showToastError(errorMessage, 'Failed to save quiz. Please try again.');
    }
}
