import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import call from '../helpers/call.js';


class HeaderMail extends Component {
    constructor(props) {
        super(props);
        this.state = { mailDb: "", checking: false };
        this.checkOnChange = this.checkOnChange.bind(this);
    }

    checkOnChange(e) {
        console.log(e.target)
        if (e.target.checked) {
            this.state.mailDb = this.props.dbMail[this.props.num].EmailListID;
            console.log(this.props.dbMail[this.props.num])
            this.setState({ mailDb: this.state.mailDb });
            this.setState({checking: true})
        }
       
        
        this.props.getDeleteId(this.state.mailDb)
        console.log(this.state.mailDb)
        
    }

    render() {

        return (

            <tr className="table_row">
                <td className="table_data table_head_data"><input type="checkbox" defaultChecked={this.state.checking} onChange={this.checkOnChange} /></td>
                <td className="table_data table_head_data">{this.props.num + 1}</td>
                <td className="table_data table_head_data">{this.props.children}</td>
                <td className="table_data table_head_data"><button className="edit_delete">EDIT</button></td>
                <td className="table_data table_head_data"><button className="edit_delete del" onClick={this.props.delete}>DELETE</button></td>
            </tr>

        )
    }
}
export { HeaderMail };