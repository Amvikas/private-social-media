import { Link } from "react-router-dom";
import { useState } from "react";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ email, username, fullName, password }) => {
            try {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, username, fullName, password }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to create account");
                return data;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Account created successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otpVerified) {
            toast.error("Please verify your email with OTP before signing up.");
            return;
        }
        mutate(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        setOtpLoading(true);
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send OTP");
            setOtpSent(true);
            toast.success("OTP sent to your email!");
        } catch (err) {
            toast.error(err.message);
        }
        setOtpLoading(false);
    };

    const handleVerifyOtp = async () => {
        setOtpLoading(true);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid OTP");
            setOtpVerified(true);
            toast.success("Email verified!");
        } catch (err) {
            toast.error(err.message);
        }
        setOtpLoading(false);
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>
                <img
                    src="/logo/sgp-crew-logo.png"
                    alt="SGP Crew Logo"
                    className="w-85 h-auto mx-auto"
                />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <h1 className='text-4xl font-extrabold text-white'>Namasthe SGP Crew!</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow text-black'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                            disabled={otpSent || otpVerified}
                        />
                        {!otpVerified && (
                            <button
                                type="button"
                                className="btn btn-sm btn-primary ml-2"
                                onClick={handleSendOtp}
                                disabled={otpLoading || !formData.email}
                            >
                                {otpLoading ? "Sending..." : "Send OTP"}
                            </button>
                        )}
                    </label>
                    {otpSent && !otpVerified && (
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                className="input input-bordered text-black"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={handleVerifyOtp}
                                disabled={otpLoading || !otp}
                            >
                                {otpLoading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>
                    )}
                    {otpVerified && (
                        <p className="text-green-500 text-sm">Email verified!</p>
                    )}
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow text-black'
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <MdDriveFileRenameOutline />
                            <input
                                type='text'
                                className='grow text-black'
                                placeholder='Full Name'
                                name='fullName'
                                onChange={handleInputChange}
                                value={formData.fullName}
                            />
                        </label>
                    </div>
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
                        {isPending ? "Loading..." : "Sign up"}
                    </button>
                    {isError && <p className='text-red-500'>{error.message}</p>}
                </form>
                <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                    <p className='text-white text-lg'>Already have an account?</p>
                    <Link to='/login'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SignUpPage;