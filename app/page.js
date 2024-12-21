'use client'

import { useRef, useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState(''); 
  const [list, setList] = useState([]); 
  const [editIndex, setEditIndex] = useState(null);
  const inputBox = useRef(); 

  useEffect(() => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem('mytodo')) || [];
      setList(storedTodos);
    } catch (error) {
      console.error("Failed to load todos from localStorage", error);
      setList([]);
    }
  }, []);

  function handleInput(e) {
    e.preventDefault();
    if (!input) return alert("Please enter a task");

    const normalizedInput = input.trim().toLowerCase();
    if (editIndex !== null) {
      const updatedList = list.map((item, index) => 
        index === editIndex ? { ...item, task: input } : item
      );
      setList(updatedList);
      localStorage.setItem('mytodo', JSON.stringify(updatedList));
     
    } else {
      if (list.some(item => item.task.toLowerCase() === normalizedInput)) {
        alert("The Todo is already in the list");
      } else {
        const newTask = { task: input, completed: false };
        const updatedList = [...list, newTask];
        setList(updatedList);
        localStorage.setItem('mytodo', JSON.stringify(updatedList));
      }
    }
    setInput('');
    inputBox.current.focus();
  }

  function handleClearAllTask(){
    localStorage.clear() ; 
  }

  function deleteItem(index) {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    localStorage.setItem('mytodo', JSON.stringify(updatedList));
  }

  function toggleComplete(index) {
    const updatedList = list.map((item, i) => 
      i === index ? { ...item, completed: !item.completed } : item
    );
    setList(updatedList);
    localStorage.setItem('mytodo', JSON.stringify(updatedList));
  }

  return (
    <div className="flex justify-center flex-col items-center gap-20">
      <h1 className="text-2xl">Todo List App</h1>
      
      <div className="flex gap-5">
        <input 
          ref={inputBox}
          className="text-black outline-none rounded" 
          type="text" 
          placeholder="Input your Task" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="absolute right-0 top-0 p-10 " onClick={handleClearAllTask}>
          Clear All task
        </button>
        <button 
          className="bg-slate-300 py-1 px-2 rounded text-black" 
          type="button" 
          onClick={handleInput}
        >{editIndex !== null ? 'Update' : 'Submit'}</button>
      </div>

      <ul className="text-xl">
        {list.map((item, index) => (
          <li key={index} className="flex justify-between items-center gap-10">
            <span className={item.completed ? "line-through" : ""}>{index + 1}. {item.task}</span>
            <div className="flex gap-4 mt-5">
              <button 
                onClick={() => toggleComplete(index)} 
                className="bg-green-400 px-2 py-1 rounded text-white"
              >{item.completed ? 'Undo' : 'Complete'}</button>
          
              <button 
                onClick={() => deleteItem(index)} 
                className="bg-red-400 px-2 py-1 rounded text-white"
              >Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
