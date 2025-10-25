import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMsg("Password reset successful! You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <form className="bg-gray-900 p-8 rounded shadow-md flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <input
          type="password"
          className="input input-bordered text-black"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary text-white" type="submit">
          Reset Password
        </button>
        {msg && <div className="text-green-500">{msg}</div>}
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default ResetPasswordPage;