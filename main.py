from flask import Flask, request, jsonify, redirect, session
from flask_pymongo import PyMongo
from bson.json_util import dumps

# db.<collection_name>.find_one() -> returns one object
# db.<collection_name>.find() -> returns all object from collection ->
# collection = db.collection_name.find() ---> dumps(list(collection)) --> JSON

# POST -> request.method == 'POST' --> request_dict = request.form.to_dict() --> request_dict['KEY'] = "Value"

# GET -> request.method == 'GET' --> request_key= request.args.get("key") OR data = request.json --> jsonify(data) --> JSON


app = Flask(__name__)
app.config[
    "MONGO_URI"
] = "mongodb+srv://yoni:Yoni1997@cluster0.wpwdy.mongodb.net/teams-app-db?retryWrites=true&w=majority"
app.secret_key = "testing"

db = PyMongo(app).db



@app.route("/add_group", methods=["POST"])
def add_group():
    if request.method == "POST":
        group = request.form.to_dict()
        groups = db.groups
        if groups.find_one({"name":group["name"],"userId":group["userId"]}):
            return f'The name {group["name"]} exists!'
        else:
            #to change to session
            groups.insert(group)
            return f'<h1>Sucssefully added {group["name"]}</h1>'
    





@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form.to_dict()
        users = db.users
        if users.find_one({"username": user["username"]}):
            current_user = users.find_one({"username": user["username"], "password": user["password"]})
            session['id']=str(current_user['_id'])
            return f'<h1>Sucssefully logged in to {user["username"]}!</h1>'
        else:
            users.insert(user)
            return f'<h1>Sucssefully added {user["username"]}</h1>'

    else:
        return "Send by post username and password"



@app.route("/whoami")
def whoami():

    return session


@app.route("/get_users")
def get_users():
    users = db.users.find()
    users_json = dumps(list(users))

    return users_json


@app.route("/get_groups")
def get_user_groups():
    userGroups = db.groups.find({"userId":session['id']})
    return dumps(list(userGroups))


@app.route("/")
def hello_world():
    return redirect('/login')