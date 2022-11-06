import EventEmitter from 'events'
import CryptoJS from "crypto-js"

function hashToBust(seed) {
  const nBits = 52;
  const hmac = CryptoJS.HmacSHA256(CryptoJS.enc.Hex.parse(seed), '0000000000000000004d6ec16dafe9d8370958664c1dc422f452892264c59526');
  seed = hmac.toString(CryptoJS.enc.Hex);
  seed = seed.slice(0, nBits / 4);
  const r = parseInt(seed, 16);
  let X = r / Math.pow(2, nBits);
  X = 99 / (1 - X);
  const result = Math.floor(X);
  return Math.max(1, result / 100);
}

function hashToBusts(seed, amount) {
  if (isNaN(amount) || amount <= 0) {
    throw new TypeError('amount must be a number larger than zero.')
  }
  let prevHash = seed
  const result = []
  result.unshift({ hash: prevHash, bust: hashToBust(String(prevHash)) })
  for (let index = 0; index < amount; index++) {
    let hash = String(CryptoJS.SHA256(String(prevHash)))
    let bust = hashToBust(hash)
    result.unshift({ hash, bust })
    prevHash = hash;
  }
  return result
}

class SimulatedBustabitHistory {
  constructor() {
    this.data = []
  }

  get size() {
    return this.data.length
  }

  get length() {
    return this.data.length
  }

  get start() {
    return 0
  }

  get end() {
    return this.data.length - 1
  }

  first() {
    return this.size > 0 ? this.data[0] : null;
  }

  last() {
    return this.size > 0 ? this.data[this.size - 1] : null;
  }

  toArray() {
    return this.data;
  }
}

class SimulatedBustabitEngine extends EventEmitter {

  constructor() {
    super()
    this._userInfo = {
      uname: 'Anonymous',
      balance: 0,
      balanceATH: 0,
      balanceATL: 0,
      winStreak: 0,
      loseStreak: 0,
      streakSum: 0,
      sumWagers: 0,
      highBet: 0,
      lowBet: 0,
      bets: 0,
      profit: 0,
      profitATH: 0,
      profitATL: 0,
      profitPerHour: 0,
      duration: 0
    }
    this.history = new SimulatedBustabitHistory()
    this.bet = this.bet.bind(this)
  }

  getCurrentBet() {
    if (!this.next) return undefined;
    return { wager: this.next.wager, payout: this.next.payout }
  }

  isBetQueued() {
    return !!this.next
  }

  cancelQueuedBet() {
    this.next = undefined
  }

  bet(wager, payout) {
    // 'bet' returns a Promise, just like on bustabit
    return new Promise((resolve, reject) => {
      this.next = { wager, payout: Math.round(payout * 100) / 100, isAuto: true, resolve, reject }
    }).catch(error => console.error(error));
  }

}

function evalScript() {
  const { config, engine, userInfo, log, stop, gameResultFromHash } = this // eslint-disable-line no-unused-vars
  // eslint-disable-next-line
  eval(arguments[0])
}

function simulate({ text, config, startingBalance, gameHash, gameAmount, drawChart, quickTest }) {
  return new Promise((resolve, reject) => {
    let logMessages = '',
      shouldStop = false,
      shouldStopReason = undefined;
    const logFuncs = {
      log: console.log,
      warn: console.warn,
      info: console.info,
      error: console.error,
      debug: console.debug
    };
    function noLog() { return; }
    if (!quickTest) {
      console.log = noLog;
      console.warn = noLog;
      console.info = noLog;
      console.error = noLog;
      console.debug = noLog;
    }
    const engine = new SimulatedBustabitEngine(),
      userInfo = engine._userInfo,
      log = (!quickTest ? () => { } : function () {
        let msg = Array.prototype.slice.call(arguments);
        logMessages += msg.join(' ') + '\n'
        msg.unshift('LOG:');
        console.log(...msg);
      }),
      stop = function (reason) {
        shouldStopReason = reason
        shouldStop = true
      },
      gameResultFromHash = function (hash) {
        return new Promise(resolve => resolve(hashToBust(hash)));
      },
      notify = function (message) {
        log(message.toString())
      };
    userInfo.balance = startingBalance
    userInfo.balanceATH = startingBalance
    userInfo.balanceATL = startingBalance

    const results = {
      duration: 0,
      startingBalance: startingBalance,
      balance: startingBalance,
      balanceATH: startingBalance,
      balanceATL: startingBalance,
      bets: 0,
      profit: 0,
      lowBet: 0,
      highBet: 0,
      winStreak: 0,
      loseStreak: 0,
      streakSum: 0,
      profitPerHour: 0,
      profitATH: 0,
      profitATL: 0,
      message: '',
      history: engine.history.data,
      log: logMessages
    };
    if (drawChart) {
      Object.assign(results, { chartData: [] })
    }

    const context = { config, engine, userInfo, log, stop, gameResultFromHash, notify };
    evalScript.call(context, text)

    const games = hashToBusts(gameHash, gameAmount)
    nextGame(null, -1, games)

    function nextGame(id) {
      id++
      setImmediate(() => {
        if (id < games.length && !shouldStop) {
          doGame(id);
        } else {
          endSimulation();
        }
      });
    }


    function endSimulation() {
      if (!!quickTest) {
        console.log = logFuncs.log;
        console.warn = logFuncs.warn;
        console.info = logFuncs.info;
        console.error = logFuncs.error;
        console.debug = logFuncs.debug;
      }
      if (shouldStop && shouldStopReason) {
        log(shouldStopReason)
      }

      if (userInfo.streakSum < userInfo.sumWagers) {
        userInfo.streakSum = userInfo.sumWagers
      }

      results.duration = userInfo.duration;
      results.startingBalance = startingBalance
      results.balance = userInfo.balance
      results.bets = userInfo.bets
      results.profit = userInfo.profit
      results.lowBet = userInfo.lowBet
      results.highBet = userInfo.highBet
      results.streakSum = userInfo.streakSum
      results.loseStreak = userInfo.loseStreak
      results.winStreak = userInfo.winStreak
      results.profitATH = userInfo.profitATH
      results.profitATL = userInfo.profitATL
      results.balanceATH = userInfo.balanceATH
      results.balanceATL = userInfo.balanceATL
      results.profitPerHour = results.profit / (results.duration / (1000 * 60 * 60))
      results.message = `${userInfo.bets} Games played. ${results.profit > 0 ? 'Won' : 'Lost'} ${(results.profit / 100)} bits. ${results.message || ''}`
      results.history = engine.history.results
      results.log = logMessages
      resolve(results);
    }

    function doGame(id) {
      const game = games[id]
      game.id = id
      game.isSimulation = true
      game.wager = 0
      game.cashedAt = 0

      // set gameState, just like bustabit
      engine.gameState = 'GAME_STARTING'
      // emit event, just like bustabit
      engine.emit('GAME_STARTING', { gameId: id })

      // engine.next is set when engine.bet(wager, payout) is called
      // probably just like bustabit
      const bet = engine.next
      engine.next = null

      if (bet) {
        // reject with specific strings, just like bustabit
        if (isNaN(bet.wager) || bet.wager < 100 || (bet.wager % 100 !== 0)) {
          bet.reject('INVALID_BET')
          return endSimulation()
        }
        if (isNaN(bet.payout)) {
          bet.reject('cannot parse JSON')
          return endSimulation()
        }
        if (userInfo.balance - bet.wager < 0) {
          bet.reject('BET_TOO_BIG')
          userInfo.sumWagers += bet.wager;
          return endSimulation()
        }
        if (bet.payout <= 1) {
          bet.reject('payout is too low')
          return endSimulation()
        }

        // decrease balance, just like bustabit

        if (bet.wager > 0) {
          userInfo.balance -= bet.wager;
          userInfo.bets++;
          userInfo.sumWagers += bet.wager;
        }
        // resolve with null, just like bustabit
        bet.resolve(null);

        // emit event, just like bustabit
        engine.emit('BET_PLACED', {
          uname: userInfo.uname,
          wager: bet.wager,
          payout: bet.payout
        })
      }

      engine.emit('GAME_STARTED', null)

      // set gameState, just like bustabit
      engine.gameState = 'GAME_IN_PROGRESS'

      // set wager and cashedAt, just like bustabit
      // wager: zero when didn't bet
      game.wager = bet ? bet.wager : 0
      // cashedAt: zero when busted or didn't bet
      game.cashedAt = bet && bet.wager > 0 && bet.payout <= game.bust ? bet.payout : 0

      if (game.wager !== 0) {
        // update balance, just like bustabit
        userInfo.balance += game.cashedAt * game.wager
        if (userInfo.balance < userInfo.balanceATL) { userInfo.balanceATL = userInfo.balance }
        if (userInfo.balance > userInfo.balanceATH) { userInfo.balanceATH = userInfo.balance }
        userInfo.profit = userInfo.balance - startingBalance
        if (!userInfo.lowBet || game.wager < userInfo.lowBet) { userInfo.lowBet = game.wager }
        if (!userInfo.highBet || game.wager > userInfo.highBet) { userInfo.highBet = game.wager }
        if (userInfo.profit < userInfo.profitATL) { userInfo.profitATL = userInfo.profit }
        if (userInfo.profit > userInfo.profitATH) { userInfo.profitATH = userInfo.profit }
      }

      if (game.cashedAt > 0) {
        // won!
        userInfo.sinceWin = 0
        userInfo.sinceLose++
        if (userInfo.sinceLose > userInfo.winStreak) {
          userInfo.winStreak = userInfo.sinceLose
        }
        if (userInfo.streakSum < userInfo.sumWagers) {
          userInfo.streakSum = userInfo.sumWagers
        }
        userInfo.sumWagers = 0;
        // emit event, just like bustabit
        engine.emit('CASHED_OUT', {
          uname: userInfo.uname,
          cashedAt: game.cashedAt,
          wager: game.wager
        })
      } else {
        if (game.wager !== 0) {
          // lost
          userInfo.sinceLose = 0
          userInfo.sinceWin++
          if (userInfo.sinceWin > userInfo.loseStreak) {
            userInfo.loseStreak = userInfo.sinceWin
          }
        }
      }

      // add game to history, just like bustabit
      engine.history.data.unshift(game)
      // keep track of some extra data for the chart
      if (drawChart) {
        results.chartData.unshift(Object.assign({
          payout: (bet ? bet.payout : 0),
          balance: userInfo.balance,
          profit: (game.cashedAt > 0 ? (game.cashedAt - 1) * game.wager : -game.wager)
        }, game))
      }
      userInfo.duration += Math.log(game.bust) / 0.00006

      // set gameState, just like bustabit
      engine.gameState = 'GAME_ENDED'
      // emit event, just like bustabit
      engine.emit('GAME_ENDED', { hash: game.hash, bust: game.bust })

      nextGame(id)
    }
  });
}


export default simulate
