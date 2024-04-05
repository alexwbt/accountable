import styled from "@emotion/styled";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CenterCardLayout from "./layouts/CenterCardLayout";

const ErrorPageContainer = styled.div`
  text-align: center;
  .warning-icon {
    width: 100px;
    height: 100px;
    color: grey;
  }
  .message {
    font-size: 40px;
    color: grey;
  }
`;

const ErrorPage: React.FC<{
  message: string;
}> = ({ message }) => {
  return (
    <CenterCardLayout>
      <ErrorPageContainer>
        <WarningRoundedIcon className="warning-icon" />
        <div className="message">{message}</div>
      </ErrorPageContainer>
    </CenterCardLayout>
  );
};

export default ErrorPage;
