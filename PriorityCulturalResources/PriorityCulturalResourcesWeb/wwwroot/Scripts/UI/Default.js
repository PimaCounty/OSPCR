/*
 START all functions (like click-handlers) that need to occur at page load here
*/

$(document).ready(() => {
    setHelloWorldText();

    createKendoGrid();
});

/*
 END all functions (like click-handlers) that need to occur at page load here
*/

/*
 START all load-independent functions
*/

async function setHelloWorldText(){
    const name = "World";

    try {
        const settingsSetHelloWorldTextAsyncGet = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        const responseSetHelloWorldTextAsyncGet = await fetch(`/api/Default/GetHelloWorld?name=${name}`, settingsSetHelloWorldTextAsyncGet);
        let results;

        // invalid response
        if (!responseSetHelloWorldTextAsyncGet.ok) {
            console.log("Error occurred");

            return;
        }

        results = await responseSetHelloWorldTextAsyncGet.json();

        if (results.length > 0) {
            $("#helloworld").text(results);
        }
    }
    catch (err) {
        console.log(err);
    }
}

function createKendoGrid() {

    $("#kendogrid").kendoGrid({
        dataSource: [
                { technology: "Kendo UI", resource: "http://docs.telerik.com/kendo-ui/api/javascript/class" },
                { technology: "Bootstrap", resource: "https://www.w3schools.com/bootstrap/" },
                { technology: "Entity Framework Core", resource: "https://docs.microsoft.com/en-us/ef/" },
                { technology: "Serilog", resource: "https://serilog.net/" },
                { technology: "Git", resource: "https://git-scm.com/about" },
                { technology: "", resource: "" }
        ],
        columns: [
            {
                field: "technology",
                title: "Technology"
            },
            {
                field: "resource",
                title: "Resource"
            }
        ]
    });
}

/*
 END all load-independent functions
*/
