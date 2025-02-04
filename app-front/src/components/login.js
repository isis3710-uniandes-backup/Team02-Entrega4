import React, { Component } from 'react';import { ToastsContainer, ToastsStore } from 'react-toasts';

import { data } from '../params';
import history from '../history';
import '../css/signin.css';
const axios = require('axios');

export default class Login extends Component {
	/**
	 * Las variables del estado son: uname - Nombre de usuario y upass - Contraseña digitada.
	 */

	state = {
		username: '',
		password: ''
	};

	//Habilitar el formulario de registro del usuario.
	clickSignIn = () => {
		history.replace('/signin'); //Avanzar de vista.
	};

	//Obtener la información de inicio de sesión y el respectivo token.
	getLogData = async (username, password) => {
		let info = { username: username, password: password };
		//console.log('Informacion del formulario', info);
		let retrieved = await axios.post(data.login, info);
		return retrieved.data;
	};

	//Habilitar la ventana de login.
	clickLog = async event => {
		try {
			//* Actualizar el componente sin dar refresh
			event.preventDefault();

			//TODO Utilizar una forma mas elegante de dar una notificación.

			if (this.state.username.length === 0)
				return ToastsStore.warning('Please enter your username');
			if (this.state.password.length === 0)
				return ToastsStore.warning('Please enter your password');

			//* Llamar al backend: Peticion traer los datos de inicio de sesión.
			let res = await this.getLogData(this.state.username, this.state.password);
			if (res === undefined || !res.success)
				return ToastsStore.error(
					"The email and password doesn't match with any registered user, check the credentials"
				);
			else if (res.success) {
				//* Autenticación Exitosa
				ToastsStore.success('Autenticación exitosa');
				localStorage.setItem('token', res.token);
				history.replace({
					pathname: '/home',
					state: {
						username: this.state.username,
						password: this.state.password
					}
				}); //Ir a la ventana principal
			}
		} catch (err) {
			if (err.response.status === 404) {
				ToastsStore.error('User Not Found')
				//alert('User Not Found');
			}
		}
	};

	render() {
		return (			
			<div className="center-block justify-content-center">
				<link href="https://fonts.googleapis.com/css?family=Karla|Rubik&display=swap" rel="stylesheet"></link>
				<div className="container-fluid justify-content-center">
					<div data-aos="flip-left" data-aos-duration="1000">
						<div id="card-login" className="col-4 centrar card p-3 mb-5 shadow">
							<div className="container-fluid justify-content-center">
								<h1 className="text-center mb4" id="security">Online Wallet</h1>
								<img
									src="http://www.freepngclipart.com/download/handbag/78586-handbag-wallet-computer-cash-icons-png-download-free.png"
									alt="wallet"
									className="rounded mx-auto d-block img-fluid"
									height="180px"
									width="180px"
								/>
								<h2 className="text-center mt-3" id="login">Login</h2>
							</div>
							<form className="container-fluid">
								<div className="form-group">
									<label id = "uname">Username</label>
									<input
										type="text"
										name="uName"
										className="form-control"
										id="userName"
										placeholder="Enter your username"
										aria-label="Username Field"
										onChange={evt =>
											this.setState({ username: evt.target.value })
										}
										required
									/>
								</div>
								<div className="form-group">
									<label id = "password">Password</label>
									<input
										type="password"
										name="uPass"
										className="form-control"
										id="userPass"
										placeholder="User's account password"
										aria-label="password-field"
										onChange={evt =>
											this.setState({ password: evt.target.value })
										}
										required
									/>
								</div>
								<div className="row justify-content-center">
									<button
										type="button"
										onClick={this.clickSignIn}
										className="btn button-rounded btn-secondary m-3 mylabel"
									>
										Register
									</button>
									<button
										type="button"
										onClick={this.clickLog}
										className="btn button-rounded button-blue m-3 mylabel"
									>
										{' '}
										Log In{' '}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<ToastsContainer store={ToastsStore} />
			</div>
		);
	}
}
