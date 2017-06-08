import React, { Component } from 'react';
import { LoadingGIF } from '../exceptionHandling/LoadingGIF.js';
import { Deleted } from '../exceptionHandling/Deleted.js';
import { Saved } from '../exceptionHandling/Saved.js';
import { MessageFailed } from '../exceptionHandling/MessageFailed.js';
import '../StyleSheet/Contacts.css';
import call from '../helpers/call.js'

class TableBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guId: [],
      checkings: false,
      edit: false,
      editableData: [],
      editguID: "",
      loading: false,
      delete: false,
      guIDForDel: "",
      deleted: false,
      failed: false,
      saved: false
    };
    this.renderHeaders = this.renderHeaders.bind(this);
    this.getGuId = this.getGuId.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.SaveEdits = this.SaveEdits.bind(this);
    this.DelContact = this.DelContact.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.closeDelete = this.closeDelete.bind(this);
    this.deletedMsg = this.deletedMsg.bind(this);
    this.failedMsg = this.failedMsg.bind(this);
    this.savedMsg = this.savedMsg.bind(this);
  }

  getGuId(e) {
    if (e.target.checked) {
      this.state.guId.push(this.props.database[e.target.id].GuID);
    }
    else {
      let index = this.state.guId.indexOf(this.props.database[e.target.id].GuID);
      if (index >= 0) {
        this.state.guId.splice(index, 1);
      }
    }
    this.setState({ guId: this.state.guId });

    if (this.state.guId.length > 0) {
      this.props.changeSt(false);
    }
    else {
      this.props.changeSt(true);
    }
    this.props.getSendData(this.state.guId);
    console.log(this.state.guId);
  };

  savedMsg() {
    this.setState({ saved: true });
    setTimeout(function () { this.setState({ saved: false }); this.closeDelete(); }.bind(this), 2500);
  }

  failedMsg() {
    this.setState({ failed: true });
    setTimeout(function () { this.setState({ failed: false }) }.bind(this), 2500);
  }

  deletedMsg() {
    this.setState({ deleted: true });
    setTimeout(function () { this.setState({ deleted: false }) }.bind(this), 2500);
  }

  handleEdit(e) {
    this.setState({ edit: true });
    console.log(e.target.id);
    let editData = this.props.database[e.target.id - 1];
    this.firstname = editData["Full Name"].split(" ")[0];
    this.lastname = editData["Full Name"].split(" ")[1];
    this.setState({ editableData: editData, editguID: editData.GuID });
  }

  handleDelete(e) {
    this.setState({ delete: true });
    this.setState({ guIDForDel: this.props.database[e.target.id - 1].GuID });
  }

  DelContact(e, guid_del) {
    e.preventDefault();
    this.setState({ loading: true });
    guid_del = this.state.guIDForDel;
    console.log(guid_del);
    let that = this;

    return fetch('http://crmbetd.azurewebsites.net/api/contacts?guid=' + guid_del, {
      method: "DELETE",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    }).then(function (response) {
      if (response.ok) {
        return fetch('http://crmbetd.azurewebsites.net/api/contacts', {
          method: "GET",
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },

        }).then(function (response) {
          if (response.ok) {
            that.setState({ loading: false });
            that.deletedMsg();
            that.closeDelete();
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

  closeEdit() {
    this.setState({ edit: false });
  }

  closeDelete() {
    this.setState({ delete: false });
  }

  SaveEdits(event, putObject) {
    event.preventDefault();
    this.setState({ loading: true });
    putObject = {
      "Full Name": this.refs.firstname.value + " " + this.refs.lastname.value,
      "Company Name": this.refs.company.value,
      "Position": this.refs.position.value,
      "Country": this.refs.country.value,
      "Email": this.refs.email.value,
      "GuID": this.state.editguID,
    }
    let that = this;

     return fetch('http://crmbetd.azurewebsites.net/api/contacts', {
            method: "PUT",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(putObject)
        }).then(function (response) {
            if (response.ok) {
                return fetch('http://crmbetd.azurewebsites.net/api/contacts', {
                    method: "GET",
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },

                }).then(function (response) {
                    if (response.ok) {
                        that.setState({ loading: false });
                        that.savedMsg();
                        that.closeEdit();
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
  //   call('api/contacts', 'PUT', putObject).then(function (response) {
  //     console.log(that)
  //     if (response.error) {
  //       call('api/contacts', 'GET').then(response => { response.error ? response.message : that.props.change(response), that.setState({ loading: false }) });
  //       console.log(this);
  //     }
  //     that.closeEdit();
  //   })
  // }
  }
  editingRender(key) {
    let dataPlacehold = this.state.editableData;
    if (this.state.edit) {
      return (
        <div>
          <button className="edit_delete" id={key} onClick={this.handleEdit}>Edit</button>
          <div className="edit_mode">
            <form onSubmit={this.SaveEdits} className="edit_form">
              <h3 className="add_new_header">Edit {this.firstname} {this.lastname}'s Contacts</h3>
              <input className="list_input edit_input" ref="firstname" defaultValue={this.firstname} required type="text" placeholder="First Name" /><br />
              <input className="list_input edit_input" ref="lastname" defaultValue={this.lastname} required type="text" placeholder="Last Name" /><br />
              <input className="list_input edit_input" ref="company" defaultValue={dataPlacehold["Company Name"]} type="text" required placeholder="Company Name" /> <br />
              <input className="list_input edit_input" ref="position" defaultValue={dataPlacehold["Position"]} type="text" required placeholder="Position" /> <br />
              <input className="list_input edit_input" ref="country" defaultValue={dataPlacehold["Country"]} type="text" required placeholder="Country" /> <br />
              <input className="list_input edit_input" ref="email" defaultValue={dataPlacehold["Email"]} type="email" required placeholder="Email" /> <br />
              <button className="main_buttons main_buttons_pop" onClick={this.closeEdit}>Close</button>
              <button className="main_buttons main_buttons_pop" type="submit">Save</button>
            </form>
            {this.state.loading && <LoadingGIF />}
            {this.state.failed && <MessageFailed />}
          </div>
        </div>
      )
    }
    else {
      return (<button className="edit_delete" id={key} onClick={this.handleEdit}>Edit</button>)
    }
  }

  deletingRender(key) {
    if (this.state.delete) {
      return (
        <div>
          <button className="edit_delete del" onClick={this.handleDelete} id={key}>Delete</button>
          <div className="edit_mode">
            <form className="edit_form" onSubmit={this.DelContact}>
              <h3 className="add_new_header">Are you sure you want to delete this contact ?</h3>
              <button className="main_buttons main_buttons_pop" onClick={this.closeDelete}>No</button>
              <button className="main_buttons main_buttons_pop" type="submit">Yes</button>
            </form>
            {this.state.loading && <LoadingGIF />}
          </div>
        </div>
      )
    }
    else {
      return (<button className="edit_delete del" onClick={this.handleDelete} id={key}>Delete</button>)
    }
  }

  renderHeaders(value, key) {
    return (
      <tr key={key} className="table_row">
        <td className="table_data checkbox">
          <input type="checkbox"
            defaultChecked={this.state.checkings}
            id={key}
            onChange={this.getGuId} />
        </td>
        <td className="table_data">{key += 1}</td>
        <td className="table_data">{value["Full Name"]}</td>
        <td className="table_data">{value["Company Name"]}</td>
        <td className="table_data">{value.Position}</td>
        <td className="table_data">{value.Country}</td>
        <td className="table_data">{value.Email}</td>
        <td className="table_data">{this.editingRender(key)}</td>
        <td className="table_data">{this.deletingRender(key)}</td>
        <td>{this.state.loading && <LoadingGIF />}</td>
        <td>{this.state.deleted && <Deleted />}</td>
        <td>{this.state.failed && <MessageFailed />}</td>
        <td>{this.state.saved && <Saved />}</td>
      </tr>
    )
  }

  render() {
    return (<tbody>
      {this.props.database.map(this.renderHeaders)}
    </tbody>)
  }
}

export { TableBody };

