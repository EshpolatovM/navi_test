import { useState } from 'react'
import Header from './components/Header'
import QuestionCard from './components/QuestionCard'

const QUESTIONS = [
  {
    question: 'What is the capital city of Uzbekistan?',
    options: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'],
    correctIndex: 0,
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctIndex: 1,
  },
  {
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
    correctIndex: 2,
  },
]

function App() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)

  const current = QUESTIONS[index]
  const isLast = index === QUESTIONS.length - 1

  const handleNext = () => {
    setSelected(null)
    setIndex((i) => (isLast ? 0 : i + 1))
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-[860px] px-5 pb-24 pt-10 md:pt-16">
        <QuestionCard
          key={index}
          question={current.question}
          options={current.options}
          correctIndex={current.correctIndex}
          selectedOption={selected}
          onSelect={setSelected}
          onNext={handleNext}
          currentQuestion={index + 1}
          totalQuestions={QUESTIONS.length}
        />
      </main>
    </div>
  )
}

export default App