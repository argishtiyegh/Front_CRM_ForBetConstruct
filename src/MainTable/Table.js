import React, { Component } from 'react';
import { TableBody } from './TableBody';
import call from '../helpers/call.js'
import { Headers } from './Headers';
import { AddNewContact } from './AddNewContact';
import '../StyleSheet/Contacts.css';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = { arrayCheckes: [], db: [], AddNewMode: false, sendMail: [], addnew: false, disable: true, selectAll: false, };
        //this.putNewContacts=this.putNewContacts.bind(this);
        this.getSendMailData = this.getSendMailData.bind(this);
        this.postData = this.postData.bind(this);
        this.changeState = this.changeState.bind(this);
        this.putData = this.putData.bind(this);
        this.ReusableChangeState = this.ReusableChangeState.bind(this);
        this.changeSelectAll = this.changeSelectAll.bind(this);
        this.checkBoxHide = this.checkBoxHide.bind(this);
        this.createMailingList = this.createMailingList.bind(this);

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

    postData(sendData) {

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
        call('api/sendemail?templateid=1', 'POST', sendData);      
    };
    createMailingList(e) {
        e.preventDefault();
        let listData = {
            "EmailListName": this.refs.listname.value,
            "Guids": this.state.sendMail
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
                <form onSubmit={this.createMailingList}>
                    <label htmlFor="listcreate">Mailing List Name </label>
                    <input id="listcreate" ref="listname" className="listname" required type="text" />
                    <button className="main_buttons button_send" type="submit" disabled={this.state.disable} >Create New Mailing List</button>
                </form>
            </div>
            <div className="upload createList">
                <input type="file" className="upload" />
                <button className="main_buttons button_send" >Upload</button>
            </div>
        </div>
        )
    }
}
export { Table };

