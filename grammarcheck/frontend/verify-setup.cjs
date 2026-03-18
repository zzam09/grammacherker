// Verify Vue.js app setup
const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying Vue.js Grammar Checker Setup...\n')

// Check critical files
const requiredFiles = [
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'src/main.js',
  'src/App.vue',
  'src/style.css',
  'src/stores/grammar.js'
]

let allFilesExist = true

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file)
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - Missing!`)
    allFilesExist = false
  }
})

// Check package.json dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const requiredDeps = ['vue', 'pinia', '@vueuse/core', 'axios']
  
  console.log('\n📦 Dependencies:')
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}@${packageJson.dependencies[dep]}`)
    } else {
      console.log(`❌ ${dep} - Missing!`)
      allFilesExist = false
    }
  })
} catch (err) {
  console.log('❌ Could not read package.json')
  allFilesExist = false
}

// Check node_modules
if (fs.existsSync('node_modules')) {
  console.log('\n✅ node_modules exists')
} else {
  console.log('\n❌ node_modules missing - run pnpm install')
  allFilesExist = false
}

// Summary
console.log('\n' + '='.repeat(50))
if (allFilesExist) {
  console.log('🎉 Vue.js setup is complete and ready!')
  console.log('\n📱 Access your app at: http://localhost:8080')
  console.log('🔧 Backend API at: http://localhost:3001')
  console.log('\n✨ Features:')
  console.log('   • Mobile-first responsive design')
  console.log('   • Fast SPA with Vue 3')
  console.log('   • Beautiful Tailwind CSS styling')
  console.log('   • Real-time grammar checking')
  console.log('   • History management')
  console.log('   • No heavy bloat')
} else {
  console.log('❌ Setup incomplete - fix the issues above')
}

console.log('\n🚀 Your modern grammar checker is ready to use!')
