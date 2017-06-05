import React, { Component } from 'react';
import '../StyleSheet/Contacts.css';
import call from '../helpers/call.js';

class UploadFile extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <form className="uploadCSV" action="http://crmbetd.azurewebsites.net/api/contacts/upload" encType="multipart/form-data" method="POST" >
                    <input name="data" size="40" type="file"></input>
                    <input type="submit" className="edit_delete"></input>
                </form>
            </div>
        )
    }
}
export { UploadFile };