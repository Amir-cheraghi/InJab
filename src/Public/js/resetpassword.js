const button = document.getElementById("button");
const email = document.getElementById("email")
const messageparent = document.getElementById("message");
const messageDiv = document.createElement("div");

button.addEventListener("click", () => {
  const ajax = new XMLHttpRequest();
  ajax.open("POST", `/resetpassword?email=${email.value}`, true);

  ajax.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      {
      messageDiv.classList = `alert shadow ${JSON.parse(this.responseText).alert} alert-dismissible`;
      messageDiv.innerHTML = JSON.parse(this.responseText).message;
      window.scrollTo(0, 0);
      }
    }
  };

  ajax.send();
  messageparent.appendChild(messageDiv);
});
