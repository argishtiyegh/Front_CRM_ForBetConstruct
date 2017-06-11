import React, { Component } from 'react';
import '../StyleSheet/MessageSentFailed.css';

class Added extends Component {
    render() {
        return (
            <div className="msg-sent-failedw">
                <p className="msg-sent-failed">Contact was added successfully.</p>
            </div>
        );
    }
}

export { Added };