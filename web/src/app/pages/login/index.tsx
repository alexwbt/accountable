import styled from "@emotion/styled";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CenterCardLayout from "../../../lib/components/layouts/CenterCardLayout";
import useKeyListener from "../../../lib/hooks/event/useKeyListener";
import useLoadable from "../../../lib/hooks/useLoadable";
import useAuth from "../../hooks/api/useAuth";

const LoginPageContainer = styled.div`
  .login-paper {
    padding: 20px;
    text-align: center;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, enter] = useLoadable(async () => {
    if (!username || !password) return;
    await login(username, password);
  });

  useKeyListener(["Enter"], [], enter);

  return (
    <LoginPageContainer>
      <CenterCardLayout>
        <Paper className="login-paper">
          <Typography variant="h4" padding={3}>Login</Typography>
          <div className="login-form">
            <TextField
              size="small"
              disabled={loading}
              label="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              size="small"
              disabled={loading}
              label="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)} />
            <Button onClick={enter} disabled={loading}>Enter</Button>
          </div>
        </Paper>
      </CenterCardLayout>
    </LoginPageContainer>
  );
};

export default LoginPage;
