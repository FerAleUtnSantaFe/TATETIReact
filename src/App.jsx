import confetti from 'canvas-confetti'
import { useEffect, useState } from 'react'
import './App.css'
import { Square } from "./components/Square.jsx"
import { WinnerModal } from './components/WinnerModal.jsx'
import { TURNS } from "./constants.js"
import { checkEndGame, checkWinner } from './logic/board.js'
import { resetGameStorage, saveGameToStorage } from './logic/index.js'

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })
  // null no hay ganador, false empate
  const [winner, setWinner] = useState(null)

    
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }
  
  const updateBoard = (index) => {
    
    if(board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X

    setTurn(newTurn)
    
    saveGameToStorage({board: newBoard, turn:newTurn})
    
    const newWinner = checkWinner(newBoard)
    if (newWinner){
      confetti()
      setWinner(newWinner) // recordar que los estados son asincronos
    } else if (checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  useEffect(() => {

  },[winner])


  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del Juego</button>
      <section className="game">
        {
          board.map((square, index) =>{
            return (
              <Square 
              key={index} 
              index={index} 
              updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
      <section>
        <WinnerModal resetGame={resetGame} winner={winner} />
      </section>
    </main>
  )

}

export default App
