import React, { Component } from 'react';
import '../StyleSheet/Contacts.css';
import call from '../helpers/call.js';

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.UploadData = this.UploadData.bind(this);
    }

    UploadData(event) {
        event.preventDefault();
        let data = new FormData();
        let fileData = document.querySelector('input[type="file"]').files[0];
        data.append("data", fileData);
        let that=this;
        fetch("http://crmbetd.azurewebsites.net/api/contacts/upload", {
            method: "POST",
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
            body: data
        }).then(function (res) {
            console.log(res)
            if (res.ok) {
                call('api/contacts', 'GET').then(response => { response.error ? alert(response.message) : that.props.change(response) })
            }
            else {
                alert("failed")
            }
        })
    }

    render() {
        return (
            <div>
                <form className="uploadCSV" encType="multipart/form-data" onSubmit={this.UploadData}>
                    <input name="data" size="40" type="file"></input>
                    <input type="submit" className="edit_delete"></input>
                </form>
            </div>
        )
    }
}
export { UploadFile };