window.onload = function() {
    let clients = [];
    let currentPage = 1;
    let table_data = [];
    const clientsPerPage = 10;

    // Function to fetch clients from the server
    function fetchClients() {
        fetch('/api/clients')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    alert('An error occurred while fetching clients. Please try again later.');
                    return;
                }
                clients = data;
                table_data = data;
                renderClients();

            })
            
    }


    
        // Event listener for creation date ascending button
        document.getElementById('creation_date_asc').addEventListener('click', (event) => {
          event.preventDefault();
          table_data.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date));
          renderClients();
      });

      // Event listener for creation date descending button
      document.getElementById('creation_date_desc').addEventListener('click', (event) => {
          event.preventDefault();
          table_data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
          renderClients();
      });

      // Event listener for id ascending button
      document.getElementById('id_asc').addEventListener('click', (event) => {
          event.preventDefault();
          table_data.sort((a, b) => a.id - b.id);
          renderClients();
      });

      // Event listener for id descending button
      document.getElementById('id_desc').addEventListener('click', (event) => {
          event.preventDefault();
          table_data.sort((a, b) => b.id - a.id);
          renderClients();
      });



    // Function to render clients in the table
    function renderClients() {
        const tableBody = document.getElementById('clients-table-body');
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * clientsPerPage;
        const endIndex = startIndex + clientsPerPage;
        const pageClients = table_data.slice(startIndex, endIndex);
        pageClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `


                <td class="clientId" style="color: rgb(255,255,255);" >${client.id}</td>
                <td class="clientName" style="color: rgb(255,255,255);">${client.first_name} ${client.last_name}</td>
                <td class="clientEmail" ><span style="color: rgb(255, 255, 255);">${client.email}</span></td>
                <td class="creationDate" style="color: var(--bs-table-border-color);">${client.creation_date}</td>
                <td class="text-center align-middle" style="max-height: 60px;height: 60px;">    <a class="btn btnMaterial btn-flat primary semicircle" role="button" href="/client/${client.id}" style="color: #00bdff;"><i class="far fa-eye"></i></a>      <a class="btn btnMaterial btn-flat success semicircle edit_emp" role="button" style="color: rgb(0,197,179);"><i class="fas fa-pen "></i></a><a class="delete_btn btn btnMaterial btn-flat accent btnNoBorders checkboxHover" role="button" style="margin-left: 5px;" data-bs-toggle="modal" data-bs-target="#delete-modal" href="#"><i class="fas fa-trash btnNoBorders" style="color: #DC3545;"></i></a></td>

                <!-- Add more client properties as needed -->
            `;

            tableBody.appendChild(row);
        });

        renderPagination();



//delete 
const delete_btn = document.querySelectorAll('.delete_btn');

delete_btn.forEach(btn => {
    btn.addEventListener('click', () => {
    const row = btn.closest('tr');
    const clientId = row.querySelector('.clientId').textContent;
    
    // Get other employee data from the row
    document.getElementById('id').value = clientId;
    document.getElementById('action').value='delete';
    

    const form = document.getElementById('employeeForm');
    const formData = new FormData(form);

  // Send data to server using fetch
  fetch('/client_process', {
    method: 'POST',
    body: formData
  }).then(response => response.text())
  .then(responseText => {
    if (responseText === 'success') {
      // Handle successful form submission
      // Remove the deleted client from the table_data array
      clients = clients.filter(client => client.id != clientId);
      // Re-render the clients
      table_data = clients;
      renderClients();
    } else   {
      // Handle form submission error
      alert('This Cleint can not be deleted due to key constraint .');
      
    }
  })
  .catch(error => {
    // Handle network error

    console.error('Network error:', error);
  });

  });

});






        
// edit new emp
const editBtns = document.querySelectorAll('.edit_emp');

editBtns.forEach(btn => {
    btn.addEventListener('click', () => {
    const row = btn.closest('tr');
    const clinetId = row.querySelector('.clientId').textContent;
    const name = row.querySelector('.clientName').textContent;
    let first_name = name.split(' ');
    let last_name = first_name[1];
    first_name = first_name[0];
    const email = row.querySelector('.clientEmail').textContent;
    document.getElementById('password').value =""


    
    // Get other employee data from the row
    document.getElementById('id').value = clinetId;
    document.getElementById('action').value = 'edit';
    document.getElementById('first_name').value = first_name;
    document.getElementById('last_name').value = last_name;
    document.getElementById('email').value = email;
    // Set other form fields with employee data
    const modal = new bootstrap.Modal(document.getElementById('clientModal'));

    document.getElementById('clientModalLabel').textContent = 'Edit Client';
    modal.show();
  });
});
//end of edit emp


    }

    // Function to render pagination buttons
    function renderPagination() {
        let totalPages = Math.ceil(table_data.length / clientsPerPage);
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

    // // Function to apply filters
    // function applyFilters() {
    //     const nameFilter = document.getElementById('name-filter').value.toLowerCase();
    //     const filteredClients = clients.filter(client =>
    //         client.name.toLowerCase().includes(nameFilter)
    //     );
    //     clients = filteredClients;
    //     currentPage = 1;
    //     renderClients();
    // }

    // Fetch clients when the page loads
    fetchClients();

    // Event listeners for pagination buttons
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.addEventListener('click', () => {
        currentPage--;
        renderClients();
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        renderClients();
    });


    // Reset client filter form
    const resetButton = document.getElementById('reset-client-filter');
    resetButton.addEventListener('click', () => {
      const filterForm = document.getElementById('filterForm');
      filterForm.reset();
      table_data = clients;
      renderClients();
    });

    
// Filter clients
const filterForm = document.getElementById('filterForm');
filterForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get filter values
  const filterName = document.getElementById('filterName').value;
  const filterEmail = document.getElementById('filterEmail').value;
  const filterStartCreationDate = document.getElementById('filterStartCreationDate').value;
  const filterEndCreationDate = document.getElementById('filterEndCreationDate').value;
  const filterStartTime = document.getElementById('filterStartTime').value;
  const filterEndTime = document.getElementById('filterEndTime').value;

  // Apply filters
  table_data = clients.filter(client => {
    // Filter by feedback
    let match = true;
    if (filterName !== '' && !(client.first_name+client.last_name).toLowerCase().includes(filterName.toLowerCase()))  {
      return false;
    }
    // Filter by project
    if ( filterEmail !== '' && !client.email.toLowerCase().includes(filterEmail.toLowerCase() )) {
      return false;
    }


    if (filterStartCreationDate && new Date(client.creation_date) < new Date(filterStartCreationDate)) {

      match = false;
  }
  
  if (filterEndCreationDate && new Date(client.creation_date) > new Date(`${filterEndCreationDate}T23:59:59`)) {
      console.log(new Date(client.creation_date));
      console.log(new Date(`${filterEndCreationDate}T23:59:59`));
      match = false;
  }
  console.log(filterStartTime);
  if (filterStartTime && getTimeString(new Date(client.creation_date)) < filterStartTime) {
      console.log(filterStartTime);
      console.log(getTimeString(new Date(client.creation_date)));
      match = false;
  }
  
  if (filterEndTime && getTimeString(new Date(client.creation_date)) > filterEndTime) {
      match = false;
  }

    return match;
  });
  currentPage = 1;
  renderClients();
  // Close the modal
  filterModal.hide();
});

const getTimeString = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };




/// reset the modal
const modal = document.getElementById('new_emp_btn');

// Add event listener for the show.bs.modal event
modal.addEventListener('click', function () {
  // Clear the form fields
  const form = document.getElementById('employeeForm');
  form.reset();

  // Check if the modal is being opened from the "Add Employee" button
  const action = document.getElementById('action');
  action.value='add'
  // Set the modal title for adding a new employee
  document.getElementById('clientModalLabel').textContent = 'Add Client';

});



/// add new employee
const form = document.getElementById('employeeForm');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  const formData = new FormData(form);

  // check the form fields
  const first_name = formData.get('first_name');
  const last_name = formData.get('last_name');
  const email = formData.get('email');
  const password = formData.get('password');
  const action = formData.get('action');
  if (first_name.trim() === '' || last_name.trim() === '' || email.trim() === '') {
    alert('First name, last name, and email are required.');
    return;
  }
  if (action === 'add') {
    // Check if employee name or email are empty
    if (password.trim() === '') {
      alert('Password is required.');
      return;
    }
    
  }

  // Send data to server using fetch
  fetch('/client_process', {
    method: 'POST',
    body: formData
        }).then(response => response.text())
        .then(responseText => {
    if (responseText === 'success') {
      // Handle successful form submission
      console.log('Form submitted successfully!');
      // Close the modal
      //location.reload();

      
      fetchClients();
      renderClients();
      const modal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
      modal.hide();
    } else if (responseText === 'email') {
      // Handle form submission error
      alert('This email is already in use.');
      console.error('Form submission failed.');
    }
  })
  .catch(error => {
    // Handle network error
    console.error('Network error:', error);
  });
});




};





// Manage filter modal
const filterButton = document.getElementById('client-filter');
const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));

filterButton.addEventListener('click', () => {
  filterModal.show();
});



