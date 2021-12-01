// global variables
let addUsersTopVal;
let addUsersLeftVal;

/*
 START all functions (like click-handlers) that need to occur at page load here
*/
$(document).ready(() => {
    $("#adminicon").addClass('highlighted');
    createAdminTabStrip();
    createSecurityGrid();
    createAddUserDialog();

    // set default values
    addUsersTopVal = "";
    addUsersLeftVal = "";
});

/*
 END all functions (like click-handlers) that need to occur at page load here
*/

/*
 START all load-independent functions
*/

function createAddUserDialog() {

    $("#addUserDialog").kendoWindow({
        draggable: false,
        height: "350px",
        modal: true,
        pinned: false,
        position: {
            top: 100,
            left: 100
        },
        resizable: false,
        title: "Add User",
        width: "500px",
        visible: false,
        open: initializeAddUserWindow
    });

    function initializeAddUserWindow() {
        $("#userRole").data("kendoDropDownList").select(0);

        // no need to keep creating masked textboxes
        // when one already exists
        if ($("#adQueryField").data("kendoMaskedTextBox") === undefined) {
            $("#adQueryField").kendoMaskedTextBox({
                mask: "u000000"
            });
        }
    }

    $("#userRole").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: "Read Only", value: "Read" },
            { text: "Read/Write", value: "Write" },
            { text: "Admin", value: "Admin" }
        ],
        optionlabel: "None"
    });

    // Default new user to read role
    $("#userRole").data("kendoDropDownList").select(0);

    $('#addFailureNotification').kendoNotification();

    $('#confirmAddUser').kendoButton({
        click: (e) => {
            const unumber = $("#adQueryField").data("kendoMaskedTextBox").value();
            const searchActiveDirectoryUrl = `${$("#addUserDialog").data("searchActiveDirectoryUrl")}?UserName=${unumber}`;

            // call async function
            SearchForUserGetAddUserAsync(searchActiveDirectoryUrl);
        }
    });

    $('#cancelAddUser').kendoButton({
        click: (e) => {
            $("#addUserDialog").data("kendoWindow").close();
        }
    });

}

async function SearchForUserGetAddUserAsync(searchURL) {
    const addSecurityUserUrl = $("#addUserDialog").data("addSecurityUserUrl");

    try {
        const settingsSearchForUserAsyncGet = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        const responseSearchForUserAsyncGet = await fetch(searchURL, settingsSearchForUserAsyncGet);
        const securityGridData = $("#securityGrid").data().kendoGrid.dataSource.view();
        const NO_CONTENT_STATUS = 204; // 204 No Content
        let currentUserDataItem = null;

        // invalid response
        if (!responseSearchForUserAsyncGet.ok) {
            console.log("Error occurred");

            return;
        }

        // the api called returned data so now try and parse the JSON object
        if (responseSearchForUserAsyncGet.status != NO_CONTENT_STATUS) {
            currentUserDataItem = await responseSearchForUserAsyncGet.json().catch(error => {
                // no user found
                currentUserDataItem = null;
            });
        }

        // user doesn't exist
        if (!currentUserDataItem) {
             let addFailureNotification = $("#addFailureNotification").kendoNotification().data("kendoNotification");

            addFailureNotification.warning("This user does not exist.");

            return;
        }

        let foundMatch = securityGridData.some((user) => {
            return user.UserName === currentUserDataItem.UserName;
        });

        // user already added
        if (foundMatch) {
             let addFailureNotification = $("#addFailureNotification").kendoNotification().data("kendoNotification");

            addFailureNotification.warning("This user already exists. Unable to add to the system.");

            return;
        }

        let data = {
            UserName: currentUserDataItem.UserName,
            RoleName: $("#userRole").data("kendoDropDownList").value(),
            Email: currentUserDataItem.UserEmail,
            DisplayName: currentUserDataItem.DisplayName
        };
        const settingsAddUserAsyncPost = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const responseAddUserAsyncPost = await fetch(addSecurityUserUrl, settingsAddUserAsyncPost);

        // invalid response
        if (!responseAddUserAsyncPost.ok) {
            $("#kendoErrorNotification").getKendoNotification().show({ message: "Error occurred" }, "error");

            return;
        }

        // clear out once added
        $("#adQueryField").data("kendoMaskedTextBox").value("");
        $("#addUserDialog").data("kendoWindow").close();
        $("#securityGrid").data("kendoGrid").dataSource.read();
    }
    catch (err) {
        console.log(err);
    }
}

function openAddUserDialog() {
    $("#addUserDialog").data("kendoWindow").center().open();

    if (addUsersTopVal == "") {
        addUsersTopVal = $(".k-display-inline-flex").css("top");
    }

    if (addUsersLeftVal == "") {
        addUsersLeftVal = $(".k-display-inline-flex").css("left");
    }

    // center kendo window by stored values, for whatever reason not centered
    if (addUsersTopVal != "" && addUsersLeftVal != "") {
        $(".k-display-inline-flex").css({ "top": addUsersTopVal, "left": addUsersLeftVal });
    }
}

function createAdminTabStrip() {
    $("#adminTabStrip").kendoTabStrip({
        scrollable: false,
        value: "Users"
    });
}

function createSecurityGrid() {
    const getSecurityUsersUrl = $("#securityGrid").data("getSecurityUsersUrl");
    const updateSecurityUserUrl = $("#securityGrid").data("updateSecurityUserUrl");
    const deleteSecurityUserUrl = $("#securityGrid").data("deleteSecurityUserUrl");

    let securityDataSource = new kendo.data.DataSource({
        transport: {
            read: {
                type: "GET",
                dataType: "json",
                url: getSecurityUsersUrl,
                cache: false
            },
            update: {
                type: "POST",
                dataType: "json",
                data: "",
                url: updateSecurityUserUrl,
                cache: false
            },
            destroy: {
                type: "POST",
                dataType: "json",
                data: "",
                url: deleteSecurityUserUrl,
                cache: false
            }
        },
        schema: {
            model: {
                id: "UserName",
                fields: {
                    UserName: { type: "string", editable: false },
                    DisplayName: { type: "string", editable: false },
                    RoleName: { type: "string", editable: true }
                }
            }
        },
        pageSize: 10,
        requestEnd: (e) => {
            if (e.type == "update") {
                location.reload();
            }
        }
    });

    $("#securityGrid").kendoGrid({
        columns: [
            {
                field: "DisplayName",
                title: "Name",
                editable: false,
                filterable: {
                    multi: true,
                    search: true
                }
            },
            {
                field: "UserName",
                title: "User ID",
                editable: false,
                filterable: {
                    multi: true,
                    search: true
                }
            },
            {
                field: "RoleName",
                title: "Role",
                editor: roleDropDownEditor,
                template: (e) => {
                    if (e.RoleName === "Read") {
                        return "Read Only";
                    }
                    if (e.RoleName === "Write") {
                        return "Read/Write";
                    }
                    if (e.RoleName === "Admin") {
                        return "Admin";
                    }
                },
                filterable: {
                    multi: true,
                    search: true
                }
            },
            {
                command: [
                    {
                        name: "edit"
                    },
                    {
                        name: "Delete",
                        click: (e) => {  //add a click event listener on the delete button
                            e.preventDefault(); //prevent page scroll reset
                            let tr = $(e.target).closest("tr"); //get the row for deletion
                            let data = $("#securityGrid").data("kendoGrid").dataItem(tr); //get the row data so it can be referred later

                            if (data.id == userName) {
                                kendo.alert(`User ${userName} cannot delete user ${data.id}. Please contact an alternate administrator to delete this user.`);
                            } else {
                                kendo.confirm(`Are you sure that you want to delete user ${data.UserName}?`).then(() => {
                                    securityDataSource.remove(data);
                                    securityDataSource.sync();
                                });
                            }
                        }
                    }
                ],
                title: "&nbsp",
                width: "200px"
            }
        ],
        dataSource: securityDataSource,
        editable: "inline",
        mobile: true,
        sortable: true,
        filterable: {
            messages: {
                search: "Search"
            }
        },
        pageable: {
            pageSizes: true
        },
        toolbar: [
            { template: '<a class="k-button" href="javascript:void(0);" onclick="openAddUserDialog()">Add User</a>' },
            { name: "excel" }
        ],
        excel: {
            allPages: true,
            fileName: "UserRoles.xlsx"
        }
    });
}


function roleDropDownEditor(container, options) {
    $(`<input required name="${options.field}"/>`).appendTo(container).kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: "Read Only", value: "Read" },
            { text: "Read/Write", value: "Write" },
            { text: "Admin", value: "Admin" }
        ]
    });
}

/*
 END all load-independent functions
*/
