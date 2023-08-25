const unitTestTable = document.getElementById("unitTest");
const switchChart = document.getElementById("switchChart");
const testStatusTable = document.getElementById("testStatus");
const searchInput = document.getElementById("searchInput");
const testDetailsTable = document.getElementById("testDetail");
let chart = null;
let chartType = "bar";
let data = null;
let dataChart = {
    labels: [
    "Passed",
    "Failed","Skipped"],
    
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
    const trxData = await fetch("/getRepos");
    const dataJson = await trxData.json();
    setUnitTest(dataJson)
    setData(dataJson);
    let piectx = document.getElementById("piechart");
    chart= new Chart(piectx, {
        type: chartType,
        data: dataChart,
        options: {
            title: {
                display: true,
                text: 'Test Cases Statistics'
            }
        }});
}

function setData(data){
   
    testStatusTable.innerHTML = `<tr class="dark">
    <th>Overall Repos</th>
    <td></td>
    </tr><tr >
    <th>Total</th>
    <td >${data.length}</td>
    </tr>`;

}





function setUnitTest(filteredData){
    //Setting all unit test result
    unitTestTable.innerHTML = filteredData.reduce((acc,val) =>{
       
            return acc+=`<tr>
            <td><div class="badge badge-primary mr-2 mb-2 p-2 large">${val.repoid}</div></td>
            <td>${val.reponame.replaceAll('"',"")}</td>
            <td><div class="mr-2">#${val.numlines}</div></td>
           <td>
           <div class="badge badge-danger mr-2 mb-2 p-2 large">${val.rate}</div></td>
           <td>
           <a href="./forks.html?name=${val.forks}"type="button" class="btn btn-d">Fork Information</a>
         </td>
        
         
                  </td>
            <td><a class="badge badge-primary mr-2 mb-2 p-2 large" href="${val.url.replaceAll('"',"")}"> Url</a></td>
            </tr>`;

    },"")
}



getTrxData();
