import React, { useRef, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manualValue, setManualValue] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quét barcode từ camera
  const startScan = async () => {
    setError(null);
    setScanning(true);
    try {
      const codeReader = new BrowserMultiFormatReader();
      const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.current!);
      if (result?.getText()) {
        onDetected(result.getText());
        setScanning(false);
      }
    } catch (err: any) {
      setError('Không nhận diện được barcode từ camera!');
    } finally {
      setScanning(false);
    }
  };

  // Quét barcode từ ảnh upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setLoadingImg(true);
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    try {
      const codeReader = new BrowserMultiFormatReader();
      const result = await codeReader.decodeFromImageUrl(url);
      if (result?.getText()) {
        onDetected(result.getText());
      } else {
        setError('Không nhận diện được barcode từ ảnh!');
      }
    } catch (err: any) {
      setError('Không nhận diện được barcode từ ảnh!');
    } finally {
      setLoadingImg(false);
    }
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={2}>
        <Button variant="contained" onClick={startScan} disabled={scanning}>
          Quét barcode bằng camera
        </Button>
        <Button variant="outlined" component="label" disabled={loadingImg}>
          Tải ảnh barcode
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
        <TextField
          label="Nhập barcode thủ công"
          value={manualValue}
          onChange={(e) => setManualValue(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={() => {
            if (manualValue.trim()) onDetected(manualValue.trim());
          }}
        >
          Thêm barcode
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {scanning && <Typography color="primary">Đang quét barcode từ camera...</Typography>}
      <video ref={videoRef} style={{ width: 400, height: 240, border: '1px solid #ccc' }} muted autoPlay />
    </Box>
  );
};

export default BarcodeScanner;
