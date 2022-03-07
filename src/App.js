import './App.css';
import React from 'react';
import Confetti from 'react-confetti'
import Die from './components/Die';


function App() {

  const [randomValues, setRandomValues] = React.useState(allNewDice())
  
  const [tenzies, setTenzies] = React.useState(false)

  const [windowSize, setWindowSize] = React.useState(
    { 
      width: window.innerWidth, 
      height: window.innerHeight
    }
  )

  // To set the Confetti compenent's width and height
  // properties every time window resizes
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize(
        { 
          width: window.innerWidth, 
          height: window.innerHeight
        }
      )
    })
  }, [])

  React.useEffect(() => {
    const firstValue = randomValues[0].value
    if(randomValues.every(item => item.isHeld &&  item.value === firstValue)) {
      setTenzies(true)
    } else {
      setTenzies(false)
    }
  }, [randomValues])
  
  function allNewDice() {
    let nums = []
    for (let i = 0; i < 10; i++) {
        const rand = Math.floor(Math.random() * 6 + 1)
        const tmpObj = {value:rand, isHeld: false}
        nums.push(tmpObj)
    }
    return nums
  }
  function clickDie(id) {
      setRandomValues(prevValues => {
        return prevValues.map((oldValue, index) => (index === id ? {...oldValue, isHeld: !oldValue.isHeld} : oldValue))
      })
  }

  const dieElements = randomValues
  .map((randomValue, index) => 
    (<Die 
      key={index}
      id={index} 
      value={randomValue.value}
      isHeld={randomValue.isHeld}
      clickDie={clickDie}
    />))

  function roll() {
    setRandomValues(prevValues => {
      return prevValues.map( (oldValue, index) => {
        return oldValue.isHeld ? oldValue : {
          value: Math.floor(Math.random() * 6 + 1),
          isHeld: false
        }
      } )
    })
  }

  
  return (
    <div className="App">
      <main>
        {tenzies && 
        <Confetti
          width={windowSize.width}
          height={windowSize.height} 
        />}
        <div className='description'>
          <h2>Tenzies</h2>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        </div>
        <div className="dice-container">
          {dieElements}
        </div>

        <button 
        className='roll-button'
        // onClick={roll}
        onClick={tenzies ? () => setRandomValues(allNewDice()) : roll}
        >
          {tenzies ? "Reset" : "Roll"}
        </button>

      </main>
    </div>
  );
}

export default App;
