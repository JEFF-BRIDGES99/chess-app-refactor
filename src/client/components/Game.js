import Board from './Board';
import Navbar from './Navbar';
// import Sidebar from './Sidebar';
import Scoreboard from './Scoreboard';
import ChessContext from './ChessContext';

import '../css/App.css';
import { useState } from 'react';
import Chess from 'chess.js';



function Game(props) {

    // Initialize game
    const [game, setGame] = useState(new Chess());
    const [gameHistory, setGameHistory] = useState([{fen: game.fen(), score: 0}]);

    // Start as a random color
    const [color, setColor] = useState();
    const [selectedTurn, setSelectedTurn] = useState(0);

    const score = (fen) => {
        let score = 0;
        const fenArray = fen.split('/');
        fenArray[7] = fenArray[7].split(' ')[0];
        for (let i = 0; i < fenArray.length; i++) {
            for (let j = 0; j < fenArray[i].length; j++) {
                switch (fenArray[i].charAt(j)) {
                    case 'p':
                        score -= 1;
                        break;
                    case 'r':
                        score -= 5;
                        break;
                    case 'n':
                        score -= 3;
                        break;
                    case 'b':
                        score -= 3;
                        break;
                    case 'q':
                        score -= 9;
                        break;
                    case 'P':
                        score += 1;
                        break;
                    case 'R':
                        score += 5;
                        break;
                    case 'N':
                        score += 3;
                        break;
                    case 'B':
                        score += 3;
                        break;
                    case 'Q':
                        score += 9;
                        break;
                    default:
                        break;
                }
            }
        }
        return score;
    };

    // TODO: add a match history browser

    // TODO: fix undo bug

    const postGameToServer = async (data) => {
        fetch("/post-game", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.statusCode);
    }

    const updateGame = (g) => {
        setGame(g);
    }

    const updateGameHistory = (g) => {
        if (gameHistory[gameHistory.length - 1] === g) return;
        let newHistory = gameHistory;
        newHistory.push({fen: g, score: score(g)});
        setGameHistory(newHistory);
    }

    const updateColor = (color) => {
        setColor(color);
    }

    const updateSelectedTurn = (turn) => {
        if (0 <= turn && turn <= gameHistory.length - 1) {
            setSelectedTurn(turn);
        }
    }
    
    const globals = {
        game: game,
        color: color,
        gameHistory: gameHistory,
        selectedTurn: selectedTurn,
        updateGame,
        updateColor,
        updateGameHistory,
        updateSelectedTurn,
    };

    return (
        <ChessContext.Provider value={globals}>
            <div className="game">
                <Navbar/>
                <div className='main-container'>
                    <Board score={score} game={gameHistory[selectedTurn]} postGame={postGameToServer}/>
                    <Scoreboard/>
                </div>
            </div>
        </ChessContext.Provider>
    );
}

export default Game;
