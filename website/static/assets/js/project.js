window.onload = function() {
    let projects = [];
    let currentPage = 1;
    let table_data = [];
    const projectsPerPage = 10;


    



    // Function to fill project summary based on table data
    function fillProjectSummary() {
        const totalBudget = table_data.reduce((total, project) => total + parseFloat(project.budget), 0);
        const numOfProjects = table_data.length;
        const completedProjects = table_data.filter(project => project.state === 'completed').length;
        const newProjects = table_data.filter(project => project.state === 'new').length;
        const pendingProjects = table_data.filter(project => project.state === 'pending').length;
        const runningProjects = table_data.filter(project => project.state === 'running').length;

        document.getElementById('total_budger').textContent = `$${totalBudget}`;
        document.getElementById('num_of_projects').textContent = numOfProjects;
        document.getElementById('completed_num').textContent = `Completed Project Number: ${completedProjects}`;
        document.getElementById('new_num').textContent = `New Project Number: ${newProjects}`;
        document.getElementById('pending_num').textContent = `Pending Project Number: ${pendingProjects}`;
        document.getElementById('running_num').textContent = `Running Project Number: ${runningProjects}`;
    }

    // Function to fill most budget project summary based on table data
    function fillMostBudgetProjectSummary() {
        
        const mostBudgetProject = table_data.reduce((maxBudgetProject, project) => {
            if (!maxBudgetProject || parseFloat(project.budget) > parseFloat(maxBudgetProject.budget)) {
            return project;
            }
            return maxBudgetProject;
        }, null);

        let total_salary_of_employee = 0;
        let num_of_employee = 0;
        if (mostBudgetProject == undefined){
            document.getElementById('p_name').textContent = 'No Project';
            document.getElementById('p_budget').textContent = 'No Budget';
            document.getElementById('most_buget_num_of_emp').textContent = 'No Employee';
            document.getElementById('total_salary_of_employee').textContent = 'No Salary';
        }else {
        fetch(`/api/project_employee/${mostBudgetProject.id}`)
            .then(response => response.json())
            .then(data => {
                num_of_employee= data['employees'].length;
                console.log(data['employees']);
                console.log(data['employees'].length);
                for (let i = 0; i < data[['employees']].length; i++) {
                    console.log(data['employees'][i].salary);
                    total_salary_of_employee += parseFloat(data['employees'][i].salary);
                }
                document.getElementById('p_name').textContent = mostBudgetProject.name ;
                document.getElementById('p_budget').textContent = `${mostBudgetProject.project_user_name}`;
                document.getElementById('most_buget_num_of_emp').textContent = `${num_of_employee}`;
                document.getElementById('total_salary_of_employee').textContent = `$${total_salary_of_employee}`;
            }).catch(error => alert('Error fetching project', error));
        }
          

        
    }

    // Function to fill most ordering client summary based on table data
    function fillMostOrderingClientSummary() {
        const clientProjects = {};
        table_data.forEach(project => {
            if (clientProjects[project.creator_user_id]) {
                clientProjects[project.creator_user_id]++;
            } else {
                clientProjects[project.creator_user_id] = 1;
            }
        });
        if (Object.keys(clientProjects).length == 0) {
            document.getElementById('c_name').textContent = 'No Client';
            document.getElementById('c_num_of_projects').textContent = 'No Project';
            document.getElementById('c_total_budget').textContent = 'No Budget';
            return;
        }

        const mostOrderingClient = Object.keys(clientProjects).reduce((maxClient, clientId) => {
            if (clientProjects[clientId] > clientProjects[maxClient]) {
                return clientId;
            } else {
                return maxClient;
            }
        });
        let p ;
        const numOfProjects = clientProjects[mostOrderingClient];
        let totalBudget = 0;
        
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].creator_user_id == mostOrderingClient) {
                totalBudget += parseFloat(projects[i].budget);
                p = projects[i];
            }
        }
        if (p != undefined){
            document.getElementById('c_name').textContent = p.project_user_name + ' ' + `ID: ${p.creator_user_id}`;
        }else {
            document.getElementById('c_name').textContent = 'No Client';
        }
        document.getElementById('c_num_of_projects').textContent = numOfProjects;
        document.getElementById('c_total_budget').textContent = `Total Budget: $${totalBudget}`;
    }

    // Call the functions to fill the summaries




        // Event listener for budget ascending button
        document.getElementById('budget_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.budget - b.budget);
            renderProjects();
        });

        // Event listener for budget descending button
        document.getElementById('budget_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.budget - a.budget);
            renderProjects();
        });

        // Event listener for deadline ascending button
        document.getElementById('deadline_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => {
            const dateA = new Date(a.deadline_date);
            const dateB = new Date(b.deadline_date);
            return dateA.getTime() - dateB.getTime();
            });
            renderProjects();
        });

        // Event listener for deadline descending button
        document.getElementById('deadline_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => {
            const dateA = new Date(a.deadline_date);
            const dateB = new Date(b.deadline_date);
            return dateB.getTime() - dateA.getTime();
            });
            renderProjects();
        });

        // Event listener for creation date ascending button
        document.getElementById('creation_date_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date));
            renderProjects();
        });

        // Event listener for creation date descending button
        document.getElementById('creation_date_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
            renderProjects();
        });

        // Event listener for id ascending button
        document.getElementById('id_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.id - b.id);
            renderProjects();
        });

        // Event listener for id descending button
        document.getElementById('id_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.id - a.id);
            renderProjects();
        });





    // Function to handle new project button click
    document.getElementById('new_project_btn').addEventListener('click', () => {
        const form = document.getElementById('action');
        action.value = 'add'; // Change the form action to 
    });

    function convertDateFormat(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Function to handle filter button click
    document.getElementById('project-filter').addEventListener('click', () => {
        const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
        filterModal.show();
    });

    // Function to handle reset filter button click
    document.getElementById('reset-project-filter').addEventListener('click', () => {
        document.getElementById('filterForm').reset();
        applyFilters();
    });

    // Function to apply filters
    function applyFilters() {
        const filterName = document.getElementById('filterName').value.trim();
        const filterClient = document.getElementById('filterClient').value.trim();
        const filterStatus = document.getElementById('filterStatus').value;
        const filterId = document.getElementById('filterId').value.trim();
        const filterDeadline = document.getElementById('filterDeadline').value;
        const filterEndDeadline = document.getElementById('filterEndDeadline').value;
        const filterStartCreationDate = document.getElementById('filterCreationDate').value;
        const filterEndCreationDate = document.getElementById('endFilterCreationDate').value;
        const filterRemainingDays = document.getElementById('filterRemainingDays').value;
        const filterBudget = document.getElementById('filterBudget').value.trim();

        table_data = projects.filter(project => {
            let match = true;

            if (filterBudget && project.budget > filterBudget) {
                match = false;
            }

            if (filterName && !project.name.toLowerCase().includes(filterName.toLowerCase())) {
                match = false;
            }

            if (filterClient && project.creator_user_id != filterClient) {
                match = false;
            }

            if (filterStatus && project.state !== filterStatus) {
                match = false;
            }

            if (filterId && project.id != filterId) {
                match = false;
            }

            if (filterDeadline) {
                const deadlineDate = new Date(project.deadline_date);
                const formattedDeadlineDate = deadlineDate.toISOString().split('T')[0];
                console.log(formattedDeadlineDate <= filterDeadline)
                if (formattedDeadlineDate > filterDeadline) {
                    match = false;
                }
            }
            if (filterEndDeadline) {
                const deadlineDate = new Date(project.deadline_date);
                const formattedDeadlineDate = deadlineDate.toISOString().split('T')[0];
                if (formattedDeadlineDate < filterEndDeadline) {
                    match = false;
                }
            }

            if (filterStartCreationDate) {
                const creationDate = new Date(project.creation_date);
                console.log(creationDate)
                const formattedCreationDate = creationDate.toISOString().split('T')[0];
                console.log(formattedCreationDate)
                if (formattedCreationDate !== filterStartCreationDate) {
                    match = false;
                }
            } 
            if (filterEndCreationDate) {
                const creationDate = new Date(project.creation_date);
                const formattedCreationDate = creationDate.toISOString().split('T')[0];
                if (formattedCreationDate !== filterEndCreationDate) {
                    match = false;
                }
            }


            if (filterRemainingDays) {
                const currentDate = new Date();
                const deadlineDate = new Date(project.deadline_date);
                const differenceInTime = deadlineDate.getTime() - currentDate.getTime();
                const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
                if (differenceInDays > filterRemainingDays || differenceInDays < 0) {
                    match = false;
                }
                console.log(differenceInDays);
            }

            return match;
        });

        currentPage = 1;
        renderProjects();
    }

    // Event listener for filter form submission
    document.getElementById('filterForm').addEventListener('submit', (event) => {
        event.preventDefault();
        applyFilters();
    });

    // Event listener for filter modal close
    document.getElementById('filterModal').addEventListener('hidden.bs.modal', () => {
        applyFilters();
    });

    document.getElementById('projectModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('projectForm').reset();
    });

    // Function to fetch projects from the server
    function fetchProjects() {
        fetch('/api/projects')
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    data[i].deadline_date = convertDateFormat(data[i].deadline_date);
                }
                projects = data;
                table_data = data;
                renderProjects();
            })
            .catch(error => console.error('Error fetching projects:', error));
    }

    // Function to render projects in the table
    function renderProjects() {
        const tableBody = document.getElementById('projects-table-body');
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        const pageProjects = table_data.slice(startIndex, endIndex);
        pageProjects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="projectId" style="color: rgb(255,255,255);">${project.id}</td>
                <td class="projectName" style="color: rgb(255,255,255);">${project.name}</td>
                <td>
                    <button type="button" class="btn btn-primary show-description" data-bs-toggle="modal" data-bs-target="#descriptionModal" data-description="${project.description}">
                    View
                    </button>
                </td>
                <td class="projectOwner" style="color: rgb(255,255,255);">${project.creator_user_id}</td>
                <td class="projectStatus" style="color: rgb(255,255,255);">${project.state}</td>
                <td class="projectCreationDate" style="color: rgb(255,255,255);">${project.creation_date}</td>
                <td class="projectDeadline" style="color: rgb(255,255,255);">${project.deadline_date}</td>
                <td class="projectBudget" style="color: rgb(255,255,255);">${project.budget}</td>
                <td class="text-center align-middle" style="max-height: 60px;height: 60px;">

                    <a class="btn btnMaterial btn-flat primary semicircle" role="button" href="/manager_project/${project.id}" style="color: #00bdff;"><i class="far fa-eye"></i></a>

                    <a class="btn btnMaterial btn-flat success semicircle edit_pro" role="button" style="color: rgb(0,197,179);">
                        <i class="fas fa-pen"></i>
                    </a>
                    <a class="delete_btn btn btnMaterial btn-flat accent btnNoBorders checkboxHover" role="button" style="margin-left: 5px;" data-bs-toggle="modal" data-bs-target="#delete-modal" href="#">
                        <i class="fas fa-trash btnNoBorders" style="color: #DC3545;"></i>
                    </a>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners for the new edit and delete buttons
        addEventListeners();

        document.querySelectorAll('.show-description').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalBody = document.querySelector('#descriptionModal .modal-body');
                modalBody.textContent = btn.dataset.description;
                modal.show();
            });
        });


        renderPagination();
        fillProjectSummary();
        fillMostBudgetProjectSummary();
        fillMostOrderingClientSummary();
    
    
    }

    function addEventListeners() {
        // edit project
        const editBtns = document.querySelectorAll('.edit_pro');
        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const projectId = row.querySelector('.projectId').textContent;
                const projectName = row.querySelector('.projectName').textContent;
                const projectClient = row.querySelector('.projectOwner').textContent;
                const projectStatus = row.querySelector('.projectStatus').textContent;
                const projectBudget = row.querySelector('.projectBudget').textContent;
                const description = row.querySelector('.show-description').dataset.description;
                let projectDeadline = row.querySelector('.projectDeadline').textContent;
                const date = convertDateFormat(projectDeadline);

                document.getElementById('id').value = projectId;
                document.getElementById('action').value = 'edit';
                document.getElementById('project_name').value = projectName;
                document.getElementById('project_client').value = projectClient;
                document.getElementById('project_status').value = projectStatus;
                document.getElementById('project_budget').value = projectBudget;
                document.getElementById('project_description').value = description;
                document.getElementById('project_end_date').value = date;

                const modal = new bootstrap.Modal(document.getElementById('projectModal'));
                document.getElementById('projectModalLabel').textContent = 'Edit Project';
                modal.show();
            });
        });



        // delete project
        const delete_btn = document.querySelectorAll('.delete_btn');
        delete_btn.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const projectId = row.querySelector('.projectId').textContent;

                document.getElementById('id').value = projectId;
                document.getElementById('action').value = 'delete';

                const form = document.getElementById('projectForm');
                const formData = new FormData(form);

                fetch('/project_process', {
                    method: 'POST',
                    body: formData
                }).then(response => response.text())
                .then(responseText => {
                    if (responseText === 'success'){
                        projects = projects.filter(project => project.id != projectId);
                        table_data = projects;
                        renderProjects();
                    } else {
                        console.error('Form submission failed:', error);
                        alert ("delete failed due to key constraints")
                    }
                })
                .catch(error => {
                    console.error('Network error:', error);
                });
            });
        });


    }

    // Function to render pagination buttons
    function renderPagination() {
        let totalPages = Math.ceil(table_data.length / projectsPerPage);
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

    // Fetch projects when the page loads
    fetchProjects();

    // Event listeners for pagination buttons
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.addEventListener('click', () => {
        currentPage--;
        renderProjects();
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        renderProjects();
    });



            // Function to validate form data
            function validateFormData(formData) {
                const name = formData.get('project_name');
                const description = formData.get('project_description');
                const deadline = formData.get('project_end_date');
                const budget = formData.get('project_budget');
                console.log(name, description, deadline, budget);
                if (!name || !description || !deadline || !budget) {
                    return false;
                }
    
                const today = new Date();
                const selectedDeadline = new Date(deadline);
    
                if (selectedDeadline <= today) {
                    return false;
                }
    
                if (budget <= 0) {
                    return false;
                }
    
                return true;
            }
    
    // on modal submission send data to the /project_process route
    const form = document.getElementById('projectForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        


        const formData = new FormData(form);
        // Validate form data
        if (validateFormData(formData)) {
            fetch('/project_process', {
                method: 'POST',
                body: formData
            }).then(response => response.text())
            
            .then(responseText => {
                
                if (responseText === 'success'){
                    const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'));
                    modal.hide();
                    fetchProjects();
                    form.reset();
                } else if (responseText === 'user') {
                    console.error('Form submission failed.');
                    alert('Form submission failed. make sure you have entered valid employee .');
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            });
        } else {
            alert('Invalid form data. Please check the form fields and try again.');
        }
    });






};
