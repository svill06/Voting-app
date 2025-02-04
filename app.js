let polls = JSON.parse(localStorage.getItem('polls')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function updateUI() {
    const pollList = document.getElementById("pollList");
    pollList.innerHTML = "";

    if (currentUser) {
        polls.forEach((poll, index) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            li.innerHTML = `${poll.question} - Kyllä: ${poll.votes.Yes}, Ei: ${poll.votes.No}`;

            const yesButton = document.createElement("button");
            yesButton.classList.add("btn", "btn-success", "btn-sm");
            yesButton.innerText = "Äänestä Kyllä";
            yesButton.onclick = () => vote(index, "Yes");

            const noButton = document.createElement("button");
            noButton.classList.add("btn", "btn-danger", "btn-sm");
            noButton.innerText = "Äänestä Ei";
            noButton.onclick = () => vote(index, "No");

            const buttonGroup = document.createElement("div");
            buttonGroup.classList.add("btn-group", "btn-group-sm");
            buttonGroup.appendChild(yesButton);
            buttonGroup.appendChild(noButton);

            li.appendChild(buttonGroup);

            if (currentUser && currentUser.role === "admin") {
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("btn", "btn-danger", "btn-sm");
                deleteButton.innerText = "Poista";
                deleteButton.onclick = () => deletePoll(index);
                li.appendChild(deleteButton);
            }

            pollList.appendChild(li);
        });

        document.getElementById("authPanel").style.display = "none";
        document.getElementById("rolePanel").style.display = "block";

        document.getElementById("adminPanel").style.display = currentUser.role === "admin" ? "block" : "none";
    } else {
        document.getElementById("authPanel").style.display = "block";
        document.getElementById("rolePanel").style.display = "none";
    }
}

function vote(index, option) {
    if (currentUser) {
        polls[index].votes[option]++;
        localStorage.setItem('polls', JSON.stringify(polls));  
        updateUI();
    } else {
        alert("Kirjaudu ensin!");
    }
}

function addPoll() {
    const newPollText = document.getElementById("newPoll").value;
    if (newPollText.trim()) {
        polls.push({ question: newPollText, votes: { Yes: 0, No: 0 } });
        document.getElementById("newPoll").value = "";
        localStorage.setItem('polls', JSON.stringify(polls));  
        updateUI();
    }
}

function deletePoll(index) {
    polls.splice(index, 1);
    localStorage.setItem('polls', JSON.stringify(polls));  
    updateUI();
}

function registerOrLoginUser(isLogin = false) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (isLogin) {
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));  
            alert("Kirjautuminen onnistui!");
            updateUI();
        } else {
            alert("Väärä käyttäjätunnus tai salasana!");
        }
    } else {
        if (users.some(user => user.username === username)) {
            alert("Tämä käyttäjätunnus on jo käytössä!");
            return;
        }

        users.push({ username, password, role });
        localStorage.setItem('users', JSON.stringify(users));  

        currentUser = { username, password, role };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));  

        alert("Rekisteröinti onnistui!");
        updateUI();
    }

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');  
    updateUI();
}

updateUI();
