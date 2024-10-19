document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const taskForm = document.getElementById('taskForm');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();

                if (res.status === 200) {
                    window.location.href = '/table.html'; // Redirect to the tasks table page
                } else {
                    errorMessage.textContent = data.message;
                }
            } catch (err) {
                errorMessage.textContent = 'An error occurred. Please try again.';
                console.error(err);
            }
        });
    }

    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const userId = sessionStorage.getItem('userId'); // Retrieve user ID

            console.log('Creating task:', { title, description, user: userId });

            if (!userId) {
                alert('User ID is required. Please log in again.');
                return;
            }

            try {
                const res = await fetch('/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description, user: userId })
                });

                console.log('Response Status:', res.status);
                
                if (res.status === 201) {
                    console.log('Task created successfully.');
                    window.location.href = '/table.html'; // Redirect to the tasks table page after successful submission
                } else {
                    const errorResponse = await res.json();
                    alert('Error adding task: ' + errorResponse.error);
                    console.error('Error response:', errorResponse);
                }
            } catch (err) {
                alert('An error occurred. Please try again.');
                console.error('Fetch error:', err);
            }
        });
    }

    // Function to fetch and display tasks
    const displayTasks = async () => {
        try {
            const res = await fetch('/tasks'); // Fetch tasks from the server
            console.log('Fetching tasks, response status:', res.status);

            if (!res.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const tasks = await res.json();
            console.log('Fetched tasks:', tasks);
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Clear existing tasks

            tasks.forEach(task => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td>${task.user}</td>
                    <td>${task.status || 'Pending'}</td> <!-- Default status -->
                `;
                taskList.appendChild(row);
            });
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    // Call displayTasks if we're on the table.html page
    if (document.title === "Your Tasks") {
        displayTasks();
    }
});
