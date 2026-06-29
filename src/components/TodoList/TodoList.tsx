import type { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
};

export const TodoList = ({ todos }: Props) => (
  <section>
    {todos.map(todo => (
      <TodoInfo key={todo.id} todo={todo} data-id={todo.id} />
    ))}
  </section>
);
