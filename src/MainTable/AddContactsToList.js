import React, { Component } from 'react';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import { Added } from '../exceptionHandling/Added.js';
import { MessageFailed } from '../exceptionHandling/MessageFailed.js';
import '../StyleSheet/Contacts.css';
import call from '../helpers/call.js';

class AddContactsToList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mailingListsDB: [],
            EmailListId: null,
            disabling: true,
            loading: false,
            added: false
        };
        this.closePopUp = this.closePopUp.bind(this);
        this.SendToExistingList = this.SendToExistingList.bind(this);
        this.getEmailListId = this.getEmailListId.bind(this);
        this.addedMsg = this.addedMsg.bind(this);
        this.failedMsg = this.failedMsg.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        call('api/emaillists/', "GET").then((response) => {
            this.setState({ mailingListsDB: response }), this.setState({ loading: false });
        });
    }
    renderEmailList(value, key) {
        return (<option value={value.EmailListID} key={key} id={key}>{value.EmailListName}</option>)
    }

    closePopUp() {
        this.props.closePopUp(true);
    }

    getEmailListId(e) {
        this.setState({ EmailListId: e.target.value });
        if (e.target.value != "Choose Email List") {
            this.setState({ disabling: false });
        }
        else {
            this.setState({ disabling: true });
        }
    }

    addedMsg() {
        this.setState({ added: true });
        setTimeout(function () { this.setState({ added: false }), this.closePopUp() }.bind(this), 2500);
        console.log(this.state.sent);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }), this.closePopUp() }.bind(this), 2500);
    }

    SendToExistingList(addToData) {
        this.setState({ loading: true });
        addToData = {
            "EmailListID": this.state.EmailListId,
            "Guids": this.props.guidsList
        };
        let that = this;
        console.log(addToData);
        return fetch('http://crmbetd.azurewebsites.net/api/emaillists/add', {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(addToData),
        })
            .then(function (response) {
                if (!response.ok) {
                    that.setState({ loading: false });
                    that.setState({ added: false });
                    that.failedMsg();
                } else {
                    that.setState({ failed: false });
                    that.setState({ loading: false });
                    that.addedMsg();
                }
            });
    }

    render() {
        return (
            <div>
                <div className="select_email_list">
                    <select className="select_template" onChange={this.getEmailListId}>
                        <option defaultValue="Choose Email List">Choose Email List</option>
                        {this.state.mailingListsDB.map(this.renderEmailList)}
                    </select>
                    <div>
                        <button className="add_to_list listadd" disabled={this.state.disabling} onClick={this.SendToExistingList}>ADD</button>
                        <button className="add_to_list_del listadd" onClick={this.closePopUp}>CLOSE</button>
                    </div>
                </div>
                {this.state.loading && <LoadingGIF />}
                {this.state.added && <Added />}
                {this.state.failed && <MessageFailed />}
            </div>
        )
    }
}

export { AddContactsToList };
