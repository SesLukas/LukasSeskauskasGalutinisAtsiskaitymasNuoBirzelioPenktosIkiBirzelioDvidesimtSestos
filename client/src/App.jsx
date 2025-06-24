import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from './components/navbar.jsx';
import Questions from "./pages/Questions";
import QuestionForm from "./pages/QuestionForm";
import SingleQuestion from "./pages/SingleQuestion";
import QuestionDetails from "./pages/QuestionDetails";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/questions/new" element={<QuestionForm />} />
        <Route path="/questions/:id" element={<SingleQuestion />}
         />
         <Route path="/questions/:id" element={<QuestionDetails />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
