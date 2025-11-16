import React from 'react';
import { render } from '@testing-library/react-native';
import CameraScanner from '../components/CameraScanner';

jest.mock('@expo/vector-icons', () => ({ Feather: 'Feather' }));

test('畫面可載入', () => {
  const navigation = { navigate: jest.fn(), goBack: jest.fn() };
  const tree = render(<CameraScanner navigation={navigation} />);
  expect(tree.getByText('開始掃描')).toBeTruthy();
});
