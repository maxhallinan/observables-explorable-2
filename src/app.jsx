import xs from 'xstream'

const toView = (state) => {
  return (
    <div className="oe2">
      <svg className="oe2-timeline oe2-timeline-target">
      </svg>
      <div className="oe2-controls">
        <fieldset>
          <label>Time Travel</label>
          <input 
            className="oe2-range-input"
            max="1"
            min="0" 
            step="0.01"
            type="range" 
            value={state.currentRange}
          />
        </fieldset>
        <div className="oe2-controls-zoom">
          <button>Zoom Out</button>
          <button>Zoom In</button>
        </div>
      </div>
    </div>
  );
}

const toState = ([ currentRange, ]) => ({
  currentRange,
});

const compose = (...fs) => (...args) => {
  const [ f1, ...fTail ] = [ ...fs ].reverse();

  return fTail.reduce((arg, fn) => fn(arg), f1(...args))
};

const prop = (key) => (source) => source[key];

const toClientY = (event) => {
  const domRect = event.target.getBoundingClientRect();
  return event.clientY - domRect.top;
};

const toTimeIndexed = (x) => [ Date.now(), x ];

const toTimeline = (timeline, timeIndexed)  => [ ...timeline, timeIndexed ];

const toTimeIndexedClientY = compose(toTimeIndexed, toClientY);

export function App (sources) {
  const currentRange$ = sources.DOM.select('.oe2-range-input')
    .events('input')
    .map((event) => Number(event.target.value))
    .startWith(1);

  const timelineTarget$ = sources.DOM.select('.oe2-timeline-target');

  const mouseClientYTimeline$ = timelineTarget$
    .events('mousemove')
    .map(toTimeIndexedClientY)
    .fold(toTimeline, [])
    .startWith([]);

  const clickClientYTimeline$ = timelineTarget$
    .events('click')
    .map(toTimeIndexedClientY)
    .fold(toTimeline, [])
    .startWith([]);

  mouseClientYTimeline$.addListener({
    next: (e) => {console.log('MOVE', e);},
  });

  clickClientYTimeline$.addListener({
    next: (e) => { console.log('CLICK', e)}
  });

  const stateSource$ = xs.combine(currentRange$);

  const state$ = stateSource$.map(toState);

  const vtree$ = state$.map(toView);

  const sinks = {
    DOM: vtree$
  }

  return sinks
}
