// NOTE: dummy data (in 'dev_data' directory) for DevMode is from v1 APIs; needs to be updated for v2 usage
export const baseUrl = "https://validation-v2.brainsimulation.eu";
// export const querySizeLimit = 10;
export const querySizeLimit = 1000000;

// To access ModelDB APIs; doesn't work with localhost during development
export const corsProxy = "https://corsproxy-sa.herokuapp.com/";
// previously used https://cors-anywhere.herokuapp.com/ - but now has request limits
// other options: https://cors-clear.herokuapp.com/, https://cors-fixer.herokuapp.com/, https://cors-handler.herokuapp.com/

export const isParent = window.opener == null;
export const isIframe = window !== window.parent;
export const isFramedApp = isIframe && isParent;
export const collaboratoryOrigin = "https://wiki.ebrains.eu";
export const hashChangedTopic = "/clb/community-app/hashchange";
export const updateHash = (value) => {
  window.location.hash = value;
  if (isFramedApp) {
    window.parent.postMessage(
      {
        topic: hashChangedTopic,
        data: value,
      },
      collaboratoryOrigin
    );
  }
};
