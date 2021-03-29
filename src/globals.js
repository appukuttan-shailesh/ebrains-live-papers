// NOTE: dummy data (in 'dev_data' directory) for DevMode is from v1 APIs; needs to be updated for v2 usage
export const baseUrl = "https://validation-v2.brainsimulation.eu";
export const mc_baseUrl = "https://model-catalog.brainsimulation.eu";
export const nar_baseUrl =
  "https://neural-activity-resource.brainsimulation.eu";
export const modelDB_baseUrl = "http://modeldb.science/api/v1";
export const modelDB_viewUrl = "https://senselab.med.yale.edu/modeldb";
export const osb_baseUrl = "https://www.opensourcebrain.org";
export const neuromorpho_baseUrl = "http://neuromorpho.org/api";
export const neuromorpho_viewUrl = "http://neuromorpho.org";
export const allenbrain_baseUrl =
  "https://celltypes.brain-map.org/api/v2/data/ApiCellTypesSpecimenDetail";
export const allenbrain_downloadUrl =
  "https://celltypes.brain-map.org/api/v2/well_known_file_download";
export const allenbrain_viewUrl =
  "https://celltypes.brain-map.org/experiment/electrophysiology";

export const lp_tool_version = "0.2";
export const timeout = 1000;
export const querySizeLimit = 10;
// export const querySizeLimit = 1000000;
export const separator = "#-#";

export const filterKGModelsKeys = [
  "species",
  "brain_region",
  "cell_type",
  "model_scope",
  "abstraction_level",
];
export const filterKGTracesKeys = ["species", "brain_region", "cell_type"];
export const filterModelDBKeys = [
  "regions",
  "celltypes",
  "modeltypes",
  "modelconcepts",
  "simenvironments",
];
export const filterNeuroMorphoKeys = [
  "species",
  "brain_region_1",
  "cell_type_1",
  "reconstruction_software",
  "protocol",
];
// To access ModelDB APIs; doesn't work with localhost during development
export const corsProxy = "https://cors-clear.herokuapp.com/";
// previously used https://cors-anywhere.herokuapp.com/ - but now has request limits
// other options: https://cors-fixer.herokuapp.com/, https://cors-handler.herokuapp.com/
