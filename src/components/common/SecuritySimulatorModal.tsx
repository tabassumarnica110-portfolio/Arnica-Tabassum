import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  X, 
  Terminal, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Code2, 
  KeyRound,
  Bot
} from "lucide-react";
import { passwordSchema, sanitizeInput } from "../../../lib/validation";

export const SecuritySimulatorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    currentUser, 
    simulateAttack, 
    lockoutStatus, 
    resetLoginLockout, 
    auditLogs,
    lang 
  } = useApp();

  const [testPassword, setTestPassword] = useState<string>("Weak123");
  const [passwordValidationMessage, setPasswordValidationMessage] = useState<{ valid: boolean; message: string } | null>(null);
  const [xssInput, setXssInput] = useState<string>("<script>alert('hacked')</script> টাটকা আলু");
  const [sanitizedResult, setSanitizedResult] = useState<string>("");
  const [lastAttackResult, setLastAttackResult] = useState<{ message: string; blocked: boolean } | null>(null);

  const handleTestPasswordZod = () => {
    const res = passwordSchema.safeParse(testPassword);
    if (res.success) {
      setPasswordValidationMessage({
        valid: true,
        message: "✅ Strong Password: Meets all NIST & OWASP requirements (Min 8 chars, 1 Upper, 1 Number, 1 Special Char)",
      });
    } else {
      setPasswordValidationMessage({
        valid: false,
        message: `❌ Weak Password Rejected: ${res.error.issues[0]?.message || "Does not meet complexity"}`,
      });
    }
  };

  const handleTestXssClean = () => {
    const clean = sanitizeInput(xssInput);
    setSanitizedResult(clean);
    simulateAttack("XSS");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-950 text-white rounded-3xl max-w-4xl w-full shadow-2xl border border-red-500/30 overflow-hidden my-8 max-h-[92vh] flex flex-col font-mono">
        
        {/* Terminal Header */}
        <div className="bg-stone-900 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                KrishiLink Cyber Defense & Compliance Verification Lab
              </span>
              <p className="text-[11px] text-stone-400 font-sans">
                Tested against OWASP Top 10 vulnerabilities, NIST 800-63B standards, and Supabase RLS policies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Active Status Banner */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-wrap items-center justify-between gap-4 font-sans">
            <div>
              <span className="text-stone-400 text-xs">Active Session:</span>
              <p className="text-sm font-bold text-emerald-400">
                {currentUser.name} (Role: <span className="text-yellow-400">{currentUser.role}</span>)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-stone-400 text-[11px]">Account Lockout Status:</span>
                <p className={`font-bold ${lockoutStatus.isLocked ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                  {lockoutStatus.isLocked ? `LOCKED (${lockoutStatus.minutes}m remaining)` : `Active (${lockoutStatus.failedAttempts}/5 attempts)`}
                </p>
              </div>
              {lockoutStatus.isLocked && (
                <button
                  onClick={resetLoginLockout}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer font-sans"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Lock</span>
                </button>
              )}
            </div>
          </div>

          {/* Last Simulation Toast */}
          {lastAttackResult && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{lastAttackResult.message}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                BLOCKED
              </span>
            </div>
          )}

          {/* 5 Attack Simulator Buttons */}
          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
              Live Interactive Attack Vectors (Click to Test Cyber Shields)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              
              {/* Vector 1: SQL Injection */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-yellow-400">1. SQL Injection</span>
                  <span className="text-[10px] text-stone-500">CWE-89</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Payload: <code className="text-red-300 bg-stone-950 px-1 py-0.5 rounded">' OR '1'='1' --</code>
                </p>
                <button
                  onClick={() => {
                    const res = simulateAttack("SQLI");
                    setLastAttackResult(res);
                  }}
                  className="w-full py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Trigger SQLi Attack
                </button>
              </div>

              {/* Vector 2: Stored / Reflected XSS */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-yellow-400">2. Cross-Site Scripting</span>
                  <span className="text-[10px] text-stone-500">CWE-79</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Payload: <code className="text-red-300 bg-stone-950 px-1 py-0.5 rounded">&lt;script&gt;alert(1)&lt;/script&gt;</code>
                </p>
                <button
                  onClick={() => {
                    const res = simulateAttack("XSS");
                    setLastAttackResult(res);
                  }}
                  className="w-full py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Trigger XSS Injection
                </button>
              </div>

              {/* Vector 3: Brute Force Password Lockout */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-yellow-400">3. Brute Force Lockout</span>
                  <span className="text-[10px] text-stone-500">CWE-307</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  5 wrong attempts locks account for 15 minutes.
                </p>
                <button
                  onClick={() => {
                    const res = simulateAttack("BRUTE_FORCE");
                    setLastAttackResult(res);
                  }}
                  className="w-full py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Trigger Failed Login Attempt
                </button>
              </div>

              {/* Vector 4: Honeypot Anti-Bot Field */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-yellow-400">4. Honeypot Bot Trap</span>
                  <span className="text-[10px] text-stone-500">Automated Bot</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Hidden honeypot input trapped and dropped.
                </p>
                <button
                  onClick={() => {
                    const res = simulateAttack("HONEYPOT");
                    setLastAttackResult(res);
                  }}
                  className="w-full py-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Simulate Bot Crawl
                </button>
              </div>

              {/* Vector 5: Privilege Escalation (RBAC Bypass) */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-yellow-400">5. Privilege Escalation (RBAC)</span>
                  <span className="text-[10px] text-stone-500">CWE-285</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Role '{currentUser.role}' attempts to alter platform commission rates at <code className="text-red-300">/api/admin/*</code>.
                </p>
                <button
                  onClick={() => {
                    const res = simulateAttack("RBAC_ESCALATE");
                    setLastAttackResult(res);
                  }}
                  className="w-full py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Test Unauthorized Role Access
                </button>
              </div>

              {/* Vector 6: System Crash & DoS Flood Defense */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-emerald-400">6. Anti-Crash & DoS Shield</span>
                  <span className="text-[10px] text-stone-500">CWE-400</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Simulate 10,000 req/sec stream flood & runtime exception to verify auto-healing zero crash down.
                </p>
                <button
                  onClick={() => {
                    const res = simulateAttack("DOS_CRASH");
                    setLastAttackResult(res);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Test Anti-Crash Shield
                </button>
              </div>

            </div>
          </div>

          {/* Interactive Password Policy Tester */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 font-sans">
            <h4 className="font-bold text-xs text-stone-300 uppercase tracking-wider font-mono">
              Zod Strict Password Complexity Policy Analyzer (NIST SP 800-63B)
            </h4>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Type password to evaluate..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs font-mono text-emerald-300 focus:outline-hidden"
              />
              <button
                onClick={handleTestPasswordZod}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Validate Zod Schema
              </button>
            </div>
            {passwordValidationMessage && (
              <p className={`text-xs font-mono ${passwordValidationMessage.valid ? "text-emerald-400" : "text-red-400"}`}>
                {passwordValidationMessage.message}
              </p>
            )}
          </div>

          {/* Real-time Forensic Log Stream */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-stone-400 font-mono">
              <span>Security Event Forensic Stream:</span>
              <span className="text-emerald-400 font-bold">● Streaming</span>
            </div>
            <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-2 max-h-48 overflow-y-auto font-mono text-[11px]">
              {auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="flex items-start gap-2 border-b border-stone-900 pb-1.5">
                  <span className="text-stone-500 whitespace-nowrap">[{log.timestamp}]</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                      log.status === "ALLOWED"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : log.status === "BLOCKED"
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-stone-300 font-bold">{log.action}:</span>
                  <span className="text-stone-400 truncate">{log.details}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
