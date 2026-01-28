# 🎯 Random Quote Generator

A simple but beautiful quote generator that fetches random quotes from an API and pairs them with stunning gradient themes. Every time you click "Get New Quote," you get a fresh quote with a new color palette — it's like unwrapping a small surprise!

![Quote Generator Preview](https://via.placeholder.com/800x400?text=Quote+Generator+Preview)

---

## ✨ What Makes This Project Cool?

Here's what I built into this project:

| Feature | Description |
|---------|-------------|
| 🎨 **8 Beautiful Themes** | Each quote comes with its own color personality — from soft rose to vibrant indigo |
| 📱 **Fully Responsive** | Looks great on phones, tablets, and desktop screens |
| 🧊 **Glassmorphism UI** | That trendy frosted-glass effect on the quote card |
| ⚡ **Smooth Animations** | Fade-ins, transitions, and hover effects that feel natural |
| 🔄 **Loading States** | A clean spinner while fetching quotes |
| 🛡️ **Error Handling** | Gracefully handles when the API goes AWOL |

---

## 🛠️ Tech Stack

This project kept things simple and focused:

- **HTML5** — Clean semantic markup
- **JavaScript (ES6+)** — Modern JS with async/await, no frameworks needed
- **Tailwind CSS v3.4** — For rapid, beautiful styling

---

## 📁 Project Structure

```
practical_09/
├── src/
│   ├── index.html      # The main page structure
│   ├── index.js        # All the magic (fetching, themes, animations)
│   └── style.css       # Tailwind directives
├── tailwind.config.js  # Tailwind configuration with theme safelist
└── package.json        # Project dependencies
```

---

## 🚀 How to Run It

```bash
# Navigate to the project folder
cd practical_09

# Install dependencies
npm install

# Build Tailwind CSS
npm run build

# Open src/index.html in your browser
```

Or just open `src/index.html` directly in a browser if you have the CSS built already!

---

## 🎨 Want to Customize It?

### Add More Color Themes

Head over to `src/index.js` and extend the `colors` array:

```javascript
const colors = [
  {
    bg: 'from-blue-100 via-blue-50 to-blue-100',
    button: 'from-blue-500 to-blue-400',
    border: 'border-blue-200',
    loader: 'border-blue-400 border-t-blue-500',
  },
  // Add your own theme here!
  {
    bg: 'from-orange-100 via-orange-50 to-orange-100',
    button: 'from-orange-500 to-orange-400',
    border: 'border-orange-200',
    loader: 'border-orange-400 border-t-orange-500',
  },
];
```

### Switch the Quote Source

Want quotes from a different API? Just change the URL in `src/index.js`:

```javascript
const res = await fetch('https://your-favorite-quote-api.com/random');
```

---

## 📚 What You Can Learn From This

If you're learning web development, this project covers some useful ground:

- **Tailwind CSS** — Utility-first styling, gradient backgrounds, responsive design
- **Fetch API** — Making HTTP requests with async/await
- **DOM Manipulation** — Updating the page dynamically without page reloads
- **CSS Animations** — Transitions, transforms, and custom animations
- **Glassmorphism** — Using backdrop-blur for that modern frosted look

---

## 🎉 Give It a Try!

Click "Get New Quote" and see what wisdom (or humor) awaits. Each quote gets a random theme, so the visual experience stays fresh and engaging.

---

Built with ❤️ using Tailwind CSS
