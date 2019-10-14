import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

import './Chat.css'

let socket

const Chat = ({ location }) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const ENDPOINT = 'https://chat-node-server.herokuapp.com/'

  useEffect(() => {
    // retriving data from the URL param, (location.search) gives back the URL parameters not the whole URL
    const { name, room } = queryString.parse(location.search) // queryString gives back an object

    socket = io(ENDPOINT)

    setName(name)
    setRoom(room)

    socket.emit('join', { name: name, room: room }, () => {
      
    })
    
    // unmounting or disconnecting the useEffect
    return () => {
      socket.emit('disconnect')
      socket.off()
    }
  }, [ENDPOINT, location.search])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message])
    })
  }, [messages])

  // fn for sending messages
  const sendMessage = event => {
    event.preventDefault()

    if(message) {
    socket.emit('sendMessage', message, () => setMessage('')) //clearing the input field
  }
}

  console.log(message, messages)

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages name={name} messages={messages} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default Chat
