#!/usr/bin/env node

/**
 * Model Optimization Script
 * 
 * This script helps optimize GLB/GLTF models for better performance
 * 
 * Prerequisites:
 * npm install -g gltf-pipeline
 * npm install -g @gltf-transform/cli
 * 
 * Usage:
 * node scripts/optimize-models.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MODELS_DIR = path.join(__dirname, '../public/assets/models');
const OPTIMIZED_DIR = path.join(__dirname, '../public/assets/models/optimized');

// Model optimization configuration
const OPTIMIZATION_CONFIG = {
  draco: {
    compressionLevel: 7,
    quantizePositionBits: 14,
    quantizeNormalBits: 10,
    quantizeTexcoordBits: 12,
    quantizeColorBits: 8,
    quantizeGenericBits: 12,
  },
  meshopt: {
    compression: true,
    level: 'medium',
  }
};

// Ensure optimized directory exists
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

function getModelFiles() {
  if (!fs.existsSync(MODELS_DIR)) {
    console.error('Models directory not found:', MODELS_DIR);
    return [];
  }
  
  return fs.readdirSync(MODELS_DIR)
    .filter(file => file.endsWith('.glb') || file.endsWith('.gltf'))
    .map(file => path.join(MODELS_DIR, file));
}

function optimizeWithDraco(inputPath, outputPath) {
  try {
    console.log(`Optimizing ${path.basename(inputPath)} with Draco...`);
    
    const dracoOptions = [
      '-d',
      `-cl ${OPTIMIZATION_CONFIG.draco.compressionLevel}`,
      `-qp ${OPTIMIZATION_CONFIG.draco.quantizePositionBits}`,
      `-qn ${OPTIMIZATION_CONFIG.draco.quantizeNormalBits}`,
      `-qt ${OPTIMIZATION_CONFIG.draco.quantizeTexcoordBits}`,
      `-qc ${OPTIMIZATION_CONFIG.draco.quantizeColorBits}`,
      `-qg ${OPTIMIZATION_CONFIG.draco.quantizeGenericBits}`
    ].join(' ');
    
    const command = `gltf-pipeline -i "${inputPath}" -o "${outputPath}" ${dracoOptions}`;
    execSync(command, { stdio: 'inherit' });
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Draco optimization complete: ${reduction}% size reduction`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`   Optimized: ${(optimizedSize / 1024).toFixed(1)}KB`);
    
    return true;
  } catch (error) {
    console.error(`❌ Draco optimization failed for ${path.basename(inputPath)}:`, error.message);
    return false;
  }
}

function optimizeWithMeshopt(inputPath, outputPath) {
  try {
    console.log(`Optimizing ${path.basename(inputPath)} with Meshopt...`);
    
    const command = `gltf-transform meshopt "${inputPath}" "${outputPath}"`;
    execSync(command, { stdio: 'inherit' });
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Meshopt optimization complete: ${reduction}% size reduction`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`   Optimized: ${(optimizedSize / 1024).toFixed(1)}KB`);
    
    return true;
  } catch (error) {
    console.error(`❌ Meshopt optimization failed for ${path.basename(inputPath)}:`, error.message);
    return false;
  }
}

function analyzeModel(inputPath) {
  try {
    console.log(`\n📊 Analyzing ${path.basename(inputPath)}...`);
    
    // Basic file analysis
    const stats = fs.statSync(inputPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    
    console.log(`   File size: ${sizeKB}KB`);
    console.log(`   Last modified: ${stats.mtime.toLocaleDateString()}`);
    
    // Try to get model info using gltf-transform
    try {
      const infoCommand = `gltf-transform info "${inputPath}"`;
      const info = execSync(infoCommand, { encoding: 'utf8' });
      
      // Extract key metrics
      const meshCount = (info.match(/meshes:\s*(\d+)/) || [])[1];
      const vertexCount = (info.match(/vertices:\s*(\d+)/) || [])[1];
      const triangleCount = (info.match(/triangles:\s*(\d+)/) || [])[1];
      
      if (meshCount) console.log(`   Meshes: ${meshCount}`);
      if (vertexCount) console.log(`   Vertices: ${parseInt(vertexCount).toLocaleString()}`);
      if (triangleCount) console.log(`   Triangles: ${parseInt(triangleCount).toLocaleString()}`);
      
    } catch (error) {
      console.log(`   Could not extract detailed model info`);
    }
    
  } catch (error) {
    console.error(`❌ Analysis failed for ${path.basename(inputPath)}:`, error.message);
  }
}

function main() {
  console.log('🚀 Starting model optimization...\n');
  
  const modelFiles = getModelFiles();
  
  if (modelFiles.length === 0) {
    console.log('No GLB/GLTF files found in models directory');
    return;
  }
  
  console.log(`Found ${modelFiles.length} model(s) to optimize:\n`);
  
  let successCount = 0;
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const modelPath of modelFiles) {
    const fileName = path.basename(modelPath);
    const nameWithoutExt = path.basename(modelPath, path.extname(modelPath));
    
    // Analyze original model
    analyzeModel(modelPath);
    
    // Create optimized versions
    const dracoOutput = path.join(OPTIMIZED_DIR, `${nameWithoutExt}-draco.glb`);
    const meshoptOutput = path.join(OPTIMIZED_DIR, `${nameWithoutExt}-meshopt.glb`);
    
    const originalSize = fs.statSync(modelPath).size;
    totalOriginalSize += originalSize;
    
    // Try Draco optimization
    if (optimizeWithDraco(modelPath, dracoOutput)) {
      successCount++;
      totalOptimizedSize += fs.statSync(dracoOutput).size;
    }
    
    // Try Meshopt optimization
    if (optimizeWithMeshopt(modelPath, meshoptOutput)) {
      successCount++;
      totalOptimizedSize += fs.statSync(meshoptOutput).size;
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📈 Optimization Summary:');
  console.log(`   Models processed: ${modelFiles.length}`);
  console.log(`   Optimizations successful: ${successCount}`);
  
  if (totalOriginalSize > 0) {
    const totalReduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
    console.log(`   Total size reduction: ${totalReduction}%`);
    console.log(`   Original total: ${(totalOriginalSize / 1024).toFixed(1)}KB`);
    console.log(`   Optimized total: ${(totalOptimizedSize / 1024).toFixed(1)}KB`);
  }
  
  console.log(`\n✅ Optimized models saved to: ${OPTIMIZED_DIR}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Test optimized models in your application');
  console.log('   2. Replace original models with optimized versions');
  console.log('   3. Update model paths in your code');
  console.log('   4. Run performance tests to measure improvements');
}

// Check if required tools are installed
function checkDependencies() {
  try {
    execSync('gltf-pipeline --version', { stdio: 'ignore' });
    execSync('gltf-transform --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('❌ Required tools not found. Please install:');
    console.error('   npm install -g gltf-pipeline');
    console.error('   npm install -g @gltf-transform/cli');
    return false;
  }
}

if (require.main === module) {
  if (checkDependencies()) {
    main();
  }
}

module.exports = {
  optimizeWithDraco,
  optimizeWithMeshopt,
  analyzeModel
};
