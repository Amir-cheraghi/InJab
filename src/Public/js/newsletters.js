const subscribeButton = document.getElementById("subButton");
const subscribeParent = document.getElementById("message");
const subscribeMessageDiv = document.createElement("div");

subscribeButton.addEventListener("click", () => {
  const email = document.getElementById("subEmail").value;

  const ajax = new XMLHttpRequest();
  ajax.open("POST", `/?email=${email}`, true);
  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      subscribeMessageDiv.classList = `alert shadow ${JSON.parse(this.responseText).alert} alert-dismissible`;
      subscribeMessageDiv.innerHTML = JSON.parse(this.responseText).message;
      window.scrollTo(0, 0);
    }
  };

  ajax.send();
  subscribeParent.appendChild(subscribeMessageDiv);
});
