package org.restapidoc

class RestApiDocController {

    def grailsApplication
    def grailsLinkGenerator

    def index() {
        def layout = grailsApplication.mergedConfig.grails.plugins.restapidoc.layout
        if (!params.doc_url) {
            params.doc_url =  grailsLinkGenerator.link(controller: 'restApiDoc', action: 'json', absolute: true)
        }
        [layout: layout]
    }

    def json() {
        def input
        try {
            input = servletContext.getResourceAsStream(grailsApplication.mergedConfig.grails.plugins.restapidoc.outputFileReading)
            render(input?.text ?: '')
        }
        finally {
            input?.close()
        }

    }
}
