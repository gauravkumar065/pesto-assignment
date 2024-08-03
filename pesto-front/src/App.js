import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Navigate } from 'react-router-dom';
import './App.css';


const App = () => {
  const [session , setSession] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [filter, setFilter] = useState('All');

  
  useEffect(()=>{
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("Logger -> fetchUser -> user:", data.session);
        setSession(null);
      } else {
        setSession(data.session);
      }
    };

    fetchSession();
  },[])

  if (session === undefined) {
    // Session is still being fetched
    return <div>Loading...</div>;
  }

  if (session === null) {
    // User is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  const addTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, { id: Date.now(), title, description, status }]);
    setTitle('');
    setDescription('');
    setStatus('To Do');
  };

  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

    const Header = () => {
      return (
        <header className="header">
          <img src="" alt="Company Logo" className="logo" />
          <div className="user-section">
            <span className="user-name">{session.user.user_metadata.full_name}</span>
            <button className="logout-button" onClick={onLogout}>Logout</button>
          </div>
        </header>
      );
    };

    const onLogout = async()=>{
      const { error } = await supabase.auth.signOut()
      window.location.reload();
      if (!error) {
        return <Navigate to="/login" replace />;
      }
    }
    
  return (
    <div>
     <Header/>
    <div className="App">
      <h1>Task Manager</h1>
      
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      <div>
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id} data-status={task.status}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <select
              value={task.status}
              onChange={(e) => updateStatus(task.id, e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default App