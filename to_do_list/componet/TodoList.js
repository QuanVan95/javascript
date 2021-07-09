import html from '../core.js'
import TodoItem from './TodoItem.js'

function TodoList() {
    return html`
            <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
                ${TodoItem()}
            </ul>
            </section>
           `
}

export default TodoList



