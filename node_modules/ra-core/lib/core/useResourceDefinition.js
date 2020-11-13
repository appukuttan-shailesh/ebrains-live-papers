"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResourceDefinition = void 0;
var react_redux_1 = require("react-redux");
var reducer_1 = require("../reducer");
var useResourceContext_1 = require("./useResourceContext");
/**
 * Hook which returns the definition of the requested resource
 */
exports.useResourceDefinition = function (props) {
    var resource = useResourceContext_1.useResourceContext(props);
    var resources = react_redux_1.useSelector(reducer_1.getResources);
    return resources.find(function (r) { return (r === null || r === void 0 ? void 0 : r.name) === resource; }) || props;
};
