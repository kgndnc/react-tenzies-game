/*
 * todo: add stopwatch
 * todo: store hi-scores in localStorage
 */

import './App.css'
import React from 'react'
import Confetti from 'react-confetti'
import Die from './components/Die'
import Modal from 'react-modal'

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

	// start the timer when game starts
	React.useEffect(() => {
		if (hasGameStarted) {
			let date = new Date()
			setTime(date.getTime())
		} else {
			let date = new Date()
			setTime(prevTime => date.getTime() - prevTime)
		}

		// cleanup function
		// return () => {}
	}, [hasGameStarted])

	// Open modal and setGameStarted(false) when the game ends.
	React.useEffect(() => {
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
		setRandomValues(allNewDice())
	}

	function allNewDice() {
		let nums = []
		for (let i = 0; i < 10; i++) {
			// const rand = Math.floor(Math.random() * 6 + 1)
			const rand = 4
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

	// utility func. to format time
	const formatTime = time => {
		let [hours, minutes, seconds, milliseconds] = [0, 0, 0, time]
		console.log(hours, seconds)

		// these conditonals are nested because if one step doesn't run other ones don't have to as well
		// eg. if seconds less than 60 we don't have to check for minutes
		if (milliseconds >= 1000) {
			seconds += Math.floor(milliseconds / 1000)
			milliseconds = milliseconds % 1000

			if (seconds >= 60) {
				minutes += Math.floor(seconds / 60)
				seconds %= 60

				if (minutes >= 60) {
					hours += Math.floor(minutes / 60)
					minutes %= 60
				}
			}
		}

		return hours !== 0
			? `${hours} hour(s) : `
			: `` +
					`${minutes} minute(s) : ${seconds} seconds : ${milliseconds} milliseconds`
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
					<div>Your time: {formatTime(time)}</div>
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

