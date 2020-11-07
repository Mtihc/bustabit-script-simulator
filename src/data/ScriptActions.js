import ScriptActionTypes from './ScriptActionTypes';
import ScriptDispatcher from './ScriptDispatcher';
import ScriptUtils from './ScriptUtils'

const Actions = {

  load () {
    let scripts = ScriptUtils.load();
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.LOADED, scripts });
  },

  restoreSamples () {
    let scripts = ScriptUtils.restoreSamples()
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.LOADED, scripts });
  },

  delete (id) {
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.DELETE, id })
  },

  deleted (id) {
    ScriptUtils.delete(id)
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.DELETED, id })
  },

  save (script) {
    if (!script.id) {
      try {
        ScriptUtils.save(script)
        ScriptDispatcher.dispatch({ type: ScriptActionTypes.CREATED, script })
      } catch (e) {
        ScriptDispatcher.dispatch({ type: ScriptActionTypes.CREATE_ERROR, script, error: e })
      }
    } else {
      try {
        ScriptUtils.save(script)
        ScriptDispatcher.dispatch({ type: ScriptActionTypes.UPDATED, script })
      } catch (e) {
        ScriptDispatcher.dispatch({ type: ScriptActionTypes.UPDATE_ERROR, script, error: e })
      }
    }
  },

  new () {
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.NEW })
  },

  edit (id) {
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.EDIT, id })
  },

  cancel () {
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.CANCEL })
  },

  select (id) {
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.SELECT, id })
  },

  deselect () {
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.DESELECT })
  },

  run (settings) {
    Actions.save(settings.script)
    ScriptDispatcher.dispatch({ type: ScriptActionTypes.SIMULATE, settings });
    ScriptUtils
      .run(settings)
      .then((results) => {
        ScriptDispatcher.dispatch({ type: ScriptActionTypes.SIMULATED, results })
      })
  }
};

export default Actions;
