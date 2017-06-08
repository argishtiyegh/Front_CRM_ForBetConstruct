import React, { Component } from 'react';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import { MessageFailed } from '../exceptionHandling/MessageFailed.js';
import '../StyleSheet/Contacts.css';
import call from '../helpers/call.js';

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            failed: false
        };
        this.UploadData = this.UploadData.bind(this);
        this.failedMsg = this.failedMsg.bind(this);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }) }.bind(this), 2500);
    }

    UploadData(event) {
        this.setState({ loading: true });
        event.preventDefault();
        let data = new FormData();
        let fileData = document.querySelector('input[type="file"]').files[0];
        data.append("data", fileData);
        let that = this;
        fetch("http://crmbetd.azurewebsites.net/api/contacts/upload", {
            method: "POST",
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
            body: data
        }).then(function (res) {
            if (res.ok) {
                call('api/contacts', 'GET').then(response => { response.error ? response.message : that.props.change(response); that.setState({ loading: false }) });
            }
            else {
                that.setState({ loading: false });
                that.failedMsg();
            }
        })
    }

    render() {
        return (
            <div className="uploadCSV">
                <form encType="multipart/form-data" onSubmit={this.UploadData}>
                    <input name="data" size="40" type="file" className="choose"></input>
                    <input type="submit" className="edit_delete choose"></input>
                </form>
                {this.state.loading && <LoadingGIF />}
                {this.state.failed && <MessageFailed />}
            </div>
        )
    }
}
export { UploadFile };