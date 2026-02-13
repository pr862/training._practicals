import { onAuthChange, logoutUser, getUserProfile } from '../auth/auth.js';
import { collection, getDocs, doc, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { handleLogout, navigateTo, showToastError } from '../utils/ui-helpers.js';
const logoutBtn = document.getElementById('logoutBtn');
const userDisplayName = document.getElementById('userDisplayName');
const categoryButtons = document.querySelectorAll('.category-btn');
const quizList = document.getElementById('quizList');
const noQuizzesMessage = document.getElementById('noQuizzesMessage');
const loadingMessage = document.getElementById('loadingMessage');
const quizModal = document.getElementById('quizModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalQuizTitle = document.getElementById('modalQuizTitle');
const modalQuizDescription = document.getElementById('modalQuizDescription');
const quizQuestions = document.getElementById('quizQuestions');
const quizResults = document.getElementById('quizResults');
const scoreText = document.getElementById('scoreText');
const progressContainer = document.getElementById('progressContainer');
const answeredCountEl = document.getElementById('answeredCount');
const currentScoreEl = document.getElementById('currentScoreDisplay');
const errorMessage = document.getElementById('errorMessage');
const suggestionContainer = document.getElementById('suggestionContainer');
let currentUser = null;
let allQuizzes = [];
let filteredQuizzes = [];
let selectedQuiz = null;
let questionsArray = [];
let userAnswers = {};
let selectedCategory = '';
function normalizeAnswer(answer) {
    return String(answer).trim().toUpperCase();
}
onAuthChange(async (user) => {
    if (!user) {
        navigateTo('login.html');
        return;
    }
    currentUser = user;
    const profile = await getUserProfile(user.uid);
    userDisplayName.textContent =
        `Welcome, ${profile?.displayName || user.email?.split('@')[0]}!`;
    loadQuizzes();
});
logoutBtn.onclick = async () => {
    await handleLogout(logoutUser);
};
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedCategory = btn.dataset.category || '';
        categoryButtons.forEach(b => {
            b.className =
                'category-btn px-4 py-2 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-300';
        });
        btn.className =
            'category-btn px-4 py-2 rounded-lg font-medium transition bg-gradient-to-r from-blue-600 to-green-500 text-white';
        filterQuizzes();
    });
});
function filterQuizzes() {
    if (!selectedCategory) {
        filteredQuizzes = [...allQuizzes];
    }
    else {
        filteredQuizzes = allQuizzes.filter(quiz => quiz.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    renderQuizList();
}
async function loadQuizzes() {
    loadingMessage.classList.remove('hidden');
    quizList.classList.add('hidden');
    noQuizzesMessage.classList.add('hidden');
    try {
        const snapshot = await getDocs(collection(db, 'quizzes'));
        const quizzes = [];
        snapshot.forEach(docSnap => {
            quizzes.push({ id: docSnap.id, ...docSnap.data() });
        });
        loadingMessage.classList.add('hidden');
        if (quizzes.length === 0) {
            noQuizzesMessage.classList.remove('hidden');
            return;
        }
        allQuizzes = quizzes;
        filteredQuizzes = quizzes;
        renderQuizList();
    }
    catch (error) {
        loadingMessage.classList.add('hidden');
        showToastError(errorMessage, 'Failed to load quizzes.');
    }
}
async function fetchQuizWithQuestions(quizId) {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (!quizDoc.exists())
        throw new Error('Quiz not found');
    const quizData = quizDoc.data();
    const questionsSnapshot = await getDocs(collection(db, 'quizzes', quizId, 'questions'));
    const questions = [];
    questionsSnapshot.forEach(docSnap => {
        const q = docSnap.data();
        questions.push({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
        });
    });
    return {
        id: quizDoc.id,
        ...quizData,
        questions
    };
}
function renderQuizList() {
    quizList.innerHTML = '';
    if (filteredQuizzes.length === 0) {
        noQuizzesMessage.classList.remove('hidden');
        quizList.classList.add('hidden');
        return;
    }
    quizList.classList.remove('hidden');
    noQuizzesMessage.classList.add('hidden');
    filteredQuizzes.forEach(quiz => {
        const card = document.createElement('div');
        card.className =
            'bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between';
        card.innerHTML = `
      <div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">${quiz.title}</h2>
        <p class="text-gray-500 mb-4">${quiz.description || 'No description available.'}</p>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-xs font-medium px-3 py-1 bg-blue-100 text-gray-600 rounded-lg">${quiz.category || 'General'}</span>
        <button class="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-lg  transition-colors duration-300">
          Play
        </button>
      </div>
    `;
        card.querySelector('button')?.addEventListener('click', () => openQuiz(quiz));
        quizList.appendChild(card);
    });
}
async function openQuiz(quiz) {
    selectedQuiz = quiz;
    userAnswers = {};
    modalQuizTitle.textContent = quiz.title;
    modalQuizDescription.textContent = quiz.description || '';
    quizQuestions.innerHTML = `
    <div class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading questions...</p>
    </div>
  `;
    quizResults.classList.add('hidden');
    progressContainer.classList.add('hidden');
    suggestionContainer.classList.add('hidden');
    quizModal.classList.remove('hidden');
    try {
        const fullQuiz = await fetchQuizWithQuestions(quiz.id);
        questionsArray = fullQuiz.questions.map((q) => {
            const raw = normalizeAnswer(q.correctAnswer);
            const map = { '0': 'A', '1': 'B', '2': 'C', '3': 'D' };
            const correctKey = map[raw] || raw;
            return {
                question: q.question,
                options: q.options,
                correctKey
            };
        });
        progressContainer.classList.remove('hidden');
        renderQuestions();
        updateProgress();
    }
    catch {
        quizQuestions.innerHTML =
            `<p class="text-red-600 text-center">Failed to load questions.</p>`;
    }
}
function renderQuestions() {
    quizQuestions.innerHTML = '';
    questionsArray.forEach((q, index) => {
        const sortedOptions = Object.entries(q.options)
            .sort(([a], [b]) => a.localeCompare(b));
        const div = document.createElement('div');
        div.className = 'bg-gray-50 p-4 rounded-lg mb-4';
        div.innerHTML = `
      <h4 class="font-semibold mb-3">${index + 1}. ${q.question}</h4>
      <div id="options-${index}" class="space-y-2">
        ${sortedOptions.map(([key, val]) => `
          <label class="flex items-center p-3 rounded cursor-pointer hover:bg-gray-100 border border-gray-200 transition">
            <span class="font-bold text-blue-600 mr-3">${key})</span>
            <input type="radio" name="q${index}" value="${key}" class="mr-3">
            <span>${val}</span>
          </label>
        `).join('')}
      </div>
      <div id="feedback-${index}" class="hidden mt-3"></div>
    `;
        quizQuestions.appendChild(div);
        div.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', e => {
                answerQuestion(index, e.target.value);
            });
        });
    });
}
function answerQuestion(index, answerKey) {
    if (userAnswers[index])
        return;
    userAnswers[index] = answerKey;
    showFeedback(index);
    updateProgress();
    if (Object.keys(userAnswers).length === questionsArray.length) {
        finishQuiz();
    }
}
function showFeedback(index) {
    const q = questionsArray[index];
    const options = document.getElementById(`options-${index}`);
    const feedback = document.getElementById(`feedback-${index}`);
    options.querySelectorAll('input').forEach(i => i.disabled = true);
    options.querySelectorAll('label').forEach(label => {
        const key = label.querySelector('input').value;
        if (key === q.correctKey) {
            label.classList.add('bg-green-100');
        }
        else if (key === userAnswers[index]) {
            label.classList.add('bg-red-100');
        }
        else {
            label.classList.add('opacity-50');
        }
    });
    const isCorrect = userAnswers[index] === q.correctKey;
    feedback.className = isCorrect
        ? 'mt-3 p-3 bg-green-100 text-green-700 rounded-lg'
        : 'mt-3 p-3 bg-red-100 text-red-700 rounded-lg';
    feedback.textContent = isCorrect
        ? `Correct!`
        : `Wrong! Correct answer: ${q.correctKey}`;
    feedback.classList.remove('hidden');
}
function updateProgress() {
    const answered = Object.keys(userAnswers).length;
    let score = 0;
    questionsArray.forEach((q, i) => {
        if (userAnswers[i] === q.correctKey)
            score++;
    });
    answeredCountEl.textContent = `${answered}/${questionsArray.length}`;
    currentScoreEl.textContent = `${score}`;
}
async function saveQuizResult(quizId, quizTitle, score, percentage) {
    try {
        await addDoc(collection(db, 'scores', currentUser.email, 'results'), {
            quizId,
            quizTitle,
            playedBy: currentUser.displayName || currentUser.email,
            score,
            percentage,
            playedAt: Timestamp.now()
        });
        console.log('Quiz result saved successfully');
    }
    catch (error) {
        console.error('Error saving quiz result:', error);
    }
}
async function finishQuiz() {
    let score = 0;
    questionsArray.forEach((q, i) => {
        if (userAnswers[i] === q.correctKey)
            score++;
    });
    const percent = Math.round((score / questionsArray.length) * 100);
    scoreText.textContent =
        `You scored ${score}/${questionsArray.length} (${percent}%)`;
    quizResults.classList.remove('hidden');
    const category = selectedQuiz?.category || '';
    displaySuggestion(percent, category);
    if (currentUser && selectedQuiz) {
        await saveQuizResult(selectedQuiz.id, selectedQuiz.title, score, percent);
    }
}
closeModalBtn.onclick = () => {
    quizModal.classList.add('hidden');
};
function getSuggestion(percentage, category) {
    const categoryDisplay = category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'this';
    if (percentage >= 90) {
        return {
            title: 'Outstanding!',
            message: `You're a true master of ${categoryDisplay}! Your knowledge is impressive. Consider creating challenging quizzes for others to enjoy!`,
            className: 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800'
        };
    }
    else if (percentage >= 70) {
        return {
            title: 'Great Job!',
            message: `You have solid knowledge of ${categoryDisplay}. Review the questions you missed to reach perfection. Keep up the excellent work!`,
            className: 'bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-300 text-blue-800'
        };
    }
    else if (percentage >= 50) {
        return {
            title: 'Good Effort!',
            message: `Nice try on the ${categoryDisplay} quiz! Focus on understanding the fundamentals. Practice more to improve your score!`,
            className: 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 text-yellow-800'
        };
    }
    else {
        return {
            title: 'Keep Learning!',
            message: `Don't give up! Start with basic concepts in ${categoryDisplay}. Regular practice will help you improve significantly!`,
            className: 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 text-orange-800'
        };
    }
}
function displaySuggestion(percentage, category) {
    const suggestion = getSuggestion(percentage, category);
    suggestionContainer.className = `mt-4 p-4 rounded-lg ${suggestion.className}`;
    suggestionContainer.innerHTML = `
    <div class="flex items-start gap-3">
      <div>
        <h4 class="font-bold text-lg mb-1">${suggestion.title}</h4>
        <p class="text-sm opacity-90">${suggestion.message}</p>
      </div>
    </div>
  `;
    suggestionContainer.classList.remove('hidden');
}
