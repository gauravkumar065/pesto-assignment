import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Navigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';


const App = () => {
  const [session , setSession] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [filter, setFilter] = useState('All');
  const API_URL = 'http://localhost:3000/api';

  
  useEffect(()=>{
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setSession(null);
      } else {
        setSession(data.session);
      }
    };

    fetchSession();
  },[])

  useEffect(()=>{
    if(session){
      const fetchData = async () => {
        const { data } = await axios.get(`${API_URL}/tasks`, {params: {
          userid: session.user.id,      // Example parameter
        }});
         if(data){
          setTasks([...data]);
         }
      };
      fetchData();
    }
  },[session])
  if (session === undefined) {
    // Session is still being fetched
    return <div>Loading...</div>;
  }

  if (session === null) {
    // User is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        userid: session.user.id,
        title,
        description,
        status
      });
      setTasks([...tasks, response.data.data[0]]);
      setTitle('');
      setDescription('');
      setStatus('To Do');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
      // Handle error
    }
  };
  
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      // Handle error
    }
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