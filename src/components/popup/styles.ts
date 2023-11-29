import {Theme} from 'client-library';
import styled from 'styled-components';

export const PopupContainer = styled.div<{isOpen: boolean}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
`;

export const PopupContent = styled.div<{top: number; left: number; ref: any}>`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: ${props => props.top + 30}px;
  left: ${props => props.left}px;

  ul {
    list-style-type: none;

    li {
      cursor: pointer;
      padding: 5px 15px;
      :hover {
        background-color: ${Theme.palette.gray400};
      }
    }
  }
`;
