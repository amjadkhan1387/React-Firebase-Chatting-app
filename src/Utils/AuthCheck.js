import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const LoginCheck = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("loginStatus")==="0" || localStorage.getItem("loginStatus")===null) {
      navigate("/login");
    }
  });
};
export const IsLogin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("loginStatus")==="1") {
      navigate("/");
    }
  });
};


