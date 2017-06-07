import React, { Component } from 'react';
import { Registration } from './Registration.js';
import './StyleSheet/Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { register: false };
        this.handleRegister = this.handleRegister.bind(this);
        this.closeRegister = this.closeRegister.bind(this);
    }

    handleRegister() {
        this.setState({ register: !this.state.register });
    }

    closeRegister() {
        this.setState({ register: false });
    }

    renderRegistration() {
        if (this.state.register) {
            return (
                <div>
                    <Registration close={this.closeRegister} />
                </div>
            )
        }
        else {
            return (<p className="message" onClick={this.handleRegister}>Not registered? <a>Create an account</a></p>)
        }
    }
    render() {
        return (
            <div className="back-page">
                <div className="login-page">
                    <div className="form">
                        <p className="bet">CRM BET</p>
                        <form className="register-form">
                            <input type="text" placeholder="name" />
                            <input type="password" placeholder="password" />
                            <input type="text" placeholder="email address" />
                            <button>create</button>
                            <p className="message">Already registered? <a>Sign In</a></p>
                        </form>
                        <form className="login-form">
                            <input type="text" placeholder="Email Address" />
                            <input type="password" placeholder="Password" />
                            <button>login</button>
                            {this.renderRegistration()}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;