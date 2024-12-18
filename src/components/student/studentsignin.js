import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./studentsignin.css";

const Add = () => {
  const [student, setStudent] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    studentNumber: "",
  });
  const [existingEmails, setExistingEmails] = useState([]);
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingEmails = async () => {
      try {
        const res = await axios.get("http://localhost:8800/students");
        const emails = res.data.map((student) => student.email);
        setExistingEmails(emails);
      } catch (err) {
        console.log(err);
      }
    };

    fetchExistingEmails();
  }, []);

  const handleChange = (e) => {
    setStudent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEmailError(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(student.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (existingEmails.includes(student.email)) {
      setEmailError(true);
      return;
    }

    try {
      await axios.post("http://localhost:8800/students", student);
      navigate("/StudentList");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="Student-Register-Container">
      <h1>Student Registration</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={student.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Surname"
          name="surname"
          value={student.surname}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={student.email}
          onChange={handleChange}
          required
        />
        {emailError && <p className="error">This email is already in use.</p>}
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={student.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Student Number"
          name="studentNumber"
          value={student.studentNumber}
          onChange={handleChange}
          required
        />
        <div className="submit-button">
          <button type="submit">Sign In</button>
        </div>
        <div className="footer">
          <p>Do you have an account? <a href="/StudentLogin">Login</a></p>
        </div>
      </form>
      {error && <p className="error">Something went wrong!</p>}
    </div>
  );
};

export default Add;
