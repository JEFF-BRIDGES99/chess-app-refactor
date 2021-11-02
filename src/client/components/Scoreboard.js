import flip from '../images/flip.png';
import back from '../images/back.png';
import begin from '../images/begin.png';
import play from '../images/play.png';
import ff from '../images/ff.png';
import flag from '../images/flag.svg';
import draw from '../images/draw.svg';
import takeback from '../images/takeback.svg';
import { useContext, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';

import ChessContext from './ChessContext';

function Scoreboard(props) {

    const ctx = useContext(ChessContext);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    const handleFlip = () => {
        if (ctx.color === 'white') {
            ctx.updateColor('black');
        } else {
            ctx.updateColor('white');
        }
    }

    const handleClick = (turn) => {
        if (turn >= 0 || turn <= ctx.gameHistory.length - 1)
        ctx.updateSelectedTurn(turn);
    }

    const handleTakeback = () => {
        if (ctx.gameHistory.length !== 0) {
            ctx.game.undo(); 
            handleClick(ctx.selectedTurn - 1); 
            ctx.gameHistory.pop();
        }
        console.log(ctx.game);
    }

    const createMatchHistory = () => {
        
        let history = ctx.game.history().reduce((result, value, index, array) => {
            if (index % 2 === 0)
              result.push(array.slice(index, index + 2));
            return result;
          }, []).map((move, index) => {
            return (
                <div className='history-move' key={nanoid()}>
	                <div className='turn-number'>{index + 1}</div><div className='history-white-move'>{move[0]}</div><div className='history-black-move'>{move[1]}</div>
                </div>
            );
          })
        return history;
    }

    return(
        <div className='scoreboard'>
            <div className='opponent-name'>
                Opponent
            </div>
            <div className='scoreboard-header'>
                <div className='button-container'>
                    <button onClick={handleFlip}><img className='icon' src={flip} alt='flip board'></img></button>
                    <button onClick={() => {handleClick(0)}}><img className='icon' src={begin} alt='beginning' ></img></button>
                    <button onClick={() => {handleClick(ctx.selectedTurn - 1)}}><img className='icon' src={back} alt='back'></img></button>
                    <button onClick={() => {handleClick(ctx.selectedTurn + 1)}}><img className='icon' src={play} alt='forward'></img></button>
                    <button onClick={() => {handleClick(ctx.gameHistory.length - 1)}}><img className='icon' src={ff} alt='end'></img></button>
                </div>
            </div>
            <div className='scoreboard-body'>
                <div className='match-history'>
                    {createMatchHistory()}
                    <div className='dummy-scroll-div' ref={scrollRef}/>
                </div>

            <div className='control-buttons'>
                <button><img className='icon' src={flag} alt='surrender'></img></button>
                <button onClick={() => {handleTakeback()}} ><img className='icon' src={takeback} alt='takeback'></img></button>
                <button><img className='icon' src={draw} alt='offer draw'></img></button>
            </div>

            </div>
            <div className='scoreboard-footer'>

            </div>
            <div className='player-name'>
                Player
            </div>
        </div>
    );
}

export default Scoreboard;