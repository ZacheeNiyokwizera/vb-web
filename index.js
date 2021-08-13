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


function upload() {
    //get your image
    const image = document.getElementById('image').files[0];
    const post = document.getElementById('post').value;
    const actionDate = document.getElementById('date').value;
    const actionLink = document.getElementById('link').value;
    const actionLocation = document.getElementById('location').value;
    const imageName = image.name;
    //firebase storage reference
    //it is the path where the image will be stored
    const storageRef = firebase.storage().ref('images/' + imageName);
    //upload image to selected storage reference
    // passing image 
    const uploadTask = storageRef.put(image);
    //to get the state of image uploading....
    uploadTask.on('state_changed', function(snapshot) {
        //get task progress by following code
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + " done");
    }, function(error) {
        //handle error here
        console.log(error.message);
    }, function() {
        //handle successful upload 
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            //get the image download url here and upload it to databse
            //our path where data is stored ...push is used so that every post have unique id
            firebase.database().ref('uSurvey/').push().set({
                time: actionDate,
                source: actionLink,
                area: actionLocation,
                text: post,
                imageURL: downloadURL
            }, function(error) {
                if (error) {
                    alert("Error while uploading");
                } else {
                    alert("Successfully uploaded");
                    // reset the form
                    document.getElementById('post-form').reset();
                    getdata();
                }
            });
        });
    });

}

window.onload = function() {
    this.getdata();
}


function getdata() {
    firebase.database().ref('uSurvey/').once('value').then(function(snapshot) {
        //get your posts div
        var posts_div = document.getElementById('posts');
        //remove all remaining data in that div
        posts.innerHTML = "";
        //get data from firebase
        var data = snapshot.val();
        console.log(data);
        //pass this data to the posts div
        //we have to pass the data to for loop to get one by one
        for (let [key, value] of Object.entries(data)) {

            posts_div.innerHTML = `
            <div class='action-card'> 

            <div class='action-img'> 
            <img src= ${value.imageURL} style='height:250px;'> 
            </div>

            <div class='card-body'>
            <div class="card-content">
            <p class='card-text'> ${value.time}|</p>
            <p class='card-text'> ${value.area}|</p>
            <p class='card-text'> ${value.tag}|</p>
            <a class='card-text' href=${value.source}|>View idea</a> 
            </div>

            <div>
             <p class='card-text'> ${value.text}</p>
            </div>
           
            </div>

            </div> ${posts_div.innerHTML}`
        }
    });
}

//Javacript for responsive navigation menu
const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navigation.classList.toggle("active");
});

//Javacript for video slider navigation
const btns = document.querySelectorAll(".nav-btn");
const slides = document.querySelectorAll(".video-slide");
const contents = document.querySelectorAll(".content");

var sliderNav = function(manual) {
    btns.forEach((btn) => {
        btn.classList.remove("active");
    });

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    contents.forEach((content) => {
        content.classList.remove("active");
    });

    btns[manual].classList.add("active");
    slides[manual].classList.add("active");
    contents[manual].classList.add("active");
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        sliderNav(i);
    });
});