import React, { Component } from 'react';
import '../StyleSheet/Contacts.css';

class Headers extends Component {
    constructor(props) {
        super(props);
        this.getHeadersData = this.getHeadersData.bind(this);
        this.renderHeaders = this.renderHeaders.bind(this);
       
    }
    getHeadersData() {
        // getting header data
        const obj = this.props.headerData;
      
        // defining rendered headers
        let headers = [];
        for (let i in obj) {
            headers.push(i);
        }
       
        let header = headers.splice(0, 5);
        // rendering headers as table heads
        return header;
    }

    renderHeaders(headers, index) {
        return (<th className="table_data table_head_data" key={index}>{headers}</th>)
    }
    render() {
        return (
            <thead>
                <tr className="table_row">
                    <th className="table_data">Select</th>
                    <th className="table_data">Number</th>
                    {this.getHeadersData().map(this.renderHeaders)}
                    <th className="table_data">Edit</th>
                    <th className="table_data">Delete</th>
                </tr>
            </thead>
        )
    }
}

export { Headers };