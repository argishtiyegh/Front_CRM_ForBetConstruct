import React, { Component } from 'react';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import { Deleted } from '../exceptionHandling/Deleted.js';
import { MessageFailed } from '../exceptionHandling/MessageFailed.js';
import '../StyleSheet/Contacts.css';

class EmailsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guId: [],
            disabling: true,
            delete: true,
            loading: false,
            deleted: false,
            resp: ""
        };
        this.mapList = this.mapList.bind(this);
        this.checkBoxDel = this.checkBoxDel.bind(this);
        this.deletContact = this.deletContact.bind(this);
        this.closeList = this.closeList.bind(this);
        this.closeDel = this.closeDel.bind(this);
        this.handleDel = this.handleDel.bind(this);
        this.deletingRender = this.deletingRender.bind(this);
        this.deletedMsg = this.deletedMsg.bind(this);
        this.failedMsg = this.failedMsg.bind(this);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }) }.bind(this), 2500);
    }

    deletedMsg() {
        this.setState({ deleted: true });
        setTimeout(function () { this.setState({ deleted: false }); this.closeDel(); this.props.updateContacts(this.state.resp) }.bind(this), 2500);
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
        if (this.state.guId.length !== 0) {
            this.setState({ disabling: false });
        }
        else {
            this.setState({ disabling: true });
        }
    }

    handleDel() {
        this.setState({ delete: false });
    }

    closeDel() {
        this.setState({ delete: true });
    }

    deletingRender() {
        if (!this.state.delete) {
            return (
                <div>
                    <div className="edit_mode">
                        <form className="edit_form" onSubmit={this.deletContact}>
                            <h3 className="add_new_header">Are you sure you want to delete this contact ?</h3>
                            <button className="main_buttons_list" onClick={this.closeDel}>No</button>
                            <button type="submit" className="main_buttons_list">Yes</button>
                        </form>
                        {this.state.loading && <LoadingGIF />}
                    </div>
                    <button disabled={this.state.disabling} className="edit_delete del delList list_buttons" onClick={this.handleDel}>Delete</button>
                </div>
            )
        }
        else {
            return (<button disabled={this.state.disabling} className="edit_delete del delList list_buttons" onClick={this.handleDel}>Delete</button>)
        }
    }

    deletContact(event, deleteData) {
        this.setState({ loading: true });
        event.preventDefault();
        deleteData = {
            "EmailListID": this.props.listID,
            "Guids": this.state.guId
        };
        deleteData = JSON.stringify(deleteData);
        let that = this;

        return fetch('http://crmbetd.azurewebsites.net/api/emaillists', {
            method: "DELETE",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: deleteData
        }).then(function (response) {
            if (response.ok) {
                return fetch('http://crmbetd.azurewebsites.net/api/emaillists/' + that.props.listID, {
                    method: "GET",
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },

                }).then(function (response) {
                    if (response.ok) {
                        that.setState({ loading: false });
                        that.deletedMsg();
                        that.closeDel();
                        return response.json();
                    }
                    else {
                        that.setState({ loading: false });
                        that.failedMsg();
                    }
                }).then(function (response) {
                    that.setState({ resp: response.Contacts });
                })
            }
            else {
                that.setState({ loading: false });
                that.failedMsg();
            }
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
        this.props.changeHeadMessage("Click on VIEW LIST button to see contact's list");
        this.props.header("");
    }

    render() {
        if (this.props.datas.length > 0) {
            return (
                <div className="scroll_list">
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
                    {this.deletingRender()}
                    {this.state.loading && <LoadingGIF />}
                    {this.state.failed && <MessageFailed />}
                    {this.state.deleted && <Deleted />}
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

