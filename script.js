let userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : null;
let activePlayers = [];
let players_to_change_rank = [];
let activeTeam;
let slider;

window.onload = function() {

    Particles.
    init
        ({
            selector: '.background',
            maxParticles: 100,
            connectParticles: true,
            color: ['#CAF2FF', '#7FFFE0', '#1EA8BB']


        });


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
            localStorage.setItem('name', `${fname} ${lname}`);
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
    <thead>
    <tr>
    <th>Name</th><th>Rank</th><th>Active</th><th>Edit</th></tr></thead><tbody>
    `
    for (let i = 0; i < responseText.length; i++) {
        const player = responseText[i];
        players_page += `<tr>
        <td>${player.name}</td><td>${player.rank}</td><td><input name="checkbox_add" value="${player._id.$oid}" type="checkbox" onclick="add_to_random('${player._id.$oid}')"></input></td>
        <td class="fixed_td"><button class="iconBtn iconBtn2" onclick="editRank('${player.name}',${player.rank})"><i class="fas fa-edit"></i></button>
        <button class="iconBtn iconBtn2" onclick="removePlayer('${player._id.$oid}')"><i class="fas fa-trash"></i></button>
        </td>
        </tr>`

    }
    players_page += `</tbody></table>
    `
    let playersTable = document.getElementById("playersCont");
    document.getElementById("playersPage").classList.remove("hidden");
    playersTable.innerHTML = players_page;
}


function selectAll() {
    let temp_len = 0;
    selected = Array.from(document.getElementsByName('checkbox_add'));
    selected.map(e => {
        if (e.checked) {
            temp_len++;
            return;
        } else {
            e.checked = "true";
            document.getElementById("select_all_checkbox").checked = true;
            activePlayers.push(e.value);
        }
    })
    if (temp_len == selected.length) {
        activePlayers = [];
        selected.map(e => {
            e.checked = false;
        })
    }
}


async function removePlayer(playerId) {
    const response = await fetch(`http://127.0.0.1:5000/delete_player?playerId=${playerId}`, {
        method: 'GET'
    })
    const responseText = await response.json();
    if (responseText.msg == "Ok") {
        getPlayers(activeTeam)
    }
}

async function removeTeam(teamId) {
    const response = await fetch(`http://127.0.0.1:5000/delete_group?groupId=${teamId}`, {
        method: 'GET'
    })
    const responseText = await response.json();
    if (responseText.msg == "Ok") {
        getGroups()
    }
}


function editRank(playerName, currentRank) {
    document.getElementById("editRank").classList.remove("hidden")
    document.getElementById("players_toblur").classList.add("blur")
    document.getElementById("editRank").innerHTML = `
    <div class="editCont">
    <button class="iconBtn" onclick="close_edit()"><i class="fas fa-times-circle"></i></button>
    <h2>Editing ${playerName}</h2>
    <div class="slidecontainer">
    <input type="range" min="0" max="10" class="slider" oninput="changeRange()" id="myRange" value=${currentRank}>
    <p>New Rank: <span id="demo">${currentRank}</span></p>
    </div>
    <button class="bn632-hover bn25" onclick="updatePlayer('${activeTeam}','${playerName}')"><i class="fas fa-save"></i></button>
    </div>
    `
}

function addPlayer() {
    document.getElementById("addPlayer").classList.remove("hidden")
    document.getElementById("players_toblur").classList.add("blur")
    document.getElementById("addPlayer").innerHTML = `
    <div class="editCont">
    <button class="iconBtn" onclick="close_add()"><i class="fas fa-times-circle"></i></button>
    <input type="text" placeholder="Player Name" name="playerName">
    <div class="slidecontainer">
    <input type="range" min="0" max="10" class="slider" oninput="changeRangePlayer()" id="myRangePlayer" value=5>
    <p>Rank: <span id="demoPlayer">5</span></p>
    </div>
    <button class="bn632-hover bn25" onclick="submit_new_player('${activeTeam}')">Add Player</button>
    <label id="errorMsg3"></label>
    </div>
    `
    activePlayers = [];
}

async function submit_new_player(activeTeam) {
    let formData = new FormData();
    let playerName = document.getElementsByName("playerName")[0].value
    formData.append('groupId', activeTeam);
    formData.append('name', playerName);
    formData.append('rank', document.getElementById("myRangePlayer").value);


    const response = await fetch('http://127.0.0.1:5000/add_player', {
        method: 'POST',
        body: formData
    });
    const responseText = await response.json();
    if (responseText.status == "Ok") {
        document.getElementById("addPlayer").classList.add("hidden");
        document.getElementById("players_toblur").classList.remove("blur")
        document.getElementById("playersCont").innerHTML = '';
        getPlayers(activeTeam);
    } else {
        document.getElementById("errorMsg3").innerText = responseText.msg;
    }
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
    document.getElementById("players_toblur").classList.remove("blur")
    document.getElementById("playersCont").innerHTML = '';

    getPlayers(activeTeam);
}



function changeRange() {
    value = document.getElementById("myRange").value
    document.getElementById("demo").innerText = value
}


function changeRangePlayer() {
    value = document.getElementById("myRangePlayer").value
    document.getElementById("demoPlayer").innerText = value
}



function close_edit() {
    document.getElementById("editRank").innerHTML = "";
    document.getElementById("players_toblur").classList.remove("blur")
    document.getElementById("editRank").classList.add("hidden")

}

function close_add() {
    document.getElementById("addPlayer").innerHTML = "";
    document.getElementById("players_toblur").classList.remove("blur")
    document.getElementById("addPlayer").classList.add("hidden")

}

function close_groups_count() {
    document.getElementById("groupsCount").innerHTML = "";
    document.getElementById("players_toblur").classList.remove("blur")
    document.getElementById("groupsCount").classList.add("hidden")

}

function check_groups_count() {
    if (activePlayers.length <= 2) {
        alert("Select more than 2 players");
        return;
    }
    document.getElementById("groupsCount").classList.remove("hidden");
    document.getElementById("players_toblur").classList.add("blur")

    let min = 2;
    let max = Math.floor(activePlayers.length / 2);

    document.getElementById("groupsCount").innerHTML = `
    <div class="editCont">
    <button class="iconBtn" onclick="close_groups_count()"><i class="fas fa-times-circle"></i></button>
    <div class="slidecontainer">
    <input type="range" min="${min}" max="${max}" class="slider" oninput="changeCount()" id="myCountRange" value=${min}>
    <p>Players in each group: <span id="demoCount">${min}</span></p>
    </div>
    <button class="bn632-hover bn25" onclick="randomize()">Randomize</button>
    <button class="bn632-hover bn25" onclick="randomize_by_rank()">Randomize by rank</button>
    <label id="errorMsg4"></label>
    </div>
    `
}

async function randomize() {
    let formData = new FormData();
    formData.append('activePlayers', activePlayers);
    formData.append('group_size', document.getElementById("myCountRange").value)
    const response = await fetch(`http://127.0.0.1:5000/randomize`, {
        method: 'POST',
        body: formData
    })
    const responseText = await response.json();
    let randomized = JSON.parse(responseText.randomized)
    let remaining = JSON.parse(responseText.remainder)
        // for randomized e=>e.name
    generateRandom(randomized, remaining);
    return;
}



async function randomize_by_rank() {
    let formData = new FormData();
    formData.append('activePlayers', activePlayers);
    formData.append('group_size', document.getElementById("myCountRange").value)
    const response = await fetch(`http://127.0.0.1:5000/randomize_by_rank`, {
        method: 'POST',
        body: formData
    })
    const responseText = await response.json();
    let randomized = JSON.parse(responseText.randomized)
    let remaining = JSON.parse(responseText.remainder)
        // for randomized e=>e.name
    generateRandom(randomized, remaining);
    return;

}

function generateRandom(groups, remainders) {
    let i = 1;
    let randomized_cont = `<div id="randomized_cont">`

    for (let j = 0; j < groups.length; j++) {
        let group_cont = `<div class="group_cont"> <h3>Group number ${i++}</h3>`;
        for (let k = 0; k < groups[j].length; k++) {
            const player = groups[j][k];
            group_cont += `<label><i class="fas fa-user"></i> ${player.name}    <i class="fas fa-star"></i> ${player.rank}</label>`
        }
        group_cont += `</div>`;
        randomized_cont += group_cont;
    }
    randomized_cont += `</div>`
    document.getElementById("randomizedCont").innerHTML = randomized_cont;
    document.getElementById("playersPage").classList.add("hidden");
    document.getElementById("randomizedPage").classList.remove("hidden");
}



function changeCount() {
    value = document.getElementById("myCountRange").value
    document.getElementById("demoCount").innerText = value
}



function add_to_random(player_id) {
    if (activePlayers.includes(player_id)) {
        activePlayers = activePlayers.filter(e => e !== player_id);
    } else { activePlayers.push(player_id) }
}

function back_from_players() {
    document.getElementById("select_all_checkbox").checked = false;
    document.getElementById("teamsPage").classList.remove("hidden")
    document.getElementById("playersPage").classList.add("hidden")
    document.getElementById("playersCont").innerHTML = ""
    document.getElementById("teams").innerText = ""
    getGroups(userId)
    activePlayers = [];

}





async function getGroups() {
    loading();
    const response = await fetch(`http://127.0.0.1:5000/get_groups?userId=${userId}`, {
        method: 'GET'
    })
    const responseText = await response.json();
    let str = '';
    for (let i = 0; i < responseText.length; i++) {
        teamId = responseText[i]._id.$oid;
        str += `<div class="teamName"><label>${responseText[i].name}</label><button class="bn632-hover bn25" onClick="getPlayers('${teamId}')">Select</button>
        <button class="bn632-hover bn25 delBtn" onClick="removeTeam('${teamId}')">Delete</button>
        </div>`;
    }
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signUpPage").classList.add("hidden");
    document.getElementById("teamsPage").classList.remove("hidden");
    let name = localStorage.getItem('name').split(" ")
    document.getElementById("welcome_user").innerText = `Hello ${capitalizeFirstLetter(name[0])} ${capitalizeFirstLetter(name[1])}`
    document.getElementById("teams").innerHTML = str;
    loading();
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

function back_to_welcome(pageId) {

    document.getElementById(pageId).classList.add("hidden");
    document.getElementById("welcomePage").classList.remove("hidden");

}

function back_to_teams() {
    document.getElementById("addTeam").classList.add("hidden");
    getGroups();
}

function addTeam() {
    document.getElementById("addTeam").classList.remove("hidden");
    document.getElementById("teamsPage").classList.add("hidden");

}

async function createNewTeam() {
    let teamName = document.getElementsByName("teamName")[0].value;
    if (!teamName) {
        return;
    }
    let formData = new FormData();
    formData.append('name', teamName);
    formData.append('userId', `${userId}`);
    const response = await fetch(`http://127.0.0.1:5000/add_group`, {
        method: 'POST',
        body: formData
    })
    const responseText = await response.json();
    if (responseText.status != "Ok") {
        document.getElementById("errorMsg3").innerText = responseText.msg;

    } else {
        document.getElementById("addTeam").classList.add("hidden");
        getPlayers(responseText.activeTeam._id);

    }
}



function back_from_random() {
    document.getElementById("randomizedCont").innerHTML = '';
    document.getElementById("playersPage").classList.remove("hidden");
    document.getElementById("randomizedPage").classList.add("hidden");
}


function loading(){
    let loading = document.getElementById("loadingScreen");
    if (loading.classList.contains("hidden")){
        loading.classList.remove("hidden");
        }
    else {
        loading.classList.add("hidden");
    }
}