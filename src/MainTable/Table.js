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

    componentDidMount() {
        this.setState({ loading: true });
        call('api/contacts', 'GET').then(response => { response.error ? response.message : this.setState({ db: response }), this.setState({ loading: false }) });
        call('api/template', 'GET').then(response => { response.error ? response.message : this.setState({ templatesDB: response }), this.setState({ loading: false }) });
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

    sentMsg() {
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

    addContToListState() {
        this.setState({ addContactsToList: false });
    }

    closePopUp(value) {
        this.setState({ addContactsToList: value });
    }

    closeSend() {
        this.setState({ edit: false, disabling: true });
    }

    getTemplateId(e) {
        this.setState({ templateId: this.state.templatesDB[e.target.selectedIndex].TemplateId });
        if (e.target.value !== "Choose Template") {
            this.setState({ disabling: false });
        }
        else {
            this.setState({ disabling: true });
        }
    }

    changeInputDisable() {
        if (this.refs.listname.value.length > 0 && this.state.sendMail.length !== 0) {
            this.setState({ disableInput: false });
        }
        else {
            this.setState({ disableInput: true });
        }
    }

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
        return fetch('http://crmbetd.azurewebsites.net/api/sendemail?templateid=' + tempId, {
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
                    console.log(response);
                } else {
                    that.setState({ failed: false });
                    that.setState({ loading: false });
                    that.sentMsg();
                    that.setState({ templateId: "" });
                }
                that.closeSend();
            });
    };

    createMailingList() {
        this.setState({ loading: true });
        let listData = {
            "EmailListName": this.refs.listname.value,
            "Guids": this.state.sendMail
        };
        let that = this;
        return fetch('http://crmbetd.azurewebsites.net/api/emaillists', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(listData),
        })
            .then(function (response) {
                if (!response.ok) {
                    that.setState({ loading: false });
                    that.setState({ added: false });
                    that.failedMsg();
                    console.log(response);
                } else {
                    that.setState({ failed: false });
                    that.setState({ loading: false });
                    that.addedMsg();
                }
            });
    }

    handleSend(e) {
        this.setState({ edit: true });
        console.log(e.target.id);
    }

    renderOptions(value, key) {
        return (
            <option key={key} id={key + 1}>{value.TemplateName} </option>
        )
    }

    sendingRender(key) {
        if (this.state.edit) {
            return (
                <div>
                    <button className="main_buttons button_send" disabled={this.state.disable} id={key} onClick={this.handleSend}>SEND EMAIL</button>
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
            return (<button className="main_buttons button_send sendMail btn-left" disabled={this.state.disable} id={key} onClick={this.handleSend}>SEND EMAIL</button>)
        }
    }

    render(key) {
        return (<div className="mainBlock">
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
            <br></br><br></br><br></br><br></br>
                {this.state.addContactsToList ? (<button className="main_buttons button_send btn-left"
                    onClick={this.addContToListState}
                    disabled={this.state.disable}>Add To Email List</button>) : (
                        <div>
                            <button className="main_buttons button_send addToList_btn btn-left"
                                onClick={this.addContToListState}
                                disabled={this.state.disable}>Add To Email List</button>
                            <AddContactsToList closePopUp={this.closePopUp} guidsList={this.state.sendMail} />
                        </div>)} <br></br><br></br><br></br>
            <div className="createList">
                <input id="listcreate" ref="listname" className="listName" required type="text" placeholder="Mailing List Name" onChange={this.changeInputDisable} />
                <button className="main_buttons createList_but button_send" onClick={this.createMailingList} disabled={this.state.disableInput}>Create New Mailing List</button>
            </div>
            <br></br><br></br><br></br>
            <div className="upload">
                <UploadFile change={this.changeState} />
            </div>
            {this.state.loading && <LoadingGIF />}
            {this.state.sent && <MessageSent />}
            {this.state.added && <Added />}
            {this.state.failed && <MessageFailed />}
        </div>
        )
    }
}

export { Table };