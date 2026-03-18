<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Grammar Checker</h1>
    
    <!-- Input Area -->
    <textarea
      v-model="text"
      class="w-full p-3 border rounded-lg mb-4"
      rows="6"
      placeholder="Type your text here..."
    ></textarea>
    
    <!-- Check Button -->
    <button 
      @click="checkGrammar"
      :disabled="loading"
      class="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
    >
      {{ loading ? 'Checking...' : 'Check Grammar' }}
    </button>
    
    <!-- Results - Just Display JSON Response -->
    <div v-if="result" class="mt-6 p-4 border rounded-lg">
      <h2 class="font-semibold mb-2">Results:</h2>
      
      <!-- Show JSON response (you can format this nicely later) -->
      <pre class="bg-gray-100 p-3 rounded text-sm">{{ JSON.stringify(result, null, 2) }}</pre>
      
      <!-- Simple error display -->
      <div v-if="result.matches && result.matches.length" class="mt-4">
        <p class="text-red-600">Found {{ result.matches.length }} issues:</p>
        <ul class="list-disc pl-5 mt-2">
          <li v-for="(match, i) in result.matches" :key="i" class="text-sm">
            {{ match.message }}
          </li>
        </ul>
      </div>
      
      <div v-else-if="result.matches && result.matches.length === 0" class="text-green-600">
        ✅ No grammar issues found!
      </div>
    </div>
  </div>
</template>

<script>
import { grammarApi } from '../services/api'  // ← IMPORT THE CONNECTION

export default {
  data() {
    return {
      text: '',
      loading: false,
      result: null
    }
  },
  methods: {
    async checkGrammar() {
      if (!this.text) return
      
      this.loading = true
      
      // 🔌 CALL BACKEND - GETS JSON RESPONSE
      const response = await grammarApi.checkText(this.text)
      
      this.result = response
      this.loading = false
    }
  }
}
</script>
