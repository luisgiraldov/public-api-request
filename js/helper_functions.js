/******************************************
Treehouse Techdegree:
FSJS project 5 - Public-API-Request
******************************************/
(function(window){
    'use strict';
    let Project5 = window.Project5 || {};

    /*** 
    * `replaceSpecialCharacters` function
    * @returns {String} - string without HTML entities or special characters
    * @param {String} userInput - Holds the string value the user typed into the search bar
    * Find any HTML entity and replace with an empty string, simulates a basic html sanitizer, and avoid creating an unexpected regex.
    ***/
    function replaceSpecialCharacters(userInput){
        return userInput.replace(/[\!\@\#\$\%\^\&\*\(\)\+\=\~\`\<\>\"\/\|\\\?]/gm, "sorry we couldn't find anyhting keep looking!");
    }

    /***
    * `findUsers` function
    * @param {String} - Holds the input from the user
    * Everytime creates a new regex based on the user input
    * Search for students that match the pattern and save them into an array
    ***/
    function findUsers(userQuery){
        const cards = document.querySelectorAll(".card");
        const divError = document.getElementById("error");
        const regex = new RegExp(`^.*${userQuery}.*$`, "i");
        const regexForSelection = new RegExp(`${userQuery.toLowerCase()}`, "ig");
        let found = "",
            stringMatched = "";

        for(let a = 0, len = cards.length; a < len; a++){
            cards[a].style.display = "none";
        }

        //every call hides the error message
        divError.classList.add("hidden");

        if(userQuery !== ""){
            const usersFound = [];
            for(let i = 0, len2 = cards.length; i < len2; i++){
                const fullName = cards[i].lastElementChild.firstElementChild;
                if(regex.test(fullName.textContent)){
                    cards[i].style.display = "";            
                    /**
                     * Add span tag to highlight the text
                     */
                    found = fullName.textContent.match(regexForSelection);
                    stringMatched = fullName.textContent.replace(found[0], `<span class="js-stringMatched stringMatched">${found[0]}</span>`);
                    fullName.innerHTML = stringMatched;
                    usersFound.push(fullName);
                };
            }//end for
            
            //if not result is found hide cards and display a sorry message
            if(!usersFound.length > 0){
                divError.classList.remove("hidden");
            }
        }// end if
        else if(userQuery === ""){
            for(let a = 0, len = cards.length; a < len; a++){
                cards[a].style.display = "";
            }
        } //end else if
    }// end findUsers

    //stays just here
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

    //stays just here
    
    /***
    * `getDateMoDayYear` function
    * @returns {String} newFormat - Holds a date string in a MM/DD/YYYY format
    * @param {String} date - holds a string date in a YYYY/MM/DD format
    * Receives the date sent from the API, removes the time from it, and rearrange the date in MM/DD/YYYY
    ***/
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
    * Calls findUsers to get the students that match the query from the user
    * Display new List of users based on user's query
    ***/
    function searchBarCallback(userInput){
        if(userInput !== ""){
            const sanitizedInput = replaceSpecialCharacters(userInput);
            findUsers(sanitizedInput);
        } else if(userInput === ""){
            removingHighlightSpan();
            findUsers("");
        }
    }

    /***
    * `createModal` function
    * @returns {String} - String that is going to be appended to the body
    * @param {Object} userData - holds an object that contains the information from the user to display on the modal
    * Creates a template literal with the markup for the modal, with information specific to the user requested
    ***/
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

    /***
    * `modalCallback` function
    * @returns {Number} - holds the new user's position, keep in mind it returns that value only when the previous and next button are pressed on the modal
    * @param {Object} data - holds an object that contains, the event object, the modal container object, the user's position on the array of
    * objects returned by the API, the original list of users as well.
    * It is called on a click event on modal container, it handles the next and previous buttons to display the correct user, based on the 
    * position of the actual user, also hides the modal, either by clicking the x button inside the modal or by clicking outside the modal window (modal container)
    ***/
    function modalCallback(data) {
        const event = data.event;
        const modalContainer = data.modalContainer;
        const closeButton = modalContainer.firstElementChild.firstElementChild;
        const usersList = data.usersList.results;
        let userPosition = data.userPosition;
        
        //validates that the element who triggered the event was modalContainer, or closeButton, or the X inside the strong tags 
        if(event.target === modalContainer || event.target === closeButton || event.target === closeButton.firstElementChild){
            //trigger animation up
            modalContainer.classList.remove("is-open");
        }

        //previous, next
        if(event.target.tagName === "BUTTON"){
            if(event.target.getAttribute("id") === "modal-prev"){
                if(userPosition > 0){
                    modalContainer.innerHTML = createModal(usersList[userPosition - 1]);
                    userPosition -= 1;
                    
                }
            } else if(event.target.getAttribute("id") === "modal-next"){
                if(userPosition < usersList.length - 1){
                    modalContainer.innerHTML = createModal(usersList[userPosition + 1]);
                    userPosition += 1;
                }
            }
            return userPosition;
        }
    }// end modalCallback

    //Public API
    Project5.replaceSpecialCharacters = replaceSpecialCharacters;
    Project5.searchBarCallback = searchBarCallback;
    Project5.createModal = createModal;
    Project5.modalCallback = modalCallback;
    window.Project5 = Project5;
})(window);