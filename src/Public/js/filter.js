function divNum(number) {
  let text = "";
  let counter = 0;
  for (let i = number.length - 1; i >= 0; i--) {
    if (counter != 0 && counter % 3 == 0) text = "," + text;
    counter++;
    text = number[i] + text;
  }
  return text;
}

document.getElementById("minimum").addEventListener("mousedown", () => {
  document.getElementById("minimum").addEventListener("mousemove", () => {
    let minimum = document.getElementById("minimum").value;
    document.getElementById("minimumlebel").innerHTML =
      "حداقل : " + divNum(minimum) + " تومان";
    minimum = divNum(minimum);
  });
});

document.getElementById("maximum").addEventListener("mousedown", () => {
  document.getElementById("maximum").addEventListener("mousemove", () => {
    let maximum = document.getElementById("maximum").value;
    document.getElementById("maximumlebel").innerHTML =
      "حداکثر : " + divNum(maximum) + " تومان";
    minimum = divNum(minimum);
  });
});
