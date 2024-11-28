let menuList = document.getElementById("menu-icon");
menuList.style.maxHeight = "0px";

function toggleMenu() {
    if (menuList.style.maxHeight == "0px") {
        menuList.style.maxHeight = "300px";
    } else {
        menuList.style.maxHeight = "0px";
    }
}


let signupBtn = document.getElementById("signupBtn");
let signinBtn = document.getElementById("signinBtn");
let nameField = document.getElementById("nameField");
let title = document.getElementById("title");

signinBtn.onclick = function(){
    nameField.style.maxHeight = "0px";
    title.innerHTML = "Sign In";
    signupBtn.style.backgroundColor = "blue"; 
    signinBtn.style.backgroundColor = "blue"; 
    signinBtn.style.color ="white";
    signupBtn.style.color ="white";
}

signupBtn.onclick = function(){
    nameField.style.maxHeight = "60px";
    title.innerHTML = "Sign Up";
    signupBtn.style.backgroundColor = "green"; 
    signinBtn.style.backgroundColor = "green";
    signinBtn.style.color ="white";
    signupBtn.style.color ="white";

}
function resetPassword() {
   var email = document.getElementById('email').value;
   window.location.href = 'reset-form.html?email=' + email;
}

window.addEventListener('resize', function() {
   var sections = document.getElementsByClassName('section');
   for (var i = 0; i < sections.length; i++) {
       sections[i].style.maxWidth = (window.innerWidth / 2) - 40 + 'px';
   }
});

document.getElementById('subscribeButton').addEventListener('click', function() {
   let email = document.getElementById('emailInput').value;
   
   if (validateEmail(email)) {
       alert('Thank you for subscribing with email: ' + email);
   } else {
       alert('Please enter a valid email address.');
   }
});

function validateEmail(email) {
   const re = /\S+@\S+\.\S+/;
   return re.test(email);
}

const teamMembersList = document.getElementById('team-members');

teamMembersList.addEventListener('click', function(event) {
    if (event.target.tagName === 'IMG') {
        const teamMemberName = event.target.nextElementSibling.textContent;

        alert(`You clicked on ${teamMemberName}`);
    }
});
function searchFunction() {
    var input, filter, ul, li, txtValue;
    input = document.getElementById("search-bar");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
  
    for (var i = 0; i < li.length; i++) {
      txtValue = li[i].textContent || li[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
