import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../components/common/Button";
import "./StatusPages.scss";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Đang xác thực email của bạn...");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    setToken(tokenFromUrl);

    if (tokenFromUrl) {
      verifyEmailToken(tokenFromUrl);
    } else {
      setStatus("error");
      setMessage("Không tìm thấy token xác thực.");
    }
  }, [searchParams]);

  const verifyEmailToken = async (token: string) => {
    try {
      // Use POST instead of GET for better security
      const response = await api.post("/api/auth/verify-email", { token });
      setStatus("success");
      setMessage(
        response.data.message ||
          "Xác thực thành công! Giờ bạn có thể đăng nhập."
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Email đã được xác thực thành công. Vui lòng đăng nhập.",
          },
        });
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Token không hợp lệ hoặc đã hết hạn.";
      setMessage(errorMessage);

      // Log the error for debugging
      console.error("Email verification error:", err.response?.data);
    }
  };

  const handleResendEmail = async () => {
    try {
      await api.post("/api/auth/resend-verification", { token });
      setMessage(
        "Liên kết xác thực mới đã được gửi. Vui lòng kiểm tra email của bạn."
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể gửi lại email xác thực.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="status-page">
      <div className={`status-card ${status}`}>
        <h2>
          {status === "success"
            ? "Thành công!"
            : status === "error"
            ? "Thất bại!"
            : "Đang xử lý..."}
        </h2>
        <p>{message}</p>

        {status === "error" && (
          <Button onClick={handleResendEmail} style={{ margin: "10px 0" }}>
            Gửi lại email xác thực
          </Button>
        )}

        {status === "success" && (
          <div style={{ marginTop: "20px" }}>
            <p>
              Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát...
            </p>
          </div>
        )}

        {status !== "verifying" && (
          <Link to="/login">
            <Button>Về trang Đăng nhập</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
