import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./studentlogin.css";

const StudentLogin = () => {
  const [students, setStudents] = useState([]);
  const [emailStudent, setEmailStudent] = useState("");
  const [passwordStudent, setPasswordStudent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const res = await axios.get("http://localhost:8800/students");
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchAllStudents();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let i = 0; i < students.length; i++) {
      if (
        emailStudent === students[i].email &&
        passwordStudent === students[i].password
      ) {
        navigate(`/student/${students[i].id}`, {
          state: { email: emailStudent, studentNumber: students[i].studentNumber },
        });
        console.log("Giriş başarılı");
        break;
      }
    }

    setEmailStudent("");
    setPasswordStudent("");
  };

  return (
    <>
      <h1 className="Login-Title">Student Login</h1>
      <div className="Login-Container">
        <div className="Login-Box">
          <h1>Login to Your Account</h1>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={emailStudent}
              onChange={(e) => setEmailStudent(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={passwordStudent}
              onChange={(e) => setPasswordStudent(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p className="tosignin">
            Don't have an account? <a href="/StudentSignin" className="signup-link">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default StudentLogin;