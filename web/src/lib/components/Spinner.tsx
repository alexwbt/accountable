import { CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import CommonProps from "./CommonProps";

const SpinnerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  .spinner {
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    position: absolute;
    display: inline-block;
    transform: translate(-50%, -50%);
  }
`;

const InlineSpinnerContainer = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
`;

const Spinner: React.FC<CommonProps<{ inline?: boolean; }>> = ({ className, inline }) => {
  const spinner = (
    <SpinnerContainer className={className}>
      <div className="spinner">
        <CircularProgress />
      </div>
    </SpinnerContainer>
  );
  return (
    inline
      ? <InlineSpinnerContainer>{spinner}</InlineSpinnerContainer>
      : spinner
  );
};

export default Spinner;
