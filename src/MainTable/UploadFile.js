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
            failed: false,
            upload: true,
        };
        this.UploadData = this.UploadData.bind(this);
        this.failedMsg = this.failedMsg.bind(this);
        this.uploadHandle = this.uploadHandle.bind(this);
        this.close = this.close.bind(this);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }) }.bind(this), 2500);
    }

    uploadHandle() {
        this.setState({ upload: false })
    }
    close() {
        this.setState({ upload: !this.state.upload })
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
        if (this.state.upload) {
            return (<button className="upload" onClick={this.uploadHandle}> UPLOAD </button>)
        }
        else {
            return (
                <div className="edit_mode_form">
                    <form encType="multipart/form-data" className="edit_form_upl" onSubmit={this.UploadData}>
                        <input name="data" size="40" type="file" className="choose"></input>
                        <div className="buttons_up">
                            <button className="main_buttons main_buttons_up" onClick={this.close}>CLOSE</button>
                            <input type="submit" className="main_buttons main_buttons_up" value="UPLOAD"></input>
                        </div>
                    </form>
                    {this.state.loading && <LoadingGIF />}
                    {this.state.failed && <MessageFailed />}
                </div>
            )
        }

    }
}
export { UploadFile };