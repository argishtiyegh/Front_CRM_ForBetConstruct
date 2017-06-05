import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import call from '../helpers/call.js';
import { HeaderMail } from './HeaderMail';
import { EmailsTable } from './EmailsTable';
import { SendEmail } from './SendEmail';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import '../StyleSheet/Contacts.css';

function TableHead(props) {
    return (<thead>
        <tr>
            <th className="table_data">NAME</th>
            <th className="table_data">EDIT</th>
            <th className="table_data">VIEW LIST</th>
            <th className="table_data">DELETE</th>
            <th className="table_data">SEND EMAIL</th>
        </tr>
    </thead>)
}

class EmailListTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listID: "",
            message: "Click on VIEW LIST button to see contact's list",
            header: "",
            dbMailingList: [],
            templatesDb: [],
            contacts: [],
            contactViewMode: false,
            loading: false
        };
        this.changeDbMailingList = this.changeDbMailingList.bind(this);
        this.changeContactView = this.changeContactView.bind(this);
        this.changeContactsState = this.changeContactsState.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getID = this.getID.bind(this);
        this.updateContacts = this.updateContacts.bind(this);
    }

    updateContacts(value) {
        this.setState({ contacts: value });
    }

    componentDidMount() {
        call('api/emaillists', "GET").then(response => {
            this.setState({ dbMailingList: response });
            console.log(response);
        });
        call('api/template/', "GET").then(response => {
            this.setState({ templatesDb: response });
            console.log(response);
        }
        );
    }
    getHeader(value) {
        this.setState({ header: value });
    }

    getID(value) {
        this.setState({ listID: value });
    }

    changeContactsState(newvalue) {
        this.setState({ contacts: newvalue })
        if (this.state.contacts.length != 0) {
            this.setState({ message: "Email List's Contacts" });
        }
        else {
            this.setState({ message: "Email List is Empty" });
        }
    }

    changeContactView(value) {
        this.setState({ contactViewMode: value });
    }

    changeDbMailingList(value) {
        this.setState({ dbMailingList: value });
    }

    render() {
        return (
            <div className="emailListSection">
                <h3 className="contacts_status"> {this.state.header} {this.state.message}</h3>
                <EmailsTable 
                    updateContacts={this.updateContacts}
                    listID={this.state.listID}
                    dbase={this.state.dbMailingList}
                    mes={this.message}
                    datas={this.state.contacts} />
                <div>
                    <p className="count">Number of Mailing Lists: {this.state.dbMailingList.length}</p>
                    <div className="scroll">
                    <table className="all_contacts mailList table">
                        <TableHead />
                        <HeaderMail
                            getID={this.getID}
                            header={this.getHeader}
                            changeContacts={this.changeContactsState}
                            dbase={this.state.dbMailingList}
                            changeDB={this.changeDbMailingList} >
                        </HeaderMail>
                    </table>
                    </div>
                </div>
            </div>
        )
    }
}
export { EmailListTable };