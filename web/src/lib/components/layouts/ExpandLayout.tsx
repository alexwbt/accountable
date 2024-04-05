import styled from "@emotion/styled";
import CommonProps from "../CommonProps";

const ExpandLayoutContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  > * {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }
`;

const ExpandLayout: React.FC<CommonProps> = ({
  className,
  children
}) => {
  return (
    <ExpandLayoutContainer className={className}>
      {children}
    </ExpandLayoutContainer>
  );
};

export default ExpandLayout;
