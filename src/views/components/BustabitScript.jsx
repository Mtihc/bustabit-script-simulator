import React, { Component } from 'react';
import Config from './BustabitScriptConfig';
import LineChart from './LineChart'
import PropTypes from 'prop-types'
import './BustabitScript.css'

class App extends Component {

  viewState() {
    if (this.props.scripts.editing) {
      return 'edit'
    }
    if (this.props.scripts.creating) {
      return 'new'
    }
    if (this.props.scripts.deleting) {
      return 'delete'
    }
    if (this.props.scripts.selected) {
      return 'show'
    }
    return 'list'
  }

  componentDidMount() {
    this.props.scripts.load()
  }

  render() {
    const viewState = this.viewState()
    const { scripts, className = '', ...rest } = this.props
    return (
      <div {...rest} className={className}>
        {(viewState === 'list' || viewState === 'delete') && (
          <List
            scripts={scripts} />
        )}
        {viewState === 'edit' && (
          <Edit
            script={scripts.editing}
            error={scripts.updateError}
            onCancel={scripts.onCancel}
            onSave={scripts.onSave} />
        )}
        {viewState === 'new' && (
          <New
            script={scripts.creating}
            error={scripts.createError}
            onCancel={scripts.onCancel}
            onSave={scripts.onSave} />
        )}
        {viewState === 'show' && (
          <Show
            scripts={scripts} />
        )}
      </div>
    )
  }
}

class Title extends Component {
  render() {
    const { className = '', ...rest } = this.props
    return (
      <div {...rest} className={`${className}`}>
        <p>
          <span className="bustabit-logo" />
          <span className="bustabit-title">
            Bustabit
          </span>
        </p>
        <p>
          <span className="script-simulator-title">
            Script Simulator
          </span>
        </p>
      </div>
    )
  }
}

class List extends Component {
  render() {
    const { className = '', scripts, ...rest } = this.props
    let deletingId = scripts.deleting ? scripts.deleting.id : undefined
    return (
      <div {...rest} className={`BustabitScript-List box is-inline-block ${className}`}>
        <table className="table is-hoverable">
          <thead>
            <tr>
              <th colSpan="2">
                <h3 className="subtitle is-4">
                  My Scripts
                </h3>
              </th>
              <th colSpan="2">
                <NewButton
                  onClick={() => scripts.onNew()} />
              </th>
            </tr>
          </thead>
          <tbody>
            {scripts.items.entrySeq().map(([index, script]) => {
              let id = script.id
              if (id === deletingId) {
                return (
                  <tr key={id}>
                    <th>{script.name}</th>
                    <td colSpan="3" style={{ maxWidth: '9rem' }}>
                      <Delete key={id}
                        script={scripts.deleting}
                        onCancel={scripts.onCancel}
                        onDeleted={scripts.onDeleted} />
                    </td>
                  </tr>
                )
              }
              return (
                <tr key={id}>
                  <th>{script.name}</th>
                  <td>
                    <SelectButton
                      onClick={() => scripts.onSelect(id)} />
                  </td>
                  <td>
                    <EditButton
                      onClick={() => scripts.onEdit(id)} />
                  </td>
                  <td>
                    <DeleteButton
                      onClick={() => scripts.onDelete(id)} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

function msToTime(duration) {
  // eslint-disable-next-line
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24),
    days = parseInt((duration / (1000 * 60 * 60 * 24)));

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return (days > 0 ? days + "d " : "") + hours + "h " + minutes + "m " + seconds + "s";
}

class Show extends Component {
  constructor(props) {
    super(props)
    this.state = {
      script: props.scripts.selected,
      startingBalance: 1000000,
      gameHash: '7edbd07968e771f205a4e2b67701c2f6993437db0c557160ba79ee70ea6d10c6',
      gameAmount: 1000,
      drawChart: true,
      quickTest: true,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.scripts.results !== prevProps.scripts.results) {
      let resultsElement = document.getElementById("results")
      if (resultsElement) {
        const y = resultsElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ behavior: 'smooth', top: y })
      }
    }
  }

  render() {
    const { className = '', scripts, ...rest } = this.props
    return (
      <div {...rest} className={`BustabitScript Show ${className}`}>
        {this.state.script && (
          <div key={this.state.script.id}>
            <div className="box is-inline-block has-text-left">
              <div>
                <GoBackButton
                  className={`${scripts.isLoading ? 'is-loading' : ''}`}
                  onClick={scripts.onDeselect} />
                <EditButton
                  className="is-pulled-right"
                  onClick={() => scripts.onEdit(this.state.script.id)} />
              </div>
              <hr className="hr" />
              <Config
                config={this.state.script.config}
                onChange={config => {
                  this.setState(({ script }) => {
                    script.config = config
                    return { script }
                  })
                }} />
              <hr className="hr" />
              <Control label="Starting Balance"
                icon="fas fa-coins">
                <input className="input is-normal"
                  type="number" required={true}
                  min="1" step="1"
                  name="startingBalance"
                  value={this.state.startingBalance / 100}
                  onChange={(event) => {
                    let changes = { [event.target.name]: parseFloat(event.target.value) * 100 }
                    this.setState(changes)
                  }} />
              </Control>
              <Control label="Hash"
                icon="fas fa-key">
                <input className="input is-normal"
                  type="text" required={true}
                  name="gameHash"
                  value={this.state.gameHash}
                  onChange={(event) => {
                    this.setState({ [event.target.name]: String(event.target.value) })
                  }} />
              </Control>

              <Control label="Games"
                icon="fas fa-hashtag">
                <input className="input is-normal"
                  type="number" required={true}
                  min="1" step="1"
                  name="gameAmount"
                  value={this.state.gameAmount}
                  onChange={(event) => {
                    this.setState({ [event.target.name]: parseInt(event.target.value) })
                  }} />
              </Control>
              <hr className="hr" />
              <div className="field is-grouped">
                <div className="control">
                  <button className={`button is-success ${scripts.isLoading ? 'is-loading' : ''}`}
                    disabled={!(
                      this.state.script &&
                      this.state.gameHash &&
                      this.state.gameAmount &&
                      this.state.startingBalance
                    )}
                    onClick={() => {
                      let args = {
                        script: this.state.script,
                        gameHash: this.state.gameHash,
                        gameAmount: this.state.gameAmount,
                        startingBalance: this.state.startingBalance,
                        drawChart: this.state.drawChart,
                        quickTest: this.state.quickTest,
                      };
                      scripts.onRun(args)
                    }}>
                    Run Script
                  </button>
                </div>
                <div className="control">
                  <p>
                    <label className="checkbox">
                      <input className="checkbox"
                        type="checkbox"
                        name="drawChart"
                        checked={this.state.drawChart}
                        onChange={(event) => {
                          this.setState({ [event.target.name]: Boolean(event.target.checked) })
                        }} />
                    &nbsp;
                    Enable Chart
                  </label>
                  </p><p>
                    <label className="checkbox">
                      <input className="checkbox"
                        type="checkbox"
                        name="quickTest"
                        checked={this.state.quickTest}
                        onChange={(event) => {
                          this.setState({ [event.target.name]: Boolean(event.target.checked) })
                        }} />
                    &nbsp;
                    Enable Log
                  </label>
                  </p>
                </div>
              </div>
              <div>
                <textarea className="textarea"
                  value={scripts.results ? scripts.results.log : undefined}
                  readOnly={true}
                  style={{ width: '100%', height: '200px', resize: 'both' }}
                  placeholder="Script logs will appear here">
                </textarea>
              </div>
            </div>
          </div>
        )}
        {scripts.selected && scripts.results && (
          <section className="section">
            <div id="results" />
            {scripts.results.error && (
              <div className="notification is-danger">
                <h3 className="is-3">Error</h3>
                <pre className="notification is-danger has-text-left">
                  {String(scripts.results.error)}
                </pre>
              </div>
            )}
            {!scripts.results.error && (
              <div className="columns">
                <div className="column is-one-fifth">
                  <table className={"table is-hoverable box is-inline-block"}>
                    <tbody>
                      <tr>
                        <th>Games Played</th>
                        <td>{scripts.results.bets} games</td>
                      </tr>
                      <tr>
                        <th>Duration</th>
                        <td>{msToTime(scripts.results.duration)}</td>
                      </tr>
                      <tr>
                        <th>Start Balance</th>
                        <td>{scripts.results.startingBalance / 100} bits</td>
                      </tr>
                      <tr>
                        <th>Smallest Bet</th>
                        <td>{scripts.results.lowBet / 100} bits</td>
                      </tr>
                      <tr>
                        <th>Largest Bet</th>
                        <td>{scripts.results.highBet / 100} bits</td>
                      </tr>
                      <tr>
                        <th>Win Streak</th>
                        <td>{scripts.results.winStreak} games</td>
                      </tr>
                      <tr>
                        <th>Lose Streak</th>
                        <td>{scripts.results.loseStreak} games</td>
                      </tr>
                      <tr>
                        <th>Streak Cost</th>
                        <td>{scripts.results.streakSum / 100} bits</td>
                      </tr>
                      <tr>
                        <th>Profit ATL</th>
                        <td>{(scripts.results.profitATL / 100).toFixed(2)} bits</td>
                      </tr>
                      <tr>
                        <th>Profit ATH</th>
                        <td>{(scripts.results.profitATH / 100).toFixed(2)} bits</td>
                      </tr>
                      <tr>
                        <th>Balance ATL</th>
                        <td>{(scripts.results.balanceATL / 100).toFixed(2)} bits</td>
                      </tr>
                      <tr>
                        <th>Balance ATH</th>
                        <td>{(scripts.results.balanceATH / 100).toFixed(2)} bits</td>
                      </tr>
                      <tr>
                        <th>End Profit</th>
                        <td className={`${scripts.results.profit >= 0 ? 'has-text-success' : 'has-text-danger'}`}>{(Math.round(scripts.results.profit) / 100).toFixed(2)} bits</td>
                      </tr>
                      <tr>
                        <th>End Balance</th>
                        <td>{scripts.results.balance / 100} bits</td>
                      </tr>
                      {scripts.results.profit > 0 && (
                        <tr>
                          <th>Profit per hour</th>
                          <td>{Math.round(scripts.results.profitPerHour) / 100} bits</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="2">{scripts.results.message || ''}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {scripts.results.chartData && (
                  <div className="column">
                    <div className="has-text-centered box">
                      <LineChart {...{
                        viewBoxWidth: 960,
                        viewBoxHeight: 500,
                        data: scripts.results.chartData,
                        xAccessor: (d) => { return d.id },
                        yAccessor: (d) => { return d.balance },
                        crosshairEnabled: true,
                        crosshairClassName: (d) => { return d.profit > 0 ? 'is-success' : 'is-danger' },
                      }} />
                    </div>
                  </div>
                )}
              </div>
            )}
            <BackToTopButton />
          </section>
        )}
      </div>
    )
  }
}

class Delete extends Component {
  render() {
    return (
      <div>
        {!this.props.script ? null : (
          <div>
            <p>
              Are you sure you want to delete this script?
            </p>
            <div className="buttons is-pulled-right">
              <button
                className="button"
                onClick={() => {
                  let id = this.props.script.id
                  this.props.onDeleted(id, true)
                }}>Yes</button>
              <button
                className="button"
                onClick={this.props.onCancel}>No</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

class EditButton extends Component {
  render() {
    const { className = '', ...rest } = this.props
    return (
      <div className={`BustabitScript EditButton control ${className}`}>
        <button {...rest} className={`button is-info ${className}`}>
          <span className="icon is-normal" width="2em" height="2em">
            <i className="fas fa-eye"></i>
          </span>
        </button>
      </div>
    )
  }
}

class SelectButton extends Component {
  render() {
    const { className = '', ...rest } = this.props
    return (
      <div className={"BustabitScript SelectButton control"}>
        <button {...rest} className={`button ${className}`}>
          <span className="icon is-normal" width="2em" height="2em">
            <i className="fas fa-play"></i>
          </span>
        </button>
      </div>
    )
  }
}

class DeleteButton extends Component {
  render() {
    const { className = '', ...rest } = this.props
    return (
      <div className={"BustabitScript DeleteButton control"}>
        <button {...rest} className={`button ${className}`}>
          <span className="icon is-normal" width="2em" height="2em">
            <i className="fas fa-trash-alt"></i>
          </span>
        </button>
      </div>
    )
  }
}

class NewButton extends Component {
  render() {
    const { className = '', ...rest } = this.props
    return (
      <div className="BustabitScript NewButton control is-pulled-right">
        <button {...rest} className={`button is-success ${className}`}>
          <span className="icon is-normal" width="2em" height="2em">
            <i className="fas fa-plus"></i>
          </span>
          <span>New</span>
        </button>
      </div>
    )
  }
}

class GoBackButton extends Component {
  render() {
    const { className = '', ...rest } = this.props
    return (
      <a {...rest} className={`button is-normal ${className}`}>
        <span className="icon is-medium">
          <i className="fas fa-arrow-left"></i>
        </span>
        <span>Go Back</span>
      </a>
    )
  }
}

class BackToTopButton extends Component {
  render() {
    const { className = '', onClick, ...rest } = this.props || {}
    return (
      <button {...rest} className={`button is-normal ${className}`}
        onClick={() => {
          window.scroll({ top: 0, behavior: 'smooth' })
          if (onClick) onClick();
        }}>
        <span className="icon is-medium">
          <i className="fas fa-arrow-up"></i>
        </span>
        <span>Back to Top</span>
      </button>
    )
  }
}

class Edit extends Component {

  constructor(props) {
    super(props)
    this.close = this.close.bind(this)
  }

  close(event) {
    if (event) { event.preventDefault(); }
    this.props.onCancel()
  }

  render() {
    return (
      <div className={'BustabitScript Edit modal' + (this.props.script ? ' is-active' : '')}>
        <div className="modal-background"
          onClick={this.close}></div>
        <div className="modal-card" style={{ width: '90%' }}>
          <form onSubmit={(event) => {
            if (event) { event.preventDefault(); }
            const id = String(event.target.id.value || '').trim()
            const name = String(event.target.name.value || '').trim()
            const text = String(event.target.text.value || '').trim()
            const script = { ...this.props.script, id, name, text }
            this.props.onSave(script)
          }}>
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Script</p>
              <button className="delete"
                onClick={this.close}>
              </button>
            </header>
            <section className="modal-card-body">
              {this.props.error && (
                <div className="notification is-warning">
                  <p><strong>Error</strong></p>
                  <pre className="notification is-warning has-text-left">
                    {String(this.props.error)}
                  </pre>
                </div>
              )}
              <input className="input"
                type="hidden"
                name="id"
                defaultValue={this.props.script ? this.props.script.id : ''} />
              <input className="input is-normal"
                required={true}
                type="text"
                name="name"
                defaultValue={this.props.script ? this.props.script.name : ''} />
              <textarea className="textarea is-normal"
                required={true}
                rows="10"
                name="text"
                defaultValue={this.props.script ? this.props.script.text : ''}>
              </textarea>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success"
                type="submit">
                Save Script
              </button>
              <button className="button"
                onClick={this.close}>
                Cancel
              </button>
            </footer>
          </form>
        </div>
      </div>
    )
  }
}
Edit.propTypes = {
  script: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    config: PropTypes.object,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

class New extends Edit { }

New.propTypes = {
  script: PropTypes.shape({
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }),
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}


class Control extends Component {
  render() {
    const { children, label, icon, className = '', ...rest } = this.props
    return (
      <div className="field is-horizontal">
        {label === undefined ? null : (
          <div className="field-label is-normal">
            <label className="label">
              {label}
            </label>
          </div>
        )}
        <div className="field-body">
          <div className="field">
            <div className={`control ${icon ? ' has-icons-left' : ''} ${className}`} {...rest}>
              {children}
              {icon && (
                <span className="icon is-small is-left">
                  <i className={icon}></i>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default { App, Title, EditButton }
