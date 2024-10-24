import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from 'axios';
import logo from '../assets/Logos/StudySphere_logo.png'; // Ensure this is the correct path

const SignUp = () => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('study-sphere-psi.vercel.app/api/users/register', { username, email, password });
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <div className='h-screen bg-cover bg-no-repeat bg-center bg-fixed'>
            <div className="max-w-lg m-auto pt-44 font-myfont">
                <div className="bg-white/ backdrop-blur-xl rounded-lg shadow-xl overflow-hidden">
                    <div className="p-8">
                        {/* Logo */}
                        <img src={logo} alt="Logo" className="h-20 mb-6 mx-auto bg-black" />
                        <h2 className="text-center text-3xl font-extrabold text-black">Hello User!!!</h2>
                        <p className="mt-4 text-center text-gray-700">Register yourself to continue</p>
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="rounded-md shadow-sm">
                                <div className="mt-4">
                                    <input
                                        placeholder="Username"
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md"
                                        required
                                        value={username}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="username"
                                        type="text"
                                        id="username"
                                    />
                                </div>
                                <div className="mt-4">
                                    <input
                                        placeholder="Email address"
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        type="email"
                                        id="email"
                                    />
                                </div>
                                <div className="mt-4">
                                    <input
                                        placeholder="Password"
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        id="password"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-blue-500 hover:bg-indigo-600"
                                    type="submit"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="px-8 py-4 bg-white/ backdrop-blur-xl text-center">
                        <span className="text-gray-700">Already have an account? </span>
                        <NavLink className="font-medium text-blue-500 hover:text-blue-600" to="/login">Sign in</NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
