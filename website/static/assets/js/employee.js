window.onload = function() {
    let employees = [];
    let currentPage = 1;
    let table_data = [];
    const employeesPerPage = 10;


    // Event listener for filter modal close
    // document.getElementById('filterModal').addEventListener('hidden.bs.modal', () => {
    //     applyFilters();
    // });


    
        // Event listener for creation date ascending button
        document.getElementById('creation_date_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date));
            renderEmployees();
        });

        // Event listener for creation date descending button
        document.getElementById('creation_date_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
            renderEmployees();
        });

        // Event listener for id ascending button
        document.getElementById('id_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.id - b.id);
            renderEmployees();
        });

        // Event listener for id descending button
        document.getElementById('id_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.id - a.id);
            renderEmployees();
        });

        // envnt listener for salary ascending button
        document.getElementById('salary_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.salary - b.salary);
            renderEmployees();
        });

        // Event listener for salary descending button
        document.getElementById('salary_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.salary - a.salary);
            renderEmployees();
        });

        // Event listener for rating ascending button
        document.getElementById('rating_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.rating - b.rating);
            renderEmployees();
        });

        // Event listener for rating descending button
        document.getElementById('rating_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.rating - a.rating);
            renderEmployees();
        });

        // Event listener for department ascending button
        document.getElementById('department_id_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.department_id - b.department_id);
            renderEmployees();
        });

        // Event listener for department descending button
        document.getElementById('department_id_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.department_id - a.department_id);
            renderEmployees();
        });


    document.getElementById('filterForm').addEventListener('submit', (event) => {
        event.preventDefault();

        applyFilters();
        document.getElementById('filterForm').reset();
    });

    // make the form reset when the modal is closed
    document.getElementById('employeeModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('employeeForm').reset();
    });
    document.getElementById('reset-employee-filter').addEventListener('click', () => {
        document.getElementById('filterForm').reset();
        applyFilters();
    });
    
    const getTimeString = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Apply filters
    function applyFilters() {
        const filterName = document.getElementById('filterName').value.trim();
        const filterEmail = document.getElementById('filterEmail').value.trim();
        const filterRating = document.getElementById('filterRating').value;
        const filterSalary = document.getElementById('filterSalary').value;
        const filterDepartment = document.getElementById('filterDepartment').value;
        const filterStartCreationDate = document.getElementById('filterStartCreationDate').value;
        const filterEndCreationDate = document.getElementById('filterEndCreationDate').value;
        const filterStartTime = document.getElementById('filterStartTime').value;
        const filterEndTime = document.getElementById('filterEndTime').value;


        table_data = employees.filter(employee => {
            let match = true;

            if (filterName && !employee.first_name.toLowerCase().includes(filterName.toLowerCase()) && !employee.last_name.toLowerCase().includes(filterName.toLowerCase())) {
                match = false;
            }

            if (filterEmail && !employee.email.toLowerCase().includes(filterEmail.toLowerCase())) {
                match = false;
            }

    

            if (filterRating && employee.rating != filterRating) {
                match = false;
            }

            if (filterSalary && employee.salary != filterSalary) {
                match = false;
            }

            if (filterDepartment && employee.department_id != filterDepartment) {
                match = false;
            }
            
            if (filterStartCreationDate && new Date(employee.creation_date) < new Date(filterStartCreationDate)) {

                match = false;
            }
            
            if (filterEndCreationDate && new Date(employee.creation_date) > new Date(`${filterEndCreationDate}T23:59:59`)) {
                console.log(new Date(employee.creation_date));
                console.log(new Date(`${filterEndCreationDate}T23:59:59`));
                match = false;
            }
            console.log(filterStartTime);
            if (filterStartTime && getTimeString(new Date(employee.creation_date)) < filterStartTime) {
                console.log(filterStartTime);
                console.log(getTimeString(new Date(employee.creation_date)));
                match = false;
            }
            
            if (filterEndTime && getTimeString(new Date(employee.creation_date)) > filterEndTime) {
                match = false;
            }

            return match;
        });
        
        currentPage = 1;
        renderEmployees();
    

        // Close the modal
        const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
        filterModal.hide();
    }



    // Function to fetch employees from the server
    function fetchEmployees() {
        fetch('/api/employees')
            .then(response => response.json())
            .then(data => {
                console.log('Employees data:', data);
                employees = data;
                table_data = data;
                renderEmployees();
            })
            .catch(error => console.error('Error fetching employees:', error));
    }

    // Function to render employees in the table
    function renderEmployees() {
        const tableBody = document.getElementById('employees-table-body');
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * employeesPerPage;
        const endIndex = startIndex + employeesPerPage;
        const pageEmployees = table_data.slice(startIndex, endIndex);
        pageEmployees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="employeeId" style="color: white;">${employee.id}</td>
                <td class="employeeName" style="color: white;">${employee.first_name} ${employee.last_name}</td>
                <td class="employeeEmail" style="color: white;">${employee.email}</td>
                <td class="creationDate" style="color: white;">${employee.creation_date}</td>
                <td class="employeeRating" style="color: white;">${employee.rating}</td>
                <td class="employeeSalary" style="color: white;">${employee.salary}</td>
                <td class="departmentId" style="color: white;">${employee.department_id}</td>
                <td class="text-center align-middle">
                    <a class="btn btnMaterial btn-flat primary semicircle" role="button" href="/manager_employee/${employee.id}" style="color: #00bdff;"><i class="far fa-eye"></i></a>
                    <a class="btn btnMaterial btn-flat success semicircle edit_employee" role="button"><i class="fas fa-pen"></i></a>
                    <a class="delete_emp_btn btn btnMaterial btn-flat accent btnNoBorders checkboxHover" role="button" data-bs-toggle="modal" data-bs-target="#delete-modal" href="#"><i class="fas fa-trash" style="color: #DC3545;"></i></a>
                </td>
            `;

            tableBody.appendChild(row);
        });


        // Delete employee
    const delete_emp_btn = document.querySelectorAll('.delete_emp_btn');

    delete_emp_btn.forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const employeeId = row.querySelector('.employeeId').textContent;

            // Get other employee data from the row
            document.getElementById('id').value = employeeId;
            document.getElementById('action').value = 'delete';

            const form = document.getElementById('employeeForm');
            const formData = new FormData(form);

            // Send data to server using fetch
            fetch('/employee_process', {
                method: 'POST',
                body: formData
            }).then(response => response.text())
            .then(responseText => {
                if (responseText === 'success' ){
                    // Handle successful form submission
                    // Remove the deleted employee from the table_data array
                    employees = employees.filter(employee => employee.id != employeeId);
                    // Re-render the employees
                    table_data = employees;
                    renderEmployees();
                } else {
                    // Handle form submission error
                    if (responseText === 'delete') {
                    alert('Employee cannot be deleted due to key constraint');
                    } else {
                        console.error('Form submission failed.');
                        alert('Employee cannot be deleted due to key constraint');
                    }
                }
            })
            .catch(error => {
                // Handle network error
                console.error('Network error:', error);
            });
        });
    });
    console.log("code is running");
    // Edit employee


    const add_new_employee = document.getElementById('new_emp_btn');
    add_new_employee.addEventListener('click', () => {
        document.getElementById('action').value = 'add';
    });

    const editBtns = document.querySelectorAll('.edit_employee');

    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Edit button clicked');
            const row = btn.closest('tr');
            const employeeId = row.querySelector('.employeeId').textContent;
            const name = row.querySelector('.employeeName').textContent;
            let first_name = name.split(' ');
            let last_name = first_name[1];
            first_name = first_name[0];
            const email = row.querySelector('.employeeEmail').textContent;
            const salary = row.querySelector('.employeeSalary').textContent;
            const department_id = row.querySelector('.departmentId').textContent;
            const rating = row.querySelector('.employeeRating').textContent;

            // Get other employee data from the row
            document.getElementById('id').value = employeeId;
            document.getElementById('action').value = 'edit';
            document.getElementById('first_name').value = first_name;
            document.getElementById('last_name').value = last_name;
            document.getElementById('email').value = email;
            document.getElementById('salary').value = salary;
            document.getElementById('department_id').value = department_id;
            document.getElementById('rating').value = rating;


            // Set other form fields with employee data
            const modal = new bootstrap.Modal(document.getElementById('employeeModal'));
            document.getElementById('employeeModalLabel').textContent = 'Edit Employee';
            modal.show();
        });
    });






        renderPagination();






    }

    // Function to render pagination buttons
    function renderPagination() {
        let totalPages = Math.ceil(table_data.length / employeesPerPage);
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');

        if (currentPage > 1) {
            prevButton.style.display = 'inline-block';
        } else {
            prevButton.style.display = 'none';
        }

        if (currentPage < totalPages) {
            nextButton.style.display = 'inline-block';
        } else {
            nextButton.style.display = 'none';
        }
    }

    // Fetch employees when the page loads
    fetchEmployees();

    // Event listeners for pagination buttons
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.addEventListener('click', () => {
        currentPage--;
        renderEmployees();
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        renderEmployees();
    });

    



    // Add new employee
    const form = document.getElementById('employeeForm');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(form);
        // Validate form data
        const action = formData.get('action');
        const email = formData.get('email');
        const salary = formData.get('salary');
        const rating = formData.get('rating');
        const department_id = formData.get('department_id');
        const password = formData.get('password');
        const first_name = formData.get('first_name');
        const last_name = formData.get('last_name');
        if (action !== 'edit' && !password) {
            alert('Please fill in all the required fields.');
            return;
        }
        if (!email || !salary || !rating || !department_id  || !first_name || !last_name) {
            alert('Please fill in all the required fields.');
            return;
        }
        
        if (isNaN(salary) || isNaN(rating)) {
            alert('Salary and rating must be numeric values.');
            return;
        }
        
        if (rating < 1 || rating > 5) {
            alert('Rating must be between 1 and 5.');
            return;
        }
        
        if (salary <= 0) {
            alert('Salary must be a positive number.');
            return;
        }

        // Send data to server using fetch
        fetch('/employee_process', {
            method: 'POST',
            body: formData
        }).then(response => response.text())
        .then(responseText => {
            if (responseText == 'success') {
                // Handle successful form submission
                console.log('Form submitted successfully!');
                // Close the modal
                fetchEmployees();
                renderEmployees();
                const modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
                modal.hide();
            } else if (responseText == 'email') {
                // Handle form submission error
                alert('Email already exists.');

                console.error('Form submission failed.');
            } else if (responseText == 'department') {
                // Handle form submission error
                alert('Department does not exist.');

                console.error('Form submission failed.');
            } else {
                // Handle form submission error
                console.error('Form submission failed.');
                alert('filed to submit form data');
            }
        })
        .catch(error => {
            // Handle network error
            console.error('Network error:', error);
        });
    });

    // Manage filter modal
    const filterButton = document.getElementById('employee-filter');
    const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));

    filterButton.addEventListener('click', () => {
        filterModal.show();
    });

};
