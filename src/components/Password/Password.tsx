import { useCallback, useState } from 'react';
import Button from 'components/core/Button/Button';
import colors from 'components/core/colors';
import Spacer from 'components/core/Spacer/Spacer';
import styled, { keyframes } from 'styled-components';
import usePersistedState from 'hooks/usePersistedState';
import { validatePassword } from 'utils/password';

type Props = {
  handleNextClick: () => void;
};

function Password({ handleNextClick }: Props) {
  const [isFormVisibleAndUnlocked, setIsFormVisibleAndUnlocked] = useState(
    false
  );
  const [storedPassword, storePassword] = usePersistedState('password', null);
  const isStoredPasswordValid =
    storedPassword && validatePassword(storedPassword);

  const unlock = useCallback(() => {
    setIsFormVisibleAndUnlocked(true);
  }, []);
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const userValue = event.target.elements.password.value;
      const isPasswordValid = validatePassword(userValue);

      if (isPasswordValid) {
        storePassword(userValue);
        unlock();
      }
    },
    [storePassword, unlock]
  );

  const handleClick = useCallback(() => {
    handleNextClick();
  }, [handleNextClick]);

  if (isStoredPasswordValid && !isFormVisibleAndUnlocked) {
    return (
      <StyledPasswordContainer>
        <Spacer height={40} />
        <StyledButton text="Enter" onClick={handleClick} />
      </StyledPasswordContainer>
    );
  }

  return (
    <StyledPasswordContainer>
      <StyledForm onSubmit={handleSubmit}>
        <StyledPasswordInput
          disabled={isFormVisibleAndUnlocked}
          name="password"
          placeholder="Enter password"
        />
      </StyledForm>
      {isFormVisibleAndUnlocked && (
        <AnimatedStyledButton text="Enter" onClick={handleClick} />
      )}
    </StyledPasswordContainer>
  );
}

const StyledPasswordContainer = styled.div`
  margin-top: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const INPUT_WIDTH = 203;

const StyledPasswordInput = styled.input`
  margin: 20px 0 10px;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  width: ${INPUT_WIDTH}px;
  border: 1px solid ${colors.gray10};

  line-height: 1.25rem;
  outline-color: ${colors.black} !important;
  -webkit-text-security: disc;

  transition: outline 0.5s, background-color 0.5s;
  z-index: 10;

  &active: {
    border-width: 2px;
  }
  :disabled {
    background-color: ${colors.gray10};
  }
`;

const TRANSLATE_PIXELS = -50;
const MODAL_TRANSITION_MS = 700;

// ease-out like style
const transitionStyle = `${MODAL_TRANSITION_MS}ms cubic-bezier(0, 0.85, 0.48, 0.99)`;

const translateDown = keyframes`
  from { transform: translateY(${TRANSLATE_PIXELS}px) };
  to { transform: translateY(0px) };
`;

const fadeIn = keyframes`
  from {opacity: 0};
  to {opactity:100};
`;

const StyledButton = styled(Button)`
  width: ${INPUT_WIDTH}px;
`;

const AnimatedStyledButton = styled(StyledButton)`
  animation: ${translateDown} ${transitionStyle}, ${fadeIn} ${transitionStyle};
`;

export default Password;