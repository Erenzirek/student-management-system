import "./home.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <div className="Welcome-Message">
                <p>Welcome to Student Management System</p>
            </div>

            <div className="Home-Container">
                {/* Öğrenci girişi */}
                <div className="Container-Box">
                    {/* Simgeleri basit bir div olarak güncelledik */}
                    <div className="Icon">📚</div>
                    <h1><Link to="/StudentLogin">Student Login</Link></h1>
                    <p>
                        Login as a student to explore course materials and assignments.
                    </p>
                </div>

                {/* Akademisyen girişi */}
                <div className="Container-Box">
                    <div className="Icon">👩‍🏫</div>
                    <h1><Link to="/TeacherLogin">Academician Login</Link></h1>
                    <p>
                        Login as an academician to create courses, assignments, and track students' progress.
                    </p>
                </div>
            </div>
        </>
    );
}

export default Home;