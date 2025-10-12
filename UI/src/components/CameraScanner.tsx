// src/components/CameraScanner.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function CameraScanner({ navigation }: any) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);

    // 模擬掃描過程
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert(
        '掃描完成',
        '已識別信用卡資訊\n\n這是模擬功能,實際使用需要:\n1. 安裝 expo-camera\n2. 實作 OCR 識別\n3. 請求相機權限',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '前往卡片管理',
            onPress: () => navigation.navigate('CardManagement'),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={styles.container}>
        {/* 頂部控制列 */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather name="x" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>掃描信用卡</Text>
          <View style={styles.closeBtn} />
        </View>

        {/* 相機預覽區域 */}
        <View style={styles.cameraView}>
          {/* 掃描框 */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />

            {isScanning && (
              <View style={styles.scanLine}>
                <View style={styles.scanLineInner} />
              </View>
            )}
          </View>

          {/* 提示文字 */}
          <View style={styles.instructionBox}>
            <Feather name="credit-card" size={40} color="#fff" />
            <Text style={styles.instructionText}>
              將信用卡放入框內
            </Text>
            <Text style={styles.instructionSubtext}>
              確保卡片完整、清晰可見
            </Text>
          </View>
        </View>

        {/* 底部操作區 */}
        <View style={styles.bottomBar}>
          {/* 說明 */}
          <View style={styles.infoBox}>
            <Feather name="info" size={16} color="#4F8EF7" />
            <Text style={styles.infoText}>
              此為模擬功能。實際使用需要安裝相機套件。
            </Text>
          </View>

          {/* 掃描按鈕 */}
          <TouchableOpacity
            style={[styles.scanBtn, isScanning && styles.scanBtnDisabled]}
            onPress={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Text style={styles.scanBtnText}>掃描中...</Text>
              </>
            ) : (
              <>
                <Feather name="camera" size={24} color="#fff" />
                <Text style={styles.scanBtnText}>開始掃描</Text>
              </>
            )}
          </TouchableOpacity>

          {/* 手動輸入按鈕 */}
          <TouchableOpacity
            style={styles.manualBtn}
            onPress={() => navigation.navigate('CardManagement')}
          >
            <Text style={styles.manualBtnText}>手動輸入卡片</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cameraView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  scanFrame: {
    width: 300,
    height: 180,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#4F8EF7',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
  },
  scanLineInner: {
    height: '100%',
    backgroundColor: '#4F8EF7',
    opacity: 0.8,
  },
  instructionBox: {
    alignItems: 'center',
    marginTop: 48,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
  },
  instructionSubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 142, 247, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#4F8EF7',
    marginLeft: 8,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F8EF7',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  scanBtnDisabled: {
    backgroundColor: '#666',
  },
  scanBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  manualBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  manualBtnText: {
    fontSize: 15,
    color: '#4F8EF7',
    fontWeight: '600',
  },
});