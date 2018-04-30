'use strict'

import * as io from 'socket.io-client'
import * as Terminal from 'xterm/dist/xterm'

require('xterm/dist/xterm.css')
require('../css/style.css')

export let startTerminal = function () {
  var sessionLogEnable = false
  var loggedData = false
  var allowreplay = false
  var sessionLog, sessionFooter, logDate, currentDate, myFile, errorExists
  var socket, termid // eslint-disable-line
  var term = new Terminal()

  // DOM properties
  var terminalContainer = document.getElementById('terminal-container')

  term.open(terminalContainer)
  term.focus()
  term.setOption('cols', 80)
  term.setOption('rows', 24)

  if (document.location.pathname) {
    var parts = document.location.pathname.split('/')
    var base = parts.slice(0, parts.length - 1).join('/') + '/'
    var resource = base.substring(1) + 'socket.io'
    socket = io.connect(null, {
      resource: resource
    })
  } else {
    socket = io.connect()
  }

  term.on('data', function (data) {
    socket.emit('data', data)
  })

  socket.on('data', function (data) {
    term.write(data)
  })

  socket.on('connect', function () {
    // socket.emit('geometry', term.cols, term.rows)
    socket.emit('resize', { cols: term.cols, rows: term.rows })
  })

  socket.on('setTerminalOpts', function (data) {
    term.setOption('cursorBlink', data.cursorBlink)
    term.setOption('scrollback', data.scrollback)
    term.setOption('tabStopWidth', data.tabStopWidth)
    term.setOption('bellStyle', data.bellStyle)
  })

  socket.on('title', function (data) {
    document.title = data
  })

  socket.on('status', function (data) {
    console.log('status', data)
  })

  socket.on('ssherror', function (data) {
    console.log('ssherror', data)
    errorExists = true
  })

  socket.on('allowreplay', function (data) {
    if (data === true) {
      console.log('allowreplay: ' + data)
      allowreplay = true
    } else {
      allowreplay = false
      console.log('allowreplay: ' + data)
    }
  })

  socket.on('disconnect', function (err) {
    socket.io.reconnection(false)
  })

  socket.on('error', function (err) {
    if (!errorExists) {
      console.log('ERROR: ', err)
    }
  })

  term.on('title', function (title) {
    document.title = title
  })

  // replay password to server, requires
  function replayCredentials () { // eslint-disable-line
    socket.emit('control', 'replayCredentials')
    console.log('replaying credentials')
    term.focus()
    return false
  }
}
