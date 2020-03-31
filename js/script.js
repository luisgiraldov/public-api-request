(function(){
    const gallery = document.getElementById("gallery");
    let searchBar = null;
    let usersList = {};
    

    //adding search-bar
    const searchContainer = document.querySelector(".search-container");
    searchContainer.innerHTML = `<form action="#" method="get">
                                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                                </form>`;

    //helper functions

    /*** 
    * `replaceSpecialCharacters` function
    * Returns a string without HTML entities or special characters
    * @param {String} userInput - Holds the string value the user typed into the search bar
    * Find any HTML entity and replace with an empty string, simulates a basic html sanitizer, and avoid creating an unexpected regex.
    ***/
    function replaceSpecialCharacters(userInput){
        return userInput.replace(/[\!\@\#\$\%\^\&\*\(\)\+\=\~\`\<\>\"\/\|\\\?]/gm, "sorry we couldn't find anyhting keep looking!");
    }
    
    //receives the date sent from the API, removes the time from it, and rerange the date in MM/DD/YYYY
    function getDateMoDayYear(date){
        const originalFormat = date.slice(0, date.indexOf("T"));
        const separateDate = originalFormat.split("-");
        const newFormat = separateDate[1] + "/" + separateDate[2] + "/"+ separateDate[0];
        return newFormat;
    }

    /***
    * `searchBarCallback` function
    * @param {String} - holds the string the user typed into the search bar
    * This function calls replaceSpecialCharacters to replace html entities and special characters
    * Calls findStudents to get the students that match the query from the user
    * Appends new pagination links
    * Display new List of students based on user's query
    ***/
    function searchBarCallback(userInput){
        if(userInput !== ""){
            const sanitizedInput = replaceSpecialCharacters(userInput);
            findStudents(sanitizedInput);
        } else if(userInput === ""){
            removingHighlightSpan();
            findStudents("");
        }
    }

    /***
    * `findStudents` function
    * Returns array with students that match the query made by the user 
    * @param {String} - Holds the input from the user
    * Everytime creates a new regex based on the user input
    * Search for students that match the pattern and save them into an array
    ***/
    function findStudents(userQuery){
        const cards = document.querySelectorAll(".card");
        const regex = new RegExp(`^.*${userQuery}.*$`, "i");
        const regexForSelection = new RegExp(`${userQuery.toLowerCase()}`, "ig");
        let found = "",
            stringMatched = "";

        for(let a = 0, len = cards.length; a < len; a++){
            cards[a].style.display = "none";
        }

        if(userQuery !== ""){
            for(let i = 0, len2 = cards.length; i < len2; i++){
                const fullName = cards[i].lastElementChild.firstElementChild;
                if(regex.test(fullName.textContent)){
                    cards[i].style.display = "";            
                    /**
                     * Add span tag to highlight the text
                     */
                    found = fullName.textContent.match(regexForSelection);
                    console.log(found);
                    stringMatched = fullName.textContent.replace(found[0], `<span class="js-stringMatched stringMatched">${found[0]}</span>`);
                    fullName.innerHTML = stringMatched;
                };
            }//end for
        }// end if
        else if(userQuery === ""){
            for(let a = 0, len = cards.length; a < len; a++){
                cards[a].style.display = "";
            }
        } //end else if
    }// end findStudents

    /***
    * `removingHighlightSpan` function 
    * Removes all the span tags added to the match that is found from the regex
    ***/
    function removingHighlightSpan(){
        const spanTags = document.querySelectorAll(".js-stringMatched");
        let text = "";
        
        for (let i = 0, len = spanTags.length; i < len; i++){
            let h3 = spanTags[i].parentNode;
            text = h3.textContent;
            h3.innerHTML = text;
        }
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

        //use spread operator to pass the array to an object, because filter returns an array
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
                   if(userPosition > 0){
                        modalContainer.innerHTML = createModal(usersList.results[userPosition - 1]);
                        userPosition -= 1;
                   }
                } else if(event.target.getAttribute("id") === "modal-next"){
                   console.log(userPosition);
                   console.log(usersList.results);
                   console.log(usersList.results[userPosition + 1]);
                   if(userPosition < usersList.results.length - 1){
                        modalContainer.innerHTML = createModal(usersList.results[userPosition + 1]);
                        userPosition += 1;
                   }
                }
            }
        });
    }

    getUsers("")
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

    //submit event to request spanish users, it only works when spanish language is specified, it doesn't support any other language yet.
    searchContainer.addEventListener("submit", (event) => {
        const input = replaceSpecialCharacters(document.getElementById("search-input").value.toLowerCase());
        if(input === "spanish" || input === "english"){
            getUsers(input)
                .then( users =>  {
                        appendUsers(users);
                        usersList = users;
                })
                .catch( err =>   console.error(err));
        }// end if
    });//end submit event

    //handle events fired from the search bar, the search event is to clear the value of the input field and brings all users again
    searchBar = document.getElementById("search-input");
    searchBar.addEventListener("keyup", event => searchBarCallback(event.target.value.toLowerCase()) );
    searchBar.addEventListener("search", event => {
        event.target.value = "";
        searchBarCallback(event.target.value);
    });
    
})();