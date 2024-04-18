import { useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";

/* useRef is a tool in React that helps you keep track of things in your app without causing it to rerender. */  

const UserAuthForm = ({ type }) => {
    
    const AuthForm = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();

        //formData
        let form = new FormData(AuthForm.current);
        console.log(form);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        console.log(formData);
    }


    return (
        <AnimationWrapper keyValue={type}>
        <section className="h-cover flex items-center justify-center">
            <form ref={AuthForm} className="w-[80%] max-w-[400px]">
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
                    <hr className="w-1/2" border-black/>
                    <p>or</p>
                    <hr className="w-1/2" border-black/>
                </div>

                <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
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