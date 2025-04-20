import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

const Login = () => {
  return (
    <div style={{ alignItems: "center" }}>
        <h2>Login</h2>
        <Link to="/" >סטודנט חכם</Link>
        <Link to="/signup">
            <Button>Signup</Button>
        </Link>
    </div>
  );
};

export default Login;
