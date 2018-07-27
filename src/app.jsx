import xs from 'xstream'

import * as styles from './styles';
import { compose, prop, } from './util';

const View = (state) => {
  return (
    <div className={`${styles.explorable}`}>
      <svg className={`${styles.frame} js-mousearea`}></svg>
      <div className={styles.controls}>
        <fieldset className={styles.controlSet}>
          <label 
            className={styles.controlLabel} 
            htmlFor="timerange"
          >
              Time Range
          </label>
          <input 
            className={`js-timerange`}
            id="timerange" 
            max="1"
            min="0"
            step="0.01"
            type="range" 
            value={state.timeRange}
          />
        </fieldset>
      </div>
    </div>
  );
}

const toState = ([ timelines, timeRange, ]) => ({
  timelines,
  timeRange,
});

const toClientY = (event) => {
  const domRect = event.target.getBoundingClientRect();

  return event.clientY - domRect.top;
};

const toTimeIndexed = (x) => [ Date.now(), x ];

const toTimeline = (timeline, timeIndexed)  => [ ...timeline, timeIndexed ];

const toTimelineTable = ([ moveY, clickY, ]) => ({ moveY, clickY, });

const getEventValue = compose(prop('value'), prop('target'));

export function App (sources) {
  const mouseArea = sources.DOM.select('.js-mousearea');

  const moveY$ = mouseArea.events('mousemove')
    .map(toClientY);

  const moveYTimeline$ = moveY$
    .map(toTimeIndexed)
    .fold(toTimeline, [])
    .startWith([]);

  const clickY = mouseArea.events('click')
    .map(toClientY);

  const clickYTimeline$ = clickY
    .map(toTimeIndexed)
    .fold(toTimeline, [])
    .startWith([]);

  const timeRange = sources.DOM.select('.js-timerange');

  const timeRange$ = timeRange
    .events('input')
    .map(getEventValue)
    .startWith(1);

  const timeline$ = xs.combine(
    moveYTimeline$,
    clickYTimeline$,
  ).map(toTimelineTable);

  const stateSource$ = xs.combine(timeline$, timeRange$);

  const state$ = stateSource$.map(toState);

  const vtree$ = state$.map(View);

  const sinks = {
    DOM: vtree$
  }

  return sinks
}
