<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-foreground">GrammarCheck</h1>
          </div>
          <nav class="hidden md:flex space-x-8">
            <Button 
              @click="activeTab = 'check'" 
              :variant="activeTab === 'check' ? 'default' : 'ghost'"
            >
              Check
            </Button>
            <Button 
              @click="activeTab = 'history'" 
              :variant="activeTab === 'history' ? 'default' : 'ghost'"
            >
              History
            </Button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Grammar Checker Tab -->
      <div v-if="activeTab === 'check'" class="space-y-6">
        <!-- Input Section -->
        <div class="card">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Enter your text to check
            </label>
            <div class="relative">
              <textarea
                v-model="inputText"
                :disabled="isLoading"
                placeholder="Type or paste your text here..."
                class="input-field min-h-[200px] resize-none"
                maxlength="10000"
              />
              <div class="absolute bottom-3 right-3 text-sm text-gray-500">
                {{ inputText.length.toLocaleString() }} / 10,000
              </div>
            </div>
          </div>
          
          <button
            @click="checkGrammar"
            :disabled="isLoading || !inputText.trim()"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </span>
            <span v-else>Check Grammar →</span>
          </button>
        </div>

        <!-- Results Section -->
        <div v-if="result" class="card space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Results</h3>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">Score:</span>
              <span :class="getScoreClass(result.score)" class="text-2xl font-bold">
                {{ result.score }}/100
              </span>
            </div>
          </div>

          <!-- Issues -->
          <div v-if="result.issues && result.issues.length > 0" class="space-y-3">
            <div 
              v-for="(issue, index) in result.issues" 
              :key="index"
              class="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="font-medium text-yellow-800">{{ issue.message }}</p>
                  <p class="text-sm text-yellow-600 mt-1">
                    "{{ getIssueText(issue) }}"
                  </p>
                </div>
                <button
                  @click="applySuggestion(issue, index)"
                  class="ml-4 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm rounded-md transition-colors"
                >
                  Apply Fix
                </button>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-else class="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
            <p class="font-medium text-green-800">✅ Great! No grammar issues found.</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="card border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
          <p class="font-medium text-red-800">{{ error }}</p>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="space-y-6">
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Check History</h3>
          
          <div v-if="history.length === 0" class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No grammar checks yet</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="item in history" 
              :key="item.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="loadHistoryItem(item)"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="text-gray-900 font-medium truncate">{{ item.original_text }}</p>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ formatDate(item.created_at) }} • {{ item.issues.length }} issues • Score: {{ item.score }}/100
                  </p>
                </div>
                <button
                  @click.stop="deleteHistoryItem(item.id)"
                  class="ml-4 text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Container -->
    <div id="toast-container" class="fixed bottom-4 right-4 z-50 space-y-2"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGrammarStore } from './stores/grammar'

const grammarStore = useGrammarStore()

const activeTab = ref('check')
const inputText = ref('')
const isLoading = ref(false)
const result = ref(null)
const error = ref('')
const history = ref([])

const checkGrammar = async () => {
  if (!inputText.value.trim()) return
  
  isLoading.value = true
  error.value = ''
  result.value = null
  
  try {
    const response = await fetch('http://localhost:3001/api/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText.value
      })
    })
    
    if (!response.ok) {
      throw new Error('Server error occurred')
    }
    
    const data = await response.json()
    result.value = data
    showToast('Grammar check completed!', 'success')
    
    // Refresh history
    loadHistory()
  } catch (err) {
    error.value = 'Failed to check grammar. Please try again.'
    showToast('Error checking grammar', 'error')
  } finally {
    isLoading.value = false
  }
}

const loadHistory = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/history')
    const data = await response.json()
    history.value = data.data || []
  } catch (err) {
    console.error('Failed to load history:', err)
  }
}

const loadHistoryItem = (item) => {
  inputText.value = item.original_text
  result.value = item
  activeTab.value = 'check'
}

const deleteHistoryItem = async (id) => {
  try {
    await fetch(`http://localhost:3001/api/history/${id}`, {
      method: 'DELETE'
    })
    await loadHistory()
    showToast('Item deleted', 'success')
  } catch (err) {
    showToast('Failed to delete item', 'error')
  }
}

const applySuggestion = (issue, index) => {
  const original = inputText.value
  const before = original.slice(0, issue.offset)
  const after = original.slice(issue.offset + issue.length)
  const suggestion = issue.suggestion || ''
  
  inputText.value = before + suggestion + after
  showToast('Suggestion applied!', 'success')
}

const getIssueText = (issue) => {
  return inputText.value.slice(issue.offset, issue.offset + issue.length)
}

const getScoreClass = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const showToast = (message, type = 'info') => {
  const toast = document.createElement('div')
  toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0')
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

onMounted(() => {
  loadHistory()
})
</script>
