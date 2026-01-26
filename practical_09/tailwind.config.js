/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/index.html",
    "./src/index.js"
  ],
  theme: {
    extend: {},
  },
  safelist: [
    "from-rose-100", "via-rose-50", "to-rose-100",
    "from-sky-100", "via-sky-50", "to-sky-100",
    "from-violet-100", "via-violet-50", "to-violet-100",
    "from-teal-100", "via-teal-50", "to-teal-100",
    "from-amber-100", "via-amber-50", "to-amber-100",
    "from-emerald-100", "via-emerald-50", "to-emerald-100",
    "from-pink-100", "via-pink-50", "to-pink-100",
    "from-indigo-100", "via-indigo-50", "to-indigo-100",

    "from-rose-500", "to-rose-400",
    "from-sky-500", "to-sky-400",
    "from-violet-500", "to-violet-400",
    "from-teal-500", "to-teal-400",
    "from-amber-500", "to-amber-400",
    "from-emerald-500", "to-emerald-400",
    "from-pink-500", "to-pink-400",
    "from-indigo-500", "to-indigo-400",

    "border-rose-200",
    "border-sky-200",
    "border-violet-200",
    "border-teal-200",
    "border-amber-200",
    "border-emerald-200",
    "border-pink-200",
    "border-indigo-200",

    "border-rose-400", "border-t-rose-500",
    "border-sky-400", "border-t-sky-500",
    "border-violet-400", "border-t-violet-500",
    "border-teal-400", "border-t-teal-500",
    "border-amber-400", "border-t-amber-500",
    "border-emerald-400", "border-t-emerald-500",
    "border-pink-400", "border-t-pink-500",
    "border-indigo-400", "border-t-indigo-500",

    "font-['Inter']",
    "font-['JetBrains_Mono']",
  ],
  plugins: [],
};
