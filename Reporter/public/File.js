const unitTestTable = document.getElementById("unitTest");
const switchChart = document.getElementById("switchChart");
const wrapperLoader = document.getElementById("wrapper");
const testStatusTable = document.getElementById("testStatus");
const searchInput = document.getElementById("searchInput");
const testDetailsTable = document.getElementById("testDetail");
let chart = null;
let chartType = "bar";
let data = null;
let dataChart = {
    labels: [
    "P4C",
    "TreeSitter","Intel Parser","Intel Lexar"],
    
    datasets: [
    {
      label: '',
      data:[1,1,1],
      backgroundColor: [
      "#50C878",
      "#FA113D",
      "#FFC107"],
    
      hoverBorderColor: [
      "#eee", "#eee", "#eee"] }],
    
};

    
switchChart.addEventListener("change",(event) =>{
    document.getElementById("switchLabel").innerText = `Switch To ${chartType} graph`;
    if(chartType == "bar"){
        chartType = "pie";
    }else{
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
        }});
})

function filter(str){
    let filteredData = null;
    if(str != "UnFilter"){
        let searchWord = str.toLowerCase();
         filteredData = data.filter((val) => {

        if(val.info.hasOwnProperty("outcome")){
            if(val.info.outcome.toLowerCase().indexOf(searchWord) != -1){
                return val;
            }
        }
      })
    }else{
        filteredData = data;
    }
    setUnitTest(filteredData);
}
searchInput.addEventListener("input",(event) =>{
    let searchWord = event.target.value.toLowerCase();
    let filteredData = data.filter((val) => {

        if(val.info.hasOwnProperty("testName")){
            let classIndex = data.findIndex((obj) =>{
                if(obj.key == "testmethod"){
                    if(obj.info.name == val.info.testName){
                        return true;
                    }
                }
                return false;
            });
    
            let className = data[classIndex].info.className

            if(val.info.testName.toLowerCase().indexOf(searchWord) != -1){
                return val;
            }else if(className.toLowerCase().indexOf(searchWord) != -1){
                return val;
            }
        
        }
    })
    setUnitTest(filteredData);
})


async function getTrxData(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const trxData = await fetch("/getFiles");
    const dataJson = await trxData.json();
    
    let map = new Map();
    dataJson.filter((val) =>{
        if(map.has(val.file_name)){
            
                let data = map.get(val.file_name);
                data.p4c += val.p4c ? 1 : 0;
                data.treeSitter +=val.tree_sitter? 1 : 0;
                data.intel_parser += val.intel_parser?1:0;
                data.intel_lexar += val.intel_lexar?1:0;
    
           
        }else{
            map.set(val.file_name,{fileName:val.file_name,p4c:val.p4c ? 1 : 0,treeSitter:val.tree_sitter? 1 : 0,intel_parser:val.intel_parser?1:0,intel_lexar:val.intel_lexar?1:0});
            //array.push({fileName:val.file_name,p4c:val.p4c ? 1 : 0,treeSitter:val.tree_sitter? 1 : 0});

        }
    })
    console.log(map);
    var array = [...map.values()];
    console.log(array);
    setUnitTest(array)
    setData(array);
    let piectx = document.getElementById("piechart");
    console.log(dataChart)
    chart= new Chart(piectx, {
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

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

function setData(data){
    //const counterIndex = data.findIndex((val) => val.key == "counters");
    //const timeIndex = data.findIndex((val) => val.key == "times");

    //Pie chart 
    //dataChart.datasets[0].data = [data[counterIndex].info.passed,data[counterIndex].info.failed,data[counterIndex].info.skipped];

    let overallLength = 0;

    for (let value of data.values()) {
      overallLength += value.intel_lexar;
    }
    console.log("dffffd",data)
    //Setting test status table
    testStatusTable.innerHTML = `<tr class="dark">
    <th>Overall Repos</th>
    <td></td>
    </tr><tr >
    <th>Total</th>
    <td >${overallLength}</td>
    </tr>`;

}





function setUnitTest(filteredData){
    let overall = 0;
    let p4c = 0;
    let treesitter = 0;
    let intel_parser = 0;
    let intel_lexar = 0;
    

    //Setting all unit test result
    unitTestTable.innerHTML = filteredData.reduce((acc,val) =>{
        overall++;
       
        p4c+=val.p4c;
        intel_lexar += val.intel_lexar;
        intel_parser += val.intel_parser;
       treesitter += val.treeSitter;
            return acc+=`<tr>
            <td><div class="badge badge-primary mr-2 mb-2 p-2 large">${val.fileName}</div></td>
            
            <td><a href="./SubFiles.html?fileName=${val.fileName}"type="button" class="btn btn-d">Number of Files : ${val.intel_lexar}</a></td>
          
            <td><div class="badge badge-primary mr-2 mb-2 p-2 large">${val.p4c >0 ?((val.treeSitter/val.p4c)*100).toFixed(2):0.00.toFixed(2)}</div></td>
        
            <td><div class="badge badge-primary mr-2 mb-2 p-2 large">${val.p4c >0 ?((val.intel_parser/val.p4c)*100).toFixed(2):0.00.toFixed(2)}</div></td>
        
            </tr>`;

    },"")
    dataChart.datasets[0].data = [p4c,treesitter,intel_parser,intel_lexar]
}



getTrxData();
