from flask import Flask, request, jsonify, redirect, session
from flask_pymongo import PyMongo
from bson.json_util import dumps

# db.<collection_name>.find_one() -> returns one object
# db.<collection_name>.find() -> returns all object from collection ->
# collection = db.collection_name.find() ---> dupms(list(collection)) --> JSON

# POST -> request.method == 'POST' --> request_dict = request.form.to_dict() --> request_dict['KEY'] = "Value"

# GET -> request.method == 'GET' --> request_key= request.args.get("key") OR data = request.json --> jsonify(data) --> JSON


app = Flask(__name__)
app.config[
    "MONGO_URI"
] = "mongodb+srv://yoni:Yoni1997@cluster0.wpwdy.mongodb.net/teams-app-db?retryWrites=true&w=majority"
app.secret_key = "testing"

db = PyMongo(app).db


@app.route("/", methods=["GET", "POST"])
def welcome():
    if request.method == "POST":
        user = request.form.to_dict()
        users = db.users
        if users.find_one({"username": user["username"], "password": user["password"]}):
            current_user = users.find_one({"username": user["username"], "password": user["password"]})
            session['id']=str(current_user['_id'])
            return f'<h1>Sucssefully logged in to {user["username"]}!</h1>'
        else:
            users.insert(user)
            return f'<h1>Sucssefully added {user["username"]}</h1>'

    else:
        return "Send by post username and password"


@app.route("/add_player", methods=["GET", "POST"])
def add_player():
    if request.method == "POST":
        player = request.form
        player = player.to_dict()
        return f'Successfully added {player["name"]} {player["last"]}'
    else:
        return "Please send by POST"


@app.route("/whoami")
def whoami():

    return session


@app.route("/all_players")
def get_all_players():

    return


@app.route("/get_users")
def get_users():
    users = db.users.find()
    users_json = dumps(list(users))

    return users_json


@app.route("/players", methods=["GET", "POST"])
def players():
    if request.method == "POST":
        temp = request.form
        str = ""
        for key in temp:
            str += f"The {key.capitalize()} is {temp[key].capitalize()} \n"
        return str
    else:
        return "Get"
