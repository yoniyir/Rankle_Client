from flask import Flask, request, jsonify, redirect, session
from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId
import functions


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
app.config["SESSION_TYPE"] = "filesystem"


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form.to_dict()
        users = db.users
        if users.find_one({"username": user["username"]}):
            currentUser = users.find_one(
                {"username": user["username"], "password": user["password"]}
            )
            if currentUser:
                return jsonify(
                    {
                        "status": "Ok",
                        "userId": str(currentUser["_id"]),
                        "name": f'{currentUser["f_name"]} {currentUser["l_name"]}',
                    }
                )
            else:
                return jsonify({"status": "Error", "message": "Incorrect password"})
        else:
            return jsonify({"status": "Error", "message": "User doesnt exist"})

    else:
        return "<h1> Welcome to login!</h1></br><h2>Please send credentials by POST</h2></>"


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        user = request.form.to_dict()
        users = db.users
        if users.find_one({"username": user["username"]}):
            return jsonify({"status": "Error", "msg": "Username is taken"})
        else:
            users.insert(user)

            return jsonify({"status": "Ok"})


@app.route("/add_group", methods=["POST"])
def add_group():
    if request.method == "POST":
        group = request.form.to_dict()
        groups = db.groups
        if groups.find_one({"name": group["name"], "userId": group["userId"]}):
            return jsonify({"msg": "Group already exists!", "status": "Error"})
        else:
            groups.insert(group)
            activeTeam = groups.find_one(
                {"name": group["name"], "userId": group["userId"]}
            )
            activeTeam["_id"] = str(activeTeam["_id"])
            return jsonify({"msg": "Added", "status": "Ok", "activeTeam": activeTeam})


@app.route("/add_player", methods=["POST"])
def add_player():
    if request.method == "POST":
        player = request.form.to_dict()
        players = db.players
        if players.find_one({"name": player["name"], "groupId": player["groupId"]}):
            return jsonify({"msg": "Player already exists!", "status": "Error"})
        else:
            players.insert(player)
            return jsonify({"msg": "Added", "status": "Ok"})


@app.route("/get_group_players")
def get_group_players():
    users = db.players.find({"groupId": request.args.get("groupId")})
    users_json = dumps(list(users))

    return users_json


@app.route("/get_groups")
def get_user_groups():
    userGroups = db.groups.find({"userId": request.args.get("userId")})
    return dumps(list(userGroups))


@app.route("/")
def hello_world():
    return jsonify({"msg": "welcome to Teams App"})


@app.route("/update_player", methods=["POST"])
def update_player():
    if request.method == "POST":
        player = request.form.to_dict()
        players = db.players
        players.find_one_and_update(
            {"name": player["name"], "groupId": player["groupId"]},
            {"$set": {"rank": int(player["newRank"])}},
        )
        return jsonify({"msg": "update complete"})


@app.route("/randomize", methods=["POST"])
def randomize():
    activePlayersArr = []
    if request.method == "POST":
        activePlayers = request.form.to_dict()["activePlayers"].split(",")
        size = int(request.form.get("group_size"))
        for playerId in activePlayers:
            activePlayersArr.append(db.players.find_one({"_id": ObjectId(playerId)}))
        randomized_teams, remainder = functions.randomize_players(
            activePlayersArr, size
        )

        return jsonify(
            {
                "randomized": dumps(list(randomized_teams)),
                "remainder": dumps(list(remainder)),
            }
        )



@app.route("/randomize_by_rank", methods=["POST"])
def randomize_by_rank():
    activePlayersArr = []
    if request.method == "POST":
        activePlayers = request.form.to_dict()["activePlayers"].split(",")
        size = int(request.form.get("group_size"))
        for playerId in activePlayers:
            activePlayersArr.append(db.players.find_one({"_id": ObjectId(playerId)}))
        randomized_teams, remainder = functions.randomize_by_rank(
            activePlayersArr, size
        )

        return jsonify(
            {
                "randomized": dumps(list(randomized_teams)),
                "remainder": dumps(list(remainder)),
            }
        )


@app.route("/delete_group")
def delete_group():
    db.players.remove({"groupId":request.args.get("groupId")})
    db.groups.remove({"_id": ObjectId(request.args.get("groupId"))})
    return jsonify({"msg": "Ok"})

@app.route("/delete_player")
def delete_player():
    db.players.remove({"_id":ObjectId(request.args.get("playerId"))})
    return jsonify({"msg": "Ok"})
