const code = "";
const state = "abc123";
const client_secret = "849e2f0dc0ebdf5afeee132f341eb4507c2fd0cb";
const client_id = "Iv1.c85bba9d7a4b2cb7";
const redirect_uri = encodeURI("http://localhost:8000");

const xhr = new XMLHttpRequest();

const paremas = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_secret}&redirect_uri=${redirect_uri}`;

xhr.open("POST", "https://github.com/login/oauth/access_token", true);
xhr.send(null);

xhr.addEventListener("readystatechange", (evt) => {
  if (event.readystate === 4) {
    debugger;
    console.log(event.responseText);
  }
});
