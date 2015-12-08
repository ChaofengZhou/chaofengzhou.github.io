var fields = ["1st Max Value", "2nd Max Value", "Arithmetic Mean", "City Name", "Year", "1st Max DateTime", "County Name"];
function get_data_max_min(field, callback) {
    var file = "data/data.csv";
    open_file(file, function (file) {
        processMaxMinData(file, field, callback);
    });
}
function processMaxMinData(file, field, callback){
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            var max = -1, min = 100;
            results.data.filter(function(doctor) {
                return doctor["Parameter Name"] === field;
            }).forEach(function(obj) {
                max = Math.max(max, obj["Arithmetic Mean"]);
                min = Math.min(min, obj["Arithmetic Mean"]);
            });
            callback(max, min);
        }
    });
}
function get_data(county_name, year, field, callback) {
    var file = "data/Annual_All_Utah_Air_Quality_"+year+".csv";
    open_file(file, function (file) {
        processData(file, county_name, year, field, callback);
    });
}

function open_file(name, callback) {
    $.ajax({
        type: "GET",
        url: name,
        dataType: "text",
        success: callback
    });
}
function processData(file, county_name, year, field, callback) {
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            results.data = results.data.filter(function(doctor) {
                //return doctor["County Code"] === 3 && doctor["Year"] === year && doctor["Parameter Name"] == field;
                return doctor["County Name"] != null && doctor["County Name"] != "" && (doctor["County Name"].indexOf(county_name) != -1 || county_name.indexOf(doctor["County Name"]) != -1) && doctor["Parameter Name"] === field;
                //return (doctor["City Name"].indexOf("Davis") != -1) && doctor["Parameter Name"] == field;
            }).map(function(obj) {
                var newObj = {};
                for (var key in fields) {
                    newObj[fields[key]] = obj[fields[key]];
                }
                return newObj;
            });
            console.log(results);
            callback(results);
        }
    });
}