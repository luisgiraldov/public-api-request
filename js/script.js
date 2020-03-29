(function(){
    const gallery = document.getElementById("gallery");
    let usersList = {};

    function getUsers(){
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://randomuser.me/api/?results=12");
            xhr.onload = () => {
                if(xhr.status === 200){
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } else {
                    reject(Error (xhr.statusText));
                }
            };
            xhr.onerror = () => reject(Error("A network error ocurred!"));
            xhr.send();          
        });     
    }

    function appendUsers(users){
        const gallery = document.getElementById("gallery");
        let usersHTML = "";
        users.results.map( user => {
            const card = `<div class="card">
                            <div class="card-img-container">
                                <img class="card-img" src="${user.picture.large}" alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="${user.name.first}.${user.name.last}" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                                <p class="card-text">${user.email}</p>
                                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                            </div>
                        </div>`;
            
            usersHTML += card;
            console.log(user);
        });
        gallery.innerHTML = usersHTML;
    }

    function getInfo(event){
        const modalContainer = document.createElement("DIV");
        modalContainer.setAttribute("class", "modal-container");
        let card = {},
            h3Id = null,
            userData = {},
            userModal = "";
        if(event.target === "H3"){
            h3Id = event.target.getAttribute("id");
        } else if(event.target.classList.contains("card")){
            card = event.target;
        } else if(event.target.parentNode.classList.contains("card")){
            card = event.target.parentNode;
        } else if(event.target.parentNode.parentNode.classList.contains("card")){
            card = event.target.parentNode.parentNode;
        }

        if(!h3Id){
            h3Id = card.lastElementChild.firstElementChild.getAttribute("id");
        }

        userData = usersList.results.filter(user => {
            const userId = `${user.name.first}.${user.name.last}`;
            if(userId === h3Id){
                return true;
            } else {
                return false
            }
        });

        userModal = `<div class="modal">
                        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                        <div class="modal-info-container">
                            <img class="modal-img" src="${userData[0].picture.large}" alt="profile picture">
                            <h3 id="name" class="modal-name cap">name</h3>
                            <p class="modal-text">email</p>
                            <p class="modal-text cap">city</p>
                            <hr>
                            <p class="modal-text">(555) 555-5555</p>
                            <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                            <p class="modal-text">Birthday: 10/21/2015</p>
                        </div>
                    </div>

                    <!-- IMPORTANT: Below is only for exceeds tasks -->
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>`;

        modalContainer.innerHTML = userModal;
        document.querySelector("BODY").appendChild(modalContainer);
    }

    
    getUsers()
        .then( users =>  {
            appendUsers(users);
            usersList = users;
        })
        .catch( err =>   console.error(err));
    
    gallery.addEventListener("click", (event) => {
            if(event.target !== gallery){
                getInfo(event);
            }
    });
    
})();