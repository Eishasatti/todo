import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, setTodo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, []);

  const toggleFinished = (e) => {
    setShowFinished(!showFinished);
  }

  const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id);
    setTodo(t[0].todo);
    setDeadline(t[0].deadline);
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLocalStorage();
  }

  const handleChange = (e) => {
    setTodo(e.target.value);
  }

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
  }

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLocalStorage();
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => item.id === id);
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLocalStorage();
  }

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, deadline, isCompleted: false }]);
    setTodo('');
    setDeadline('');
    saveToLocalStorage();
  }

  const isDeadlinePassed = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    return currentDate > deadlineDate;
  }

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-300 min-h-[80vh] md:w-1/2">
        <h1 className='font-bold text-center text-4xl'>iTASK-Manage your todos at one place</h1>
        <div className="addtodo my-5 flex gap-4 flex-col">
          <h2 className='text-2xl font-bold'>Add a TODO</h2>
          <div className="flex flex-col ">
            <input onChange={handleChange} value={todo} type='text' className='w-full rounded-full m-2 px-5 py-1' placeholder='Enter your todo' />
            <h4>Enter  Deadline</h4>
            <input onChange={handleDeadlineChange} value={deadline} type='date' className='rounded-full w-full m-2 px-5 py-1' />
            <button onClick={handleAdd} disabled={todo.length <= 3 || !deadline} className='bg-violet-800 hover:bg-violet-950 disabled:bg-violet-400 p-4 py-2 text-white m-2 w-full rounded-md'>SAVE</button>
          </div>
        </div>
        <label className='my-4 py-2'>
          <input onChange={toggleFinished} type='checkbox' checked={showFinished} /> Show Finished
        </label>
        <div className='h-[1px] my-2 opacity-25 bg-black'></div>
        <h2 className="text-2xl font-bold">Your Todo's</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No todos to display</div>}
          {todos.map(item => (
            (showFinished || !item.isCompleted) &&
            <div key={item.id} className="todo flex my-3 justify-between">
              <div className='flex gap-5'>
                <input onChange={handleCheckbox} type='checkbox' checked={item.isCompleted} name={item.id} id='' />
                <div className={item.isCompleted ? "line-through" : ""}>
                  {item.todo} (Deadline: {item.deadline})
                </div>
              </div>
              <div className="buttons flex h-full">
                <button disabled={item.isCompleted || isDeadlinePassed(item.deadline)} onClick={(e) => { handleEdit(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-white rounded-lg mx-1'><BiEdit /></button>
                <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-white rounded-lg mx-1'><MdDelete /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App;
