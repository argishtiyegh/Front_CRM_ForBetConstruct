import React, { Component } from 'react';
import call from '../helpers/call.js';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import { MessageSent } from '../exceptionHandling/MessageSent.js';
import { MessageFailed } from '../exceptionHandling/MessageFailed.js';
import '../StyleSheet/Contacts.css';

class SendEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templatesDb: [],
            templateID: null,
            disabling: true,
            loading: false,
            sent: false,
            failed: false
        };
        this.renderTemplate = this.renderTemplate.bind(this);
        this.close = this.close.bind(this);
        this.getTemplateID = this.getTemplateID.bind(this);
        this.sendEMailWithTemplate = this.sendEMailWithTemplate.bind(this);
        this.sentMsg = this.sentMsg.bind(this);
        this.failedMsg = this.failedMsg.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        call('api/template/', "GET").then(response => { response.error ? response.message : this.setState({ templatesDb: response }), this.setState({ loading: false }) });
        console.log(this.state.templatesDb);
    }

    //Close Contact's Table
    close() {
        this.props.changeSend(true);
    }

    getTemplateID(event) {
        let templateID = event.target.value;
        this.setState({ templateID: templateID });
        console.log(this.props.EmailListID);
        if (event.target.value != "Choose Template") {
            this.setState({ disabling: false });
        }
        else {
            this.setState({ disabling: true });
        }
    }

    sentMsg() {
        this.setState({ sent: true });
        setTimeout(function () { this.setState({ sent: false }), this.close() }.bind(this), 2500);
        console.log(this.state.sent);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }), this.close() }.bind(this), 2500);
    }

    sendEMailWithTemplate(templateID) {
        this.setState({ loading: true });
        console.log(this.props.EmailListID);
        templateID = parseInt(this.state.templateID);
        console.log(templateID);

        let that = this;
        return fetch("http://crmbetd.azurewebsites.net/api/sendemail/list?id=" + this.props.EmailListID + "&template=" + templateID, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
            .then(function (response) {
                if (!response.ok) {
                    that.setState({ loading: false });
                    that.setState({ sent: false });
                    that.failedMsg();
                    console.log(response);
                } else {
                    that.setState({ failed: false });
                    that.setState({ loading: false });
                    that.sentMsg();
                }
            });
    }

    renderTemplate(value, key) {
        return (<option value={value.TemplateId} key={key} id={key}>{value.TemplateName}</option>)
    }

    render() {
        return (
            <div className="send_email_template">
                <select className="select_template" onChange={this.getTemplateID}>
                    <option defaultValue="Choose Template" >Choose Template</option>
                    {this.state.templatesDb.map(this.renderTemplate)}
                </select>
                <div>
                    <button className="edit_delete send_template" disabled={this.state.disabling} onClick={this.sendEMailWithTemplate}>SEND</button>
                    <button className="edit_delete send_template" onClick={this.close}> CLOSE </button>
                </div>
                {this.state.loading && <LoadingGIF />}
                {this.state.sent && <MessageSent />}
                {this.state.failed && <MessageFailed />}
            </div>
        )
    }
}

export { SendEmail };
