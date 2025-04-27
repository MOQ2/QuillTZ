window.onload = function() {
    let services = [];
    let currentPage = 1;
    let table_data = [];
    const servicesPerPage = 10;


    // Event listener for serviceModal hide event
    document.getElementById('serviceModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('serviceForm').reset();
    });


    // Function to fetch services from the server
    function fetchServices() {
        fetch('/api/services')
            .then(response => response.json())
            .then(data => {
                services = data;
                table_data = data;
                renderServices();
            })
            .catch(error => console.error('Error fetching services:', error));
    }

    document.getElementById('new_service_btn').addEventListener('click', () => {
        const form = document.getElementById('action');
        action.value = 'add'; // Change the form action to 
    });

    

    // Function to render services in the table
    function renderServices() {
        const tableBody = document.getElementById('services-table-body');
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * servicesPerPage;
        const endIndex = startIndex + servicesPerPage;
        const pageServices = table_data.slice(startIndex, endIndex);

        pageServices.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="color: rgb(255,255,255);" >${service.id}</td>
                <td style="color: rgb(255,255,255);" >${service.name}</td>
                <!--<td style="color: rgb(255,255,255);" >${service.description}</td> -->
                <td>
                    <!-- Button to open modal -->
                    <button type="button" class="btn btn-primary show-description" data-bs-toggle="modal" data-bs-target="#descriptionModal" data-description="${service.description}">
                    View Description
                    </button>
                </td>
                <td style="color: rgb(255,255,255);" >${service.department_id}</td>
                <td class="text-center align-middle" style="max-height: 60px;height: 60px;">
                    <a class="btn btnMaterial btn-flat success semicircle edit_service" role="button" style="color: rgb(0,197,179);">
                        <i class="fas fa-pen"></i>
                    </a>
                    <a class="delete_service btn btnMaterial btn-flat accent btnNoBorders checkboxHover" role="button" style="margin-left: 5px;" data-bs-toggle="modal" data-bs-target="#delete-modal" href="#">
                        <i class="fas fa-trash btnNoBorders" style="color: #DC3545;"></i>
                    </a>
                </td>
            `;
            tableBody.appendChild(row);
        });



        
    // Event listener for edit service button click
    const editServiceBtns = document.querySelectorAll('.edit_service');
    editServiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const serviceId = row.querySelector('td:first-child').textContent;
            const serviceName = row.querySelector('td:nth-child(2)').textContent;
            //const serviceDescription = row.querySelector('td:nth-child(3)').textContent;
            const serviceDescription = row.querySelector('.show-description').dataset.description;
            const serviceDepartmentId = row.querySelector('td:nth-child(4)').textContent;

            document.getElementById('id').value = serviceId;
            document.getElementById('action').value = 'edit';
            document.getElementById('service_name').value = serviceName;
            document.getElementById('service_description').value = serviceDescription;
            document.getElementById('service_department').value = serviceDepartmentId;

            const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
            document.getElementById('serviceModalLabel').textContent = 'Edit Service';
            modal.show();
        });
    });

    // Event listener for delete service button click
    const deleteServiceBtns = document.querySelectorAll('.delete_service');
    deleteServiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const serviceId = row.querySelector('td:first-child').textContent;

            document.getElementById('action').value = 'delete';

                const form = document.getElementById('serviceForm');
                const formData = new FormData(form);

                // Send data to server using fetch
                fetch('/service_process', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        // Handle successful form submission
                        // Remove the deleted project from the table_data array
                        // Remove the deleted service from the table_data array
                        services = services.filter(service => service.id != serviceId);
                        // Re-render the services
                        table_data = services;
                        renderServices();
                    } else {
                        // Handle form submission error
                        
                        console.error('Form submission failed:', error);
                        console.error('Form submission failed.');
                    }
                })
                .catch(error => {
                    // Handle network error
                    console.error('Network error:', error);
                });
            
        });
    });



    

// Create a single modal
const modalHtml = `
<div class="modal fade" id="descriptionModal" tabindex="-1" aria-labelledby="descriptionModalLabel" aria-hidden="true">
<div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="descriptionModalLabel">Project Description</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body"></div>
    </div>
</div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHtml);

// Add event listener to the buttons
document.querySelectorAll('.show-description').forEach(btn => {
    btn.addEventListener('click', () => {
    const modalBody = document.querySelector('#descriptionModal .modal-body');
    const modal = new bootstrap.Modal('#descriptionModal');
    modalBody.textContent = btn.dataset.description;
    modal.show();
    });
});



        renderPagination();
    }

    // Function to render pagination buttons
    function renderPagination() {
        let totalPages = Math.ceil(table_data.length / servicesPerPage);
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

    // Fetch services when the page loads
    fetchServices();

    // Event listeners for pagination buttons
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.addEventListener('click', () => {
        currentPage--;
        renderServices();
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        renderServices();
    });

    // Function to handle filter button click
    document.getElementById('service-filter').addEventListener('click', () => {
        const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
        filterModal.show();
    });

    // Function to handle reset filter button click
    document.getElementById('reset-service-filter').addEventListener('click', () => {
        document.getElementById('filterForm').reset();
        applyFilters();
    });

    // Function to apply filters
    function applyFilters() {
        const filterName = document.getElementById('filterName').value.trim();
        const filterDepartment = document.getElementById('filterDepartment').value.trim();
        const filterId = document.getElementById('filterId').value.trim();

        table_data = services.filter(service => {
            let match = true;

            if (filterName && !service.name.toLowerCase().includes(filterName.toLowerCase())) {
                match = false;
            }

            if (filterDepartment && service.department_id != filterDepartment) {
                match = false;
            }

            if (filterId && service.id != filterId) {
                match = false;
            }

            return match;
        });

        currentPage = 1;
        renderServices();
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

    // Event listener for service form submission
    const serviceForm = document.getElementById('serviceForm');
    serviceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(serviceForm);

        // Send data to server using fetch
        fetch('/service_process', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('Form submitted successfully!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('serviceModal'));
                modal.hide();
                fetchServices();
                serviceForm.reset();
            } else {
                console.error('Form submission failed.');
            }
        })
        .catch(error => {
            console.error('Network error:', error);
        });
    });

};