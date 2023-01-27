import styles from './auth.module.css';
import React, {useCallback, useEffect, useState} from "react";
import {NewsProps} from "../news/news";
import Cookies from 'cookie';

/* eslint-disable-next-line */
export interface AuthProps {
}

export function Auth(props: AuthProps) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [borderLogin, setBorderLogin] = useState<string>();
  const [borderPassword, setBorderPassword] = useState<string>();

  const setCookie = (value:number) => {
    sessionStorage.setItem('userId', String(value))
  }


  const validateLogin = (email: any) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  const validatePassword = (password: any) => {
    return password.length >= 5 && password.length <= 16||null;
  }

  const onChange = (event: any) => {
    let isValid: any = null;
    if (event.target.name === 'email') {
      isValid = validateLogin(event.target.value);
      setEmail(event.target.value);
      setBorderLogin((prev) => {
        if (isValid) {
          return '3px solid green'
        } else {
          return '3px solid red'
        }
      });
    } else if (event.target.name === 'password') {
      isValid = validatePassword(event.target.value);
      setPassword(event.target.value);
      setBorderPassword((prev) => {
        if (isValid) {
          return '3px solid green'
        } else {
          return '3px solid red'
        }
      });
    }
  }

  const auth = async () => {
    const res = await fetch(`http://localhost:3001/api/users/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    if (!res.ok) {
      throw new Error('Ошибка авторизации');
    }
     const data = await res.json();
    if(data!==0){
      setCookie(data);
    }
     console.log(sessionStorage.getItem('userId'));
  }
const onSubmit=(event:any)=>{
    event.preventDefault();
    auth().catch(error => {
      throw new Error('Ошибка авторизации');
    });
}
  return (
  <section className="vh-auto" style={{backgroundColor: '#508bfc'}}>
    <div className="container py-5 h-100">
      <form className="row d-flex justify-content-center align-items-center h-100" name="form"
            encType="application/json" method="POST" action="http://127.0.0.1:3001/api/users/auth" onSubmit={onSubmit}>
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-2-strong" style={{borderRadius: '1rem'}}>
            <div className="card-body p-5 text-center">
              <h3 className="mb-5">Sign in</h3>
              <div className="form-outline mb-4">
                <input type="email" id="typeEmailX-2" className="form-control form-control-lg" name="email"
                       onChange={onChange} style={{border: borderLogin}}/>
                <label className="form-label" htmlFor="typeEmailX-2">Email</label>
              </div>
              <div className="form-outline mb-4">
                <input type="password" id="typePasswordX-2" className="form-control form-control-lg" name="password"
                       onChange={onChange} style={{border: borderPassword}}/>
                <label className="form-label" htmlFor="typePasswordX-2">Password</label>
              </div>
              <button className="btn btn-primary btn-lg btn-block" type="submit">Login</button>
              <hr className="my-4"/>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
);
}

export default Auth;
