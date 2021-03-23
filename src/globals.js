// NOTE: dummy data (in 'dev_data' directory) for DevMode is from v1 APIs; needs to be updated for v2 usage
export const baseUrl = "https://validation-v2.brainsimulation.eu";
export const mc_baseUrl = "https://model-catalog.brainsimulation.eu";
export const nar_baseUrl =
  "https://neural-activity-resource.brainsimulation.eu";
export const modelDB_baseUrl = "http://modeldb.science/api/v1";
export const modelDB_viewUrl = "https://senselab.med.yale.edu/modeldb";
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
export const labelsModelDBKeys = {
  regions: "Brain Region",
  celltypes: "Cell Type",
  modeltypes: "Model Type",
  modelconcepts: "Model Concept",
  simenvironments: "Simulator",
  implemented_by: "Implemented By",
  currents: "Currents",
  gap_junctions: "Gap Junctions",
  receptors: "Receptors",
  gene: "Gene",
  neurotransmitters: "Neurotransmitters",
  model_paper: "Model Paper",
  notes: "Notes",
  public_submitter_email: "Email",
  ver_date: "Date",
};
export const filterAttributeMappingModelDB = {
  regions: "region",
  celltypes: "neurons",
  modeltypes: "model_type",
  modelconcepts: "model_concept",
  simenvironments: "modeling_application",
  implemented_by: "implemented_by",
  currents: "currents",
  gap_junctions: "gap_junctions",
  receptors: "receptors",
  gene: "gene",
  neurotransmitters: "neurotransmitters",
  model_paper: "model_paper",
  notes: "notes",
  public_submitter_email: "public_submitter_email",
  ver_date: "ver_date",
};

// To access ModelDB APIs; doesn't work with localhost during development
export const corsProxy = "https://cors-clear.herokuapp.com/";
// previously used https://cors-anywhere.herokuapp.com/ - but now has request limits
// other options: https://cors-fixer.herokuapp.com/, https://cors-handler.herokuapp.com/
