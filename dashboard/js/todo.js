/**
 * TODO List Module for Dashboard
 * Manage tasks with localStorage persistence
 */

import { utils } from './utils.js';

/**
 * TODO list state
 */
const todoState = {
    todos: [],
    filter: 'all' // all, active, completed
};

/**
 * Initialize TODO list
 */
export function initTodoList() {
    // Load from localStorage
    loadTodos();

    // Setup event listeners
    setupEventListeners();

    // Render TODO list
    renderTodos();
}

/**
 * Load todos from localStorage
 */
function loadTodos() {
    try {
        const savedTodos = localStorage.getItem('qute-dashboard-todos');
        if (savedTodos) {
            todoState.todos = JSON.parse(savedTodos);
        } else {
            // Default todos
            todoState.todos = [
                { id: 1, text: 'Complete v2 dashboard implementation', completed: true },
                { id: 2, text: 'Test responsive design', completed: false },
                { id: 3, text: 'Update qutebrowser configuration', completed: false },
                { id: 4, text: 'Test terminal commands', completed: false },
                { id: 5, text: 'Add more features', completed: false }
            ];
            saveTodos();
        }
    } catch (error) {
        console.error('Error loading todos:', error);
        todoState.todos = [];
    }
}

/**
 * Save todos to localStorage
 */
function saveTodos() {
    try {
        localStorage.setItem('qute-dashboard-todos', JSON.stringify(todoState.todos));
    } catch (error) {
        console.error('Error saving todos:', error);
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Add new TODO
    const addTodoInput = document.getElementById('add-todo-input');
    const addTodoButton = document.getElementById('add-todo-button');

    if (addTodoInput && addTodoButton) {
        // Add on button click
        addTodoButton.addEventListener('click', () => {
            const text = addTodoInput.value.trim();
            if (text) {
                addTodo(text);
                addTodoInput.value = '';
            }
        });

        // Add on Enter key
        addTodoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const text = addTodoInput.value.trim();
                if (text) {
                    addTodo(text);
                    addTodoInput.value = '';
                }
            }
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            setFilter(filter);
        });
    });
}

/**
 * Add new TODO
 * @param {string} text - TODO text
 */
function addTodo(text) {
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todoState.todos.unshift(newTodo);
    saveTodos();
    renderTodos();
}

/**
 * Toggle TODO completion
 * @param {number} id - TODO ID
 */
function toggleTodo(id) {
    const todo = todoState.todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

/**
 * Delete TODO
 * @param {number} id - TODO ID
 */
function deleteTodo(id) {
    todoState.todos = todoState.todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

/**
 * Set filter
 * @param {string} filter - Filter type
 */
function setFilter(filter) {
    todoState.filter = filter;

    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        if (button.dataset.filter === filter) {
            button.classList.add('text-yellow-400', 'border-yellow-400');
            button.classList.remove('text-gray-400', 'border-gray-600');
        } else {
            button.classList.remove('text-yellow-400', 'border-yellow-400');
            button.classList.add('text-gray-400', 'border-gray-600');
        }
    });

    renderTodos();
}

/**
 * Get filtered todos
 * @returns {Array} Filtered todos
 */
function getFilteredTodos() {
    switch (todoState.filter) {
        case 'active':
            return todoState.todos.filter(todo => !todo.completed);
        case 'completed':
            return todoState.todos.filter(todo => todo.completed);
        default:
            return todoState.todos;
    }
}

/**
 * Get TODO statistics
 * @returns {Object} Statistics object
 */
function getTodoStats() {
    const total = todoState.todos.length;
    const completed = todoState.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
        total,
        completed,
        active,
        completionRate
    };
}

/**
 * Render TODO list
 */
function renderTodos() {
    const todoList = document.getElementById('todo-list');
    const statsContainer = document.getElementById('todo-stats');

    if (!todoList) return;

    const filteredTodos = getFilteredTodos();
    const stats = getTodoStats();

    // Update statistics
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="text-center">
                <div class="text-2xl font-bold text-yellow-400">${stats.total}</div>
                <div class="text-xs text-gray-400">Total</div>
            </div>
            <div class="text-center border-l border-gray-600 pl-4">
                <div class="text-2xl font-bold text-green-400">${stats.active}</div>
                <div class="text-xs text-gray-400">Active</div>
            </div>
            <div class="text-center border-l border-gray-600 pl-4">
                <div class="text-2xl font-bold text-blue-400">${stats.completed}</div>
                <div class="text-xs text-gray-400">Completed</div>
            </div>
            <div class="text-center border-l border-gray-600 pl-4">
                <div class="text-2xl font-bold text-purple-400">${stats.completionRate}%</div>
                <div class="text-xs text-gray-400">Complete</div>
            </div>
        `;
    }

    // Render TODO items
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                <div class="text-4xl mb-2">📝</div>
                <div>No ${todoState.filter === 'all' ? '' : todoState.filter} todos found</div>
            </div>
        `;
        return;
    }

    todoList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item flex items-center gap-3 p-3 rounded bg-gray-800/50 hover:bg-gray-700/50 transition-colors ${todo.completed ? 'opacity-50' : ''}"
             data-id="${todo.id}">
            <button class="todo-checkbox flex-shrink-0 w-5 h-5 border-2 border-gray-500 rounded flex items-center justify-center hover:border-yellow-400 transition-colors ${todo.completed ? 'bg-green-500 border-green-500' : ''}">
                ${todo.completed ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
            </button>
            <span class="todo-text flex-grow ${todo.completed ? 'line-through text-gray-500' : 'text-gray-200'}">${escapeHtml(todo.text)}</span>
            <button class="todo-delete p-1 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');

    // Add event listeners to new items
    const todoItems = todoList.querySelectorAll('.todo-item');
    todoItems.forEach(item => {
        const id = parseInt(item.dataset.id);
        const checkbox = item.querySelector('.todo-checkbox');
        const deleteBtn = item.querySelector('.todo-delete');
        const textSpan = item.querySelector('.todo-text');

        // Toggle on checkbox click
        checkbox.addEventListener('click', () => {
            toggleTodo(id);
        });

        // Toggle on text click
        textSpan.addEventListener('click', () => {
            toggleTodo(id);
        });

        // Delete button
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(id);
        });

        // Show delete button on hover
        item.addEventListener('mouseenter', () => {
            deleteBtn.classList.remove('opacity-0');
        });
        item.addEventListener('mouseleave', () => {
            deleteBtn.classList.add('opacity-0');
        });
    });
}

/**
 * Escape HTML for text content
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Clear all completed todos
 */
function clearCompleted() {
    todoState.todos = todoState.todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

/**
 * Get all todos
 * @returns {Array} All todos
 */
export function getAllTodos() {
    return [...todoState.todos];
}

/**
 * Get todo by ID
 * @param {number} id - TODO ID
 * @returns {Object|null} TODO object or null
 */
export function getTodoById(id) {
    return todoState.todos.find(todo => todo.id === id) || null;
}

/**
 * Update TODO
 * @param {number} id - TODO ID
 * @param {Object} updates - Updates to apply
 */
export function updateTodo(id, updates) {
    const todo = todoState.todos.find(todo => todo.id === id);
    if (todo) {
        Object.assign(todo, updates);
        saveTodos();
        renderTodos();
    }
}

/**
 * Delete TODO by ID
 * @param {number} id - TODO ID
 */
export function deleteTodoById(id) {
    todoState.todos = todoState.todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

/**
 * Get todo statistics
 * @returns {Object} Statistics object
 */
export function getTodoStats() {
    return getTodoStats();
}

// Initialize TODO list when module is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTodoList);
} else {
    initTodoList();
}
