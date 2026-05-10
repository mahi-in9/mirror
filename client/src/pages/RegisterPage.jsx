import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ParticleField from "../components/ParticleField";
import Navbar from "../components/Navbar";

const VIBE_OPTIONS = [
  "chaotic good",
  "overthinking",
  "main character",
  "quiet menace",
  "emotionally unavailable",
  "surprisingly wholesome",
  "chronically online",
  "dangerous advice",
  "midnight philosopher",
  "accidentally iconic",
];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [vibeTags, setVibeTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleVibe = (v) => {
    setVibeTags((prev) =>
      prev.includes(v)
        ? prev.filter((t) => t !== v)
        : prev.length < 5
          ? [...prev, v]
          : prev,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.email || !form.password) {
      return toast.error("Fill in all fields");
    }
    if (form.password.length < 6)
      return toast.error("Password must be 6+ characters");

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { ...form, vibeTags });
      
      login(data.token, data.user);
      toast.success("Mirror created! 🪞");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex flex-col relative">
      <ParticleField count={30} />
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🪞</div>
            <h1 className="font-display text-3xl font-extrabold text-bright mb-2">
              Create Your Mirror
            </h1>
            <p className="text-muted-2">
              Set up your link. Let friends spill the truth.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8 border border-border space-y-5"
          >
            <div>
              <label className="block text-xs font-mono text-muted-2 mb-2 uppercase tracking-widest">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Priya"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-surface-2 border border-border focus:border-neon rounded-xl px-4 py-3 text-bright placeholder-muted outline-none transition-colors font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-2 mb-2 uppercase tracking-widest">
                Username
              </label>
              <div className="flex items-center bg-surface-2 border border-border focus-within:border-neon rounded-xl px-4 py-3 transition-colors">
                <span className="text-muted font-mono text-sm mr-1">
                  mirror.app/u/
                </span>
                <input
                  type="text"
                  placeholder="priya-xk8"
                  value={form.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]/g, ""),
                    })
                  }
                  className="flex-1 bg-transparent text-bright placeholder-muted outline-none font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-2 mb-2 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-surface-2 border border-border focus:border-neon rounded-xl px-4 py-3 text-bright placeholder-muted outline-none transition-colors font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-2 mb-2 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-surface-2 border border-border focus:border-neon rounded-xl px-4 py-3 text-bright placeholder-muted outline-none transition-colors font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-2 mb-3 uppercase tracking-widest">
                Your Vibe Tags{" "}
                <span className="text-muted">(pick up to 5)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {VIBE_OPTIONS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => toggleVibe(v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold border transition-all ${
                      vibeTags.includes(v)
                        ? "bg-neon text-void border-neon"
                        : "border-border text-muted-2 hover:border-border-bright"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 bg-neon text-void font-display font-bold text-lg rounded-xl disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-void border-t-transparent rounded-full animate-spin" />
                  Creating mirror...
                </span>
              ) : (
                "Create My Mirror 🪞"
              )}
            </motion.button>

            <p className="text-center text-sm text-muted-2">
              Already have a mirror?{" "}
              <Link to="/login" className="text-neon hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
