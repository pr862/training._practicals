import { onAuthChange, logoutUser, getUserProfile } from '../auth/auth.js';
import { setLoadingState, navigateTo, handleLogout, setupAuthHandler } from '../utils/ui-helpers.js';

const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const userDisplayName = document.getElementById('userDisplayName') as HTMLSpanElement;
const createQuizCard = document.getElementById('createQuizCard') as HTMLDivElement;
const playQuizCard = document.getElementById('playQuizCard') as HTMLDivElement;
const mainContent = document.getElementById('mainContent') as HTMLElement;

const handleUserAuth = async (user: any): Promise<void> => {
  if (user) {
    setLoadingState(mainContent, false);

    const profile = await getUserProfile(user.uid);
    if (profile?.displayName) {
      userDisplayName.textContent = `Welcome, ${profile.displayName}!`;
    } else {
      userDisplayName.textContent = `Welcome, ${user.email?.split('@')[0]}!`;
    }
  } else {
    navigateTo('login.html');
  }
};

setLoadingState(mainContent, true);

setupAuthHandler(handleUserAuth, onAuthChange);

logoutBtn.addEventListener('click', async () => {
  try {
    await handleLogout(logoutUser);
  } catch (error) {
    console.error('Logout error:', error);
  }
});

createQuizCard.addEventListener('click', () => {
  navigateTo('createQuiz.html');
});

playQuizCard.addEventListener('click', () => {
  navigateTo('playQuiz.html');
});

