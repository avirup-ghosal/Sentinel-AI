import { useState } from "react";

const GITHUB_REGEX =
  /^(https:\/\/github\.com\/)[\w.-]+\/[\w.-]+(\/)?$/;

export default function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    setStatus(null);

    if (!GITHUB_REGEX.test(repoUrl)) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    setLoading(true);

    // 🔧 Backend integration comes next
    setTimeout(() => {
      setLoading(false);
      setStatus("Repository accepted. Analysis will start shortly...");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            SecureOpsAI
          </h1>
          <p className="text-zinc-400 mt-2">
            AI-powered DevSecOps automation for any GitHub repository
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-medium py-3 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Repository"}
          </button>

          {error && (
            <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3">
              {error}
            </div>
          )}

          {status && (
            <div className="text-sm text-green-400 bg-green-900/20 border border-green-800 rounded-lg p-3">
              {status}
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-zinc-500 text-center">
          Supports public GitHub repositories
        </div>
      </div>
    </div>
  );
}
