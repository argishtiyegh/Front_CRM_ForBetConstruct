import React, { Component } from 'react';
import '../StyleSheet/MessageSentFailed.css';

class Saved extends Component {
    render() {
        return (
            <div className="msg-sent-failedw">
                <p className="msg-sent-failed">Your changes has been successfully saved.</p>
            </div>
        );
    }
}

export { Saved };