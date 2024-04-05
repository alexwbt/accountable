import styled from "@emotion/styled";
import CommonProps from "../CommonProps";
import ExpandLayout from "./ExpandLayout";

type Props = CommonProps<{
  width?: string;
  height?: string;
  transform?: string;
}>;

const CenterCardContainer = styled.div<Props>`
  position: absolute;
  width: ${props => props.width || "auto"};
  height: ${props => props.height || "auto"};
  top: 50%;
  left: 50%;
  transform: ${props => props.transform || "translate(-50%, -50%)"};
`;

const CenterCardLayout: React.FC<Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <ExpandLayout className={className}>
      <CenterCardContainer {...props}>
        {children}
      </CenterCardContainer>
    </ExpandLayout>
  );
};

export default CenterCardLayout;
