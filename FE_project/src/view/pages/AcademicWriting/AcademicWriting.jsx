import { useState, useEffect } from "react";
import "./AcademicWriting.css";
import { jsPDF } from 'jspdf';
import SpellChecker from "../../components/AcademicWritingHelper/SpellChecker";
import CitationHelper from "../../components/AcademicWritingHelper/CitationHelper";
import PlagiarismChecker from "../../components/AcademicWritingHelper/PlagiarismChecker";
import StructureImprover from "../../components/AcademicWritingHelper/StructureImprover";
import { getDocumentStructureRequirements } from "../../utils/textAnalysis";
// Firebase imports
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth'; 


const createPrintTemplate = (params) => `
<!DOCTYPE html>
<html dir="${params.direction}">
<head>
    <meta charset="UTF-8">
    <title>${params.title}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        body {
            font-family: ${params.fontFamily};
            font-size: 12pt;
            line-height: 1.5;
            direction: ${params.direction};
            margin: 0;
            padding: 20px;
            background: white;
        }
        h1 {
            font-size: 18pt;
            font-weight: bold;
            text-align: ${params.hasHebrew ? 'right' : 'center'};
            margin-bottom: 20px;
            color: #333;
        }
        .document-info {
            font-size: 10pt;
            font-style: italic;
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 15px;
            color: #666;
        }
        p {
            margin-bottom: 12px;
            text-align: justify;
            text-indent: ${params.hasHebrew ? '0' : '1em'};
        }
        .content {
            line-height: 1.6;
        }
        .instructions {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 300px;
            direction: ${params.direction};
            text-align: center;
        }
        .instructions-title {
            font-weight: bold;
            margin-bottom: 10px;
        }
        .keyboard-shortcut {
            background: rgba(255,255,255,0.2);
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-weight: bold;
        }
        @media print {
            .instructions { 
                display: none !important; 
            }
        }
    </style>
    <script>
        // פתיחה אוטומטית של דיאלוג ההדפסה
        window.addEventListener('load', function() {
            setTimeout(() => {
                window.print();
            }, 500);
        });
        
        // קיצור מקלדת להדפסה
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                window.print();
            }
        });
    </script>
</head>
<body>
    <div class="instructions">
        <div class="instructions-title">📄 ${params.hasHebrew ? 'שמירה כ-PDF' : 'Save as PDF'}</div>
        <div>${params.hasHebrew ? 'בחר "שמירה כ-PDF" ולחץ שמירה' : 'Select "Save as PDF" and click Save'}</div>
        <div style="margin-top: 8px;">
            <span class="keyboard-shortcut">Ctrl+P</span> 
            ${params.hasHebrew ? 'להדפסה מהירה' : 'for quick print'}
        </div>
    </div>
    
    <h1>${params.title}</h1>
    
    <div class="document-info">
        ${params.documentInfo}
    </div>
    
    <div class="content">
        ${params.contentParagraphs}
    </div>
</body>
</html>
`;

const createWordTemplate = (params) => `
<!DOCTYPE html>
<html dir="${params.direction}">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: ${params.fontFamily};
            font-size: 12pt;
            line-height: 1.5;
            margin: 2cm;
            direction: ${params.direction};
        }
        h1 {
            font-size: 18pt;
            font-weight: bold;
            text-align: ${params.hasHebrew ? 'right' : 'center'};
            margin-bottom: 20px;
        }
        .document-info {
            font-size: 10pt;
            font-style: italic;
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 15px;
        }
        p {
            margin-bottom: 12px;
            text-align: justify;
        }
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <h1>${params.title}</h1>
    
    <div class="document-info">
        ${params.documentInfo}
    </div>
    
    <div class="content">
        ${params.contentParagraphs}
    </div>
</body>
</html>
`;

const AcademicWriting = () => {
  // States קיימים
  const [documentType, setDocumentType] = useState("מאמר אקדמי");
  const [documentStructure, setDocumentStructure] = useState("תבנית בסיסית");
  const [citationStyle, setCitationStyle] = useState("APA");
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [activeAITool, setActiveAITool] = useState(null);
  const [selectedExportFormat, setSelectedExportFormat] = useState("PDF");
  const [documents, setDocuments] = useState([]);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDocumentsList, setShowDocumentsList] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [user, loading, error] = useAuthState(auth);

  // Translation objects
  const translations = {
    he: {
      labels: {
        documentType: "סוג מסמך",
        structure: "מבנה",
        citationStyle: "סגנון ציטוט",
        wordCount: "מספר מילים"
      },
      documentTypes: {
        "מאמר אקדמי": "מאמר אקדמי",
        "תזה / דיסרטציה": "תזה / דיסרטציה",
        "עבודה סמינריונית": "עבודה סמינריונית",
        "מסמך מחקרי": "מסמך מחקרי"
      },
      documentStructures: {
        "תבנית בסיסית": "תבנית בסיסית",
        "תבנית מורחבת": "תבנית מורחבת",
        "מבנה מחקר אמפירי": "מבנה מחקר אמפירי",
        "מבנה סקירת ספרות": "מבנה סקירת ספרות"
      }
    },
    en: {
      labels: {
        documentType: "Document Type",
        structure: "Structure",
        citationStyle: "Citation Style",
        wordCount: "Word Count"
      },
      documentTypes: {
        "מאמר אקדמי": "Academic Article",
        "תזה / דיסרטציה": "Thesis / Dissertation",
        "עבודה סמינריונית": "Seminar Paper",
        "מסמך מחקרי": "Research Document"
      },
      documentStructures: {
        "תבנית בסיסית": "Basic Template",
        "תבנית מורחבת": "Extended Template",
        "מבנה מחקר אמפירי": "Empirical Research Structure",
        "מבנה סקירת ספרות": "Literature Review Structure"
      }
    }
  };

  const detectLanguage = (text) => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'he' : 'en';
  };

  const getTranslatedValues = (language) => {
    return translations[language] || translations.he;
  };

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim().length > 0) {
        analyzeText(content);
      } else {
        setAnalysis([]);
      }
      setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, documentType, documentStructure, citationStyle]);

  const exportToPDF = async () => {
    if (!content.trim()) {
      alert('אין תוכן לייצוא');
      return;
    }

    try {
      const hasHebrew = /[\u0590-\u05FF]/.test(content);
      
      if (hasHebrew) {
        await exportToWordAsPDF();
      } else {
        exportRegularPDF();
      }
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('שגיאה בייצוא PDF: ' + error.message);
    }
  };

  const exportToWordAsPDF = async () => {
    const language = detectLanguage(content + documentTitle);
    const translatedValues = getTranslatedValues(language);
    const hasHebrew = /[\u0590-\u05FF]/.test(content);
    const direction = hasHebrew ? 'rtl' : 'ltr';
    const fontFamily = hasHebrew ? 'Arial, David, sans-serif' : 'Times New Roman, serif';
    
    const documentInfo = [
      `${translatedValues.labels.documentType}: ${translatedValues.documentTypes[documentType] || documentType}`,
      `${translatedValues.labels.structure}: ${translatedValues.documentStructures[documentStructure] || documentStructure}`,
      `${translatedValues.labels.citationStyle}: ${citationStyle}`,
      `${translatedValues.labels.wordCount}: ${wordCount}`
    ].join(' | ');

    const contentParagraphs = content.split('\n').filter(p => p.trim()).map(paragraph => 
      `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
    ).join('');

    const title = documentTitle || (language === 'he' ? 'מסמך אקדמי' : 'Academic Document');
    
    // יצירת חלון חדש עם התוכן המעוצב
    const printWindow = window.open('', '_blank');
    
    const htmlContent = createPrintTemplate({
      direction,
      title,
      fontFamily,
      hasHebrew,
      documentInfo,
      contentParagraphs
    });
    
    // כתיבת התוכן לחלון החדש
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const exportRegularPDF = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const language = detectLanguage(content + documentTitle);
    const translatedValues = getTranslatedValues(language);
    
    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;
    
    // כותרת
    const title = documentTitle || (language === 'he' ? 'מסמך אקדמי' : 'Academic Document');
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin, yPosition);
    yPosition += 15;
    
    // מידע על המסמך
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const documentInfo = [
      `${translatedValues.labels.documentType}: ${translatedValues.documentTypes[documentType] || documentType}`,
      `${translatedValues.labels.structure}: ${translatedValues.documentStructures[documentStructure] || documentStructure}`,
      `${translatedValues.labels.citationStyle}: ${citationStyle}`,
      `${translatedValues.labels.wordCount}: ${wordCount}`
    ];
    
    documentInfo.forEach(info => {
      pdf.text(info, margin, yPosition);
      yPosition += 6;
    });
    
    yPosition += 10;
    
    // תוכן
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    paragraphs.forEach(paragraph => {
      if (paragraph.trim()) {
        const lines = pdf.splitTextToSize(paragraph, maxWidth);
        
        lines.forEach(line => {
          if (yPosition > pageHeight - margin - 10) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.text(line, margin, yPosition);
          yPosition += 7;
        });
        
        yPosition += 3;
      }
    });
    
    const fileName = `${documentTitle || 'document'}.pdf`;
    pdf.save(fileName);
  };

  const exportToWord = async () => {
    if (!content.trim()) {
      alert('אין תוכן לייצוא');
      return;
    }
    try {
      // בדיקה של שפת התוכן
      const hasHebrew = /[\u0590-\u05FF]/.test(content);
      const language = detectLanguage(content + documentTitle);
      const translatedValues = getTranslatedValues(language);
      const direction = hasHebrew ? 'rtl' : 'ltr';
      const fontFamily = hasHebrew ? 'Arial, David, sans-serif' : 'Times New Roman, serif';
      
      // יצירת HTML לייצוא כ-Word עם תמיכה בתרגום
      const documentInfo = [
        `${translatedValues.labels.documentType}: ${translatedValues.documentTypes[documentType] || documentType}`,
        `${translatedValues.labels.structure}: ${translatedValues.documentStructures[documentStructure] || documentStructure}`,
        `${translatedValues.labels.citationStyle}: ${citationStyle}`,
        `${translatedValues.labels.wordCount}: ${wordCount}`
      ].join(' | ');

      const contentParagraphs = content.split('\n').filter(p => p.trim()).map(paragraph => 
        `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
      ).join('');

      const title = documentTitle || (language === 'he' ? 'מסמך אקדמי' : 'Academic Document');
      
      const htmlContent = createWordTemplate({
        direction,
        fontFamily,
        hasHebrew,
        title,
        documentInfo,
        contentParagraphs
      });
      
      // יצירת Blob עם תוכן HTML
      const blob = new Blob([htmlContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      // יצירת קישור להורדה
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentTitle || 'document'}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Word Export Error:', error);
      alert('שגיאה בייצוא Word: ' + error.message);
    }
  };

  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (content.trim() && documentTitle.trim() && currentDocumentId) {
        saveDocument(false); 
      }
    }, 30000);

    return () => clearInterval(autoSaveTimer);
  }, [content, documentTitle, currentDocumentId, documentType, documentStructure, citationStyle]);

  const loadDocuments = async () => {
    if (!user) {
      setDocuments([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'academicDocuments'),
        where('userId', '==', user.uid), // הוסף את השורה הזו
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const documentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      }));
      
      setDocuments(documentsData);
    } catch (error) {
      console.error("שגיאה בטעינת מסמכים:", error);
      setSaveMessage("שגיאה בטעינת מסמכים");
    }
    setIsLoading(false);
  };


  const saveDocument = async (showMessage = true) => {
    if (!user) {
      if (showMessage) setSaveMessage("נדרש להתחבר כדי לשמור מסמכים");
      return;
    }
    
    if (!content.trim() && !documentTitle.trim()) {
      if (showMessage) setSaveMessage("אין תוכן לשמירה");
      return;
    }

    setIsSaving(true);
    try {
      const documentData = {
        title: documentTitle || `מסמך ${new Date().toLocaleDateString('he-IL')}`,
        content,
        documentType,
        documentStructure,
        citationStyle,
        wordCount,
        analysis,
        userId: user.uid, // הוסף את השורה הזו
        updatedAt: serverTimestamp()
      };

      if (currentDocumentId) {
        // עדכון מסמך קיים
        await updateDoc(doc(db, 'academicDocuments', currentDocumentId), documentData);
        if (showMessage) setSaveMessage("המסמך נשמר בהצלחה!");
      } else {
        // יצירת מסמך חדש
        const docRef = await addDoc(collection(db, 'academicDocuments'), {
          ...documentData,
          createdAt: serverTimestamp()
        });
        setCurrentDocumentId(docRef.id);
        if (showMessage) setSaveMessage("המסמך נוצר ונשמר בהצלחה!");
      }

      await loadDocuments(); // רענון הרשימה
      
      if (showMessage) {
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      console.error("שגיאה בשמירת מסמך:", error);
      if (showMessage) setSaveMessage("שגיאה בשמירת המסמך");
    }
    setIsSaving(false);
  };

  const loadDocument = (document) => {
    setContent(document.content || "");
    setDocumentTitle(document.title || "");
    setDocumentType(document.documentType || "מאמר אקדמי");
    setDocumentStructure(document.documentStructure || "תבנית בסיסית");
    setCitationStyle(document.citationStyle || "APA");
    setCurrentDocumentId(document.id);
    setShowDocumentsList(false);
    setSaveMessage(`נטען: ${document.title}`);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את המסמך?")) return;
    
    try {
      await deleteDoc(doc(db, 'academicDocuments', documentId));
      await loadDocuments();
      
      if (currentDocumentId === documentId) {
        // אם המסמך הנוכחי נמחק, נקה את הטופס
        newDocument();
      }
      
      setSaveMessage("המסמך נמחק בהצלחה");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("שגיאה במחיקת מסמך:", error);
      setSaveMessage("שגיאה במחיקת המסמך");
    }
  };

  const newDocument = () => {
    setContent("");
    setDocumentTitle("");
    setCurrentDocumentId(null);
    setDocumentType("מאמר אקדמי");
    setDocumentStructure("תבנית בסיסית");
    setCitationStyle("APA");
    setAnalysis([]);
    setWordCount(0);
    setSaveMessage("מסמך חדש נוצר");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const analyzeText = (text) => {
    setIsAnalyzing(true);
    
    const newAnalysis = [];
    
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    const sentenceAnalysis = analyzeSentenceStructure(text);
    if (sentenceAnalysis.hasIssues) {
      newAnalysis.push({
        type: "warning",
        title: sentenceAnalysis.title,
        description: sentenceAnalysis.description,
        icon: "⚠️"
      });
    }

    if (paragraphs.length > 1) {
      const paragraphAnalysis = analyzeParagraphBalance(paragraphs);
      if (paragraphAnalysis.isUnbalanced) {
        newAnalysis.push({
          type: "info",
          title: paragraphAnalysis.title,
          description: paragraphAnalysis.description,
          icon: "ℹ️"
        });
      }
    }
    
    const formalityAnalysis = analyzeTextFormality(text);
    if (formalityAnalysis.isInformal) {
      newAnalysis.push({
        type: "warning",
        title: formalityAnalysis.title,
        description: formalityAnalysis.description,
        icon: "⚠️"
      });
    }
    
    const claimAnalysis = analyzeClaimsAndEvidence(text);
    if (claimAnalysis.hasUnsupportedClaims) {
      newAnalysis.push({
        type: "suggestion",
        title: claimAnalysis.title,
        description: claimAnalysis.description,
        icon: "📚"
      });
    }
    
    const structureRequirements = getDocumentStructureRequirements(documentType, documentStructure);
    const structureAnalysis = analyzeDocumentStructure(text, structureRequirements);
    if (structureAnalysis.hasMissingElements) {
      newAnalysis.push({
        type: "structure",
        title: structureAnalysis.title,
        description: structureAnalysis.description,
        icon: "🏗️"
      });
    }
    
    const citationAnalysis = analyzeCitations(text, citationStyle);
    if (citationAnalysis.hasIssues) {
      newAnalysis.push({
        type: "citation",
        title: citationAnalysis.title,
        description: citationAnalysis.description,
        icon: "📄"
      });
    }
    
    setAnalysis(newAnalysis.slice(0, 4));
    setIsAnalyzing(false);
  };

  const analyzeSentenceStructure = (text) => {
    const sentences = text.split(/[.!?]+/);
    const longSentences = sentences.filter(s => {
      const words = s.trim().split(/\s+/);
      return words.length > 20;
    });
    
    return {
      hasIssues: longSentences.length > 0,
      title: "מבנה משפטים",
      description: longSentences.length > 0 
        ? `נמצאו ${longSentences.length} משפטים ארוכים מדי. שקול לפצל אותם למשפטים קצרים יותר.`
        : ""
    };
  };

  const analyzeParagraphBalance = (paragraphs) => {
    if (paragraphs.length <= 1) return { isUnbalanced: false };
    
    const lengths = paragraphs.map(p => p.length);
    const avg = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    const stdDev = Math.sqrt(
      lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length
    );
    
    const outliers = lengths.filter(len => Math.abs(len - avg) > stdDev * 1.5).length;
    const isUnbalanced = outliers > Math.max(1, paragraphs.length * 0.2);
    
    return {
      isUnbalanced,
      title: "חוסר איזון באורכי פסקאות",
      description: isUnbalanced 
        ? "ישנן פסקאות שאורכן חורג משמעותית מהממוצע. שקול לאזן את אורך הפסקאות."
        : ""
    };
  };

  const analyzeTextFormality = (text) => {
    const informalityIndicators = [
      /\bמדהים\b/i, /\bנהדר\b/i, /\bגרוע\b/i, /\bנורא\b/i, /\bסבבה\b/i, /\bבסדר\b/i,
      /\bdon't\b/i, /\bwon't\b/i, /\bcan't\b/i, /\bgonna\b/i, /\bwanna\b/i,
      /!!+/,
      /[\u{1F300}-\u{1F6FF}]/u
    ];
    
    let informalCount = 0;
    for (const pattern of informalityIndicators) {
      const matches = text.match(pattern);
      if (matches) informalCount += matches.length;
    }
    
    const wordCount = text.split(/\s+/).length;
    const normalizedThreshold = Math.max(1, Math.floor(wordCount / 100));
    
    return {
      isInformal: informalCount > normalizedThreshold,
      title: "שימוש בשפה לא אקדמית",
      description: informalCount > normalizedThreshold
        ? "זוהו ביטויים שאינם מתאימים לכתיבה אקדמית. שקול להחליף ביטויים אלו בשפה פורמלית יותר."
        : ""
    };
  };

  const analyzeClaimsAndEvidence = (text) => {
    const claimIndicators = [
      /אני טוען/i, /אני חושב/i, /לדעתי/i, /ניתן לומר ש/i, /ברור ש/i,
      /I believe/i, /I think/i, /in my opinion/i, /clearly/i, /obviously/i,
      /מוכיח ש/i, /מראה ש/i, /must be/i, /should be/i, /יש להניח/i
    ];
    
    let claimCount = 0;
    for (const pattern of claimIndicators) {
      const matches = text.match(pattern);
      if (matches) claimCount += matches.length;
    }
    
    const evidenceIndicators = [
      /\(\d{4}\)/,
      /לפי /i, /על פי/i, /\(.*\d+.*\)/,
      /מחקרים הראו/i, /studies show/i
    ];
    
    let evidenceCount = 0;
    for (const pattern of evidenceIndicators) {
      const matches = text.match(pattern);
      if (matches) evidenceCount += matches.length;
    }
    
    return {
      hasUnsupportedClaims: claimCount > 0 && claimCount > evidenceCount,
      title: "טענות הדורשות ביסוס",
      description: claimCount > 0 && claimCount > evidenceCount
        ? "זוהו טענות שעשויות להצריך ביסוס אקדמי. שקול להוסיף מקורות או אסמכתאות."
        : ""
    };
  };

  const analyzeDocumentStructure = (text, requirements) => {
    if (!requirements || !requirements.sections) {
      return { hasMissingElements: false };
    }
    
    const missingElements = [];
    
    for (const section of requirements.sections) {
      const sectionPattern = new RegExp(`\\b${section}\\b`, 'i');
      if (!sectionPattern.test(text)) {
        missingElements.push(section);
      }
    }
    
    return {
      hasMissingElements: missingElements.length > 0,
      title: "מבנה המסמך",
      description: missingElements.length > 0
        ? `מומלץ לכלול את החלקים הבאים ב${requirements.documentType}: ${missingElements.join(', ')}.`
        : ""
    };
  };

  const analyzeCitations = (text, style) => {
    const citationPatterns = {
      "APA": {
        inText: /\([^)]*\d{4}[^)]*\)/,
        reference: /^[A-Za-z].*\(\d{4}\)/m
      },
      "MLA": {
        inText: /\([^)]*\d+[^)]*\)/,
        reference: /^[A-Za-z].*\d+\./m
      },
      "Chicago": {
        inText: /\d+/,
        footnote: /^\d+\./m
      },
      "Harvard": {
        inText: /\([^)]*\d{4}[^)]*\)/,
        reference: /^[A-Za-z].*\(\d{4}\)/m
      },
      "IEEE": {
        inText: /\[\d+\]/,
        reference: /^\[\d+\]/m
      }
    };
    
    const pattern = citationPatterns[style];
    if (!pattern) return { hasIssues: false };
    
    const hasCitations = text.includes("(") || text.includes("[") || /\d+/.test(text);
    const hasCorrectFormat = pattern.inText.test(text);
    
    const hasIssues = hasCitations && !hasCorrectFormat;
    
    return {
      hasIssues,
      title: "בעיות בסגנון ציטוט",
      description: hasIssues
        ? `נראה שיש ציטוטים שאינם תואמים את סגנון ${style}. בדוק את מבנה הציטוטים.`
        : ""
    };
  };

  const handleActivateAITool = (toolName) => {
    setActiveAITool(toolName);
  };
  
  const handleCloseAITool = () => {
    setActiveAITool(null);
  };
  
  const handleApplyAIToolSuggestion = (updatedContent) => {
    setContent(updatedContent);
    handleCloseAITool();
  };

  const renderActiveTool = () => {
    const documentSettings = {
      documentType,
      documentStructure,
      citationStyle
    };
    
    const toolProps = {
      content,
      documentSettings,
      onClose: handleCloseAITool,
      onApplySuggestion: handleApplyAIToolSuggestion
    };

    switch (activeAITool) {
      case "spellCheck":
        return <SpellChecker {...toolProps} />;
      case "citations":
        return <CitationHelper {...toolProps} />;
      case "plagiarism":
        return <PlagiarismChecker {...toolProps} />;
      case "structure":
        return <StructureImprover {...toolProps} />;
      default:
        return null;
    }
  };

  const getAIAnalysisContent = () => {
    if (!content.trim().length) {
      return (
        <div className="empty-panel-message">
          <p>התחל לכתוב את המסמך שלך כדי לקבל ניתוח חכם</p>
        </div>
      );
    }
    
    const wordCountRecommendation = getWordCountRecommendation(documentType, wordCount);
    
    if (loading) return <div>טוען...</div>;
    if (error) return <div>שגיאה: {error.message}</div>;
    if (!user) return <div>נדרש להתחבר כדי להשתמש בכלי</div>;

    return (
      <div>
        <div className="ai-panel-section">
          <h3>ניתוח כללי</h3>
          <p>{wordCountRecommendation}</p>
          <p>מבנה נבחר: {documentStructure}</p>
        </div>
        
        <div className="ai-panel-section">
          <h3>המלצות לשיפור</h3>
          <ul>
            {analysis.map((item, i) => (
              <li key={i}>
                <strong>{item.title}:</strong> {item.description}
              </li>
            ))}
            {analysis.length === 0 && (
              <li>לא זוהו בעיות כרגע. המשך לכתוב לקבלת המלצות נוספות.</li>
            )}
          </ul>
        </div>
        
        <div className="ai-panel-section">
          <h3>כלים מתקדמים</h3>
          <div className="ai-tools-grid">
            <button 
              className="ai-tool-button"
              onClick={() => handleActivateAITool("spellCheck")}
            >
              <span role="img" aria-label="spell check">🔍</span>
              בדיקת איות ודקדוק
            </button>
            <button 
              className="ai-tool-button"
              onClick={() => handleActivateAITool("citations")}
            >
              <span role="img" aria-label="citations">📚</span>
              עזרה בציטוטים
            </button>
            <button 
              className="ai-tool-button"
              onClick={() => handleActivateAITool("plagiarism")}
            >
              <span role="img" aria-label="plagiarism">⚠️</span>
              בדיקת מקוריות
            </button>
            <button 
              className="ai-tool-button"
              onClick={() => handleActivateAITool("structure")}
            >
              <span role="img" aria-label="structure">🏗️</span>
              שיפור מבנה
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getWordCountRecommendation = (docType, count) => {
    const recommendations = {
      "מאמר אקדמי": {
        min: 1500,
        max: 5000,
        message: "למאמר אקדמי מומלץ להגיע ל-1500 עד 5000 מילים, בהתאם לדרישות המדויקות."
      },
      "תזה / דיסרטציה": {
        min: 20000,
        max: 100000,
        message: "לתזה או דיסרטציה מומלץ להגיע לפחות ל-20,000 מילים, בהתאם לדרישות המחלקה והמנחה."
      },
      "עבודה סמינריונית": {
        min: 3000,
        max: 8000,
        message: "לעבודה סמינריונית מומלץ להגיע ל-3,000 עד 8,000 מילים, בהתאם לדרישות הקורס."
      },
      "מסמך מחקרי": {
        min: 2000,
        max: 10000,
        message: "למסמך מחקרי מומלץ להגיע ל-2,000 עד 10,000 מילים, בהתאם לסוג המחקר והיקפו."
      }
    };
    
    const rec = recommendations[docType] || { min: 1000, max: 5000, message: "" };
    
    let lengthAssessment;
    if (count < 100) {
      lengthAssessment = "קצר מאוד, שקול להרחיב";
    } else if (count < rec.min * 0.2) {
      lengthAssessment = "קצר מאוד ביחס לדרישות הצפויות";
    } else if (count < rec.min * 0.5) {
      lengthAssessment = "קצר ביחס לדרישות הצפויות";
    } else if (count < rec.min) {
      lengthAssessment = "מתקרב לאורך המינימלי המומלץ";
    } else if (count > rec.max * 1.5) {
      lengthAssessment = "ארוך מאוד, שקול לקצר";
    } else if (count > rec.max) {
      lengthAssessment = "ארוך מהמומלץ";
    } else {
      lengthAssessment = "באורך טוב";
    }
    
    return `הטקסט שלך (${count} מילים) ${lengthAssessment}. ${rec.message}`;
  };

  return (
    <div className="academic-writing-container">
      <section className="main-title">
        <h1>🖋️ כלי לכתיבה אקדמית</h1>
        <p>כתוב, ערוך וטקסט בצורה מקצועית בהתאם לכללי הכתיבה האקדמית המקובלים</p>
      </section>

      <section className="content-area">
        <aside className="sidebar">
          {/* כלים חדשים ל-Firebase */}
          <div className="side-card">
            <h4>ניהול מסמכים</h4>
            <input
              type="text"
              placeholder=" שם המסמך..."
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="document-title-input"
            />
            <div className="document-actions">
              <button 
                className="action-btn" 
                onClick={() => saveDocument(true)}
                disabled={isSaving}
              >
                {isSaving ? "שומר..." : "💾 שמירה"}
              </button>
              <button 
                className="action-btn" 
                onClick={newDocument}
              >
                📄 מסמך חדש
              </button>
              <button 
                className="action-btn" 
                onClick={() => setShowDocumentsList(!showDocumentsList)}
              >
                📂 המסמכים שלי ({documents.length})
              </button>
            </div>
            {saveMessage && (
              <div className={`save-message ${saveMessage.includes('שגיאה') ? 'error' : 'success'}`}>
                {saveMessage}
              </div>
            )}
          </div>

          <div className="side-card">
            <h4>אפשרויות יצוא</h4>
            <label>
              <input 
                type="radio" 
                name="export" 
                value="PDF"
                checked={selectedExportFormat === "PDF"}
                onChange={(e) => setSelectedExportFormat(e.target.value)}
              /> 
              PDF
            </label>
            <label>
              <input 
                type="radio" 
                name="export" 
                value="Word"
                checked={selectedExportFormat === "Word"}
                onChange={(e) => setSelectedExportFormat(e.target.value)}
              /> 
              Word
            </label>
            <button 
              className="export-btn"
              onClick={selectedExportFormat === "PDF" ? exportToPDF : exportToWord}
              disabled={!content.trim()}
            >
              יצוא ל{selectedExportFormat}
            </button>
          </div>
          
          <div className="side-card">
            <h4>שיתוף</h4>
            <button className="share-btn">שיתוף למרצה וחברים</button>
          </div>
          
          <button 
            className="ai-help-btn" 
            onClick={() => setShowAIPanel(!showAIPanel)}
          >
            <span role="img" aria-label="AI">🤖</span>
            עזרה חכמה
          </button>
        </aside>

        <main className="writing-panel">
          <div className="selectors">
            <div>
              <label>סוג המסמך</label>
              <select 
                value={documentType} 
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option>מאמר אקדמי</option>
                <option>תזה / דיסרטציה</option>
                <option>עבודה סמינריונית</option>
                <option>מסמך מחקרי</option>
              </select>
            </div>
            <div>
              <label>מבנה מסמך</label>
              <select 
                value={documentStructure} 
                onChange={(e) => setDocumentStructure(e.target.value)}
              >
                <option>תבנית בסיסית</option>
                <option>תבנית מורחבת</option>
                <option>מבנה מחקר אמפירי</option>
                <option>מבנה סקירת ספרות</option>
              </select>
            </div>
            <div>
              <label>סגנון ציטוט</label>
              <select 
                value={citationStyle} 
                onChange={(e) => setCitationStyle(e.target.value)}
              >
                <option>APA</option>
                <option>MLA</option>
                <option>Chicago</option>
                <option>Harvard</option>
                <option>IEEE</option>
              </select>
            </div>
          </div>

          <textarea
            className="text-editor"
            placeholder="התחל לכתוב את המסמך שלך כאן..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="word-count">
            <span>מילים: {wordCount}</span>
            {isAnalyzing && <span>מנתח טקסט...</span>}
            {currentDocumentId && <span>מסמך שמור</span>}
          </div>
        </main>
      </section>
      
      {/* רשימת מסמכים */}
      {showDocumentsList && (
        <div className="documents-list-overlay">
          <div className="documents-list">
            <div className="documents-list-header">
              <h3>המסמכים שלי</h3>
              <button 
                className="close-list-btn"
                onClick={() => setShowDocumentsList(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="documents-list-content">
              {isLoading ? (
                <div className="loading">טוען מסמכים...</div>
              ) : documents.length === 0 ? (
                <div className="empty-list">אין מסמכים שמורים</div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-info">
                      <h4>{doc.title}</h4>
                      <p>{doc.documentType} • {doc.wordCount} מילים</p>
                      <small>עודכן: {doc.updatedAt.toLocaleDateString('he-IL')}</small>
                    </div>
                    <div className="my-documents-actions">
                      <button 
                        className="load-doc-btn"
                        onClick={() => loadDocument(doc)}
                      >
                        פתח
                      </button>
                      <button 
                        className="delete-doc-btn"
                        onClick={() => deleteDocument(doc.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* AI Help Panel */}
      {showAIPanel && (
        <div className="ai-panel-overlay">
          <div className="ai-panel">
            <div className="ai-panel-header">
              <h2 className="ai-panel-title">
                <span role="img" aria-label="AI">🤖</span> ניתוח חכם
              </h2>
              <button 
                className="ai-panel-close"
                onClick={() => setShowAIPanel(false)}
              >
                ✕
              </button>
            </div>
            
            {getAIAnalysisContent()}
          </div>
        </div>
      )}
      
      {/* Render active AI tool if one is selected */}
      {activeAITool && renderActiveTool()}
    </div>
  );
};

export default AcademicWriting;