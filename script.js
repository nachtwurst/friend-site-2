const serviceUrls = ['https://jf.runez.lol', 'https://get.runez.lol', 'https://books.runez.lol', 'https://games.runez.lol', 'https://cloud.runez.lol', 'https://nachtwurst.github.io/toys/', 'https://wiki.runez.lol'];

function updateTimestamp() {
    const now = new Date();
    
    // Format time as "h:mm am/pm"
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = hours + ':' + minutes + ampm;
    
    // Format date as "Day Mon DD"
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    
    const fullTimestamp = `${timeString}, ${dayName} ${monthName} ${date}`;
    
    // Update all timestamp elements
    document.getElementById('timestamp1').textContent = fullTimestamp;

}

async function checkService(url, timeoutMs = 4000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return true;
    } catch (error) {
        clearTimeout(timeoutId);
        return false; // Could be network error, timeout, or service down
    }
}

// Update timestamp immediately and then every minute
updateTimestamp();
setInterval(updateTimestamp, 60000);

const serviceElements = document.querySelectorAll('.status-indicator');

async function checkUp(service) {
    const isUp = await checkService(service);
    console.log(`${service}: ${isUp ? 'UP' : 'DOWN'}`);
    return isUp;
}

window.addEventListener('load', async () => {
    await Promise.all(serviceUrls.map(async (service, i) => {
        const isUp = await checkUp(service);
        const statusElement = document.querySelector(`.status-indicator[id="status-indicator${i + 1}"]`);
        if (statusElement) {
            // Create colored dot
            const dot = `<span class="status-dot ${isUp ? 'dot-online' : 'dot-offline'}"></span>`;
            statusElement.innerHTML = `${isUp ? 'Online' : 'Offline'} ${dot}`;
            statusElement.className = `status-indicator ${isUp ? 'online' : 'offline'}`;
        }
    }));
});