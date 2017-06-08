import React, { Component } from 'react';
import call from './helpers/call.js';
import './StyleSheet/Login.css';

class Registration extends Component {
    constructor(props) {
        super(props);
    }

   
    render() {
        return (
            <div>
                <div className="login-page" />
                <p className="bet">REGISTER</p>
                <input type="text" ref="username" placeholder="Username" />
                <input type="text" ref="PhoneNumber" placeholder="Phone Number" />
                <input type="email" ref="email" placeholder="Email" required />
                <input type="password" ref="password" placeholder="Password" required />
                <button onClick={this.RegisterUser}>Register</button>
                <p className="message" onClick={this.props.close}>Have an account? <a>Sign in</a></p>

            </div>
        )
    }
}
export { Registration };


