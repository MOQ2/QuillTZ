from . import db , bcrypt
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from sqlalchemy import orm



class Clients(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True , autoincrement=True)
    id = db.synonym('user_id')
    user_email = db.Column(db.String(150), unique=True)
    password_hash = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    role = db.Column(db.String(50) , db.ForeignKey('user_role.role'))
    role_id = db.synonym('role')
    email = db.synonym('user_email')

    #role_id = db.Column(db.Integer, db.ForeignKey('user_role.role_id'), nullable=False)
    creation_date = db.Column(db.DateTime,  default=datetime.datetime.now())
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<Client {self.first_name} {self.last_name}>"

    @staticmethod
    def get_by_email(email):
        return Clients.query.filter_by(user_email=email).first()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Clients.query.all()

    # New method to update user information
    def update(self, first_name, last_name, user_email, role_id):
        self.first_name = first_name
        self.last_name = last_name
        self.user_email = user_email
        self.role_id = role_id
        db.session.commit()


class Service(db.Model):
    service_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    service_name = db.Column(db.String(50))
    department_id = db.Column(db.Integer, db.ForeignKey('department.department_id'))
    description = db.Column(db.Text)

    def __repr__(self):
        return f"<Service {self.service_name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Service.query.all()

    # New method to update service information
    def update(self, service_name, department_id, description):
        self.service_name = service_name
        self.department_id = department_id
        self.description = description
        db.session.commit()

    # New method to search services by service name
    @staticmethod
    def search_by_name(service_name):
        return Service.query.filter_by(service_name=service_name).all()

    # New method to search services by department ID
    @staticmethod
    def search_by_department_id(department_id):
        return Service.query.filter_by(department_id=department_id).all()

    # New method to search services by description
    @staticmethod
    def search_by_description(description):
        return Service.query.filter(Service.description.ilike(f"%{description}%")).all()



class Project(db.Model):
    project_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_name = db.Column(db.String(255))
    description = db.Column(db.Text)
    creator = db.synonym('creator_user_id')
    budget = db.Column(db.Numeric(10, 2) , default=10000.0)
    state = db.Column(db.Enum('new', 'pending', 'running', 'completed'))
    creator_user_id = db.Column(db.Integer, db.ForeignKey('clients.user_id'))
    creation_date = db.Column(db.DateTime, default=datetime.datetime.now())
    deadline_date = db.Column(db.Date)

    
    @orm.reconstructor
    def init_on_load(self):
        self.user_email = Clients.query.filter_by(user_id=self.creator_user_id).first().user_email
        self.user_name = Clients.query.filter_by(user_id=self.creator_user_id).first().first_name + " " + Clients.query.filter_by(user_id=self.creator_user_id).first().last_name

    def to_dict(self):
        return {
            'project_id': self.project_id,
            'project_name': self.project_name,
            'state': self.state,
            'budget': self.budget,
            'creation_date': self.creation_date,
            'deadline_date': self.deadline_date,
            'creator_user': self.user_email
        }


    def update_budget(self, budget):
        self.budget = budget
        db.session.commit()
    
    
    
    def update_description(self, description):
        self.description = description
        db.session.commit()
        
        
    def update_state(self, state):
            self.state = state
            db.session.commit()

    def __repr__(self):
        return f"<Project {self.project_name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Project.query.all()

    # New method to update project information
    def update(self, project_name, state, creator_user_id, deadline_date , budget):
        self.project_name = project_name
        self.state = state
        self.creator_user_id = creator_user_id
        self.deadline_date = deadline_date
        self.budget = budget
        db.session.commit()

    # New method to search projects by project name
    @staticmethod
    def search_by_name(project_name):
        return Project.query.filter_by(project_name=project_name).all()

    # New method to search projects by creator user ID
    @staticmethod
    def search_by_creator_user_id(creator_user_id):
        return Project.query.filter_by(creator_user_id=creator_user_id).all()

    # New method to search projects by state
    @staticmethod
    def search_by_state(state):
        return Project.query.filter_by(state=state).all()

    # New method to search projects by creation date
    @staticmethod
    def search_by_creation_date(creation_date):
        return Project.query.filter_by(creation_date=creation_date).all()

    # New method to search projects by deadline date
    @staticmethod
    def search_by_deadline_date(deadline_date):
        return Project.query.filter_by(deadline_date=deadline_date).all()

    # New method to search projects by remaining days for deadline
    @staticmethod
    def search_by_remaining_days(remaining_days):
        today = datetime.date.today()
        deadline = today + datetime.timedelta(days=remaining_days)
        return Project.query.filter(Project.deadline_date <= deadline).all()
    # new method to search return multiple projects by their id  
    @staticmethod
    def search_by_ids(project_ids):
        return Project.query.filter(Project.project_id.in_(project_ids)).all()
    
    def update_state(self, state):
        self.state = state
        db.session.commit()












class Employee(Clients):
    user_id = db.Column(db.Integer, db.ForeignKey('clients.user_id'), primary_key=True)
    salary = db.Column(db.Numeric(10, 2) , default=5000.0)
    department_id = db.Column(db.Integer , db.ForeignKey('department.department_id'))
    rating = db.Column(db.Enum('1', '2', '3', '4', '5') , default='3')

    def __repr__(self):
        return f"<Employee {self.first_name} {self.last_name}>"

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'user_email': self.user_email,
            'creation_date': self.creation_date,
            'role_id': self.role_id,
            'salary': self.salary,
            'department_id': self.department_id,
            'rating': self.rating
        }
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Employee.query.all()

    # New method to update employee information
    def update(self, first_name, last_name, user_email, role_id, salary, department_id, rating):
        self.first_name = first_name
        self.last_name = last_name
        self.user_email = user_email
        self.role_id = role_id
        self.salary = salary
        self.department_id = department_id
        self.rating = rating
        db.session.commit()

    # New method to search employees by salary
    @staticmethod
    def search_by_salary(salary):
        return Employee.query.filter_by(salary=salary).all()

    # New method to search employees by department ID
    @staticmethod
    def search_by_department_id(department_id):
        return Employee.query.filter_by(department_id=department_id).all()

    # New method to search employees by rating
    @staticmethod
    def search_by_rating(rating):
        return Employee.query.filter_by(rating=rating).all()











class EmployeeWorksonProject(db.Model):
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.user_id'), primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.project_id'), primary_key=True)

    def __repr__(self):
        return f"<EmployeeWorksOnProject {self.employee_id} - {self.project_id}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return EmployeeWorksonProject.query.all()

    # New method to search employee-project relationships by employee ID
    @staticmethod
    def search_by_employee_id(employee_id):
        return EmployeeWorksonProject.query.filter_by(employee_id=employee_id).all()

    # New method to search employee-project relationships by project ID
    @staticmethod
    def search_by_project_id(project_id):
        return EmployeeWorksonProject.query.filter_by(project_id=project_id).all()
    
    # update the employee project relationship
    def update(self, employee_id, project_id):
        self.employee_id = employee_id
        self.project_id = project_id
        db.session.commit()




class Department(db.Model):
    department_id = db.Column(db.Integer, primary_key=True)
    
    department_name = db.Column(db.String(150))
    description = db.Column(db.Text)

    def __repr__(self):
        return f"<Department {self.department_name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Department.query.all()

    # New method to update department information
    def update(self, department_name, description):
        self.department_name = department_name
        self.description = description
        db.session.commit()

    # New method to search departments by department name
    @staticmethod
    def search_by_name(department_name):
        return Department.query.filter_by(department_name=department_name).all()

    # New method to search departments by department description
    @staticmethod
    def search_by_description(department_description):
        return Department.query.filter_by(description=department_description).all()
    
    # New method to search departments by department id
    @staticmethod
    def search_by_id(department_id):
        return Department.query.filter_by(department_id=department_id).all()
    @staticmethod
    def get_total_budget():
        return db.session.query(db.func.sum(Project.budget)).join(Department, Department.department_id == Project.department_id).all()





class UserRole(db.Model):
    role = db.Column(db.String(50), primary_key=True)
    description = db.Column(db.String(450))


    def __repr__(self):
        return f"<UserRole {self.role_name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return UserRole.query.all()

    # New method to update user role information
    def update(self, role_name, role_description):
        self.role = role_name
        self.description = role_description
        db.session.commit()

    # New method to search user roles by role name
    @staticmethod
    def search_by_name(role_name):
        return UserRole.query.filter_by(role_name=role_name).all()

    # New method to search user roles by role description
    @staticmethod
    def search_by_description(role_description):
        return UserRole.query.filter_by(role_description=role_description).all()
    
    # New method to search user roles by role id
    @staticmethod
    def search_by_id(role_id):
        return UserRole.query.filter_by(role_id=role_id).all()


class Feedback(db.Model):
    feedback_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    feedback_description = db.Column(db.Text)
    rating = db.Column(db.Enum('1', '2', '3', '4', '5') , default='3')
    creation_date = db.Column(db.DateTime, default=datetime.datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey('clients.user_id'))
    project_id = db.Column(db.Integer, db.ForeignKey('project.project_id'))


    @orm.reconstructor
    def init_on_load(self):
        self.user = Clients.query.filter_by(user_id=self.user_id).first().user_email
        self.project_name = Project.query.filter_by(project_id=self.project_id).first().project_name

    def to_dict(self):
        return {
            'feedback_id': self.feedback_id,
            'feedback_description': self.feedback_description,
            'rating': self.rating,
            'creation_date': self.creation_date,
            'user_id': self.user_id,
            'project_id': self.project_id,
            'user': self.user,
        }



    def __repr__(self):
        return f"<Feedback {self.feedback_id}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Feedback.query.all()

    # New method to update feedback information
    def update(self, feedback_description, rating, user_id, project_id):
        self.feedback_description = feedback_description
        self.rating = rating
        self.user_id = user_id
        self.project_id = project_id
        db.session.commit()

    # New method to search feedbacks by user ID
    @staticmethod
    def search_by_user_id(user_id):
        return Feedback.query.filter_by(user_id=user_id).all()

    # New method to search feedbacks by project ID
    @staticmethod
    def search_by_project_id(project_id):
        return Feedback.query.filter_by(project_id=project_id).all()
    
    
class Files(db.Model):
    file_ref = db.Column(db.String(450), primary_key=True)
    name = db.Column(db.String(45))
    user_id = db.Column(db.Integer, db.ForeignKey('clients.user_id'))
    
    
    
    
    def __repr__(self):
        return f"<Files {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Files.query.all()

    # New method to search files by name
    @staticmethod
    def search_by_name(name):
        return Files.query.filter_by(name=name).all()



class FileProject(db.Model):
    file_ref = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, primary_key=True)
    assign_date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('clients.user_id'))
    
    def to_dict(self):
        file_name = self.file_ref.split('/')[-1]  # Assuming file_ref is a path
        return {
            'file_project_id': self.project_id,
            'file_name': file_name,
            'project_id': self.project_id,
            'assign_date': self.assign_date,
            'user_id': self.user_id
            }
    
    def __repr__(self):
        return f"<FileProject {self.file_ref} - {self.project_id}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return FileProject.query.all()

    # New method to search file-project relationships by file reference
    @staticmethod
    def search_by_file_ref(file_ref):
        return FileProject.query.filter_by(file_ref=file_ref).all()

    # New method to search file-project relationships by project ID
    @staticmethod
    def search_by_project_id(project_id):
        return FileProject.query.filter_by(project_id=project_id).all()

    # New method to update file-project relationship
    def update(self, assign_date, is_seen):
        self.assign_date = assign_date
        db.session.commit()






class Note(db.Model):
    note_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    note_description = db.Column(db.Text)
    creation_date = db.Column(db.DateTime, default=datetime.datetime.now())
    sender_user_id = db.Column(db.Integer, db.ForeignKey('clients.user_id'))
    receiver_user_id = db.Column(db.Integer, db.ForeignKey('clients.user_id'))
    project_id = db.Column(db.Integer, db.ForeignKey('project.project_id'))
    is_seen = db.Column(db.Boolean, default=False)

    @orm.reconstructor
    def init_on_load(self):
        self.sender = Clients.query.filter_by(user_id=self.sender_user_id).first().user_email
        self.receiver = Clients.query.filter_by(user_id=self.receiver_user_id).first().user_email
        self.project_name = Project.query.filter_by(project_id=self.project_id).first().project_name

    def to_dict(self):
        return {
            'note_id': self.note_id,
            'note_description': self.note_description,
            'creation_date': self.creation_date,
            'sender_user_id': self.sender_user_id,
            'receiver_user_id': self.receiver_user_id,
            'project_id': self.project_id ,
            'is_seen': self.is_seen,
            'sender': self.sender,
            'receiver': self.receiver
        }



    def __repr__(self):
        return f"<Note {self.note_id}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Note.query.all()

    # New method to update note information
    def update(self, note_description, sender_user_id, receiver_user_id, project_id, is_seen):
        self.note_description = note_description
        self.sender_user_id = sender_user_id
        self.receiver_user_id = receiver_user_id
        self.project_id = project_id
        self.is_seen = is_seen
        db.session.commit()

    # New method to search notes by sender user ID
    @staticmethod
    def search_by_sender_user_id(sender_user_id):
        return Note.query.filter_by(sender_user_id=sender_user_id).all()

    # New method to search notes by receiver user ID
    @staticmethod
    def search_by_receiver_user_id(receiver_user_id):
        return Note.query.filter_by(receiver_user_id=receiver_user_id).all()

    # New method to search notes by project ID
    @staticmethod
    def search_by_project_id(project_id):
        return Note.query.filter_by(project_id=project_id).all()

    # New method to search notes by seen status
    @staticmethod
    def search_by_seen_status(is_seen):
        return Note.query.filter_by(is_seen=is_seen).all()