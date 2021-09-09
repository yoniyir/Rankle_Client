


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
      if(responseText.status == "Ok"){
          document.getElementById("loginForm").style.display = "none";
          //document.getElementById("teams").innerHTML = '<button onclick="getGroups()">Get user groups</button>';
          getGroups()
      }
      else{
        document.getElementById("teams").innerText=responseText.message
      }
    }

    async function getGroups(){
        const response = await fetch('http://127.0.0.1:5000/get_groups',{
            method: 'GET'
        })
        const responseText = await response.json();
        let str='';
        for (let i = 0; i < responseText.length; i++) {
            str += `<div class="teamName">${JSON.stringify(responseText[i].name)}</div>`;
         }
        document.getElementById("teams").innerHTML += str;
    }