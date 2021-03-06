/*
 * Grid Stack
 */
var options = {
    cellHeight: 80,
    verticalMargin: 20,
    resizable: {
        handles: 'e, se, s, sw, w'
    },
    float: true
};
$('.grid-stack').gridstack(options);
var grid = $('.grid-stack').data('gridstack');



/*
 * Event Listen
 */
$("#saveButton").on("click", save);
$("#loadButton").on("click", load);

$('#addDataButton').on("click", createData);
$("#saveDataButton").on("click", saveData);
$("#deleteDataButton").on("click", deleteData);

$("#type").on("change", function () {
    showForm(this.value);
});



/*
 * save
 */
function save(event) {
    var object = new Array;
    $(".grid-stack-items").each(function () {
        var data = new Object;
        data.gs_x = $(this).attr("data-gs-x");
        data.gs_y = $(this).attr("data-gs-y");
        data.gs_width = $(this).attr("data-gs-width");
        data.gs_height = $(this).attr("data-gs-height");
        data.gs_type = $(this).attr("data-gs-type");
        data.gs_title = $(this).attr("data-gs-title");

        switch (data.gs_type) {
            case "text":
                data.text_size = $(this).attr("data-text-size");
                data.text_color = $(this).attr("data-text-color");
                data.text_content = $(this).attr("data-text-content");
                break;
            case "image":
                data.image_url = $(this).attr("data-image-url");
                break;
            case "chart":
                data.chart_data = $(this).attr("data-chart-data");
                break;
            default:
                break;
        }

        object.push(data);
    });

    var file = document.createElement('a');
    file.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object)));
    file.setAttribute('download', "Freeboard Data");
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        file.dispatchEvent(event);
    } else {
        file.click();
    }
}



/*
 * Create Object
 */
function load() {
    $("#json").on("change", function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            var object = JSON.parse(reader.result);
            grid.removeAll();
            grid.batchUpdate();
            object.forEach(function (data) {
                createData(null, data);
            });
            grid.commit();

        }
        reader.readAsText(file);
    });
    $("#json").click();
}



/*
 * Create Object
 */
var index = 0;

function createData(event = null, data = null) {
    console.log(data);
    var id = "item" + index;

    // PARENT DIV    
    var grid_item = document.createElement("div");
    $(grid_item)
        .attr("class", "grid-stack-items")
        .attr("id", id)

    // WRAPPER DIV
    var grid_content = document.createElement("div");
    $(grid_content)
        .attr("class", "grid-stack-item-content")


    // HEADER DIV
    var grid_header = document.createElement("div");
    $(grid_header)
        .attr("class", "grid-stack-item-header")

    // TITLE
    var grid_header_title = document.createElement("div");
    $(grid_header_title)
        .attr("class", "grid-stack-item-title")

    // HEADER ICON
    var grid_header_icon = document.createElement("i");
    $(grid_header_icon)
        .attr("class", "fas fa-cog grid-stack-item-set")
        .on("click", openModal)

    // BODY DIV
    var grid_body = document.createElement("div");
    $(grid_body)
        .attr("class", "grid-stack-item-body")

    // APPEND
    $(grid_header).append($(grid_header_title))
    $(grid_header).append($(grid_header_icon))
    $(grid_content).append($(grid_header))
    $(grid_content).append($(grid_body))
    $(grid_item).append($(grid_content))
    $('.grid-stack').append(grid_item);

    var object = null;
    object = {
        x: 0,
        y: 0,
        width: 4,
        height: 2
    }

    if (data != null) {
        object.x = data.gs_x;
        object.y = data.gs_y;
        object.width = data.gs_width;
        object.height = data.gs_height;

        $("#" + id).attr("data-gs-title", data.gs_title);
        $("#" + id).attr("data-gs-type", data.gs_type);

        switch (data.gs_type) {
            case "text":
                $("#" + id).attr("data-text-size", data.text_size);
                $("#" + id).attr("data-text-color", data.text_color);
                $("#" + id).attr("data-text-content", data.text_content);
                break;
            case "image":
                $("#" + id).attr("data-image-url", data.image_url);
                break;
            case "chart":
                $("#" + id).attr("data-chart-data", data.chart_data);
                break;
            default:
                break;
        }
    }

    if (data == null) {
        grid.addWidget($("#" + id), 0, 0, 4, 2, true, 2, 6, 2, 6, id);
    } else {
        grid.addWidget($("#" + id),
            object.x,
            object.y,
            object.width,
            object.height,
            false, 2, 6, 2, 6,
            id);
        showData($("#" + id));
    }

    index++;
}



/*
 * openModal
 */
function openModal(event) {
    // PARENT ELEMENT
    var parentElem = this.parentElement.parentElement.parentElement;

    // TITLE
    $("#title").val($(parentElem).attr("data-gs-title"));

    // WIDTH
    $("#width").val($(parentElem).attr("data-gs-width"))
        .attr("max", $(parentElem).attr("data-gs-max-width"))
        .attr("min", $(parentElem).attr("data-gs-min-width"))

    // HEIGHT
    $("#height").val($(parentElem).attr("data-gs-height"))
        .attr("max", $(parentElem).attr("data-gs-max-height"))
        .attr("min", $(parentElem).attr("data-gs-min-height"))

    // TYPE
    $("#type").val($(parentElem).attr("data-gs-type") == null ? "default" : $(parentElem).attr("data-gs-type"))

    // DATA FORM
    showForm($(parentElem).attr("data-gs-type"), parentElem.id);

    $('#modal').attr("data-gs-id", parentElem.id);

    $('#modal').modal();
}



/*
 * closeModal
 */
function closeModal(event) {
    // DEFAULT
    $("#title").val("");
    $("#width").val("");
    $("#height").val("");
    $("#type").val("default").prop("selected", true);

    // TEXT
    $("#text-content").val("");
    $("#text-color").val("");
    $("#text-size").val("");

    // IMAGE
    $("#image-url").val("");

    // CHART
    $("#chart-data").val("");

    // CLOSE
    $('#modal').attr("data-gs-id", "");
    $('#modal').modal('hide');
}



/*
 * showForm
 */
function showForm(data, id = null) {
    var parentElem = $("#" + (id == null ? $('#modal').attr("data-gs-id") : id));

    // DATA FORM
    switch (data) {
        case "text":
            $("#text-size").val(parentElem.attr("data-text-size"));
            $("#text-color").val(parentElem.attr("data-text-color"));
            $("#text-content").val(parentElem.attr("data-text-content"));
            break;
        case "image":
            $("#image-url").val(parentElem.attr("data-image-url"));
            break;
        case "chart":
            $("#chart-data").val(parentElem.attr("data-chart-data"));
            break;
        default:
            break;
    }

    var dataForm = $(".data-form");
    dataForm.each(function () {
        $(this).attr("style", "display: none");
    });

    var dataElem = $("#" + data + "Form");
    dataElem.attr("style", "display: block");
}



/*
 * saveData
 */
function saveData(event) {
    var elem = $("#" + $('#modal').attr("data-gs-id"));

    elem.attr("data-gs-title", $("#title").val());
    elem.attr("data-gs-width", $("#width").val());
    elem.attr("data-gs-height", $("#height").val());
    elem.attr("data-gs-type", $("#type").val());

    // DATA FORM
    switch (elem.attr("data-gs-type")) {
        case "text":
            elem.attr("data-text-size", $("#text-size").val());
            elem.attr("data-text-color", $("#text-color").val());
            elem.attr("data-text-content", $("#text-content").val());
            break;
        case "image":
            elem.attr("data-image-url", $("#image-url").val());
            break;
        case "chart":
            elem.attr("data-chart-data", $("#chart-data").val());
            break;
        default:
            break;
    }

    showData(elem);
    closeModal();
}



/*
 * deleteData
 */
function deleteData(event) {
    var elem = $("#" + $('#modal').attr("data-gs-id"));

    grid.removeWidget(elem);

    closeModal();
}



/*
 * showData
 */
function showData(elem) {
    elem.find("div.grid-stack-item-title").text(elem.attr("data-gs-title"));

    switch (elem.attr("data-gs-type")) {
        case "text":
            elem.find("div.grid-stack-item-body")
                .css({
                    "font-size": Number(elem.attr("data-text-size")),
                    "color": elem.attr("data-text-color"),
                    "white-space": "pre"
                })
                .text(elem.attr("data-text-content"));
            break;
        case "image":
            elem.find("div.grid-stack-item-body")
                .css({
                    "background-image": "url('" + elem.attr("data-image-url") + "')"
                });
            break;
        case "chart":
            var id = elem.attr("id");
            var data = elem.attr("data-chart-data");
            var object = JSON.parse(data);

            c3.generate({
                bindto: "#" + id + " " + "div.grid-stack-item-body",
                data: {
                    json: object.data,
                    keys: {
                        value: object.keys
                    }
                },
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 30,
                    right: 30
                }
            });
            break;
        default:
            break;
    }

}