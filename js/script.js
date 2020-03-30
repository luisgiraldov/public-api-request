(function(){
    const gallery = document.getElementById("gallery");
    let usersList = {};

    //helper functions
    //receives the date sent from the API, removes the time from it, and rerange the date in MM/DD/YYYY
    function getDateMoDayYear(date){
        const originalFormat = date.slice(0, date.indexOf("T"));
        const separateDate = originalFormat.split("-");
        const newFormat = separateDate[1] + "/" + separateDate[2] + "/"+ separateDate[0];
        return newFormat;
    }

    //create the modal to display
    function createModal(userData){
        return `<div class="modal">
                        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                        <div class="modal-info-container">
                            <img class="modal-img" src="${userData.picture.large}" alt="profile picture">
                            <h3 id="${userData.name.first}.${userData.name.last}" class="modal-name cap">${userData.name.first} ${userData.name.last}</h3>
                            <p class="modal-text">${userData.email}</p>
                            <p class="modal-text cap">${userData.location.city}</p>
                            <hr>
                            <p class="modal-text">${userData.phone}</p>
                            <p class="modal-text">${userData.location.street.number} ${userData.location.street.name}, ${userData.location.city}, ${userData.location.state} ${userData.location.postcode}</p>
                            <p class="modal-text">Birthday: ${getDateMoDayYear(userData.dob.date)}</p>
                        </div>
                    </div>
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>`;
    }

    //request the users to the API
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
    //appends the 12 users to the gallery
    function appendUsers(users){
        const gallery = document.getElementById("gallery");
        let usersHTML = "";
        users.results.map( user => {
            const card = `<div class="card">
                            <div class="overlay"></div>
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

    //gets the information of the card who triggered the event, add it to the modal and append it to the body
    function getInfo(event){
        const body = document.querySelector("BODY");
        const modalContainer = document.createElement("DIV");
        modalContainer.setAttribute("class", "modal-container");
        let card = {},
            h3Id = null,
            userData = {},
            userPosition = null;
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
                userPosition = usersList.results.indexOf(user);
                return true;
            } else {
                return false
            }
        });

        userData = {...userData[0]};

        modalContainer.innerHTML = createModal(userData);
        body.appendChild(modalContainer);

        //closes the modal window
        modalContainer.addEventListener("click", (event) => {
            const closeButton = modalContainer.firstElementChild.firstElementChild;
            //validates that the element who triggered the event was modalContainer, or closeButton, or the X inside the strong tags 
            if(event.target === modalContainer || event.target === closeButton || event.target === closeButton.firstElementChild){
                body.removeChild(modalContainer);
            }

            //previous next
            if(event.target.tagName === "BUTTON"){
                if(event.target.getAttribute("id") === "modal-prev"){
                   console.log(userPosition);
                   console.log(usersList.results);
                   console.log(usersList.results[userPosition - 1]);
                   modalContainer.innerHTML = createModal(usersList.results[userPosition - 1]);

                } else if(event.target.getAttribute("id") === "modal-next"){
                   console.log(userPosition);
                   console.log(usersList.results);
                   console.log(usersList.results[userPosition + 1]);
                   modalContainer.innerHTML = createModal(usersList.results[userPosition + 1])
                }
                console.log("entro");
            }
        });
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