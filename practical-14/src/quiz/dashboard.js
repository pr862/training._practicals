import { onAuthChange, logoutUser, getUserProfile } from '../auth/auth.js';
import { setLoadingState, navigateTo, handleLogout, setupAuthHandler } from '../utils/ui-helpers.js';
const logoutBtn = document.getElementById('logoutBtn');
const userDisplayName = document.getElementById('userDisplayName');
const createQuizCard = document.getElementById('createQuizCard');
const playQuizCard = document.getElementById('playQuizCard');
const mainContent = document.getElementById('mainContent');
const handleUserAuth = async (user) => {
    if (user) {
        setLoadingState(mainContent, false);
        const profile = await getUserProfile(user.uid);
        if (profile?.displayName) {
            userDisplayName.textContent = `Welcome, ${profile.displayName}!`;
        }
        else {
            userDisplayName.textContent = `Welcome, ${user.email?.split('@')[0]}!`;
        }
    }
    else {
        navigateTo('login.html');
    }
};
setLoadingState(mainContent, true);
setupAuthHandler(handleUserAuth, onAuthChange);
logoutBtn.addEventListener('click', async () => {
    await handleLogout(logoutUser);
});
createQuizCard.addEventListener('click', () => {
    navigateTo('createQuiz.html');
});
playQuizCard.addEventListener('click', () => {
    navigateTo('playQuiz.html');
});
