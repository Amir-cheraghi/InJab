const applicantButton = document.getElementById("applicant");
const applicantCount = document.getElementById("applicantCount");
const applicantParent = document.getElementById("message");
const applicantMessageDiv = document.createElement("div");

applicantButton.addEventListener("click", () => {
  const ajax = new XMLHttpRequest();
  ajax.open("POST", document.URL, true);

  ajax.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if(JSON.parse(this.responseText).url) window.location.replace(JSON.parse(this.responseText).url)
      else{
      applicantMessageDiv.classList = `alert shadow ${JSON.parse(this.responseText).alert} alert-dismissible`;
      applicantMessageDiv.innerHTML = JSON.parse(this.responseText).message;
      applicantCount.innerHTML = `${JSON.parse(this.responseText).length} برای این آگهی درخواست داده اند `;
      window.scrollTo(0, 0);
      }
    }
  };

  ajax.send();
  applicantParent.appendChild(applicantMessageDiv);
});
