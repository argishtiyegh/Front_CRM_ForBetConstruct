import React, { Component } from 'react';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import { Added } from '../exceptionHandling/Added.js';
import { MessageFailed } from '../exceptionHandling/MessageFailed.js';
import '../StyleSheet/Contacts.css';
import call from '../helpers/call.js'

class AddNewContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            close: this.props.addNewState,
            putNew: true,
            loading: false,
            addedContact: false,
            failed: false,
            added: false
        };
        // this.renderAddNew = this.renderAddNew.bind(this);
        // this.renderEditMode = this.renderEditMode.bind(this);
        this.normalMode = this.normalMode.bind(this);
        this.addNewMode = this.addNewMode.bind(this);
        this.editState = this.editState.bind(this);
        this.closeMode = this.closeMode.bind(this);
        this.putNewData = this.putNewData.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.failedMsg = this.failedMsg.bind(this);
        this.addedMsg = this.addedMsg.bind(this);
    }

    addedMsg() {
        this.setState({ added: true });
        setTimeout(function () { this.setState({ added: false }); this.closeMode() }.bind(this), 2500);
    }

    failedMsg() {
        this.setState({ failed: true });
        setTimeout(function () { this.setState({ failed: false }); this.closeMode() }.bind(this), 2500);
    }

    editState() {
        this.setState({ close: true });
    }

    closeMode() {
        this.setState({ close: false });
    }

    handleAdd() {
        this.setState({ putNew: false });
        console.log(this.state.putNew);
    }

    putNewData(event, added_data) {
        event.preventDefault();
        this.setState({ loading: true });
        if (this.state.putNew) {
            added_data = {
                "Full Name": this.refs.firstname.value + " " + this.refs.lastname.value,
                "Company Name": this.refs.company.value,
                "Position": this.refs.position.value,
                "Country": this.refs.country.value,
                "Email": this.refs.email.value,
            };
            let that = this;
            return fetch('http://crmbetd.azurewebsites.net/api/contacts', {
                method: "POST",
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(added_data)
            }).then(function (response) {
                if (response.ok) {
                    return fetch('http://crmbetd.azurewebsites.net/api/contacts', {
                        method: "GET",
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },

                    }).then(function (response) {
                        if (response.ok) {
                            that.setState({ loading: false });
                            that.addedMsg();
                            return response.json();
                        }
                        else {
                            that.setState({ loading: false });
                            that.failedMsg();
                        }
                    }).then(function (response) {
                        that.props.change(response);
                    })
                }
                else {
                    that.setState({ loading: false });
                    that.failedMsg();
                }
            })
        }
    }

    addNewMode() {
        return (<div className="add_new">
            <form action="" className="add_new_form" onSubmit={this.putNewData}>
                <h3 className="add_new_header">Add New Contact</h3>
                <input className="list_input edit_input" ref="firstname" required type="text" placeholder="First Name" /><br />
                <input className="list_input edit_input" ref="lastname" type="text" required placeholder="Last Name" /> <br />
                <input className="list_input edit_input" ref="company" type="text" required placeholder="Company Name" /> <br />
                <input className="list_input edit_input" ref="position" type="text" required placeholder="Position" /> <br />
                <input className="list_input edit_input" ref="country" type="text" required placeholder="Country" /> <br />
                <input className="list_input edit_input" ref="email" type="email" required placeholder="Email" /> <br />
                <button className="main_buttons" tabIndex="2" onClick={this.closeMode}>Close</button>
                <button className="main_buttons" tabIndex="1" type="submit">Add Contact</button>
            </form>
            {this.state.loading && <LoadingGIF />}
            {this.state.added && <Added />}
            {this.state.failed && <MessageFailed />}
        </div>)
    }

    normalMode() {
        return (<button className="main_buttons" onClick={this.editState}>Add New</button>)
    }
    render() {
        if (this.state.close) {
            return this.addNewMode();
        }
        else {
            return this.normalMode();
        }
    }
}

export { AddNewContact }; 