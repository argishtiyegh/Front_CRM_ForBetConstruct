import React, { Component } from 'react';
import { TableBody } from './TableBody';
import call from '../helpers/call.js'
import { Headers } from './Headers';
import { AddNewContact } from './AddNewContact';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import { MessageSent } from '../exceptionHandling/MessageSent.js';
import { MessageFailed } from '../exceptionHandling/MessageFailed.js';
import { Added } from '../exceptionHandling/Added.js';
import { AddContactsToList } from './AddContactsToList';
import { UploadFile } from './UploadFile';
import { Saved } from '../exceptionHandling/Saved.js';
import '../StyleSheet/Contacts.css';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayCheckes: [],
            db: [],
            AddNewMode: false,
            sendMail: [],
            addnew: false,
            disable: true,
            selectAll: false,
            loading: false,
            sent: false,
            added: false,
            failed: false,
            edit: false,
            sendTo: [],
            templatesDB: [],
            templateId: "",
            addContactsToList: true,
            disableInput: true,
            disabling: true,
        };

        this.getSendMailData = this.getSendMailData.bind(this);
        this.postData = this.postData.bind(this);
        this.changeState = this.changeState.bind(this);
        this.putData = this.putData.bind(this);
        this.ReusableChangeState = this.ReusableChangeState.bind(this);
        this.changeSelectAll = this.changeSelectAll.bind(this);
        this.createMailingList = this.createMailingList.bind(this);
        this.sentMsg = this.sentMsg.bind(this);
        this.failedMsg = this.failedMsg.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.closeSend = this.closeSend.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.getTemplateId = this.getTemplateId.bind(this);
        this.addContToListState = this.addContToListState.bind(this);
        this.closePopUp = this.closePopUp.bind(this);
        this.changeInputDisable = this.changeInputDisable.bind(this);
        this.addedMsg = this.addedMsg.bind(this);
    }

    //Get initial Data

    componentDidMount() {
        this.setState({ loading: true });
        call('api/contacts', 'GET').then(response => { response.error ? response.message : this.setState({ db: response }); this.setState({ loading: false }) });
        call('api/template', 'GET').then(response => { response.error ? response.message : this.setState({ templatesDB: response }); this.setState({ loading: false }) });

    }

    changeState(data) {
        this.setState({ db: data });
    }

    ReusableChangeState(newdata) {
        this.setState({ disable: newdata });
    }

    changeSelectAll() {
        this.setState({ selectAll: !this.state.selectAll });
    }

    putData(putJSON) {
        call('api/contacts', 'PUT', putJSON);
    }

    closeMode() {
        this.setState({ AddNewMode: false });
    }

    getSendMailData(sendData) {
        this.setState({ sendMail: sendData });
    }

    //Notification Messages

    sentMsg() {
        console.log(this.state.templatesDB);
        this.setState({ sent: true });
        setTimeout(function () { this.setState({ sent: false }) }.bind(this), 2500);
    }

    addedMsg() {
        this.setState({ added: true });
        setTimeout(function () { this.setState({ added: false }) }.bind(this), 2500);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }) }.bind(this), 2500);
    }
    // Change of States

    addContToListState() {
        this.setState({ addContactsToList: false });
    }

    closePopUp(value) {
        this.setState({ addContactsToList: value });
    }

    closeSend() {
        this.setState({ edit: false, disabling: true });
    }
    //Getting Template ID

    getTemplateId(e) {
        console.log(e.target.selectedIndex)
        if (e.target.value !== "Choose Template") {
            this.setState({ templateId: this.state.templatesDB[e.target.selectedIndex - 1].TemplateId });
            this.setState({ disabling: false });
            console.log(this.state.templateId)
        }
        else {
            this.setState({ disabling: true });
        }
    }

    // Enabling and Disabling buttons on Click

    changeInputDisable() {
        if (this.refs.listname.value.length > 0 && this.state.sendMail.length !== 0) {
            this.setState({ disableInput: false });
        }
        else {
            this.setState({ disableInput: true });
        }
    }

    //Get Contact GuID and Send Email

    postData(event, sendData, tempId) {
        event.preventDefault();
        this.setState({ loading: true });
        if (this.state.selectAll) {
            this.allGuID = [];
            for (let i in this.state.db) {
                this.allGuID.push(this.state.db[i].GuID);
                this.setState({ sendTo: this.state.allGuID });
            }
            sendData = this.allGuID;
        }
        else {
            sendData = this.state.sendMail;
        }
        let that = this;
        tempId = this.state.templateId;
        fetch('http://crmbetd.azurewebsites.net/api/sendemail?templateid=' + tempId, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(sendData),
        }
        )
            .then(function (response) {
                if (!response.ok) {
                    that.setState({ loading: false });
                    that.setState({ sent: false });
                    that.failedMsg();
                    that.setState({ templateId: "" });

                } else {
                    that.setState({ failed: false });
                    that.setState({ loading: false });
                    that.sentMsg();
                    that.setState({ templateId: "" });
                }
                that.closeSend();
            });
    };


    //Create new Mailing List

    createMailingList() {
        this.setState({ loading: true });
        let listData = {
            "EmailListName": this.refs.listname.value,
            "Guids": this.state.sendMail
        };
        let that = this;
        fetch('http://crmbetd.azurewebsites.net/api/emaillists', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(listData),
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

    handleSend(e) {
        this.setState({ edit: true });

    }

    // Rendering Template Options
    renderOptions(value, key) {
        return (
            <option key={key} id={key += 1}>{value.TemplateName} </option>
        )
    }


    // Rendering "Send Email" button popup ,  other buttons will not be hided...
    sendingRender(key) {
        if (this.state.edit) {
            return (
                <div>
                    <button className="but_bottom" disabled={this.state.disable} 
                    id={key} onClick={this.handleSend}>Send Email</button>
                    <input id="listcreate" ref="listname" 
                    className="listName second_row" 
                    required type="text" 
                    disabled={this.state.disable} 
                    placeholder="Mailing List Name" 
                    onChange={this.changeInputDisable} />

                    <button className="but_bottom second_row"
                        onClick={this.createMailingList}
                        disabled={this.state.disableInput}>Create New Mailing List</button>
                        {this.state.addContactsToList ? (<button className="but_bottom"
                        onClick={this.addContToListState}
                        disabled={this.state.disable}>Add To Email List</button>) : (
                    <div>
                        <AddContactsToList closePopUp={this.closePopUp} guidsList={this.state.sendMail} />
                    </div>)}        
                    <div className="edit_mode">
                        <form className="edit_form" onSubmit={this.postData}>
                            <h3 className="add_new_header">Select the template</h3>
                            <div className="selectJoin">
                                <select
                                    onChange={this.getTemplateId}>
                                    <option defaultValue="Choose Template">Choose Template</option>
                                    {this.state.templatesDB.map(this.renderOptions)}
                                </select>
                            </div>
                            <button className="main_buttons" onClick={this.closeSend}>Close</button>
                            <button className="main_buttons del" disabled={this.state.disabling} type="submit">Send</button>
                        </form>
                        {this.state.loading && <LoadingGIF />}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <button className="but_bottom" disabled={this.state.disable} id={key} onClick={this.handleSend}>Send Email</button>
                    <input id="listcreate" ref="listname" className="listName second_row" required type="text" disabled={this.state.disable} placeholder="Mailing List Name" onChange={this.changeInputDisable} />
                    <button className="but_bottom second_row" onClick={this.createMailingList} disabled={this.state.disableInput}>Create New Mailing List</button>
                    {this.state.addContactsToList ? (<button className="but_bottom"
                        onClick={this.addContToListState}
                        disabled={this.state.disable}>Add To Email List</button>) : (
                            <div>
                                <AddContactsToList closePopUp={this.closePopUp} guidsList={this.state.sendMail} />
                            </div>)}


                </div>
            )
        }
    }
    render(key) {
        return (<div className="mainBlock">
            <UploadFile change={this.changeState} />
            <AddNewContact
                addNewState={this.state.AddNewMode}
                change={this.changeState} />
            <p className="count">Number of Contacts: {this.state.db.length}</p>
            {/*<input type="checkbox" onChange={this.changeSelectAll} className="select_all" />*/}
            <div className="scroll">
                <table className="all_contacts">
                    <Headers
                        selectAll={this.changeSelectAll}
                        headerData={this.state.db[0]}>
                    </Headers>
                    <TableBody
                        select={this.state.selectAll}
                        status={this.state.disable}
                        changeSt={this.ReusableChangeState}
                        getSendData={this.getSendMailData}
                        put={this.putData}
                        change={this.changeState}
                        database={this.state.db} />
                </table>
            </div>
            {this.sendingRender(key)}
            {this.state.loading && <LoadingGIF />}
            {this.state.sent && <MessageSent />}
            {this.state.added && <Added />}
            {this.state.failed && <MessageFailed />}
        </div>
        )
    }
}

export { Table };