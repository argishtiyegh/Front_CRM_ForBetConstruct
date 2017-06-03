import React, { Component } from 'react';
import { TableBody } from './TableBody';
import call from '../helpers/call.js'
import { Headers } from './Headers';
import { AddNewContact } from './AddNewContact';
import { LoadingGIF } from './LoadingGIF';
import { MessageSent } from './MessageSent';
import { MessageFailed } from './MessageFailed';
import '../StyleSheet/Contacts.css';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayCheckes: [], db: [], AddNewMode: false, sendMail: [], addnew: false, disable: true, selectAll: false,
            loading: false, sent: false, failed: false
        };
        //this.putNewContacts=this.putNewContacts.bind(this);
        this.getSendMailData = this.getSendMailData.bind(this);
        this.postData = this.postData.bind(this);
        this.changeState = this.changeState.bind(this);
        this.putData = this.putData.bind(this);
        this.ReusableChangeState = this.ReusableChangeState.bind(this);
        this.changeSelectAll = this.changeSelectAll.bind(this);
        this.checkBoxHide = this.checkBoxHide.bind(this);
        this.createMailingList = this.createMailingList.bind(this);
        this.sentMsg = this.sentMsg.bind(this);
        this.failedMsg = this.failedMsg.bind(this);

    }

    componentDidMount() {
        call('api/contacts', 'GET').then(response => { response.error ? alert(response.message) : this.setState({ db: response }) })

    }

    changeState(data) {
        this.setState({ db: data })
    }

    ReusableChangeState(newdata) {
        this.setState({ disable: newdata })
    }

    changeSelectAll() {
        this.setState({ selectAll: !this.state.selectAll })


        //console.log(this.allGuID)

    }

    putData(putJSON) {
        call('api/contacts', 'PUT', putJSON)
    }

    checkBoxHide(target) {
        this.state.arrayCheckes.push(target);
    }

    closeMode() {
        this.setState({ AddNewMode: false })
    }

    getSendMailData(sendData) {

        this.setState({ sendMail: sendData })

    }

    sentMsg() {
        this.setState({ sent: true });
        setTimeout(function () { this.setState({ sent: false }) }.bind(this), 2500);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }) }.bind(this), 2500);
    }

    postData(sendData) {
        this.setState({ loading: true });

        if (this.state.selectAll) {
            this.allGuID = [];
            for (let i in this.state.db) {
                this.allGuID.push(this.state.db[i].GuID)
            }
            sendData = this.allGuID
        }
        else {
            sendData = this.state.sendMail;
        }
        for (let i = 0; i < this.state.arrayCheckes.length; i++) {
            this.state.arrayCheckes[i].checked = false;
        }

        let that = this;
        return fetch('http://crmbetd.azurewebsites.net/api/sendemail?templateid=1', {
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
                    console.log(response);
                } else {
                    that.setState({ failed: false });
                    that.setState({ loading: false });
                    that.sentMsg();

                }
            });
    };
    createMailingList() {
        let listData = {
            "EmailListName": this.refs.listname.value,
            "GuID": this.state.sendMail
        };
        let that = this;
        call('api/emaillists', 'POST', listData).then(function (response) {
            console.log(response)
        })
    }



    render() {
        return (<div>
            <h3 className="headers">All Contacts</h3>
            <AddNewContact addNewState={this.state.AddNewMode} change={this.changeState} />
            <p className="count">Number of Contacts: {this.state.db.length}</p>
            <input type="checkbox" onChange={this.changeSelectAll} className="select_all" />
            <table className="all_contacts">
                <Headers selectAll={this.changeSelectAll} headerData={this.state.db[0]}></Headers>
                <TableBody select={this.state.selectAll} status={this.state.disable} changeSt={this.ReusableChangeState} getSendData={this.getSendMailData} put={this.putData} change={this.changeState} database={this.state.db} checkBoxHide={this.checkBoxHide} />
            </table>
            <button className="main_buttons button_send" disabled={this.state.disable} onClick={this.postData}>SEND EMAIL</button>

            <div className="createList">
                <label htmlFor="listcreate">Mailing List Name </label>
                <input id="listcreate" ref="listname" className="listname" required type="text" />
                <button className="main_buttons button_send" onClick={this.createMailingList} disabled={this.state.disable} >Create New Mailing List</button>
            </div>
            <div className="upload createList">
                <input type="file" className="upload" />
                <button className="main_buttons button_send" >Upload</button>
                {this.state.loading && <LoadingGIF />}
                <div>{this.state.sent && <MessageSent />}</div>
                <div>{this.state.failed && <MessageFailed />}</div>
            </div>
        </div>
        )
    }
}
export { Table };

