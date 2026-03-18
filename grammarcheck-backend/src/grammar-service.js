// Grammar checking service - you can expand this later
export class GrammarService {
  static async checkText(text) {
    const words = text.split(' ')
    const sentences = text.split(/[.!?]+/).filter(s => s.length > 0)
    
    const matches = []
    
    // Basic grammar rules
    const rules = [
      {
        test: (text) => text.includes(' i '),
        message: 'Use "I" instead of "i"',
        replacements: ['I']
      },
      {
        test: (text) => text.includes('  '),
        message: 'Remove extra spaces',
        replacements: [' ']
      },
      {
        test: (text) => /\b[a-z]/.test(text) && text.length > 0,
        message: 'Sentences should start with capital letters',
        replacements: []
      }
    ]
    
    rules.forEach(rule => {
      if (rule.test(text)) {
        matches.push({
          message: rule.message,
          offset: text.indexOf(rule.message.includes('i') ? ' i ' : '  '),
          length: rule.message.includes('i') ? 1 : 2,
          replacements: rule.replacements
        })
      }
    })
    
    return {
      text: text,
      matches: matches,
      stats: {
        characters: text.length,
        words: words.length,
        sentences: sentences.length,
        errors: matches.length
      }
    }
  }
}
