import { useContext, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import ChessContext from './ChessContext';
import useSound from 'use-sound';
import Chess from 'chess.js'

import move from '../sounds/Move.ogg';
import capture from '../sounds/Capture.ogg';
import defeat from '../sounds/Defeat.ogg';

function Board(props) {

    const [game, setGame] = useState(new Chess());

    const [moveSFX] = useSound(move);
    const [captureSFX] = useSound(capture);
    const [defeatSFX] = useSound(defeat);

    const ctx = useContext(ChessContext);

    const [position, setPosition] = useState();
    const [gameOver, setGameOver] = useState();
    const [currentTurn, setCurrentTurn] = useState();
    const [color, setColor] = useState();
    
    useEffect(() => { /** Set up the board based on whatever game the server currently has */

        // const UUID = JSON.parse(localStorage.getItem('UUID'));

        fetch("/setup", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color: 'white', difficulty: 0 })
        })
        .then(res => res.json())
        .then(json => {
          console.log(json);
          localStorage.setItem('UUID', JSON.stringify({ id: json.id }))
          setPosition(json.position);
        });

    }, []);

    function safeGameMutate(modify) {
        setGame((g) => {
          const update = { ...g };
          modify(update);
          return update;
        });
      }

    function onDrop(sourceSquare, targetSquare) {
        let move = null;
        safeGameMutate((game) => {
          move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
          });
        });
        if (move === null) return false; // illegal move

        const BODY = { id: JSON.parse(localStorage.getItem('UUID')).id, move: move};
        
        // Make move
        fetch("/move", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(BODY)
        })
        .then(res => res.json())
        .then(json => {
          setPosition(json.fen);
          //setGame(...game);
          console.log(game)
        });
        
        if (color != currentTurn) {
          // Get AI move
          fetch("/ai-move", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(BODY)
          })
          .then(res => res.json())
          .then(json => {
          setPosition(json.fen);
          //setGame(...game);
          console.log(game)
          });
        }
        


// TODO: use setGame to make sure turns are handled properly

        return true;
      }

    return (
        <div className='board'> 
            <Chessboard 
            boardWidth={800}
            className='board'
            id='mainboard'
            boardOrientation={ctx.color}
            position={position}
            onPieceDrop={onDrop}
            animationDuration={0}
            arePiecesDraggable={!gameOver}
            />
            <div className='fen-string'>{ctx.gameHistory[ctx.selectedTurn].fen}</div>
            <div className='fen-copy-button'><button onClick={() => {navigator.clipboard.writeText(ctx.gameHistory[ctx.selectedTurn].fen)}}>Copy FEN String</button></div>
        </div>
        
    );
}

export default Board;