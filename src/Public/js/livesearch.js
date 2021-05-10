const searchInput = document.getElementById("searchInput");
const searchArea = document.getElementById("searchArea");
let timeout;
searchInput.addEventListener("keyup", () => {

  // Define Elemrnt
  let searchMenu = document.createElement("div");
  searchMenu.classList =
    "d-flex flex-column position-absolute w-100 top-100 bg-light text-dark rounded-bottom  rounded-top  ";
  searchMenu.id = "searchMenu";
  searchMenu.style.zIndex = 1080;

  if (timeout) clearTimeout(timeout);


  timeout = setTimeout(() => {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", `/livesearch?text[search]=${searchInput.value}`, true);

    ajax.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Remove Child
        if (searchArea.contains(document.getElementById("searchMenu")))
          searchArea.removeChild(document.getElementById("searchMenu"));
        // Append Child
        searchArea.appendChild(searchMenu);

        let searchData = JSON.parse(this.responseText).data;
        searchData.some((item, index) => {

            //3 ROW
          let searchItem = document.createElement("div");
          searchItem.classList = "border-bottom p-4 text-center rtl";
          searchMenu.appendChild(searchItem);
          let searchLink = document.createElement("a");
          searchLink.classList = "text-decoration-none text-dark";
          searchItem.id = `item-${index}`;
          searchLink.innerHTML = item.title;
          searchLink.href = `/jobs/${item._id}`;
          searchItem.appendChild(searchLink);

        //   VIEW MORE
          if(index === 2) {
            let searchItem = document.createElement("div");
            searchItem.classList = "border-bottom text-center rtl p-2 rounded-bottom";
            searchMenu.appendChild(searchItem);
            let searchLink = document.createElement("a");
            searchLink.classList = "text-decoration-none";
            searchLink.innerHTML = `بیشتر (${searchData.length})`;
            searchLink.href = `/jobs/?text[search]=${searchInput.value}`;
            searchItem.appendChild(searchLink);
            return true
          }
        });
        return false
      }
    };
    ajax.send();
  }, 500);

});

document.getElementById('body').addEventListener("click" , ()=>{

    if(document.getElementById('body') !== document.hasFocus) {
        if (searchArea.contains(document.getElementById("searchMenu")))
        searchArea.removeChild(document.getElementById("searchMenu"));
    }

})

