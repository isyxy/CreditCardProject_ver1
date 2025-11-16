import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { View } from 'react-native';

const mockRequestPermission = jest.fn(async () => ({ granted: true }));
const mockUseCameraPermissions = () => [{ granted: true }, mockRequestPermission];
const takePictureAsyncMock = jest.fn(async () => ({ base64: 'test-image' }));

const MockCameraView = React.forwardRef<any>((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    takePictureAsync: takePictureAsyncMock,
  }));
  return React.createElement(View, props);
});
MockCameraView.displayName = 'ExpoCameraMock';

jest.mock('expo-camera', () => ({
  __esModule: true,
  CameraView: MockCameraView,
  useCameraPermissions: mockUseCameraPermissions,
}));
