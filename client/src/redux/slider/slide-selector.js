import {createSelector} from 'reselect';

const selectToggle = state => state.slider

export const selectIsToggle = createSelector([selectToggle],slider=>slider.isToggle)