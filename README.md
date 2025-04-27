
# QUILLTZ - Project Management System

## Overview
QUILLTZ is a web-based project management system built with Flask that allows organizations to manage projects, employees, clients, and various project-related activities. The system provides features for user authentication, project tracking, file management, communication through notes, and feedback collection.

## Features

### User Management
- User registration and authentication
- Role-based access control (Client, Employee, Manager)
- User profile management
- Secure password handling with bcrypt

### Project Management
- Create, edit, and delete projects
- Track project status (new, pending, running, completed)
- Project budget management
- Deadline tracking
- File attachments
- Project statistics and summaries

### Employee Management
- Employee registration and profiles
- Department assignment
- Performance rating
- Salary management
- Project assignment

### Communication
- Internal messaging system through notes
- Project feedback system
- File sharing
- Email notifications

### Reporting and Analytics
- Project status summaries
- Budget tracking
- Employee performance metrics
- Client activity tracking

## Technology Stack
- **Backend**: Python Flask
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: Flask-Login
- **Password Security**: Bcrypt
- **Forms**: Flask-WTF
- **ORM**: SQLAlchemy

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/QUILLTZ.git
cd QUILLTZ
```

2. Create and activate virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Configure the database
- Create a MySQL database
- Import the SQL files from the 

database

 folder
- Update database configuration in `config.py`

5. Run the application
```bash
python main.py
```

## Project Structure
```
QUILLTZ/
├── database/               # Database SQL files
├── website/
│   ├── __init__.py        # Flask app initialization
│   ├── auth.py            # Authentication routes
│   ├── forms.py           # Form classes
│   ├── models.py          # Database models
│   ├── views.py           # Main application routes
│   ├── static/            # Static files (CSS, JS, images)
│   └── templates/         # HTML templates
├── main.py                # Application entry point
├── config.py              # Configuration file
├── requirements.txt       # Python dependencies
└── README.md             # Project documentation
```

## Usage

### User Types and Access Levels

1. **Clients**
   - Create and monitor projects
   - Provide feedback
   - Upload files
   - Communicate through notes

2. **Employees**
   - Work on assigned projects
   - Update project status
   - Share files
   - Communicate with clients

3. **Managers**
   - Manage all projects
   - Assign employees
   - Monitor progress
   - Generate reports

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Commit your changes (

git commit -am 'Add new feature'

)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the 

LICENSE

 file for details.

## Author
Mohammad Qady

## Screenshots
// will be added soon...

## Contact
For any questions or feedback, please contact [mohammedoqady@gmail.com]
