import './die.css'

function Die(props) {
	const elements = Array(props.value)
		.fill(0)
		.map((value, index) => {
			return <span key={index} className='pip' />
		})

	// marks die as selected with die's id and starts the game if it hasn't started yet (gameHasStarted)
	const handleClick = () => {
		props.clickDie(props.id)
		if (!props.hasGameStarted) {
			props.setGameStarted(true)
		}
	}

	return (
		<div
			className={`face ${props.isHeld ? ' held-box' : ''}`}
			onClick={handleClick}
		>
			{elements}
		</div>
	)
}

export default Die
