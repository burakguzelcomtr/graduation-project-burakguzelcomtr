const QuizQuestion = require('./quizQuestion')
const generateId = require('./idGenerator')

const quizExamples = [
  new QuizQuestion({
    id: generateId(),
    text: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    type: 'multiple-choice',
    correctAnswer: 'Mars',
  }),

  new QuizQuestion({
    id: generateId(),
    text: 'The boiling point of water is 100°C at sea level.',
    options: ['True', 'False'],
    type: 'true-false',
    correctAnswer: 'True',
  }),

  new QuizQuestion({
    id: generateId(),
    text: 'The largest ocean on Earth is ____.',
    options: [],
    type: 'fill-in-the-blank',
    correctAnswer: 'Pacific',
  }),

  new QuizQuestion({
    id: generateId(),
    text: 'Fill the blanks: The capital of Italy is ____ and the capital of Germany is ____.',
    options: [],
    type: 'fill-in-multiple-blanks',
    correctAnswer: ['Rome', 'Berlin'],
  }),

  new QuizQuestion({
    text: 'Select all that are mammals.',
    options: ['Shark', 'Dolphin', 'Eagle', 'Tiger'],
    type: 'multiple-answers',
    correctAnswer: ['Dolphin', 'Tiger'],
  }),

  new QuizQuestion({
    text: 'Rate your agreement: "I enjoy learning math."',
    options: [['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree']],
    type: 'multiple-dropdown',
    correctAnswer: null,
  }),

  new QuizQuestion({
    text: 'Match the inventor to their invention.',
    options: {
      left: ['Thomas Edison', 'Alexander Fleming', 'Wright Brothers'],
      right: ['Penicillin', 'Light bulb', 'First powered flight'],
    },
    type: 'matching',
    correctAnswer: {
      'Thomas Edison': 'Light bulb',
      'Alexander Fleming': 'Penicillin',
      'Wright Brothers': 'First powered flight',
    },
  }),

  new QuizQuestion({
    text: 'What is 12 × 8?',
    options: [],
    type: 'numerical',
    correctAnswer: 96,
  }),
]

module.exports = quizExamples
