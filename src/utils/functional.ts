export function once(fn: Function | void) {
  return function (this: any) {
    if (typeof fn === "function") {
      const context = this;
      const args = arguments;
      fn.apply(context, args);
      fn = undefined;
    }
  };
}
