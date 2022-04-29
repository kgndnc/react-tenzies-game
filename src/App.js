/*
 * todo: add stopwatch
 * todo: store hi-scores in localStorage
 */

import './App.css'
import React from 'react'
import Confetti from 'react-confetti'
import Die from './components/Die'
import Modal from 'react-modal'
import { formatTime } from './components/utils'

// Bind modal appElement
Modal.setAppElement('#root')

function App() {
	// states
	const [modalIsOpen, setIsOpen] = React.useState(false)

	const [randomValues, setRandomValues] = React.useState(allNewDice())

	// `tenzies` becomes true when the game ends
	const [tenzies, setTenzies] = React.useState(false)

	const [windowSize, setWindowSize] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight,
	})
	// to store whether the game has started or not (will be useful for stopwatch)
	const [hasGameStarted, setGameStarted] = React.useState(false)

	// timer
	const [time, setTime] = React.useState(0)

	// useEffect Hooks

	// To get the the hiscore values from localStorage
	// or create if it's non-existent
	React.useEffect(() => {
		// hi-score array
		if (!localStorage.getItem('hiScores')) {
			localStorage.setItem('hiScores', JSON.stringify(Array(10)))
		}
	}, [])

	const hiScores = React.useRef(localStorage.getItem('hiScores'))
	const hiScoreArr = JSON.parse(hiScores.current)
	console.log('hiScoreArr:', hiScoreArr)
	const score = React.useRef(-1)
	const scoreText = React.useRef('')

	// start the timer when game starts
	React.useEffect(() => {
		if (hasGameStarted) {
			setTime(new Date().getTime())
			console.log('hasGameStarted time: ', time)
		} else {
			setTime(prevTime => {
				console.log('prev time: ', prevTime)
				return new Date().getTime() - prevTime
			})
			console.log('else hasGameStarted time: ', time)
		}

		// cleanup function
		// return () => {}
	}, [hasGameStarted])

	score.current = time
	scoreText.current = formatTime(time)

	// // Check if it's a high score
	// for (const [index, el] of hiScoreArr) {
	// 	// the first value that is undefined becomes user's score
	// 	if (!el) {
	// 		hiScoreArr[index] = scoreText
	// 		hiScores.current = JSON.stringify(hiScoreArr)
	// 		localStorage.setItem('hiScores', hiScores.current)
	// 		break
	// 	} else if (score.current < el) {
	// 		hiScores.current = JSON.stringify(
	// 			hiScoreArr.splice(index, 0, scoreText.current)
	// 		)
	// 		localStorage.setItem('hiScores', hiScores.current)

	// 		break
	// 	}
	// }

	console.log('score, scoreText: \n', score.current, scoreText.current)

	// Open modal and setGameStarted(false) when the game ends.
	React.useEffect(() => {
		// Check if it's a high score

		for (let i = 0; i < hiScoreArr.length; i++) {
			if (hiScoreArr[i] == null) {
				console.log('yarrak')
				hiScoreArr[i] = scoreText
				hiScores.current = JSON.stringify(hiScoreArr)
				localStorage.setItem('hiScores', hiScores.current)
				break
			} else if (score.current < Number(hiScoreArr[i])) {
				console.log('31')
				hiScores.current = JSON.stringify(
					hiScoreArr.splice(i, 0, scoreText.current)
				)
				localStorage.setItem('hiScores', hiScores.current)

				break
			}
		}

		// for (const [index, el] of hiScoreArr) {
		// 	console.log('döngü')
		// 	console.log('index: ', index)
		// 	console.log('el: ', el)
		// 	// the first value that is undefined becomes user's score
		// 	if (el == null) {
		// 		console.log('yarrak')
		// 		hiScoreArr[index] = scoreText
		// 		hiScores.current = JSON.stringify(hiScoreArr)
		// 		localStorage.setItem('hiScores', hiScores.current)
		// 		break
		// 	} else if (score.current < Number(el)) {
		// 		console.log('31')
		// 		hiScores.current = JSON.stringify(
		// 			hiScoreArr.splice(index, 0, scoreText.current)
		// 		)
		// 		localStorage.setItem('hiScores', hiScores.current)

		// 		break
		// 	}
		// }

		openModal()
		setGameStarted(false)
	}, [tenzies])

	// To set the Confetti compenent's width and height
	// properties every time window resizes
	React.useEffect(() => {
		window.addEventListener('resize', () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		})
	}, [])

	// Checks if the all selected dies have the same value
	React.useEffect(() => {
		const firstValue = randomValues[0].value
		if (randomValues.every(item => item.isHeld && item.value === firstValue)) {
			setTenzies(true)
		} else {
			setTenzies(false)
		}
	}, [randomValues])

	const customModalStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
			textAlign: 'center',
		},
	}

	function openModal() {
		setIsOpen(true)
	}

	function closeModal() {
		setIsOpen(false)

		// resets the game
		setTenzies(false)
		score.current = -1
		scoreText.current = ''
		setRandomValues(allNewDice())
	}

	function allNewDice() {
		let nums = []
		for (let i = 0; i < 10; i++) {
			const rand = Math.floor(Math.random() * 6 + 1)
			// const rand = 4   //for testing
			const tmpObj = { value: rand, isHeld: false }
			nums.push(tmpObj)
		}
		return nums
	}
	function clickDie(id) {
		setRandomValues(prevValues => {
			return prevValues.map((oldValue, index) =>
				index === id ? { ...oldValue, isHeld: !oldValue.isHeld } : oldValue
			)
		})
	}

	const dieElements = randomValues.map((randomValue, index) => (
		<Die
			key={index}
			id={index}
			value={randomValue.value}
			isHeld={randomValue.isHeld}
			clickDie={clickDie}
			hasGameStarted={hasGameStarted}
			setGameStarted={setGameStarted}
		/>
	))

	function roll() {
		setRandomValues(prevValues => {
			return prevValues.map((oldValue, index) => {
				return oldValue.isHeld
					? oldValue
					: {
							value: Math.floor(Math.random() * 6 + 1),
							isHeld: false,
					  }
			})
		})
	}

	return (
		<div className='App'>
			{tenzies && (
				<Modal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
					style={customModalStyles}
				>
					<h2>You won!</h2>
					<div>Congratulations! You have won the game.</div>
					<div>Your time -&gt; {scoreText.current}</div>
					<button
						id='modal--button'
						className='roll-button mt-5'
						onClick={closeModal}
					>
						Reset
					</button>
				</Modal>
			)}
			<main>
				{tenzies && (
					<Confetti width={windowSize.width} height={windowSize.height} />
				)}
				<div className='description'>
					<h2>Tenzies</h2>
					<p>
						Roll until all dice are the same. Click each die to freeze it at its
						current value between rolls.
					</p>
				</div>
				<div className='dice-container'>{dieElements}</div>

				<button
					className='roll-button'
					// onClick={roll}
					onClick={tenzies ? () => setRandomValues(allNewDice()) : roll}
				>
					{tenzies ? 'Reset' : 'Roll'}
				</button>
			</main>
		</div>
	)
}

export default App

