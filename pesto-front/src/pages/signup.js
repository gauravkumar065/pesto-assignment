// src/pages/Signup.js
import React from 'react'
import { supabase } from '../supabase'

const Signup = () => {
  const handleGithubSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing up with Github:', error.message)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.title}>Sign Up</h1>
        <button onClick={handleGithubSignup} style={styles.button}>
          Sign Up with Github
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
  },
  form: {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
}

export default Signup