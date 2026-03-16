<script>
</script>

<!-- <template>
    <nav class="bg-emerald-600 text-white p-4 flex justify-between items-center shadow-md">
        <div class="flex-1">
           <router-link to="/">
                <span class="material-icons">add</span>
            </router-link>
        </div>

        <div class="flex-1 text-center">
            <h1 class="text-white font-bold text-lg">
                Knowledge
            </h1>
        </div>

        <div class="flex-1">
           <router-link to="/">
                <span class="material-icons">notifications_unread</span>
            </router-link>
        </div>
    </nav>
</template> -->

<template>
    <nav class="navbar">
        <div class="nav-action" title="Create Post">
            <router-link to="/create" class="icon-btn" >
                <span class="material-icons">add</span>
            </router-link>
        </div>

        <div class="nav-title">
            <h1>Knowledge</h1>
        </div>

        <div class="nav-action nav-action--right">
            <router-link to="/" class="icon-btn notif-btn" title="Notifications">
                <span class="material-icons">notifications</span>
                <span class="notif-dot"></span>
            </router-link>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    background-color: #059669;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    height: 56px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-title h1 {
    color: white;
    font-weight: 700;
    font-size: 25px;
    letter-spacing: 0.3px;
    margin: 0;
}

.nav-action {
    flex: 1;
    display: flex;
    align-items: center;
}

.nav-action--right {
    justify-content: flex-end;
}

.icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    color: white;
    text-decoration: none;
    transition: background-color 0.15s ease, transform 0.1s ease;
    position: relative;
}

.icon-btn:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.icon-btn:active {
    transform: scale(0.92);
    background-color: rgba(255, 255, 255, 0.25);
}

.notif-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 8px;
    height: 8px;
    background-color: #fbbf24;
    border-radius: 50%;
    border: 2px solid #059669;
}
</style>