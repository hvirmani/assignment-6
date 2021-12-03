let compile = document.getElementById("compile");
let code = document.getElementById("code");
let options = document.getElementsByName("language");
let langId = 0;
let resultBox = document.getElementById("resultBox");

compile.addEventListener("click", () => {
  resultBox.innerHTML = "";
  let postRequest = new XMLHttpRequest();
  options.forEach((option) => {
    if (option.selected) {
      langId = option.value;
      if (langId != 0) {
        langId = parseInt(langId);
      }
    }
  });

  postRequest.addEventListener("load", () => {
    let codeId = JSON.parse(event.target.response).codeId;
    let getRequest = new XMLHttpRequest();
    getRequest.addEventListener("load", () => {
      let response = JSON.parse(JSON.parse(event.target.response).data);
      let output = response.output;
      let error = response.errors;
      if (error) {
        resultBox.innerHTML = error;
        clearInterval(timer);
      }
      if (output) {
        resultBox.innerHTML = output;
        clearInterval(timer);
      }
    });
    let timer = setInterval(() => {
      getRequest.open(
        "get",
        `https://codequotient.com/api/codeResult/${codeId}`
      );
      getRequest.setRequestHeader("Content-type", "application/json");
      getRequest.send();
    }, 1000);
  });

  postRequest.open("post", "https://codequotient.com/api/executeCode");
  postRequest.setRequestHeader("Content-type", "application/json");
  postRequest.send(
    JSON.stringify({
      code: code.value,
      langId: langId,
    })
  );
});
