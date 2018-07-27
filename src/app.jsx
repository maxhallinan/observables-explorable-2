import xs from 'xstream'

import * as styles from './styles';
import { compose, prop, } from './util';

const View = (state) => {
  return (
    <div className={`${styles.explorable}`}>
      <svg className={`${styles.frame} js-mousearea`}></svg>
    </div>
  );
}

const toState = ([ timelines, ]) => ({
  timelines,
});

const toClientY = (event) => {
  const domRect = event.target.getBoundingClientRect();

  return event.clientY - domRect.top;
};

const toTimeIndexed = (x) => [ Date.now(), x ];

const toTimeline = (timeline, timeIndexed)  => [ ...timeline, timeIndexed ];

const toTimelineTable = ([ clientY ]) => ({
  clientY,
});

export function App (sources) {
  const mouseArea = sources.DOM.select('.js-mousearea');

  const clientY$ = mouseArea.events('mousemove')
    .map(toClientY);

  const clientYTimeline$ = clientY$
    .map(toTimeIndexed)
    .fold(toTimeline, [])
    .startWith([]);

  const timeline$ = xs.combine(clientYTimeline$).map(toTimelineTable);

  const stateSource$ = xs.combine(timeline$);

  const state$ = stateSource$.map(toState);

  const vtree$ = state$.map(View);

  const sinks = {
    DOM: vtree$
  }

  return sinks
}
