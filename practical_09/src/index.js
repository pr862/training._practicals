const quoteEl = document.getElementById('quote');
const button = document.getElementById('newQuote');
const loader = document.getElementById('loader');
const page = document.getElementById('page');
const container = document.getElementById('container');

const colors = [
  {
    bg: 'from-rose-100 via-rose-50 to-rose-100',
    button: 'from-rose-500 to-rose-400',
    border: 'border-rose-200',
    loader: 'border-rose-400 border-t-rose-500',
  },
  {
    bg: 'from-sky-100 via-sky-50 to-sky-100',
    button: 'from-sky-500 to-sky-400',
    border: 'border-sky-200',
    loader: 'border-sky-400 border-t-sky-500',
  },
  {
    bg: 'from-violet-100 via-violet-50 to-violet-100',
    button: 'from-violet-500 to-violet-400',
    border: 'border-violet-200',
    loader: 'border-violet-400 border-t-violet-500',
  },
  {
    bg: 'from-teal-100 via-teal-50 to-teal-100',
    button: 'from-teal-500 to-teal-400',
    border: 'border-teal-200',
    loader: 'border-teal-400 border-t-teal-500',
  },
  {
    bg: 'from-amber-100 via-amber-50 to-amber-100',
    button: 'from-amber-500 to-amber-400',
    border: 'border-amber-200',
    loader: 'border-amber-400 border-t-amber-500',
  },
  {
    bg: 'from-emerald-100 via-emerald-50 to-emerald-100',
    button: 'from-emerald-500 to-emerald-400',
    border: 'border-emerald-200',
    loader: 'border-emerald-400 border-t-emerald-500',
  },
  {
    bg: 'from-pink-100 via-pink-50 to-pink-100',
    button: 'from-pink-500 to-pink-400',
    border: 'border-pink-200',
    loader: 'border-pink-400 border-t-pink-500',
  },
  {
    bg: 'from-indigo-100 via-indigo-50 to-indigo-100',
    button: 'from-indigo-500 to-indigo-400',
    border: 'border-indigo-200',
    loader: 'border-indigo-400 border-t-indigo-500',
  },
];

function randomTheme() {
  return colors[Math.floor(Math.random() * colors.length)];
}

async function fetchQuote() {

  try {
    loader.classList.remove('hidden');
    quoteEl.classList.add('opacity-0', 'translate-y-3');


    const res = await fetch('https://api.whatdoestrumpthink.com/api/v1/quotes/random');
    const data = await res.json();
    loader.classList.add('hidden');

    const theme = randomTheme();
    page.className = `bg-gradient-to-br ${theme.bg} flex items-center justify-center min-h-screen font-['poppins'] transition-all duration-700`;  
    button.className = `bg-gradient-to-r ${theme.button} text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 font-semibold tracking-wide`;
    container.className = `bg-white/85 backdrop-blur-xl shadow-2xl rounded-3xl px-14 py-12 max-w-3xl w-full text-center relative overflow-hidden border ${theme.border} transition-all duration-500`;

    const loaderDiv = loader.querySelector('div');
    loaderDiv.className = `border-4 ${theme.loader} rounded-full w-11 h-11 mx-auto animate-spin`;

    quoteEl.textContent = data.message;
    setTimeout(() => {
      quoteEl.classList.remove('opacity-0', 'translate-y-3');
      quoteEl.classList.add('opacity-100');
    }, 50);

  } catch (error) {
    loader.classList.add('hidden');
    quoteEl.textContent = "“Failed to fetch quote. Try again!”";
    quoteEl.classList.remove('opacity-0', 'translate-y-3');
    quoteEl.classList.add('opacity-100');

  } 
}
fetchQuote();
button.addEventListener('click', fetchQuote);

