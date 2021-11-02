const express = require("express");
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const { Chess } = require('chess.js');
const { v4 } = require('uuid');

const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const GAMES = [];

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, '../build')));
app.use(express.json());

// Runs when a user makes a move in their game
app.post('/move', (req, res) => {
    console.log('/move');

    const UUID = req.body.id;
    const MOVE = req.body.move;

    const MATCH = GAMES.filter(obj => {
        return obj.id === UUID;
    });

    const SESSION = MATCH[0];

    SESSION.game.move(MOVE);

    res.json({ fen: SESSION.game.fen() });
});

app.post('/ai-move', (req, res) => {
    console.log('/ai-move');

    const UUID = req.body.id;

    const MATCH = GAMES.filter(obj => {
        return obj.id === UUID;
    });

    const SESSION = MATCH[0];
    var move;

    switch (SESSION.difficulty) {
        case 0: // Random moves: very weak
            const moves = SESSION.game.moves();
            move = moves[Math.floor(Math.random() * moves.length)];
            SESSION.game.move(move);
            break;
    }

    res.json({ fen: SESSION.game.fen() });
});

// Runs when a user creates a new game
app.post('/setup', (req, res) => {
    console.log('/setup');
    const UUID = v4();
    const COLOR = req.body.color;
    const DIFFICULTY = req.body.difficulty;

    GAMES.push({game: new Chess(), id: UUID, color: COLOR, difficulty: DIFFICULTY});
    res.json({ position: startFEN, id: UUID });
});

// Runs when a user looks up a game in the hstory browser
app.get('/lookup', (req, res) => {
    console.log('/lookup');
    // Respond with all games matching that history
});

app.get('/debug', (req, res) => {
    console.log('/debug');
    // Dump contents of all games
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});