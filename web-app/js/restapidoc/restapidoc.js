var model;

function checkURLExistence() {
    var value = $("#jsondocfetch").val();
    if(value.trim() == '') {
        alert("Please insert a valid URL");
        return false;
    } else {
        return fetchdoc(value);
    }
}

function selectPostParametersMethodBody() {
    if ($("#bodyTypeSelect > input[name=inputMultipartFiles]").length > 0) {
        $("#bodyTypeSelect > input").replaceWith('<input id="inputJson" type="text" class="form-control" aria-label="POST body parameters">');
    }
}

function selectMultipartMethodBody() {
    if ($("#bodyTypeSelect > input[name=inputMultipartFiles]").length == 0) {
        $("#bodyTypeSelect > input").replaceWith('<input type="file" name="inputMultipartFiles" multiple="true" class="form-control">');
    }
}

$("#jsondocfetch").keypress(function(event) {
    if (event.which == 13) {
        checkURLExistence();
        return false;
    }
});

$("#getDocButton").click(function() {
    checkURLExistence();
    return false;
});

function printResponse(data, res, url) {
    if(res.responseXML != null) {
        $("#response").text(formatXML(res.responseText));
    } else {
        $("#response").text(JSON.stringify(data, undefined, 2));
    }

    prettyPrint();
    $("#responseStatus").text(res.status);
    $("#responseHeaders").text(res.getAllResponseHeaders());
    $("#requestURL").text(url);
    $('#testButton').text('reset');
    $("#resInfo").show();
}

function formatXML(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

function fetchdoc(jsondocurl) {
    $.ajax({
        url : jsondocurl,
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success : function(data) {
            model = data;
            var main = Handlebars.templates['main'];
            var mainHTML = main(data);
            $("#maindiv").html(mainHTML);
            $("#maindiv").show();

            var apis = Handlebars.templates['apis'];
            var apisHTML = apis(data);
            $("#apidiv").html(apisHTML);
            $("#apidiv").show();

            $("#apidiv ul li a").each(function() {
                $(this).click(function() {
                    var api = jlinq.from(data.apis).equals("jsondocId", this.id).first();
                    var methods = Handlebars.templates['methods'];
                    var methodsHTML = methods(api);
                    $("#content").html(methodsHTML);
                    $("#content").show();
                    $("#apiName").text(api.name);
                    $("#apiDescription").text(api.description);
                    $("#testContent").hide();

                    $('#content a').each(function() {
                        $(this).click(function() {
                            var method = jlinq.from(api.methods).equals("jsondocId", this.id).first();
                            var test = Handlebars.templates['test'];
                            var testHTML = test(method);
                            $("#testContent").html(testHTML);
                            $("#testContent").show();

                            $("#produces input:first").attr("checked", "checked");
                            $("#consumes input:first").attr("checked", "checked");

                            $("#testButton").click(function() {
                                var headers = new Object();
                                $("#headers input").each(function() {
                                    headers[this.name] = $(this).val();
                                });

                                headers["Accept"] = $("#produces input:checked").val();

                                var replacedPath = method.path;
                                var tempReplacedPath = replacedPath; // this is to handle more than one parameter on the url
                                $("#pathparameters input").each(function() {
                                    tempReplacedPath = replacedPath.replace("{"+this.name+"}", $(this).val());
                                    replacedPath = tempReplacedPath;
                                });

                                replacedPath = replacedPath + "?";
                                $("#queryparameters input").each(function() {
                                    if($(this).val() != null && $(this).val().toString().trim() != ""){
                                        replacedPath = replacedPath + "&" + this.name + "=" + $(this).val();
                                    }
                                });

                                $('#testButton').text('loading');

                                var requestData;
                                var cType;
                                var isProcessData;
                                var filesInput = $("#bodyTypeSelect > input[name=inputMultipartFiles]");
                                if (filesInput.length > 0) {
                                    cType = false;
                                    isProcessData = false;
                                    requestData = new FormData();
                                    var files = $("#bodyTypeSelect > input[name=inputMultipartFiles]")[0].files;

                                    for(var i = 0; i < files.length; i++) {
                                        requestData.append('file', files[i]);
                                    }
                                } else {
                                    cType = $("#consumes input:checked").val();
                                    isProcessData = true;
                                    requestData = $("#inputJson").val();
                                }

                                var res = $.ajax({
                                    url : model.basePath + replacedPath,
                                    type: method.verb,
                                    data: requestData,
                                    headers: headers,
                                    processData: isProcessData,
                                    contentType: cType,
                                    success : function(data) {
                                        printResponse(data, res, this.url);

                                    },
                                    error: function(data) {
                                        printResponse(data, res, this.url);
                                    }
                                });

                            });

                        });
                    });
                });
            });
            var allLink = $("#apidiv").find("ul.list-group").find("a");
            var firstLink = allLink[0];
            firstLink.click();
            var objects = Handlebars.templates['objects'];
            var objectsHTML = objects(data);
            $("#objectdiv").html(objectsHTML);
            $("#objectdiv").show();

            $("#objectdiv a").each(function() {
                $(this).click(function() {
                    var o = jlinq.from(data.objects).equals("jsondocId", this.id).first();
                    var object = Handlebars.templates['object'];
                    var objectHTML = object(o);
                    $("#content").html(objectHTML);
                    $("#content").show();

                    $("#testContent").hide();
                });
            });

        },
        error: function(msg) {
            alert("Error " + msg);
        }
    });
}

$(document).ready(function() {
    var parseQueryString = function() {
        var vars = [], hash;
        var q = document.URL.split('?')[1];
        if(q != undefined){
            q = q.split('&');
            for(var i = 0; i < q.length; i++){
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }
        return vars;
    }

    var parameters = parseQueryString();
    if (parameters['doc_url']) {
        $('#jsondocfetch').attr('value', parameters['doc_url']);
        $('#getDocButton').click();
    }

    $(document).on("click", "#selectStringParameters", function(event) {
        event.preventDefault();
        selectPostParametersMethodBody();
    });

    $(document).on("click", "#selectMultipart", function(event) {
        event.preventDefault();
        selectMultipartMethodBody();
    });
});
