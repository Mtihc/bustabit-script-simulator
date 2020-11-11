import AppDispatcher from './AppDispatcher';
import ScriptActionTypes from './ScriptActionTypes';
import ScriptUtils from './ScriptUtils'
import NotificationActions from './NotificationActions'

const Actions = {

  load () {
    let scripts = ScriptUtils.load();
    AppDispatcher.dispatch({ type: ScriptActionTypes.LOADED, scripts });
  },

  restoreSamples () {
    let scripts = ScriptUtils.restoreSamples()
    AppDispatcher.dispatch({ type: ScriptActionTypes.LOADED, scripts });
  },

  delete (id) {
    AppDispatcher.dispatch({ type: ScriptActionTypes.DELETE, id })
  },

  deleted (id) {
    ScriptUtils.delete(id)
    AppDispatcher.dispatch({ type: ScriptActionTypes.DELETED, id })
  },

  save (script) {
    if (!script.id) {
      try {
        ScriptUtils.save(script)
        AppDispatcher.dispatch({ type: ScriptActionTypes.CREATED, script })
      } catch (e) {
        AppDispatcher.dispatch({ type: ScriptActionTypes.CREATE_ERROR, script, error: e })
      }
    } else {
      try {
        ScriptUtils.save(script)
        AppDispatcher.dispatch({ type: ScriptActionTypes.UPDATED, script })
      } catch (e) {
        AppDispatcher.dispatch({ type: ScriptActionTypes.UPDATE_ERROR, script, error: e })
      }
    }
  },

  new () {
    AppDispatcher.dispatch({ type: ScriptActionTypes.NEW })
  },

  edit (id) {
    AppDispatcher.dispatch({ type: ScriptActionTypes.EDIT, id })
  },

  cancel () {
    AppDispatcher.dispatch({ type: ScriptActionTypes.CANCEL })
  },

  select (id) {
    AppDispatcher.dispatch({ type: ScriptActionTypes.SELECT, id })
  },

  deselect () {
    AppDispatcher.dispatch({ type: ScriptActionTypes.DESELECT })
  },

  run (settings) {
    Actions.save(settings.script)
    AppDispatcher.dispatch({ type: ScriptActionTypes.SIMULATE, settings });
    ScriptUtils
      .run(settings)
      .then((results) => {
        ScriptDispatcher.dispatch({ type: ScriptActionTypes.SIMULATED, results })
      })
  }
};

export default Actions;
