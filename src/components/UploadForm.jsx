import React, { useState } from "react";
import { motion } from "framer-motion";

export default function UploadForm() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDesc);

    const response = await fetch("https://ai-job-application-assistant-backend.onrender.com/analyze", {
      method: "POST",
      body: formData, // No headers needed for multipart
    });
    const data = await response.json();

    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Job Application Assistant
        </h1>
        <p className="text-gray-600 mt-2">
          Upload your resume & paste a job description to get match score and an
          AI-generated cover letter.
        </p>
      </div>

      {/* Upload Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 space-y-5 border border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Resume Upload */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700">Upload Resume</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="mt-2 w-full border border-dashed border-gray-400 p-3 rounded-lg cursor-pointer
              file:mr-3 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200"
            required
          />
        </div>

        {/* Job Description */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700">Job Description</label>
          <textarea
            className="mt-2 border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            rows="6"
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg shadow-lg hover:opacity-90 transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </motion.button>
      </motion.form>

      {/* Results Section */}
      {result && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Match Score */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Match Score
            </h2>

            {/* Score Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Your Score</span>
              <span className="text-lg font-bold text-gray-900">
                {result.match.match_score}%
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="relative w-full h-6 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-6 rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: `${result.match.match_score}%`,
                  background: `linear-gradient(90deg, #4ade80, #16a34a)`,
                }}
              >
                <span className="absolute right-2 text-white font-semibold text-sm">
                  {result.match.match_score}%
                </span>
              </div>
            </div>

            {/* Optional: small description */}
            <p className="mt-3 text-gray-500 text-sm">
              This score represents how closely your resume matches the job
              description.
            </p>
          </div>

          {/* Missing Skills */}
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-lg font-semibold mb-2">Missing Skills</h2>
            <div className="flex flex-wrap gap-2">
              {result.match.missing_skills.length > 0 ? (
                result.match.missing_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm shadow-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-green-600 font-medium">None 🎉</span>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-lg font-semibold mb-2">
              AI-Generated Cover Letter
            </h2>
            <pre className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700 shadow-inner">
              {result.cover_letter}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(result.cover_letter)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow"
            >
              Copy to Clipboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
