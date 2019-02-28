import Immutable from 'immutable';
import { ReduceStore } from 'flux/utils';
import ScriptActionTypes from './ScriptActionTypes';
import ScriptDispatcher from './ScriptDispatcher';

class ScriptStore extends ReduceStore {
  constructor() {
    super(ScriptDispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap()
  }

  reduce(state, action) {

    switch (action.type) {
      case ScriptActionTypes.LOADED:
        return state.clear().merge(action.scripts)

      case ScriptActionTypes.DELETED:
        return state.delete(action.id)

      case ScriptActionTypes.CREATED:
        return state.set(action.script.id, action.script)

      case ScriptActionTypes.UPDATED:
        return state.set(action.script.id, action.script)

      default:
        return state;
    }
  }
}

export default new ScriptStore();
