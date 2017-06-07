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
                <div className="login-page" />
                    <form className="login-form">
                        <input type="text" ref="username" placeholder="Username" />
                        <input type="text" ref="PhoneNumber" placeholder="Phone Number" />
                        <input type="email" ref="email" placeholder="Email" required/>
                        <input type="password" ref="password" placeholder="Password" required/>
                        <button>Register</button>
                        <p className="message" onClick={this.props.close}>Have an account? <a>Sign in</a></p>
                    </form>
                </div>
        )
    }
}
export { Registration };