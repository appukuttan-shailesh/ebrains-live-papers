import { ResourceContextValue } from './ResourceContext';
/**
 * Hook to read the resource from the ResourceContext.
 *
 * Must be used within a <ResourceContextProvider> (e.g. as a descendent of <Resource>
 * or any reference related components).
 *
 * @returns {ResourceContextValue} The resource
 */
export declare const useResourceContext: <ResourceInformationsType extends Partial<{
    resource: string;
}>>(props: ResourceInformationsType) => ResourceContextValue;
