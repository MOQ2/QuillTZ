// but all the code in onload function in the html file
window.onload = function() {

    let departments = [];
    let currentPage = 1;
    let table_data = [];
    const departmentsPerPage = 10;
    
    // Fetch departments from the server
    function fetchDepartments() {
      fetch('/api/department')
        .then(response => response.json())
        .then(data => {
          departments = data;
          table_data = data;
          renderDepartments();
          console.log('Departments data:', data);
        })
        .catch(error => console.error('Error fetching departments:', error));
    }
    
    // Render departments in the table
    function renderDepartments() {
      const tableBody = document.getElementById('departments-table-body');
      tableBody.innerHTML = '';
    
      const startIndex = (currentPage - 1) * departmentsPerPage;
      const endIndex = startIndex + departmentsPerPage;
      const pageDepartments = table_data.slice(startIndex, endIndex);
    
      pageDepartments.forEach(department => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="departmentId" style="color: rgb(255,255,255);">${department.id}</td>
          <td class="departmentName" style="color: rgb(255,255,255);">${department.name}</td>
          <td class="departmentDescription"   style="color: rgb(255,255,255);" >${department.description}</td>
          <td class="text-center align-middle" style="max-height: 60px;height: 60px;">
            <a class="btn btnMaterial btn-flat success semicircle edit_dept" role="button" style="color: rgb(0,197,179);"><i class="fas fa-pen"></i></a>
            <a class="delete_btn btn btnMaterial btn-flat accent btnNoBorders checkboxHover" role="button" style="margin-left: 5px;" data-bs-toggle="modal" data-bs-target="#delete-modal" href="#"><i class="fas fa-trash btnNoBorders" style="color: #DC3545;"></i></a>
          </td>
        `;
    
        tableBody.appendChild(row);
      });
    
      renderPagination();
    
      // Add event listeners for edit and delete buttons
      addEditDepartmentListener();
      addDeleteDepartmentListener();
    }
    
    // Render pagination buttons
    function renderPagination() {
      let totalPages = Math.ceil(table_data.length / departmentsPerPage);
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
    
    // Fetch departments when the page loads
    fetchDepartments();
    
    // Event listeners for pagination buttons
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    prevButton.addEventListener('click', () => {
      currentPage--;
      renderDepartments();
    });
    
    nextButton.addEventListener('click', () => {
      currentPage++;
      renderDepartments();
    });
    
    // Reset department filter form
    const resetButton = document.getElementById('reset-dept-filter');
    resetButton.addEventListener('click', () => {
      const filterForm = document.getElementById('filterForm');
      filterForm.reset();
      table_data = departments;
      renderDepartments();
    });
    
    // Filter departments
    const filterForm = document.getElementById('filterForm');
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
    
      // Get filter value
      const filterName = document.getElementById('filterName').value;
      
      // Apply filter
      if (filterName === '') {
        table_data = departments;
      } else {
        const filteredDepartments = departments.filter(department =>
          department.department_name.toLowerCase().includes(filterName.toLowerCase())
        );
        table_data = filteredDepartments;
      }
    
      currentPage = 1;
      renderDepartments();
    
      // Close the modal
      filterModal.hide();
    });
    
    // Add new department
    const form = document.getElementById('departmentForm');
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
      const formData = new FormData(form);
      // Check if department name or description are empty
      const departmentName = formData.get('department_name');
      const departmentDescription = formData.get('description');

      if (departmentName.trim() === '' || departmentDescription.trim() === '') {
        alert('Department name and description are required.');
        return;
      }
      // Send data to server using fetch
      fetch('/department_process', {
        method: 'POST',
        body: formData
      }).then(response => response.text())
        .then(responseText => {
          if (responseText == 'success') {
            // Handle successful form submission
            console.log('Form submitted successfully!');
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('departmentModal'));
            modal.hide();
            // Fetch the updated departments data
            fetchDepartments();
          } else {
            // Handle form submission error
            console.error('Form submission failed.');
            alert('Department requist is denied/faild');
          }
        })
        .catch(error => {
          // Handle network error
          console.error('Network error:', error);
        });
    });
    
    // Manage filter modal
    const filterButton = document.getElementById('dept-filter');
    const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
    
    filterButton.addEventListener('click', () => {
      filterModal.show();
    });
    
    // Reset the modal form
    const modal = document.getElementById('new_dept_btn');
    modal.addEventListener('click', function () {
      // Clear the form fields
    const form = document.getElementById('departmentForm');
    form.reset();
    
      // Set the modal title for adding a new department
    document.getElementById('departmentModalLabel').textContent = 'NEW DEPARTMENT';
    document.getElementById('action').value = 'add';
    });
    
    // Add event listener for edit department
    function addEditDepartmentListener() {
    const editBtns = document.querySelectorAll('.edit_dept');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const row = btn.closest('tr');
          const departmentId = row.querySelector('.departmentId').textContent;
          const departmentName = row.querySelector('.departmentName').textContent;
          const departmentDescription = row.querySelector('.departmentDescription').textContent;
    
          // Set form fields with department data
          document.getElementById('id').value = departmentId;
          document.getElementById('action').value = 'edit';
          document.getElementById('department_name').value = departmentName;
          document.getElementById('description').value = departmentDescription;
    
          // Set modal title for editing department
          document.getElementById('departmentModalLabel').textContent = 'Edit Department';
    
          // Show the modal
          const modal = new bootstrap.Modal(document.getElementById('departmentModal'));
          modal.show();
        });
      });
    }
    
    // Add event listener for delete department
    function addDeleteDepartmentListener() {
      const deleteBtns = document.querySelectorAll('.delete_btn');
      deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const row = btn.closest('tr');
          const departmentId = row.querySelector('.departmentId').textContent;
    
          // Set form fields for deletion
          document.getElementById('id').value = departmentId;
          document.getElementById('action').value = 'delete';
    
          const form = document.getElementById('departmentForm');
          const formData = new FormData(form);
    
          // Send data to server using fetch
          fetch('/department_process', {
            method: 'POST',
            body: formData
          }).then(response => response.text())
            .then(responseText => {
              if (responseText === 'success') {
                // Handle successful form submission
                // Remove the deleted department from the table_data array
                departments = departments.filter(department => department.id != departmentId);
                // Re-render the departments
                table_data = departments;
                // reset form
                form.reset();
                renderDepartments();
              } else {
                // Handle form submission error
                console.error('Form submission failed.');
                alert('Department requist is denied');
              }
            })
            .catch(error => {
              // Handle network error
              console.error('Network error:', error);
            });
        });
      });
    }
    
    





   
}
