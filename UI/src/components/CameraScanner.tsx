// src/components/CameraScanner.tsx
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

type Detection = {
  label: string;
  score: number;
  box: [number, number, number, number];
};

const API_URL = 'http://192.168.1.10:8000'; // TODO: 依實際後端位置調整

export default function CameraScanner({ navigation }: any) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastDetection, setLastDetection] = useState<Detection | null>(null);

  const ensurePermission = useCallback(async () => {
    if (permission?.granted) return true;
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert('需要相機權限', '請在系統設定內開啟相機權限後再試一次');
      return false;
    }
    return true;
  }, [permission, requestPermission]);

  const handleScan = useCallback(async () => {
    if (!cameraRef.current || !isCameraReady) return;
    const ok = await ensurePermission();
    if (!ok) return;

    setIsScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.6,
        skipProcessing: true,
      });

      if (!photo.base64) {
        throw new Error('無法取得相片資料');
      }

      const resp = await fetch(`${API_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photo.base64 }),
      });

      if (!resp.ok) {
        throw new Error(`伺服器錯誤（${resp.status}）`);
      }

      const payload = await resp.json();
      const detections: Detection[] = payload?.detections ?? [];

      if (!detections.length) {
        Alert.alert('未偵測到卡片', '請調整角度或光線，再試一次');
        setLastDetection(null);
        return;
      }

      const best = detections[0];
      setLastDetection(best);

      Alert.alert(
        '掃描完成',
        `偵測到：${best.label}\n信心值：${(best.score * 100).toFixed(1)}%`,
        [
          { text: '留在此頁' },
          {
            text: '前往卡片管理',
            onPress: () =>
              navigation.navigate('CardManagement', { detection: best }),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('掃描失敗', err?.message ?? String(err));
    } finally {
      setIsScanning(false);
    }
  }, [ensurePermission, isCameraReady, navigation]);

  if (!permission) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Feather name="camera-off" size={64} color="#fff" />
        <Text style={styles.permissionTitle}>需要相機權限</Text>
        <Text style={styles.permissionText}>
          允許後即可使用信用卡掃描功能。
        </Text>
        <TouchableOpacity style={styles.scanBtn} onPress={requestPermission}>
          <Text style={styles.scanBtnText}>授權相機</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={styles.container}>
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

        <View style={styles.cameraView}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
            onCameraReady={() => setIsCameraReady(true)}
          />

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

          <View style={styles.instructionBox}>
            <Feather name="credit-card" size={40} color="#fff" />
            <Text style={styles.instructionText}>請將信用卡置於框內</Text>
            <Text style={styles.instructionSubtext}>保持光線充足並穩定持握</Text>
            {lastDetection && (
              <View style={styles.detectionBox}>
                <Text style={styles.detectionText}>
                  上次偵測：{lastDetection.label}（
                  {(lastDetection.score * 100).toFixed(1)}%）
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.infoBox}>
            <Feather name="info" size={16} color="#4F8EF7" />
            <Text style={styles.infoText}>
              掃描會呼叫本地 YOLO API，請確認手機與伺服器在同一網路。
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.scanBtn,
              (!isCameraReady || isScanning) && styles.scanBtnDisabled,
            ]}
            onPress={handleScan}
            disabled={!isCameraReady || isScanning}
          >
            {isScanning ? (
              <>
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.scanBtnText}>掃描中...</Text>
              </>
            ) : (
              <>
                <Feather name="camera" size={24} color="#fff" />
                <Text style={styles.scanBtnText}>開始掃描</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manualBtn}
            onPress={() => navigation.navigate('CardManagement')}
          >
            <Text style={styles.manualBtnText}>改用手動輸入</Text>
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
  topTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
  detectionBox: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  detectionText: {
    color: '#fff',
    fontSize: 14,
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
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
  },
  permissionText: {
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
});
