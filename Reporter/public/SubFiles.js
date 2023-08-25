const unitTestTable = document.getElementById("unitTest");
const switchChart = document.getElementById("switchChart");
const wrapperLoader = document.getElementById("wrapper");
const testStatusTable = document.getElementById("testStatus");
const searchInput = document.getElementById("searchInput");
const testDetailsTable = document.getElementById("testDetail");
let chart = null;
let length = 0;
let chartType = "bar";
let data = null;
let dataChart = {
    labels: [
        "P4C",
        "TreeSitter", "Intel Lexar","Intel Parser"],

    datasets: [
        {
            label: '',
            data: [1, 1, 1],
            backgroundColor: [
                "#50C878",
                "#FA113D",
                "#FFC107"],

            hoverBorderColor: [
                "#eee", "#eee", "#eee"]
        }],

};


switchChart.addEventListener("change", (event) => {
    document.getElementById("switchLabel").innerText = `Switch To ${chartType} graph`;
    if (chartType == "bar") {
        chartType = "pie";
    } else {
        chartType = "bar";
    }

    var piectx = document.getElementById("piechart");
    chart.destroy();
    chart = new Chart(piectx, {
        type: chartType,
        data: dataChart,
        options: {
            title: {
                display: true,
                text: 'Test Cases Statistics'
            }
        }
    });
})

function filter(str) {
    let filteredData = null;
    if (str != "UnFilter") {
        let searchWord = str.toLowerCase();
        filteredData = data.filter((val) => {

            if (val.info.hasOwnProperty("outcome")) {
                if (val.info.outcome.toLowerCase().indexOf(searchWord) != -1) {
                    return val;
                }
            }
        })
    } else {
        filteredData = data;
    }
    setUnitTest(filteredData);
}
searchInput.addEventListener("input", (event) => {
    let searchWord = event.target.value.toLowerCase();
    let filteredData = data.filter((val) => {

        if (val.info.hasOwnProperty("testName")) {
            let classIndex = data.findIndex((obj) => {
                if (obj.key == "testmethod") {
                    if (obj.info.name == val.info.testName) {
                        return true;
                    }
                }
                return false;
            });

            let className = data[classIndex].info.className

            if (val.info.testName.toLowerCase().indexOf(searchWord) != -1) {
                return val;
            } else if (className.toLowerCase().indexOf(searchWord) != -1) {
                return val;
            }

        }
    })
    setUnitTest(filteredData);
})


async function getTrxData() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const trxData = await fetch("/getSubFiles", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "fileName": urlParams.get('fileName') })
    });
    const dataJson = await trxData.json();


    let map = new Map();
    dataJson.filter((val) => {
        if (map.has(val.file_name + val.subset)) {
            let data = map.get(val.file_name + val.subset);
            data.numSimilar += 1;

        } else {
            map.set(val.file_name + val.subset, {
                fileName: val.file_name, numSimilar: 0, subset: val.subset, p4c: val.p4c, treeSitter: val.tree_sitter, error: val.error,
                numberConstant: val.number_constant, numberParser: val.number_parser, numberDeclaration: val.number_declaration, numberControl: val.number_control,
                numberStatments: val.number_if, url: val.url, error_p4c: val.error_p4c,intel_lexar:val.intel_lexar,intel_parser:val.intel_parser
            });
            //array.push({fileName:val.file_name,p4c:val.p4c ? 1 : 0,treeSitter:val.tree_sitter? 1 : 0});

        }
    })
    console.log(map);
    var array = [...map.values()];

    setUnitTest(array)
    setData(array);
    let piectx = document.getElementById("piechart");
    console.log(dataChart)
    chart = new Chart(piectx, {
        type: chartType,
        data: dataChart,
        options: {
            title: {
                display: true,
                text: 'Test Cases Statistics'
            }
        }
    });
    sleep(10).then(() => {
        wrapperLoader.remove();
    });
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function setData(data) {
    
    testStatusTable.innerHTML = `<tr class="dark">
    <th>Overall Repos</th>
    <td></td>
    </tr><tr >
    <th>Total</th>
    <td >${length}</td>
    </tr>`;

}





function setUnitTest(filteredData) {
    let overall = 0;
    let p4c = 0;
    let treesitter = 0;
    let intel_lexar = 0;
    let intel_parser = 0;


    //Setting all unit test result
    unitTestTable.innerHTML = filteredData.reduce((acc, val) => {

        let errorArray = (val.error.length > 2 ? val.error.split(",:,") : []).filter((val) => {

            if (val.length > 0) {
                let temp = val.split("[");
                if (temp[0].length > 0) {
                    return val;
                }

            }
        });
        overall++;
        if (val.p4c) {
            p4c++;
        }
        if (val.treeSitter) {
            treesitter++;
        }
        if(val.intel_lexar){
            intel_lexar++;
        }
        if(val.intel_parser){
            intel_parser++;
        }
        console.log(val)
        length += 1;
        return acc += `<tr>
            <td><div class="badge badge-primary mr-2 mb-2 p-2 large">${val.fileName}</div></td>
            <td>${val.subset}</td>
            <td>${val.numSimilar + 1}</td>
            <td><div class="badge badge-${val.p4c ? "success" : "danger"} large">${val.p4c}</div></td>
           <td>
           <div class="badge badge-${val.treeSitter ? "success" : "danger"} large">${val.treeSitter}</div></td>
           </td>
           <td>
           <div class="badge badge-${val.intel_lexar ? "success" : "danger"} large">${val.intel_lexar}</div></td>
           </td>
           <td>
           <div class="badge badge-${val.intel_parser ? "success" : "danger"} large">${val.intel_parser}</div></td>
           </td>
           <td><div class="badge badge-primary mr-2 mb-2 p-2 large" >${val.numberConstant}</div></td>
           <td><div class="badge badge-primary mr-2 mb-2 p-2 large">${val.numberParser}</div></td>
           <td><div class="badge badge-primary mr-2 mb-2 p-2 large" >${val.numberDeclaration}</div></td>
           <td><div class="badge badge-primary mr-2 mb-2 p-2 large">${val.numberControl}</div></td>
           <td><div class="badge badge-primary mr-2 mb-2 p-2 large" >${val.numberStatments}</div></td>
           <td>
           <button "type="button" class="btn btn-d" data-toggle="modal" data-target="#exampleModal${val.subset}" >Number Of Errors: ${errorArray.length > 0 ? errorArray.length : "None"}</button>
           <div class="modal fade" id="exampleModal${val.subset}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Errors</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    ${errorArray.reduce((acc, val1, idx) => {
            console.log(val1)
            return acc += `<div class="card text-white bg-dark mb-3" style="max-width: auto;">
                            <div class="card-header">Error ${idx}</div>
                            <div class="card-body">
                            <h6 class="card-title">Url of File: ${val.url}</h6>
                              <p class="card-text">${val1.replace("<", "&lt;").replace(">", "&gt;")}</p>
                            </div>
                          </div>`

        }, "")}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
         </td>
         <td>
           <button "type="button" class="btn btn-d" data-toggle="modal" data-target="#exampleModal" >Number Of Errors: </button>
           <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Errors</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                   <div class="card text-white bg-dark mb-3" style="max-width: auto;">
                            <div class="card-header">Error</div>
                            <div class="card-body">
                            <h6 class="card-title">Url of File: ${val.url}</h6>
                              <p class="card-text">${val.error_p4c.replace("<", "&lt;").replace(">", "&gt;")}</p>
                            </div>
                          </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
         </td>
            </tr>`;

    }, "")
    dataChart.datasets[0].data = [p4c, treesitter, intel_lexar,intel_parser]
}



getTrxData();
