/******************************************
Treehouse Techdegree:
FSJS project 5 - Public-API-Request
******************************************/
(function(Project5){
    const gallery = document.getElementById("gallery");
    let searchBar = null;
    let usersList = {},
        userPosition = null;
    
    //adding search-bar
    const searchContainer = document.querySelector(".search-container");
    searchContainer.innerHTML = `<form action="#" method="get">
                                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                                </form>`;

    //adding modal window                       
    const modalContainer = document.createElement("DIV");
    modalContainer.setAttribute("class", "modal-container");
    const body = document.querySelector("BODY");
    body.appendChild(modalContainer);

    /*** 
    * `getUsers` function
    * @returns {Promise} - A new promise requesting 12 users to the API
    * @param {String} queryString - Holds the string value the user typed into the search bar to bring spanish users, this value is optional, it is not required
    * to make the function work.
    * Makes use of promises and Ajax to request data to randomuser.me API
    ***/
    function getUsers(queryString){
        let url = "";
        queryString === "spanish"? url = "https://randomuser.me/api/?results=12&nat=es" : url = "https://randomuser.me/api/?results=12&nat=au,ca,us,nz";
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
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

    /*** 
    * `appendUsers` function
    * @param {Object} users - Holds an object that contains users returned by the API
    * Appends 12 users to the gallery
    ***/
    function appendUsers(users){
        let usersHTML = "";
        users.results.map( user => {
            const card = `<div class="card text-wraper">
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
            //Modifies the ID value to track it with prev and next buttons on the modal
            user.id.value = `${user.name.first}.${user.name.last}`;
        });
        gallery.innerHTML = usersHTML;
    }

    /*** 
    * `getInfo` function
    * @param {Object} event - Holds the event that was triggered
    * gets the information of the card who triggered the event, add it to the modal, it also gets the user's position inside the array of users (the user who was clicked)
    ***/
    function getInfo(event){
        let card = {},
            h3Id = null,
            userData = {}
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

        //use spread operator to pass the array to an object, because filter returns an array
        userData = {...userData[0]};
        modalContainer.innerHTML = Project5.createModal(userData);
        //trigger animation down
        setTimeout( () => {
            modalContainer.classList.add("is-open");
        }, 100);
    } //end getInfo

    /***
    * Initializing the call, and receiving a promise back
    ***/
    getUsers("")
        .then( users =>  {
            appendUsers(users);
            usersList = users;
        })
        .catch( err =>   console.error(err));
    
    /***
    * Handling clicks to show modal
    ***/
    gallery.addEventListener("click", (event) => {
            if(event.target !== gallery){
                getInfo(event);
            }
    });

    /***
    * Handling submit event to request spanish users, it only works when spanish language is specified, it doesn't support any other language yet.
    ***/
    searchContainer.addEventListener("submit", (event) => {
        event.preventDefault();
        const error = document.getElementById("error");
        const input = Project5.replaceSpecialCharacters(document.getElementById("search-input").value.toLowerCase());
        if(input === "spanish" || input === "english"){
            getUsers(input)
                .then( users =>  {
                        appendUsers(users);
                        usersList = users;
                })
                .catch( err =>   console.error(err));
                //in case submiting the form and the error message is displayed, remove it.
                if(!error.classList.contains("hidden")){
                    error.classList.add("hidden");
                }
        }// end if
    });//end submit event

    /***
    * handle events fired from the search bar, the search event is to clear the value of the input field and bring all users again
    ***/
    searchBar = document.getElementById("search-input");
    searchBar.addEventListener("keyup", event => Project5.searchBarCallback(event.target.value.toLowerCase()) );
    searchBar.addEventListener("search", event => {
        event.target.value = "";
        Project5.searchBarCallback(event.target.value);
    });

    /***
    * Click event to hide the modal window or handle next and previous buttons
    ***/
    //
    modalContainer.addEventListener("click", (event) => {
        const data = {
                event: event,
                modalContainer: modalContainer,
                userPosition: userPosition,
                usersList: usersList
            };
        const returnedValue = Project5.modalCallback(data);
        //keeps track of userPosition to display the correct users when clicking prev and next
        if(!isNaN(returnedValue)){
            userPosition = returnedValue;
        }
    }); // end click event listener

    /***
    * When the DOM has loaded, fires up the fade in animation
    ***/
    window.addEventListener("load", () => {
        document.querySelector("body").classList.add("loaded"); 
    });
})(Project5);