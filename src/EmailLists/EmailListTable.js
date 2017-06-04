import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import call from '../helpers/call.js';
import { HeaderMail } from './HeaderMail';
import { EmailsTable } from './EmailsTable';
import '../StyleSheet/Contacts.css';

function TableHead(props) {
    return (<thead>
        <tr>
            <th className="table_data table_head_data">SELECT</th>
            <th className="table_data table_head_data">NUMBER</th>
            <th className="table_data table_head_data">NAME</th>
            <th className="table_data table_head_data">EDIT</th>
            <th className="table_data table_head_data">VIEW LIST</th>
            <th className="table_data table_head_data">DELETE</th>
        </tr>
    </thead>)
}
class EmailListTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbMailingList: [],
            templatesDb: [],
            contactViewMode: false
        };
        this.changeDbMailingList = this.changeDbMailingList.bind(this);
        this.changeContactView = this.changeContactView.bind(this);
    }
    componentDidMount() {
        call('api/emaillists', "GET").then((response) => {
            this.setState({ dbMailingList: response })
            console.log(response);
        }
        );
        call('api/template/', "GET").then((response) => {
            this.setState({ templatesDb: response })
            console.log(response);
        }
        );
    }
    changeContactView(value) {

        this.setState({ contactViewMode: value })
    }

    changeDbMailingList(value) {
        this.setState({ dbMailingList: value })
    }

    render() {
        if (this.state.rend) {
            return (
                <div>
                    <div>
                        <p className="count">Number of Mailing Lists: {this.state.dbMailingList.length}</p>
                        <table className="all_contacts mailList">
                            <TableHead />
                            <HeaderMail
                                dbase={this.state.dbMailingList}
                                changeDB={this.changeDbMailingList} >
                            </HeaderMail>
                        </table>
                        <button className="main_buttons button_send">SEND EMAIL</button>
                        <button className="edit_delete list_buttons list_view" disabled={this.state.disabl} onClick={this.viewTable}>{this.value}</button>
                    </div>
                    <EmailsTable />
                </div>
            )
        }
        else {
            return (
                <div>
                    <div>
                        <p className="count">Number of Mailing Lists: {this.state.dbMailingList.length}</p>
                        <table className="all_contacts mailList">
                            <TableHead />
                            <HeaderMail
                                changeDB={this.changeDbMailingList}
                                dbase={this.state.dbMailingList}>
                            </HeaderMail>
                        </table>
                        <button className="main_buttons button_send">SEND EMAIL</button>
                        <button className="edit_delete list_buttons list_view">VIEW LIST</button>
                    </div>
                </div>
            )
        }
    }
}

export { EmailListTable };