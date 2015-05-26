package org.restapidoc.pojo

import org.jsondoc.core.pojo.ApiHeaderDoc
import org.restapidoc.annotation.RestApiHeader
import org.restapidoc.annotation.RestApiHeaders

class RestApiHeaderDoc extends ApiHeaderDoc {

    public static RestApiHeaderDoc buildFromAnnotation(RestApiHeader annotation) {
        return new RestApiHeaderDoc(annotation.name(), annotation.description())
    }

    public static List<RestApiHeaderDoc> buildFromAnnotation(RestApiHeaders annotation) {
        List<RestApiHeaderDoc> docs = new ArrayList<RestApiHeaderDoc>();
        int index = 0
        for (RestApiHeader apiParam : annotation.headers()) {
            RestApiHeaderDoc headerDoc = buildFromAnnotation(apiParam)
            docs.add(headerDoc)
            index++
        }
        docs
    }

    public RestApiHeaderDoc(String name, String description) {
        super(name, description)
    }

}
