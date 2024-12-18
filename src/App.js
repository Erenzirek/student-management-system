import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StudentLogin from './components/student/studentlogin';
import StudentSignin from './components/student/studentsignin';
import StudentDetails from './components/student/studentdetails';
// import Classes from './components/student/classes';
import Home from './components/home';  // Home bileşenini içe aktarıyoruz

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />  {/* Home bileşeni kullanılıyor */}
          <Route path='/StudentSignin' element={<StudentSignin />} />
          <Route path='/StudentLogin' element={<StudentLogin />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          {/* <Route path='/Classes' element={<Classes />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
