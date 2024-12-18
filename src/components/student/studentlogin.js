import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [students, setStudents] = useState([]);
  const [emailStudent, setEmailStudent] = useState("");
  const [passwordStudent, setPasswordStudent] = useState("");
  const navigate = useNavigate();

  // Tüm öğrencilerin listesini almak için useEffect kullanılır
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

  // Giriş işlemi
  const handleSubmit = (e) => {
    e.preventDefault();

    // Öğrencileri dolaşarak email ve şifreyi doğruluyoruz
    for (let i = 0; i < students.length; i++) {
      if (
        emailStudent === students[i].email &&
        passwordStudent === students[i].password
      ) {
        // Giriş başarılı olduğunda, öğrencinin ID'sine göre yönlendiriyoruz
        navigate(`/student/${students[i].id}`, {
          state: { email: emailStudent, studentNumber: students[i].studentNumber },
        });
        console.log("Giriş başarılı");
        break;
      }
    }

    // Girişten sonra formu sıfırlıyoruz
    setEmailStudent("");
    setPasswordStudent("");
  };

  return (
    <div>
      <h1>Student Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={emailStudent}
          onChange={(e) => setEmailStudent(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={passwordStudent}
          onChange={(e) => setPasswordStudent(e.target.value)}
          required
        />
        <div className="submit-button">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default StudentLogin;
