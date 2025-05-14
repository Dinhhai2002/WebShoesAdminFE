import { jsPDF } from 'jspdf';

/**
 * Lỗi font tùy chỉnh với message rõ ràng
 */
export class FontError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FontError';
  }
}

/**
 * Registers the Roboto font with jsPDF instance for proper rendering of Vietnamese characters
 * @param doc jsPDF instance to register the font with
 */
export const registerVietnameseFont = async (doc: jsPDF): Promise<void> => {
  try {
    // Tải font từ file thay vì sử dụng base64
    const fontPath = '/fonts/TimesNewRoman.ttf';
    
    let fontResponse;
    try {
      fontResponse = await fetch(fontPath);
    } catch (fetchError) {
      throw new FontError(`Không thể tải font file: ${fetchError.message}`);
    }
    
    if (!fontResponse.ok) {
      throw new FontError(`Tải font thất bại: ${fontResponse.status} ${fontResponse.statusText}`);
    }
    
    let fontArrayBuffer;
    try {
      fontArrayBuffer = await fontResponse.arrayBuffer();
    } catch (bufferError) {
      throw new FontError(`Lỗi xử lý font data: ${bufferError.message}`);
    }
    
    const fontBase64 = arrayBufferToBase64(fontArrayBuffer);
    
    // Register the font with the PDF document
    try {
      doc.addFileToVFS('TimesNewRoman.ttf', fontBase64);
      doc.addFont('TimesNewRoman.ttf', 'TimesNewRoman', 'normal');
      
      // Set the font for use
      doc.setFont('TimesNewRoman');
      
      console.log('Vietnamese font registered successfully');
    } catch (registerError) {
      throw new FontError(`Lỗi đăng ký font: ${registerError.message}`);
    }
  } catch (error) {
    console.error('Error registering Vietnamese font:', error);
    if (error instanceof FontError) {
      // Ném lại lỗi với message đã được định dạng
      throw error;
    } else {
      // Lỗi khác, chuyển đổi thành FontError với message rõ ràng
      throw new FontError(`Lỗi xử lý font tiếng Việt: ${error.message}`);
    }
    
    // Sử dụng font dự phòng nếu cần
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
    throw new FontError(`Không thể sử dụng font dự phòng: ${e.message}`);
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
  
  try {
    // Thực hiện chuyển đổi từng ký tự
    return text.split('').map(char => {
      const lowerChar = char.toLowerCase();
      if (charMap[lowerChar]) {
        // Giữ nguyên chữ hoa/thường
        return char === lowerChar ? charMap[lowerChar] : charMap[lowerChar].toUpperCase();
      }
      return char;
    }).join('');
  } catch (error) {
    console.error('Error normalizing Vietnamese text:', error);
    // Trả về text gốc nếu có lỗi
    return text;
  }
};

/**
 * Creates a PDF document with Vietnamese support
 */
export const createVietnamesePDF = (): jsPDF => {
  try {
    // Create PDF with UTF8 support
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16 // to avoid rounding errors in the PDF
    });
    
    return doc;
  } catch (error) {
    console.error('Error creating PDF document:', error);
    throw new Error(`Không thể tạo tài liệu PDF: ${error.message}`);
  }
};

/**
 * Helper function to convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  try {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error('Error converting array buffer to base64:', error);
    throw new Error(`Lỗi chuyển đổi dữ liệu font: ${error.message}`);
  }
} 