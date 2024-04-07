import styled from "@emotion/styled";
import { Button, Theme, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarLayout from "../../lib/components/layouts/SidebarLayout";
import useAuth from "../hooks/api/useAuth";

const SidebarContainer = styled.div<{ theme: Theme }>`
  margin: 10px;
  padding: 10px;
  background-color: ${props => props.theme.palette.background.paper};
  border-radius: 10px;
`;

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const { logout } = useAuth();

  return (<SidebarContainer theme={theme}>
    <div>sidebar</div>
    <Button onClick={logout}>Logout</Button>
  </SidebarContainer>);
};

export const SidebarRoute: React.FC = () => {
  return (
    <SidebarLayout sidebar={<Sidebar />}>
      <Outlet />
    </SidebarLayout>
  );
};
