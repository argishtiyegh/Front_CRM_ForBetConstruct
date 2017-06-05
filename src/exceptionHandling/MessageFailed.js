import React, { Component } from 'react';
import '../StyleSheet/MessageSentFailed.css';

class MessageFailed extends Component {
    render() {
        return (
            <div className="msg-sent-failed fail">
                Failed
            </div>
        );
    }
}

export { MessageFailed };