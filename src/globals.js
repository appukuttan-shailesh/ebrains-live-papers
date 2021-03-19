// NOTE: dummy data (in 'dev_data' directory) for DevMode is from v1 APIs; needs to be updated for v2 usage
export const baseUrl = "https://validation-v2.brainsimulation.eu";
export const mc_baseUrl = "https://model-catalog.brainsimulation.eu";
export const nar_baseUrl = "https://neural-activity-resource.brainsimulation.eu";
export const lp_tool_version = "0.2";
export const timeout = 1000;
export const querySizeLimit = 10;
// export const querySizeLimit = 1000000;
export const separator = "#-#";
export const filterModelsKeys = ["species", "brain_region", "cell_type", "model_scope", "abstraction_level"];
export const filterTracesKeys = ["species", "brain_region", "cell_type"];
