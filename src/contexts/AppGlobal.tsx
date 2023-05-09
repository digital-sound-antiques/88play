// let initialized = false;

const AppGlobal = {
  // initialize: async () => {
  //   if (!initialized) {
  //     initialized = true;
  //   }
  // },
  url: new URL(window.location.href),
  getQueryParams: () => {
    const url = new URL(window.location.href);
    return url.searchParams;
  },
  removeQueryParam: (name: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.replaceState('', '', url);
  },
};

export default AppGlobal;
