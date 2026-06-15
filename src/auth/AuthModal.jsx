export default function AuthModal({ setUser, setModalOpen, showToast }) {
	const [tab, setTab] = useState("login");
	const [step, setStep] = useState("form"); // form | otp | success
	const [form, setForm] = useState({
		username: "",
		email: "",
		phone: "",
		password: "",
		confirm: "",
	});
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [errors, setErrors] = useState({});

	function set(k, v) {
		setForm((f) => ({ ...f, [k]: v }));
	}

	function validateSignup() {
		const e = {};
		if (!form.username.trim()) e.username = "Username required";
		if (!form.email.includes("@")) e.email = "Valid email required";
		if (!form.phone.match(/^\+?[\d\s]{9,}$/))
			e.phone = "Valid phone required";
		if (form.password.length < 6) e.password = "Min 6 characters";
		if (form.password !== form.confirm) e.confirm = "Passwords don't match";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSignup(e) {
		e.preventDefault();
		if (validateSignup()) setStep("otp");
	}

	function handleLogin(e) {
		e.preventDefault();
		if (!form.username.trim()) {
			setErrors({ username: "Required" });
			return;
		}
		if (!form.password) {
			setErrors({ password: "Required" });
			return;
		}
		setUser({
			username: form.username,
			email: form.email || `${form.username}@sokoni.co.ke`,
		});
		setModalOpen(false);
		showToast(`Welcome back, ${form.username}! 👋`, "success");
	}

	function handleOtpChange(idx, val) {
		if (val.length > 1) val = val.slice(-1);
		const next = [...otp];
		next[idx] = val;
		setOtp(next);
		if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
	}

	function verifyOtp() {
		const code = otp.join("");
		if (code.length < 6) {
			showToast("Enter all 6 digits", "warn");
			return;
		}
		setStep("success");
		setTimeout(() => {
			setUser({ username: form.username, email: form.email });
			setModalOpen(false);
			showToast(`Welcome to Sokoni, ${form.username}! 🎉`, "success");
		}, 1800);
	}

	return (
		<div
			className="overlay"
			onClick={(e) => {
				if (e.target.classList.contains("overlay")) setModalOpen(false);
			}}
		>
			<div className="modal">
				<div className="modal-header modal-header-wrap">
					<button
						className="modal-close"
						onClick={() => setModalOpen(false)}
					>
						✕
					</button>
					<div className="modal-logo">
						SOKONI<span>B2B</span>
					</div>
					<div className="modal-tagline">
						East Africa's B2B Wholesale Platform
					</div>
				</div>

				<div className="modal-body">
					{step === "success" ? (
						<div style={{ textAlign: "center", padding: "20px 0" }}>
							<div className="success-icon">✓</div>
							<h3
								style={{
									color: T.blue,
									fontFamily:
										"'Plus Jakarta Sans', sans-serif",
									fontSize: 20,
									fontWeight: 800,
									marginBottom: 8,
								}}
							>
								Account Verified!
							</h3>
							<p style={{ color: T.gray500, fontSize: 14 }}>
								Setting up your account...
							</p>
						</div>
					) : step === "otp" ? (
						<>
							<div
								style={{
									textAlign: "center",
									marginBottom: 20,
								}}
							>
								<div style={{ fontSize: 40, marginBottom: 12 }}>
									📧
								</div>
								<h3
									style={{
										color: T.blue,
										fontFamily:
											"'Plus Jakarta Sans', sans-serif",
										fontSize: 18,
										fontWeight: 800,
										marginBottom: 6,
									}}
								>
									Check Your Email
								</h3>
								<p
									style={{
										color: T.gray500,
										fontSize: 13,
										lineHeight: 1.6,
									}}
								>
									We sent a 6-digit activation code to
									<br />
									<strong style={{ color: T.blue }}>
										{form.email}
									</strong>
								</p>
							</div>
							<div className="otp-row">
								{otp.map((v, i) => (
									<input
										key={i}
										id={`otp-${i}`}
										className="otp-input"
										maxLength={2}
										value={v}
										onChange={(e) =>
											handleOtpChange(i, e.target.value)
										}
										onKeyDown={(e) => {
											if (
												e.key === "Backspace" &&
												!v &&
												i > 0
											)
												document
													.getElementById(
														`otp-${i - 1}`,
													)
													?.focus();
										}}
									/>
								))}
							</div>
							<button
								className="btn-full yellow"
								onClick={verifyOtp}
							>
								Verify & Activate Account
							</button>
							<p
								style={{
									textAlign: "center",
									fontSize: 13,
									color: T.gray500,
									marginTop: 14,
								}}
							>
								Didn't get it?{" "}
								<span
									style={{
										color: T.blueLight,
										fontWeight: 600,
										cursor: "pointer",
									}}
									onClick={() =>
										showToast("Code resent!", "success")
									}
								>
									Resend code
								</span>
							</p>
						</>
					) : (
						<>
							<div className="modal-tabs">
								<div
									className={`modal-tab ${tab === "login" ? "active" : ""}`}
									onClick={() => {
										setTab("login");
										setErrors({});
									}}
								>
									Sign In
								</div>
								<div
									className={`modal-tab ${tab === "signup" ? "active" : ""}`}
									onClick={() => {
										setTab("signup");
										setErrors({});
									}}
								>
									Create Account
								</div>
							</div>

							{tab === "login" ? (
								<form onSubmit={handleLogin}>
									<div className="form-group">
										<label className="form-label">
											Username
										</label>
										<input
											className={`form-input ${errors.username ? "error" : ""}`}
											placeholder="your_username"
											value={form.username}
											onChange={(e) =>
												set("username", e.target.value)
											}
										/>
										{errors.username && (
											<div className="form-error">
												{errors.username}
											</div>
										)}
									</div>
									<div className="form-group">
										<label className="form-label">
											Password
										</label>
										<input
											type="password"
											className={`form-input ${errors.password ? "error" : ""}`}
											placeholder="••••••••"
											value={form.password}
											onChange={(e) =>
												set("password", e.target.value)
											}
										/>
										{errors.password && (
											<div className="form-error">
												{errors.password}
											</div>
										)}
									</div>
									<p
										style={{
											textAlign: "right",
											fontSize: 12,
											color: T.blueLight,
											fontWeight: 600,
											cursor: "pointer",
											marginBottom: 16,
											marginTop: -8,
										}}
									>
										Forgot password?
									</p>
									<button type="submit" className="btn-full">
										Sign In to My Account
									</button>
									<div className="divider">
										<hr />
										<span>or</span>
										<hr />
									</div>
									<p
										style={{
											textAlign: "center",
											fontSize: 13,
											color: T.gray500,
										}}
									>
										New to Sokoni?{" "}
										<span
											style={{
												color: T.blueLight,
												fontWeight: 700,
												cursor: "pointer",
											}}
											onClick={() => setTab("signup")}
										>
											Create an account →
										</span>
									</p>
								</form>
							) : (
								<form onSubmit={handleSignup}>
									<div className="form-group">
										<label className="form-label">
											Username
										</label>
										<input
											className={`form-input ${errors.username ? "error" : ""}`}
											placeholder="business_username"
											value={form.username}
											onChange={(e) =>
												set("username", e.target.value)
											}
										/>
										{errors.username && (
											<div className="form-error">
												{errors.username}
											</div>
										)}
									</div>
									<div className="form-group">
										<label className="form-label">
											Business Email
										</label>
										<input
											type="email"
											className={`form-input ${errors.email ? "error" : ""}`}
											placeholder="you@business.co.ke"
											value={form.email}
											onChange={(e) =>
												set("email", e.target.value)
											}
										/>
										{errors.email && (
											<div className="form-error">
												{errors.email}
											</div>
										)}
										<div className="form-hint">
											Your activation code will be sent
											here
										</div>
									</div>
									<div className="form-group">
										<label className="form-label">
											Phone Number
										</label>
										<input
											className={`form-input ${errors.phone ? "error" : ""}`}
											placeholder="+254 700 000 000"
											value={form.phone}
											onChange={(e) =>
												set("phone", e.target.value)
											}
										/>
										{errors.phone && (
											<div className="form-error">
												{errors.phone}
											</div>
										)}
									</div>
									<div className="form-group">
										<label className="form-label">
											Password
										</label>
										<input
											type="password"
											className={`form-input ${errors.password ? "error" : ""}`}
											placeholder="Min 6 characters"
											value={form.password}
											onChange={(e) =>
												set("password", e.target.value)
											}
										/>
										{errors.password && (
											<div className="form-error">
												{errors.password}
											</div>
										)}
									</div>
									<div className="form-group">
										<label className="form-label">
											Confirm Password
										</label>
										<input
											type="password"
											className={`form-input ${errors.confirm ? "error" : ""}`}
											placeholder="Repeat password"
											value={form.confirm}
											onChange={(e) =>
												set("confirm", e.target.value)
											}
										/>
										{errors.confirm && (
											<div className="form-error">
												{errors.confirm}
											</div>
										)}
									</div>
									<button
										type="submit"
										className="btn-full yellow"
									>
										Create Account & Get Code
									</button>
									<p
										style={{
											textAlign: "center",
											fontSize: 11,
											color: T.gray500,
											marginTop: 12,
											lineHeight: 1.6,
										}}
									>
										By signing up you agree to Sokoni's{" "}
										<span
											style={{
												color: T.blueLight,
												cursor: "pointer",
											}}
										>
											Terms of Service
										</span>{" "}
										and{" "}
										<span
											style={{
												color: T.blueLight,
												cursor: "pointer",
											}}
										>
											Privacy Policy
										</span>
									</p>
								</form>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
