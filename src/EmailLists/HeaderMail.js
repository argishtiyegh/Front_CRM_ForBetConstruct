import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {SendEmail} from './SendEmail';
import call from '../helpers/call.js';


class HeaderMail extends Component {
    constructor(props) {
        super(props);
        this.state = { listID: "" , send: true, emaillists: [],EmailListID: null, templateData: [], mailDb: "", editMode: false, disabling: "", deletes: true, edit: true };
        //  this.deleteMailList = this.deleteMailList.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.handleDel = this.handleDel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleStateEdit = this.handleStateEdit.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.closeEditMode = this.closeEditMode.bind(this);
        this.getContacts = this.getContacts.bind(this);
        this.handleSend=this.handleSend.bind(this);
        this.changeSend=this.changeSend.bind(this);


        // this.getBoxId = this.getBoxId.bind(this);
    }


    getContacts(event) {
        
            let index = this.props.dbase[event.target.id].EmailListID;
            this.props.getID(index)
            call('api/emaillists/' + index, 'GET')
                .then(response => { response.error ? alert(response.message) : this.props.changeContacts(response.Contacts) });
                this.props.header(this.props.dbase[event.target.id].EmailListName)
               
    }


    changeSend(value){
        this.setState({send: value})
    }


    handleDel(e, deleteID) {

        this.setState({ deletes: !this.state.deletes })

        if (this.state.deletes) {
            deleteID = this.props.dbase[parseInt(e.target.id)].EmailListID;
            this.setState({ deletes: this.state.deletes })
        };
        let that = this;
        call('api/emaillists?id=' + deleteID, 'DELETE').then(function (response) {
            console.log(that)
            if (response.error) {
                call('api/emaillists', 'GET').then(response => { response.error ? alert(response.message) : that.props.changeDB(response) })
                console.log(this)
            }
            else {
                alert("Error Request")
            }
        })

    }

    handleSend(e){
        this.setState({send: !this.state.send});
        let EmailListID = this.props.dbase[e.target.id].EmailListID;
        this.setState({EmailListID: EmailListID})

    }


    handleStateEdit(e) {
        this.setState({ edit: !this.state.edit })
        this.editID = this.props.dbase[parseInt(e.target.id)].EmailListID;
        this.editName = this.props.dbase[parseInt(e.target.id)].EmailListName
        console.log(this.props.dbase[parseInt(e.target.id)].EmailListID)
    }

    saveEdits(event, savedData) {

        event.preventDefault();

        savedData = {
            "Guids": null,
            "EmailListName": this.refs.listname.value,
            "EmailListID": this.editID
        }
        console.log(this.refs.listname.value)
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
                        <button className="main_buttons" type="submit">Save</button>
                    </form>
                </div>
            )
        }
        else {
            return (<button id={key} className="edit_delete list_buttons" onClick={this.handleStateEdit}>EDIT</button>)
        }
    }



    renderBody(value, key) {
        const data = this.state.emaillists
        return (
            <tr className="table_row" key={key} id={key}>
                <td className="table_data table_head_data"><input type="checkbox" name="ids" id={key} /></td>
                <td className="table_data">{value.EmailListName}</td>
                <td className="table_data table_head_data">{this.handleEdit(key)}</td>
                <td className="table_data table_head_data"><button id={key} className=" view_list" onClick={this.getContacts}>VIEW LIST</button></td>
                <td className="table_data table_head_data"><button id={key} className="edit_delete del list_buttons" onClick={this.handleDel}>DELETE</button></td>
                <td className="table_data table_head_data">{this.state.send ? (<button id={key} className="edit_delete send_email" onClick={this.handleSend} >SEND EMAIL</button>):(<SendEmail EmailListID={this.state.EmailListID} changeSend={this.changeSend} />)}</td>
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