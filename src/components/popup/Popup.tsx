import {useEffect, useRef, useState} from 'react';
import {PopupContent, PopupContainer} from './styles';
import {Typography} from 'client-library';

interface PopupProps {
  isOpen: boolean;
  togglePopup?: () => void;
  handleItemClick?: (item: any) => void;
  items: any[];
  targetRef?: any;
}

export const Popup: React.FC<PopupProps> = ({isOpen, togglePopup, items, targetRef, handleItemClick}) => {
  const popupRef = useRef<HTMLDivElement>();
  const [targetPosition, setTargetPosition] = useState({top: 0, left: 0});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef?.current?.contains(e.target as Node)) {
        togglePopup && togglePopup();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, togglePopup]);

  useEffect(() => {
    if (targetRef && targetRef.current) {
      const {top, left} = targetRef.current.getBoundingClientRect();
      setTargetPosition({top, left});
    }
  }, [isOpen]);

  return (
    <PopupContainer isOpen={isOpen}>
      <PopupContent ref={popupRef} top={targetPosition.top} left={targetPosition.left}>
        <ul>
          {items &&
            items?.map((item, index) => (
              <li key={index} onClick={() => handleItemClick && handleItemClick(item)}>
                <Typography variant="bodyMedium" content={item} />
              </li>
            ))}
        </ul>
      </PopupContent>
    </PopupContainer>
  );
};
