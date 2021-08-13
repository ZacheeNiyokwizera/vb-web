const firebaseConfig = {
    apiKey: "AIzaSyC1VsC_aGyDcU0_1UAx8zzEo7f6OCe6RUg",
    authDomain: "kuja-kujans-survey-ecdb7.firebaseapp.com",
    databaseURL: "https://kuja-kujans-survey-ecdb7.firebaseio.com",
    projectId: "kuja-kujans-survey-ecdb7",
    storageBucket: "kuja-kujans-survey-ecdb7.appspot.com",
    messagingSenderId: "840254170866",
    appId: "1:840254170866:web:32e0b5efa564e69866526b",
    measurementId: "G-HT9FM30T7S"

};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();

let postForm = document.getElementById('post-form');
let addBtn = document.getElementById('add-btn');
let closeBtn = document.getElementById('close-btn');


//  When the user clicks the add button, show the form
addBtn.addEventListener('click', showPostForm);

function showPostForm() {
    postForm.style.display = "block";

}

//  When the user clicks the close button, close the form

closeBtn.addEventListener('click', closePostForm);

function closePostForm() {
    postForm.style.display = "none";

}



function upload() {

    var image = document.getElementById('image').files[0];

    var post = document.getElementById('post').value;
    var actionTag = document.getElementById('tag').value;

    var actionDate = document.getElementById('date').value;

    var actionLink = document.getElementById('link').value;

    var actionLocation = document.getElementById('location').value;

    var imageName = image.name;
    //firebase storage reference
    //it is the path where the image will be stored
    var storageRef = firebase.storage().ref('images/' + imageName);
    //upload image to selected storage reference
    //passing the image 
    var uploadTask = storageRef.put(image);
    //to get the state of image uploading....
    uploadTask.on('state_changed', function(snapshot) {
        //get task progress by following code
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + " done");
    }, function(error) {
        //handle error here
        console.log(error.message);
    }, function() {
        //handle successful upload here..
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            //get the image download url here and upload it to database
            //our path where data is stored ...push is used so that every post have unique id
            firebase.database().ref('uSurvey/').push().set({
                time: actionDate,
                source: actionLink,
                tag: actionTag,
                area: actionLocation,
                text: post,
                imageURL: downloadURL
            }, function(error) {
                if (error) {
                    alert("Error while uploading");
                } else {
                    alert("Successfully uploaded");
                    //now reset your form
                    postForm.reset();
                    getData();
                }
            });
        });
    });

}

window.onload = function() {
    this.getData();
}

//  When the user clicks the edit button, show the form



function getData() {
    firebase.database().ref('uSurvey/').once('value').then(function(snapshot) {
        //get your posts div
        let posts_div = document.getElementById('posts');
        //remove all remaining data in that div
        posts.innerHTML = "";
        //get data from firebase
        let data = snapshot.val();
        console.log(data);
        //now pass this data to our posts div
        //we have to pass our data to for loop to get one by one
        //we are passing the key of that post to delete it from database
        for (let [key, value] of Object.entries(data)) {

            posts_div.innerHTML = "<div class='action-card'>" + "<div class='action-img'>" +
                "<img src='" + value.imageURL + "' style='height:250px;'></div>" +

                "<div class='card-body'>" +
                "<div class='card-content'>" +
                "<p class='card-text'>" + value.time + "</p>" +
                "<p class='card-text'>" + value.area + "</p>" +
                "<p class='card-text'>" + value.tag + "</p>" +
                "<a class='card-text' href='" + value.source + "'>View idea</a>" +
                "<button class='btn btn-danger' id='" + key + "' onclick='delete_post(this.id)'>Delete</button>" +
                "<button class='btn btn-info' id='" + key + "' onclick='showEditForm(this.id)'>Edit</button>" +
                "</div>" +

                "<div>" +
                "<p class='card-text'>" + value.text + "</p>" +
                "</div>" +

                "</div>" +

                "</div>" + posts_div.innerHTML;

        }

    });


}


function getFormValue(data) {
    document.getElementById('image').files[0].value = data.imageURL;
    document.getElementById("post").value = data.text;
    document.getElementById('tag').value = data.tag;
    document.getElementById('date').value = data.date;
    document.getElementById('link').value = data.source;
    document.getElementById('location').value = data.area;
    console.log(data.text)

}


function showEditForm(value) {
    postForm.style.display = "block";
    getFormValue(value);

}

function delete_post(key) {
    firebase.database().ref('uSurvey/' + key).remove();
    getData();

}
// let logInDiv = document.getElementById('log-in-div');
let cardsDiv = document.getElementById('cards-div');

const logInForm = document.getElementById('login-form');
logInForm.addEventListener('submit', e => {
    e.preventDefault();
    const loginEmail = logInForm['login-email'].value;
    const loginPassword = logInForm['login-password'].value;
    // console.log(loginEmail, loginPassword);
    auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(() => {
        console.log('login success');

        // location = "admin.html";
    }).catch(err => {
        const loginError = document.getElementById("loginError");
        loginError.innerText = err.message;
    })
})

// logout
let logOutBtn = document.getElementById("logOutBtn");
logOutBtn.addEventListener('click', logOut)

function logOut() {
    auth.signOut();
    logInForm.style.display = "block";
    cardsDiv.style.display = "none";
    // logInForm.style.display = "block";
    // location = "index.html";
}

// checking if user is signed in or not
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user is signed in at users.html');
        logInForm.style.display = "none";
        cardsDiv.style.display = "block";
    } else {
        alert('your login session has expired or you have logged out, login again to continue');
        // location = "login.html";
    }
})