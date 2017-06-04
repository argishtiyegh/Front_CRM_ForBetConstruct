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
            templateID: null
        };
        this.renderTemplate = this.renderTemplate.bind(this);
        this.close = this.close.bind(this);
        this.getTemplateID = this.getTemplateID.bind(this);
        this.sendEMailWithTemplate = this.sendEMailWithTemplate.bind(this);
    }
    componentDidMount() {
        call('api/template/', "GET").then((response) => {
            this.setState({ templatesDb: response })
        });
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
                    {this.state.templatesDb.map(this.renderTemplate)}
                    <option disabled selected>Choose Template</option>
                </select>
                <div>
                    <button className="edit_delete send_template" onClick={this.sendEMailWithTemplate}>SEND</button>
                    <button className="edit_delete send_template" onClick={this.close}> CLOSE </button>
                </div>
            </div>
        )
    }
}
export { SendEmail }
