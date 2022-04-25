import './die.css'

function Die(props) {
	const elements = Array(props.value)
		.fill(0)
		.map((value, index) => {
			return <span key={index} className='pip' />
		})

	return (
		<div
			className={`face ${props.isHeld ? ' held-box' : ''}`}
			onClick={() => props.clickDie(props.id)}
		>
			{elements}
		</div>
	)
}

export default Die
