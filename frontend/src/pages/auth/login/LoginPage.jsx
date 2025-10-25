import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMsg, setResetMsg] = useState("");
    const queryClient = useQueryClient();

    const {
        mutate: loginMutation,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    // Mutation for forgot password
    const {
        mutate: forgotPassword,
        isPending: isResetting,
        isError: isResetError,
        error: resetError,
    } = useMutation({
        mutationFn: async (email) => {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send reset email");
            return data;
        },
        onSuccess: () => {
            setResetMsg("Hyy Guys Check your email.");
        },
        onError: () => {
            setResetMsg("");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleForgotSubmit = (e) => {
        e.preventDefault();
        forgotPassword(resetEmail);
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>
                <img
                    src="/logo/sgp-crew-logo.png"
                    alt="SGP Crew Logo"
                    className="w-85 h-auto mx-auto"
                />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                {!showForgot ? (
                    <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                        <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
                        <label className='input input-bordered rounded flex items-center gap-2'>
                            <MdOutlineMail />
                            <input
                                type='text'
                                className='grow text-black'
                                placeholder='username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className='input input-bordered rounded flex items-center gap-2'>
                            <MdPassword />
                            <input
                                type='password'
                                className='grow text-black'
                                placeholder='Password'
                                name='password'
                                onChange={handleInputChange}
                                value={formData.password}
                            />
                        </label>
                        <button className='btn rounded-full btn-primary text-white'>
                            {isPending ? "Loading..." : "Login"}
                        </button>
                        <button
                            type="button"
                            className="text-blue-400 underline text-left"
                            onClick={() => setShowForgot(true)}
                        >
                            Forgot password?
                        </button>
                        {isError && <p className='text-red-500'>{error.message}</p>}
                    </form>
                ) : (
                    <form className='flex gap-4 flex-col' onSubmit={handleForgotSubmit}>
                        <h1 className='text-2xl font-bold text-white'>Reset Password</h1>
                        <label className='input input-bordered rounded flex items-center gap-2'>
                            <MdOutlineMail />
                            <input
                                type='email'
                                className='grow text-black'
                                placeholder='Enter your email'
                                value={resetEmail}
                                onChange={e => setResetEmail(e.target.value)}
                                required
                            />
                        </label>
                        <button className='btn rounded-full btn-primary text-white' type="submit">
                            {isResetting ? "Sending..." : "Send reset link"}
                        </button>
                        <button
                            type="button"
                            className="text-blue-400 underline text-left"
                            onClick={() => {
                                setShowForgot(false);
                                setResetMsg("");
                            }}
                        >
                            Back to login
                        </button>
                        {isResetError && <p className='text-red-500'>{resetError.message}</p>}
                        {resetMsg && <p className='text-green-500'>{resetMsg}</p>}
                    </form>
                )}
                <div className='flex flex-col gap-2 mt-4'>
                    <p className='text-white text-lg'>{"Don't"} have an account?</p>
                    <Link to='/signup'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;