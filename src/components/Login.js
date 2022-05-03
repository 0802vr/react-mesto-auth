import React from "react";
import { withRouter} from "react-router-dom"

function Login ({onLogin}) {
    const email = React.useRef();
    const password = React.useRef();
function handleSubmit(e){
    e.preventDefault();
    onLogin ({
        email: email.current.value,
        password:password.current.value
    })
}
    
return(
    <section className="login">
        <h2 className="login__text">Вход</h2>
        <form className="login__form" onSubmit={handleSubmit}>
            <input className="login__input" placeholder="Email" type="email" ref={email}/> 
            <span className="login__error"></span>
            <input className="login__input" placeholder="Password" type="password" ref={password}/> 
            <span className="login__error"></span>
            <button className="login__button">Войти</button>
        </form>
    </section>
)
}

export default withRouter(Login);