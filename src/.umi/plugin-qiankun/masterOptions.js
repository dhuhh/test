
      let options = {"masterHistoryType":"hash","base":"/","apps":[]};
      export const getMasterOptions = () => options;
      export const setMasterOptions = (newOpts) => options = ({ ...options, ...newOpts });
      