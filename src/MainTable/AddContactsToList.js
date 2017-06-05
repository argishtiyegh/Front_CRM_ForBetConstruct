import React, { Component } from 'react';
import '../StyleSheet/Contacts.css';
import call from '../helpers/call.js';

class AddContactsToList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mailingListsDB: [],
            EmailListId: null,
            disabling: true
        };
        this.closePopUp = this.closePopUp.bind(this);
        this.SendToExistingList = this.SendToExistingList.bind(this);
        this.getEmailListId = this.getEmailListId.bind(this);
        //  this.renderMail = this.renderMail.bind(this);
    }

    componentDidMount() {
        call('api/emaillists/', "GET").then((response) => {
            this.setState({ mailingListsDB: response })
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
        if (e.target.value != "Choose Template") {
            this.setState({ disabling: false });
        }
        else {
            this.setState({ disabling: true });
        }
    }

    SendToExistingList(addToData) {
        addToData = {
            "EmailListID": this.state.EmailListId,
            "Guids": this.props.guidsList
        };
        let that = this;
        console.log(addToData)
        call('api/emaillists/add', 'PUT', addToData).then(function (response) {
            console.log(response)
        })
        this.closePopUp()
    }
    render() {
        return (
            <div>
                <div className="select_email_list">
                    <select className="select_template" onChange={this.getEmailListId}>
                        <option defaultValue="Choose Template">Choose Template</option>
                        {this.state.mailingListsDB.map(this.renderEmailList)}
                    </select>
                    <div>
                        <button className="add_to_list listadd" disabled={this.state.disabling} onClick={this.SendToExistingList}>ADD</button>
                        <button className="add_to_list_del listadd" onClick={this.closePopUp}>CLOSE</button>
                    </div>
                </div>
            </div>
        )
    }
}

export { AddContactsToList };
