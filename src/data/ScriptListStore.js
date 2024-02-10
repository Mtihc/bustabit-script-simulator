import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import ScriptActionTypes from './ScriptActionTypes';
import AppDispatcher from './AppDispatcher';
import ScriptConstants from './ScriptConstants';

class ScriptListStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap({
      creating: undefined,
      editingId: undefined,
      deletingId: undefined,
      selectedId: undefined,
      isSimulating: false,
      results: undefined,
      error: undefined,
    })
  }

  reduce(state, action) {
    switch (action.type) {
      case ScriptActionTypes.NEW:
        return state.set('creating', Object.assign({}, ScriptConstants.NEW_SCRIPT))
                    .set('createError', undefined)

      case ScriptActionTypes.CREATED:
        return state.set('creating', undefined)
                    .set('createError', undefined)

      case ScriptActionTypes.CREATE_ERROR:
        return state.set('createError', action.error)


      case ScriptActionTypes.EDIT:
        return state.set('editingId', action.id)
                    .set('updateError', undefined)

      case ScriptActionTypes.UPDATED:
        return state.set('editingId', undefined)
                    .set('updateError', undefined)

      case ScriptActionTypes.UPDATE_ERROR:
        return state.set('updateError', action.error)


      case ScriptActionTypes.DELETE:
        return state.set('deletingId', action.id)
                    .set('deleteError', undefined)

      case ScriptActionTypes.DELETED:
        return state.set('deletingId', undefined)
                    .set('deleteError', undefined)

      case ScriptActionTypes.DELETE_ERROR:
        return state.set('deleteError', action.error)


      case ScriptActionTypes.CANCEL:
        return state.set('creating', undefined)
                    .set('editingId', undefined)
                    .set('deletingId', undefined)
                    .set('createError', undefined)
                    .set('updateError', undefined)
                    .set('deleteError', undefined)

      case ScriptActionTypes.SELECT:
        return state.set('selectedId', action.id)
                    .set('results', undefined)

      case ScriptActionTypes.DESELECT:
        return state.set('selectedId', undefined)

      case ScriptActionTypes.SIMULATE:
        return state.set('results', undefined)
                    .set('isSimulating', true)

      case ScriptActionTypes.SIMULATED:
        return state.set('results', action.results)
                    .set('isSimulating', false)

      default:
        return state;
    }
  }
}

let scriptListStore = new ScriptListStore();
export default scriptListStore