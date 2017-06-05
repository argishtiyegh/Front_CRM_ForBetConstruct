import React, { Component } from 'react';
import call from '../helpers/call.js';
import '../StyleSheet/Contacts.css';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';

class DeleteMultiple extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false };
        this.deleteMultipleSend = this.deleteMultipleSend.bind(this);
        this.closePopUp = this.closePopUp.bind(this);
    }

    deleteMultipleSend(deleteData) {
        this.setState({ loading: true });
        deleteData = this.props.guidsList;
        deleteData = JSON.stringify(deleteData);
        console.log(deleteData);

        let that = this;
        call('api/contacts', 'DELETE', deleteData).then(function (response) {
            console.log(that);
            if (response.error) {
                call('api/contacts', 'GET').then(response => { response.error ? alert(response.message) : that.props.change(response), that.setState({ loading: false }); })
                console.log(this);
            }
            else {
                console.log(this);
            }
            that.closePopUp();
        })
    }

    closePopUp() {
        this.props.closePopUp(true);
    }
    render() {
        return (
            <div className="delete_mode">
                <h3 className="del_header">Are you sure you want to delete these contacts ?</h3>
                <div className="multiplePopUp">
                    <button className="multi_delete" onClick={this.deleteMultipleSend}>YES</button>
                    <button className="multi_delete" onClick={this.closePopUp} >NO</button>
                </div>
            </div>
        )
    }
}

export { DeleteMultiple };