from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DecimalField, SelectField, DateField, SubmitField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError  
from .models import Clients, Employee
from datetime import date
class RegistrationForm(FlaskForm):
    first_name = StringField('First Name', validators=[DataRequired(), Length(min=2, max=150)])
    last_name = StringField('Last Name', validators=[DataRequired(), Length(min=2, max=150)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    #role = SelectField('Role', choices=[('client', 'Client'), ('employee', 'Employee'), ('manager', 'Manager')], validators=[DataRequired()])
    submit = SubmitField('Sign Up')

    def validate_email(self, email):
        user = Clients.get_by_email(email.data)
        if user:
            raise ValidationError('That email is already in use. Please choose a different one.')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

class EditProfileForm(FlaskForm):
    first_name = StringField('First Name', validators=[DataRequired(), Length(min=2, max=150)])
    last_name = StringField('Last Name', validators=[DataRequired(), Length(min=2, max=150)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Update')

    def validate_email(self, email):
        user = Clients.get_by_email(email.data)
        if user:
            raise ValidationError('That email is already in use. Please choose a different one.')
        
        
class ProjectForm(FlaskForm):
    project_name = StringField('Project Name', validators=[DataRequired(), Length(min=2, max=255)])
    description = TextAreaField('Description', validators=[DataRequired()])
    budget = DecimalField('Budget', validators=[DataRequired()])
    deadline_date = DateField('Deadline Date', format='%Y-%m-%d', validators=[DataRequired()])
    submit = SubmitField('Create Project')
    
    def validate_deadline_date(self, deadline_date):
        if deadline_date.data <= date.today():
            raise ValidationError('Deadline date must be in the future.')
    
    def validate_budget(self, budget):
        if budget.data <= 0:
            raise ValidationError('Budget must be larger than zero.')

class UpdateProjectStateForm(FlaskForm):
    state = SelectField('State', choices=[('new', 'New'), ('pending', 'Pending'), ('running', 'Running'), ('completed', 'Completed')], validators=[DataRequired()])
    submit = SubmitField('Update State')

class AssignEmployeeForm(FlaskForm):
    project_id = SelectField('Project', coerce=int, validators=[DataRequired()])
    employee_id = SelectField('Employee', coerce=int, validators=[DataRequired()])
    submit = SubmitField('Assign')
