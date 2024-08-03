const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(cors());

app.use(express.json());

// Define routes
app.get('/api/tasks', async (req, res) => {
  console.log("Logger -> app.get -> req:", req.query)
  try {
    const userid= req.query.userid
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('userid', userid);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { userid, title, description, status } = req.body;
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ userid, title, description, status }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const { data, error } = await supabase
      .from('tasks')
      .update({ title, description, status })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});