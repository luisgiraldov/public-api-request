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


    
})();