import styled from "@emotion/styled";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CenterCardLayout from "../../../lib/components/layouts/CenterCardLayout";
import useKeyListener from "../../../lib/hooks/event/useKeyListener";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useKeyListener(["Enter"], [], () => {
    console.log(username, password);
  });

  return (
    <LoginPageContainer>
      <CenterCardLayout>
        <Paper className="login-paper">
          <Typography variant="h4" padding={3}>Login</Typography>
          <div className="login-form">
            <TextField size="small" label="username" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField size="small" label="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <Button>Enter</Button>
          </div>
        </Paper>
      </CenterCardLayout>
    </LoginPageContainer>
  );
};

export default LoginPage;
