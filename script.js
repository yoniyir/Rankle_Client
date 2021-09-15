
let userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : null;
let activePlayers = [];
let players_to_change_rank = [];
window.onload = function () {
    if (!userId) { document.getElementById("logOut").classList.add("hidden") }
    else { getGroups() }
}

async function submitForm() {
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
        localStorage.setItem('userId', userId);
        getGroups()
    }
    else {
        document.getElementById("teams").innerText = responseText.message
    }
}


async function getPlayers(teamId) {
    const response = await fetch(`http://127.0.0.1:5000/get_group_players?groupId=${teamId}`, {
        method: 'GET'
    })
    const responseText = await response.json();
    document.getElementById("teams").classList.add("hidden")
    let players_page = `<button onClick="back_from_players()">Back</button>
    <table>
    <tr>
    <th>Name</th><th>Rank</th><th>Active</th><th>Edit Rank</th>`
    for (let i = 0; i < responseText.length; i++) {
        const player = responseText[i];
        players_page += `<tr>
        <td>${player.name}</td><td>${player.rank}</td><td><input type="checkbox" onclick="add_to_random('${player._id.$oid}')"></input></td>
        <tr>`

    }
    players_page += `</tr></table>
    <button onClick="check_groups_count()">Send</button>
    `
    let playersTable = document.getElementById("players");
    playersTable.classList.remove("hidden");
    playersTable.innerHTML += players_page;
    console.log(responseText)
}

function check_groups_count() {
    debugger
}

function add_to_random(player_id) {
    if (activePlayers.includes(player_id)) {
        activePlayers = activePlayers.filter(e => e !== player_id);
    }
    else { activePlayers.push(player_id) }
}

function back_from_players() {
    document.getElementById("teams").classList.remove("hidden")
    document.getElementById("players").classList.add("hidden")
    document.getElementById("players").innerHTML = ""
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
        str += `<div class="teamName">${responseText[i].name}<button onClick="getPlayers('${teamId}')">Select</button></div>`;
    }
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("teams").innerHTML += str;
}

function logOut() {
    localStorage.removeItem('userId')
    location.reload();
}