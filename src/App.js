import './App.css'
import React from 'react'
import Confetti from 'react-confetti'
import Die from './components/Die'
import Modal from 'react-modal'

// Bind modal to your appElement
Modal.setAppElement('#root')

function App() {
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

	let subtitle = 'Subtitle'
	const [modalIsOpen, setIsOpen] = React.useState(false)

	function openModal() {
		setIsOpen(true)
	}

	function afterOpenModal() {}

	function closeModal() {
		setIsOpen(false)

		// resets the game
		setTenzies(false)
		setRandomValues(allNewDice())
	}

	const [randomValues, setRandomValues] = React.useState(allNewDice())

	// `tenzies` becomes true when the game ends
	const [tenzies, setTenzies] = React.useState(false)

	// Open modal when the game ends.
	React.useEffect(() => {
		openModal()
	}, [tenzies])

	const [windowSize, setWindowSize] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight,
	})

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

	function allNewDice() {
		let nums = []
		for (let i = 0; i < 10; i++) {
			const rand = Math.floor(Math.random() * 6 + 1)
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
					onAfterOpen={afterOpenModal}
					onRequestClose={closeModal}
					style={customModalStyles}
				>
					<h2 ref={_subtitle => (subtitle = _subtitle)}>You won!</h2>
					<div>Congratulations! You have won the game.</div>
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

