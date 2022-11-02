import { createStored, bindChildren, bindInputValue, bindDom, bindClasses, html } from 'sprinkle-js';
import autoAnimate from '@formkit/auto-animate';

type Todo = {
    id: string;
    task: string;
    completed: boolean;
};

type TodoStore = {
    todos: Todo[],
    newTodo: string;
};

const todoStore = createStored<TodoStore>('sprinkle-todos', { todos: [], newTodo: '' });

const form = document.getElementById('new-todo');

form?.addEventListener('submit', (e) => {
    e.preventDefault();
    todoStore.todos = [...todoStore.todos, {
        id: Math.random().toString(16).substring(2),
        task: todoStore.newTodo,
        completed: false,
    }];
    todoStore.newTodo = '';
});

bindInputValue('.new-todo-input', () => todoStore.newTodo)
    .addEventListener('input', (e:Event) => { todoStore.newTodo = (e.target as HTMLInputElement).value; });

bindDom<HTMLInputElement>('.new-todo-send', () => ({
    disabled: !todoStore.newTodo,
}));

const ul = bindChildren('#todos', () => html`${todoStore.todos.map((todo:Todo) => html`
<li on:bind=${(li:HTMLLIElement) => {
          bindClasses(li, () => ({
          todo: true,
          completed: todo.completed,
        }));
        }}
    key="${todo.id}">
    <button on:click=${() => {
          todo.completed = !todo.completed;
        }} key="${todo.id}-complete" class="complete">${todo.task}</button>
    <button on:click=${() => {
          const toUpdate = todoStore.todos.filter((todoEl:Todo) => todoEl.id !== todo.id);
          todoStore.todos = toUpdate;
        }} key="${todo.id}-delete" class="delete">❌</button>
</li>`)}`);

autoAnimate(ul as HTMLElement);
