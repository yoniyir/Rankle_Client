from flask import Flask, request, jsonify, redirect, session
from flask_pymongo import PyMongo
from bson.json_util import dumps
from flask_session import Session


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
app.config['SESSION_TYPE'] = 'filesystem'

sess = Session(app)
sess.init_app(app)



@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form.to_dict()
        users = db.users
        if users.find_one({"username": user["username"]}):
            currentUser = users.find_one({"username": user["username"],"password": user["password"]})
            if currentUser:
                sess.id=str(currentUser['_id'])
                sess.username=f'{currentUser["username"]}'
                return jsonify({"status": "Ok","userId":sess.id})
            else:
                return jsonify({"status": "Error","message":"Incorrect password"})
        else:
            return jsonify({"status": "Error","message":"User doesnt exist"})

    else:
        return "<h1> Welcome to login!</h1></br><h2>Please send credentials by POST</h2></>"


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        user = request.form.to_dict()
        users = db.users
        if users.find_one({"username": user["username"]}):
            return "Username is taken"
        else:
            users.insert(user)
            session['id']=str(user['_id'])
            session['username']=f'{user["username"]}'
            return f'{user["username"]} Signed-Up Sucssefully'



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
    


@app.route("/add_player", methods=["POST"])
def add_player():
    if request.method == "POST":
        player = request.form.to_dict()
        players = db.players
        if players.find_one({"name":player["name"],"groupId":player["groupId"]}):
            return f'The name {player["name"]} exists in {player["groupId"]}!'
        else:
            players.insert(player)
            return f'<h1>Sucssefully added {player["name"]} </h1>'
    


@app.route("/get_group_players")
def get_group_players():
    users = db.players.find({"groupId":request.args.get("groupId")})
    users_json = dumps(list(users))

    return users_json


@app.route("/get_groups")
def get_user_groups():
    userGroups = db.groups.find({"userId":sess.id})
    return dumps(list(userGroups))


@app.route("/")
def hello_world():
    return redirect('/login')