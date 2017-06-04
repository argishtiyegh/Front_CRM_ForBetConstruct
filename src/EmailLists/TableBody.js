import React, { Component } from 'react';
import { Requests } from './Requests';
import '../StyleSheet/Contacts.css';
//import call from '../helpers/call.js';

/*
class TableBody extends Component {
    constructor(props) {
        super(props);
        this.state = { editing: false, getEmailListIdArr: [], checkings: false, editName: [] };
        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        this.editMode = this.editMode.bind(this);
        this.normalMode = this.normalMode.bind(this);
        this.renderNormalMode = this.renderNormalMode.bind(this);
        this.renderEditMode = this.renderEditMode.bind(this);
        this.getEmailListId = this.getEmailListId.bind(this);
    }

    getEmailListId(e) {
        console.log(this.props.database[0]);
        if (e.target.checked === true) {
            this.state.getEmailListIdArr.push(this.props.database[e.target.id].EmailListId);
            console.log(this.props.database[e.target.id].EmailListId);
            console.log(this.props.database);
            console.log(this.state.getEmailListIdArr);
            this.props.sendemails(this.state.getEmailListIdArr);
        }
        else {
            let index = this.state.getEmailListIdArr.indexOf(this.props.database[e.target.id].EmailListId);
            if (index >= 0) {
                this.state.getEmailListIdArr.splice(index, 1);
            }
        }
        this.setState({ getEmailListIdArr: this.state.getEmailListIdArr })
        console.log(this.state.checkings)
    };

    edit(e) {
        this.setState({ editing: true });
        let mailListName = this.props.database[e.target.id].EmailListName;
        this.state.editName[0] = mailListName;
        console.log(this.state.editName[0]);
    };

    save(updateData) {
        let val = this.refs.newText.value;
        this.setState({ editing: false });
        console.log(val);
    };

    editMode() {
        return (
            <tbody>

                
                <tr className="table_row">
                    <td className="table_data"><input type="text" ref="newText" defaultValue={this.state.editName}></input></td>
                </tr>
                <tr className="table_row">
                    <td><button onClick={this.save}>Save</button></td>
                </tr>
            </tbody>
        )
    };

    normalMode() {
        return (
            <tbody>
                {this.props.database.map(this.renderNormalMode)}
            </tbody>
        )
    }

    renderNormalMode(value, key) {
        return (
            <tr key={key} className="table_row">
                <td className="table_data"><input type="checkbox" id={key} ref="checkbx" onChange={this.getEmailListId} /></td>
                <td className="table_data">{value.EmailListId}</td>
                <td className="table_data">{value.EmailListName}</td>
                <td className="table_data">
                    <button id={key} onClick={this.edit} >Edit</button>
                </td>
            </tr>
        )
    }

    renderEditMode(value, key) {
        return (
            <tr key={key} className="table_row">
                <td className="table_data">{value.EmailListId}</td>
                <td className="table_data">{value.EmailListName}</td>
            </tr>
        )
    }

    render() {
        if (this.state.editing) {
            return this.editMode();
        } else {
            return (this.normalMode()
           
                    )
        }
    }
}
export { TableBody };*/