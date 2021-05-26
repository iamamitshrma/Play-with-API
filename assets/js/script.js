console.log("Postman Clone");

//utility function
//1. Utility function to get DOM element from string
getElementFromString = (string) => {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}



//initialize no of parameters
let addedParamsCount = 0;

//hide the parameter box initially
let parametersBox = document.getElementById('parametersBox');
parametersBox.style.display = 'none';


//if the user clicks on params, hide the json box
let paramsRadio = document.getElementById('paramsRadio');
paramsRadio.addEventListener('click', () => {
    document.getElementById('requestJsonBox').style.display = 'none';
    document.getElementById('parametersBox').style.display = 'block';
});


//if the user clicks on json, hide the parameters box
let jsonRadio = document.getElementById('jsonRadio');
jsonRadio.addEventListener('click', () => {
    document.getElementById('parametersBox').style.display = 'none';
    document.getElementById('requestJsonBox').style.display = 'block';
});


//if the users click on + button, add more parameters
let addParameters = document.getElementById('addParameters');
addParameters.addEventListener('click', () => {
    let params = document.getElementById('params');
    let string = `<div class="form-row my-2">
                        <div class="row g-3">
                            <label for="url" class="col-sm-2 col-form-label">Parameter ${addedParamsCount + 2}</label>
                            <div class="col-md-4">
                                <input class="form-control" type="text" id="parameterKey${addedParamsCount + 2}" placeholder="Enter Parameter ${addedParamsCount + 2} Key">
                            </div>
                            <div class="col-md-4">
                                <input type="text" class="form-control" id="parameterValue${addedParamsCount + 2}"
                                    placeholder="Enter Parameter ${addedParamsCount + 2} Value">
                            </div>
                            <button class="col-md-1 btn btn-primary deleteParameter">-</button>
                        </div>
                    </div>`;

    //convert the element string to DOM node
    let paramElement = getElementFromString(string);
    params.appendChild(paramElement);

    //add an event listener to remove the parameter on clicking - button
    let deleteParameter = document.getElementsByClassName('deleteParameter');
    for (let item of deleteParameter) {
        item.addEventListener('click', (e) => {
            e.target.parentElement.remove();
        });
    }

    addedParamsCount++;
});


//if the user clicks on submit button
let submit = document.getElementById('submit');
submit.addEventListener('click', () => {
    //show please wait in the response box to request patience from the user
    // document.getElementById('responseJsonText').value = "Please wait... Fetching response...";
    document.getElementById('responsePrism').innerHTML = "Please wait... Fetching response...";

    //fetch all the value  users has entered
    let url = document.getElementById('urlField').value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;



    //if user has used params option instead of json, collect all the parameters in an object
    let data = {};
    if (contentType == 'params') {
        for (let i = 0; i < addedParamsCount + 1; i++) {
            if (document.getElementById('parameterKey' + (i + 1)) != undefined) {
                let key = document.getElementById('parameterKey' + (i + 1)).value;
                let value = document.getElementById('parameterValue' + (i + 1)).value;
                data[key] = value;
            }
        }
        data = JSON.stringify(data);
    } else {
        data = document.getElementById('requestJsonText').value;
    }

    //log all the value in console for debugging
    console.log("URL is ", urlField);
    console.log("requestType is ", requestType);
    console.log("contentType is ", contentType);
    console.log("data is ", data);


    //if the request type is post invoke fetch api to create a post request
    if (requestType == 'GET') {
        fetch(url, {
                method: 'GET'
            })
            .then(response => response.text())
            .then((text) => {
                // document.getElementById('responseJsonText').value = text;
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            });
    } else {
        fetch(url, {
                method: 'POST',
                body: data,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
            .then(response => response.text())
            .then((text) => {
                // document.getElementById('responseJsonText').value = text;
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            });
    }
})