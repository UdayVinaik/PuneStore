import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../../Theme/Colors';

interface CustomIconProps {
  name: string;
  size?: number;
  color?: string;
}

const CustomIcon = ({
  name,
  size = 25,
  color = Colors.whiteText,
}: CustomIconProps) => {
  return <Icon name={name} size={size} color={color} />;
};

export default CustomIcon;
