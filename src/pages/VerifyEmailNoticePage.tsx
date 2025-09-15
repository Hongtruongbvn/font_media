import React from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../services/api";
import Button from "../components/common/Button";
import "./StatusPages.scss";
import { toast } from "react-toastify";

const VerifyEmailNoticePage: React.FC = () => {
  const location = useLocation();
  const { email, mailInfo } = location.state || {};

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      await api.post("/api/auth/resend-verification", { email });
      toast.done("Liên kết xác thực mới đã được gửi.");
    } catch (err) {
      toast.warn("Không thể gửi lại email xác thực.");
    }
  };

  return (
    <div className="status-page">
      <div className="status-card info">
        <h2>Đăng ký thành công!</h2>
        <p>
          Vui lòng kiểm tra email của bạn để xác thực tài khoản trước khi đăng
          nhập.
        </p>

        {mailInfo && !mailInfo.success && (
          <div className="warning-message">
            <p>Có lỗi khi gửi email xác thực: {mailInfo.error}</p>
          </div>
        )}

        <p>Nếu không thấy email, hãy kiểm tra thư mục spam hoặc</p>

        <Button onClick={handleResendEmail} style={{ margin: "10px 0" }}>
          Gửi lại liên kết xác thực
        </Button>

        <Link to="/login">
          <Button>Về trang Đăng nhập</Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailNoticePage;
