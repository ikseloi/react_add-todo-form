import './App.scss';
import { useState } from 'react';

import { TodoList } from './components/TodoList';

import type { Todo } from './types/Todo';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>(() =>
    todosFromServer.map(todo => ({
      ...todo,
      user:
        usersFromServer.find(serverUser => serverUser.id === todo.userId) ??
        null,
    })),
  );

  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(0);

  const [titleError, setTitleError] = useState(false);
  const [userError, setUserError] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const isValidTitle = title.trim() !== '';
    const isValidUser = userId !== 0;

    setTitleError(!isValidTitle);
    setUserError(!isValidUser);

    if (!isValidTitle || !isValidUser) {
      return;
    }

    const selectUser = usersFromServer.find(user => user.id === userId) ?? null;

    const newTodoId = Math.max(0, ...todos.map(todo => todo.id)) + 1;
    const newTodo: Todo = {
      id: newTodoId,
      title: title.trim(),
      userId,
      completed: false,
      user: selectUser,
    };

    setTodos(previousTodos => [...previousTodos, newTodo]);
    setTitle('');
    setUserId(0);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            placeholder="Enter a title"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
              setTitleError(false);
            }}
          />
          {titleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <select
            value={userId}
            data-cy="userSelect"
            onChange={event => {
              setUserId(Number(event.target.value));
              setUserError(false);
            }}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {userError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
