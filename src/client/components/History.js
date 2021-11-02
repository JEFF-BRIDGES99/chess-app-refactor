import Game from './Game';

function History() {
    
    function lookup(history) {
        fetch("/retrieve-game", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => console.log(json));
    }   

    function getServerGame() {
       fetch("/current-game", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => console.log(json));
    } 

    return (
        <div className="history">
            <div className="game-lookup-container">
                <Game color="white"/>
            </div>
            <button onClick={() => lookup('example')}>Lookup game</button>
            <button onClick={() => getServerGame()}>Get server's current game</button>
        </div>
    );
}

export default History;