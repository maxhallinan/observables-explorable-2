export const compose = (...fs) => (...args) => {
  const [ f1, ...fTail ] = [ ...fs ].reverse();

  return fTail.reduce((arg, fn) => fn(arg), f1(...args));
};

export const prop = (key) => (source) => source[key];

export const REM_BASE = 16;

export const remToPx = (rem) => rem * REM_BASE;
