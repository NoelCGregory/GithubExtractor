const unitTestTable = document.getElementById("unitTest");
const switchChart = document.getElementById("switchChart");
const wrapperLoader = document.getElementById("wrapper");
const testStatusTable = document.getElementById("testStatus");
const searchInput = document.getElementById("searchInput");
const testDetailsTable = document.getElementById("testDetail");
let chart = null;
let overall = 0;
let chartType = "bar";
let data = null;
let dataChart = {
    labels: [
        "Tree Sitter",
        "P4c", "Both Failed"],

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
        console.log(val.error)
        if (val.error.includes(searchWord)) {
            return val;
        }
    })
    setUnitTest(filteredData);
})


async function getTrxData() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const trxData = await fetch("/getFiles");
    const dataJson = await trxData.json();

    console.log("data", dataJson)
    let map = new Map();

    let map2 = new Map();
    dataJson.map((val) => {
        let ranges = []
        console.log("Value: ", val.p4c, val.error.length)
        if (val.p4c == false && val.tree_sitter == true) {
            console.log("-------------------------")
            console.log(val.p4c, val.tree_sitter)
            overall++;
            let rangeTemp = val.error_p4c.split(",:,")
            if (map.has(val.error_p4c)) {
                let temp = map.get(val.error_p4c);
                temp.num += 1
            } else {
                map.set(val.hashcode, { error: rangeTemp[0], num: 1, range: "[" + rangeTemp[1] + "]", url: val.url, p4c: val.p4c, tree_sitter: val.tree_sitter }) //errorArray[i].replace(ranges[i],"")

            }
            // map2.set(val.hashcode, { error: val.error_p4c, num: 1, range: "", url: val.url, p4c: val.p4c, tree_sitter: val.tree_sitter }) //errorArray[i].replace(ranges[i],"")
        }
        //console.log("fddfdf")
        let errorArray = (val.error.length > 2 ? val.error.split(",:,") : []).filter((val) => {

            if (val.length > 0) {
                let temp = val.split("[");
                //console.log("Length,", temp)
                if (temp[0].length > 0) {
                    ranges.push("[" + temp[temp.length - 1])
                    return temp[0];
                }

            }
        });

        //console.log(errorArray)
        //console.log("-----")
        for (let i = 0; i < errorArray.length; i++) {
            //console.log(errorArray[i])
            overall++;
            if (map.has(errorArray[i])) {
                let temp = map.get(errorArray[i]);
                temp.num += 1
            } else {
                map.set(errorArray[i], { error: errorArray[i].replace(ranges[i], ""), num: 1, range: ranges[i], url: val.url, p4c: val.p4c, tree_sitter: val.tree_sitter }) //errorArray[i].replace(ranges[i],"")

            }
        }
        //array.push({fileName:val.file_name,p4c:val.p4c ? 1 : 0,treeSitter:val.tree_sitter? 1 : 0});


    });
    // console.log("dfdffdsdffd")
    // console.log(map)
    for (let [key, value] of map) {
        // console.log(value)

        for (let [key, value1] of map) {
            if (similar(value.error, value1.error) > 20) {

                //   console.log(similar(value.error,value1.error));
                if (map2.has(value.error)) {
                    map2.get(value.error).num++;
                } else {
                    map2.set(value.error, { error: value.error.replace(value.range, ""), num: 1, range: value.range, url: value.url, p4c: value.p4c, tree_sitter: value.tree_sitter }) //errorArray[i].replace(ranges[i],"")

                }
                // console.log("a")
            }
        }
    }

    console.log("df", map2);
    var array = [...map2.values()];
    array.sort((a, b) => b.num - a.num)
    data = array;
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
    //const counterIndex = data.findIndex((val) => val.key == "counters");
    //const timeIndex = data.findIndex((val) => val.key == "times");

    //Pie chart 
    //dataChart.datasets[0].data = [data[counterIndex].info.passed,data[counterIndex].info.failed,data[counterIndex].info.skipped];


    //Setting test status table
    testStatusTable.innerHTML = `<tr class="dark">
    <th>Overall Repos</th>
    <td></td>
    </tr><tr >
    <th>Total</th>
    <td >${overall}</td>
    </tr>`;

}





function setUnitTest(filteredData) {
    let overall = 0;
    let p4c = 0;
    let both_failed = 0;
    let tree_sitter = 0;


    //Setting all unit test result
    unitTestTable.innerHTML = filteredData.reduce((acc, val, idx) => {
        console.log(val.tree_sitter, val.p4c)
        let text = "";
        if (val.p4c != true && val.tree_sitter != true) {
            text = "Both Failed"
            both_failed++;
        } else if (val.p4c == false && val.tree_sitter == true) {
            text = "P4C Failed"
            p4c++;
        } else if (val.tree_sitter == false && val.p4c == true) {
            text = "TreeSitter Failed"
            tree_sitter++;
        } else {
            console.log("dfdffddf")
        }

        return acc += `<tr>
            <td>
            <button "type="button" class="btn btn-d" data-toggle="modal" data-target="#exampleModal${idx}" >Errors</button>
            <div class="modal fade" id="exampleModal${idx}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
             <div class="modal-dialog" role="document">
                 <div class="modal-content">
                 <div class="modal-header">
                     <h5 class="modal-title" id="exampleModalLabel">Errors</h5>
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                     </button>
                 </div>
 
                 <div class="modal-body">
                    ${val.error}
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                 </div>
                 </div>
             </div>
             </div>
            </td>

            <td>${text}</td>
            <td>${val.range}</td>
            <td>${val.num}</td>
            <td>${val.url}</td>
            </tr>`;

    }, "")
    dataChart.datasets[0].data = [tree_sitter, p4c, both_failed]
}

function similar(a, b) {
    var equivalency = 0;
    var minLength = (a.length > b.length) ? b.length : a.length;
    var maxLength = (a.length < b.length) ? b.length : a.length;
    for (var i = 0; i < minLength; i++) {
        if (a[i] == b[i]) {
            equivalency++;
        }
    }


    var weight = equivalency / maxLength;
    return weight * 100;
}



getTrxData();
