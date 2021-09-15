let userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : null;
let activePlayers = [];
let players_to_change_rank = [];
let activeTeam;
let slider;

window.onload = function() {
    if (!userId) {
        document.getElementById("logOut").classList.add("hidden")
    } else {
        document.getElementById("welcomePage").classList.add("hidden")
        getGroups()
    }
}

async function submitFormLogin() {
    let username1 = document.getElementsByName("username")[0].value;
    let password1 = document.getElementsByName("password")[0].value;
    let formData = new FormData();
    formData.append('username', username1);
    formData.append('password', password1);
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        body: formData
    });
    const responseText = await response.json();
    if (responseText.status == "Ok") {
        userId = responseText.userId;
        full_name = responseText.name;
        localStorage.setItem('userId', userId);
        localStorage.setItem('name', full_name);
        document.getElementById("logOut").classList.remove("hidden")
        getGroups()
    } else {
        document.getElementById("errorMsg").innerText = responseText.message
    }
}



async function submitFormSignUp() {

    let username1 = document.getElementsByName("username")[1].value;
    let password1 = document.getElementsByName("password")[1].value;
    let fname = document.getElementsByName("fname")[0].value;
    let lname = document.getElementsByName("lname")[0].value;
    let formData = new FormData();
    formData.append('username', username1);
    formData.append('password', password1);
    formData.append('f_name', fname);
    formData.append('l_name', lname);
    const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        body: formData
    });
    const responseText = await response.json();
    if (responseText.status == "Ok") {
        let formDataLogin = new FormData();
        formDataLogin.append('username', username1)
        formDataLogin.append('password', password1)
        const responseLogin = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            body: formDataLogin
        });
        const responseText2 = await responseLogin.json();
        if (responseText2.status == "Ok") {
            userId = responseText2.userId;
            localStorage.setItem('userId', userId);
            location.reload();
        }

    } else {
        document.getElementById("errorMsg2").innerText = responseText.msg
    }
}




async function getPlayers(teamId) {
    activeTeam = teamId;
    const response = await fetch(`http://127.0.0.1:5000/get_group_players?groupId=${teamId}`, {
        method: 'GET'
    })
    const responseText = await response.json();
    document.getElementById("teamsPage").classList.add("hidden")
    let players_page = `<table>
    <tr>
    <th>Name</th><th>Rank</th><th>Active</th><th>Edit Rank</th></tr>
    `
    for (let i = 0; i < responseText.length; i++) {
        const player = responseText[i];
        players_page += `<tr>
        <td>${player.name}</td><td>${player.rank}</td><td><input type="checkbox" onclick="add_to_random('${player._id.$oid}')"></input></td>
        <td><button onclick="editRank('${player.name}')">Edit</button></td>
        </tr>`

    }
    players_page += `</table>
    <button class="bn632-hover bn25" onClick="check_groups_count()">Send</button>
    `
    let playersTable = document.getElementById("playersCont");
    document.getElementById("playersPage").classList.remove("hidden");
    playersTable.innerHTML += players_page;
    console.log(responseText)
}

function editRank(playerName) {
    document.getElementById("editRank").classList.remove("hidden")
    document.getElementById("playersCont").classList.add("blur")
    document.getElementById("editRank").innerHTML = `
    <div class="editCont">
    <button onclick="close_edit()">X</button>
    <h2>Editing ${playerName}</h2>
    <div class="slidecontainer">
    <input type="range" min="0" max="10" class="slider" oninput="changeRange()" id="myRange">
    <p>New Rank: <span id="demo"></span></p>
    </div>
    <button onclick="updatePlayer('${activeTeam}','${playerName}')">Save</button>
    </div>
    `
}


async function updatePlayer(activeTeam, playerName) {
    let formData = new FormData();
    formData.append('groupId', activeTeam);
    formData.append('name', playerName);
    formData.append('newRank', document.getElementById("myRange").value);


    const response = await fetch('http://127.0.0.1:5000/update_player', {
        method: 'POST',
        body: formData
    });
    const responseText = await response.json();
    document.getElementById("editRank").classList.add("hidden");
    document.getElementById("playersCont").classList.remove("blur")
    document.getElementById("playersCont").innerHTML = '';

    getPlayers(activeTeam);
}



function changeRange() {
    value = document.getElementById("myRange").value
    document.getElementById("demo").innerText = value
}

function close_edit() {
    document.getElementById("editRank").innerHTML = "";
    document.getElementById("playersCont").classList.remove("blur")
    document.getElementById("editRank").classList.add("hidden")

}


function check_groups_count() {
    debugger
}

function add_to_random(player_id) {
    if (activePlayers.includes(player_id)) {
        activePlayers = activePlayers.filter(e => e !== player_id);
    } else { activePlayers.push(player_id) }
}

function back_from_players() {
    document.getElementById("teamsPage").classList.remove("hidden")
    document.getElementById("playersPage").classList.add("hidden")
    document.getElementById("playersCont").innerHTML = ""
    activePlayers = [];

}





async function getGroups() {
    const response = await fetch(`http://127.0.0.1:5000/get_groups?userId=${userId}`, {
        method: 'GET'
    })
    const responseText = await response.json();
    let str = '';
    for (let i = 0; i < responseText.length; i++) {
        teamId = responseText[i]._id.$oid;
        str += `<div class="teamName"><label>${responseText[i].name}</label><button class="bn632-hover bn25" onClick="getPlayers('${teamId}')">Select</button></div>`;
    }
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signUpPage").classList.add("hidden");
    document.getElementById("teamsPage").classList.remove("hidden");
    let name = localStorage.getItem('name').split(" ")
    document.getElementById("welcome_user").innerText = `Hello ${capitalizeFirstLetter(name[0])} ${capitalizeFirstLetter(name[1])}`

    document.getElementById("teams").innerHTML += str;
}








function logOut() {
    localStorage.removeItem('userId')
    localStorage.removeItem('name')
    location.reload();
}

function moveToLogin() {
    document.getElementById("welcomePage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

}

function moveToSignUp() {
    document.getElementById("welcomePage").classList.add("hidden");
    document.getElementById("signUpPage").classList.remove("hidden");
}



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}