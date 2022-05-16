import React from "react";
import Die from "./die";
import {nanoid} from "nanoid";
import '../assets/die.css';
import {Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from '@mui/material';
import {Button} from '@mui/material';
//import CloseIcon from '@mui/icons-material/Close';

export default function Layout() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [dialogOpen, setDialogOpen] = React.useState(false);

    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            DialogClick();
        }
    }, [dice])
    const DialogClick = () => {
        setDialogOpen(!dialogOpen);
      };

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
                
            </button>
            {tenzies && 
            <div style={{width:"20%"}}>
                <Dialog 
        open={dialogOpen}
        onClose={DialogClick}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            {/* <CloseIcon onClick={DialogClick} style={{float:'right'}}/> */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You won 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={DialogClick} >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
                </div>}
        </main>
    )
}