import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SendEmail } from './SendEmail';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import { MessageSent } from '../exceptionHandling/MessageSent.js';
import { MessageFailed } from '../exceptionHandling/MessageFailed.js';
import { Deleted } from '../exceptionHandling/Deleted.js';
import { Saved } from '../exceptionHandling/Saved.js';
import call from '../helpers/call.js';

class HeaderMail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listID: "",
            send: true, emaillists: [],
            EmailListID: null,
            templateData: [],
            mailDb: "",
            editMode: false,
            disabling: "",
            deletes: true,
            edit: true,
            delete: true,
            listIDForDel: "",
            loading: false,
            deleted: false,
            saved: false
        };
        this.renderBody = this.renderBody.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleStateEdit = this.handleStateEdit.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.closeEditMode = this.closeEditMode.bind(this);
        this.getContacts = this.getContacts.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.changeSend = this.changeSend.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.closeDelete = this.closeDelete.bind(this);
        this.deletedMsg = this.deletedMsg.bind(this);
        this.failedMsg = this.failedMsg.bind(this);
        this.savedMsg = this.savedMsg.bind(this);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }) ; this.closeDelete(); }.bind(this), 2500);
    }

    deletedMsg() {
        this.setState({ deleted: true });
        setTimeout(function () { this.setState({ deleted: false }) }.bind(this), 2500);
    }

    savedMsg() {
        this.setState({ saved: true });
        setTimeout(function () { this.setState({ saved: false }) ; this.closeDelete(); }.bind(this), 2500);
    }

    getContacts(event) {
        this.setState({ loading: true });
        let index = this.props.dbase[event.target.id].EmailListID;
        this.props.getID(index);
        call('api/emaillists/' + index, 'GET')
            .then(response => { response.error ? response.message : this.props.changeContacts(response.Contacts), this.setState({ loading: false }); });
        this.props.header(this.props.dbase[event.target.id].EmailListName);
    }

    changeSend(value) {
        this.setState({ send: value });
    }

    handleDelete(e) {
        this.setState({ delete: false });
        this.state.listIDForDel = this.props.dbase[parseInt(e.target.id)].EmailListID;
    }

    deleteList(e, deleteID) {
        e.preventDefault();
        this.setState({ loading: true });
        this.setState({ deletes: !this.state.deletes });
        if (this.state.deletes) {
            deleteID = this.state.listIDForDel;
            this.setState({ deletes: this.state.deletes });
        };
        let that = this;
        return fetch('http://crmbetd.azurewebsites.net/api/emaillists?id=' + deleteID, {
            method: "DELETE",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response.ok) {
                return fetch('http://crmbetd.azurewebsites.net/api/emaillists', {
                    method: "GET",
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },

                }).then(function (response) {
                    if (response.ok) {
                        that.setState({ loading: false });
                        that.deletedMsg();
                        that.closeDelete();
                        return response.json();
                    }
                    else {
                        that.setState({ loading: false });
                        that.failedMsg();
                    }
                }).then(function (response) {
                    that.props.changeDB(response);
                })
            }
            else {
                that.setState({ loading: false });
                that.failedMsg();
            }
        })
    }

    handleSend(e) {
        this.setState({ send: !this.state.send });
        let EmailListID = this.props.dbase[e.target.id].EmailListID;
        this.setState({ EmailListID: EmailListID });
    }

    handleStateEdit(e) {
        this.setState({ edit: !this.state.edit });
        this.editID = this.props.dbase[parseInt(e.target.id)].EmailListID;
        this.editName = this.props.dbase[parseInt(e.target.id)].EmailListName;
        console.log(this.props.dbase[parseInt(e.target.id)].EmailListID);
    }

    saveEdits(event, savedData) {
        this.setState({ loading: true });
        event.preventDefault();
        savedData = {
            "Guids": null,
            "EmailListName": this.refs.listname.value,
            "EmailListID": this.editID
        }
        console.log(this.refs.listname.value);
        let that = this;
        return fetch('http://crmbetd.azurewebsites.net/api/emaillists', {
            method: "PUT",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(savedData)
        }).then(function (response) {
            if (response.ok) {
                return fetch('http://crmbetd.azurewebsites.net/api/emaillists', {
                    method: "GET",
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },

                }).then(function (response) {
                    if (response.ok) {
                        that.setState({ loading: false });
                        that.savedMsg();
                        that.closeEditMode();
                        return response.json();
                    }
                    else {
                        that.setState({ loading: false });
                        that.failedMsg();
                    }
                }).then(function (response) {
                    that.props.changeDB(response)
                })
            }
            else {
                that.setState({ loading: false });
                that.failedMsg();
            }
        })
    }

    closeDelete() {
        this.setState({ delete: true });
    }

    closeEditMode() {
        this.setState({ edit: true });
    }

    handleEdit(key) {
        if (!this.state.edit) {
            return (
                <div>
                    <div className="edit_mode">
                        <form className="edit_form" onSubmit={this.saveEdits}>
                            <h3 className="add_new_header">Edit {this.editName} Mailing List Name</h3>
                            <input className="maillist_input" ref="listname" defaultValue={this.editName} required type="text" placeholder="Mailing List Name" /><br />
                            <button className="main_buttons_list" onClick={this.closeEditMode}>Close</button>
                            <button className="main_buttons_list" type="submit">Save</button>
                        </form>
                    </div>
                    <button id={key} className="edit_delete list_buttons" onClick={this.handleStateEdit}>EDIT</button>
                </div>
            )
        }
        else {
            return (<button id={key} className="edit_delete list_buttons" onClick={this.handleStateEdit}>EDIT</button>
            )
        }
    }

    deletingRender(key) {
        if (!this.state.delete) {
            return (
                <div>
                    <div className="edit_mode">
                        <form className="edit_form" onSubmit={this.deleteList}>
                            <h3 className="add_new_header">Are you sure you want to delete this Mailing List ?</h3>
                            <button className="main_buttons_list" onClick={this.closeDelete}>No</button>
                            <button type="submit" className="main_buttons_list">Yes</button>
                        </form>
                    </div>
                    <button className="edit_delete del list_buttons" onClick={this.handleDelete} id={key}>DELETE</button>
                </div>
            )
        }
        else {
            return (<button className="edit_delete del list_buttons" onClick={this.handleDelete} id={key}>DELETE</button>)
        }
    }

    renderBody(value, key) {
        const data = this.state.emaillists
        return (
            <tr className="table_row" key={key} id={key}>
                <td className="table_data">{value.EmailListName}</td>
                <td className="table_data table_head_data">{this.handleEdit(key)}</td>
                <td className="table_data table_head_data"><button id={key} className=" view_list" onClick={this.getContacts}>VIEW LIST</button></td>
                <td className="table_data table_head_data">{this.deletingRender(key)}</td>
                <td className="table_data table_head_data">{this.state.send ? (<button id={key} className="edit_delete send_email" onClick={this.handleSend} >SEND EMAIL</button>) : (<div><button id={key} className="edit_delete send_email" onClick={this.handleSend} >SEND EMAIL</button><SendEmail EmailListID={this.state.EmailListID} changeSend={this.changeSend} /></div>)}</td>
            </tr>)
    }

    render() {
        return (
            <tbody>
                {this.props.dbase.map(this.renderBody)}
                <tr>
                    <td>{this.state.loading && <LoadingGIF />}</td>
                    <td>{this.state.failed && <MessageFailed />}</td>
                    <td>{this.state.deleted && <Deleted />}</td>
                    <td>{this.state.saved && <Saved />}</td>
                </tr>
            </tbody>
        )
    }
}

export { HeaderMail };