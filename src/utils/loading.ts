let loadingIntervalObj: NodeJS.Timer | undefined = undefined;

export const showLoading = function () {
  const P = ["\\", "|", "/", "-"];
  let x = 0;
  loadingIntervalObj = setInterval(function () {
    process.stdout.write("\r" + P[x++]);
    x &= 3;
  }, 150);
};

export const hideLoading = () => {
  loadingIntervalObj && clearInterval(loadingIntervalObj);
};
