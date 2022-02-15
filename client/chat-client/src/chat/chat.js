import React from 'react';
import { ChannelList } from './channelList';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './style.css';
import { MessagesPanel } from './messagesPanel';
import {Input, Modal} from "antd"
import socketClient from "socket.io-client";
const SERVER = "http://127.0.0.1:8080";
export class Chat extends React.Component {

    state = {
        channels: null,
        socket: null,
        channel: null,
        visible:true,
        username : "",
        isClosed:false
    }
    socket;
    componentDidMount() {
        this.loadChannels();
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = socketClient(SERVER);
        console.log(socket)
        socket.on('connection', () => {
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });
        socket.on('channel', channel => {
            
            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id == channel.id) {
                    c.participants = channel.participants;
                }
            });
            this.setState({ channels });
        });
        socket.on('message', message => {
            
            let channels = this.state.channels
            channels.forEach(c => {
                if (c.id == message.channel_id) {
                    if (!c.messages) {
                        c.messages = [message];
                    } else {
                        c.messages.push(message);
                    }
                }
            });
            this.setState({ channels });
        });
        this.socket = socket;
    }

    loadChannels = async () => {
        fetch(SERVER+'/getChannels').then(async response => {
            let data = await response.json();
            this.setState({ channels: data.channels });
        })
    }

    handleChannelSelect = id => {
        let channel = this.state.channels.find(c => {
            return c.id == id;
        });
        this.setState({ channel });
        this.socket.emit('channel-join', id, ack => {
        });
    }

    handleSendMessage = (channel_id, text) => {
        this.socket.emit('send-message', { channel_id, text, senderName: this.state.username,socket_id :this.socket.id, id: Date.now() });
    }


    handleUsername=(e)=>{
        console.log(e.target.value)
        this.setState({username:e.target.value})
    }

    handleOk=(e)=>{
        if (this.state.username.trim().length > 0){
            this.setState({isClosed:true,visible:false})
        }
    }

    handleCancel=(e)=>{
        this.setState({isClosed:false})
    }

    render() {

        return (
            <>
            <Modal title="Welcome to chat app" maskClosable={this.state.isClosed} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                <Input name="username" value={this.state.username} onChange={this.handleUsername} />
            </Modal>
            {   !this.state.visible && 
                <>
                <p style={{fontWeight:'800'}}>Username: {this.state.username}</p>
                <div className='chat-app'>
                    <ChannelList channel={this.state.channel} channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                    <MessagesPanel onSendMessage={this.handleSendMessage} username={this.state.username} channel={this.state.channel} />
                </div>
                </>
            }
            </>
        );
    }
}