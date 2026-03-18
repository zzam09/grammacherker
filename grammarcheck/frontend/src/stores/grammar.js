import { defineStore } from 'pinia'

export const useGrammarStore = defineStore('grammar', {
  state: () => ({
    checks: [],
    currentResult: null,
    isLoading: false
  }),
  
  actions: {
    async checkGrammar(text) {
      this.isLoading = true
      
      try {
        const response = await fetch('http://localhost:3001/api/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text })
        })
        
        const data = await response.json()
        this.currentResult = data
        this.checks.unshift(data)
        
        return data
      } catch (error) {
        throw new Error('Failed to check grammar')
      } finally {
        this.isLoading = false
      }
    },
    
    async loadHistory() {
      try {
        const response = await fetch('http://localhost:3001/api/history')
        const data = await response.json()
        this.checks = data.data || []
        return this.checks
      } catch (error) {
        throw new Error('Failed to load history')
      }
    },
    
    async deleteCheck(id) {
      try {
        await fetch(`http://localhost:3001/api/history/${id}`, {
          method: 'DELETE'
        })
        
        this.checks = this.checks.filter(check => check.id !== id)
        return true
      } catch (error) {
        throw new Error('Failed to delete check')
      }
    }
  }
})
