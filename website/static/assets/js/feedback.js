window.onload = function() {
    let feedbacks = [];
    let currentPage = 1;
    let table_data = [];
    const feedbacksPerPage = 10;

    document.getElementById('new_feedback_btn').addEventListener('click', () => {
        const form = document.getElementById('action');
        action.value = 'add';
    });

    


        // Event listener for creation date ascending button
        document.getElementById('creation_date_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date));
            renderFeedbacks();


        });

        // Event listener for creation date descending button
        document.getElementById('creation_date_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
            renderFeedbacks();
        });

        // Event listener for id ascending button
        document.getElementById('id_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.feedback_id - b.feedback_id);
            renderFeedbacks();
        });

        // Event listener for id descending button
        document.getElementById('id_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.feedback_id - a.feedback_id);
            renderFeedbacks();
        });

        // Event listener for rating ascending button
        document.getElementById('rating_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.rating - b.rating);
            renderFeedbacks();
        });

        // Event listener for rating descending button
        document.getElementById('rating_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.rating - a.rating);
            renderFeedbacks();
        });

        // envent listnetr for project id ascending button  
        document.getElementById('project_id_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.project_id - b.project_id);
            renderFeedbacks();
        });

        // event listener for project id descending button
        document.getElementById('project_id_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.project_id - a.project_id);
            renderFeedbacks();
        });






    function convertDateFormat(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const time = date.toLocaleTimeString();
        let value = `${year}-${month}-${day}:${time}`;
        console.log(value);
        return value ;
    }

    document.getElementById('feedback-filter').addEventListener('click', () => {
        const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
        filterModal.show();
    });

    document.getElementById('reset-feedback-filter').addEventListener('click', () => {
        document.getElementById('filterForm').reset();
        applyFilters();
    });

    const getTimeString = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    
    function applyFilters() {
        const filterDescription = document.getElementById('filterDescription').value.trim();
        const filterRating = document.getElementById('filterRating').value;
        const filterUser = document.getElementById('filterUser').value.trim();
        const filterProjectId = document.getElementById('filterProjectId').value.trim();
        const filterStartCreationDate = document.getElementById('filterStartCreationDate').value;
        const filterEndCreationDate = document.getElementById('filterEndCreationDate').value;
        const filterStartTime = document.getElementById('filterStartTime').value;
        const filterEndTime = document.getElementById('filterEndTime').value;

        table_data = feedbacks.filter(feedback => {
            let match = true;

            if (filterDescription && !feedback.feedback_description.toLowerCase().includes(filterDescription.toLowerCase())) {
            match = false;
            }

            if (filterRating && feedback.rating != filterRating) {
            match = false;
            }

            if (filterUser && feedback.user !== filterUser) {
            match = false;
            }

            if (filterProjectId && feedback.project_id != filterProjectId) {
            match = false;
            }


            if (filterStartCreationDate && new Date(feedback.creation_date) < new Date(filterStartCreationDate)) {

                match = false;
            }
            
            if (filterEndCreationDate && new Date(feedback.creation_date) > new Date(`${filterEndCreationDate}T23:59:59`)) {
                console.log(new Date(feedback.creation_date));
                console.log(new Date(`${filterEndCreationDate}T23:59:59`));
                match = false;
            }
            console.log(filterStartTime);
            if (filterStartTime && getTimeString(new Date(feedback.creation_date)) < filterStartTime) {
                console.log(filterStartTime);
                console.log(getTimeString(new Date(feedback.creation_date)));
                match = false;
            }
            
            if (filterEndTime && getTimeString(new Date(feedback.creation_date)) > filterEndTime) {
                match = false;
            }
            return match;
        });

        currentPage = 1;
        renderFeedbacks();
        
    }

        

    document.getElementById('filterForm').addEventListener('submit', (event) => {
        event.preventDefault();
        applyFilters();
    });

    document.getElementById('filterModal').addEventListener('hidden.bs.modal', () => {
        applyFilters();
    });

    document.getElementById('feedbackModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('feedbackForm').reset();
    });

    function fetchFeedbacks() {
        fetch('/api/feedbacks')
            .then(response => response.json())
            .then(data => {
                
                feedbacks = data;
                table_data = data;
                renderFeedbacks();
            })
            .catch(error => console.error('Error fetching feedbacks:', error));
    }

    function renderFeedbacks() {
        const tableBody = document.getElementById('feedbacks-table-body');
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * feedbacksPerPage;
        const endIndex = startIndex + feedbacksPerPage;
        const pageFeedbacks = table_data.slice(startIndex, endIndex);

        pageFeedbacks.forEach((feedback, index) => {
            const row = document.createElement('tr');
            

            const showDescriptionButton = document.createElement('td');
            row.appendChild(showDescriptionButton);

            row.innerHTML = `
                <td class="feedbackId" style="color: rgb(255,255,255);">${feedback.feedback_id}</td>
                <td ">
                <button type="button" class="btn btn-primary show-description" data-bs-toggle="modal" data-bs-target="#descriptionModal" data-description="${feedback.feedback_description}">
                        Description
                    </button>
                </td>
                <td class="feedbackRating" style="color: rgb(255,255,255);">${feedback.rating}</td>
                <td class="feedbackCreationDate" style="color: rgb(255,255,255);">${feedback.creation_date}</td>
                <td class="feedbackUser" style="color: rgb(255,255,255);">${feedback.user}</td>
                <td class="feedbackProjectId" style="color: rgb(255,255,255);">${feedback.project_id}</td>
                <td class="text-center align-middle" style="max-height: 60px; height: 60px;">
                    <a class="btn btnMaterial btn-flat success semicircle edit_feedback" role="button" style="color: rgb(0,197,179);">
                        <i class="fas fa-pen"></i>
                    </a>
                    <a class="delete_btn btn btnMaterial btn-flat accent btnNoBorders checkboxHover" role="button" style="margin-left: 5px;" data-bs-toggle="modal" data-bs-target="#delete-modal" href="#">
                        <i class="fas fa-trash btnNoBorders" style="color: #DC3545;"></i>
                    </a>
                </td>
            `;

            tableBody.appendChild(row);

        });



        const editBtns = document.querySelectorAll('.edit_feedback');
        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const feedbackId = row.querySelector('.feedbackId').textContent;
                const feedbackDescription = row.querySelector('.show-description').dataset.description;
                const feedbackRating = row.querySelector('.feedbackRating').textContent;
                const feedbackUser = row.querySelector('.feedbackUser').textContent;
                const feedbackProjectId = row.querySelector('.feedbackProjectId').textContent;

                document.getElementById('id').value = feedbackId;
                document.getElementById('action').value = 'edit';
                document.getElementById('feedback_description').value = feedbackDescription;
                document.getElementById('rating').value = feedbackRating;
                document.getElementById('user').value = feedbackUser;
                document.getElementById('project_id').value = feedbackProjectId;

                const modal = new bootstrap.Modal(document.getElementById('feedbackModal'));
                document.getElementById('feedbackModalLabel').textContent = 'Edit Feedback';
                modal.show();
                });
                });
                const deleteBtns = document.querySelectorAll('.delete_btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const feedbackId = row.querySelector('.feedbackId').textContent;

            document.getElementById('id').value = feedbackId;
            document.getElementById('action').value = 'delete';

            const form = document.getElementById('feedbackForm');
            const formData = new FormData(form);

            fetch('/feedback_process', {
                method: 'POST',
                body: formData
            }).then(response => response.text())
            .then(responseText => {
                if (responseText === 'success') {
                    feedbacks = feedbacks.filter(feedback => feedback.feedback_id != feedbackId);
                    table_data = feedbacks;
                    renderFeedbacks();
                } else {
                    console.error('Form submission failed.');
                    alert (responseText);
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            });
        });
    });

    
    const modalHtml = `
    <div class="modal fade" id="descriptionModal" tabindex="-1" aria-labelledby="descriptionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="descriptionModalLabel">Feedback Content</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHtml);


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

function renderPagination() {
    let totalPages = Math.ceil(table_data.length / feedbacksPerPage);
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

fetchFeedbacks();

const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

prevButton.addEventListener('click', () => {
    currentPage--;
    renderFeedbacks();
});

nextButton.addEventListener('click', () => {
    currentPage++;
    renderFeedbacks();
});

const form = document.getElementById('feedbackForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    

    fetch('/feedback_process', {
        method: 'POST',
        body: formData
    }).then(response => response.text())
    .then(responseText => {
        if (responseText === 'success') {
            console.log('Form submitted successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
            modal.hide();
            fetchFeedbacks();
            form.reset();
        } else {
            console.error('Form submission failed.');
            alert(responseText)
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
});

};