/**
 * Returns the structural requirements for various document types
 * @param {string} documentType - The type of academic document
 * @returns {Object} - Document structure requirements
 */
export const getDocumentStructureRequirements = (documentType) => {
    const requirementsMap = {
      "מאמר אקדמי": {
        documentType: "מאמר אקדמי",
        sections: [
          "תקציר",
          "מבוא",
          "סקירת ספרות",
          "מתודולוגיה",
          "ממצאים",
          "דיון",
          "מסקנות",
          "ביבליוגרפיה"
        ],
        minWordCount: 1500,
        maxWordCount: 5000
      },
      "תזה / דיסרטציה": {
        documentType: "תזה / דיסרטציה",
        sections: [
          "תקציר",
          "תוכן עניינים",
          "מבוא",
          "סקירת ספרות",
          "מסגרת תיאורטית",
          "שיטת המחקר",
          "ממצאים",
          "דיון",
          "מסקנות והמלצות",
          "רשימת מקורות",
          "נספחים"
        ],
        minWordCount: 20000,
        maxWordCount: 100000
      },
      "עבודה סמינריונית": {
        documentType: "עבודה סמינריונית",
        sections: [
          "דף שער",
          "תוכן עניינים",
          "מבוא",
          "סקירת ספרות",
          "מתודולוגיה",
          "ממצאים",
          "דיון",
          "סיכום",
          "רשימת מקורות"
        ],
        minWordCount: 3000,
        maxWordCount: 8000
      },
      "מסמך מחקרי": {
        documentType: "מסמך מחקרי",
        sections: [
          "תקציר",
          "מבוא",
          "רקע",
          "שיטת מחקר",
          "ממצאים",
          "ניתוח",
          "מסקנות",
          "מקורות"
        ],
        minWordCount: 2000,
        maxWordCount: 10000
      }
    };
  
    return requirementsMap[documentType] || {
      documentType: "מסמך כללי",
      sections: ["מבוא", "גוף המסמך", "סיכום", "מקורות"],
      minWordCount: 1000,
      maxWordCount: 5000
    };
  };
  
  /**
   * Analyses the readability level of academic text
   * @param {string} text - The text to analyze
   * @returns {Object} - Readability analysis and score
   */
  export const analyzeReadabilityLevel = (text) => {
    if (!text || text.trim().length === 0) {
      return {
        score: 0,
        level: "לא ניתן לקבוע",
        suggestions: []
      };
    }
  
    // Count sentences, words, and syllables (simplified)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    
    if (sentences.length === 0 || words.length === 0) {
      return {
        score: 0,
        level: "לא ניתן לקבוע",
        suggestions: ["הטקסט קצר מדי לניתוח קריאות אמין"]
      };
    }
  
    // Calculate average sentence length
    const avgSentenceLength = words.length / sentences.length;
  
    // Calculate average word length (characters per word)
    const totalChars = words.reduce((sum, word) => sum + word.length, 0);
    const avgWordLength = totalChars / words.length;
  
    // Simple readability score based on sentence and word length
    // Higher score = more complex text
    const readabilityScore = (avgSentenceLength * 0.6) + (avgWordLength * 0.4);
  
    // Determine readability level
    let level;
    const suggestions = [];
  
    if (readabilityScore < 10) {
      level = "קל לקריאה";
      suggestions.push("הטקסט קל מדי לכתיבה אקדמית, שקול להשתמש בטרמינולוגיה מקצועית יותר");
    } else if (readabilityScore < 15) {
      level = "בינוני";
      suggestions.push("רמת הקריאות מתאימה לכתיבה אקדמית בסיסית");
    } else if (readabilityScore < 20) {
      level = "מורכב";
      suggestions.push("רמת הקריאות מתאימה היטב לכתיבה אקדמית");
    } else {
      level = "מורכב מאוד";
      suggestions.push("הטקסט מורכב מאוד, שקול לפשט חלק מהמשפטים הארוכים");
    }
  
    // Add specific suggestions based on metrics
    if (avgSentenceLength > 25) {
      suggestions.push("המשפטים ארוכים מדי בממוצע, שקול לפצל חלק מהמשפטים");
    }
  
    if (avgWordLength > 7) {
      suggestions.push("המילים ארוכות מדי בממוצע, שקול לפשט חלק מהמונחים");
    }
  
    return {
      score: Math.round(readabilityScore * 10) / 10,
      level,
      suggestions
    };
  };
  
  /**
   * Analyzes the coherence of academic text
   * @param {string} text - The text to analyze
   * @returns {Object} - Coherence analysis results
   */
  export const analyzeTextCoherence = (text) => {
    if (!text || text.trim().length === 0) {
      return {
        isCoherent: false,
        score: 0,
        weakPoints: [],
        suggestions: []
      };
    }
  
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    if (paragraphs.length <= 1) {
      return {
        isCoherent: true,
        score: 5,
        weakPoints: [],
        suggestions: ["טקסט קצר מדי להערכת קוהרנטיות בין פסקאות"]
      };
    }
  
    // Check for transition words between paragraphs
    const transitionWords = [
      // Hebrew transition words
      "בנוסף", "יתר על כן", "כמו כן", "לעומת זאת", "מצד אחד", "מצד שני", 
      "לפיכך", "לכן", "על כן", "משום כך", "עם זאת", "אולם", 
      "אבל", "ברם", "למרות זאת", "אף על פי כן", "בסיכום", "לסיכום",
      // English transition words for multi-language support
      "however", "therefore", "furthermore", "moreover", "in addition", 
      "consequently", "nevertheless", "accordingly", "thus", "hence",
      "in conclusion", "to summarize"
    ];
  
    const weakPoints = [];
    const suggestions = [];
    let coherenceScore = 5; // base score out of 10
    
    // Check first sentences of paragraphs for transition words
    for (let i = 1; i < paragraphs.length; i++) {
      const firstSentence = paragraphs[i].split(".")[0];
      const hasTransition = transitionWords.some(word => 
        firstSentence.toLowerCase().includes(word.toLowerCase())
      );
      
      if (!hasTransition) {
        weakPoints.push(`פסקה ${i + 1} חסרה מילות קישור בתחילתה`);
        coherenceScore -= 0.5;
      }
    }
    
    // Check for topic consistency across paragraphs
    const topics = paragraphs.map(p => {
      // Extract potential topic words (simplified)
      const words = p.split(/\s+/).filter(w => w.length > 3);
      return words.slice(0, 5); // Take first 5 substantive words as potential topics
    });
    
    // Check for topic overlap between adjacent paragraphs
    for (let i = 1; i < topics.length; i++) {
      const prevTopics = topics[i-1];
      const currTopics = topics[i];
      
      // Check for word overlap (very simplified topic continuity check)
      const hasOverlap = prevTopics.some(word => 
        currTopics.some(w => w.includes(word) || word.includes(w))
      );
      
      if (!hasOverlap) {
        weakPoints.push(`נראה שיש שינוי נושא חד בין פסקה ${i} לפסקה ${i+1}`);
        coherenceScore -= 0.5;
      }
    }
    
    // Ensure score stays within bounds
    coherenceScore = Math.max(1, Math.min(10, coherenceScore));
    
    // Generate suggestions based on findings
    if (weakPoints.length > 0) {
      suggestions.push("הוסף מילות קישור בין פסקאות כדי לשפר את הקוהרנטיות");
      
      if (weakPoints.length > paragraphs.length / 3) {
        suggestions.push("שקול לארגן מחדש את הפסקאות באופן לוגי יותר");
      }
    }
    
    if (coherenceScore < 4) {
      suggestions.push("הטקסט חסר קוהרנטיות משמעותית, מומלץ לבחון את המבנה הלוגי");
    } else if (coherenceScore >= 8) {
      suggestions.push("הטקסט מציג קוהרנטיות טובה בין הפסקאות");
    }
    
    return {
      isCoherent: coherenceScore >= 6,
      score: coherenceScore,
      weakPoints,
      suggestions
    };
  };
  
  /**
   * Analyzes citation density and distribution in academic text
   * @param {string} text - The text to analyze
   * @param {string} citationStyle - The citation style being used
   * @returns {Object} - Citation analysis results
   */
  export const analyzeCitationDistribution = (text, citationStyle = "APA") => {
    if (!text || text.trim().length === 0) {
      return {
        citationCount: 0,
        density: 0,
        isWellDistributed: false,
        sections: [],
        suggestions: ["אין ציטוטים לנתח"]
      };
    }
  
    // Different regex patterns for different citation styles
    const citationPatterns = {
      "APA": /\([^)]*\d{4}[^)]*\)/g,
      "MLA": /\([^)]*\d+[^)]*\)/g,
      "Chicago": /\[\d+\]/g,
      "Harvard": /\([^)]*\d{4}[^)]*\)/g,
      "IEEE": /\[\d+\]/g
    };
  
    const pattern = citationPatterns[citationStyle] || citationPatterns["APA"];
    const citations = text.match(pattern) || [];
    const citationCount = citations.length;
    
    // Split text into paragraphs
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;
    
    // Identify sections (simplified - assumes headers are short paragraphs)
    const possibleSections = paragraphs
      .map((p, i) => ({ text: p, index: i }))
      .filter(p => p.text.length < 100 && !p.text.match(pattern));
    
    // Calculate citation density
    const wordCount = text.split(/\s+/).filter(w => w.trim().length > 0).length;
    const density = wordCount > 0 ? (citationCount / wordCount) * 1000 : 0; // citations per 1000 words
    
    // Analyze distribution
    const paragraphsWithCitations = paragraphs.filter(p => pattern.test(p)).length;
    const citationDistributionRatio = paragraphCount > 0 ? paragraphsWithCitations / paragraphCount : 0;
    
    // Prepare citation analysis by section
    const sections = [];
    let currentSectionStart = 0;
    
    possibleSections.forEach((section, idx) => {
      const nextSectionStart = idx < possibleSections.length - 1 
        ? possibleSections[idx + 1].index 
        : paragraphs.length;
      
      const sectionParagraphs = paragraphs.slice(currentSectionStart, nextSectionStart);
      const sectionText = sectionParagraphs.join(" ");
      const sectionCitations = sectionText.match(pattern) || [];
      
      sections.push({
        title: section.text,
        citationCount: sectionCitations.length,
        paragraphCount: sectionParagraphs.length
      });
      
      currentSectionStart = nextSectionStart;
    });
    
    // Generate suggestions
    const suggestions = [];
    
    if (citationCount === 0) {
      suggestions.push("לא נמצאו ציטוטים במסמך. שקול להוסיף מקורות לביסוס הטענות");
    } else {
      if (density < 2) {
        suggestions.push("צפיפות הציטוטים נמוכה, שקול להוסיף יותר מקורות");
      } else if (density > 15) {
        suggestions.push("צפיפות הציטוטים גבוהה מאוד, שקול להפחית ולהתמקד במקורות עיקריים");
      }
      
      if (citationDistributionRatio < 0.3) {
        suggestions.push("הציטוטים מרוכזים במספר מצומצם של פסקאות, שקול לפזר אותם באופן רחב יותר");
      }
      
      // Check for sections with no citations
      const sectionsWithoutCitations = sections.filter(s => s.citationCount === 0 && s.paragraphCount > 2);
      if (sectionsWithoutCitations.length > 0) {
        const sectionNames = sectionsWithoutCitations.map(s => s.title).join(", ");
        suggestions.push(`החלקים הבאים חסרים ציטוטים: ${sectionNames}`);
      }
    }
    
    return {
      citationCount,
      density: Math.round(density * 10) / 10,
      isWellDistributed: citationDistributionRatio > 0.5,
      sections,
      suggestions
    };
  };
  
  // This function is not used in the main component but can be exported
  // for potential future use
  export const analyzeAcademicText = (text, documentType, citationStyle) => {
    // Comprehensive analysis of academic text
    const readability = analyzeReadabilityLevel(text);
    const coherence = analyzeTextCoherence(text);
    const citations = analyzeCitationDistribution(text, citationStyle);
    const requirements = getDocumentStructureRequirements(documentType);
    
    // Check if the document meets length requirements
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const wordCount = words.length;
    const meetsLengthRequirements = wordCount >= requirements.minWordCount && 
                                   wordCount <= requirements.maxWordCount;
    
    // Check for presence of required sections
    const missingElements = [];
    for (const section of requirements.sections) {
      const sectionPattern = new RegExp(`\\b${section}\\b`, 'i');
      if (!sectionPattern.test(text)) {
        missingElements.push(section);
      }
    }
    
    // Compile suggestions from all analyses
    const allSuggestions = [
      ...readability.suggestions,
      ...coherence.suggestions,
      ...citations.suggestions
    ];
    
    if (!meetsLengthRequirements) {
      if (wordCount < requirements.minWordCount) {
        allSuggestions.push(
          `המסמך קצר מדי (${wordCount} מילים). אורך מינימלי מומלץ: ${requirements.minWordCount} מילים`
        );
      } else {
        allSuggestions.push(
          `המסמך ארוך מדי (${wordCount} מילים). אורך מקסימלי מומלץ: ${requirements.maxWordCount} מילים`
        );
      }
    }
    
    if (missingElements.length > 0) {
      allSuggestions.push(
        `חסרים החלקים הבאים בהתאם לדרישות המסמך: ${missingElements.join(', ')}`
      );
    }
    
    // Calculate overall quality score (simplified)
    const readabilityScore = readability.score > 10 && readability.score < 20 ? 3 : 1;
    const coherenceScore = coherence.score / 2; // Convert to 0-5 scale
    const citationScore = citations.isWellDistributed ? 3 : citations.citationCount > 0 ? 1 : 0;
    const structureScore = missingElements.length === 0 ? 4 : 4 - Math.min(4, missingElements.length);
    
    const overallScore = Math.min(10, Math.round((readabilityScore + coherenceScore + citationScore + structureScore) * 10) / 10);
    
    // Determine document quality level
    let qualityLevel;
    if (overallScore >= 9) {
      qualityLevel = "מצוין";
    } else if (overallScore >= 7) {
      qualityLevel = "טוב מאוד";
    } else if (overallScore >= 5) {
      qualityLevel = "טוב";
    } else if (overallScore >= 3) {
      qualityLevel = "בינוני";
    } else {
      qualityLevel = "טעון שיפור";
    }
    
    return {
      overallScore,
      qualityLevel,
      readability,
      coherence,
      citations,
      structure: {
        missingElements,
        meetsLengthRequirements,
        requiredSections: requirements.sections
      },
      suggestions: allSuggestions
    };
  };