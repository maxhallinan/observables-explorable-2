import { style } from 'typestyle';

import { remToPx, } from './util';

export const explorable = style({
  width: '100%',
});

export const frame = style({
  border: '1px solid #333',
  display: 'block',
  height: remToPx(18.19),
  width: remToPx(53.291),
});

export const controls = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export const controlLabel = style({
  alignItems: 'center',
  border: 'none',
  display: 'flex',
  margin: 0,
  padding: 0,
});

export const controlSet = style({
  alignItems: 'center',
  border: 'none',
  display: 'flex',
  margin: 0,
  padding: 0,
});
