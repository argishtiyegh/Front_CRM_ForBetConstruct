import React, { Component } from 'react';
import call from '../helpers/call.js';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import '../StyleSheet/Contacts.css';

class EmailsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guId: [],
            disabling: true
        };
        this.mapList = this.mapList.bind(this);
        this.checkBoxDel = this.checkBoxDel.bind(this);
        this.deletContact = this.deletContact.bind(this);
        this.closeList = this.closeList.bind(this);
    }

    checkBoxDel(e) {
        if (e.target.checked) {
            this.state.guId.push(this.props.datas[e.target.id].GuID);
        }
        else {
            let index = this.state.guId.indexOf(this.props.datas[e.target.id].GuID);
            if (index >= 0) {
                this.state.guId.splice(index, 1);
            }
        }
        if (this.state.guId.length != 0) {
            this.setState({ disabling: false });
        }
        else {
            this.setState({ disabling: true });
        }
         
    }

    deletContact(deleteData) {
        deleteData = {
            "EmailListID": this.props.listID,
            "Guids": this.state.guId
        };
        deleteData = JSON.stringify(deleteData)
        console.log(deleteData);
        let that = this;
        call("api/emaillists", "DELETE", deleteData).then(function (response) {
            console.log(deleteData)

            if (response.error) {
                console.log(deleteData);
                console.log(response.message);
                call('api/emaillists/' + that.props.listID, 'GET').then(response => { response.error ? alert(response.message) : that.props.updateContacts(response.Contacts)});            
            }
            that.setState({guId: []});
        })
       
    }

    mapList(value, key) {
        return (
            <tr key={key} className="table_row">
                <td className="table_data"><input type="checkbox" id={key} onChange={this.checkBoxDel} /></td>
                <td className="table_data">{value["Full Name"]}</td>
                <td className="table_data">{value["Company Name"]}</td>
                <td className="table_data">{value.Position}</td>
                <td className="table_data">{value.Country}</td>
                <td className="table_data">{value.Email}</td>
            </tr>
        )
    }

    closeList() {
        this.props.updateContacts([]);
    }
    render() {
        if (this.props.datas.length > 0) {
            return (
                <div>
                    <button onClick={this.closeList} className="edit_delete closelist">Close</button>
                    <table className="all_contacts">
                        <thead>
                            <tr className="table_row"><th className="table_data">Select</th>
                                <th className="table_data">Full Name</th>
                                <th className="table_data">Company Name</th>
                                <th className="table_data">Position</th>
                                <th className="table_data">Country</th>
                                <th className="table_data">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.datas.map(this.mapList)}
                        </tbody>
                    </table>
                    <button disabled={this.state.disabling} onClick={this.deletContact} className="edit_delete del">Delete</button>
                </div>
            )
        }
        else {
            return (
                <table>
                    <tbody>
                        {this.props.datas.map(this.mapList)}
                    </tbody>
                </table>
            )
        }
    }
}

export { EmailsTable };

