import React, { Component } from 'react';
import '../StyleSheet/MessageSentFailed.css';

class MessageFailed extends Component {
    render() {
        return (
            <div className="msg-sent-failedw">
                <p className="msg-sent-failed">Failed</p>
            </div>
        );
    }
}

export { MessageFailed };