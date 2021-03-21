import './App.css';
import CreateTask from './components/CreateTask';
import TaskList from './components/TaskList';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App container">
      <Router>
        <Switch>
          <Route exact path='/' component={TaskList} />
          <Route path='/create-task/:id' component={CreateTask} />
          <Route path='/create-task' component={CreateTask} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
