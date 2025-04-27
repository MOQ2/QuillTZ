from website import create_app 


app = create_app()

if __name__ == '__main__' :
    app.run(debug=True) # reflect the changes directly to the website when they happen (restart the app )
