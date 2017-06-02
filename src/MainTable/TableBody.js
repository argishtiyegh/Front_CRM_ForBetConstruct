import React, { Component } from 'react';
import '../StyleSheet/Contacts.css';
import call from '../helpers/call.js'

class TableBody extends Component {
  constructor(props) {
    super(props);
    this.state = { guId: [], checkings: false, edit: false, editableData: [], editguID: "", status: "disable" };
    this.renderHeaders = this.renderHeaders.bind(this);
    this.getGuId = this.getGuId.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.closeEdit=this.closeEdit.bind(this);
    this.SaveEdits=this.SaveEdits.bind(this);
    this.DelContact=this.DelContact.bind(this);
  }

  getGuId(e) {
    this.props.checkBoxHide(e.target);
    if (e.target.checked === true) {
      this.state.guId.push(this.props.database[e.target.id].GuID);
    }
    else {
      let index = this.state.guId.indexOf(this.props.database[e.target.id].GuID);
      if (index >= 0) {
        this.state.guId.splice(index, 1);
      }
    }
    this.setState({ guId: this.state.guId })
      
    if(this.state.guId.length>0){
     this.props.changeSt(false)
    }
    else{
      this.props.changeSt(true)
    }
    
    this.props.getSendData(this.state.guId)
      console.log(this.state.guId)
    
  };

  handleEdit(e) {
    this.setState({ edit: true });
    console.log(e.target.id);
    let editData=this.props.database[e.target.id-1];
    this.firstname = editData["Full Name"].split(" ")[0];
    this.lastname=editData["Full Name"].split(" ")[1];
    this.setState({editableData: editData,editguID: editData.GuID})
  }

  DelContact(e,guid_del){
    let deletedata=this.props.database[e.target.id-1];
    guid_del = deletedata.GuID;
     let that = this;
     call('api/contacts?guid='+guid_del, 'DELETE').then(function(response) {
                 console.log(that)
                if (response.error) {
                     call('api/contacts', 'GET').then(response => { response.error ? alert(response.message) : that.props.change(response) })
                     console.log(this)
                }
                else {
                    alert("Error Request")
                }  
            })
  }

  closeEdit(){
    this.setState({edit: false})
  }
  
  SaveEdits(event,putObject){
    event.preventDefault();
     putObject = {
       "Full Name": this.refs.firstname.value +" "+ this.refs.lastname.value,
       "Company Name": this.refs.company.value,
       "Position": this.refs.position.value,
       "Country": this.refs.country.value,
       "Email": this.refs.email.value,
        "GuID": this.state.editguID,
     }
     let that = this;
     call('api/contacts', 'PUT', putObject).then(function(response) {
                 console.log(that)
                if (response.error) {
                     call('api/contacts', 'GET').then(response => { response.error ? alert(response.message) : that.props.change(response) })
                     console.log(this)
                }
                else {
                    alert("Error Request")
                }
                that.closeEdit()
            })   
  }

  editingRender(key){
    let dataPlacehold = this.state.editableData;
    if (this.state.edit===true) {
      return (
        <div className="edit_mode">
          <form onSubmit={this.SaveEdits} className="edit_form">
            <h3 className="add_new_header">Edit {this.firstname} {this.lastname}'s Contacts</h3>
            <input className="list_input" ref="firstname" defaultValue={this.firstname} required type="text" placeholder="First Name" /><br />
            <input className="list_input" ref="lastname" defaultValue={this.lastname} required type="text" placeholder="Last Name" /><br />
            <input className="list_input" ref="company" defaultValue={dataPlacehold["Company Name"]} type="text" required placeholder="Company Name" /> <br />
            <input className="list_input" ref="position" defaultValue={dataPlacehold["Position"]} type="text" required placeholder="Position" /> <br />
            <input className="list_input" ref="country" defaultValue={dataPlacehold["Country"]} type="text" required placeholder="Country" /> <br />
            <input className="list_input" ref="email" defaultValue={dataPlacehold["Email"]} type="email" required placeholder="Email" /> <br />
            <button className="main_buttons" onClick={this.closeEdit}>Close</button>
            <button className="main_buttons" type="submit">Save</button>
          </form>
        </div>
      )
    }
    else {
      return (<button className="edit_delete" id={key} onClick={this.handleEdit}>Edit</button>)
    }

  }


  renderHeaders(value, key) {
    return (
      <tr key={key} className="table_row">
        <td className="table_data">{key += 1}</td>
        <td className="table_data checkbox"><input type="checkbox" defaultChecked={this.state.checkings} id={key} onChange={this.getGuId} /></td>
        <td className="table_data">{value["Full Name"]}</td>
        <td className="table_data">{value["Company Name"]}</td>
        <td className="table_data">{value.Position}</td>
        <td className="table_data">{value.Country}</td>
        <td className="table_data">{value.Email}</td>
        <td className="table_data">{this.editingRender(key)}</td>
        <td className="table_data"><button id={key} onClick={this.DelContact} className="edit_delete del">Delete</button></td>
      </tr>
    )
  }
 
  render() {
    
    return(<tbody>
        {this.props.database.map(this.renderHeaders)}
    </tbody>)
  }
}
export { TableBody };

//{/*ref={checkings => { this.allchecks.push(checkings)}}*/}