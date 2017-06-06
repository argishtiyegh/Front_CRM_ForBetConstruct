import React, { Component } from 'react';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import { MessageFailed } from '../exceptionHandling/MessageFailed.js';
import call from '../helpers/call.js';
import '../StyleSheet/Contacts.css';

class DeleteMultiple extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            failed: false
        };
        this.deleteMultipleSend = this.deleteMultipleSend.bind(this);
        this.failedMsg = this.failedMsg.bind(this);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }) }.bind(this), 2500);
    }

    deleteMultipleSend(deleteData) {
        this.setState({ loading: true });
        deleteData = this.props.guidsList;
        deleteData = JSON.stringify(deleteData);
        console.log(deleteData);

        let that = this;
        call('api/contacts', 'DELETE', deleteData).then(function (response) {
            console.log(that);
            if (response.error) {
                call('api/contacts', 'GET').then(response => { response.error ? response.message : that.props.change(response), that.setState({ loading: false }) });
                console.log(this);
            }
            else {
                that.setState({ loading: false });
            }
            that.props.closePopUp(true);
        })
    }

    render() {
        return (
            <div className="delete_mode">
                <h3 className="del_header">Are you sure you want to delete these contacts ?</h3>
                <div className="multiplePopUp">
                    <button className="multi_delete" onClick={this.deleteMultipleSend}>YES</button>
                    <button className="multi_delete" onClick={this.props.closePopUp}>NO</button>
                </div>
                {this.state.loading && <LoadingGIF />}
                {this.state.failed && <MessageFailed />}
            </div>
        )
    }
}

export { DeleteMultiple };