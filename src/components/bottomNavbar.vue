<script></script>

<template>
  <nav
    class="bg-gray-800 border-t fixed bottom-0 w-full flex justify-around items-center py-3 px-2"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <div class="flex items-center gap-10">
      <router-link to="/">
        <span class="material-iconstext-3xl">home</span>
      </router-link>
      <router-link to="/">
        <span class="material-icons text-3xl">movie</span>
      </router-link>
      <router-link to="/">
        <span class="material-icons text-3xl">send</span>
      </router-link>
      <router-link to="/">
        <span class="material-icons text-3xl">search</span>
      </router-link>
      <router-link to="/profile">
        <span class="material-icons text-3xl">account_circle</span>
      </router-link>
    </div>
  </nav>
</template>
