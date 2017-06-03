import React, { Component } from 'react';
import call from '../helpers/call.js';
import '../StyleSheet/Contacts.css';



class EmailsTable extends Component {
    constructor(props) {
        super(props);

    }

    renderBody(value, key) {

        return (
            <tr key={key} className="table_row">
                <td className="table_data checkbox"><input type="checkbox" /></td>
                <td className="table_data">{key += 1}</td>
                <td className="table_data">{value["Full Name"]}</td>
                <td className="table_data">{value["Company Name"]}</td>
                <td className="table_data">{value.Position}</td>
                <td className="table_data">{value.Country}</td>
                <td className="table_data">{value.Email}</td>
                <td className="table_data"><button id={key} className="edit_delete del">Edit</button></td>
                <td className="table_data"><button id={key} className="edit_delete del">Delete</button></td>
            </tr>)

    }

    renderContacts() {
        return (

            <table className="all_contacts mailList">
                <thead>
                    <tr>
                        <th className="table_data table_head_data">SELECT</th>
                        <th className="table_data table_head_data">NUMBER</th>
                        <th className="table_data table_head_data">FULL NAME</th>
                        <th className="table_data table_head_data">COMPANY NAME</th>
                        <th className="table_data table_head_data">POSITION</th>
                        <th className="table_data table_head_data">COUNTRY</th>
                        <th className="table_data table_head_data">EMAIL</th>
                        <th className="table_data table_head_data">EDIT</th>
                        <th className="table_data table_head_data">DELETE</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.contacts.map(this.renderBody)}
                </tbody>
            </table>
        )

    }

    render() {

        return (this.renderContacts())
    }
}
export { EmailsTable }