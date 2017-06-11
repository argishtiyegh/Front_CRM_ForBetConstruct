import React, { Component } from 'react';
import '../StyleSheet/MessageSentFailed.css';

class MessageSent extends Component {
    render() {
        return (
            <div className="msg-sent-failedw">
                <p className="msg-sent-failed">Your message has been sent.</p>
            </div>
        );
    }
}

export { MessageSent };