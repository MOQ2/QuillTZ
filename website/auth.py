# auth.py

from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from .models import Clients, Employee
from . import db, bcrypt
from .forms import RegistrationForm, LoginForm

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('views.home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = Clients(first_name=form.first_name.data, last_name=form.last_name.data, user_email=form.email.data, password_hash=hashed_password , role_id = 'client')
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('auth.login'))
    return render_template('register.html', title='Register', form=form)

@auth.route('/register_employee', methods=['GET', 'POST'])
def register_employee():
    if current_user.is_authenticated:
        return redirect(url_for('views.home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        employee = Employee(first_name=form.first_name.data, last_name=form.last_name.data, user_email=form.email.data, password_hash=hashed_password)
        db.session.add(employee)
        db.session.commit()
        flash('Employee account has been created! The employee can now log in', 'success')
        return redirect(url_for('auth.login'))
    return render_template('register.html', title='Register Employee', form=form)




@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('views.home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = Clients.get_by_email(form.email.data)
        if user and bcrypt.check_password_hash(user.password_hash, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            elif user.role == 'client':
                return redirect(url_for('views.dashboard'))
            elif user.role == 'employee':
                return redirect(url_for('views.employee_dashboard'))
            else:
                return redirect(url_for('views.manager_dashboard'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)



@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.home'))

