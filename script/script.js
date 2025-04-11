// Funções globais
function getStorageKey() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? `tasks_${user.email}` : 'tasks';
}

// Verifica se há usuário logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = '../index.html';
    }

    // Verificar tarefas pendentes a cada 24 horas
    setInterval(() => {
        const storageKey = getStorageKey();
        const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
        checkTaskDeadlines(tasks);
    }, 24 * 60 * 60 * 1000); // 24 horas em milissegundos
});

// Função para fazer logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../src/login.html';
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
            const phone = '+55' + document.getElementById('phone').value.replace(/\D/g, '');

            // Obter usuários existentes ou criar array vazio
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Verificar se email já existe
            if (users.some(u => u.email === email)) {
                alert('Este e-mail já está cadastrado!');
                return;
            }

            // Adicionar novo usuário
            users.push({ name, email, password, phone });
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

// Função para enviar notificação via WhatsApp
function sendWhatsAppNotification(task) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.phone) {
        const phone = user.phone.replace(/\D/g, ''); // Remover caracteres não numéricos
        const message = encodeURIComponent(`Lembrete: Sua tarefa "${task.title}" vence amanhã!`);
        const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

        // Abre nova janela e força o envio após 2 segundos
        const newWindow = window.open(whatsappUrl, '_blank');

        // Simula clique no botão de enviar após a página carregar
        setTimeout(() => {
            if (newWindow) {
                newWindow.document.querySelector('button[aria-label="Enviar"]').click();
                setTimeout(() => newWindow.close(), 1000);
            }
        }, 2000);
    }
}

// Função para testar o sistema de mensagens
function testWhatsAppNotification() {
    const testTask = {
        title: 'Tarefa de Teste',
        date: new Date().toISOString().split('T')[0]
    };

    // Simular usuário com telefone cadastrado
    localStorage.setItem('currentUser', JSON.stringify({
        name: 'Usuário Teste',
        email: 'teste@example.com',
        phone: '5511999999999'
    }));

    // Chamar função de notificação
    sendWhatsAppNotification(testTask);

    // Limpar usuário de teste
    localStorage.removeItem('currentUser');

    alert('Teste de notificação via WhatsApp iniciado! Verifique se a mensagem foi enviada.');
}

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

    // Verificar tarefas próximas do vencimento (1 dia antes)
    tasks.forEach(task => {
        const taskDate = new Date(task.date);
        const diffTime = taskDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1 && !task.notified) {
            sendWhatsAppNotification(task);
            task.notified = true;

            const storageKey = getStorageKey();
            const updatedTasks = JSON.parse(localStorage.getItem(storageKey)) || [];
            const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                updatedTasks[taskIndex].notified = true;
                localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
            }
        }
    });
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