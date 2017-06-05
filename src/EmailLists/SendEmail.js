import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import call from '../helpers/call.js';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import '../StyleSheet/Contacts.css';

class SendEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templatesDb: [],
            templateID: null,
            disabling: true,
            loading: false
        };
        this.renderTemplate = this.renderTemplate.bind(this);
        this.close = this.close.bind(this);
        this.getTemplateID = this.getTemplateID.bind(this);
        this.sendEMailWithTemplate = this.sendEMailWithTemplate.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        call('api/template/', "GET").then(response => { response.error ? alert(response.message) : this.setState({ templatesDb: response }), this.setState({ loading: false }) });
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

    sendEMailWithTemplate(templateID) {
        console.log(this.props.EmailListID);
        templateID = parseInt(this.state.templateID);
        console.log(templateID);
        call("api/sendemail/list?id=" + this.props.EmailListID + "&template=" + templateID, "POST").then(function (response) {
            if (response.error) {
                console.log("done");
            }
        })
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
            </div>
        )
    }
}
export { SendEmail };
