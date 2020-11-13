import { useSelector } from 'react-redux';
import { getResources } from '../reducer';
import { useResourceContext } from './useResourceContext';
/**
 * Hook which returns the definition of the requested resource
 */
export var useResourceDefinition = function (props) {
    var resource = useResourceContext(props);
    var resources = useSelector(getResources);
    return resources.find(function (r) { return (r === null || r === void 0 ? void 0 : r.name) === resource; }) || props;
};
