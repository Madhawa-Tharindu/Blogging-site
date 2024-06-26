import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";


/* useRef is a tool in React that helps you keep track of things in your app without causing it to rerender. */  

const UserAuthForm = ({ type }) => {
    
    const AuthForm = useRef();
    /* I got an problem for not updating the useRef when switch the type by link in bottom of the page.
    did not find any solution. therefore instead of useRef I am using id to change it */

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    console.log("access_token: ", access_token)

    const userAuthThroughServer = (serverRoute, formData) => {
        console.log("VITE_SERVER_DOMAIN:", import.meta.env.VITE_SERVER_DOMAIN);
       axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
       .then(({ data }) => {
        console.log(data);
        storeInSession("user", JSON.stringify(data));
        //console.log(sessionStorage);

        setUserAuth(data);
       })
       .catch(({ response }) => {
        toast.error(response.data.error);
       })

    }


    const handleSubmit = (e) => {

        e.preventDefault();

        let serverRoute = type === 'sign-in' ? "/login" : "/signup"; 
        
        //Regex
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        //formData
        let form = new FormData(AuthForm.current);
        //let form = new FormData(formElement);
        console.log(form);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        console.log(formData);

        let { fullname, email, password } = formData;

        // form validation
        if(fullname){
            if (!fullname || fullname.length < 3){
                return toast.error("Full Name must be at least 3 characters long");
            }
        }
        if (!email.length || !email.includes('@') || !email.includes('.')){
            return toast.error("Email must be type 'email' and cannot be empty");
        }
        if (!emailRegex.test(email)){
            return toast.error("Email is not valid");
        }
        if (!passwordRegex.test(password)){
            return toast.error("Password should be 6 to 20 characters long with a numeric, at least 1uppercase letter, one lowercase letter, and one number");
        }

        //send data to the backend
        userAuthThroughServer(serverRoute, formData);

    }
    const handleGoogleAuth = (e) => {
        e.preventDefault();

        authWithGoogle().then(user => {
<<<<<<< HEAD
            let serverRoute = "/google-auth";

            let formData = {
                access_token: user.accessToken
            }

            userAuthThroughServer(serverRoute, formData);
=======
            console.log(user);
>>>>>>> ebe8ea38b571ed7f445c2c7c70cc3ad4473cba6e
        })
        .catch(err => {
            toast.error('Trouble login through Google!');
            console.log(err);
        })
    }


    return (
        access_token ?
        <Navigate to='/' />
        :

        <AnimationWrapper keyValue={type}>
        <section className="h-cover flex items-center justify-center">
            <Toaster />
            <form ref={AuthForm} className="w-[80%] max-w-[400px]">
            {/* <form id="formElement" className="w-[80%] max-w-[400px]"> */}
                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == "sign-in" ? "Welcome back" : "Join Us Today"}
                </h1>
                {
                    type != "sign-in" ?
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="full name"
                            icon="fi-rr-user"
                        /> : ""
                }

                <InputBox
                    name="email"
                    type="email"
                    placeholder="email"
                    icon="fi-rr-envelope"
                />

                <InputBox
                    name="password"
                    type="password"
                    placeholder="password"
                    icon="fi-rr-lock"
                />

                <button 
                className="btn-dark center mt-14"
                type="submit"
                onClick={handleSubmit}
                >   
               
                    {type.replace("-", " ")}
                    
                </button>
                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                    <hr className="w-1/2 border-black" />
                    <p>or</p>
                    <hr className="w-1/2 border-black" />
                </div>

                <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                   onClick={handleGoogleAuth} 
                >

                    <img src={googleIcon} className="w-5" />
                    Continue with Google
                </button>

                {
                    type =="sign-in" ?
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Don't have an account? <Link to="/signup" className="underline text-black text-xl ml-1">Join Us Today</Link>
                    </p>
                    : 
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Already a member? <Link to="/signin" className="underline text-black text-xl ml-1">Sign in here</Link>
                    </p>
                }
            </form>

        </section>
        </AnimationWrapper>
    )
}

export default UserAuthForm;