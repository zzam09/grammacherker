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
        <Card>
          <CardHeader>
            <CardTitle>Enter your text to check</CardTitle>
            <CardDescription>
              Paste or type your text below to analyze grammar and spelling
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <textarea
              v-model="inputText"
              :disabled="isLoading"
              placeholder="Type or paste your text here..."
              class="w-full min-h-[200px] resize-none p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">
                {{ inputText.length }} characters
              </span>
              <Button 
                @click="checkGrammar" 
                :disabled="!inputText.trim() || isLoading"
                class="min-w-[120px]"
              >
                <span v-if="!isLoading">Check Grammar</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Results Section -->
        <Card v-if="result || error">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <!-- Error State -->
            <div v-if="error" class="text-destructive p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p class="font-medium">Error</p>
              <p class="text-sm">{{ error }}</p>
            </div>
            
            <!-- Success State -->
            <div v-else-if="result" class="space-y-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm font-medium">Analysis Complete</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center p-4 bg-muted rounded-lg">
                  <div class="text-2xl font-bold text-foreground">{{ result.score || 95 }}</div>
                  <div class="text-sm text-muted-foreground">Grammar Score</div>
                </div>
                <div class="text-center p-4 bg-muted rounded-lg">
                  <div class="text-2xl font-bold text-foreground">{{ result.errors?.length || 0 }}</div>
                  <div class="text-sm text-muted-foreground">Errors Found</div>
                </div>
                <div class="text-center p-4 bg-muted rounded-lg">
                  <div class="text-2xl font-bold text-foreground">{{ result.suggestions?.length || 3 }}</div>
                  <div class="text-sm text-muted-foreground">Suggestions</div>
                </div>
              </div>

              <!-- Suggestions -->
              <div v-if="result.suggestions && result.suggestions.length > 0" class="space-y-2">
                <h4 class="font-medium text-foreground">Suggestions</h4>
                <div class="space-y-2">
                  <div v-for="(suggestion, index) in result.suggestions" :key="index" class="p-3 bg-muted rounded-lg">
                    <p class="text-sm text-foreground">{{ suggestion }}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- History Tab -->
      <div v-else-if="activeTab === 'history'" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Check History</CardTitle>
            <CardDescription>
              Your recent grammar checks and their results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="history.length === 0" class="text-center py-8">
              <p class="text-muted-foreground">No history yet. Start checking your grammar!</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="(item, index) in history" :key="index" class="p-4 border rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-sm font-medium text-foreground">
                    {{ new Date(item.timestamp).toLocaleDateString() }}
                  </span>
                  <span class="text-sm text-muted-foreground">
                    Score: {{ item.score || 95 }}%
                  </span>
                </div>
                <p class="text-sm text-muted-foreground line-clamp-2">
                  {{ item.text }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useGrammarStore } from './stores/grammar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    // Simulate API call for demo
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    result.value = {
      score: 95,
      errors: [],
      suggestions: [
        'Consider adding more detail to your text',
        'Your writing is clear and concise',
        'No major grammatical issues found'
      ]
    }
    
    // Add to history
    history.value.unshift({
      text: inputText.value,
      score: result.value.score,
      timestamp: new Date().toISOString()
    })
    
    showToast('Grammar check completed successfully!', 'success')
  } catch (err) {
    error.value = 'Failed to check grammar. Please try again.'
    showToast('Error checking grammar', 'error')
  } finally {
    isLoading.value = false
  }
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
  // Load any saved history
  const savedHistory = localStorage.getItem('grammarHistory')
  if (savedHistory) {
    history.value = JSON.parse(savedHistory)
  }
})

// Save history to localStorage whenever it changes
const saveHistory = () => {
  localStorage.setItem('grammarHistory', JSON.stringify(history.value))
}

watch(history, saveHistory, { deep: true })
</script>
