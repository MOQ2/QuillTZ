window.onload = function() {
    let notes = [];
    let currentPage = 1;
    let table_data = [];
    const notesPerPage = 10;


    
        // Event listener for creation date ascending button
        document.getElementById('creation_date_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date));
            renderNotes();
        });

        // Event listener for creation date descending button
        document.getElementById('creation_date_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
            renderNotes();
        });

        // Event listener for id ascending button
        document.getElementById('id_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.note_id - b.note_id);
            renderNotes();
        });

        // Event listener for id descending button
        document.getElementById('id_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.note_id - a.note_id);
            renderNotes();
        });

        // event listener for project id ascending button
        document.getElementById('project_id_asc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => a.project_id - b.project_id);
            renderNotes();
        });

        // event listener for project id descending button
        document.getElementById('project_id_desc').addEventListener('click', (event) => {
            event.preventDefault();
            table_data.sort((a, b) => b.project_id - a.project_id);
            renderNotes();
        });



    document.getElementById('new_note_btn').addEventListener('click', () => {
        const form = document.getElementById('action');
        action.value = 'add';
    });

    function convertDateFormat(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    document.getElementById('note-filter').addEventListener('click', () => {
        const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
        filterModal.show();
    });

    document.getElementById('reset-note-filter').addEventListener('click', () => {
        document.getElementById('filterForm').reset();
        applyFilters();
    });

    function applyFilters() {
        const filterSender = document.getElementById('filterSender').value.trim();
        const filterReceiver = document.getElementById('filterReceiver').value.trim();
        const filterProjectId = document.getElementById('filterProjectId').value.trim();
        const filterCreationDate = document.getElementById('filterCreationDate').value;
        const filterIsSeen = document.getElementById('filterIsSeen').value;

        table_data = notes.filter(note => {
            let match = true;

            
            if (filterSender && note.sender !== filterSender) {
                match = false;
            }

            if (filterReceiver && note.receiver !== filterReceiver) {
                match = false;
            }

            if (filterProjectId && note.project_id != filterProjectId) {
                match = false;
            }

            if (filterCreationDate && note.creation_date !== filterCreationDate) {
                match = false;
            }

            if (filterIsSeen && note.is_seen !== (filterIsSeen === 'true')) {
                match = false;
            }

            return match;
        });

        currentPage = 1;
        renderNotes();
    }

    document.getElementById('filterForm').addEventListener('submit', (event) => {
        event.preventDefault();
        applyFilters();
    });

    document.getElementById('filterModal').addEventListener('hidden.bs.modal', () => {
        applyFilters();
    });

    document.getElementById('noteModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('noteForm').reset();
    });

    function fetchNotes() {
        fetch('/api/notes')
            .then(response => response.json())
            .then(data => {
                notes = data;
                table_data = data;
                renderNotes();
            })
            .catch(error => console.error('Error fetching notes:', error));
    }

    function renderNotes() {
        const tableBody = document.getElementById('notes-table-body');
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * notesPerPage;
        const endIndex = startIndex + notesPerPage;
        const pageNotes = table_data.slice(startIndex, endIndex);
        pageNotes.forEach(note => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="noteId" style="color: rgb(255,255,255);">${note.note_id}</td>
                <td>
                    <button type="button" class="btn btn-primary show-description" data-bs-toggle="modal" data-bs-target="#descriptionModal" data-description="${note.note_description}">
                        Description
                    </button>
                </td>
                <td class="noteCreationDate" style="color: rgb(255,255,255);">${note.creation_date}</td>
                <td class="noteSender" style="color: rgb(255,255,255);">${note.sender}</td>
                <td class="noteReceiver" style="color: rgb(255,255,255);">${note.receiver}</td>
                <td class="noteProjectId" style="color: rgb(255,255,255);">${note.project_id}</td>
                <td class="noteIsSeen" style="color: rgb(255,255,255);">${note.is_seen ? 'Yes' : 'No'}</td>
                <td class="text-center align-middle" style="max-height: 60px;height: 60px;">
                    <a class="btn btnMaterial btn-flat success semicircle edit_note" role="button" style="color: rgb(0,197,179);">
                        <i class="fas fa-pen"></i>
                    </a>
                    <a class="delete_btn btn btnMaterial btn-flat accent btnNoBorders checkboxHover" role="button" style="margin-left: 5px;" data-bs-toggle="modal" data-bs-target="#delete-modal" href="#">
                        <i class="fas fa-trash btnNoBorders" style="color: #DC3545;"></i>
                    </a>
                </td>
            `;
            tableBody.appendChild(row);
        });

        

        const editBtns = document.querySelectorAll('.edit_note');
        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const noteId = row.querySelector('.noteId').textContent;
                const noteDescription = row.querySelector('.show-description').dataset.description;
                const noteSender = row.querySelector('.noteSender').textContent;
                const noteReceiver = row.querySelector('.noteReceiver').textContent;
                const noteProjectId = row.querySelector('.noteProjectId').textContent;
                const noteIsSeen = row.querySelector('.noteIsSeen').textContent === 'Yes';

                document.getElementById('id').value = noteId;
                document.getElementById('action').value = 'edit';
                document.getElementById('note_description').value = noteDescription;
                document.getElementById('note_sender').value = noteSender;
                document.getElementById('note_receiver').value = noteReceiver;
                document.getElementById('note_project_id').value = noteProjectId;
                document.getElementById('note_is_seen').checked = noteIsSeen;

                const modal = new bootstrap.Modal(document.getElementById('noteModal'));
                document.getElementById('noteModalLabel').textContent = 'Edit Note';
                modal.show();
            });
        });

        const delete_btn = document.querySelectorAll('.delete_btn');
        delete_btn.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const noteId = row.querySelector('.noteId').textContent;

                document.getElementById('id').value = noteId;
                document.getElementById('action').value = 'delete';

                const form = document.getElementById('noteForm');
                const formData = new FormData(form);

                fetch('/note_process', {
                    method: 'POST',
                    body: formData
                }).then(response => response.text())
                .then(responseText => {
                    if (responseText === 'success') {
                        notes = notes.filter(note => note.note_id != noteId);
                        table_data = notes;
                        renderNotes();
                    } else {
                        console.error('Failed to delete note.');
                        alert(responseText)
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
                        <h5 class="modal-title" id="descriptionModalLabel">Note Description</h5>
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
            modalBody.textContent = btn.dataset.description;
            modal.show();
        });
    });
    
        renderPagination();
    }

    function renderPagination() {
        let totalPages = Math.ceil(table_data.length / notesPerPage);
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

    fetchNotes();

    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.addEventListener('click', () => {
        currentPage--;
        renderNotes();
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        renderNotes();
    });

    const form = document.getElementById('noteForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        const noteDescription = document.getElementById('note_description').value;
        const noteSender = document.getElementById('note_sender').value;
        const noteReceiver = document.getElementById('note_receiver').value;
        const noteProjectId = document.getElementById('note_project_id').value;
        const noteIsSeen = document.getElementById('note_is_seen').checked;

        if (!noteDescription || !noteSender || !noteReceiver || !noteProjectId) {
            console.error('Please fill in all fields.');
            alert('Please fill in all fields.');
            return;
        }

        fetch('/note_process', {
            method: 'POST',
            body: formData
                }).then(response => response.text())
        .then(responseText => {
            if (responseText === 'success') {
                console.log('Form submitted successfully!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('noteModal'));
                modal.hide();
                fetchNotes();
                form.reset();
            } else {
                console.error('Form submission failed.');
                alert (responseText)
            }
        })
        .catch(error => {
            console.error('Network error:', error);
        });
    });


};
