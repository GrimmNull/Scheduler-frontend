import './App.css';
import Task from './components/Task.js'

function App() {
    let nrOfTasks=0
    return (
        <div className="App">
            <Task
                taskId={nrOfTasks++}
                initialState={false}
                title='Finish the project'
                description='Just do the frontend they said, it will be fun they said'/>
            <Task
                taskId={nrOfTasks++}
                initialState={false}
                title={'Not kill yourself'}
                description={'It do be hard tho'} />
        </div>
    );
}

export default App;
