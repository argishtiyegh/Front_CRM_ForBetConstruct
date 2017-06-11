import React, { Component } from 'react';
import '../StyleSheet/MessageSentFailed.css';

class Deleted extends Component {
    render() {
        return (
            <div className="msg-sent-failedw">
                <p className="msg-sent-failed">Successfully deleted.</p>
            </div>
        );
    }
}

export { Deleted };