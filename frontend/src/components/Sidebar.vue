<template>
  <nav class="sidebar">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/students">Students</router-link></li>
      <li><router-link to="/teachers">Teachers</router-link></li>
      <li><router-link to="/units">Units</router-link></li>
    </ul>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.sidebar { width: 220px; background: #2d3748; color: #fff; min-height: 100vh; padding: 1rem; box-sizing: border-box; }
.sidebar ul { list-style: none; padding: 0; margin: 0; }
.sidebar li { margin: 0.6rem 0; }
.sidebar a { color: inherit; text-decoration: none; display: block; padding: 0.45rem 0.6rem; border-radius: 4px; }
.sidebar a:hover { background: rgba(255,255,255,0.04); }
.router-link-active { font-weight: 700; }
</style>
