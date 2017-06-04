import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import call from '../helpers/call.js';


class HeaderMail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checks: true,
            dbContactsEmail: [],
            ContactsDB: [],
            mailDb: "",
            editMode: false,
            disabling: "",
            deletes: true,
            edit: true
        };
        //  this.deleteMailList = this.deleteMailList.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.handleDel = this.handleDel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleStateEdit = this.handleStateEdit.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.closeEditMode = this.closeEditMode.bind(this);
        //   this.contactID=this.state.contactID;
        this.getBoxId = this.getBoxId.bind(this);
    }

    getBoxId(e) {
        if (this.state.checks) {
            this.idscontacts = this.props.dbase[e.target.id].EmailListID;
            call('api/emaillists/' + this.idscontacts, "GET").then((response) => {
                this.setState({ dbContactsEmail: response, ContactsDB: response });
            })
            console.log(this.state.dbContactsEmail);
        }
    }


    handleDel(e, deleteID) {
        this.setState({ deletes: !this.state.deletes });
        if (this.state.deletes) {
            deleteID = this.props.dbase[parseInt(e.target.id)].EmailListID;
            this.setState({ deletes: this.state.deletes });
        };
        let that = this;
        call('api/emaillists?id=' + deleteID, 'DELETE').then(function (response) {
            console.log(that);
            if (response.error) {
                call('api/emaillists', 'GET').then(response => { response.error ? alert(response.message) : that.props.changeDB(response) })
                console.log(this);
            }
        })
    }

    handleStateEdit(e) {
        this.setState({ edit: !this.state.edit });
        this.editID = this.props.dbase[parseInt(e.target.id)].EmailListID;
        this.editName = this.props.dbase[parseInt(e.target.id)].EmailListName;
        console.log(this.props.dbase[parseInt(e.target.id)].EmailListID);
    }

    saveEdits(event, savedData) {
        event.preventDefault();
        savedData = {
            "Guids": null,
            "EmailListName": this.refs.listname.value,
            "EmailListID": this.editID
        };
        console.log(this.refs.listname.value);
        let that = this;
        call('api/emaillists', 'PUT', savedData).then(function (response) {
            if (response.error) {
                call('api/emaillists', 'GET').then(response => { response.error ? alert(response.message) : that.props.changeDB(response) })
            }
            else {
                alert("Error Request")
            }
            that.closeEditMode()
        })
    }

    closeEditMode() {
        this.setState({ edit: true })
    }

    handleEdit(key) {
        if (!this.state.edit) {
            return (
                <div className="edit_mode">
                    <form className="edit_form" onSubmit={this.saveEdits}>
                        <h3 className="add_new_header">Edit {this.editName} Mailing List Name</h3>
                        <input className="list_input" ref="listname" defaultValue={this.editName} required type="text" placeholder="Mailing List Name" /><br />
                        <button className="main_buttons" onClick={this.closeEditMode}>Close</button>
                        <button className="main_buttons" type="submit"  >Save</button>
                    </form>
                </div>
            )
        }
        else {
            return (<button id={key} className="edit_delete list_buttons" onClick={this.handleStateEdit}>EDIT</button>)
        }
    }

    renderBody(value, key) {
        return (
            <tr className="table_row" key={key} id={key}>
                <td className="table_data table_head_data"><input type="checkbox" name="ids" id={key} /></td>
                <td className="table_data table_head_data">{key + 1}</td>
                <td className="table_data table_head_data">{value.EmailListName}</td>
                <td className="table_data table_head_data">{this.handleEdit(key)}</td>
                <td className="table_data table_head_data"><button id={key} className="edit_delete del list_buttons" onClick={this.getBoxId}>VIEW LIST</button></td>
                <td className="table_data table_head_data"><button id={key} className="edit_delete del list_buttons" onClick={this.handleDel}>DELETE</button></td>
            </tr>)
    }

    render() {
        return (
            <tbody>
                {this.props.dbase.map(this.renderBody)}
            </tbody>
        )
    }
}

export { HeaderMail };