import { getUniqueID } from './AppUtils'
import ScriptConstants from './ScriptConstants'
import simulate from './simulate'
import CryptoJS from "crypto-js"
/*
 Helper functions
*/

function getLocalStorageScripts() {
  try {
    var loadedScripts = JSON.parse(localStorage.getItem('scripts'))
  } catch (e) {
    loadedScripts = null;
  }
  return loadedScripts;
}

function setLocalStorageScripts(scripts) {
  if (scripts === undefined ||
    scripts === null ||
    (scripts.constructor === Object && Object.keys(scripts).length === 0)) {
    localStorage.removeItem('scripts')
  } else {
    localStorage.setItem('scripts', JSON.stringify(scripts))
  }
}

function onBeforeSave(script) {
  let oldConfig = script.config;
  script.config = getConfigFromScriptText(script)
  assignConfigValues(script.config, oldConfig)
}

function assignConfigValues(config, values) {
  if (!config || config.constructor !== Object) {
    throw new TypeError('config should be an object')
  }
  if (values && values.constructor !== Object) {
    throw new TypeError('values should be undefined or an object')
  }
  if (!values) return config;
  for (const key in values) {
    if (!values[key] || values[key].constructor !== Object) continue;
    if (!config[key]) continue;
    if (values[key].value === undefined) continue;
    config[key].value = values[key].value
    if (config[key].type === 'radio') {
      config[key].options = assignConfigValues(config[key].options || {}, values[key].options)
    }
  }
  return config
}

/**
 * There should be a <code>var config = ...</code> at the top of the script.
 * This function will extract that variable from the script and return it as an object,
 * together with the remaining script text.
 * @param {string} script.text The script's actual raw text
 * @returns {Array} The config and the remaining script text.
 */
function splitConfigFromScriptText(script) {
  const regexp = /^\s*(var config = {(?:.|\s)*?^};?)((?:.|\s)*)$/gm
  const match = regexp.exec(String(script.text).trim())

  if (match === null) {
    throw new TypeError('The script should begin with: \r\nvar config = {\r\n  ...\r\n}\r\n')
  }
  // eslint-disable-next-line
  const config = eval(match[1] + '\r\nconfig;')
  return [config, match[2]]
}

function getConfigFromScriptText(script) {
  return splitConfigFromScriptText(script)[0]
}

function getScriptTextWithoutConfig(script) {
  return splitConfigFromScriptText(script)[1]
}

const ScriptUtils = {
  /**
   * Load scripts from localStorage.
   * Will insert sample scripts if there are no scripts yet.
   * @returns {Object.<string, Object>} all scripts
   */
  load() {
    let scripts = getLocalStorageScripts()
    if (scripts === null || scripts === undefined) {
      scripts = ScriptUtils.restoreSamples()
    }
    return scripts
  },

  /**
   * Insert or re-insert sample scripts into localStorage.
   * @returns {Object.<string, Object>} all scripts
   */
  restoreSamples() {
    let scripts = getLocalStorageScripts() || {}
    Object.keys(scripts).forEach(id => {
      if (scripts[id].isSample) {
        delete scripts[id]
      }
    })
    ScriptConstants.SCRIPT_SAMPLES.forEach((script) => {
      onBeforeSave(script)
      script.isSample = true
      script.id = getUniqueID(Object.keys(scripts))
      scripts[script.id] = script
    })
    setLocalStorageScripts(scripts)

    return scripts
  },

  /**
   * Save a script.
   * @param {Object.<string, Object>} script The script to save
   */
  save(script) {
    let scripts = getLocalStorageScripts()
    onBeforeSave(script)
    if (!script.id) {
      script.id = getUniqueID(Object.keys(scripts))
    }
    scripts[script.id] = script
    setLocalStorageScripts(scripts)
  },

  /**
   * Delete a script.
   * @param {string} id The id of script to delete
   */
  delete(id) {
    let scripts = getLocalStorageScripts()
    delete scripts[id]
    setLocalStorageScripts(scripts)
  },

  /**
   * Simulate a script on a number of games based on a previous bustabit game's hash.
   * @param options The simulation options
   * @param {Object} options.script The script with it's text and config attributes.
   * @param {string} options.gameHash Some previous bustabit game's hash.
   * @param {number} options.gameAmount The amount of games to simulate
   * @param {number} options.startingBalance The amount of Bits to start with.
   * @param {boolean} options.drawChart Whether to collect extra data that is required for a line chart.
   * @param {boolean} options.quickTest Disables the script logging in order to speed up large tests.
   */
  run({ script, gameHash, gameAmount, startingBalance, drawChart, quickTest }) {
    let settings = { ...arguments[0] }
    delete settings.script
    settings.config = script.config
    settings.text = getScriptTextWithoutConfig(script)

    return {
      then: function (callback) {
        setTimeout(function () {
          simulate(settings)
            .then((results) => {
              callback(results);
            })
            .catch(error => {
              console.error(error)
              let results = { error: error }
              callback(results)
            })
        }, 100)
      }
    }
  },

}

export default ScriptUtils
