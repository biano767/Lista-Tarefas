// Funções globais
function getStorageKey() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? `tasks_${user.email}` : 'tasks';
}
const USER_KEY = 'currentUser';

// Alternar visibilidade da senha
document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.querySelectorAll('.toggle-password');

    togglePassword.forEach(icon => {
        icon.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Redirecionamento para cadastro
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }

    // Cadastro de usuário
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Obter usuários existentes ou criar array vazio
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Verificar se email já existe
            if (users.some(u => u.email === email)) {
                alert('Este e-mail já está cadastrado!');
                return;
            }

            // Adicionar novo usuário
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));

            // Mostrar mensagem de sucesso e redirecionar
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        });
    }

    // Redirecionamento para login
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }

    // Verificação de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Obter usuários cadastrados do localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Verificar se existe um usuário com o email e senha fornecidos
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Salvar usuário atual no localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('E-mail ou senha incorretos. Por favor, tente novamente.');
            }
        });
    }

    // Manipulação de tarefas
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const title = document.getElementById('taskTitle').value;
            const date = document.getElementById('taskDate').value;
            const priority = document.querySelector('input[name="priority"]:checked').value;

            addTask(title, date, priority);

            this.reset();
            document.querySelector('input[name="priority"][value="high"]').checked = true;
        });
        loadTasks();
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem(USER_KEY);
            window.location.href = 'login.html';
        });
    }
});

// Funções para manipulação de tarefas
function addTask(title, date, priority) {
    if (!title || !date) return;

    const storageKey = getStorageKey();
    const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
    tasks.push({
        id: Date.now(),
        title,
        date,
        priority,
        completed: false,
        paid: false,
        archived: false
    });
    localStorage.setItem(storageKey, JSON.stringify(tasks));

    document.getElementById('taskForm').reset();
    loadTasks();
}

function payTask(index) {
    const storageKey = getStorageKey();
    const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (tasks[index]) {
        tasks[index].paid = !tasks[index].paid; // Alterna entre pago/não pago
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        loadTasks();
    }
}

function archiveTask(index) {
    const storageKey = getStorageKey();
    const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
    tasks[index].archived = !tasks[index].archived;
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    loadTasks();
}

function editTask(index) {
    const storageKey = getStorageKey();
    const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
    const newTitle = prompt('Novo título:', tasks[index].title);
    const newDate = prompt('Nova data:', tasks[index].date);

    if (newTitle && newDate) {
        tasks[index].title = newTitle;
        tasks[index].date = newDate;
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        loadTasks();
    }
}

function deleteTask(index) {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
        const storageKey = getStorageKey();
        const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
        tasks.splice(index, 1);
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        loadTasks();
    }
}

function checkTaskDeadlines(tasks) {
    const now = new Date();
    const alarmSound = new Audio('./assets/alert.mp3');
    alarmSound.load();

    tasks.forEach(task => {
        if (task.paid) return;

        const taskDate = new Date(task.date);
        const diffTime = taskDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 2 && diffDays >= 0) {
            alarmSound.play();
            alert(`ATENÇÃO: A tarefa "${task.title}" vence em ${diffDays} dias!`);
        }
    });
}

function loadTasks() {
    const tasksContainer = document.getElementById('tasksContainer');
    const storageKey = getStorageKey();
    const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];

    checkTaskDeadlines(tasks);

    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<p class="empty-message">Nenhuma tarefa cadastrada</p>';
        return;
    }

    tasksContainer.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.dataset.id = task.id;

        const titleElement = document.createElement('span');
        titleElement.className = `task-${task.priority}`;
        titleElement.textContent = task.title;

        taskElement.innerHTML = `
            <div class="task-info">
                <h3 class="task-title">${titleElement.outerHTML}</h3>
                <p class="task-date">${task.date}</p>
                ${task.paid ? '<span class="paid-badge">Pago</span>' : ''}
            </div>
            <div class="task-actions">
                <button class="pay-btn" onclick="payTask(${index})">Pagar</button>
                <button class="edit-btn" onclick="editTask(${index})">Modificar</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Deletar</button>
            </div>
        `;
        tasksContainer.appendChild(taskElement);
    });
}