import React, { useState, useEffect } from 'react';

const ChatBox = ({ socketRef, roomId, username }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Listen for incoming messages
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on('chatMessage', ({ username: sender, text }) => {
                setMessages((prev) => [...prev, { username: sender, text }]);
            });
        }
    }, [socketRef]);

    const sendMessage = () => {
        if (message.trim()) {
            socketRef.current.emit('chatMessage', {
                roomId,
                username,
                text: message,
            });
            setMessage('');
        }
    };

    return (
        <div className="chatBox">
            <div className="messages">
                {messages.map((msg, idx) => {
                    const isCurrentUser = msg.username === username;
                    return (
                        <div
                            key={idx}
                            className={`message ${isCurrentUser ? 'myMessage' : 'otherMessage'}`}
                        >
                            <strong>{isCurrentUser ? 'You' : msg.username}:</strong> {msg.text}
                        </div>
                    );
                })}
            </div>
            <div className="inputArea">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
