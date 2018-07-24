import xs from 'xstream'

const toView = (state) => {
  return (
    <div>
      <svg></svg>
      <input 
        className=".oe2-range-input"
        max="1"
        min="0" 
        step="0.01"
        type="range" 
        value={state.currentRange}
      />
    </div>
  );
}

const toState = ([ currentRange, ]) => ({
  currentRange,
});

export function App (sources) {
  const currentRange$ = sources.DOM.select('.oe2-range-input')
    .events('input')
    .map((event) => Number(event.target.value))
    .startWith(1);

  const stateSource$ = xs.combine(currentRange$);

  const state$ = stateSource$.map(toState);

  const vtree$ = state$.map(toView);

  const sinks = {
    DOM: vtree$
  }

  return sinks
}
