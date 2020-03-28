(function(){
    
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
                                <h3 id="${user.name.first}${user.name.last}" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                                <p class="card-text">${user.email}</p>
                                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                            </div>
                        </div>`;
            
            usersHTML += card;
            console.log(user);
        });
        gallery.innerHTML = usersHTML;
    }

    
    getUsers().then( users => {
        appendUsers(users);
    });
    
})();