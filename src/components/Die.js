
function Die(props) {
    
    return (
        <div 
            className={`box${props.isHeld ? " held-box" : ""}`}
            onClick={() => props.clickDie(props.id)}
        >
            {props.value}
        </div>
    )
}

export default Die