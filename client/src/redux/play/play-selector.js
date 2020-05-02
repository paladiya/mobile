import {createSelector} from 'reselect';

const selectPlay = state => state.play

export const selectIsPlaying = createSelector([selectPlay],selectPlay=>selectPlay.isPlaying)
export const selectItemId = createSelector([selectPlay],selectPlay=>selectPlay.itemId)