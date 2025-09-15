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

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      api
        .get(`/auth/verify-email?token=${token}`)
        .then(() => {
          setStatus("success");
          setMessage("Xác thực thành công! Giờ bạn có thể đăng nhập.");
        })
        .catch((err) => {
          setStatus("error");
          setMessage(
            err.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn."
          );
        });
    } else {
      setStatus("error");
      setMessage("Không tìm thấy token xác thực.");
    }
  }, [searchParams]);

  const handleResendEmail = () => {
    // Điều hướng đến trang yêu cầu gửi lại email xác thực
    navigate("/resend-verification");
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
