// Array to hold each profile
let profiles = [];

//function to add user information
const addProfile = (ev) => {
    ev.preventDefault();
    let profile = {
        name: document.getElementById('flname').value,
        address: document.getElementById('addy').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value
    }

    //push profile information into the array
    profiles.push(profile);

    //once the submit button is clicked, form values reset
   document.querySelector('form').reset

    //saving to local storage
    localStorage.setItem('profileList',JSON.stringify(profiles))


}


document.addEventListener('DOMContentLoaded', ()=>{
document.getElementById('submit').addEventListener("click", addProfile);
});