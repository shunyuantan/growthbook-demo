let listeners: any[] = [];

export const pubSubExperimentStore = {
  experimentId: '',
  variantId: '',
  setIds(experimentId: string, variantId: string) {
    this.experimentId = experimentId;
    this.variantId = variantId;

    listeners.forEach((callbackFn) => callbackFn());
  },
  listen(callbackFn: () => void) {
    listeners.push(callbackFn);
    return () => {
      listeners = listeners.filter((c) => c !== callbackFn);
    };
  },
};
