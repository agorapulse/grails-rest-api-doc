import org.springframework.http.MediaType

grails {
    plugins{
        restapidoc {

            docVersion = "0.1.1"

            basePath = "" //"http://localhost:8080/RestApiDoc" //app.name

            outputFileGeneration = "web-app/WEB-INF/restapidoc.json"
            outputFileReading = "/WEB-INF/restapidoc.json"
            customClassName = null  //"org.restapidoc.CustomResponseDoc"

            defaultFormat = "json"

            defaultResponseType = MediaType.APPLICATION_JSON_VALUE
            controllerPrefix = ""
            controllerSuffix = "Controller"

            defaultFormatString = "{format}"

            defaultObjectFields = [ ]

            defaultErrorAll = []

            defaultErrorGet = []

            defaultErrorPost = []

            defaultErrorPut = []

            defaultErrorDelete = [:]


            verbPerMethodPrefix = [
                    "show" : "GET",
                    "list" : "GET",
                    "save" : "POST",
                    "add" : "POST",
                    "update" : "PUT",
                    "edit" : "PUT",
                    "delete" : "DELETE",
                    "remove" : "DELETE",
                    "partial" : "PATCH",
                    "patch" : "PATCH"
            ]

            pathPerMethodPrefix =[
                    "show" : "show/{id}",
                    "list" : "list",
                    "add" : "add",
                    "save" : "save",
                    "update" : "update/{id}",
                    "edit" : "edit/{id}",
                    "delete" : "delete/{id}",
                    "remove" : "delete/{id}",
            ]

            grailsDomainDefaultType = null //= null will appear 'domain' type


            defaultParamsQueryAll = []
            defaultParamsQuerySingle = []
            defaultParamsQueryMultiple = [
                    //                [name:"max",description:"Pagination: Number of record per page (default 0 = no pagination)",type:"int"],
                    //                [name:"offset",description:"Pagination: Offset of first record (default 0 = first record)",type:"int"]
            ]

            defaultHeaders = []

            packageToScan = null

            layout = "restapidoc"
        }
    }
}
