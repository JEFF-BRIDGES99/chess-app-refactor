import { Switch, Route } from 'react-router-dom';

import Homepage from './Homepage'
import Game from './Game'
import History from './History'

function App() {
    return (
        <div className="app">
            <Switch>
                <Route path="/" component={Homepage} exact></Route>
                <Route path="/game" component={Game} exact></Route>
                <Route path="/history" component={History} exact></Route>
            </Switch>
        </div>
    );
}

export default App;