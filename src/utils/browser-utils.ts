export const isIOS = (() => {
    const _ua = navigator.userAgent.toLowerCase();
    return (
      (_ua.indexOf("iphone") >= 0 && _ua.indexOf("like iphone") < 0) ||
      (_ua.indexOf("ipad") >= 0 && _ua.indexOf("like ipad") < 0) ||
      (_ua.indexOf("ipod") >= 0 && _ua.indexOf("like ipod") < 0) ||
      (_ua.indexOf("mac os x") >= 0 && navigator.maxTouchPoints > 0) // New iPads
    );
  })();