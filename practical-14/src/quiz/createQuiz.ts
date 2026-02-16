import { onAuthChange} from '../auth/auth.js';
import { collection, doc, addDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { setLoadingState, navigateTo, setupAuthHandler, showToastError, showToastSuccess } from '../utils/ui-helpers.js';

const quizTitleInput = document.getElementById('quizTitle') as HTMLInputElement;
const quizCategorySelect = document.getElementById('quizCategory') as HTMLSelectElement;
const quizDescriptionInput = document.getElementById('quizDescription') as HTMLTextAreaElement;
const addQuestionBtn = document.getElementById('addQuestionBtn') as HTMLButtonElement;
const saveQuizBtn = document.getElementById('saveQuizBtn') as HTMLButtonElement;
const questionsContainer = document.getElementById('questionsContainer') as HTMLDivElement;
const noQuestionsMessage = document.getElementById('noQuestionsMessage') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
const successMessage = document.getElementById('successMessage') as HTMLDivElement;
const questionTemplate = document.getElementById('questionTemplate') as HTMLTemplateElement;
const pageContent = document.getElementById('pageContent') as HTMLElement;
const quizTitleError = document.getElementById('quizTitleError') as HTMLParagraphElement;
const quizCategoryError = document.getElementById('quizCategoryError') as HTMLParagraphElement;

let questionCount = 0;
let currentUser: any = null;

function showFieldError(input: HTMLInputElement | HTMLSelectElement, errorElement: HTMLParagraphElement, message: string): void {
  input.classList.add('border-red-500', 'ring-2', 'ring-red-200');
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

function clearFieldError(input: HTMLInputElement | HTMLSelectElement, errorElement: HTMLParagraphElement): void {
  input.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
  errorElement.textContent = '';
  errorElement.classList.add('hidden');
}

function clearAllFieldErrors(): void {
  clearFieldError(quizTitleInput, quizTitleError);
  clearFieldError(quizCategorySelect, quizCategoryError);
  
  const questionItems = questionsContainer.querySelectorAll('.question-item');
  questionItems.forEach((item) => {
    const questionTextInput = item.querySelector('.question-text') as HTMLInputElement;
    const questionTextError = item.querySelector('.question-text-error') as HTMLParagraphElement;
    if (questionTextInput && questionTextError) {
      clearFieldError(questionTextInput, questionTextError);
    }
    
    const optionInputs = ['option-a', 'option-b', 'option-c', 'option-d'];
    const optionErrors = ['option-a-error', 'option-b-error', 'option-c-error', 'option-d-error'];
    optionInputs.forEach((opt, idx) => {
      const input = item.querySelector(`.${opt}`) as HTMLInputElement;
      const error = item.querySelector(`.${optionErrors[idx]}`) as HTMLParagraphElement;
      if (input && error) {
        clearFieldError(input, error);
      }
    });
    
    const optionsError = item.querySelector('.options-error') as HTMLParagraphElement;
    if (optionsError) {
      optionsError.textContent = '';
      optionsError.classList.add('hidden');
    }
  });
}

const handleUserAuth = async (user: any): Promise<void> => {
  if (user) {
    currentUser = user;
    setLoadingState(pageContent, false);
    addQuestion();
  } else {
    navigateTo('login.html');
  }
};

setLoadingState(pageContent, true);

setupAuthHandler(handleUserAuth, onAuthChange);

addQuestionBtn.addEventListener('click', () => {
  addQuestion();
});

function addQuestion(): void {
  questionCount++;

  noQuestionsMessage.classList.add('hidden');

  const fragment = questionTemplate.content.cloneNode(true) as DocumentFragment;
  const questionItem = fragment.querySelector('.question-item') as HTMLElement;
  const questionNumber = questionItem.querySelector('.question-number') as HTMLHeadingElement;
  questionNumber.textContent = `Question ${questionCount}`;

  const deleteBtn = questionItem.querySelector('.delete-question') as HTMLButtonElement;
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

function updateQuestionNumbers(): void {
  const questions = questionsContainer.querySelectorAll('.question-item');
  questions.forEach((question, index) => {
    const questionNumber = question.querySelector('.question-number') as HTMLHeadingElement;
    questionNumber.textContent = `Question ${index + 1}`;
  });
}

saveQuizBtn.addEventListener('click', async () => {
  await saveQuiz();
});

async function saveQuiz(): Promise<void> {
  clearAllFieldErrors();
  
  const title = quizTitleInput.value.trim();
  const category = quizCategorySelect.value;
  const description = quizDescriptionInput.value.trim();

  let hasError = false;

  if (!title) {
    showFieldError(quizTitleInput, quizTitleError, 'Please enter a quiz title');
    hasError = true;
  } else if (title.length < 3) {
    showFieldError(quizTitleInput, quizTitleError, 'Quiz title must be at least 3 characters long');
    hasError = true;
  }

  if (!category) {
    showFieldError(quizCategorySelect, quizCategoryError, 'Please select a category');
    hasError = true;
  }

  const questionsData: any[] = [];
  const questionItems = questionsContainer.querySelectorAll('.question-item');

  if (questionItems.length === 0) {
    showToastError(errorMessage, 'Please add at least one question to your quiz');
    return;
  }

  for (let i = 0; i < questionItems.length; i++) {
    const item = questionItems[i];
    const questionTextInput = item.querySelector('.question-text') as HTMLInputElement;
    const questionTextError = item.querySelector('.question-text-error') as HTMLParagraphElement;
    const questionText = questionTextInput.value.trim();
    
    const optionAInput = item.querySelector('.option-a') as HTMLInputElement;
    const optionAError = item.querySelector('.option-a-error') as HTMLParagraphElement;
    const optionA = optionAInput.value.trim();
    
    const optionBInput = item.querySelector('.option-b') as HTMLInputElement;
    const optionBError = item.querySelector('.option-b-error') as HTMLParagraphElement;
    const optionB = optionBInput.value.trim();
    
    const optionCInput = item.querySelector('.option-c') as HTMLInputElement;
    const optionCError = item.querySelector('.option-c-error') as HTMLParagraphElement;
    const optionC = optionCInput.value.trim();
    
    const optionDInput = item.querySelector('.option-d') as HTMLInputElement;
    const optionDError = item.querySelector('.option-d-error') as HTMLParagraphElement;
    const optionD = optionDInput.value.trim();
    
    const correctAnswer = (item.querySelector('.correct-answer') as HTMLSelectElement).value;

    if (!questionText) {
      showFieldError(questionTextInput, questionTextError, 'Please enter the question text');
      hasError = true;
    }

    if (!optionA) {
      showFieldError(optionAInput, optionAError, 'Please enter option A');
      hasError = true;
    }
    if (!optionB) {
      showFieldError(optionBInput, optionBError, 'Please enter option B');
      hasError = true;
    }
    if (!optionC) {
      showFieldError(optionCInput, optionCError, 'Please enter option C');
      hasError = true;
    }
    if (!optionD) {
      showFieldError(optionDInput, optionDError, 'Please enter option D');
      hasError = true;
    }

    const options = [optionA, optionB, optionC, optionD];
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== options.length) {
      const optionsError = item.querySelector('.options-error') as HTMLParagraphElement;
      optionsError.textContent = 'Question has duplicate options. All options must be unique.';
      optionsError.classList.remove('hidden');
      hasError = true;
    }

    if (!questionText || !optionA || !optionB || !optionC || !optionD || uniqueOptions.size !== options.length) {
      continue;
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

  if (hasError) {
    return;
  }

  if (questionsData.length === 0) {
    showToastError(errorMessage, 'Please add at least one valid question');
    return;
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
  } catch (error) {
    showToastError(errorMessage, 'Failed to save quiz. Please try again.');
  }
}

