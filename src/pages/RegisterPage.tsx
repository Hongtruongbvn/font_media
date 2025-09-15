import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      if (response.data.message === "Đăng ký thành công!") {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực."
        );

        // Chuyển hướng đến trang thông báo xác thực email
        navigate("/verify-email-notice", {
          state: {
            email: email,
            mailInfo: response.data.mailInfo,
          },
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Tạo tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>
        <div className="form-footer">
          <span>
            Đã có tài khoản?{" "}
            <Link to="/login" className="link">
              Đăng nhập
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
