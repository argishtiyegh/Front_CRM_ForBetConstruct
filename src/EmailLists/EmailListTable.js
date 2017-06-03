import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import call from '../helpers/call.js';
import { HeaderMail } from './HeaderMail';
import '../StyleSheet/Contacts.css';

class EmailListTable extends Component {
    constructor(props) {
        super(props);
        this.state = { dbMailingList: [], deleteId: null,checked: false};
        this.renderHeaders = this.renderHeaders.bind(this);
        this.getDeleteId=this.getDeleteId.bind(this);
        this.deleteMailingList=this.deleteMailingList.bind(this);

    }

    componentDidMount() {
        call('api/emaillists', "GET").then((response) => {
            this.setState({ dbMailingList: response })
            console.log(response);
        }
        );

        call('api/emaillists/1', "GET").then((response) => {
            this.setState({ dbTemplate: response })
            //  console.log(response);
        }
        )
    }

    renderHeaders(value, key) {
        return (<HeaderMail getDeleteId={this.getDeleteId} checked={this.state.checked} delete={this.deleteMailingList} dbMail={this.state.dbMailingList} key={key} num={key}>{value.EmailListName}</HeaderMail>)
    }

    getDeleteId(id,checked) {
        this.setState({ deleteId: id,checked: checked})
    }

   

    deleteMailingList(deleteId,event) {
      
        deleteId=this.state.deleteId;
        console.log(this.state.deleteId)
        if(this.state.deleteId!=null){
         let that = this;
         console.log(event.target.deleteId)
        call('api/emaillists?id=' + deleteId, 'DELETE').then(function (response) {
            console.log(that)
            if (response.error) {
                call('api/emaillists', 'GET').then(response => { response.error ? alert(response.message) : that.setState({ dbMailingList: response }) })
                console.log(this)
                 that.setState({checked: false})
            }
            else {
                alert("Error Request")
            }
        })
        }
    }


    render() {
        return (
            <div>
                <p className="count">Number of Mailing Lists: {this.state.dbMailingList.length}</p>
                <table className="all_contacts mailList">
                    <thead>
                        <tr>
                            <th className="table_data table_head_data">SELECT</th>
                            <th className="table_data table_head_data">NUMBER</th>
                            <th className="table_data table_head_data">NAME</th>
                            <th className="table_data table_head_data">EDIT</th>
                            <th className="table_data table_head_data">DELETE</th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.dbMailingList.map(this.renderHeaders)}
                    </tbody>
                </table>
                <button className="main_buttons button_send">SEND EMAIL</button>
            </div>
        )

    }
}
export { EmailListTable };