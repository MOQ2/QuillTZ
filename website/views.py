from flask import Blueprint, render_template, redirect, url_for, flash, request , current_app , jsonify ,send_from_directory
from flask_login import login_user, logout_user, login_required, current_user
from .  import db , bcrypt
from .models import  Clients , Project, Employee , EmployeeWorksonProject , Department , Service , Note , Feedback , FileProject , Files
import datetime
import random
from .forms import RegistrationForm, LoginForm, EditProfileForm, ProjectForm, UpdateProjectStateForm ,AssignEmployeeForm
from datetime import datetime, timedelta
import os
from sqlalchemy import or_


views = Blueprint('views' , __name__)

@views.route('/')
def home () :
    if current_user.is_authenticated:
        if current_user.role_id == 'client':
            return redirect(url_for('views.dashboard'))
        elif current_user.role_id == 'employee':
            return redirect(url_for('views.employee_dashboard'))
        else:
            return redirect(url_for('views.manager_dashboard'))
    return render_template('index.html')

@views.route('/api/clients')
def get_client():
    users = Clients.query.filter(~Clients.user_id.in_(Employee.query.with_entities(Employee.user_id))).all()
    users_data = [{'id': user.user_id, 'first_name': user.first_name, 'last_name': user.last_name , 'email':user.user_email ,'creation_date':user.creation_date, 'role_id':user.role_id , } for user in users]
    return jsonify(users_data)





@views.route('/client')
@login_required
def emp_template () :
    return render_template('client.html')


@views.route('/client_process' , methods=['POST'])
def new_emp():

    action = request.form.get('action')
    user_id = request.form.get('id')
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    password = request.form.get('password')
    role_id = 'client'
    email = request.form.get('email')
    # Do something with the form data
    print(f'action: {action}')
    print(f'Name: {first_name} {last_name}')
    print(f'pass: {password}')
    print(f'Email: {email}')
    print(f'role_id: {role_id}')
    if action == 'add':
        if Clients.query.filter_by(user_email=email).first():
            return "email"
        client = Clients(user_email=email, first_name=first_name, last_name=last_name , role_id = role_id )
        client.set_password(password)
        client.save()
    elif action == 'edit': 
        user = Clients.query.get(user_id)
        if user:
            temp = Clients.query.filter_by(user_email=email).first()
            if  temp and temp.user_id != int(user_id) and temp.user_email == email:
                return "email"
            user.update(first_name, last_name, email, role_id)
    else : 
        user = Clients.query.get(user_id)
        if user : 
            try :
                user.delete()
            except:
                print("delete failed")
                db.session.rollback()
                return "delete"
    return ("success")







@views.route('/api/feedbacks')
def get_feedbacks():
    feedbacks = Feedback.get_all()
    feedbacks_data = [{
        'feedback_id': feedback.feedback_id,
        'feedback_description': feedback.feedback_description,
        'rating': feedback.rating,
        'creation_date': feedback.creation_date,
        'user': feedback.user,
        'project_id': feedback.project_id
    } for feedback in feedbacks]
    return jsonify(feedbacks_data)

@views.route('/feedback')
@login_required
def feedback_template():
    return render_template('feedbacks.html')

@views.route('/feedback_process', methods=['POST'])
def process_feedback():
    action = request.form.get('action')
    feedback_id = request.form.get('id')
    feedback_description = request.form.get('feedback_description')
    rating = request.form.get('rating')
    user = request.form.get('user')
    project_id = request.form.get('project_id')

    print(f'action: {action}')
    print(f'feedback_description: {feedback_description}')
    print(f'rating: {rating}')
    print(f'user: {user}')
    print(f'project_id: {project_id}')
    

    if action == 'add':
        if not rating or not user or not project_id:
            return "please make sure all fields are filled !!"
        if rating not in ['1', '2', '3', '4', '5']:
            return "rating must be between 1 and 5"
        user = Clients.get_by_email(user)
        if not user:
            return "User Email not found !!"
        user = user.user_id
        project = Project.query.get(project_id)
        if not project:
            return "project not found !!"
        feedback = Feedback(feedback_description=feedback_description, rating=rating, user_id=user, project_id=project_id)
        feedback.save()
    elif action == 'edit':
        if not rating or not user or not project_id:
            return "please make sure all fields are filled !!"
        if rating not in ['1', '2', '3', '4', '5']:
            return "rating must be between 1 and 5"
        user = Clients.get_by_email(user)
        if not user:
            return "User Email not found !!"
        user = user.user_id
        project = Project.query.get(project_id)
        if not project:
            return "project not found !!"
        
        feedback = Feedback.query.get(feedback_id)
        if feedback:
            feedback.update(feedback_description, rating, user, project_id)
    else:
        feedback = Feedback.query.get(feedback_id)
        if feedback:
            try :
                feedback.delete()
            except:
                print("delete failed")
                db.session.rollback()
                return "delete fiaild due to foreign key constraint" 
    return "success"




# notes 

@views.route('/api/notes')
def get_notes():
    notes = Note.get_all()
    notes_data = [{
        'note_id': note.note_id,
        'note_description': note.note_description,
        'creation_date': note.creation_date,
        'sender': note.sender,
        'receiver': note.receiver,
        'project_id': note.project_id,
        'is_seen': note.is_seen
    } for note in notes]
    return jsonify(notes_data)

@views.route('/note')
@login_required
def note_template():
    return render_template('note.html')

@views.route('/note_process', methods=['POST'])
def process_note():
    print(request.form)
    action = request.form.get('action')
    note_id = request.form.get('id')
    note_description = request.form.get('note_description')
    creation_date = request.form.get('note_creation_date')
    sender = request.form.get('note_sender')
    receiver = request.form.get('note_receiver')
    project_id = request.form.get('note_project_id')
    is_seen = request.form.get('note_is_seen')
    
    print(f'action: {action}')
    print(f'note_description: {note_description}')
    print(f'sender: {sender}')
    print(f'receiver: {receiver}')
    print(f'project_id: {project_id}')
    print(f'is_seen: {is_seen}')
    
    
    print(f'sender: {sender}')
    print(f'receiver: {receiver}')
    
    
    print(f'sender: {sender}')
    print(f'receiver: {receiver}')
    if action == 'add':
        sender= Clients.get_by_email(sender)
        receiver= Clients.get_by_email(receiver)
        if not sender:
            return "sender not found !!"
        if not receiver:
            return "receiver not found !!"
        project = Project.query.get(project_id)
        if not project:
            return "project not found !!"
        
        sender = sender.user_id
        receiver = receiver.user_id
        if is_seen == 'on':
            is_seen = 1
        else:
            is_seen = 0
        note = Note(note_description=note_description,  sender_user_id=sender, receiver_user_id=receiver, project_id=project_id, is_seen=is_seen)
        note.save()
        
    elif action == 'edit':
        sender= Clients.get_by_email(sender)
        receiver= Clients.get_by_email(receiver)
        if not sender:
            return "sender not found !!"
        if not receiver:
            return "receiver not found !!"
        project = Project.query.get(project_id)
        if not project:
            return "project not found !!"
        sender = sender.user_id
        receiver = receiver.user_id
        if is_seen == 'on':
            is_seen = 1
        else:
            is_seen = 0
        note = Note.query.get(note_id)
        if note:
            note.update(note_description, sender, receiver, project_id, is_seen)
        else :
            return "Note not edited !!"
    else:
        note = Note.query.get(note_id)
        if note:
            try :
                note.delete()
            except:
                print("delete failed due to foreign key constraint")
                db.session.rollback()
                return "delete failed due to foreign key constraint" 
    return "success"










## new view test 
@views.route('/api/projects')
def get_projects():
    projects = Project.get_all()
    projects_data = [{'id': project.project_id,'project_user_email':project.user_email , 'project_user_name':project.user_name   , 'name': project.project_name, 'state': project.state, 'creator_user_id': project.creator_user_id, 'deadline_date': project.deadline_date , 'description':project.description , 'creation_date':project.creation_date , 'budget':project.budget} for project in projects]
    return jsonify(projects_data)


@views.route('/project')
@login_required
def project_template():
    return render_template('projects.html')




@views.route('/project_process', methods=['POST'])
def process_project():
    action = request.form.get('action')
    project_id = request.form.get('id')
    project_name = request.form.get('project_name')
    state = request.form.get('project_status')
    description = request.form.get('project_description')
    creator_user_id = request.form.get('project_client')
    deadline_date = request.form.get('project_end_date')
    budget = request.form.get('project_budget')
    
    ## print all getted data
    print(f'action: {action}')
    print(f'project_name: {project_name}')
    print(f'state: {state}')
    print(f'description: {description}')
    print(f'creator_user_id: {creator_user_id}')
    print(f'deadline_date: {deadline_date}')
    print(f'budget: {budget}')
    # Do something with the form data
    
    if action == 'add':
        if Clients.query.get(creator_user_id):
            project = Project(budget=budget , project_name=project_name, state=state,description = description , creator_user_id=creator_user_id, deadline_date=deadline_date)
            project.save()
        else:
            return "user"
    elif action == 'edit':
        project = Project.query.get(project_id)
        if project:
            if Clients.query.get(creator_user_id):
                project.update(project_name, state, creator_user_id, deadline_date , budget)
            else :
                return "user"
        else:
            return "error"
            
    else:
        project = Project.query.get(project_id)
        if project:
            try:
                project.delete()
            except:
                print("delete failed")
                db.session.rollback()
                return "delete"
    return "success"





# create a view and routes for department as project and client
@views.route('/department')
@login_required
def department_template():
    return render_template('department.html')

@views.route('/api/department')
def get_department():
    department = Department.get_all()
    department_data = [{'id': department.department_id, 'name': department.department_name, 'description': department.description} for department in department]
    return jsonify(department_data)

@views.route('/department_process', methods=['POST'])
def process_department():
    action = request.form.get('action')
    department_id = request.form.get('id')
    department_name = request.form.get('department_name')
    description = request.form.get('description')
    
    print(f'action: {action}')
    print(f'department_name: {department_name}')
    print(f'department_id: {department_id}')
    print(f'description: {description}')
    # Do something with the form data
    
    if action == 'add':
        department = Department(department_name=department_name, description=description)
        department.save()
    elif action == 'edit':
        department = Department.query.get(department_id)
        if department:
            department.update(department_name, description)
    else:
        department = Department.search_by_id(department_id)
        
        if department:
            try:
                department[0].delete()
            except:
                print("delete failed")
                db.session.rollback()
                return "delete"
    return "success"





@views.route('/employee')
@login_required
def employee_template():
    return render_template('employee.html')

@views.route('/api/employees')
def get_employee():
    employees = Employee.get_all()
    employees_data = [{'id': employee.user_id, 'first_name': employee.first_name, 'last_name': employee.last_name, 'email': employee.user_email, 'role_id': employee.role_id, 'salary': employee.salary, 'department_id': employee.department_id, 'rating': employee.rating , 'creation_date':employee.creation_date} for employee in employees]
    return jsonify(employees_data)

@views.route('/employee_process', methods=['POST'])
def process_employee():
    action = request.form.get('action')
    employee_id = request.form.get('id')
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')
    password = request.form.get('password')
    role_id = 'employee'
    salary = request.form.get('salary')
    department_id = request.form.get('department_id')
    rating = request.form.get('rating')

    print(f'action: {action}')
    print(f'first_name: {first_name}')
    print(f'last_name: {last_name}')
    print(f'email: {email}')
    print(f'password: {password}')
    print(f'role_id: {role_id}')
    print(f'salary: {salary}')
    print(f'department_id: {department_id}')
    print(f'rating: {rating}')
    print(action)
    
    if action == 'add':
        if not Department.query.get(department_id):
            return "department"
        if Employee.query.filter_by(user_email=email).first():
            return "email"
        
        employee = Employee(user_email=email, first_name=first_name, last_name=last_name, role_id=role_id, salary=salary, department_id=department_id, rating=rating)
        employee.set_password(password)
        employee.save()
    elif action == 'edit':
        
        employee = Employee.query.get(employee_id)
        if employee:
            if not Department.query.get(department_id):
                return "department"
            
            temp = Clients.query.filter_by(user_email=email).first()

            if temp:

                if temp.user_id != int(employee_id)  and  temp.user_email == email:
                    print("email already exists")
                    return "email"
                
            employee.user_email = email
            employee.first_name = first_name
            employee.last_name = last_name
            employee.salary = salary
            employee.department_id = department_id
            employee.rating = rating
            if password:
                employee.set_password(password)
            employee.save()
    else:
        employee = Employee.query.get(employee_id)
        if employee:
            try :
                employee.delete()
            except:
                print("delete failed")
                db.session.rollback()
                return "delete"
            
    return "success"




# create a service route for services
@views.route('/api/services')
def get_services():
    services = Service.get_all()
    services_data = [{'id': service.service_id, 'name': service.service_name, 'description': service.description, 'department_id': service.department_id} for service in services]
    return jsonify(services_data)

@views.route('/service')
def service_template():
    return render_template('services.html')

@views.route('/service_process', methods=['POST'])
def process_service():
    action = request.form.get('action')
    service_id = request.form.get('id')
    service_name = request.form.get('service_name')
    description = request.form.get('service_description')
    department_id = request.form.get('service_department')

    print(f'action: {action}')
    print(f'service_name: {service_name}')
    print(f'service_id: {service_id}')
    print(f'description: {description}')
    print(f'service_department: {department_id}')

    if action == 'add':
        service = Service(service_name=service_name, description=description, department_id=department_id)
        service.save()
    elif action == 'edit':
        service = Service.query.get(service_id)
        if service:
            service.name = service_name
            service.description = description
            service.department_id = department_id
            service.save()
    else:
        service = Service.query.get(service_id)
        if service:
            service.delete()

    return "success"


###
###
######################## new routes 
###
###




# client dashboard
@views.route('/dashboard', methods=['GET'])
@login_required
def dashboard():
    if current_user.role != 'client':
        return redirect(url_for('views.home'))

    # Load initial set of projects without any filters
    page = request.args.get('page', 1, type=int)
    per_page = 10

    query = Project.query.filter(Project.creator_user_id == current_user.user_id)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    projects = pagination.items

    project_employee_map = {
        project.project_id: Employee.query.join(EmployeeWorksonProject).filter(EmployeeWorksonProject.project_id == project.project_id).all()
        for project in projects
    }

    return render_template(
        'dashboard.html',
        title='Client Dashboard',
        projects=projects,
        project_employee_map=project_employee_map,
        pagination=pagination
    )

# filter projects of client
@views.route('/filter_projects_clients', methods=['POST'])
@login_required
def filter_projects_clients():
    if current_user.role != 'client':
        return redirect(url_for('views.home'))

    state = request.form.get('state')
    min_budget = request.form.get('min_budget')
    max_budget = request.form.get('max_budget')
    creation_date = request.form.get('creation_date')
    deadline_date = request.form.get('deadline_date')
    order_by = request.form.get('order_by', 'creation_date')
    order_direction = request.form.get('order_direction', 'asc')
    page = int(request.form.get('page', 1))
    per_page = 10

    query = Project.query.filter(Project.creator_user_id == current_user.user_id)

    if state and state != "All":
        query = query.filter(Project.state == state)
    if min_budget:
        query = query.filter(Project.budget >= min_budget)
    if max_budget:
        query = query.filter(Project.budget <= max_budget)
    if creation_date:
        query = query.filter(Project.creation_date >= creation_date)
    if deadline_date:
        query = query.filter(Project.deadline_date <= deadline_date)

    if order_direction == 'asc':
        query = query.order_by(getattr(Project, order_by).asc())
    else:
        query = query.order_by(getattr(Project, order_by).desc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    projects = pagination.items

    project_employee_map = {
        project.project_id: Employee.query.join(EmployeeWorksonProject).filter(EmployeeWorksonProject.project_id == project.project_id).all()
        for project in projects
    }

    projects_html = render_template(
        '_projects.html',
        projects=projects,
        project_employee_map=project_employee_map,
        pagination=pagination
    )
    return jsonify({'projects_html': projects_html})







#edit profile route
@views.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            current_user.first_name = form.first_name.data
            current_user.last_name = form.last_name.data
            current_user.user_email = form.email.data
            
            
            if form.password.data:
                current_user.set_password(form.password.data)
            db.session.commit()
            flash('Your profile has been updated!', 'success')
            if current_user.role_id == 'client':
                return redirect(url_for('views.dashboard'))
            elif current_user.role_id == 'employee':
                return redirect(url_for('views.employee_dashboard'))
            else:
                return redirect(url_for('views.manager_dashboard'))
        
    elif request.method == 'GET':
        form.first_name.data = current_user.first_name
        form.last_name.data = current_user.last_name
        form.email.data = current_user.user_email
    return render_template('edit_profile.html', title='Edit Profile', form=form)

@views.route('/create_project', methods=['GET', 'POST'])
@login_required
def create_project():
    if current_user.role_id != 'client':
        return redirect(url_for('views.home'))
    
    form = ProjectForm()
    
    print(form)
    if form.validate_on_submit():  # Ensure form is validated on submit
        project = Project(
            project_name=form.project_name.data,
            description=form.description.data,
            budget=form.budget.data,
            state='new',
            creator_user_id=current_user.user_id,
            deadline_date=form.deadline_date.data
        )
        db.session.add(project)
        db.session.commit()
        flash('Project has been created!', 'success')
        return redirect(url_for('views.dashboard'))
    
    return render_template('create_project.html', title='Create Project', form=form)
######################







### new employee Dashboard

from flask import render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_required, current_user
from .models import Project, Employee, EmployeeWorksonProject, Note, Files, FileProject, Feedback, Clients
from datetime import datetime, timedelta

def convert_to_datetime(date):
    if isinstance(date, str):
        try:
            return datetime.strptime(date, '%Y-%m-%d %H:%M:%S')  # Adjust format to match your date string format
        except ValueError as e:
            print(f"Date conversion error: {e}")
            return None
    return date




@views.route('/employee_dashboard')
@login_required
def employee_dashboard():
    if current_user.role_id != 'employee':
        return redirect(url_for('views.home'))

    # Filters
    state_filter = request.args.get('state', '')
    min_budget = request.args.get('min_budget', type=float)
    max_budget = request.args.get('max_budget', type=float)
    deadline_before = request.args.get('deadline_before', type=str)
    deadline_after = request.args.get('deadline_after', type=str)
    remaining_days = request.args.get('remaining_days', type=int)

    # Sorting
    order = request.args.get('order', 'asc')
    sort_by = request.args.get('sort_by', 'project_id')

    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = 10

    # Base query
    query = db.session.query(Project).join(EmployeeWorksonProject).filter(EmployeeWorksonProject.employee_id == current_user.user_id)

    # Apply filters
    if state_filter:
        query = query.filter(Project.state == state_filter)
    if min_budget is not None:
        query = query.filter(Project.budget >= min_budget)
    if max_budget is not None:
        query = query.filter(Project.budget <= max_budget)
    if deadline_before:
        query = query.filter(Project.deadline_date <= datetime.strptime(deadline_before, '%Y-%m-%d'))
    if deadline_after:
        query = query.filter(Project.deadline_date >= datetime.strptime(deadline_after, '%Y-%m-%d'))
    if remaining_days is not None:
        query = query.filter(Project.deadline_date <= datetime.now() + timedelta(days=remaining_days))
        

    # Apply sorting
    if order == 'asc':
        query = query.order_by(getattr(Project, sort_by).asc())
    else:
        query = query.order_by(getattr(Project, sort_by).desc())

    # Apply pagination
    projects = query.paginate(page=page, per_page=per_page, error_out=False)

    # Fetch recent feedbacks and notes for the dashboard
    feedbacks = Feedback.query.join(Project).join(EmployeeWorksonProject).filter(EmployeeWorksonProject.employee_id == current_user.user_id).order_by(Feedback.creation_date.desc()).limit(10).all()
    
    notes = Note.query.filter(or_(Note.receiver_user_id == current_user.user_id, Note.sender_user_id == current_user.user_id)).order_by(Note.creation_date.desc()).limit(10).all()
    print(notes)
    
    
    
    return render_template('employee_dashboard.html', title='Employee Dashboard',pagination= projects ,  projects=projects, feedbacks=feedbacks, notes=notes, state_filter=state_filter, min_budget=min_budget, max_budget=max_budget, deadline_before=deadline_before, deadline_after=deadline_after, remaining_days=remaining_days, order=order, sort_by=sort_by)


##############33
############
###############

@views.route('/project/<int:project_id>')
@login_required
def project_detail(project_id):
    project = Project.query.get_or_404(project_id)
    if current_user.role_id not in ['employee', 'client'] and not EmployeeWorksonProject.query.filter_by(project_id=project_id, employee_id=current_user.user_id).first():
        return redirect(url_for('views.home'))

    
    feedbacks = Feedback.query.filter_by(project_id=project_id).order_by(Feedback.creation_date.desc()).all()
    notes = Note.query.filter(or_(Note.receiver_user_id == current_user.user_id, Note.sender_user_id == current_user.user_id)).order_by(Note.creation_date.desc()).limit(10).all()
    files = FileProject.query.filter_by(project_id=project_id).all()
    return render_template('project_detail.html', title='Project Details', project=project, feedbacks=feedbacks, notes=notes, files=files, current_user=current_user)

@views.route('/send_note', methods=['POST'])
@login_required
def send_note():
    receiver_email = request.form.get('receiver_email')
    project_id = request.form.get('project_id')
    note_description = request.form.get('note_description')
    receiver = Clients.query.filter_by(user_email=receiver_email).first()

    if not receiver:
        flash('Receiver not found', 'danger')
        return redirect(request.referrer)
    if not note_description:
        flash('Note description is required', 'danger')
        return redirect(request.referrer)
    if not project_id:
        flash('Project ID is required', 'danger')
        return redirect(request.referrer)
    if not Project.query.get(project_id):
        flash('Project not found', 'danger')
        return redirect(request.referrer)
    note = Note(
        note_description=note_description,
        sender_user_id=current_user.user_id,
        receiver_user_id=receiver.user_id,
        project_id=project_id
    )
    db.session.add(note)
    db.session.commit()
    flash('Note sent successfully', 'success')
    return redirect(request.referrer)

@views.route('/add_file', methods=['POST'])
@login_required
def add_file():
    project_id = request.form.get('project_id')
    file = request.files['file']
    user_id = current_user.user_id
    if file:
        filename = file.filename
        upload_folder = os.path.join(current_app.root_path, 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        new_file = Files.query.filter_by(file_ref=file_path).first()
        if not new_file:
            new_file = Files(name=filename,user_id = user_id , file_ref=file_path)
            db.session.add(new_file)
            db.session.commit()

        file_project = FileProject(file_ref=new_file.file_ref,user_id=current_user.user_id, project_id=project_id, assign_date=datetime.now())
        db.session.add(file_project)
        db.session.commit()
        flash('File added successfully', 'success')
    return redirect(request.referrer)

@views.route('/download_file/<path:filename>')
def download_file(filename):
    filename = Files.query.filter_by(file_ref=filename).first().name
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename, as_attachment=True)



##  employee page details 



@views.route('/manager_employee/<int:employee_id>')
@login_required
def manager_employee_detail(employee_id):
    if current_user.role_id != 'manager':
        flash('Unauthorized action', 'danger')
        return redirect(url_for('views.home'))

    employee = Employee.query.get_or_404(employee_id)
    return render_template('manager_employee_detail.html', title='Employee Details', employee=employee, current_user=current_user)

@views.route('/api/employee_projects/<int:employee_id>', methods=['GET'])
@login_required
def get_employee_projects(employee_id):
    filters = request.args
    start_creation_date = filters.get('start_creation_date')
    end_creation_date = filters.get('end_creation_date')
    start_deadline_date = filters.get('start_deadline_date')
    end_deadline_date = filters.get('end_deadline_date')
    remaining_days = filters.get('remaining_days')
    creator_user = filters.get('creator_user')
    sort_by = filters.get('field', 'project_id')
    order = filters.get('order', 'asc')
    page = int(filters.get('page', 1))
    per_page = 10
    query = Project.query.join(EmployeeWorksonProject).filter(EmployeeWorksonProject.employee_id == employee_id)

    
    print(sort_by)

    if start_creation_date:
        query = query.filter(Project.creation_date >= start_creation_date)
    if end_creation_date:
        query = query.filter(Project.creation_date <= end_creation_date)
    if start_deadline_date:
        query = query.filter(Project.deadline_date >= start_deadline_date)
    if end_deadline_date:
        query = query.filter(Project.deadline_date <= end_deadline_date)
    if remaining_days:
        query = query.filter(Project.deadline_date <= datetime.now() + timedelta(days=int(remaining_days)), Project.deadline_date >= datetime.today())
    if creator_user:
        user_id = Clients.query.filter_by(user_email=creator_user).first()
        query = query.filter(Project.creator_user_id == user_id.user_id)

    if sort_by in ['creation_date', 'deadline_date', 'budget', 'project_name', 'state', 'project_id']:
        if order == 'asc':
            query = query.order_by(getattr(Project, sort_by).asc())
        else:
            query = query.order_by(getattr(Project, sort_by).desc())

    projects = query.paginate(page=page, per_page=per_page, error_out=False)
    project_items = [project.to_dict() for project in projects.items]
    return jsonify({'projects': project_items, 'total': projects.total})

@views.route('/api/employee_feedbacks/<int:employee_id>', methods=['GET'])
@login_required
def get_employee_feedbacks(employee_id):
    filters = request.args
    project_id = filters.get('project_id')
    sort_by = filters.get('field', 'creation_date')
    order = filters.get('order', 'asc')
    page = int(filters.get('page', 1))
    per_page = 10
    query = Feedback.query.join(Project).filter(Project.project_id.in_([ep.project_id for ep in EmployeeWorksonProject.query.filter_by(employee_id=employee_id)]))

    if project_id:
        query = query.filter(Feedback.project_id == project_id)

    if sort_by in ['creation_date', 'rating', 'feedback_description' ,'note_id' , 'project_id']:
        if order == 'asc':
            query = query.order_by(getattr(Feedback, sort_by).asc())
        else:
            query = query.order_by(getattr(Feedback, sort_by).desc())

    feedbacks = query.paginate(page=page, per_page=per_page, error_out=False)
    feedback_items = [feedback.to_dict() for feedback in feedbacks.items]
    return jsonify({'feedbacks': feedback_items, 'total': feedbacks.total})

@views.route('/api/employee_notes/<int:employee_id>', methods=['GET'])
@login_required
def get_employee_notes(employee_id):
    filters = request.args
    project_id = filters.get('project_id')
    sort_by = filters.get('field', 'creation_date')
    order = filters.get('order', 'asc')
    page = int(filters.get('page', 1))
    per_page = 10

    query = Note.query.filter(or_(Note.sender_user_id == employee_id, Note.receiver_user_id == employee_id))

    if project_id:
        query = query.filter(Note.project_id == project_id)

    if sort_by in ['creation_date' , 'note_id' , 'note_description' , 'project_id' ]:
        if order == 'asc':
            query = query.order_by(getattr(Note, sort_by).asc())
        else:
            query = query.order_by(getattr(Note, sort_by).desc())

    notes = query.paginate(page=page, per_page=per_page, error_out=False)
    note_items = [note.to_dict() for note in notes.items]
    return jsonify({'notes': note_items, 'total': notes.total})

@views.route('/api/employee_files/<int:employee_id>', methods=['GET'])
@login_required
def get_employee_files(employee_id):
    filters = request.args
    project_id = filters.get('project_id')
    sort_by = filters.get('field', 'assign_date')
    order = filters.get('order', 'asc')
    page = int(filters.get('page', 1))
    per_page = 10

    query = FileProject.query.join(Files, FileProject.file_ref == Files.file_ref).filter(Files.user_id == employee_id)
    if project_id:
        query = query.filter(FileProject.project_id == project_id)

    if sort_by in ['assign_date', 'project_id']:
        if order == 'asc':
            query = query.order_by(getattr(FileProject, sort_by).asc())
        else:
            query = query.order_by(getattr(FileProject, sort_by).desc())

    files = query.paginate(page=page, per_page=per_page, error_out=False)
    file_items = [file.to_dict() for file in files.items]
    return jsonify({'files': file_items, 'total': files.total})



##############################################
##############################################
#############################################
@views.route('/api/employee_summary/<int:employee_id>', methods=['GET'])
@login_required
def get_employee_summary(employee_id):
    # Ensure the employee exists
    employee = Employee.query.get_or_404(employee_id)

    # Total projects the employee is working on
    total_projects = db.session.query(EmployeeWorksonProject).filter_by(employee_id=employee_id).count()

    # Calculate total budget of projects the employee is working on
    total_budget = db.session.query(db.func.sum(Project.budget)).join(EmployeeWorksonProject).filter(EmployeeWorksonProject.employee_id == employee_id).scalar() or 0

    # Get project IDs that the employee is working on
    project_ids = db.session.query(EmployeeWorksonProject.project_id).filter(EmployeeWorksonProject.employee_id == employee_id).all()
    project_ids = [pid[0] for pid in project_ids]  # Convert from tuple to list of IDs

    # Total feedbacks related to the projects
    total_feedbacks = db.session.query(Feedback).filter(Feedback.project_id.in_(project_ids)).count()

    # Calculate average feedback rating for projects the employee worked on
    avg_feedback = db.session.query(db.func.avg(Feedback.rating)).filter(Feedback.project_id.in_(project_ids)).scalar() or 0

    # Total notes involving the employee
    total_notes = db.session.query(Note).filter((Note.sender_user_id == employee_id) | (Note.receiver_user_id == employee_id)).count()

    # Total files uploaded by the employee
    total_files = db.session.query(Files).filter_by(user_id=employee_id).count()

    # Return the summary data as JSON
    return jsonify({
        'total_projects': total_projects,
        'total_budget': total_budget,
        'total_feedbacks': total_feedbacks,
        'avg_feedback': avg_feedback,
        'total_notes': total_notes,
        'total_files': total_files
    })





@views.route('/api/client_summary/<int:client_id>', methods=['GET'])
@login_required
def get_client_summary(client_id):
    # Ensure the client exists
    client = Clients.query.get_or_404(client_id)

    # Total projects and total budget
    total_projects = Project.query.filter_by(creator_user_id=client_id).count()
    total_budget = db.session.query(db.func.sum(Project.budget)).filter_by(creator_user_id=client_id).scalar() or 0

    # Total feedbacks and average rating
    feedback_query = Feedback.query.filter_by(user_id=client_id)
    total_feedbacks = feedback_query.count()
    avg_feedback = db.session.query(db.func.avg(Feedback.rating)).filter_by(user_id=client_id).scalar() or 0

    # Total notes
    total_notes = Note.query.filter((Note.sender_user_id == client_id) | (Note.receiver_user_id == client_id)).count()

    # Total files
    total_files = Files.query.filter_by(user_id=client_id).count()

    # Return the summary data as JSON
    return jsonify({
        'total': total_projects,
        'total_budget': total_budget,
        'total_feedbacks': total_feedbacks,
        'avg_feedback': avg_feedback,
        'total_notes': total_notes,
        'total_files': total_files
    })







# client details/report for manager

@views.route('/client/<int:client_id>')
@login_required
def client_detail(client_id):
    if current_user.role_id != 'manager':
        flash('Unauthorized action', 'danger')
        return redirect(url_for('views.home'))

    client = Clients.query.get_or_404(client_id)
    return render_template('client_detail.html', title='Client Details', client=client, current_user=current_user)

@views.route('/api/client_projects/<int:client_id>', methods=['GET'])
@login_required
def get_client_projects(client_id):
    filters = request.args
    start_creation_date = filters.get('start_creation_date')
    end_creation_date = filters.get('end_creation_date')
    start_deadline_date = filters.get('start_deadline_date')
    end_deadline_date = filters.get('end_deadline_date')
    remaining_days = filters.get('remaining_days')
    sort_by = filters.get('field', 'project_id')
    order = filters.get('order', 'asc')
    page = int(filters.get('page', 1))
    per_page = 10
    query = Project.query.filter(Project.creator_user_id == client_id)

    if start_creation_date:
        query = query.filter(Project.creation_date >= start_creation_date)
    if end_creation_date:
        query = query.filter(Project.creation_date <= end_creation_date)
    if start_deadline_date:
        query = query.filter(Project.deadline_date >= start_deadline_date)
    if end_deadline_date:
        query = query.filter(Project.deadline_date <= end_deadline_date)
    if remaining_days:
        query = query.filter(Project.deadline_date <= datetime.now() + timedelta(days=int(remaining_days)), Project.deadline_date >= datetime.today())

    if sort_by in ['creation_date', 'deadline_date', 'budget', 'project_name', 'state', 'project_id']:
        if order == 'asc':
            query = query.order_by(getattr(Project, sort_by).asc())
        else:
            query = query.order_by(getattr(Project, sort_by).desc())

    projects = query.paginate(page=page, per_page=per_page, error_out=False)
    project_items = [project.to_dict() for project in projects.items]
    return jsonify({'projects': project_items, 'total': projects.total})

@views.route('/api/client_feedbacks/<int:client_id>', methods=['GET'])
@login_required
def get_client_feedbacks(client_id):
    filters = request.args
    project_id = filters.get('project_id')
    sort_by = filters.get('field', 'creation_date')
    order = filters.get('order', 'asc')
    page = int(filters.get('page', 1))
    per_page = 10
    query = Feedback.query.filter(Feedback.user_id == client_id)

    if project_id:
        query = query.filter(Feedback.project_id == project_id)

    if sort_by in ['creation_date', 'rating', 'feedback_description' , 'note_id' , 'project_id']:
        if order == 'asc':
            query = query.order_by(getattr(Feedback, sort_by).asc())
        else:
            query = query.order_by(getattr(Feedback, sort_by).desc())

    feedbacks = query.paginate(page=page, per_page=per_page, error_out=False)
    feedback_items = [feedback.to_dict() for feedback in feedbacks.items]
    return jsonify({'feedbacks': feedback_items, 'total': feedbacks.total})



@views.route('/api/client_notes/<int:client_id>', methods=['GET'])
@login_required
def get_client_notes(client_id):
    filters = request.args
    project_id = filters.get('project_id')
    sort_by = filters.get('field', 'creation_date')
    order = filters.get('order', 'asc')
    page = int(filters.get('page', 1))
    per_page = 10

    query = Note.query.filter(or_(Note.sender_user_id == client_id, Note.receiver_user_id == client_id))

    if project_id:
        query = query.filter(Note.project_id == project_id)

    if sort_by in ['creation_date', 'note_id' , 'note_description' , 'project_id']:
        if order == 'asc':
            query = query.order_by(getattr(Note, sort_by).asc())
        else:
            query = query.order_by(getattr(Note, sort_by).desc())

    notes = query.paginate(page=page, per_page=per_page, error_out=False)
    note_items = [note.to_dict() for note in notes.items]
    return jsonify({'notes': note_items, 'total': notes.total})

@views.route('/api/client_files/<int:client_id>', methods=['GET'])
@login_required
def get_client_files(client_id):
    filters = request.args
    project_id = filters.get('project_id')
    sort_by = filters.get('field', 'assign_date')
    order = filters.get('order', 'asc')
    page = int(filters.get('page', 1))
    per_page = 10

    query = FileProject.query.join(Files, FileProject.file_ref == Files.file_ref).filter(FileProject.user_id == client_id)
    
    if project_id:
        query = query.filter(FileProject.project_id == project_id)

    if sort_by in ['assign_date', 'project_id']:
        if order == 'asc':
            query = query.order_by(getattr(FileProject, sort_by).asc())
        else:
            query = query.order_by(getattr(FileProject, sort_by).desc())

    files = query.paginate(page=page, per_page=per_page, error_out=False)
    file_items = [file.to_dict() for file in files.items]
    return jsonify({'files': file_items, 'total': files.total})








### 

@views.route('/add_feedback', methods=['POST'])
@login_required
def add_feedback():
    if current_user.role_id != 'client':
        flash('Unauthorized action', 'danger')
        return redirect(url_for('views.home'))

    project_id = request.form.get('project_id')
    feedback_description = request.form.get('feedback_description')
    rating = request.form.get('rating')

    feedback = Feedback(
        feedback_description=feedback_description,
        rating=rating,
        user_id=current_user.user_id,
        project_id=project_id
    )
    feedback.save()
    flash('Feedback added successfully', 'success')
    return redirect(request.referrer)



#####
#####
#####
####


@views.route('/filter_projects', methods=['GET'])
@login_required
def filter_projects():
    if current_user.role_id != 'employee':
        return jsonify({'error': 'Unauthorized access'}), 403

    # Filters
    state_filter = request.args.get('state', '')
    min_budget = request.args.get('min_budget', type=float)
    max_budget = request.args.get('max_budget', type=float)
    deadline_before = request.args.get('deadline_before', type=str)
    deadline_after = request.args.get('deadline_after', type=str)
    remaining_days = request.args.get('remaining_days', type=int)

    # Sorting
    order = request.args.get('order', 'asc')
    sort_by = request.args.get('sort_by', 'project_id')

    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = 10

    # Base query
    query = db.session.query(Project).join(EmployeeWorksonProject).filter(EmployeeWorksonProject.employee_id == current_user.user_id)

    # Apply filters
    if state_filter:
        query = query.filter(Project.state == state_filter)
    if min_budget is not None:
        query = query.filter(Project.budget >= min_budget)
    if max_budget is not None:
        query = query.filter(Project.budget <= max_budget)
    if deadline_before:
        query = query.filter(Project.deadline_date <= datetime.strptime(deadline_before, '%Y-%m-%d'))
    if deadline_after:
        query = query.filter(Project.deadline_date >= datetime.strptime(deadline_after, '%Y-%m-%d'))
    if remaining_days is not None:
        query = query.filter(Project.deadline_date <= datetime.now() + timedelta(days=remaining_days) , Project.deadline_date >= datetime.today())

    # Apply sorting
    if sort_by in ['creation_date', 'deadline_date', 'budget', 'project_name', 'state']:
        if order == 'asc':
            query = query.order_by(getattr(Project, sort_by).asc())
        else:
            query = query.order_by(getattr(Project, sort_by).desc())

    # Apply pagination
    projects = query.paginate(page=page, per_page=per_page, error_out=False)

    # Render the projects as HTML
    project_items_html = render_template('partials/project_items.html', projects=projects.items)
    pagination_html = render_template('partials/pagination.html', pagination=projects)

    return jsonify({'project_items_html': project_items_html, 'pagination_html': pagination_html})




## project details for manager

@views.route('/manager_project/<int:project_id>')
@login_required
def manager_project_detail(project_id):
    if current_user.role_id != 'manager':
        flash('Unauthorized action', 'danger')
        return redirect(url_for('views.home'))

    project = Project.query.get_or_404(project_id)
    feedbacks = Feedback.query.filter_by(project_id=project_id).order_by(Feedback.creation_date.desc()).all()
    notes = Note.query.filter_by(project_id=project_id).order_by(Note.creation_date.desc()).all()
    files = FileProject.query.filter_by(project_id=project_id).all()
    employees = Employee.query.join(EmployeeWorksonProject).filter(EmployeeWorksonProject.project_id == project_id).all()

    # Summary report data
    total_feedbacks = len(feedbacks)
    average_rating = round(sum([int(feedback.rating) for feedback in feedbacks]) / total_feedbacks, 2) if total_feedbacks > 0 else 0
    total_cost = sum([employee.salary for employee in employees])
    total_employees = len(employees)

    return render_template('manager_project_detail.html', 
                        title='Project Details', 
                        project=project, 
                        feedbacks=feedbacks,
                        employees = employees,
                        notes=notes, 
                        files=files,
                        total_feedbacks=total_feedbacks,
                        average_rating=average_rating,
                        total_cost=total_cost,
                        total_employees=total_employees,
                        current_user=current_user)


## fetch employee details that work on project 
@views.route('/api/project_employee/<int:project_id>', methods=['GET'])
@login_required
def get_project_employee(project_id):
    if current_user.role_id != 'manager':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    project = Project.query.get_or_404(project_id)
    employees = Employee.query.join(EmployeeWorksonProject).filter(EmployeeWorksonProject.project_id == project_id).all()
    employee_items = [employee.to_dict() for employee in employees]
    return jsonify({'employees': employee_items})









###################### Employee Dashboard
@views.route('/manager_dashboard')
@login_required
def manager_dashboard():
    if current_user.role != 'manager':
        return redirect(url_for('views.home'))
    total_budget = db.session.query(db.func.sum(Project.budget)).scalar()
    recent_clients = Clients.query.filter_by(role_id='client').order_by(Clients.creation_date.desc()).limit(5).all()
    recent_employees = Employee.query.order_by(Employee.creation_date.desc()).limit(5).all()
    best_employee = Employee.query.order_by(Employee.rating.desc()).first()
    recent_projects = Project.query.order_by(Project.creation_date.desc()).limit(5).all()
    departments = Department.query.all()
    department_salaries = {dept.department_name: db.session.query(db.func.sum(Employee.salary)).filter(Employee.department_id == dept.department_id).scalar() for dept in departments}
    return render_template(
        'manager_dashboard.html',
        title='Manager Dashboard',
        total_budget=total_budget,
        recent_clients=recent_clients,
        recent_employees=recent_employees,
        best_employee=best_employee,
        recent_projects=recent_projects,
        department_budgets=department_salaries
    )




## update the project state
@views.route('/update_project_state/<int:project_id>', methods=['GET', 'POST'])
@login_required
def update_project_state(project_id):
    project = Project.query.get_or_404(project_id)
    if current_user.role_id != 'employee' or not EmployeeWorksonProject.query.filter_by(employee_id=current_user.user_id, project_id=project_id).first():
        return redirect(url_for('views.home'))
    form = UpdateProjectStateForm()
    if form.validate_on_submit():
        project.update_state(form.state.data)
        flash('Project state has been updated!', 'success')
        return redirect(url_for('views.employee_dashboard'))
    return render_template('update_project_state.html', title='Update Project State', form=form, project=project)




####
#### assign employee to project
#####


@views.route('/assign_employee', methods=['GET', 'POST'])
@login_required
def assign_employee():
    if current_user.role_id != 'manager':
        return redirect(url_for('views.home'))

    selected_project_id = request.args.get('project_id')
    print("slerted project id is ")
    print(selected_project_id)
    assigned_employee_ids = []
    if selected_project_id:
        assigned_employees = EmployeeWorksonProject.query.filter_by(project_id=selected_project_id).all()
        assigned_employee_ids = [emp.employee_id for emp in assigned_employees]

    if request.method == 'POST' and 'assign' in request.form:
        
        project_id = request.form.get('project_id')
        if not project_id:
            flash('Please select a project first!', 'danger')
            return redirect(url_for('views.assign_employee'))

        selected_employees = request.form.getlist('employeesSelected') ## was employees 
        EmployeeWorksonProject.query.filter_by(project_id=project_id).delete()
        for emp_id in selected_employees:
            assignment = EmployeeWorksonProject(employee_id=emp_id, project_id=project_id)
            db.session.add(assignment)
        db.session.commit()
        flash('Employees have been assigned to the project!', 'success')
        return redirect(url_for('views.assign_employee'))

    return render_template('assign_employee.html', title='Assign Employee', assigned_employee_ids=assigned_employee_ids, selected_project_id=selected_project_id)
@views.route('/filter_projects_ass', methods=['GET'])
@login_required
def filter_projects_ass():
    if current_user.role_id != 'manager':
        return redirect(url_for('views.home'))

    project_filter_name = request.args.get('filter_project_name', '')
    project_filter_state = request.args.get('filter_project_state', '')
    project_filter_creation_date_berfore = request.args.get('filter_creation_date_before', '')
    project_filter_creation_date_after = request.args.get('filter_creation_date_after', '')
    project_filter_deadline_berfore = request.args.get('filter_deadline_before', '')
    project_filter_deadline_after = request.args.get('filter_deadline_after', '')
    project_filter_remaining_days = request.args.get('filter_remaining_days', '')
    project_order_by = request.args.get('sort_by', 'project_name')
    
    project_order = request.args.get('order', 'asc')
    project_page = request.args.get('page', 1, type=int)
    per_page = 10

    projects_query = Project.query.filter(
        Project.project_name.ilike(f'%{project_filter_name}%'),
        Project.state.ilike(f'%{project_filter_state}%')
    )

    if project_filter_creation_date_berfore:
        projects_query = projects_query.filter(Project.creation_date <= datetime.strptime(project_filter_creation_date_berfore, '%Y-%m-%d'))

    if project_filter_creation_date_after:
        projects_query = projects_query.filter(Project.creation_date >= datetime.strptime(project_filter_creation_date_after, '%Y-%m-%d'))
    if project_filter_deadline_berfore:
        projects_query = projects_query.filter(Project.deadline_date <= datetime.strptime(project_filter_deadline_berfore, '%Y-%m-%d'))
    if project_filter_deadline_after:
        projects_query = projects_query.filter(Project.deadline_date >=  datetime.strptime(project_filter_deadline_after, '%Y-%m-%d'))
    
    
    
    if project_filter_remaining_days:
        remaining_days = datetime.today() + timedelta(days=int(project_filter_remaining_days))
        projects_query = projects_query.filter(Project.deadline_date <= remaining_days , Project.deadline_date >= datetime.today())

    if project_order == 'asc':
        projects_query = projects_query.order_by(getattr(Project, project_order_by).asc())
    else:
        projects_query = projects_query.order_by(getattr(Project, project_order_by).desc())

    projects = projects_query.paginate(page=project_page, per_page=per_page)
    projects_list = [{
        'project_id': p.project_id,
        'project_name': p.project_name,
        'state': p.state,
        'creator_email': p.user_email,
        'budget': p.budget,
        'creation_date': p.creation_date.strftime('%Y-%m-%d'),
        'deadline': p.deadline_date.strftime('%Y-%m-%d')
    } for p in projects.items]

    return jsonify({
        'projects': projects_list,
        'pagination': {
            'has_prev': projects.has_prev,
            'prev_num': projects.prev_num,
            'page': projects.page,
            'pages': projects.pages,
            'has_next': projects.has_next,
            'next_num': projects.next_num
        }
    })

@views.route('/filter_employees', methods=['GET'])
@login_required
def filter_employees():
    if current_user.role_id != 'manager':
        return redirect(url_for('views.home'))

    employee_filter_name = request.args.get('filter_employee_name', '')
    employee_filter_rating = request.args.get('filter_employee_rating', '')
    employee_filter_department = request.args.get('filter_employee_department', '')
    employee_filter_creation_date = request.args.get('filter_employee_creation_date', '')
    employee_order_by = request.args.get('sort_by', 'first_name')
    employee_order = request.args.get('order', 'asc')
    employee_page = request.args.get('page', 1, type=int)
    per_page = 10

    employees_query = Employee.query.filter(
        Employee.first_name.ilike(f'%{employee_filter_name}%') | 
        Employee.last_name.ilike(f'%{employee_filter_name}%'),
        Employee.rating.ilike(f'%{employee_filter_rating}%'),
        Employee.department_id.ilike(f'%{employee_filter_department}%')
    )

    if employee_filter_creation_date:
        employees_query = employees_query.filter(Employee.creation_date == employee_filter_creation_date)

    if employee_order == 'asc':
        employees_query = employees_query.order_by(getattr(Employee, employee_order_by).asc())
    else:
        employees_query = employees_query.order_by(getattr(Employee, employee_order_by).desc())

    employees = employees_query.paginate(page=employee_page, per_page=per_page)
    employees_list = [{
        'user_id': e.user_id,
        'first_name': e.first_name,
        'last_name': e.last_name,
        'email': e.email,
        'rating': e.rating,
        'department_id': e.department_id,
        'creation_date': e.creation_date.strftime('%Y-%m-%d')
    } for e in employees.items]

    return jsonify({
        'employees': employees_list,
        'pagination': {
            'has_prev': employees.has_prev,
            'prev_num': employees.prev_num,
            'page': employees.page,
            'pages': employees.pages,
            'has_next': employees.has_next,
            'next_num': employees.next_num
        }
    })


@views.route('/get_assigned_employees/<int:project_id>', methods=['GET'])
@login_required
def get_assigned_employees(project_id):
    assigned_employees = EmployeeWorksonProject.query.filter_by(project_id=project_id).all()
    assigned_employee_ids = [emp.employee_id for emp in assigned_employees]
    return jsonify(assigned_employee_ids)


@views.route('/api/employee_info/<int:employee_id>', methods=['GET'])
@login_required
def get_employee_info(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    return jsonify(employee.to_dict())






@views.route('/notes_view', methods=['GET'])
@login_required
def view_notes():
    user_id = current_user.id

    filter_creation_date_start = request.args.get('filter_creation_date_start', '')
    filter_creation_date_end = request.args.get('filter_creation_date_end', '')
    filter_receiver_email = request.args.get('filter_receiver_email', '')
    filter_sender_email = request.args.get('filter_sender_email', '')
    filter_sender_name = request.args.get('filter_sender_name', '')
    filter_receiver_name = request.args.get('filter_receiver_name', '')
    filter_project_id = request.args.get('filter_project_id', '')
    sort_by = request.args.get('sort_by', 'creation_date')
    sort_order = request.args.get('sort_order', 'asc')
    page = request.args.get('page', 1, type=int)
    per_page = 10

    notes_query = Note.query.filter(
        (Note.sender_user_id == user_id) | (Note.receiver_user_id == user_id)
    )

    if filter_creation_date_start and filter_creation_date_end:
        start_date = datetime.strptime(filter_creation_date_start, '%Y-%m-%d')
        end_date = datetime.strptime(filter_creation_date_end, '%Y-%m-%d')
        notes_query = notes_query.filter(Note.creation_date.between(start_date, end_date))

    if filter_receiver_email:
        notes_query = notes_query.join(Clients, Clients.user_id == Note.receiver_user_id).filter(Clients.user_email.ilike(f'%{filter_receiver_email}%'))
    
    if filter_sender_email:
        notes_query = notes_query.join(Clients, Clients.user_id == Note.sender_user_id).filter(Clients.user_email.ilike(f'%{filter_sender_email}%'))
    
    if filter_sender_name:
        notes_query = notes_query.join(Clients, Clients.id == Note.sender_user_id).filter(
            (Clients.first_name.ilike(f'%{filter_sender_name}%')) | 
            (Clients.last_name.ilike(f'%{filter_sender_name}%'))
        )
    
    if filter_receiver_name:
        notes_query = notes_query.join(Clients, Clients.id == Note.receiver_user_id).filter(
            (Clients.first_name.ilike(f'%{filter_receiver_name}%')) | 
            (Clients.last_name.ilike(f'%{filter_receiver_name}%'))
        )

    if filter_project_id:
        notes_query = notes_query.filter(Note.project_id == filter_project_id)

    if sort_order == 'asc':
        notes_query = notes_query.order_by(getattr(Note, sort_by).asc())
        print("asc")
    else:
        notes_query = notes_query.order_by(getattr(Note, sort_by).desc())
        print("desc")

    notes = notes_query.paginate(page=page, per_page=per_page)

    notes_list = [{
        'id': n.note_id,
        'content': n.note_description,
        'creation_date': n.creation_date.strftime('%Y-%m-%d %H:%M:%S'),
        'sender': n.sender,
        'receiver': n.receiver,
        'sender_email': n.sender,
        'receiver_email': n.receiver,
        'project_id': n.project_id
    } for n in notes.items]

    return jsonify({
        'notes': notes_list,
        'pagination': {
            'has_prev': notes.has_prev,
            'prev_num': notes.prev_num,
            'page': notes.page,
            'pages': notes.pages,
            'has_next': notes.has_next,
            'next_num': notes.next_num
        }
    })

@views.route('/notes_page', methods=['GET'])
@login_required
def notes_page():
    return render_template('notes_page.html')


######




# work on project view
@views.route('/work_on_project')
def work_on_project():
    res =EmployeeWorksonProject.get_all()
    print(res)
    projects=Project.search_by_ids([item.project_id for item in res])
    print(projects[0].project_name)
    return "done"