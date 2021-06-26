document.getElementById("salary").addEventListener("change", () => {
  if (document.getElementById("salary").selectedIndex === 2) {
    const parent = document.getElementById("container");
    let input = document.createElement("input");
    input.type = "number";
    input.name = "salary";
    input.min = 0;
    input.max = 15000000;
    input.placeholder = "حداکثر 15 میلیون تومان";
    input.classList = "form-control rtl";
    input.id = 'salaryValue'

    let firstdiv = document.createElement("div");
    firstdiv.classList = "w-50 mr-3";
    firstdiv.id = "salarygroup";
    let secdiv = document.createElement("div");
    secdiv.classList = "input-group mb-3";
    let lastdiv = document.createElement("div");
    lastdiv.classList = "input-group-append";
    let title = document.createElement("label");
    title.classList = "input-group-text";
    title.innerHTML = "میزان حقوق";

    parent.appendChild(firstdiv);
    firstdiv.appendChild(secdiv);
    secdiv.appendChild(lastdiv);
    lastdiv.appendChild(title);
    secdiv.appendChild(input);

    $('#salary').attr('name' , '')
    $('#salaryValue').attr('name','salary')
  } else if (document.getElementById("salary").selectedIndex === 1) {
    document
      .getElementById("container")
      .removeChild(document.getElementById("salarygroup"));
      $('#salary').attr('name' , 'salary')

  }
});
