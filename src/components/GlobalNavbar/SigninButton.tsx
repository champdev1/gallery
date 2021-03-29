import styled from 'styled-components';
import useAuthModal from 'hooks/useAuthModal';

function SigninButton() {
  const displayAuthModal = useAuthModal();
  return <StyledButton onClick={displayAuthModal}>Sign In</StyledButton>;
}

const StyledButton = styled.button`
  padding: 8px 16px;
  border-style: none;
  text-transform: uppercase;
  background: black;
  color: white;
`;

export default SigninButton;