import styled from "@emotion/styled";
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Card, CardHeader, IconButton, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarLayout from "../../lib/components/layouts/SidebarLayout";
import useAuth from "../hooks/api/useAuth";
import { useSelector } from "../store";

const SidebarContainer = styled(Card)`
  margin: 10px;
  /* padding: 10px; */

  width: 300px;
  height: calc(100vh - 20px);

  .user {
    display: flex;
    .username {
      flex: 1;
      padding: 10px;
    }
  }
`;

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  const { username, roles } = useSelector(s => s.user);

  return (<SidebarContainer theme={theme}>
    {/* <div className="user">
      <Typography className="username">{username}</Typography>
      <Button onClick={logout}>Logout</Button>
    </div> */}
    <CardHeader>
      <CardHeader
        avatar={
          <Avatar>
            R
          </Avatar>
        }
        action={
          <IconButton onClick={logout}>
            <LogoutIcon />
          </IconButton>
        }
        title={username}
        subheader={roles.join()}
      />
    </CardHeader>
  </SidebarContainer>);
};

export const SidebarRoute: React.FC = () => {
  return (
    <SidebarLayout sidebar={<Sidebar />}>
      <Outlet />
    </SidebarLayout>
  );
};
