// Local Amiri Regular font embedded as Base64 for jsPDF
// Exposes window.AMIRI_TTF_BASE64 and a helper to register it in jsPDF

(function(){
  // Minimal placeholder: this will be replaced with actual base64 when provided.
  // For now, we keep an empty string to avoid size bloat. You can paste Base64 later.
  // If empty, the code will fallback to fetching from CDN.
  window.AMIRI_TTF_BASE64 = window.AMIRI_TTF_BASE64 || '';
  window.registerAmiriToJsPDF = function(doc){
    if (!window.AMIRI_TTF_BASE64) return false;
    try {
      doc.addFileToVFS('Amiri-Regular.ttf', window.AMIRI_TTF_BASE64);
      doc.addFont('Amiri-Regular.ttf', 'amiri', 'normal');
      return true;
    } catch(e){
      return false;
    }
  }
})();