import React, {useState} from 'react'
import { toast } from 'react-toastify';
import {auth} from "../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css'

const initialState = {
  email: "",
  password: ""
}

const Login = () => {
  const [state, setState] = useState(initialState);
  const {email, password} = state;
  const navigate = useNavigate()
  const handleChange = (e) => {
    setState({...state, [e.target.name]: e.target.value})
  }
  const handleAuth = async (e) => {
    e.preventDefault()
    if(email && password){
      const {user} = await signInWithEmailAndPassword(auth, email, password)
    }else{
      return toast.error("Tous les champs sont obligatoires à remplir")
    }
    navigate("/");
  }
  return (
    <div className='login'>
      <form action="" onSubmit={handleAuth}>
        <div className='connexion'>Connexion</div>
        <input type="email" placeholder='Email' name='email' value={email} onChange={handleChange}/>
        <input type="password" placeholder='Password' name='password' value={password} onChange={handleChange}/>
        <button type='submit'>Connexion</button>
        <div>N'avez pas de compte ? <span><a href="/signup">S'inscrire</a></span></div>
      </form>
    </div>
  )
}

export default Login