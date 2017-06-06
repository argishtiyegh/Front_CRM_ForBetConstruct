import React,{Component} from 'react';
import {Registration} from './Registration.js';
import './StyleSheet/Login.css';


class Login extends Component {
    constructor(props){
        super(props);
        this.state={register: false};
        this.handleRegister=this.handleRegister.bind(this);
        this.closeRegister=this.closeRegister.bind(this);

    }

    handleRegister(){
        this.setState({register: !this.state.register})
    }

    closeRegister(){
        this.setState({register: false})
    }

    renderRegistration(){
        if(this.state.register){
            return (
            <div>
               
                <Registration close={this.closeRegister}/>
            </div>)
        }
        else {
            return (<button className="btn" onClick={this.handleRegister}>Register</button>)
        }
    }
       render() {
        return (
            <div>
                <form action="" className="log_form" method="POST">
                    <h2>Login</h2>
                    <input type="text" className="log_input" name="username" placeholder="Email Address" required autoFocus /><br></br>
                    <input type="password" className="log_input" name="password" placeholder="Password" required /><br></br>
                    <button className="btn" type="submit">Login</button><br></br>
                </form>
                <div>
                {this.renderRegistration()}
                  </div>
            </div>
        );
    }
}
export default Login;