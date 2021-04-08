import { Web3ReactManagerFunctions } from '@web3-react/core/dist/types';
import { injected } from 'connectors/index';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AbstractConnector } from '@web3-react/abstract-connector';
import colors from 'components/core/colors';

type WalletButtonProps = {
  walletName: string;
  activate: Web3ReactManagerFunctions['activate'];
  connector: AbstractConnector;
  enableIsConnectingState: () => void;
  isConnecting: boolean;
};

function WalletButton({
  walletName,
  activate,
  connector,
  enableIsConnectingState,
  isConnecting,
}: WalletButtonProps) {
  const handleClick = useCallback(() => {
    enableIsConnectingState();
    if (walletName.toLowerCase() === 'metamask') {
      injected.isAuthorized().then((isAuthorized: boolean) => {
        console.log('isAuthorized', isAuthorized);
      });
    }
    activate(connector);
  }, [activate, connector, enableIsConnectingState, walletName]);

  return (
    <StyledButton onClick={handleClick} isConnecting disabled={isConnecting}>
      {isConnecting ? 'Connecting' : walletName}
      <Icon
        src={require(`assets/icons/${walletName.toLowerCase()}.svg`).default}
      />
    </StyledButton>
  );
}

type StyledButtonProps = {
  isConnecting?: boolean;
};

const Icon = styled.img`
  width: 24px;
  height: 24px;
  margin: 5px;
`;

const StyledButton = styled.button<StyledButtonProps>`
  background: white;
  padding: 16px;
  border: 1px solid ${colors.black};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 356px;
  margin: 10px 0;
  cursor: pointer;
  :disabled {
    border-color: ${colors.gray};
  }
`;
export default WalletButton;