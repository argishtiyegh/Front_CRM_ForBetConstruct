import React, { Component } from 'react';
import call from './helpers/call.js';
import './StyleSheet/Login.css';



class Registration extends Component {
    constructor(props) {
        super(props);
        this.RegisterUser = this.RegisterUser.bind(this);
    }

    RegisterUser(event, data) {
        event.preventDefault();
        data = {
            "UserName": this.refs.username.value,
            "PhoneNumber": this.refs.PhoneNumber.value,
            "Email": this.refs.email.value,
            "Password": this.refs.password.value
        }
        call('api/account/register', 'POST', data).then(function (response) {
            if (!response.error) {
                console.log(response);
            }

            else {
                alert("Error Request");
            }
        });
    }
    render() {
        return (
            <div>
                <form className="registration" onSubmit={this.RegisterUser}>
                    <h2>Registration</h2>
                    <input type="text"  ref="username" placeholder="Username" required="" autoFocus /><br></br>
                    <input type="num"  ref="PhoneNumber" placeholder="Phone Number" required /><br></br>
                    <input type="email"  ref="email" placeholder="Email" required /><br></br>
                    <input type="password"  ref="password" placeholder="Password" required /><br></br>
                    <button className="btn_reg" type="submit">Create Account</button><br></br>
                    <button className="btn_reg" type="submit" onClick={this.props.close}>Close</button>
                </form>
            </div>
        )
    }
}
export { Registration }