# quiz-app

A quiz/test web app built with **React (Vite)** + **Tailwind CSS v4** + **lucide-react** icons + **oxlint** linting.

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run lint     # run oxlint
npm run build    # production build
npm run preview  # preview production build
```

## What's set up

- **Vite + React 19** — fast dev server and HMR
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite` plugin
- **lucide-react** — icon library
- **oxlint** — fast linter with React, React Hooks, and correctness rules (`.oxlintrc.json`)

## Folder structure

```
quiz-app/
├── index.html
├── vite.config.js
├── .oxlintrc.json
├── package.json
└── src/
    ├── main.jsx          # app entry point
    ├── App.jsx           # root component
    ├── index.css         # Tailwind entry
    ├── components/       # reusable UI components
    ├── pages/            # route/page-level components
    ├── hooks/            # custom React hooks
    ├── data/             # quiz questions & static data
    └── lib/              # shared utilities/helpers
```

## Planned features (todo)

- [ ] Quiz flow: start screen → questions → results
- [ ] Question data model in `src/data/` (questions, options, correct answers)
- [ ] Custom hooks (e.g. `useQuiz`) in `src/hooks/`
- [ ] Reusable UI components in `src/components/` (buttons, progress bar, option cards)
- [ ] Pages in `src/pages/` (Home, Quiz, Results)
- [ ] Score tracking and results summary
- [ ] Styling with Tailwind CSS
