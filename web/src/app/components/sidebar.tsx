import styled from "@emotion/styled";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Card, CardContent, CardHeader, Fab, IconButton, List, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { useConfirmDialog } from "../../lib/components/ConfirmDialog";
import SidebarLayout from "../../lib/components/layouts/SidebarLayout";
import { colorFromString } from "../../lib/util/color";
import useAuth from "../hooks/api/useAuth";
import { appStorage } from "../localStorage";
import { useSelector } from "../store";
import { setTheme } from "../store/settings";

const SidebarContainer = styled(Card)`
  margin: 10px;
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

const Slider = styled.div<{ width: number; show: boolean }>`
  width: ${props => props.show ? props.width : 0}px;
  transform: translateX(${props => props.show ? "0" : `-${props.width}px`});
  transition: width 0.3s, transform 0.3s;
`;

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const { createDialog } = useConfirmDialog();
  const { username, roles } = useSelector(s => s.user);
  const [show, setShow] = useState(appStorage.getItem("showSidebar"));
  const toggleShow = () => {
    setShow(s => {
      appStorage.setItem("showSidebar", !s);
      return !s;
    })
  };
  const theme = useSelector(s => s.settings.theme);
  const dispatch = useDispatch();

  return (
    <>
      <Fab
        className="open-sidebar"
        color="primary"
        size="small"
        onClick={toggleShow}
        sx={{
          position: "fixed",
          bottom: 10,
          left: 10,
          opacity: show ? 0 : 1,
          pointerEvents: show ? "none" : "auto",
          transition: "opacity 0.3s",
        }}
      ><MenuIcon /></Fab>
      <Slider width={320} show={show}>
        <SidebarContainer>
          <CardHeader
            avatar={
              <Avatar sx={{
                bgcolor: colorFromString(username)
              }}>{username.slice(0, 2)}</Avatar>
            }
            action={
              <>
                <IconButton onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}>
                  {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <IconButton onClick={toggleShow}>
                  <ArrowBackIcon />
                </IconButton>
              </>
            }
            title={username}
            subheader={roles.join()}
          />
          <CardContent>
            <List>
              <ListItemButton>
                <ListItemText>Dashboard</ListItemText>
                <DashboardIcon color="secondary" />
              </ListItemButton>
              <ListItemButton onClick={() => createDialog({ onConfirm: logout })}>
                <ListItemText>Logout</ListItemText>
                <LogoutIcon color="secondary" />
              </ListItemButton>
            </List>
          </CardContent>
        </SidebarContainer>
      </Slider>
    </>
  );
};

export const SidebarRoute: React.FC = () => {
  return (
    <SidebarLayout sidebar={<Sidebar />}>
      <Outlet />
    </SidebarLayout>
  );
};
