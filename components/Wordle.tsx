'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty'
type GameStatus = 'playing' | 'won' | 'lost'

const WORDS = ['APPLE', 'TABLE', 'CHAIR', 'CLOUD', 'MUSIC', 'PHONE']
const MAX_GUESSES = 6

export function WordleGame() {
  const [targetWord, setTargetWord] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [usedLetters, setUsedLetters] = useState<Record<string, LetterStatus>>({})
  const [shake, setShake] = useState(false)
  const [jump, setJump] = useState(-1)
  const [message, setMessage] = useState('')

  // Initialize game
  useEffect(() => {
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)])
  }, [])

  // Confetti animation on win
  useEffect(() => {
    if (gameStatus === 'won') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [gameStatus])

  // Keyboard input handling
  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return

      if (e.key === 'Enter') {
        if (currentGuess.length === 5) {
          const isValid = await checkValidWord(currentGuess.toLowerCase())

          if (!isValid) {
            setMessage('Not a valid English word!')
            setShake(true)
            setTimeout(() => setShake(false), 650)
            return
          }

          const newGuesses = [...guesses, currentGuess]
          setGuesses(newGuesses)
          
          if (currentGuess === targetWord) {
            setGameStatus('won')
          } else if (newGuesses.length === MAX_GUESSES) {
            setGameStatus('lost')
          }
          
          updateUsedLetters(currentGuess)
          setCurrentGuess('')
          setMessage('')
        } else {
          setMessage('Word too short!')
          setShake(true)
          setTimeout(() => setShake(false), 650)
        }
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1))
        setJump(-1)
      } else if (/^[A-Za-z]$/.test(e.key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess(prev => (prev + e.key.toUpperCase()))
          setJump(currentGuess.length)
          setTimeout(() => setJump(-1), 100)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentGuess, gameStatus, guesses, targetWord])

  // Check if word is valid using dictionary API
  const checkValidWord = async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      return response.ok
    } catch (error) {
      setMessage('Failed to verify word. Please try again.')
      return false
    }
  }

  // Update used letters with their status
  const updateUsedLetters = (guess: string) => {
    const newUsedLetters = { ...usedLetters }
    guess.split('').forEach((letter, i) => {
      if (targetWord[i] === letter) {
        newUsedLetters[letter] = 'correct'
      } else if (targetWord.includes(letter)) {
        newUsedLetters[letter] = newUsedLetters[letter] === 'correct' ? 'correct' : 'present'
      } else {
        newUsedLetters[letter] = 'absent'
      }
    })
    setUsedLetters(newUsedLetters)
  }

  // Get status of a letter in a guess
  const getLetterStatus = (guess: string, index: number): LetterStatus => {
    if (guess[index] === targetWord[index]) return 'correct'
    if (targetWord.includes(guess[index])) return 'present'
    return 'absent'
  }

  // Get background color for a cell based on status
  const getCellBackground = (status: LetterStatus) => {
    switch (status) {
      case 'correct': return 'bg-[#8BC34A]' // Light green
      case 'present': return 'bg-yellow-400' // Yellow
      case 'absent': return 'bg-[#6d4a29]' // Deep brown
      default: return 'bg-[#fcf3e4]' // Off-white
    }
  }

  // Render the game grid
  const renderGrid = () => {
    return Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-2 mb-2 justify-center">
        {Array.from({ length: 5 }).map((_, cellIndex) => {
          const guess = guesses[rowIndex]
          const isCurrentRow = rowIndex === guesses.length
          const letter = isCurrentRow ? currentGuess[cellIndex] : guess?.[cellIndex]
          const status = guess ? getLetterStatus(guess, cellIndex) : 'empty'
          const shouldJump = jump === cellIndex && isCurrentRow

          return (
            <div
              key={cellIndex}
              className={`
                w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold
                ${getCellBackground(status)}
                ${isCurrentRow ? 'border-[#8b5e34]' : 'border-transparent'}
                ${shake && isCurrentRow ? 'animate-shake' : ''}
                ${shouldJump ? 'animate-jump' : ''}
                transition-colors duration-300
                rounded-sm
              `}
              style={{ transitionDelay: guess ? `${cellIndex * 100}ms` : '0ms' }}
            >
              <span className={`font-bold ${status !== 'empty' ? 'text-white' : 'text-[#8b5e34]'}`}>
                {letter}
              </span>
            </div>
          )
        })}
      </div>
    ))
  }

  // Render the virtual keyboard
  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ]
    
    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center gap-1 mb-2">
        {row.map((letter, index) => (
          <button
            key={index}
            className={`
              px-3 py-4 rounded-sm font-bold
              ${usedLetters[letter] ? 
                `text-white ${getCellBackground(usedLetters[letter])}` : 
                'bg-[#fcf3e4] text-[#8b5e34] hover:bg-[#DFD2BC]'
              }
              border-2 border-[#8b5e34]
              ${letter === 'ENTER' || letter === '⌫' ? 'px-4 text-sm' : ''}
            `}
            onClick={() => handleVirtualKey(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
    ))
  }

  // Handle virtual keyboard input
  const handleVirtualKey = (letter: string) => {
    if (gameStatus !== 'playing') return

    if (letter === 'ENTER') {
      if (currentGuess.length === 5) {
        const newGuesses = [...guesses, currentGuess]
        setGuesses(newGuesses)
        
        if (currentGuess === targetWord) {
          setGameStatus('won')
        } else if (newGuesses.length === MAX_GUESSES) {
          setGameStatus('lost')
        }
        
        updateUsedLetters(currentGuess)
        setCurrentGuess('')
      } else {
        setMessage('Word too short!')
        setShake(true)
        setTimeout(() => setShake(false), 650)
      }
    } else if (letter === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1))
      setJump(-1)
    } else if (currentGuess.length < 5) {
      setCurrentGuess(prev => (prev + letter))
      setJump(currentGuess.length)
      setTimeout(() => setJump(-1), 100)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 min-h-screen">
      <h1 
        className="text-4xl font-bold text-center text-[#8b5e34] mb-8 tracking-wider"
        style={{
          textShadow: '2px 2px 0 #DFD2BC, 4px 4px 0 #8b5e34'
        }}
      >
        EZ GRIDDLE
      </h1>

      {message && (
        <div className="mb-4 p-2 text-center bg-[#fcf3e4] border-2 border-[#8b5e34] rounded-sm">
          <p className="text-red-600 font-bold">{message}</p>
        </div>
      )}

      <div className="mb-8">{renderGrid()}</div>
      
      <div className="w-full max-w-lg mx-auto">{renderKeyboard()}</div>

      {gameStatus !== 'playing' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#fcf3e4] p-8 text-center max-w-md w-full rounded-sm border-4 border-[#8b5e34]">
            <h2 className="text-2xl font-bold mb-4 text-[#8b5e34]">
              {gameStatus === 'won' ? (
                <>
                  🎉 YOU WIN! 🎉
                  <div className="confetti-canvas absolute inset-0 pointer-events-none"/>
                </>
              ) : (
                <>
                  😢 GAME OVER 😢
                  <div className="text-lg mt-2">The word was: {targetWord}</div>
                </>
              )}
            </h2>
            <button
              className="bg-[#8b5e34] text-[#fcf3e4] px-6 py-2 rounded-sm hover:bg-[#6d4a29] transition-colors font-bold"
              onClick={() => window.location.reload()}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  )
}