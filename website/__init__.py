
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.login_message_category = 'info'

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your_secret_key'
    app.config['STATIC_FOLDER'] = 'static'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:pass@localhost/quilltz_test_2'
    app.config['UPLOAD_FOLDER'] = 'uploads/'
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    from .views import views
    from .auth import auth
    from .models import Clients , Employee

    
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')


    @login_manager.user_loader
    def load_user(user_id):
        return Clients.query.get(int(user_id))
    
    return app
