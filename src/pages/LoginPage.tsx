import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import api from "../services/api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });

      // ✅ lưu token vào AuthContext + localStorage (key thống nhất: "token")
      const token = response.data.accessToken;
      login(token);
      localStorage.setItem("token", token);

      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Đăng nhập thất bại";
      toast.error(errorMessage);

      // Nếu là lỗi chưa verify email, cung cấp option để gửi lại email
      if (errorMessage.includes("chưa được xác thực email")) {
        // Có thể thêm logic để gửi lại email xác thực ở đây
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
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
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>
        <div className="form-footer">
          <Link to="/forgot-password" className="link">
            Quên mật khẩu?
          </Link>
          <span>
            Chưa có tài khoản?{" "}
            <Link to="/register" className="link">
              Đăng ký ngay
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
