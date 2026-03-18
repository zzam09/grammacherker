<template>
  <div class="flex items-center justify-center min-h-screen bg-background p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>shadcn/ui + Vue</CardTitle>
        <CardDescription>
          Successfully set up shadcn/ui components with Vue 3!
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            v-model="email"
          />
        </div>
        <div class="space-y-2">
          <label for="message" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Message
          </label>
          <Input
            id="message"
            type="text"
            placeholder="Type a message"
            v-model="message"
          />
        </div>
      </CardContent>
      <CardFooter class="flex gap-2">
        <Button @click="handleSubmit" class="flex-1">
          Submit
        </Button>
        <Button variant="outline" @click="handleClear">
          Clear
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const email = ref('')
const message = ref('')

const handleSubmit = () => {
  alert(`Email: ${email.value}\nMessage: ${message.value}`)
}

const handleClear = () => {
  email.value = ''
  message.value = ''
}
</script>
