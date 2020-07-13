import React, { useState } from "react";

// 1) filll form
// 2) send to server
// 3) if valid data - redicert to home page, and save user in local storage
// if not valid data - show error message

function Register(props) {
   console.log("Register props", props);

   const [form, setForm] = useState({ fname: "", lname: "", email: "", password: "" });
   function onSubmit(event) {
      // prevet default form behavior
      event.preventDefault();
      const fname = event.target.fname.value;
      const lname = event.target.lname.value;
      const email = event.target.email.value;
      const password = event.target.password.value;

      // validate data in server (Fetch)
      fetch("http://localhost:5000/users/register", {
         method: "POST",
         headers: {
            "Content-Type": "application/json", // body type
         },
         body: JSON.stringify({
            fname,
            lname,
            email,
            password,
         }),
      })
         .then(function (response) {
            // run after get response from server
            console.log("res", response);
            return response.json(); // wait to body data from server (PROMISE)
         })
         .then(function (body) {
            //   run after all body back from server
            if (body.message === "Success") {
               localStorage.setItem("loggedinUser", JSON.stringify(email));
               props.history.push("/");
            } else {
               alert(body.message);
            }
            console.log(body);
         });
      // if success

      // save user form server in local storage

      // redirect to home
   }

   function onChange(event) {
      {
         const { name, value } = event.target;
         setForm({ ...form, [name]: value });
      }
   }

   console.log("form", form);

   return (
      <div>
         <header className='log-header'>
            <h1 className='welcome'>Welcome To StopWatch</h1>
            <h2 className='catch'>Time Mangement for the professional freelancer</h2>
         </header>
         <div className='login-container'>
            <h2 className='please'>Register below</h2>

            <form onSubmit={onSubmit}>
               <label For='loginfnane'>First Name</label>
               <input className='user-login' id='fname' value={form.fname} name='fname' onChange={onChange} /> <br />
               <label For='loginlnane'>Last Name</label>
               <input className='user-login' id='lname' value={form.lname} name='lname' onChange={onChange} /> <br /> <br />
               <br />
               <label For='loginemail'>Email</label>
               <input className='user-login' id='loginemail' value={form.email} name='email' onChange={onChange} /> <br />
               <label For='loginpassword'>Password</label>
               <input
                  className='user-login'
                  id='loginpassword'
                  type='password'
                  name='password'
                  value={form.password}
                  onChange={onChange}
               />{" "}
               <br />
               <button className='control-btn start-button login-btn' type='sumbit'>
                  Register
               </button>
               <br />
               <p>Or</p>
               <a href='http://localhost:3000/register'>Log In as existing user</a>
            </form>
         </div>
      </div>
   );
}

export default Register;
