import { jsPDF } from 'jspdf';

/**
 * Registers the Roboto font with jsPDF instance for proper rendering of Vietnamese characters
 * @param doc jsPDF instance to register the font with
 */
export const registerVietnameseFont = async (doc: jsPDF): Promise<void> => {
  try {
    // Tải font từ file thay vì sử dụng base64
    const fontPath = '/fonts/TimesNewRoman.ttf';
    const fontResponse = await fetch(fontPath);
    
    if (!fontResponse.ok) {
      throw new Error(`Failed to load font: ${fontResponse.statusText}`);
    }
    
    const fontArrayBuffer = await fontResponse.arrayBuffer();
    const fontBase64 = arrayBufferToBase64(fontArrayBuffer);
    
    // Register the font with the PDF document
    doc.addFileToVFS('TimesNewRoman.ttf', fontBase64);
    doc.addFont('TimesNewRoman.ttf', 'TimesNewRoman', 'normal');
    
    // Set the font for use
    doc.setFont('TimesNewRoman');
    
    console.log('Vietnamese font registered successfully');
  } catch (error) {
    console.error('Error registering Vietnamese font:', error);
    useFallbackFont(doc);
  }
};

/**
 * Fallback method to ensure PDF generation still works even if font loading fails
 */
function useFallbackFont(doc: jsPDF): void {
  try {
    // Trong trường hợp tệ nhất, sử dụng font mặc định của jsPDF
    // Helvetica là font mặc định và hỗ trợ khá tốt các ký tự cơ bản
    doc.setFont('helvetica');
    console.log('Using fallback font: helvetica');
    
    // Thiết lập encoding để hỗ trợ tốt hơn với Unicode
    (doc as any).advancedAPI?.setCharSpace?.(0.5);
    
  } catch (e) {
    console.error('Error setting fallback font:', e);
  }
}

/**
 * Chuẩn hóa văn bản tiếng Việt để hiển thị tốt hơn với font mặc định
 * Hàm này có thể được dùng nếu font không hỗ trợ đầy đủ
 */
export const normalizeVietnameseText = (text: string): string => {
  // Một số cách mapping ký tự phổ biến trong trường hợp font không hỗ trợ đầy đủ
  const charMap: { [key: string]: string } = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
  };

  if (!text) return '';
  
  // Thực hiện chuyển đổi từng ký tự
  return text.split('').map(char => {
    const lowerChar = char.toLowerCase();
    if (charMap[lowerChar]) {
      // Giữ nguyên chữ hoa/thường
      return char === lowerChar ? charMap[lowerChar] : charMap[lowerChar].toUpperCase();
    }
    return char;
  }).join('');
};

/**
 * Creates a PDF document with Vietnamese support
 */
export const createVietnamesePDF = (): jsPDF => {
  // Create PDF with UTF8 support
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16 // to avoid rounding errors in the PDF
  });
  
  return doc;
};

/**
 * Helper function to convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
} 